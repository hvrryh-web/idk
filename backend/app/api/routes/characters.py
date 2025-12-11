import uuid
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.characters import Character, CharacterType

router = APIRouter(prefix="/characters", tags=["characters"])


class CharacterBase(BaseModel):
    name: str = Field(..., example="Li Mei")
    type: CharacterType = Field(..., example=CharacterType.pc)
    level: Optional[int] = Field(None, example=5)
    lineage: Optional[str] = Field(None, example="Azure Crane Sect")
    description: Optional[str] = Field(None, example="A daring wandering cultivator.")
    stats: Optional[Dict[str, int]] = Field(None, example={"might": 3, "cunning": 2, "spirit": 4})
    
    # Primary stats
    strength: Optional[int] = Field(None, example=3)
    dexterity: Optional[int] = Field(None, example=3)
    constitution: Optional[int] = Field(None, example=3)
    intelligence: Optional[int] = Field(None, example=3)
    wisdom: Optional[int] = Field(None, example=3)
    charisma: Optional[int] = Field(None, example=3)
    perception: Optional[int] = Field(None, example=3)
    resolve: Optional[int] = Field(None, example=3)
    presence: Optional[int] = Field(None, example=3)
    
    # Aether stats
    aether_fire: Optional[int] = Field(None, example=2)
    aether_ice: Optional[int] = Field(None, example=2)
    aether_void: Optional[int] = Field(None, example=2)
    
    # Condition and cost tracks
    conditions: Optional[Dict] = Field(None)
    cost_tracks: Optional[Dict] = Field(None)


class CharacterCreate(CharacterBase):
    pass


class CharacterUpdate(BaseModel):
    """Partial update for character tracks."""
    conditions: Optional[Dict] = Field(None)
    cost_tracks: Optional[Dict] = Field(None)


class CharacterRead(CharacterBase):
    id: uuid.UUID
    scl: int = Field(..., description="Soul Cultivation Level (computed)")

    class Config:
        orm_mode = True


@router.get("/", response_model=List[CharacterRead])
def list_characters(db: Session = Depends(get_db)):
    return db.query(Character).order_by(Character.created_at.desc()).all()


@router.post("/", response_model=CharacterRead, status_code=status.HTTP_201_CREATED)
def create_character(payload: CharacterCreate, db: Session = Depends(get_db)):
    character = Character(
        name=payload.name,
        type=payload.type,
        level=payload.level,
        lineage=payload.lineage,
        description=payload.description,
        stats=payload.stats,
        strength=payload.strength,
        dexterity=payload.dexterity,
        constitution=payload.constitution,
        intelligence=payload.intelligence,
        wisdom=payload.wisdom,
        charisma=payload.charisma,
        perception=payload.perception,
        resolve=payload.resolve,
        presence=payload.presence,
        aether_fire=payload.aether_fire,
        aether_ice=payload.aether_ice,
        aether_void=payload.aether_void,
        conditions=payload.conditions or {
            "violence": {"current": 0, "history": []},
            "influence": {"current": 0, "history": []},
            "revelation": {"current": 0, "history": []},
        },
        cost_tracks=payload.cost_tracks or {
            "blood": {"current": 0, "maximum": 10},
            "fate": {"current": 0, "maximum": 10},
            "stain": {"current": 0, "maximum": 10},
        },
    )
    db.add(character)
    db.commit()
    db.refresh(character)
    return character


@router.get("/{character_id}", response_model=CharacterRead)
def get_character(character_id: uuid.UUID, db: Session = Depends(get_db)):
    character = db.query(Character).filter(Character.id == character_id).first()
    if not character:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found")
    return character


@router.patch("/{character_id}/tracks", response_model=CharacterRead)
def update_character_tracks(
    character_id: uuid.UUID, payload: CharacterUpdate, db: Session = Depends(get_db)
):
    """Update character condition and cost tracks."""
    character = db.query(Character).filter(Character.id == character_id).first()
    if not character:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found")

    if payload.conditions is not None:
        character.conditions = payload.conditions
    if payload.cost_tracks is not None:
        character.cost_tracks = payload.cost_tracks

    db.commit()
    db.refresh(character)
    return character
