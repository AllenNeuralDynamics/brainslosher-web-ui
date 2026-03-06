import asyncio
import json
import logging
from typing import Any

import zmq.asyncio
from aiortc import RTCDataChannel, RTCPeerConnection, RTCSessionDescription
from fastapi import Request
from one_liner.client import RouterClient

logger = logging.getLogger(__name__)

stop_event: asyncio.Event = asyncio.Event()
tasks: list[asyncio.Task[Any]] = []


def cancel_tasks() -> None:
    for task in tasks:
        task.cancel()
    tasks.clear()


def get_stream_poller(client: RouterClient, stream_name: str) -> zmq.asyncio.Poller:
    if stream_name not in client.stream_client.sub_sockets:
        client.configure_stream(stream_name, storage_type="cache")
    socket = client.stream_client.sub_sockets[stream_name]
    poller = zmq.asyncio.Poller()
    poller.register(socket, zmq.POLLIN)
    return poller


async def stream_to_channel(client: RouterClient, channel: RTCDataChannel) -> None:
    poller = get_stream_poller(client, channel.label)
    while not stop_event.is_set():
        if dict(await poller.poll(timeout=1000)):
            _, msg = client.get_stream(channel.label)
            channel.send(json.dumps(msg))


async def handle_offer(client: RouterClient, request: Request) -> dict[str, str]:
    cancel_tasks()
    params = await request.json()
    pc = RTCPeerConnection()
    await pc.setRemoteDescription(RTCSessionDescription(**params))

    @pc.on("connectionstatechange")
    async def on_connectionstatechange() -> None:
        logger.info(f"Peer connection state: {pc.connectionState}")
        if pc.connectionState == "failed":
            await pc.close()

    @pc.on("datachannel")
    async def on_datachannel(channel: RTCDataChannel) -> None:
        tasks.append(asyncio.create_task(stream_to_channel(client, channel)))

    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    return {"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}
