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

    # Extra columns from schema
    sc = Column(Integer, nullable=True)
    seq_lvl = Column(Integer, nullable=True)
    realm_lvl = Column(Integer, nullable=True)
    bod = Column(Integer, nullable=True)
    mnd = Column(Integer, nullable=True)
    sol = Column(Integer, nullable=True)
    ae_max = Column(Integer, nullable=True)
    strain_cap = Column(Integer, nullable=True)
    thp_max = Column(Integer, nullable=True)
    php_max = Column(Integer, nullable=True)
    mshp_max = Column(Integer, nullable=True)
    guard_base_charges = Column(Integer, nullable=True)
    guard_prr = Column(Integer, nullable=True)
    guard_mrr = Column(Integer, nullable=True)
    guard_srr = Column(Integer, nullable=True)
    spd_raw = Column(Integer, nullable=True)
    death_card_id = Column(UUID(as_uuid=True), nullable=True)
    body_card_id = Column(UUID(as_uuid=True), nullable=True)
    soul_thesis = Column(Text, nullable=True)

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
        def safe_int(val):
            if hasattr(val, 'key'):
                return 0
            return int(val) if val is not None else 0

        primary_stats = [
            safe_int(self.strength),
            safe_int(self.dexterity),
            safe_int(self.constitution),
            safe_int(self.intelligence),
            safe_int(self.wisdom),
            safe_int(self.charisma),
            safe_int(self.perception),
            safe_int(self.resolve),
            safe_int(self.presence),
        ]
        primary_sum = sum(primary_stats)
        aether_sum = safe_int(self.aether_fire) + safe_int(self.aether_ice) + safe_int(self.aether_void)
        scl_primary = math.floor(primary_sum / 9)
        scl_aether = math.floor((aether_sum / 3) * 0.5)
        return scl_primary + scl_aether

    @scl.expression
    def scl_expr(cls):
        primary_sum = (
            (cls.strength + cls.dexterity + cls.constitution + cls.intelligence +
             cls.wisdom + cls.charisma + cls.perception + cls.resolve + cls.presence)
        )
        aether_sum = cls.aether_fire + cls.aether_ice + cls.aether_void
        return func.floor(primary_sum / 9) + func.floor((aether_sum / 3) * 0.5)
