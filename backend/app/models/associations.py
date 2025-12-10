"""Association/junction tables matching schema.sql."""
from sqlalchemy import Column, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base


class CharacterSeedCard(Base):
    __tablename__ = "character_seed_cards"

    character_id = Column(UUID(as_uuid=True), ForeignKey("characters.id", ondelete="CASCADE"), primary_key=True)
    seed_card_id = Column(UUID(as_uuid=True), ForeignKey("seed_cards.id", ondelete="CASCADE"), primary_key=True)


class CharacterTechnique(Base):
    __tablename__ = "character_techniques"

    character_id = Column(UUID(as_uuid=True), ForeignKey("characters.id", ondelete="CASCADE"), primary_key=True)
    technique_id = Column(Text, ForeignKey("techniques.id", ondelete="CASCADE"), primary_key=True)
    category = Column(Text, nullable=False, primary_key=True)  # 'basic', 'std', or 'maj'
