import enum
from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, Numeric, String, Text, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models import Base


class CharacterType(str, enum.Enum):
    PC = "PC"
    Boss = "Boss"
    NPC = "NPC"


class SpeedBand(str, enum.Enum):
    Normal = "Normal"
    Fast = "Fast"
    SuperFast = "SuperFast"


class Character(Base):
    __tablename__ = "characters"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String, nullable=False)
    type = Column(Enum(CharacterType, name="character_type"), nullable=False)

    sc = Column(Integer, nullable=False, server_default=text("1"))
    seq_lvl = Column(Integer, nullable=False, server_default=text("1"))
    realm_lvl = Column(Integer, nullable=False, server_default=text("1"))

    bod = Column(Integer, nullable=False)
    mnd = Column(Integer, nullable=False)
    sol = Column(Integer, nullable=False)

    ae_max = Column(Numeric, nullable=False)
    ae_reg = Column(Numeric, nullable=False)
    strain_cap = Column(Numeric, nullable=False)

    thp_max = Column(Numeric, nullable=False)
    php_max = Column(Numeric, nullable=False)
    mshp_max = Column(Numeric, nullable=False)

    dr = Column(Numeric, nullable=False)

    guard_base_charges = Column(Integer, nullable=False)
    guard_prr = Column(Integer, nullable=False)
    guard_mrr = Column(Integer, nullable=False)
    guard_srr = Column(Integer, nullable=False)

    spd_raw = Column(Integer, nullable=False)
    spd_band = Column(Enum(SpeedBand, name="speed_band"), nullable=False)

    death_card_id = Column(UUID(as_uuid=True), ForeignKey("death_cards.id"))
    body_card_id = Column(UUID(as_uuid=True), ForeignKey("body_cards.id"))
    soul_thesis = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    death_card = relationship("DeathCard", back_populates="characters")
    body_card = relationship("BodyCard", back_populates="characters")
    seed_cards = relationship("SeedCard", secondary="character_seed_cards", back_populates="characters")
    techniques = relationship(
        "CharacterTechnique", back_populates="character", cascade="all, delete-orphan"
    )


__all__ = ["Character", "CharacterType", "SpeedBand"]
