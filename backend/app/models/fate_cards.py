from sqlalchemy import Column, Enum, ForeignKey, Integer, JSON, String, Table, Text, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models import Base
from app.models.characters import Character
import enum


class FateColour(str, enum.Enum):
    Red = "Red"
    Blue = "Blue"
    Green = "Green"
    Black = "Black"
    Gold = "Gold"


class FateAspect(str, enum.Enum):
    Body = "Body"
    Mind = "Mind"
    Soul = "Soul"


character_seed_cards = Table(
    "character_seed_cards",
    Base.metadata,
    Column("character_id", UUID(as_uuid=True), ForeignKey("characters.id", ondelete="CASCADE"), primary_key=True),
    Column("seed_card_id", UUID(as_uuid=True), ForeignKey("seed_cards.id", ondelete="CASCADE"), primary_key=True),
)


class DeathCard(Base):
    __tablename__ = "death_cards"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    tags = Column(JSON, nullable=False, server_default=text("'[]'::jsonb"))
    mechanical_hooks = Column(JSON, nullable=False, server_default=text("'{}'::jsonb"))

    characters = relationship("Character", back_populates="death_card")


class BodyCard(Base):
    __tablename__ = "body_cards"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    stat_mods = Column(JSON, nullable=False, server_default=text("'{}'::jsonb"))
    spd_mod = Column(Integer, nullable=False, server_default=text("0"))
    archetype_hint = Column(Text)
    mechanical_hooks = Column(JSON, nullable=False, server_default=text("'{}'::jsonb"))

    characters = relationship("Character", back_populates="body_card")


class SeedCard(Base):
    __tablename__ = "seed_cards"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    colour = Column(Enum(FateColour, name="fate_colour"), nullable=False)
    aspect = Column(Enum(FateAspect, name="fate_aspect"), nullable=False)
    keywords = Column(JSON, nullable=False, server_default=text("'[]'::jsonb"))
    mechanical_bias = Column(JSON, nullable=False, server_default=text("'{}'::jsonb"))

    characters = relationship(
        "Character", secondary=character_seed_cards, back_populates="seed_cards"
    )


__all__ = [
    "FateColour",
    "FateAspect",
    "DeathCard",
    "BodyCard",
    "SeedCard",
    "character_seed_cards",
]
