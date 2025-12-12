"""
Visual Asset Generation API Routes

Endpoints for generating and managing character visual assets at different
quality levels, including wiki art, battle tokens, and ASCII art.
"""

import logging
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.config import settings
from app.services.visual_asset_integration import (
    AssetQualityLevel,
    CharacterType,
    CharacterVisualConfig,
    VisualTraits,
    OutfitConfig,
    get_visual_asset_service,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/characters", tags=["visual-assets"])


# Request/Response Models

class WikiArtGenerationRequest(BaseModel):
    """Request for wiki-quality art generation."""
    variants: List[str] = Field(
        default=["portrait", "fullbody", "expressions"],
        description="Variants to generate"
    )
    priority: str = Field(
        default="normal",
        description="Generation priority: normal or high"
    )


class TokenGenerationRequest(BaseModel):
    """Request for battle token generation."""
    sizes: List[str] = Field(
        default=["large", "medium", "small"],
        description="Token sizes to generate"
    )
    frame_style: str = Field(
        default="gold",
        description="Frame style: gold, silver, bronze, or iron"
    )


class AsciiGenerationRequest(BaseModel):
    """Request for ASCII art generation."""
    poses: List[str] = Field(
        default=["idle", "attack", "defend"],
        description="Poses to generate"
    )
    style: str = Field(
        default="detailed",
        description="Style: detailed or simple"
    )


class GenerationJobResponse(BaseModel):
    """Response for generation job creation."""
    job_id: str
    estimated_time: int = Field(description="Estimated time in seconds")


class TokensResponse(BaseModel):
    """Response with generated token URLs."""
    tokens: dict


class AsciiAssetsResponse(BaseModel):
    """Response with generated ASCII asset URLs."""
    ascii_assets: dict


class CharacterAssetsResponse(BaseModel):
    """Response with all character visual assets."""
    character_id: str
    character_type: str
    wiki_art: Optional[dict] = None
    standard: Optional[dict] = None
    tokens: Optional[dict] = None
    ascii: Optional[dict] = None


class QualityLevelInfo(BaseModel):
    """Information about a quality level."""
    level: str
    tier: int
    name: str
    description: str
    eligible: bool


class CharacterEligibilityResponse(BaseModel):
    """Response showing character eligibility for each quality level."""
    character_id: str
    character_type: str
    quality_levels: List[QualityLevelInfo]


# Endpoints

@router.get("/{character_id}/assets", response_model=CharacterAssetsResponse)
async def get_character_assets(
    character_id: str,
    db: Session = Depends(get_db),
):
    """
    Get all visual assets for a character.
    
    Returns URLs for all available visual assets at each quality level.
    """
    service = get_visual_asset_service()
    
    # Get asset availability
    availability = service.check_asset_availability(character_id)
    
    # Build response with available assets
    assets_base = f"/assets/characters/{character_id}"
    
    wiki_art = None
    if any(availability.get(AssetQualityLevel.WIKI_DETAILED, {}).values()):
        wiki_art = {
            "portrait": f"{assets_base}/wiki/portrait_default.png",
            "fullbody": f"{assets_base}/wiki/fullbody_default.png",
            "expressions": f"{assets_base}/wiki/expressions.png",
        }
    
    standard = {
        "portrait": f"{assets_base}/standard/portrait.png",
        "thumbnail": f"{assets_base}/standard/thumbnail.png",
    }
    
    tokens = {
        "battle": {
            "large": f"{assets_base}/tokens/battle_128.png",
            "medium": f"{assets_base}/tokens/battle_64.png",
            "small": f"{assets_base}/tokens/battle_32.png",
        },
        "map": {
            "standard": f"{assets_base}/tokens/map_64.png",
        }
    }
    
    ascii_assets = {
        "idle": f"{assets_base}/ascii/idle.txt",
        "attack": f"{assets_base}/ascii/attack.txt",
        "defend": f"{assets_base}/ascii/defend.txt",
    }
    
    return CharacterAssetsResponse(
        character_id=character_id,
        character_type="player_character",  # Would be fetched from DB
        wiki_art=wiki_art,
        standard=standard,
        tokens=tokens,
        ascii=ascii_assets,
    )


@router.get("/{character_id}/assets/{quality}/{asset_type}")
async def get_specific_asset(
    character_id: str,
    quality: str,
    asset_type: str,
    db: Session = Depends(get_db),
):
    """
    Get a specific asset by quality level and type.
    
    - quality: wiki, standard, token, map, ascii
    - asset_type: portrait, fullbody, expressions, battle, idle, attack, etc.
    """
    service = get_visual_asset_service()
    
    # Map quality string to enum
    quality_map = {
        "wiki": AssetQualityLevel.WIKI_DETAILED,
        "standard": AssetQualityLevel.STANDARD_GAMEPLAY,
        "token": AssetQualityLevel.BATTLE_TOKEN_PC,
        "map": AssetQualityLevel.BATTLE_MAP_TOKEN,
        "ascii": AssetQualityLevel.ASCII_COMBAT,
    }
    
    quality_level = quality_map.get(quality)
    if not quality_level:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid quality level: {quality}"
        )
    
    paths = service.get_asset_paths(character_id, quality_level)
    asset_path = paths.get(asset_type)
    
    if not asset_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Asset type '{asset_type}' not found for quality '{quality}'"
        )
    
    if not asset_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Asset file not found"
        )
    
    # Return file URL
    return {"url": f"/assets/characters/{character_id}/{quality}/{asset_type}.png"}


