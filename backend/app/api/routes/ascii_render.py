import logging
import time
from typing import Any

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.core.ascii_renderer import (
    DEFAULT_THRESHOLD,
    DEFAULT_WIDTH,
    MAX_UPLOAD_SIZE,
    log_conversion,
    render_ascii_with_cache,
    validate_upload,
)

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/render/ascii")
async def render_ascii(
    file: UploadFile = File(...),
    charset: str = Form("dense"),
    brightness_threshold: int = Form(DEFAULT_THRESHOLD),
    width: int = Form(DEFAULT_WIDTH),
    color: bool = Form(False),
) -> dict[str, Any]:
    start = time.perf_counter()
    try:
        blob = await file.read(MAX_UPLOAD_SIZE + 1)
        validate_upload(blob, file.content_type or "")

        ascii_art, cached = render_ascii_with_cache(
            blob,
            charset=charset,
            brightness_threshold=brightness_threshold,
            width=width,
            colorize=color,
        )
        duration_ms = (time.perf_counter() - start) * 1000
        log_conversion(duration_ms, cached, file.filename)
        return {
            "ascii": ascii_art,
            "cached": cached,
            "duration_ms": duration_ms,
            "charset": charset,
            "brightness_threshold": brightness_threshold,
            "width": width,
            "colorized": color,
        }
    except HTTPException as exc:
        logger.warning(
            "ASCII conversion failed for %s: %s", file.filename or "upload", exc.detail
        )
        raise
    except Exception as exc:  # pragma: no cover - defensive logging
        logger.exception("Unexpected ASCII conversion failure: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unexpected error during ASCII conversion",
        )

