"""
Fate Card Visual Integration API

Handles generation of Fate Card artwork using ComfyUI.
"""

from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.services.comfyui_client import ComfyUIClient, GenerationStatus
from app.services.asset_management import (
    RateLimiter,
    AssetInventoryService,
    AssetLimits,
)

router = APIRouter(prefix="/fate-cards", tags=["fate-cards"])

# Initialize client
comfyui_client = ComfyUIClient()


class FateCardGenerationRequest(BaseModel):
    """Request to generate Fate Card artwork."""
    card_type: str = Field(..., description="Type of card: death, body, or seed")
    card_id: str = Field(..., description="Unique card identifier")
    card_name: str = Field(..., description="Display name of the card")
    rarity: str = Field(default="common", description="Card rarity: common, uncommon, rare, legendary")
    color_scheme: Optional[str] = Field(None, description="Color scheme for seed cards")
    user_id: Optional[str] = Field(default="anonymous", description="User ID for rate limiting")


class FateCardGenerationResponse(BaseModel):
    """Response from Fate Card generation request."""
    job_id: str
    card_id: str
    status: str
    estimated_time_seconds: int
    message: str


class BatchFateCardRequest(BaseModel):
    """Request to generate multiple Fate Cards."""
    cards: List[FateCardGenerationRequest]
    user_id: Optional[str] = Field(default="anonymous")


class BatchFateCardResponse(BaseModel):
    """Response from batch Fate Card generation."""
    batch_id: str
    total_cards: int
    queued_cards: int
    skipped_cards: int
    job_ids: List[str]
    message: str


# Fate Card prompt templates
FATE_CARD_PROMPTS = {
    "death": {
        "silent_river": {
            "visual": "a serene figure standing in a calm river at twilight, mist rising from water, willow trees, peaceful acceptance, flowing robes dissolving into water",
            "elements": "flowing water, twilight sky, willow trees, peaceful expression"
        },
        "burning_phoenix": {
            "visual": "a figure engulfed in transformative flames rising from ashes, phoenix wings emerging from fire, rebirth imagery, defiant expression",
            "elements": "phoenix, flames, rising from ashes, transformation"
        },
        "void_mirror": {
            "visual": "a figure gazing into a cracked mirror showing the void beyond, reality distortion, transcendent clarity, seeing through illusions",
            "elements": "shattered mirror, void glimpse, enlightened gaze, fractured reality"
        },
        "eternal_watcher": {
            "visual": "an ancient sentinel standing vigil atop weathered stone, unblinking eyes watching the ages pass, patient and enduring",
            "elements": "stone pillar, eternal vigilance, aged wisdom, timeless patience"
        },
    },
    "body": {
        "stone_anchor": {
            "visual": "a rooted warrior in immovable stance, feet merged with stone ground, mountain behind, unshakable defense posture",
            "elements": "mountain stance, stone foundation, defensive posture, grounded energy"
        },
        "lightning_step": {
            "visual": "a blur of motion capturing multiple positions at once, lightning crackling around feet, speed lines, after-images",
            "elements": "motion blur, lightning, multiple poses, speed"
        },
        "iron_mountain": {
            "visual": "a massive armored figure with skin like iron, taking blows unflinching, mountain silhouette in form, indomitable",
            "elements": "iron skin, massive build, unflinching stance, impenetrable defense"
        },
        "serpent_coil": {
            "visual": "a flexible fighter in serpentine pose, coiling around attacks, striking from unexpected angles, sinuous movement",
            "elements": "serpent imagery, flexible pose, coiling motion, cunning strikes"
        },
        "crane_stance": {
            "visual": "an elegant martial artist balanced on one leg, crane wings suggested in pose, graceful and deadly, perfect balance",
            "elements": "crane pose, perfect balance, graceful movement, elegant precision"
        },
    },
    "seed": {
        "azure_flow": {
            "visual": "a figure in meditation as water flows through and around them, mental clarity shown as crystalline streams, blue energy",
            "elements": "flowing water, mental clarity, meditation, azure energy",
            "color": "#4A90E2"
        },
        "crimson_fury": {
            "visual": "a passionate warrior channeling rage into flames, crimson fire erupting from intense emotion, powerful but dangerous",
            "elements": "crimson flames, passionate fury, intense emotion, overwhelming power",
            "color": "#E74C3C"
        },
        "jade_serenity": {
            "visual": "a harmonized figure in perfect balance, jade energy connecting body and spirit, peaceful power, lotus position",
            "elements": "jade glow, perfect harmony, spiritual balance, serene power",
            "color": "#27AE60"
        },
        "silver_lightning": {
            "visual": "electric thoughts visualized as silver lightning, quick mind, precision strikes, mental speed manifest",
            "elements": "silver lightning, quick thinking, precision, mental speed",
            "color": "#95A5A6"
        },
        "obsidian_void": {
            "visual": "a mysterious figure drawing power from darkness, void energy swirling, shadow and substance, hidden depths",
            "elements": "void darkness, shadow power, mysterious aura, hidden strength",
            "color": "#34495E"
        },
    }
}

