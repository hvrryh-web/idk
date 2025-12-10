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
    stats: Optional[Dict[str, int]] = Field(
        None, example={"might": 3, "cunning": 2, "spirit": 4}
    )


class CharacterCreate(CharacterBase):
    pass


class CharacterRead(CharacterBase):
    id: uuid.UUID

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
