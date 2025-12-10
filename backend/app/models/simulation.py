"""Simulation configuration and result models."""
import uuid

from sqlalchemy import JSON, Boolean, Column, DateTime, Float, Integer, Text, func
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base


class SimulationConfig(Base):
    """Configuration for a combat simulation."""

    __tablename__ = "simulation_configs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=True)
    description = Column(Text, nullable=True)

    # Party configuration
    party_character_ids = Column(JSON, nullable=False)  # List of Character UUIDs

    # Boss configuration
    boss_template_id = Column(UUID(as_uuid=True), nullable=False)

    # Simulation parameters
    trials = Column(Integer, nullable=False, default=1000)  # Number of Monte Carlo trials
    max_rounds = Column(Integer, nullable=False, default=50)  # Max rounds per trial
    random_seed = Column(Integer, nullable=True)  # For reproducible results

    # Combat mode
    enable_3_stage = Column(Boolean, nullable=False, default=False)  # 3-stage vs 1-beat
    quick_actions_mode = Column(Boolean, nullable=False, default=False)  # Enable quick actions

    # Decision policy (simple string for now, can be JSON for complex policies)
    decision_policy = Column(Text, nullable=True, default="balanced")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class SimulationResult(Base):
    """Results from a combat simulation."""

    __tablename__ = "simulation_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    simulation_config_id = Column(UUID(as_uuid=True), nullable=False)

    # Overall results
    win_rate = Column(Float, nullable=False)  # Percentage of party wins
    avg_rounds = Column(Float, nullable=False)  # Average rounds to completion

    # Per-character statistics
    damage_by_character = Column(JSON, nullable=False)  # {char_id: total_damage}

    # Time-series data
    ae_curves = Column(JSON, nullable=True)  # Average AE per character per round
    strain_curves = Column(JSON, nullable=True)  # Average Strain per character per round

    # Additional metrics
    boss_kills = Column(Integer, nullable=False, default=0)  # Number of boss kills
    party_wipes = Column(Integer, nullable=False, default=0)  # Number of party wipes
    timeouts = Column(Integer, nullable=False, default=0)  # Number of max_rounds timeouts

    # Metadata
    completed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
