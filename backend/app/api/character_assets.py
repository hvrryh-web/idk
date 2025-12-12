"""Character asset generation API endpoints.

This module provides REST endpoints for generating character assets using ComfyUI.
Currently operates in stub mode until ComfyUI integration is fully implemented.
"""

import logging
import os
import re
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, validator

from app.core.config import settings
from app.utils.path_safety import safe_join, sanitize_filename

logger = logging.getLogger(__name__)

router = APIRouter()

# Allowed style values (allowlist)
ALLOWED_STYLES = {
    "yuto-sano",
    "chinese-period",
    "manhwa-basic",
    "ink-wash",
    "semi-realistic",
}


class AssetRequest(BaseModel):
    """Request model for single character asset generation."""

    character_name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Character name (alphanumeric, spaces, hyphens allowed)",
    )
    style: Optional[str] = Field(
        default="yuto-sano",
        description="Art style for generation",
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Custom prompt for character",
    )

    @validator("character_name")
    def validate_character_name(cls, v):
        """Validate character name contains only safe characters."""
        if not re.match(r"^[\w\s-]+$", v):
            raise ValueError(
                "Character name can only contain letters, numbers, spaces, and hyphens"
            )
        return v

    @validator("style")
    def validate_style(cls, v):
        """Validate style is in the allowlist."""
        if v and v not in ALLOWED_STYLES:
            raise ValueError(f"Style must be one of: {', '.join(sorted(ALLOWED_STYLES))}")
        return v


class MultiVariantRequest(BaseModel):
    """Request model for generating multiple character variants."""

    character_name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Character name (alphanumeric, spaces, hyphens allowed)",
    )
    variants: List[str] = Field(
        default=["yuto-sano"],
        max_items=10,
        description="List of style variants to generate",
    )
    descriptions: Optional[List[str]] = Field(
        default=None,
        max_items=10,
        description="Custom prompts per variant",
    )

    @validator("character_name")
    def validate_character_name(cls, v):
        """Validate character name contains only safe characters."""
        if not re.match(r"^[\w\s-]+$", v):
            raise ValueError(
                "Character name can only contain letters, numbers, spaces, and hyphens"
            )
        return v

    @validator("variants", each_item=True)
    def validate_variant(cls, v):
        """Validate each variant is in the allowlist."""
        if v not in ALLOWED_STYLES:
            raise ValueError(f"Variant must be one of: {', '.join(sorted(ALLOWED_STYLES))}")
        return v

    @validator("descriptions")
    def validate_descriptions(cls, v, values):
        """Validate descriptions don't exceed variants count."""
        if v and "variants" in values and len(v) > len(values["variants"]):
            raise ValueError("descriptions count cannot exceed variants count")
        return v


class AssetResponse(BaseModel):
    """Response model for asset generation."""

    status: str
    url: str
    character: str
    style: Optional[str] = None
    variant: Optional[str] = None
    message: Optional[str] = None


class ErrorResponse(BaseModel):
    """Standardized error response."""

    error: dict = Field(
        ...,
        description="Error details with code, message, and optional details",
    )


def get_asset_directory() -> str:
    """Get the base asset directory, creating it if needed."""
    base_dir = os.path.join("..", "frontend", "public", "assets", "characters")
    os.makedirs(base_dir, exist_ok=True)
    return os.path.realpath(base_dir)


def generate_safe_filename(character_name: str, style: str) -> str:
    """Generate a safe filename from character name and style."""
    base_name = character_name.lower().replace(" ", "-")
    filename = f"{base_name}-{style}.jpg"
    return sanitize_filename(filename)


