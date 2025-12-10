from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.effect_modules import EffectModule
from app.schemas.effect_modules import EffectModuleCreate, EffectModuleRead

router = APIRouter(prefix="/effect-modules", tags=["EffectModules"])


def _serialize_module(module: EffectModule) -> EffectModuleRead:
    return EffectModuleRead(
        id=module.id,
        name=module.name,
        base_cost_per_rank=float(module.base_cost_per_rank),
    )


@router.get("")
def list_effect_modules(db: Session = Depends(get_db)):
    items = db.query(EffectModule).all()
    return {"items": [_serialize_module(m) for m in items], "total": len(items)}


@router.post("", status_code=status.HTTP_201_CREATED)
def create_effect_module(payload: EffectModuleCreate, db: Session = Depends(get_db)):
    module = EffectModule(
        id=payload.id,
        name=payload.name,
        base_cost_per_rank=payload.base_cost_per_rank,
    )
    db.add(module)
    db.commit()
    db.refresh(module)
    return _serialize_module(module)

