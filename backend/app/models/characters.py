import enum
import math
import uuid

from sqlalchemy import JSON, Column, DateTime, Enum, Float, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.hybrid import hybrid_property

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

    # Primary stats (9)
    strength = Column(Integer, nullable=True, default=0)
    dexterity = Column(Integer, nullable=True, default=0)
    constitution = Column(Integer, nullable=True, default=0)
    intelligence = Column(Integer, nullable=True, default=0)
    wisdom = Column(Integer, nullable=True, default=0)
    charisma = Column(Integer, nullable=True, default=0)
    perception = Column(Integer, nullable=True, default=0)
    resolve = Column(Integer, nullable=True, default=0)
    presence = Column(Integer, nullable=True, default=0)

    # Aether stats (3)
    aether_fire = Column(Integer, nullable=True, default=0)
    aether_ice = Column(Integer, nullable=True, default=0)
    aether_void = Column(Integer, nullable=True, default=0)

    # Condition tracks (stored as JSONB for history)
    conditions = Column(JSON, nullable=True)

    # Cost tracks (stored as JSONB)
    cost_tracks = Column(JSON, nullable=True)

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

    @hybrid_property
    def scl(self) -> int:
        """
        Calculate Soul Cultivation Level (SCL) based on primary and aether stats.
        Formula: floor(sum(primary_stats)/9) + floor((sum(aether_stats)/3) * 0.5)
        """
        # Get primary stats, defaulting to 0 if None
        primary_sum = sum([
            self.strength or 0,
            self.dexterity or 0,
            self.constitution or 0,
            self.intelligence or 0,
            self.wisdom or 0,
            self.charisma or 0,
            self.perception or 0,
            self.resolve or 0,
            self.presence or 0,
        ])

        # Get aether stats, defaulting to 0 if None
        aether_sum = (self.aether_fire or 0) + (self.aether_ice or 0) + (self.aether_void or 0)

        scl_primary = math.floor(primary_sum / 9)
        scl_aether = math.floor((aether_sum / 3) * 0.5)

        return scl_primary + scl_aether
