"""Technique schemas matching OpenAPI spec."""
from typing import Optional

from pydantic import BaseModel

from app.models.enums import TechniqueAxis, TechniqueTier


class TechniqueDamageRouting(BaseModel):
    to_thp: float
    to_php: float
    to_mshp: float


class TechniqueCreate(BaseModel):
    id: str
    name: str
    tier: TechniqueTier
    archetype: Optional[str] = None
    axis: TechniqueAxis
    target_pool: str  # 'PHP', 'MSHP', or 'mixed'
    base_offrank_bias: Optional[float] = 0
    base_damage: Optional[float] = 0
    ae_cost: Optional[float] = 0
    self_strain: Optional[float] = 0
    damage_routing: Optional[TechniqueDamageRouting] = None
    boss_strain_on_hit: Optional[float] = 0
    dr_debuff: Optional[float] = 0
    ally_shield: Optional[dict] = None
    build_meta: Optional[dict] = None


class TechniqueUpdate(BaseModel):
    name: Optional[str] = None
    tier: Optional[TechniqueTier] = None
    archetype: Optional[str] = None
    axis: Optional[TechniqueAxis] = None
    target_pool: Optional[str] = None
    base_offrank_bias: Optional[float] = None
    base_damage: Optional[float] = None
    ae_cost: Optional[float] = None
    self_strain: Optional[float] = None
    damage_routing: Optional[TechniqueDamageRouting] = None
    boss_strain_on_hit: Optional[float] = None
    dr_debuff: Optional[float] = None
    ally_shield: Optional[dict] = None
    build_meta: Optional[dict] = None


class TechniqueRead(BaseModel):
    id: str
    name: str
    tier: TechniqueTier
    archetype: Optional[str] = None
    axis: TechniqueAxis
    target_pool: str
    base_offrank_bias: float
    base_damage: float
    ae_cost: float
    self_strain: float
    damage_routing: TechniqueDamageRouting
    boss_strain_on_hit: float
    dr_debuff: float
    ally_shield: Optional[dict] = None
    build_meta: Optional[dict] = None

    class Config:
        orm_mode = True

    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=obj.id,
            name=obj.name,
            tier=obj.tier,
            archetype=obj.archetype,
            axis=obj.axis,
            target_pool=obj.target_pool,
            base_offrank_bias=float(obj.base_offrank_bias),
            base_damage=float(obj.base_damage),
            ae_cost=float(obj.ae_cost),
            self_strain=float(obj.self_strain),
            damage_routing=TechniqueDamageRouting(
                to_thp=float(obj.damage_to_thp),
                to_php=float(obj.damage_to_php),
                to_mshp=float(obj.damage_to_mshp),
            ),
            boss_strain_on_hit=float(obj.boss_strain_on_hit),
            dr_debuff=float(obj.dr_debuff),
            ally_shield=obj.ally_shield,
            build_meta=obj.build_meta,
        )
