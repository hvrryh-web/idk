"""Technique models matching schema.sql."""
from sqlalchemy import Column, DateTime, Enum, Numeric, Text, func

from app.models.base import Base
from app.models.enums import TechniqueAxis, TechniqueTier
from app.models.types import JSONType


class Technique(Base):
    __tablename__ = "techniques"

    id = Column(Text, primary_key=True)  # String key like 'Karma_Innate'
    name = Column(Text, nullable=False)
    tier = Column(Enum(TechniqueTier, name="technique_tier", create_type=False), nullable=False)
    archetype = Column(Text, nullable=True)
    axis = Column(Enum(TechniqueAxis, name="technique_axis", create_type=False), nullable=False)
    target_pool = Column(Text, nullable=False)  # 'PHP', 'MSHP', or 'mixed'
    
    # Core Stats
    base_offrank_bias = Column(Numeric, nullable=False, default=0)
    base_damage = Column(Numeric, nullable=False, default=0)
    ae_cost = Column(Numeric, nullable=False, default=0)
    self_strain = Column(Numeric, nullable=False, default=0)
    
    # Damage Routing
    damage_to_thp = Column(Numeric, nullable=False, default=1)
    damage_to_php = Column(Numeric, nullable=False, default=0)
    damage_to_mshp = Column(Numeric, nullable=False, default=0)
    
    # Special Effects
    boss_strain_on_hit = Column(Numeric, nullable=False, default=0)
    dr_debuff = Column(Numeric, nullable=False, default=0)
    
    # JSON/JSONB fields
    ally_shield = Column(JSONType, nullable=True)
    build_meta = Column(JSONType, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
