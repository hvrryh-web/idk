import enum
import uuid

from sqlalchemy import JSON, Column, DateTime, Enum, Float, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base


class CharacterType(str, enum.Enum):
    pc = "pc"
    npc = "npc"
    boss = "boss"


class SPDBand(str, enum.Enum):
    """Speed band for turn ordering in 3-stage combat."""
    fast = "Fast"
    normal = "Normal"
    slow = "Slow"


class Character(Base):
    __tablename__ = "characters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    type = Column(Enum(CharacterType, name="character_type"), nullable=False)
    level = Column(Integer, nullable=True)
    lineage = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    stats = Column(JSON, nullable=True)
    
    # Combat stats for simulation
    thp = Column(Integer, nullable=True)  # Total Hit Points
    ae = Column(Integer, nullable=True)  # Action Energy
    ae_reg = Column(Integer, nullable=True, default=0)  # AE regeneration per round
    dr = Column(Float, nullable=True, default=0.0)  # Damage Reduction (0.0-1.0)
    strain = Column(Integer, nullable=True, default=0)  # Current strain
    guard = Column(Integer, nullable=True, default=0)  # Guard value
    spd_band = Column(Enum(SPDBand, name="spd_band"), nullable=True, default=SPDBand.normal)
    
    # Techniques (stored as list of technique IDs)
    techniques = Column(JSON, nullable=True)  # List of available technique IDs
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
