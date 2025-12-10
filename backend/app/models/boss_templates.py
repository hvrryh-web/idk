import enum
from sqlalchemy import Column, DateTime, Enum, JSON, String, Text, text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models import Base


class BossRank(str, enum.Enum):
    Lieutenant = "Lieutenant"
    Major = "Major"
    General = "General"
    Boss = "Boss"
    Final = "Final"


class BossTemplate(Base):
    __tablename__ = "boss_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String, nullable=False)
    rank = Column(Enum(BossRank, name="boss_rank"), nullable=False)
    traits = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    simulations = relationship("SimulationConfig", back_populates="boss_template", cascade="all, delete")


__all__ = ["BossTemplate", "BossRank"]