@router.post(
    "/generate-character-variants",
    response_model=dict,
    responses={
        400: {"model": ErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Generation error"},
    },
)
def generate_character_variants(req: MultiVariantRequest):
    """
    Generate multiple character asset variants.

    Creates placeholder assets for each specified variant. In production with
    ComfyUI enabled, this will submit workflows to ComfyUI for actual generation.
    """
    logger.info(
        f"Generating {len(req.variants)} variants for character={req.character_name}"
    )

    asset_dir = get_asset_directory()
    results = []

    for i, variant in enumerate(req.variants):
        try:
            # Generate safe filename
            filename = generate_safe_filename(req.character_name, variant)

            # Use safe_join to prevent path traversal
            output_path = safe_join(asset_dir, filename)

            # Compose prompt
            if req.descriptions and i < len(req.descriptions):
                prompt = req.descriptions[i]
            else:
                prompt = (
                    f"Romance of the Three Kingdoms, {req.character_name}, "
                    f"{variant} style, ink-wash, semi-realistic, portrait, "
                    "dynasty armor, painterly rim light, LUT, bloom, vignette, grain overlay"
                )

            # Check if ComfyUI is enabled
            if settings.COMFYUI_ENABLED:
                # TODO: Implement actual ComfyUI API call
                # This would submit workflow to ComfyUI and poll for completion
                logger.info(f"ComfyUI enabled but not yet implemented for {filename}")
                status = "pending"
                message = "ComfyUI integration pending implementation"
            else:
                # Stub mode: create placeholder file
                with open(output_path, "wb") as f:
                    f.write(b"")
                status = "success"
                message = "Stub mode: placeholder file created"
                logger.info(f"Created placeholder asset: {output_path}")

            asset_url = f"/assets/characters/{filename}"
            results.append(
                AssetResponse(
                    status=status,
                    url=asset_url,
                    character=req.character_name,
                    variant=variant,
                    message=message,
                ).dict()
            )

        except ValueError as e:
            logger.error(f"Path safety error for variant {variant}: {e}")
            results.append(
                {
                    "status": "error",
                    "url": "",
                    "character": req.character_name,
                    "variant": variant,
                    "message": str(e),
                }
            )
        except Exception as e:
            logger.error(f"Error generating variant {variant}: {e}")
            results.append(
                {
                    "status": "error",
                    "url": "",
                    "character": req.character_name,
                    "variant": variant,
                    "message": f"Generation failed: {str(e)}",
                }
            )

    return {"results": results, "total": len(results)}


@router.post(
    "/generate-character-asset",
    response_model=AssetResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Generation error"},
    },
)
def generate_character_asset(req: AssetRequest):
    """
    Generate a single character asset.

    Creates a placeholder asset file. In production with ComfyUI enabled,
    this will submit a workflow to ComfyUI for actual generation.
    """
    logger.info(
        f"Generating asset for character={req.character_name}, style={req.style}"
    )

    try:
        asset_dir = get_asset_directory()

        # Generate safe filename
        filename = generate_safe_filename(req.character_name, req.style or "yuto-sano")

        # Use safe_join to prevent path traversal
        output_path = safe_join(asset_dir, filename)

        # Compose prompt for ComfyUI
        prompt = req.description or (
            f"Romance of the Three Kingdoms, {req.character_name}, "
            "Yuto Sano style, ink-wash, semi-realistic, portrait, "
            "dynasty armor, painterly rim light, LUT, bloom, vignette, grain overlay"
        )

        # Check if ComfyUI is enabled
        if settings.COMFYUI_ENABLED:
            # TODO: Implement actual ComfyUI API call
            logger.info(f"ComfyUI enabled but not yet implemented for {filename}")
            status = "pending"
            message = "ComfyUI integration pending implementation"
        else:
            # Stub mode: create placeholder file
            with open(output_path, "wb") as f:
                f.write(b"")
            status = "success"
            message = "Stub mode: placeholder file created"
            logger.info(f"Created placeholder asset: {output_path}")

        asset_url = f"/assets/characters/{filename}"

        return AssetResponse(
            status=status,
            url=asset_url,
            character=req.character_name,
            style=req.style,
            message=message,
        )

    except ValueError as e:
        logger.error(f"Path safety error: {e}")
        raise HTTPException(
            status_code=400,
            detail={"error": {"code": "BadRequest", "message": str(e)}},
        )
    except Exception as e:
        logger.error(f"Error generating asset: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": {"code": "InternalError", "message": f"Generation failed: {str(e)}"}
            },
        )