@router.get("/{character_id}/eligibility", response_model=CharacterEligibilityResponse)
async def get_character_eligibility(
    character_id: str,
    db: Session = Depends(get_db),
):
    """
    Get eligibility of a character for each quality level.
    
    Returns which quality levels the character is eligible for based on their type.
    """
    service = get_visual_asset_service()
    
    # In production, fetch character type from database
    # For now, assume player character
    character_type = CharacterType.PLAYER_CHARACTER
    
    eligible_levels = service.get_eligible_quality_levels(character_type)
    
    quality_levels = []
    for level in AssetQualityLevel:
        level_info = QualityLevelInfo(
            level=level.value,
            tier=_get_level_tier(level),
            name=_get_level_name(level),
            description=_get_level_description(level),
            eligible=level in eligible_levels,
        )
        quality_levels.append(level_info)
    
    return CharacterEligibilityResponse(
        character_id=character_id,
        character_type=character_type.value,
        quality_levels=quality_levels,
    )


@router.post("/{character_id}/generate-wiki-art", response_model=GenerationJobResponse)
async def generate_wiki_art(
    character_id: str,
    request: WikiArtGenerationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Request wiki-quality art generation for a character.
    
    Only Player Characters and Named NPCs are eligible for wiki-quality art.
    """
    service = get_visual_asset_service()
    
    # Check eligibility (in production, fetch character type from DB)
    character_type = CharacterType.PLAYER_CHARACTER
    eligible_levels = service.get_eligible_quality_levels(character_type)
    
    if AssetQualityLevel.WIKI_DETAILED not in eligible_levels:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This character type is not eligible for wiki-quality art"
        )
    
    # Create generation job
    import uuid
    job_id = str(uuid.uuid4())
    
    # Estimate time based on variants
    variant_times = {
        "portrait": 120,
        "fullbody": 180,
        "expressions": 300,
    }
    estimated_time = sum(variant_times.get(v, 120) for v in request.variants)
    
    # Queue background generation
    async def run_wiki_generation():
        logger.info(f"Starting wiki art generation for {character_id}, job {job_id}")
        # In production: call ComfyUI via generate_wiki_character_art.ts
        # or use the Python ComfyUI client
    
    background_tasks.add_task(run_wiki_generation)
    
    return GenerationJobResponse(
        job_id=job_id,
        estimated_time=estimated_time,
    )


@router.post("/{character_id}/generate-tokens", response_model=TokensResponse)
async def generate_tokens(
    character_id: str,
    request: TokenGenerationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Generate battle tokens from existing portrait.
    
    Tokens are derived from standard or wiki-quality portraits.
    """
    service = get_visual_asset_service()
    
    # Check if source portrait exists
    standard_paths = service.get_asset_paths(character_id, AssetQualityLevel.STANDARD_GAMEPLAY)
    wiki_paths = service.get_asset_paths(character_id, AssetQualityLevel.WIKI_DETAILED)
    
    source_portrait = None
    if wiki_paths.get("portrait") and wiki_paths["portrait"].exists():
        source_portrait = wiki_paths["portrait"]
    elif standard_paths.get("portrait") and standard_paths["portrait"].exists():
        source_portrait = standard_paths["portrait"]
    
    if not source_portrait:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No source portrait available for token generation"
        )
    
    # Generate tokens (placeholder - actual implementation uses image processing)
    assets_base = f"/assets/characters/{character_id}/tokens"
    
    tokens = {}
    for size in request.sizes:
        size_map = {"large": 128, "medium": 64, "small": 32}
        if size in size_map:
            tokens[size] = f"{assets_base}/battle_{size_map[size]}.png"
    
    return TokensResponse(tokens=tokens)


