"""Boss template models matching schema.sql."""
from sqlalchemy import Column, Enum, Integer, Numeric, Text
from sqlalchemy.dialects.postgresql import JSONB

from app.models.base import Base
from app.models.enums import BossRank


class BossTemplate(Base):
    __tablename__ = "boss_templates"

    id = Column(Text, primary_key=True)
    name = Column(Text, nullable=False)
    rank = Column(Enum(BossRank, name="boss_rank", create_type=False), nullable=False)
    sc_level = Column(Integer, nullable=False)
    sc_offset_from_party = Column(Integer, nullable=False, default=0)
    thp_factor = Column(Numeric, nullable=False)
    dmg_factor = Column(Numeric, nullable=False)
    dr_factor = Column(Numeric, nullable=False)
    minions = Column(JSONB, nullable=False, default=list)
    lieutenants = Column(JSONB, nullable=False, default=list)
