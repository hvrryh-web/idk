from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.boss_templates import BossTemplate
from app.schemas.boss_templates import BossTemplateCreate, BossTemplateRead, BossTemplateUpdate

router = APIRouter(prefix="/boss-templates", tags=["BossTemplates"])


def _serialize_template(template: BossTemplate) -> BossTemplateRead:
    return BossTemplateRead(
        id=str(template.id),
        name=template.name,
        rank=template.rank,
        traits=template.traits or {},
    )


def _load_template(db: Session, template_id: str) -> BossTemplate:
    template = db.query(BossTemplate).filter(BossTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Boss template not found")
    return template


@router.get("")
def list_boss_templates(db: Session = Depends(get_db)):
    items = db.query(BossTemplate).all()
    return {"items": [_serialize_template(t) for t in items], "total": len(items)}


@router.post("", status_code=status.HTTP_201_CREATED)
def create_boss_template(payload: BossTemplateCreate, db: Session = Depends(get_db)):
    template = BossTemplate(name=payload.name, rank=payload.rank, traits=payload.traits)
    db.add(template)
    db.commit()
    db.refresh(template)
    return _serialize_template(template)


@router.get("/{templateId}")
def get_boss_template(templateId: str, db: Session = Depends(get_db)):
    template = _load_template(db, templateId)
    return _serialize_template(template)


@router.patch("/{templateId}")
def update_boss_template(templateId: str, payload: BossTemplateUpdate, db: Session = Depends(get_db)):
    template = _load_template(db, templateId)
    if payload.name is not None:
        template.name = payload.name
    if payload.rank is not None:
        template.rank = payload.rank
    if payload.traits is not None:
        template.traits = payload.traits
    db.add(template)
    db.commit()
    db.refresh(template)
    return _serialize_template(template)

