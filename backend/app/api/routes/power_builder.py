"""Power Builder router for Soul Core Technique construction."""
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.characters import Character
from app.models.fate_cards import BodyCard, DeathCard, SeedCard
from app.schemas.characters import CharacterRead
from app.schemas.techniques import TechniqueRead
from app.services.power_builder import build_innate_technique

router = APIRouter(prefix="/power-builder", tags=["PowerBuilder"])


class ModuleSpec(BaseModel):
    id: str
    rank: int


class InnateBuildRequest(BaseModel):
    character_id: UUID
    death_card_id: str
    body_card_id: str
    seed_card_ids: List[str]
    soul_thesis: str
    magic_rank: int  # Can be overridden, or computed from character
    modules: List[ModuleSpec]
    advantages: Optional[List[str]] = []
    limitations: Optional[List[str]] = []
    attach_to_character: bool = True
    slot: Optional[str] = "maj"  # 'basic', 'std', or 'maj'


class InnateBuildResponse(BaseModel):
    technique: TechniqueRead
    character: Optional[CharacterRead] = None


@router.post("/innate", response_model=InnateBuildResponse, status_code=status.HTTP_201_CREATED)
def build_innate(payload: InnateBuildRequest, db: Session = Depends(get_db)):
    """
    Build a Soul Core (Innate) Technique for a character using HERO-style power building.

    This endpoint:
    1. Loads the character and fate cards
    2. Calls the power builder service to construct the technique
    3. Saves the technique to the database
    4. Optionally attaches it to the character's technique profile
    5. Returns both the technique and updated character
    """

    # Load character
    character = db.query(Character).filter(Character.id == payload.character_id).first()
    if not character:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found")

    # Load fate cards
    death_card = db.query(DeathCard).filter(DeathCard.id == UUID(payload.death_card_id)).first()
    if not death_card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Death card not found")

    body_card = db.query(BodyCard).filter(BodyCard.id == UUID(payload.body_card_id)).first()
    if not body_card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Body card not found")

    seed_cards = []
    for seed_id in payload.seed_card_ids:
        seed = db.query(SeedCard).filter(SeedCard.id == UUID(seed_id)).first()
        if not seed:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Seed card {seed_id} not found")
        seed_cards.append(seed)

    # Build the technique
    technique = build_innate_technique(
        character=character,
        death_card=death_card,
        body_card=body_card,
        seed_cards=seed_cards,
        soul_thesis=payload.soul_thesis,
        modules=[m.dict() for m in payload.modules],
        advantages=payload.advantages or [],
        limitations=payload.limitations or [],
        technique_id=f"{character.name}_{payload.soul_thesis}_Innate",
    )

    # Save technique
    db.add(technique)

    # Optionally attach to character
    if payload.attach_to_character:
        # Update character's fate profile
        character.death_card_id = UUID(payload.death_card_id)
        character.body_card_id = UUID(payload.body_card_id)
        character.soul_thesis = payload.soul_thesis

        # In a full implementation, we'd also update character_techniques join table
        # For now, this is a simplified version

    db.commit()
    db.refresh(technique)
    db.refresh(character)

    return InnateBuildResponse(
        technique=TechniqueRead.from_orm(technique),
        character=CharacterRead.from_orm(character) if payload.attach_to_character else None,
    )
