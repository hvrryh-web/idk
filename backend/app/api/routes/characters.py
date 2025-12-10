"""Character CRUD router matching OpenAPI spec."""
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.characters import Character
from app.models.enums import CharacterType, SpeedBand
from app.schemas.characters import CharacterCreate, CharacterRead, CharacterUpdate

router = APIRouter(prefix="/characters", tags=["Characters"])


@router.get("/", response_model=dict)
def list_characters(
    type: Optional[CharacterType] = Query(None),
    limit: int = Query(50, ge=1),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """List characters with optional type filter and pagination."""
    query = db.query(Character)

    if type:
        query = query.filter(Character.type == type)

    total = query.count()
    items = query.order_by(Character.created_at.desc()).limit(limit).offset(offset).all()

    return {
        "items": [CharacterRead.from_orm(char) for char in items],
        "total": total,
    }


@router.post("/", response_model=CharacterRead, status_code=status.HTTP_201_CREATED)
def create_character(payload: CharacterCreate, db: Session = Depends(get_db)):
    """Create a new character."""
    # Calculate speed band from spd_raw
    spd_raw = payload.speed.get("spd_raw", 5) if payload.speed else 5
    if spd_raw >= 8:
        spd_band = SpeedBand.SuperFast
    elif spd_raw >= 6:
        spd_band = SpeedBand.Fast
    else:
        spd_band = SpeedBand.Normal

    character = Character(
        name=payload.name,
        type=payload.type,
        bod=payload.core_stats.bod,
        mnd=payload.core_stats.mnd,
        sol=payload.core_stats.sol,
        ae_max=payload.aether.ae_max,
        ae_reg=payload.aether.ae_reg,
        strain_cap=payload.aether.strain_cap,
        thp_max=payload.hp.thp_max or 0,
        php_max=payload.hp.php_max,
        mshp_max=payload.hp.mshp_max,
        dr=payload.defence.dr,
        guard_base_charges=payload.defence.guard["base_charges"],
        guard_prr=payload.defence.guard["prr"],
        guard_mrr=payload.defence.guard["mrr"],
        guard_srr=payload.defence.guard["srr"],
        spd_raw=spd_raw,
        spd_band=spd_band,
    )

    if payload.fate_profile:
        character.death_card_id = payload.fate_profile.death_card_id
        character.body_card_id = payload.fate_profile.body_card_id
        character.soul_thesis = payload.fate_profile.soul_thesis

    db.add(character)
    db.commit()
    db.refresh(character)

    return CharacterRead.from_orm(character)


@router.get("/{character_id}", response_model=CharacterRead)
def get_character(character_id: UUID, db: Session = Depends(get_db)):
    """Get a character by ID."""
    character = db.query(Character).filter(Character.id == character_id).first()
    if not character:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found")
    return CharacterRead.from_orm(character)


@router.patch("/{character_id}", response_model=CharacterRead)
def update_character(
    character_id: UUID, payload: CharacterUpdate, db: Session = Depends(get_db)
):
    """Update a character."""
    character = db.query(Character).filter(Character.id == character_id).first()
    if not character:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found")

    if payload.name is not None:
        character.name = payload.name
    if payload.core_stats:
        character.bod = payload.core_stats.bod
        character.mnd = payload.core_stats.mnd
        character.sol = payload.core_stats.sol
    if payload.aether:
        character.ae_max = payload.aether.ae_max
        character.ae_reg = payload.aether.ae_reg
        character.strain_cap = payload.aether.strain_cap
    if payload.hp:
        if payload.hp.thp_max is not None:
            character.thp_max = payload.hp.thp_max
        character.php_max = payload.hp.php_max
        character.mshp_max = payload.hp.mshp_max
    if payload.defence:
        character.dr = payload.defence.dr
        character.guard_base_charges = payload.defence.guard["base_charges"]
        character.guard_prr = payload.defence.guard["prr"]
        character.guard_mrr = payload.defence.guard["mrr"]
        character.guard_srr = payload.defence.guard["srr"]
    if payload.speed:
        character.spd_raw = payload.speed.spd_raw
        character.spd_band = payload.speed.spd_band
    if payload.fate_profile:
        if payload.fate_profile.death_card_id is not None:
            character.death_card_id = payload.fate_profile.death_card_id
        if payload.fate_profile.body_card_id is not None:
            character.body_card_id = payload.fate_profile.body_card_id
        if payload.fate_profile.soul_thesis is not None:
            character.soul_thesis = payload.fate_profile.soul_thesis

    db.commit()
    db.refresh(character)

    return CharacterRead.from_orm(character)


@router.delete("/{character_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_character(character_id: UUID, db: Session = Depends(get_db)):
    """Delete a character."""
    character = db.query(Character).filter(Character.id == character_id).first()
    if not character:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found")

    db.delete(character)
    db.commit()

    return None
