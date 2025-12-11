import hashlib
import logging
from io import BytesIO
from typing import Dict

from fastapi import HTTPException, status
from PIL import Image

logger = logging.getLogger(__name__)

CHARSETS = {
    "dense": "@%#*+=-:. ",
    "sparse": "@#S%?*+;:,. ",
}

ALLOWED_MIME_TYPES = {
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
}

MAX_UPLOAD_SIZE = 5 * 1024 * 1024  # 5 MB
DEFAULT_WIDTH = 80
DEFAULT_THRESHOLD = 48

_CACHE: Dict[str, str] = {}


def _brightness_to_char(brightness: int, charset: str, threshold: int) -> str:
    if brightness < threshold:
        return " "

    chars = CHARSETS.get(charset, CHARSETS["dense"])
    scale = len(chars) - 1
    ratio = (brightness - threshold) / max(1, 255 - threshold)
    index = min(scale, int(ratio * scale))
    return chars[index]


def _resize_image(image: Image.Image, width: int) -> Image.Image:
    aspect_ratio = image.height / max(image.width, 1)
    # Height multiplier tightens vertical spacing for monospace glyphs
    height = max(1, int(aspect_ratio * width * 0.55))
    return image.resize((width, height))


def _cache_key(blob: bytes, charset: str, threshold: int, width: int, colorize: bool) -> str:
    digest = hashlib.sha256(blob).hexdigest()
    return f"{digest}:{charset}:{threshold}:{width}:{int(colorize)}"


def convert_image_to_ascii(
    image_bytes: bytes,
    *,
    charset: str = "dense",
    brightness_threshold: int = DEFAULT_THRESHOLD,
    width: int = DEFAULT_WIDTH,
    colorize: bool = False,
) -> str:
    if charset not in CHARSETS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported character set '{charset}'. Use one of: {', '.join(CHARSETS.keys())}",
        )

    if not (0 <= brightness_threshold <= 255):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Brightness threshold must be between 0 and 255",
        )

    if width < 8 or width > 320:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Width must be between 8 and 320 characters",
        )

    try:
        with Image.open(BytesIO(image_bytes)) as image:
            image = image.convert("RGB")
            resized = _resize_image(image, width)
            pixels = resized.load()

            lines = []
            reset_code = "\u001b[0m" if colorize else ""
            for y in range(resized.height):
                row_chars = []
                for x in range(resized.width):
                    r, g, b = pixels[x, y]
                    brightness = int(0.299 * r + 0.587 * g + 0.114 * b)
                    glyph = _brightness_to_char(brightness, charset, brightness_threshold)

                    if colorize and glyph.strip():
                        row_chars.append(f"\u001b[38;2;{r};{g};{b}m{glyph}{reset_code}")
                    else:
                        row_chars.append(glyph)
                lines.append("".join(row_chars))

            return "\n".join(lines)
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover - defensive logging
        logger.exception("Failed to convert image to ASCII: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to process the provided image",
        )


def render_ascii_with_cache(
    image_bytes: bytes,
    *,
    charset: str,
    brightness_threshold: int,
    width: int,
    colorize: bool,
) -> tuple[str, bool]:
    key = _cache_key(image_bytes, charset, brightness_threshold, width, colorize)
    if key in _CACHE:
        return _CACHE[key], True

    ascii_art = convert_image_to_ascii(
        image_bytes,
        charset=charset,
        brightness_threshold=brightness_threshold,
        width=width,
        colorize=colorize,
    )
    _CACHE[key] = ascii_art
    return ascii_art, False


def validate_upload(file_bytes: bytes, content_type: str) -> None:
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported MIME type '{content_type}'. Allowed types: {', '.join(sorted(ALLOWED_MIME_TYPES))}",
        )

    if len(file_bytes) > MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Image exceeds maximum size of 5 MB",
        )


def log_conversion(duration_ms: float, cached: bool, filename: str | None) -> None:
    logger.info(
        "ASCII conversion %s in %.2f ms for %s",
        "served from cache" if cached else "completed",
        duration_ms,
        filename or "uploaded image",
    )

