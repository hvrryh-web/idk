from typing import List, Optional
from pydantic import BaseModel

from app.models.techniques import TechniqueAxis, TechniqueTier


class TechniqueDamageRouting(BaseModel):
    to_thp: Optional[float] = None
    to_php: Optional[float] = None
    to_mshp: Optional[float] = None


class TechniqueBuildModule(BaseModel):
    id: Optional[str] = None
    rank: Optional[int] = None


class TechniqueBuildMeta(BaseModel):
    magic_rank: Optional[int] = None
    budget: Optional[float] = None
    base_cost_discounted: Optional[float] = None
    active_cost: Optional[float] = None
    real_cost: Optional[float] = None
    modules: List[TechniqueBuildModule] = []
    advantages: List[str] = []
    limitations: List[str] = []
    seed_colours: List[str] = []
    death_card: Optional[str] = None
    body_card: Optional[str] = None


class TechniqueBase(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    tier: Optional[TechniqueTier] = None
    archetype: Optional[str] = None
    axis: Optional[TechniqueAxis] = None
    target_pool: Optional[str] = None
    base_offrank_bias: Optional[float] = 0
    base_damage: Optional[float] = 0
    ae_cost: Optional[float] = 0
    self_strain: Optional[float] = 0
    damage_routing: Optional[TechniqueDamageRouting] = None
    boss_strain_on_hit: Optional[float] = 0
    dr_debuff: Optional[float] = 0
    ally_shield: Optional[dict] = None
    build_meta: Optional[TechniqueBuildMeta] = None


class TechniqueCreate(TechniqueBase):
    id: str
    name: str
    tier: TechniqueTier
    axis: TechniqueAxis
    target_pool: str


class TechniqueUpdate(TechniqueBase):
    pass


class TechniqueRead(TechniqueBase):
    id: str
    name: str
    tier: TechniqueTier
    axis: TechniqueAxis
    target_pool: str

    class Config:
        orm_mode = True
