import enum
import uuid

from sqlalchemy import Column, Enum, Float, Integer, String, Text, JSON
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base


class TechniqueType(str, enum.Enum):
    """Technique type for AE cost classification."""

    basic = "Basic"  # Low AE cost
    standard = "Standard"  # Medium AE cost
    major = "Major"  # High AE cost
    spike = "Spike"  # Boss-specific high-cost technique


class DamageRouting(str, enum.Enum):
    """How damage is applied to the target."""

    thp = "THP"  # Direct damage to THP
    guard = "Guard"  # Damage to Guard first, then THP
    strain = "Strain"  # Direct strain damage


class Technique(Base):
    __tablename__ = "techniques"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    # Combat mechanics
    technique_type = Column(Enum(TechniqueType, name="technique_type"), nullable=True)
    base_damage = Column(Integer, nullable=True, default=0)  # Kept for backward compatibility
    ae_cost = Column(Integer, nullable=True, default=0)  # Action Energy cost
    self_strain = Column(Integer, nullable=True, default=0)  # Strain inflicted on self
    damage_routing = Column(
        Enum(DamageRouting, name="damage_routing"), nullable=True, default=DamageRouting.thp
    )
    boss_strain_on_hit = Column(Integer, nullable=True, default=0)  # Strain to boss on hit
    dr_debuff = Column(Float, nullable=True, default=0.0)  # DR reduction (0.0-1.0)

    # Phase 2: New fields for data-driven combat
    attack_bonus = Column(Integer, nullable=True, default=0)  # Modifier for attack roll/damage
    effect_rank = Column(Integer, nullable=True, default=0)  # Effect magnitude (0-10)
    max_scl = Column(Integer, nullable=True)  # Maximum SCL allowed to use this technique

    # Phase 2: Cost requirements
    cost = Column(JSON, nullable=True)  # {"blood": 0, "fate": 0, "stain": 0}

    # Quick action properties
    is_quick_action = Column(Integer, nullable=True, default=0)  # Boolean: 1=quick, 0=major