CARD_TYPE_THEMES = {
    "death": {
        "theme": "mortality and endings, ethereal, spectral, ghostly presence",
        "colors": "grayscale with silver accents, pale blue highlights, misty atmosphere",
        "border": "bone and skull ornaments, withered flowers, hourglasses"
    },
    "body": {
        "theme": "physical prowess, martial arts, combat stances, power",
        "colors": "warm earth tones, bronze and copper accents, dynamic red highlights",
        "border": "weapon motifs, armor plates, chain links, martial symbols"
    },
    "seed": {
        "theme": "elemental essence, cultivation energy, flowing qi, cosmic connection",
        "colors": "determined by seed color, energy glow, mystical radiance",
        "border": "flowing energy patterns, yin-yang symbols, elemental icons, lotus flowers"
    }
}

RARITY_MODIFIERS = {
    "common": "simple elegance, clean lines",
    "uncommon": "detailed ornamentation, silver accents, subtle glow",
    "rare": "intricate golden details, glowing elements, magical aura",
    "legendary": "transcendent radiance, divine light, legendary artifact quality, ethereal glow"
}


def build_fate_card_prompt(
    card_type: str,
    card_id: str,
    rarity: str,
    color_scheme: Optional[str] = None
) -> tuple[str, str]:
    """Build positive and negative prompts for Fate Card generation."""
    
    # Get card-specific prompt
    card_prompts = FATE_CARD_PROMPTS.get(card_type, {}).get(card_id)
    if not card_prompts:
        # Use generic prompt if specific not found
        card_prompts = {
            "visual": f"mystical {card_type} themed illustration, symbolic imagery",
            "elements": "fantasy elements, mystical symbols"
        }
    
    # Get type theme
    type_theme = CARD_TYPE_THEMES.get(card_type, CARD_TYPE_THEMES["death"])
    
    # Build prompt
    base_style = "masterwork tarot card illustration, ornate gilded frame, painterly style, dramatic lighting, Yuto Sano inspired, Romance of Three Kingdoms aesthetic, wuxia fantasy"
    quality = "masterpiece, best quality, highly detailed, intricate details, 8k resolution"
    
    # Handle seed card colors
    colors = type_theme["colors"]
    if card_type == "seed" and color_scheme:
        colors = f"{color_scheme} energy glow, mystical {color_scheme} radiance"
    elif card_type == "seed" and "color" in card_prompts:
        colors = f"glowing with {card_prompts['color']} energy"
    
    positive = ", ".join([
        base_style,
        quality,
        type_theme["theme"],
        card_prompts["visual"],
        card_prompts["elements"],
        colors,
        f"tarot card format, centered composition, ornate {type_theme['border']}",
        RARITY_MODIFIERS.get(rarity, RARITY_MODIFIERS["common"])
    ])
    
    negative = "nsfw, nude, text, watermark, signature, blurry, low quality, amateur, bad anatomy, ugly, deformed, disfigured, extra limbs, mutated"
    
    return positive, negative


