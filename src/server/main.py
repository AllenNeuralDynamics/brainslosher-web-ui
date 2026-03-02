import asyncio
import json
import logging
from pathlib import Path
from typing import Any, Dict, Optional, List

import zmq
import zmq.asyncio
from fastapi import FastAPI, APIRouter, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from aiortc import RTCPeerConnection, RTCSessionDescription, RTCDataChannel
from contextlib import asynccontextmanager
from one_liner.client import RouterClient
from brainslosher_web_ui_config_model import BrainslosherWebUiConfig
import argparse

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

stop_event: asyncio.Event = asyncio.Event()    # event to discontinue polling
tasks: List[asyncio.Task[Any]] = []           # async tasks running during app lifetime

def cancel_tasks(tasks: List[asyncio.Task[Any]]) -> None:
    for task in tasks:
        task.cancel()

@asynccontextmanager
async def lifespan(app: FastAPI) -> Any:
    """Lifespan context: clean up tasks on shutdown"""
    yield
    stop_event.set()
    cancel_tasks(tasks)


def create_app(config: BrainslosherWebUiConfig) -> FastAPI:
    """Create FastAPI app with config"""

    app = FastAPI(lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    router_client: RouterClient = RouterClient(**config.router_client_kwargs.model_dump())

    def configure_stream_polling(stream_name: str) -> zmq.asyncio.Poller:
        """Add stream to client and configure poller for stream"""
        if stream_name not in router_client.stream_client.sub_sockets:
            router_client.configure_stream(stream_name, storage_type="cache")
        socket = router_client.stream_client.sub_sockets[stream_name]
        poller = zmq.asyncio.Poller()
        poller.register(socket, zmq.POLLIN)
        return poller

    async def propagate_data_channel(channel: RTCDataChannel) -> None:
        """Propagate messages from client through data channel"""
        poller = configure_stream_polling(channel.label)
        while not stop_event.is_set():
            if dict(await poller.poll(timeout=1000)):
                timestamp, msg = router_client.get_stream(channel.label)
                channel.send(json.dumps(msg))

    router = APIRouter(prefix="/api")   

    # webrtc offer endpoint
    @router.post("/offer")
    async def offer(request: Request) -> Dict[str, str]:
        cancel_tasks(tasks)
        tasks.clear()

        params = await request.json()
        offer_sdp = RTCSessionDescription(sdp=params["sdp"], type=params["type"])
        pc = RTCPeerConnection()
        await pc.setRemoteDescription(offer_sdp)

        @pc.on("connectionstatechange")
        async def on_connectionstatechange() -> None:
            logging.info(f"Peer connection state change: {pc.connectionState}")
            if pc.connectionState == "failed":
                await pc.close()

        @pc.on("datachannel")
        async def on_datachannel(channel: RTCDataChannel) -> None:
            tasks.append(asyncio.create_task(propagate_data_channel(channel)))

        answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)

        return {"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}

    # ui config endpoint
    @router.get("/ui_config")
    async def get_config() -> Dict[str, Any]:
        return config.dict()

    # Factory function for POST endpoints
    def make_post_endpoint(call_name: str) -> Any:
        async def endpoint(element_id: Optional[str] = None, kwargs: Optional[Dict[str, Any]] = None) -> Any:
            call_name_formatted = call_name.format(element_id=element_id)
            try:
                router_client.call_by_name(call_name_formatted, kwargs=kwargs)
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
        return endpoint

    # Factory function for GET endpoints
    def make_get_endpoint(call_name: str) -> Any:
        async def endpoint(request: Request, element_id: Optional[str] = None) -> Any:
            call_name_formatted = call_name.format(element_id=element_id)
            kwargs: Dict[str, Any] = dict(request.query_params)
            try:
                return router_client.call_by_name(call_name_formatted, kwargs=kwargs)
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
        return endpoint

    for path, call_name in config.posts.items():
        router.add_api_route(path, make_post_endpoint(call_name), methods=["POST"])

    for path, call_name in config.gets.items():
        router.add_api_route(path, make_get_endpoint(call_name), methods=["GET"])

    app.include_router(router)
    return app


if __name__ == "__main__":
    import uvicorn

    parser = argparse.ArgumentParser()
    parser.add_argument("--config", type=str, required=True)
    parser.add_argument("--log-level", type=str, default="INFO", choices=["INFO", "DEBUG"])
    parser.add_argument("--static-files", type=str, default="../frontend/dist")
    parser.add_argument("--dev", action="store_true", default=False)

    args = parser.parse_args()

    logging.getLogger().setLevel(args.log_level.upper())

    with open(args.config) as f:
        config: BrainslosherWebUiConfig = BrainslosherWebUiConfig(**json.load(f))

    app = create_app(config)

    if not args.dev:
        from fastapi.staticfiles import StaticFiles
        from fastapi.responses import FileResponse

        ui_dir = Path(args.static_files)
        app.mount("/assets", StaticFiles(directory=ui_dir / "assets"), name="assets")

        @app.get("/{full_path:path}")
        async def serve_frontend(full_path: str) -> FileResponse:
            return FileResponse(ui_dir / "index.html")
        
    uvicorn.run(app, port=config.port, log_level=args.log_level.lower())