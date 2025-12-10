"""Fate card models matching schema.sql."""
import uuid

from sqlalchemy import Column, Enum, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID

from app.models.base import Base
from app.models.enums import FateAspect, FateColour


class DeathCard(Base):
    __tablename__ = "death_cards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    tags = Column(JSONB, nullable=False, default=list)
    mechanical_hooks = Column(JSONB, nullable=False, default=dict)


class BodyCard(Base):
    __tablename__ = "body_cards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    stat_mods = Column(JSONB, nullable=False, default=dict)
    spd_mod = Column(Integer, nullable=False, default=0)
    archetype_hint = Column(Text, nullable=True)
    mechanical_hooks = Column(JSONB, nullable=False, default=dict)


class SeedCard(Base):
    __tablename__ = "seed_cards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    colour = Column(Enum(FateColour, name="fate_colour", create_type=False), nullable=False)
    aspect = Column(Enum(FateAspect, name="fate_aspect", create_type=False), nullable=False)
    keywords = Column(JSONB, nullable=False, default=list)
    mechanical_bias = Column(JSONB, nullable=False, default=dict)