@router.post("/generate", response_model=FateCardGenerationResponse)
async def generate_fate_card(
    request: FateCardGenerationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Generate artwork for a single Fate Card.
    
    Returns a job ID that can be used to track progress and retrieve the result.
    """
    # Rate limiting
    rate_limiter = RateLimiter(db)
    allowed, reason = rate_limiter.check_rate_limit(request.user_id or "anonymous", "generation")
    if not allowed:
        raise HTTPException(status_code=429, detail=reason)
    
    # Validate card type
    if request.card_type not in ["death", "body", "seed"]:
        raise HTTPException(status_code=400, detail="Invalid card_type. Must be: death, body, or seed")
    
    # Validate rarity
    if request.rarity not in ["common", "uncommon", "rare", "legendary"]:
        raise HTTPException(status_code=400, detail="Invalid rarity. Must be: common, uncommon, rare, or legendary")
    
    # Build prompts
    positive_prompt, negative_prompt = build_fate_card_prompt(
        request.card_type,
        request.card_id,
        request.rarity,
        request.color_scheme
    )
    
    # Queue the generation
    try:
        job_id = await comfyui_client.queue_generation(
            workflow_name="fate_card_art",
            positive_prompt=positive_prompt,
            negative_prompt=negative_prompt,
            parameters={
                "card_type": request.card_type,
                "card_id": request.card_id,
                "card_name": request.card_name,
                "rarity": request.rarity,
                "width": 600,
                "height": 840,
            }
        )
        
        # Record the rate limit
        rate_limiter.record_request(request.user_id or "anonymous", "generation")
        
        return FateCardGenerationResponse(
            job_id=job_id,
            card_id=request.card_id,
            status="queued",
            estimated_time_seconds=45,
            message=f"Fate Card '{request.card_name}' generation queued successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to queue generation: {str(e)}")


@router.post("/generate/batch", response_model=BatchFateCardResponse)
async def generate_fate_cards_batch(
    request: BatchFateCardRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Generate artwork for multiple Fate Cards in batch.
    
    Subject to rate limits and queue depth limits.
    """
    # Rate limiting
    rate_limiter = RateLimiter(db)
    allowed, reason = rate_limiter.check_rate_limit(request.user_id or "anonymous", "batch")
    if not allowed:
        raise HTTPException(status_code=429, detail=reason)
    
    # Check batch size
    if len(request.cards) > 20:
        raise HTTPException(
            status_code=400, 
            detail="Batch size too large. Maximum 20 cards per batch."
        )
    
    job_ids = []
    skipped = 0
    
    for card in request.cards:
        try:
            # Build prompts
            positive_prompt, negative_prompt = build_fate_card_prompt(
                card.card_type,
                card.card_id,
                card.rarity,
                card.color_scheme
            )
            
            # Queue generation
            job_id = await comfyui_client.queue_generation(
                workflow_name="fate_card_art",
                positive_prompt=positive_prompt,
                negative_prompt=negative_prompt,
                parameters={
                    "card_type": card.card_type,
                    "card_id": card.card_id,
                    "card_name": card.card_name,
                    "rarity": card.rarity,
                }
            )
            job_ids.append(job_id)
            
        except Exception as e:
            skipped += 1
    
    # Record the batch request
    rate_limiter.record_request(request.user_id or "anonymous", "batch")
    
    import uuid
    batch_id = str(uuid.uuid4())
    
    return BatchFateCardResponse(
        batch_id=batch_id,
        total_cards=len(request.cards),
        queued_cards=len(job_ids),
        skipped_cards=skipped,
        job_ids=job_ids,
        message=f"Batch queued: {len(job_ids)} cards processing, {skipped} skipped"
    )


@router.get("/prompts/{card_type}/{card_id}")
async def get_card_prompts(card_type: str, card_id: str):
    """
    Get the prompt templates for a specific Fate Card.
    
    Useful for previewing what will be generated.
    """
    if card_type not in FATE_CARD_PROMPTS:
        raise HTTPException(status_code=404, detail=f"Unknown card type: {card_type}")
    
    card_prompts = FATE_CARD_PROMPTS.get(card_type, {}).get(card_id)
    if not card_prompts:
        raise HTTPException(status_code=404, detail=f"Unknown card: {card_id}")
    
    type_theme = CARD_TYPE_THEMES[card_type]
    
    return {
        "card_type": card_type,
        "card_id": card_id,
        "visual_prompt": card_prompts["visual"],
        "elements": card_prompts["elements"],
        "type_theme": type_theme["theme"],
        "colors": type_theme["colors"],
        "border_style": type_theme["border"],
    }


@router.get("/available-cards")
async def list_available_cards():
    """
    List all available Fate Cards that can be generated.
    """
    cards = []
    
    for card_type, type_cards in FATE_CARD_PROMPTS.items():
        for card_id, prompts in type_cards.items():
            cards.append({
                "card_type": card_type,
                "card_id": card_id,
                "has_custom_prompt": True,
                "color": prompts.get("color"),
            })
    
    return {
        "total_cards": len(cards),
        "cards": cards,
        "card_types": list(FATE_CARD_PROMPTS.keys()),
    }


@router.get("/status/{job_id}")
async def get_generation_status(job_id: str):
    """
    Get the status of a Fate Card generation job.
    """
    job = await comfyui_client.get_job_status(job_id)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {
        "job_id": job.id,
        "status": job.status.value,
        "progress_percent": job.progress_percent,
        "current_layer": job.current_layer,
        "total_layers": job.total_layers,
        "error_message": job.error_message,
        "outputs": job.layer_outputs,
        "created_at": job.created_at.isoformat() if job.created_at else None,
        "completed_at": job.completed_at.isoformat() if job.completed_at else None,
    }
