"""Character schemas matching OpenAPI spec."""
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel

from app.models.enums import CharacterType, SpeedBand


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


class CharacterDefence(BaseModel):
    dr: float
    guard: dict  # Contains base_charges, prr, mrr, srr


class CharacterSpeed(BaseModel):
    spd_raw: int
    spd_band: SpeedBand


class CharacterFateProfile(BaseModel):
    death_card_id: Optional[str] = None
    body_card_id: Optional[str] = None
    seed_card_ids: List[str] = []
    soul_thesis: Optional[str] = None


class CharacterTechniqueProfile(BaseModel):
    basic_ids: Optional[List[str]] = []
    std_ids: Optional[List[str]] = []
    maj_ids: Optional[List[str]] = []


class CharacterCreate(BaseModel):
    name: str
    type: CharacterType
    core_stats: CharacterCoreStats
    aether: CharacterAetherStats
    hp: CharacterHPStats
    defence: CharacterDefence
    speed: Optional[dict] = None  # Just spd_raw for creation
    fate_profile: Optional[CharacterFateProfile] = None


class CharacterUpdate(BaseModel):
    name: Optional[str] = None
    core_stats: Optional[CharacterCoreStats] = None
    aether: Optional[CharacterAetherStats] = None
    hp: Optional[CharacterHPStats] = None
    defence: Optional[CharacterDefence] = None
    speed: Optional[CharacterSpeed] = None
    fate_profile: Optional[CharacterFateProfile] = None
    technique_profile: Optional[CharacterTechniqueProfile] = None


class CharacterRead(BaseModel):
    id: UUID
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
    fate_profile: Optional[CharacterFateProfile] = None
    technique_profile: Optional[CharacterTechniqueProfile] = None

    class Config:
        orm_mode = True

    @classmethod
    def from_orm(cls, obj):
        # Convert flat DB model to nested Pydantic model
        return cls(
            id=obj.id,
            name=obj.name,
            type=obj.type,
            sc=obj.sc,
            seq_lvl=obj.seq_lvl,
            realm_lvl=obj.realm_lvl,
            core_stats=CharacterCoreStats(
                bod=obj.bod,
                mnd=obj.mnd,
                sol=obj.sol,
            ),
            aether=CharacterAetherStats(
                ae_max=float(obj.ae_max),
                ae_reg=float(obj.ae_reg),
                strain_cap=float(obj.strain_cap),
            ),
            hp=CharacterHPStats(
                thp_max=float(obj.thp_max),
                php_max=float(obj.php_max),
                mshp_max=float(obj.mshp_max),
            ),
            defence=CharacterDefence(
                dr=float(obj.dr),
                guard={
                    "base_charges": obj.guard_base_charges,
                    "prr": obj.guard_prr,
                    "mrr": obj.guard_mrr,
                    "srr": obj.guard_srr,
                },
            ),
            speed=CharacterSpeed(
                spd_raw=obj.spd_raw,
                spd_band=obj.spd_band,
            ),
            fate_profile=CharacterFateProfile(
                death_card_id=str(obj.death_card_id) if obj.death_card_id else None,
                body_card_id=str(obj.body_card_id) if obj.body_card_id else None,
                seed_card_ids=[],  # Would need join query
                soul_thesis=obj.soul_thesis,
            ),
            technique_profile=CharacterTechniqueProfile(),  # Would need join query
        )
