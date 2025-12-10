from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.fate_cards import BodyCard, DeathCard, SeedCard
from app.schemas.fate_cards import (
    BodyCardCreate,
    BodyCardRead,
    DeathCardCreate,
    DeathCardRead,
    SeedCardCreate,
    SeedCardRead,
)

router = APIRouter(prefix="/fate", tags=["FateCards"])


def _serialize_death_card(card: DeathCard) -> DeathCardRead:
    return DeathCardRead(
        id=str(card.id),
        name=card.name,
        summary=card.summary,
        tags=card.tags or [],
        mechanical_hooks=card.mechanical_hooks or {},
    )


def _serialize_body_card(card: BodyCard) -> BodyCardRead:
    return BodyCardRead(
        id=str(card.id),
        name=card.name,
        summary=card.summary,
        stat_mods=card.stat_mods or {},
        spd_mod=card.spd_mod,
        archetype_hint=card.archetype_hint,
        mechanical_hooks=card.mechanical_hooks or {},
    )


def _serialize_seed_card(card: SeedCard) -> SeedCardRead:
    return SeedCardRead(
        id=str(card.id),
        colour=card.colour,
        aspect=card.aspect,
        keywords=card.keywords or [],
        mechanical_bias=card.mechanical_bias or {},
    )


@router.get("/death-cards")
def list_death_cards(db: Session = Depends(get_db)):
    items = db.query(DeathCard).all()
    return {"items": [_serialize_death_card(card) for card in items], "total": len(items)}


@router.post("/death-cards", status_code=status.HTTP_201_CREATED)
def create_death_card(payload: DeathCardCreate, db: Session = Depends(get_db)):
    card = DeathCard(
        name=payload.name,
        summary=payload.summary,
        tags=payload.tags,
        mechanical_hooks=payload.mechanical_hooks,
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return _serialize_death_card(card)


@router.get("/body-cards")
def list_body_cards(db: Session = Depends(get_db)):
    items = db.query(BodyCard).all()
    return {"items": [_serialize_body_card(card) for card in items], "total": len(items)}


@router.post("/body-cards", status_code=status.HTTP_201_CREATED)
def create_body_card(payload: BodyCardCreate, db: Session = Depends(get_db)):
    card = BodyCard(
        name=payload.name,
        summary=payload.summary,
        stat_mods=payload.stat_mods,
        spd_mod=payload.spd_mod,
        archetype_hint=payload.archetype_hint,
        mechanical_hooks=payload.mechanical_hooks,
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return _serialize_body_card(card)


@router.get("/seed-cards")
def list_seed_cards(db: Session = Depends(get_db)):
    items = db.query(SeedCard).all()
    return {"items": [_serialize_seed_card(card) for card in items], "total": len(items)}


@router.post("/seed-cards", status_code=status.HTTP_201_CREATED)
def create_seed_card(payload: SeedCardCreate, db: Session = Depends(get_db)):
    card = SeedCard(
        colour=payload.colour,
        aspect=payload.aspect,
        keywords=payload.keywords,
        mechanical_bias=payload.mechanical_bias,
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return _serialize_seed_card(card)

