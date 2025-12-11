"""API routes for ASCII art generation and management."""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.ascii_artifact import ASCIIArtifact
from app.services.ascii_converter import ASCIIConverter, ASCIIStyle

router = APIRouter(prefix="/ascii", tags=["ascii-art"])

# Initialize converter
converter = ASCIIConverter()


class ASCIIConversionRequest(BaseModel):
    """Request model for ASCII conversion."""

    style: str = "retro_terminal"
    width: Optional[int] = None
    height: Optional[int] = None


class ASCIIConversionResponse(BaseModel):
    """Response model for ASCII conversion."""

    id: UUID
    ascii_art: str
    width: int
    height: int
    style: str
    preset_name: str
    content_hash: str
    use_color: bool


class ASCIIPresetResponse(BaseModel):
    """Response model for preset information."""

    name: str
    description: str
    use_color: bool


@router.post("/convert", response_model=ASCIIConversionResponse)
async def convert_image_to_ascii(
    file: UploadFile = File(...),
    style: str = "retro_terminal",
    width: Optional[int] = None,
    height: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """
    Convert an uploaded image to ASCII art.

    Args:
        file: Image file to convert
        style: ASCII style preset (cyberpunk, wuxia, retro_terminal)
        width: Target width in characters (optional)
        height: Target height in characters (optional)
        db: Database session

    Returns:
        ASCII art with metadata
    """
    # Validate style
    try:
        ascii_style = ASCIIStyle(style)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid style. Must be one of: {[s.value for s in ASCIIStyle]}",
        ) from e

    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (JPEG, PNG, etc.)")

    # Read image data
    try:
        image_data = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read image: {str(e)}") from e

    # Convert to ASCII
    try:
        result = converter.convert_image(image_data, ascii_style, width, height)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to convert image: {str(e)}") from e

    # Check if already cached
    existing = (
        db.query(ASCIIArtifact)
        .filter(ASCIIArtifact.content_hash == result["content_hash"])
        .filter(ASCIIArtifact.style == style)
        .first()
    )

    if existing:
        return ASCIIConversionResponse(
            id=existing.id,
            ascii_art=existing.ascii_art,
            width=existing.width,
            height=existing.height,
            style=existing.style,
            preset_name=existing.preset_name,
            content_hash=existing.content_hash,
            use_color=existing.use_color == "true",
        )

    # Save to database
    artifact = ASCIIArtifact(
        content_hash=result["content_hash"],
        ascii_art=result["ascii_art"],
        width=result["width"],
        height=result["height"],
        style=result["style"],
        preset_name=result["preset_name"],
        use_color="true" if result["use_color"] else "false",
    )

    db.add(artifact)
    db.commit()
    db.refresh(artifact)

    return ASCIIConversionResponse(
        id=artifact.id,
        ascii_art=artifact.ascii_art,
        width=artifact.width,
        height=artifact.height,
        style=artifact.style,
        preset_name=artifact.preset_name,
        content_hash=artifact.content_hash,
        use_color=artifact.use_color == "true",
    )


@router.get("/presets")
async def get_presets():
    """
    Get all available ASCII style presets.

    Returns:
        Dictionary of available presets with their configurations
    """
    return converter.get_available_presets()


@router.get("/{artifact_id}", response_model=ASCIIConversionResponse)
async def get_ascii_artifact(artifact_id: UUID, db: Session = Depends(get_db)):
    """
    Retrieve a previously generated ASCII art artifact.

    Args:
        artifact_id: UUID of the artifact
        db: Database session

    Returns:
        ASCII art with metadata
    """
    artifact = db.query(ASCIIArtifact).filter(ASCIIArtifact.id == artifact_id).first()

    if not artifact:
        raise HTTPException(status_code=404, detail="ASCII artifact not found")

    return ASCIIConversionResponse(
        id=artifact.id,
        ascii_art=artifact.ascii_art,
        width=artifact.width,
        height=artifact.height,
        style=artifact.style,
        preset_name=artifact.preset_name,
        content_hash=artifact.content_hash,
        use_color=artifact.use_color == "true",
    )


@router.get("/")
async def list_ascii_artifacts(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """
    List recently generated ASCII art artifacts.

    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        db: Database session

    Returns:
        List of ASCII artifacts (without full art content)
    """
    artifacts = (
        db.query(ASCIIArtifact)
        .order_by(ASCIIArtifact.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [
        {
            "id": artifact.id,
            "width": artifact.width,
            "height": artifact.height,
            "style": artifact.style,
            "preset_name": artifact.preset_name,
            "content_hash": artifact.content_hash,
            "created_at": artifact.created_at,
        }
        for artifact in artifacts
    ]
