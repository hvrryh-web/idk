import uuid

from sqlalchemy import Column, Enum, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base

# Minimal enum placeholder; ensure it aligns with the enum defined in schema.sql
CharacterTypeEnum = Enum(
    "pc",
    "npc",
    "boss",
    name="character_type",
    create_type=False,
)


class Character(Base):
    __tablename__ = "characters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    type = Column(CharacterTypeEnum, nullable=False)
    level = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
