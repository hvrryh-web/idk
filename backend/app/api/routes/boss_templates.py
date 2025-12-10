"""API routes for boss templates."""
import uuid
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.boss_template import BossTemplate

router = APIRouter(prefix="/boss-templates", tags=["boss-templates"])


class BossTemplateBase(BaseModel):
    """Base model for boss template."""
    name: str = Field(..., example="Ancient Dragon")
    description: Optional[str] = Field(None, example="A fearsome ancient dragon")
    thp: int = Field(..., ge=1, example=500)
    ae: int = Field(..., ge=0, example=20)
    ae_reg: int = Field(0, ge=0, example=3)
    dr: float = Field(0.0, ge=0.0, le=1.0, example=0.3)
    strain: int = Field(0, ge=0, example=0)
    guard: int = Field(0, ge=0, example=0)
    spike_threshold: Optional[int] = Field(None, example=10)
    basic_technique_id: Optional[str] = Field(None, example="tech-uuid")
    spike_technique_id: Optional[str] = Field(None, example="tech-uuid")
    techniques: Optional[List[str]] = Field(None, example=["tech-uuid-1", "tech-uuid-2"])


class BossTemplateCreate(BossTemplateBase):
    """Request body for creating a boss template."""
    pass


class BossTemplateRead(BossTemplateBase):
    """Response model for boss template."""
    id: uuid.UUID

    class Config:
        orm_mode = True


@router.post("/", response_model=BossTemplateRead, status_code=status.HTTP_201_CREATED)
def create_boss_template(payload: BossTemplateCreate, db: Session = Depends(get_db)):
    """Create a new boss template."""
    boss = BossTemplate(
        name=payload.name,
        description=payload.description,
        thp=payload.thp,
        ae=payload.ae,
        ae_reg=payload.ae_reg,
        dr=payload.dr,
        strain=payload.strain,
        guard=payload.guard,
        spike_threshold=payload.spike_threshold,
        basic_technique_id=uuid.UUID(payload.basic_technique_id) if payload.basic_technique_id else None,
        spike_technique_id=uuid.UUID(payload.spike_technique_id) if payload.spike_technique_id else None,
        techniques=payload.techniques
    )
    db.add(boss)
    db.commit()
    db.refresh(boss)
    return boss


@router.get("/", response_model=List[BossTemplateRead])
def list_boss_templates(db: Session = Depends(get_db)):
    """List all boss templates."""
    return db.query(BossTemplate).all()


@router.get("/{boss_id}", response_model=BossTemplateRead)
def get_boss_template(boss_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get a boss template by ID."""
    boss = db.query(BossTemplate).filter(BossTemplate.id == boss_id).first()
    if not boss:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Boss template not found")
    return boss
