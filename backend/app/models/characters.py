"""Character models matching schema.sql."""
import uuid

from sqlalchemy import Column, DateTime, Enum, Integer, Numeric, String, Text, func
from sqlalchemy.orm import relationship

from app.models.base import Base
from app.models.enums import CharacterType, SpeedBand
from app.models.types import UUIDType


class Character(Base):
    __tablename__ = "characters"

    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    type = Column(Enum(CharacterType, name="character_type", create_type=False), nullable=False)
    
    # Progression
    sc = Column(Integer, nullable=False, default=1)
    seq_lvl = Column(Integer, nullable=False, default=1)
    realm_lvl = Column(Integer, nullable=False, default=1)
    
    # Core Stats
    bod = Column(Integer, nullable=False)
    mnd = Column(Integer, nullable=False)
    sol = Column(Integer, nullable=False)
    
    # Aether
    ae_max = Column(Numeric, nullable=False)
    ae_reg = Column(Numeric, nullable=False)
    strain_cap = Column(Numeric, nullable=False)
    
    # HP Pools
    thp_max = Column(Numeric, nullable=False)
    php_max = Column(Numeric, nullable=False)
    mshp_max = Column(Numeric, nullable=False)
    
    # Defence
    dr = Column(Numeric, nullable=False)
    
    # Guard
    guard_base_charges = Column(Integer, nullable=False)
    guard_prr = Column(Integer, nullable=False)
    guard_mrr = Column(Integer, nullable=False)
    guard_srr = Column(Integer, nullable=False)
    
    # Speed
    spd_raw = Column(Integer, nullable=False)
    spd_band = Column(Enum(SpeedBand, name="speed_band", create_type=False), nullable=False)
    
    # Fate Profile
    death_card_id = Column(UUIDType, nullable=True)
    body_card_id = Column(UUIDType, nullable=True)
    soul_thesis = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
