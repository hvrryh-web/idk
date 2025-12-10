"""Fate cards CRUD routers matching OpenAPI spec."""
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

# Death Cards
death_cards_router = APIRouter(prefix="/fate/death-cards", tags=["FateCards"])


@death_cards_router.get("/", response_model=dict)
def list_death_cards(db: Session = Depends(get_db)):
    """List Hero's Death cards."""
    items = db.query(DeathCard).all()
    return {"items": items}


@death_cards_router.post("/", response_model=DeathCardRead, status_code=status.HTTP_201_CREATED)
def create_death_card(payload: DeathCardCreate, db: Session = Depends(get_db)):
    """Create Hero's Death card."""
    card = DeathCard(
        name=payload.name,
        summary=payload.summary or "",
        tags=payload.tags or [],
        mechanical_hooks=payload.mechanical_hooks or {},
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


# Body Cards
body_cards_router = APIRouter(prefix="/fate/body-cards", tags=["FateCards"])


@body_cards_router.get("/", response_model=dict)
def list_body_cards(db: Session = Depends(get_db)):
    """List Re:Life Body cards."""
    items = db.query(BodyCard).all()
    return {"items": items}


@body_cards_router.post("/", response_model=BodyCardRead, status_code=status.HTTP_201_CREATED)
def create_body_card(payload: BodyCardCreate, db: Session = Depends(get_db)):
    """Create Re:Life Body card."""
    card = BodyCard(
        name=payload.name,
        summary=payload.summary or "",
        stat_mods=payload.stat_mods or {},
        spd_mod=payload.spd_mod or 0,
        archetype_hint=payload.archetype_hint,
        mechanical_hooks=payload.mechanical_hooks or {},
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


# Seed Cards
seed_cards_router = APIRouter(prefix="/fate/seed-cards", tags=["FateCards"])


@seed_cards_router.get("/", response_model=dict)
def list_seed_cards(db: Session = Depends(get_db)):
    """List Seed cards."""
    items = db.query(SeedCard).all()
    return {"items": items}


@seed_cards_router.post("/", response_model=SeedCardRead, status_code=status.HTTP_201_CREATED)
def create_seed_card(payload: SeedCardCreate, db: Session = Depends(get_db)):
    """Create Seed card."""
    card = SeedCard(
        colour=payload.colour,
        aspect=payload.aspect,
        keywords=payload.keywords or [],
        mechanical_bias=payload.mechanical_bias or {},
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card
