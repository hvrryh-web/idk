import math
from io import BytesIO
from typing import Optional

import httpx
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from PIL import Image, ImageEnhance, UnidentifiedImageError
from pydantic import BaseModel, HttpUrl, conint, confloat

router = APIRouter(prefix="/ascii", tags=["ascii"])

CHARACTER_SET = "@%#*+=-:. "
CHARACTER_ASPECT_RATIO = 0.55


class AsciiMetadata(BaseModel):
    width: int
    height: int
    original_width: int
    original_height: int
    character_set: str
    contrast: float
    resolution: int
    source_type: str


class AsciiRenderResponse(BaseModel):
    ascii_art: str
    metadata: AsciiMetadata


async def _load_image(file: Optional[UploadFile], image_url: Optional[HttpUrl]) -> tuple[Image.Image, str]:
    if file:
        contents = await file.read()
        if not contents:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty"
            )
        data = BytesIO(contents)
        source_type = "upload"
    elif image_url:
        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                response = await client.get(str(image_url))
            response.raise_for_status()
        except httpx.HTTPError as exc:  # pragma: no cover - network errors
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to fetch image from URL: {exc}",
            ) from exc
        data = BytesIO(response.content)
        source_type = "url"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide either an image file or an image_url",
        )

    try:
        image = Image.open(data)
        image.load()
        return image, source_type
    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provided content is not a valid image",
        ) from exc


def _compute_dimensions(image: Image.Image, resolution: int) -> tuple[int, int]:
    aspect_ratio = image.height / image.width if image.width else 1
    height = max(1, int(math.ceil(aspect_ratio * resolution * CHARACTER_ASPECT_RATIO)))
    return resolution, height


def _apply_contrast(image: Image.Image, contrast: float) -> Image.Image:
    if contrast == 1.0:
        return image
    enhancer = ImageEnhance.Contrast(image)
    return enhancer.enhance(contrast)


def _image_to_ascii(image: Image.Image, width: int, height: int) -> str:
    grayscale = image.convert("L").resize((width, height))
    pixels = grayscale.getdata()
    scale = len(CHARACTER_SET) - 1

    lines = []
    for row in range(height):
        start = row * width
        end = start + width
        line = "".join(CHARACTER_SET[pixel * scale // 255] for pixel in pixels[start:end])
        lines.append(line)
    return "\n".join(lines)


@router.post("/render", response_model=AsciiRenderResponse)
async def render_ascii_image(
    file: Optional[UploadFile] = File(None, description="Image file to convert"),
    image_url: Optional[HttpUrl] = Form(None, description="Remote image URL"),
    resolution: conint(ge=16, le=400) = Form(
        120, description="Target character width for the ASCII art"
    ),
    contrast: confloat(gt=0.1, le=5.0) = Form(
        1.0, description="Contrast multiplier applied before conversion"
    ),
) -> AsciiRenderResponse:
    image, source_type = await _load_image(file, image_url)
    adjusted = _apply_contrast(image, float(contrast))
    width, height = _compute_dimensions(adjusted, int(resolution))

    ascii_art = _image_to_ascii(adjusted, width, height)

    metadata = AsciiMetadata(
        width=width,
        height=height,
        original_width=image.width,
        original_height=image.height,
        character_set=CHARACTER_SET,
        contrast=float(contrast),
        resolution=int(resolution),
        source_type=source_type,
    )
    return AsciiRenderResponse(ascii_art=ascii_art, metadata=metadata)
