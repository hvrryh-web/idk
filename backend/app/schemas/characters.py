from typing import List, Optional
from pydantic import BaseModel, Field

from app.models.characters import CharacterType, SpeedBand


class CharacterCoreStats(BaseModel):
    bod: int
    mnd: int
    sol: int


class CharacterAetherStats(BaseModel):
    ae_max: float
    ae_reg: float
    strain_cap: float


class CharacterHPStats(BaseModel):
    thp_max: Optional[float] = None
    php_max: float
    mshp_max: float


class GuardStats(BaseModel):
    base_charges: int
    prr: int
    mrr: int
    srr: int


class CharacterDefence(BaseModel):
    dr: float
    guard: GuardStats


class CharacterSpeed(BaseModel):
    spd_raw: int
    spd_band: Optional[SpeedBand] = None


class CharacterFateProfile(BaseModel):
    death_card_id: Optional[str] = None
    body_card_id: Optional[str] = None
    seed_card_ids: List[str] = Field(default_factory=list)
    soul_thesis: Optional[str] = None


class CharacterTechniqueProfile(BaseModel):
    basic_ids: List[str] = Field(default_factory=list)
    std_ids: List[str] = Field(default_factory=list)
    maj_ids: List[str] = Field(default_factory=list)


class CharacterBase(BaseModel):
    name: Optional[str] = None
    core_stats: Optional[CharacterCoreStats] = None
    aether: Optional[CharacterAetherStats] = None
    hp: Optional[CharacterHPStats] = None
    defence: Optional[CharacterDefence] = None
    speed: Optional[CharacterSpeed] = None
    fate_profile: Optional[CharacterFateProfile] = None
    technique_profile: Optional[CharacterTechniqueProfile] = None


class CharacterCreate(CharacterBase):
    name: str
    type: CharacterType
    core_stats: CharacterCoreStats
    aether: CharacterAetherStats
    hp: CharacterHPStats
    defence: CharacterDefence


class CharacterUpdate(CharacterBase):
    pass


class CharacterRead(BaseModel):
    id: str
    name: str
    type: CharacterType
    sc: int
    seq_lvl: int
    realm_lvl: int
    core_stats: CharacterCoreStats
    aether: CharacterAetherStats
    hp: CharacterHPStats
    defence: CharacterDefence
    speed: CharacterSpeed
    fate_profile: CharacterFateProfile
    technique_profile: CharacterTechniqueProfile

    class Config:
        orm_mode = True
