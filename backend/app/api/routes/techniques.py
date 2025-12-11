"""API routes for techniques."""
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.techniques import DamageRouting, Technique, TechniqueType

router = APIRouter(prefix="/techniques", tags=["techniques"])


class TechniqueBase(BaseModel):
    """Base model for technique."""

    name: str = Field(..., example="Thunder Strike")
    description: Optional[str] = Field(None, example="A powerful lightning-based attack")
    technique_type: Optional[TechniqueType] = Field(None, example=TechniqueType.standard)
    base_damage: Optional[int] = Field(0, ge=0, example=50)
    ae_cost: Optional[int] = Field(0, ge=0, example=5)
    self_strain: Optional[int] = Field(0, ge=0, example=2)
    damage_routing: Optional[DamageRouting] = Field(DamageRouting.thp, example=DamageRouting.thp)
    boss_strain_on_hit: Optional[int] = Field(0, ge=0, example=3)
    dr_debuff: Optional[float] = Field(0.0, ge=0.0, le=1.0, example=0.1)
    is_quick_action: Optional[int] = Field(0, example=0)


class TechniqueCreate(TechniqueBase):
    """Request body for creating a technique."""

    pass


class TechniqueUpdate(BaseModel):
    """Request body for updating a technique."""

    name: Optional[str] = Field(None, example="Thunder Strike")
    description: Optional[str] = Field(None, example="A powerful lightning-based attack")
    technique_type: Optional[TechniqueType] = Field(None, example=TechniqueType.standard)
    base_damage: Optional[int] = Field(None, ge=0, example=50)
    ae_cost: Optional[int] = Field(None, ge=0, example=5)
    self_strain: Optional[int] = Field(None, ge=0, example=2)
    damage_routing: Optional[DamageRouting] = Field(None, example=DamageRouting.thp)
    boss_strain_on_hit: Optional[int] = Field(None, ge=0, example=3)
    dr_debuff: Optional[float] = Field(None, ge=0.0, le=1.0, example=0.1)
    is_quick_action: Optional[int] = Field(None, example=0)


class TechniqueRead(TechniqueBase):
    """Response model for technique."""

    id: uuid.UUID

    class Config:
        orm_mode = True


@router.post("/", response_model=TechniqueRead, status_code=status.HTTP_201_CREATED)
def create_technique(payload: TechniqueCreate, db: Session = Depends(get_db)):
    """Create a new technique."""
    technique = Technique(
        name=payload.name,
        description=payload.description,
        technique_type=payload.technique_type,
        base_damage=payload.base_damage,
        ae_cost=payload.ae_cost,
        self_strain=payload.self_strain,
        damage_routing=payload.damage_routing,
        boss_strain_on_hit=payload.boss_strain_on_hit,
        dr_debuff=payload.dr_debuff,
        is_quick_action=payload.is_quick_action,
    )
    db.add(technique)
    db.commit()
    db.refresh(technique)
    return technique


@router.get("/", response_model=List[TechniqueRead])
def list_techniques(
    technique_type: Optional[TechniqueType] = None,
    is_quick_action: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    """List all techniques with optional filters."""
    query = db.query(Technique)

    if technique_type is not None:
        query = query.filter(Technique.technique_type == technique_type)

    if is_quick_action is not None:
        query = query.filter(Technique.is_quick_action == (1 if is_quick_action else 0))

    return query.all()


@router.get("/{technique_id}", response_model=TechniqueRead)
def get_technique(technique_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get a technique by ID."""
    technique = db.query(Technique).filter(Technique.id == technique_id).first()
    if not technique:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Technique not found")
    return technique


@router.patch("/{technique_id}", response_model=TechniqueRead)
def update_technique(
    technique_id: uuid.UUID, payload: TechniqueUpdate, db: Session = Depends(get_db)
):
    """Update a technique."""
    technique = db.query(Technique).filter(Technique.id == technique_id).first()
    if not technique:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Technique not found")

    # Update only provided fields
    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(technique, field, value)

    db.commit()
    db.refresh(technique)
    return technique


@router.delete("/{technique_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_technique(technique_id: uuid.UUID, db: Session = Depends(get_db)):
    """Delete a technique."""
    technique = db.query(Technique).filter(Technique.id == technique_id).first()
    if not technique:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Technique not found")

    db.delete(technique)
    db.commit()
    return None
