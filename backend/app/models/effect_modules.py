"""Effect module models matching schema.sql."""
from sqlalchemy import Column, Numeric, Text

from app.models.base import Base


class EffectModule(Base):
    __tablename__ = "effect_modules"

    id = Column(Text, primary_key=True)
    name = Column(Text, nullable=False)
    base_cost_per_rank = Column(Numeric, nullable=False)
