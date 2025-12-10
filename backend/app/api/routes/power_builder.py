from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.characters import Character
from app.models.techniques import CharacterTechnique, Technique, TechniqueCategory, TechniqueTier
from app.schemas.power_builder import InnateBuildRequest, InnateBuildResponse

router = APIRouter(prefix="/power-builder", tags=["PowerBuilder"])


def _load_character(db: Session, character_id: str) -> Character:
    character = db.query(Character).filter(Character.id == character_id).first()
    if not character:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found")
    return character


@router.post("/innate", status_code=status.HTTP_201_CREATED)
def build_innate(payload: InnateBuildRequest, db: Session = Depends(get_db)):
    technique_id = payload.technique_id or f"innate_{payload.name.lower().replace(' ', '_')}"
    existing = db.query(Technique).filter(Technique.id == technique_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Technique already exists")

    technique = Technique(
        id=technique_id,
        name=payload.name,
        tier=TechniqueTier.Innate,
        archetype=payload.archetype,
        axis=payload.axis,
        target_pool=payload.target_pool,
        base_damage=payload.base_damage,
        ae_cost=payload.ae_cost,
        self_strain=payload.self_strain,
        boss_strain_on_hit=payload.boss_strain_on_hit,
        dr_debuff=payload.dr_debuff,
        damage_to_thp=payload.damage_to_thp,
        damage_to_php=payload.damage_to_php,
        damage_to_mshp=payload.damage_to_mshp,
        build_meta=payload.build_meta.dict() if payload.build_meta else None,
    )
    db.add(technique)
    db.commit()
    db.refresh(technique)

    if payload.character_id:
        character = _load_character(db, payload.character_id)
        db.add(
            CharacterTechnique(
                character_id=character.id,
                technique_id=technique.id,
                category=payload.attach_category.value,
            )
        )
        db.commit()
    return InnateBuildResponse(technique_id=technique.id, character_id=payload.character_id)

