from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.techniques import Technique, TechniqueAxis, TechniqueTier
from app.schemas.techniques import TechniqueCreate, TechniqueRead, TechniqueUpdate

router = APIRouter(prefix="/techniques", tags=["Techniques"])


def _serialize_technique(technique: Technique) -> TechniqueRead:
    return TechniqueRead(
        id=technique.id,
        name=technique.name,
        tier=technique.tier,
        archetype=technique.archetype,
        axis=technique.axis,
        target_pool=technique.target_pool,
        base_offrank_bias=float(technique.base_offrank_bias),
        base_damage=float(technique.base_damage),
        ae_cost=float(technique.ae_cost),
        self_strain=float(technique.self_strain),
        damage_routing={
            "to_thp": float(technique.damage_to_thp),
            "to_php": float(technique.damage_to_php),
            "to_mshp": float(technique.damage_to_mshp),
        },
        boss_strain_on_hit=float(technique.boss_strain_on_hit),
        dr_debuff=float(technique.dr_debuff),
        ally_shield=technique.ally_shield,
        build_meta=technique.build_meta,
    )


@router.get("")
def list_techniques(
    *,
    db: Session = Depends(get_db),
    tier: Optional[TechniqueTier] = Query(default=None),
    archetype: Optional[str] = Query(default=None),
    axis: Optional[TechniqueAxis] = Query(default=None),
):
    query = db.query(Technique)
    if tier:
        query = query.filter(Technique.tier == tier)
    if archetype:
        query = query.filter(Technique.archetype == archetype)
    if axis:
        query = query.filter(Technique.axis == axis)
    total = query.count()
    items = query.all()
    return {"items": [_serialize_technique(t) for t in items], "total": total}


@router.post("", status_code=status.HTTP_201_CREATED)
def create_technique(*, db: Session = Depends(get_db), payload: TechniqueCreate):
    technique = Technique(
        id=payload.id,
        name=payload.name,
        tier=payload.tier,
        archetype=payload.archetype,
        axis=payload.axis,
        target_pool=payload.target_pool,
        base_offrank_bias=payload.base_offrank_bias or 0,
        base_damage=payload.base_damage or 0,
        ae_cost=payload.ae_cost or 0,
        self_strain=payload.self_strain or 0,
        damage_to_thp=payload.damage_routing.to_thp if payload.damage_routing else 1,
        damage_to_php=payload.damage_routing.to_php if payload.damage_routing else 0,
        damage_to_mshp=payload.damage_routing.to_mshp if payload.damage_routing else 0,
        boss_strain_on_hit=payload.boss_strain_on_hit or 0,
        dr_debuff=payload.dr_debuff or 0,
        ally_shield=payload.ally_shield,
        build_meta=payload.build_meta.dict() if payload.build_meta else None,
    )
    db.add(technique)
    db.commit()
    db.refresh(technique)
    return _serialize_technique(technique)


@router.get("/{techniqueId}")
def get_technique(techniqueId: str, db: Session = Depends(get_db)):
    technique = db.query(Technique).filter(Technique.id == techniqueId).first()
    if not technique:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Technique not found")
    return _serialize_technique(technique)


@router.patch("/{techniqueId}")
def update_technique(techniqueId: str, payload: TechniqueUpdate, db: Session = Depends(get_db)):
    technique = db.query(Technique).filter(Technique.id == techniqueId).first()
    if not technique:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Technique not found")

    for field in [
        "name",
        "tier",
        "archetype",
        "axis",
        "target_pool",
        "base_offrank_bias",
        "base_damage",
        "ae_cost",
        "self_strain",
        "boss_strain_on_hit",
        "dr_debuff",
        "ally_shield",
    ]:
        value = getattr(payload, field)
        if value is not None:
            setattr(technique, field, value)

    if payload.damage_routing:
        technique.damage_to_thp = payload.damage_routing.to_thp
        technique.damage_to_php = payload.damage_routing.to_php
        technique.damage_to_mshp = payload.damage_routing.to_mshp
    if payload.build_meta is not None:
        technique.build_meta = payload.build_meta.dict()

    db.add(technique)
    db.commit()
    db.refresh(technique)
    return _serialize_technique(technique)
