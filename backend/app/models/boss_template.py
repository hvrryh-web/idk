"""Boss template model for combat simulations."""
import uuid

from sqlalchemy import JSON, Column, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base


class BossTemplate(Base):
    """Boss template with combat stats for simulations."""

    __tablename__ = "boss_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Combat stats
    thp = Column(Integer, nullable=False)  # Total Hit Points
    ae = Column(Integer, nullable=False)  # Action Energy
    ae_reg = Column(Integer, nullable=False, default=0)  # AE regeneration per round
    dr = Column(Float, nullable=False, default=0.0)  # Damage Reduction (0.0-1.0)
    strain = Column(Integer, nullable=False, default=0)  # Current strain
    guard = Column(Integer, nullable=False, default=0)  # Guard value

    # Boss-specific
    spike_threshold = Column(Integer, nullable=True)  # AE threshold for spike actions

    # Techniques (stored as list of technique IDs)
    basic_technique_id = Column(UUID(as_uuid=True), nullable=True)
    spike_technique_id = Column(UUID(as_uuid=True), nullable=True)
    techniques = Column(JSON, nullable=True)  # List of available technique IDs
