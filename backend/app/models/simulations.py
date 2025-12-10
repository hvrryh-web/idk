import enum
from sqlalchemy import Column, DateTime, Enum, ForeignKey, JSON, Numeric, String, Text, text, func
import enum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, JSON, Numeric, String, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models import Base
from app.models.boss_templates import BossTemplate


class QuickActionsMode(str, enum.Enum):
    none = "none"
    defensive_only = "defensive_only"
    full = "full"


class SimStatus(str, enum.Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"


class SimulationConfig(Base):
    __tablename__ = "simulation_configs"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String, nullable=False)
    boss_template_id = Column(UUID(as_uuid=True), ForeignKey("boss_templates.id"))
    params = Column(JSON, nullable=False, server_default=text("'{}'::jsonb"))
    quick_actions_mode = Column(
        Enum(QuickActionsMode, name="quick_actions_mode"),
        nullable=False,
        server_default=QuickActionsMode.none.value,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    boss_template = relationship("BossTemplate", back_populates="simulations")
    runs = relationship("SimulationRun", back_populates="config", cascade="all, delete-orphan")


class SimulationRun(Base):
    __tablename__ = "simulation_runs"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    config_id = Column(UUID(as_uuid=True), ForeignKey("simulation_configs.id"), nullable=False)
    status = Column(Enum(SimStatus, name="sim_status"), nullable=False, server_default=SimStatus.pending.value)
    result = Column(JSON)
    iterations = Column(Numeric)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True))

    config = relationship("SimulationConfig", back_populates="runs")


__all__ = [
    "SimulationConfig",
    "SimulationRun",
    "QuickActionsMode",
    "SimStatus",
]
