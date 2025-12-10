"""Association/junction tables matching schema.sql."""
from sqlalchemy import Column, ForeignKey, Text

from app.models.base import Base
from app.models.types import UUIDType


class CharacterSeedCard(Base):
    __tablename__ = "character_seed_cards"

    character_id = Column(UUIDType, ForeignKey("characters.id", ondelete="CASCADE"), primary_key=True)
    seed_card_id = Column(UUIDType, ForeignKey("seed_cards.id", ondelete="CASCADE"), primary_key=True)


class CharacterTechnique(Base):
    __tablename__ = "character_techniques"

    character_id = Column(UUIDType, ForeignKey("characters.id", ondelete="CASCADE"), primary_key=True)
    technique_id = Column(Text, ForeignKey("techniques.id", ondelete="CASCADE"), primary_key=True)
    category = Column(Text, nullable=False, primary_key=True)  # 'basic', 'std', or 'maj'
