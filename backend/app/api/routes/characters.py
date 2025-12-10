from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.characters import Character, CharacterType, SpeedBand
from app.models.fate_cards import SeedCard
from app.models.techniques import CharacterTechnique, Technique, TechniqueCategory
from app.schemas.characters import (
    CharacterCreate,
    CharacterFateProfile,
    CharacterRead,
    CharacterTechniqueProfile,
    CharacterUpdate,
)

router = APIRouter(prefix="/characters", tags=["Characters"])


def _load_character(db: Session, character_id: str) -> Character:
    character = db.query(Character).filter(Character.id == character_id).first()
    if not character:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found")
    return character


def _serialize_character(character: Character) -> CharacterRead:
    fate_profile = CharacterFateProfile(
        death_card_id=str(character.death_card_id) if character.death_card_id else None,
        body_card_id=str(character.body_card_id) if character.body_card_id else None,
        seed_card_ids=[str(seed.id) for seed in character.seed_cards],
        soul_thesis=character.soul_thesis,
    )

    technique_profile = CharacterTechniqueProfile(
        basic_ids=[ct.technique_id for ct in character.techniques if ct.category == TechniqueCategory.basic.value],
        std_ids=[ct.technique_id for ct in character.techniques if ct.category == TechniqueCategory.std.value],
        maj_ids=[ct.technique_id for ct in character.techniques if ct.category == TechniqueCategory.maj.value],
    )

    return CharacterRead(
        id=str(character.id),
        name=character.name,
        type=character.type,
        sc=character.sc,
        seq_lvl=character.seq_lvl,
        realm_lvl=character.realm_lvl,
        core_stats={"bod": character.bod, "mnd": character.mnd, "sol": character.sol},
        aether={"ae_max": float(character.ae_max), "ae_reg": float(character.ae_reg), "strain_cap": float(character.strain_cap)},
        hp={"thp_max": float(character.thp_max), "php_max": float(character.php_max), "mshp_max": float(character.mshp_max)},
        defence={
            "dr": float(character.dr),
            "guard": {
                "base_charges": character.guard_base_charges,
                "prr": character.guard_prr,
                "mrr": character.guard_mrr,
                "srr": character.guard_srr,
            },
        },
        speed={"spd_raw": character.spd_raw, "spd_band": character.spd_band},
        fate_profile=fate_profile,
        technique_profile=technique_profile,
    )


def _apply_character_update(db: Session, character: Character, payload: CharacterUpdate) -> None:
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
        guard = payload.defence.guard
        character.guard_base_charges = guard.base_charges
        character.guard_prr = guard.prr
        character.guard_mrr = guard.mrr
        character.guard_srr = guard.srr
    if payload.speed:
        character.spd_raw = payload.speed.spd_raw
        character.spd_band = payload.speed.spd_band or character.spd_band or SpeedBand.Normal
    if payload.fate_profile:
        character.death_card_id = payload.fate_profile.death_card_id
        character.body_card_id = payload.fate_profile.body_card_id
        character.soul_thesis = payload.fate_profile.soul_thesis
        if payload.fate_profile.seed_card_ids is not None:
            seeds = db.query(SeedCard).filter(SeedCard.id.in_(payload.fate_profile.seed_card_ids)).all()
            character.seed_cards = seeds
    if payload.technique_profile:
        _set_character_techniques(db, character, payload.technique_profile)


def _set_character_techniques(db: Session, character: Character, profile: CharacterTechniqueProfile) -> None:
    category_map = {
        TechniqueCategory.basic.value: profile.basic_ids,
        TechniqueCategory.std.value: profile.std_ids,
        TechniqueCategory.maj.value: profile.maj_ids,
    }
    db.query(CharacterTechnique).filter(CharacterTechnique.character_id == character.id).delete()
    for category, ids in category_map.items():
        if not ids:
            continue
        techniques = db.query(Technique).filter(Technique.id.in_(ids)).all()
        found_ids = {t.id for t in techniques}
        missing = set(ids) - found_ids
        if missing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Missing techniques: {', '.join(missing)}")
        for technique in techniques:
            db.add(
                CharacterTechnique(
                    character_id=character.id, technique_id=technique.id, category=category
                )
            )


@router.get("")
def list_characters(
    *,
    db: Session = Depends(get_db),
    type: Optional[CharacterType] = Query(default=None),
    limit: int = Query(default=50, ge=1),
    offset: int = Query(default=0, ge=0),
):
    query = db.query(Character)
    if type:
        query = query.filter(Character.type == type)
    total = query.count()
    items = query.offset(offset).limit(limit).all()
    return {"items": [_serialize_character(c) for c in items], "total": total}


@router.post("", status_code=status.HTTP_201_CREATED)
def create_character(*, db: Session = Depends(get_db), payload: CharacterCreate):
    character = Character(
        name=payload.name,
        type=payload.type,
        bod=payload.core_stats.bod,
        mnd=payload.core_stats.mnd,
        sol=payload.core_stats.sol,
        ae_max=payload.aether.ae_max,
        ae_reg=payload.aether.ae_reg,
        strain_cap=payload.aether.strain_cap,
        thp_max=payload.hp.thp_max or payload.hp.php_max,
        php_max=payload.hp.php_max,
        mshp_max=payload.hp.mshp_max,
        dr=payload.defence.dr,
        guard_base_charges=payload.defence.guard.base_charges,
        guard_prr=payload.defence.guard.prr,
        guard_mrr=payload.defence.guard.mrr,
        guard_srr=payload.defence.guard.srr,
        spd_raw=payload.speed.spd_raw if payload.speed else 0,
        spd_band=payload.speed.spd_band if payload.speed and payload.speed.spd_band else SpeedBand.Normal,
        death_card_id=payload.fate_profile.death_card_id if payload.fate_profile else None,
        body_card_id=payload.fate_profile.body_card_id if payload.fate_profile else None,
        soul_thesis=payload.fate_profile.soul_thesis if payload.fate_profile else None,
    )
    if payload.fate_profile and payload.fate_profile.seed_card_ids:
        seeds = db.query(SeedCard).filter(SeedCard.id.in_(payload.fate_profile.seed_card_ids)).all()
        character.seed_cards = seeds

    db.add(character)
    db.commit()
    db.refresh(character)

    if payload.technique_profile:
        _set_character_techniques(db, character, payload.technique_profile)
        db.commit()
        db.refresh(character)

    return _serialize_character(character)


@router.get("/{characterId}")
def get_character(characterId: str, db: Session = Depends(get_db)):
    character = _load_character(db, characterId)
    return _serialize_character(character)


@router.patch("/{characterId}")
def update_character(characterId: str, payload: CharacterUpdate, db: Session = Depends(get_db)):
    character = _load_character(db, characterId)
    _apply_character_update(db, character, payload)
    db.add(character)
    db.commit()
    db.refresh(character)
    return _serialize_character(character)


@router.delete("/{characterId}", status_code=status.HTTP_204_NO_CONTENT)
def delete_character(characterId: str, db: Session = Depends(get_db)):
    character = _load_character(db, characterId)
    db.delete(character)
    db.commit()
    return None
