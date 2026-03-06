from typing import Literal

from pydantic import BaseModel, EmailStr, Field

Protocol = Literal["tcp", "inproc", "ipc", "ws", "wss"]


class RouterClientKwargs(BaseModel):
    protocol: Protocol = Field(default="tcp")
    interface: str = Field(default="localhost")
    rpc_port: str = Field(default="5555")
    broadcast_port: str = Field(default="5556")


class BrainslosherWebUiConfig(BaseModel):
    router_client_kwargs: RouterClientKwargs = Field(default_factory=RouterClientKwargs)
    port: int = Field(default=8000)
    job_folder: str = Field(default="../../brain_slosher_jobs/")
    data_channels: list[str] = Field(default_factory=list)
    gets: dict[str, str] = Field(default_factory=dict)
    posts: dict[str, str] = Field(default_factory=dict)
    suggested_emails: list[EmailStr] = (Field(default=[]),)
