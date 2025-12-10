from typing import Optional

from pydantic import BaseModel

from app.models.techniques import TechniqueAxis, TechniqueCategory
from app.schemas.techniques import TechniqueBuildMeta


class InnateBuildRequest(BaseModel):
    character_id: Optional[str] = None
    technique_id: Optional[str] = None
    name: str
    archetype: Optional[str] = None
    axis: TechniqueAxis
    target_pool: str
    base_damage: float = 0
    ae_cost: float = 0
    self_strain: float = 0
    boss_strain_on_hit: float = 0
    dr_debuff: float = 0
    damage_to_thp: float = 1
    damage_to_php: float = 0
    damage_to_mshp: float = 0
    build_meta: Optional[TechniqueBuildMeta] = None
    attach_category: TechniqueCategory = TechniqueCategory.basic


class InnateBuildResponse(BaseModel):
    technique_id: str
    character_id: Optional[str] = None

