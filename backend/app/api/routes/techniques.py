"""Technique CRUD router matching OpenAPI spec."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.enums import TechniqueAxis, TechniqueTier
from app.models.techniques import Technique
from app.schemas.techniques import TechniqueCreate, TechniqueRead, TechniqueUpdate

router = APIRouter(prefix="/techniques", tags=["Techniques"])


@router.get("/", response_model=dict)
def list_techniques(
    tier: Optional[TechniqueTier] = Query(None),
    archetype: Optional[str] = Query(None),
    axis: Optional[TechniqueAxis] = Query(None),
    db: Session = Depends(get_db),
):
    """List techniques with optional filters."""
    query = db.query(Technique)

    if tier:
        query = query.filter(Technique.tier == tier)
    if archetype:
        query = query.filter(Technique.archetype == archetype)
    if axis:
        query = query.filter(Technique.axis == axis)

    total = query.count()
    items = query.all()

    return {
        "items": [TechniqueRead.from_orm(tech) for tech in items],
        "total": total,
    }


@router.post("/", response_model=TechniqueRead, status_code=status.HTTP_201_CREATED)
def create_technique(payload: TechniqueCreate, db: Session = Depends(get_db)):
    """Create a new technique."""
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
        boss_strain_on_hit=payload.boss_strain_on_hit or 0,
        dr_debuff=payload.dr_debuff or 0,
        ally_shield=payload.ally_shield,
        build_meta=payload.build_meta,
    )

    if payload.damage_routing:
        technique.damage_to_thp = payload.damage_routing.to_thp
        technique.damage_to_php = payload.damage_routing.to_php
        technique.damage_to_mshp = payload.damage_routing.to_mshp

    db.add(technique)
    db.commit()
    db.refresh(technique)

    return TechniqueRead.from_orm(technique)


@router.get("/{technique_id}", response_model=TechniqueRead)
def get_technique(technique_id: str, db: Session = Depends(get_db)):
    """Get a technique by ID."""
    technique = db.query(Technique).filter(Technique.id == technique_id).first()
    if not technique:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Technique not found")
    return TechniqueRead.from_orm(technique)


@router.patch("/{technique_id}", response_model=TechniqueRead)
def update_technique(
    technique_id: str, payload: TechniqueUpdate, db: Session = Depends(get_db)
):
    """Update a technique."""
    technique = db.query(Technique).filter(Technique.id == technique_id).first()
    if not technique:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Technique not found")

    update_data = payload.dict(exclude_unset=True)

    if "damage_routing" in update_data and update_data["damage_routing"]:
        technique.damage_to_thp = update_data["damage_routing"]["to_thp"]
        technique.damage_to_php = update_data["damage_routing"]["to_php"]
        technique.damage_to_mshp = update_data["damage_routing"]["to_mshp"]
        del update_data["damage_routing"]

    for key, value in update_data.items():
        setattr(technique, key, value)

    db.commit()
    db.refresh(technique)

    return TechniqueRead.from_orm(technique)
