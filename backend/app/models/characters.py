import enum
import uuid

from sqlalchemy import JSON, Column, DateTime, Enum, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base


class CharacterType(str, enum.Enum):
    pc = "pc"
    npc = "npc"
    boss = "boss"


class Character(Base):
    __tablename__ = "characters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    type = Column(Enum(CharacterType, name="character_type"), nullable=False)
    level = Column(Integer, nullable=True)
    lineage = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    stats = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