@router.post("/{character_id}/generate-ascii", response_model=AsciiAssetsResponse)
async def generate_ascii(
    character_id: str,
    request: AsciiGenerationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Generate ASCII art versions of a character.
    
    ASCII art is derived from standard or wiki-quality portraits.
    """
    service = get_visual_asset_service()
    
    # Generate ASCII assets (placeholder)
    assets_base = f"/assets/characters/{character_id}/ascii"
    
    ascii_assets = {}
    for pose in request.poses:
        ascii_assets[pose] = f"{assets_base}/{pose}.txt"
    
    return AsciiAssetsResponse(ascii_assets=ascii_assets)


@router.post("/{character_id}/derive-assets")
async def derive_assets(
    character_id: str,
    source_level: str,
    target_level: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Derive lower-quality assets from higher-quality source.
    
    Derivation paths:
    - wiki_detailed → standard_gameplay (downscale)
    - standard_gameplay → battle_tokens (crop and frame)
    - standard_gameplay → ascii (image-to-ascii)
    """
    service = get_visual_asset_service()
    
    # Map strings to enums
    level_map = {
        "wiki_detailed": AssetQualityLevel.WIKI_DETAILED,
        "standard_gameplay": AssetQualityLevel.STANDARD_GAMEPLAY,
        "battle_token_pc": AssetQualityLevel.BATTLE_TOKEN_PC,
        "battle_token_npc": AssetQualityLevel.BATTLE_TOKEN_NPC,
        "battle_map_token": AssetQualityLevel.BATTLE_MAP_TOKEN,
        "ascii_combat": AssetQualityLevel.ASCII_COMBAT,
    }
    
    source = level_map.get(source_level)
    target = level_map.get(target_level)
    
    if not source or not target:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid source or target quality level"
        )
    
    # Perform derivation
    result = service.derive_lower_quality_assets(character_id, source, target)
    
    if not result.success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result.error or "Derivation failed"
        )
    
    return {
        "success": True,
        "character_id": character_id,
        "source_level": source_level,
        "target_level": target_level,
        "assets": result.assets,
    }


# Helper functions

def _get_level_tier(level: AssetQualityLevel) -> int:
    """Get tier number for a quality level."""
    tier_map = {
        AssetQualityLevel.WIKI_DETAILED: 1,
        AssetQualityLevel.STANDARD_GAMEPLAY: 2,
        AssetQualityLevel.BATTLE_TOKEN_PC: 3,
        AssetQualityLevel.BATTLE_TOKEN_NPC: 3,
        AssetQualityLevel.BATTLE_MAP_TOKEN: 4,
        AssetQualityLevel.ASCII_COMBAT: 5,
        AssetQualityLevel.ASCII_MAP_EVENT: 5,
    }
    return tier_map.get(level, 99)


def _get_level_name(level: AssetQualityLevel) -> str:
    """Get display name for a quality level."""
    name_map = {
        AssetQualityLevel.WIKI_DETAILED: "Wiki Detailed Art",
        AssetQualityLevel.STANDARD_GAMEPLAY: "Standard Gameplay Art",
        AssetQualityLevel.BATTLE_TOKEN_PC: "PC Battle Tokens",
        AssetQualityLevel.BATTLE_TOKEN_NPC: "NPC Battle Tokens",
        AssetQualityLevel.BATTLE_MAP_TOKEN: "Battle Map Tokens",
        AssetQualityLevel.ASCII_COMBAT: "ASCII Combat Art",
        AssetQualityLevel.ASCII_MAP_EVENT: "ASCII Map Event Art",
    }
    return name_map.get(level, level.value)


def _get_level_description(level: AssetQualityLevel) -> str:
    """Get description for a quality level."""
    desc_map = {
        AssetQualityLevel.WIKI_DETAILED: "Highest quality renders for wiki pages",
        AssetQualityLevel.STANDARD_GAMEPLAY: "Quality art for general gameplay",
        AssetQualityLevel.BATTLE_TOKEN_PC: "Player character combat grid tokens",
        AssetQualityLevel.BATTLE_TOKEN_NPC: "NPC combat grid tokens",
        AssetQualityLevel.BATTLE_MAP_TOKEN: "Top-down tactical map tokens",
        AssetQualityLevel.ASCII_COMBAT: "Text-based combat illustrations",
        AssetQualityLevel.ASCII_MAP_EVENT: "ASCII art for map events",
    }
    return desc_map.get(level, "")
