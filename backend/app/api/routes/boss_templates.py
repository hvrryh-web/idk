"""Boss templates CRUD router matching OpenAPI spec."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.boss_templates import BossTemplate
from app.schemas.other import BossTemplateCreate, BossTemplateRead, BossTemplateUpdate

router = APIRouter(prefix="/boss-templates", tags=["BossTemplates"])


@router.get("/", response_model=dict)
def list_boss_templates(db: Session = Depends(get_db)):
    """List boss templates."""
    items = db.query(BossTemplate).all()
    return {"items": items}


@router.post("/", response_model=BossTemplateRead, status_code=status.HTTP_201_CREATED)
def create_boss_template(payload: BossTemplateCreate, db: Session = Depends(get_db)):
    """Create boss template."""
    template = BossTemplate(
        id=payload.id,
        name=payload.name,
        rank=payload.rank,
        sc_level=payload.sc_level,
        sc_offset_from_party=payload.sc_offset_from_party or 0,
        thp_factor=payload.thp_factor,
        dmg_factor=payload.dmg_factor,
        dr_factor=payload.dr_factor,
        minions=payload.minions or [],
        lieutenants=payload.lieutenants or [],
    )
    db.add(template)
    db.commit()
    db.refresh(template)
    return template


@router.get("/{template_id}", response_model=BossTemplateRead)
def get_boss_template(template_id: str, db: Session = Depends(get_db)):
    """Get boss template."""
    template = db.query(BossTemplate).filter(BossTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Boss template not found")
    return template


@router.patch("/{template_id}", response_model=BossTemplateRead)
def update_boss_template(
    template_id: str, payload: BossTemplateUpdate, db: Session = Depends(get_db)
):
    """Update boss template."""
    template = db.query(BossTemplate).filter(BossTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Boss template not found")

    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(template, key, value)

    db.commit()
    db.refresh(template)
    return template
