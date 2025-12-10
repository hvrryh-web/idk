"""Simulation models matching schema.sql."""
import uuid

from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Integer, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID

from app.models.base import Base
from app.models.enums import QuickActionsMode, SimStatus


class SimulationConfig(Base):
    __tablename__ = "simulation_configs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    party_character_ids = Column(JSONB, nullable=False)  # Array of character UUID strings
    boss_template_id = Column(Text, ForeignKey("boss_templates.id"), nullable=False)
    rounds_max = Column(Integer, nullable=False)
    trials = Column(Integer, nullable=False)
    enable_3_stage = Column(Boolean, nullable=False, default=False)
    quick_actions_mode = Column(
        Enum(QuickActionsMode, name="quick_actions_mode", create_type=False),
        nullable=False,
        default=QuickActionsMode.none,
    )
    decision_policy = Column(JSONB, nullable=False, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class SimulationRun(Base):
    __tablename__ = "simulation_runs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    config_id = Column(UUID(as_uuid=True), ForeignKey("simulation_configs.id", ondelete="CASCADE"), nullable=False)
    status = Column(
        Enum(SimStatus, name="sim_status", create_type=False),
        nullable=False,
        default=SimStatus.pending,
    )
    metrics = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
