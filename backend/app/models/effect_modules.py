from sqlalchemy import Column, Numeric, String

from app.models import Base


class EffectModule(Base):
    __tablename__ = "effect_modules"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    base_cost_per_rank = Column(Numeric, nullable=False)


__all__ = ["EffectModule"]
