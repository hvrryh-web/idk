import enum
from sqlalchemy import Column, DateTime, Enum, ForeignKey, JSON, Numeric, String, Text, text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models import Base


class TechniqueTier(str, enum.Enum):
    Basic = "Basic"
    Std = "Std"
    Maj = "Maj"
    Innate = "Innate"


class TechniqueAxis(str, enum.Enum):
    Body = "Body"
    Mind = "Mind"
    Soul = "Soul"
    Mixed = "Mixed"


class Technique(Base):
    __tablename__ = "techniques"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    tier = Column(Enum(TechniqueTier, name="technique_tier"), nullable=False)
    archetype = Column(Text)
    axis = Column(Enum(TechniqueAxis, name="technique_axis"), nullable=False)
    target_pool = Column(String, nullable=False)

    base_offrank_bias = Column(Numeric, nullable=False, server_default=text("0"))
    base_damage = Column(Numeric, nullable=False, server_default=text("0"))
    ae_cost = Column(Numeric, nullable=False, server_default=text("0"))
    self_strain = Column(Numeric, nullable=False, server_default=text("0"))

    damage_to_thp = Column(Numeric, nullable=False, server_default=text("1"))
    damage_to_php = Column(Numeric, nullable=False, server_default=text("0"))
    damage_to_mshp = Column(Numeric, nullable=False, server_default=text("0"))

    boss_strain_on_hit = Column(Numeric, nullable=False, server_default=text("0"))
    dr_debuff = Column(Numeric, nullable=False, server_default=text("0"))

    ally_shield = Column(JSON)
    build_meta = Column(JSON)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    characters = relationship("CharacterTechnique", back_populates="technique")


class TechniqueCategory(str, enum.Enum):
    basic = "basic"
    std = "std"
    maj = "maj"


class CharacterTechnique(Base):
    __tablename__ = "character_techniques"

    character_id = Column(UUID(as_uuid=True), ForeignKey("characters.id", ondelete="CASCADE"), primary_key=True)
    technique_id = Column(String, ForeignKey("techniques.id", ondelete="CASCADE"), primary_key=True)
    category = Column(String, primary_key=True)

    character = relationship("Character", back_populates="techniques")
    technique = relationship("Technique", back_populates="characters")


__all__ = [
    "Technique",
    "TechniqueTier",
    "TechniqueAxis",
    "CharacterTechnique",
    "TechniqueCategory",
]
