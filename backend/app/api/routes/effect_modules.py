"""Effect modules CRUD router matching OpenAPI spec."""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.effect_modules import EffectModule
from app.schemas.other import EffectModuleCreate, EffectModuleRead

router = APIRouter(prefix="/effect-modules", tags=["EffectModules"])


@router.get("/", response_model=dict)
def list_effect_modules(db: Session = Depends(get_db)):
    """List effect modules."""
    items = db.query(EffectModule).all()
    return {"items": items}


@router.post("/", response_model=EffectModuleRead, status_code=status.HTTP_201_CREATED)
def create_effect_module(payload: EffectModuleCreate, db: Session = Depends(get_db)):
    """Create effect module."""
    module = EffectModule(
        id=payload.id,
        name=payload.name,
        base_cost_per_rank=payload.base_cost_per_rank,
    )
    db.add(module)
    db.commit()
    db.refresh(module)
    return module
