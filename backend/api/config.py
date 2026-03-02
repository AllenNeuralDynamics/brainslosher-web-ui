from fastapi import APIRouter
from pathlib import Path
import json
import logging

BASE_DIR = Path(__file__).resolve().parent.parent
UI_CONFIG_PATH = BASE_DIR / "dev" / "web_ui_config.json"

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/ui_config")
def get_config():
    # TODO: Grab config from somewhere else
    logger.debug("Grabbing config.")
    config_text = UI_CONFIG_PATH.read_text()
    return json.loads(config_text)