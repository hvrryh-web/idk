import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.characters import Character, CharacterTypeEnum

router = APIRouter(prefix="/characters", tags=["characters"])


class CharacterBase(BaseModel):
    name: str = Field(..., example="Li Mei")
    type: str = Field(..., example="pc")
    level: Optional[int] = Field(None, example=5)
    description: Optional[str] = Field(None, example="A daring wandering cultivator.")


class CharacterCreate(CharacterBase):
    pass


class CharacterRead(CharacterBase):
    id: uuid.UUID

    class Config:
        orm_mode = True


def _validate_character_type(value: str) -> str:
    valid_types = getattr(CharacterTypeEnum, "enums", [])
    if value not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid character type '{value}'. Allowed: {valid_types}",
        )
    return value


@router.get("/", response_model=List[CharacterRead])
def list_characters(db: Session = Depends(get_db)):
    return db.query(Character).all()


@router.post("/", response_model=CharacterRead, status_code=status.HTTP_201_CREATED)
def create_character(payload: CharacterCreate, db: Session = Depends(get_db)):
    ctype = _validate_character_type(payload.type)
    character = Character(
        name=payload.name,
        type=ctype,
        level=payload.level,
        description=payload.description,
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
