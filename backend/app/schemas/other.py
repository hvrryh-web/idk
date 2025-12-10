"""Schemas for effect modules, boss templates, and simulations."""
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel

from app.models.enums import BossRank, QuickActionsMode, SimStatus


# Effect Modules
class EffectModuleCreate(BaseModel):
    id: str
    name: str
    base_cost_per_rank: float


class EffectModuleRead(BaseModel):
    id: str
    name: str
    base_cost_per_rank: float

    class Config:
        orm_mode = True


# Boss Templates
class BossTemplateCreate(BaseModel):
    id: str
    name: str
    rank: BossRank
    sc_level: int
    sc_offset_from_party: Optional[int] = 0
    thp_factor: float
    dmg_factor: float
    dr_factor: float
    minions: Optional[List[str]] = []
    lieutenants: Optional[List[str]] = []


class BossTemplateUpdate(BaseModel):
    name: Optional[str] = None
    rank: Optional[BossRank] = None
    sc_level: Optional[int] = None
    sc_offset_from_party: Optional[int] = None
    thp_factor: Optional[float] = None
    dmg_factor: Optional[float] = None
    dr_factor: Optional[float] = None
    minions: Optional[List[str]] = None
    lieutenants: Optional[List[str]] = None


class BossTemplateRead(BaseModel):
    id: str
    name: str
    rank: BossRank
    sc_level: int
    sc_offset_from_party: int
    thp_factor: float
    dmg_factor: float
    dr_factor: float
    minions: List[str]
    lieutenants: List[str]

    class Config:
        orm_mode = True


# Simulations
class SimulationConfigCreate(BaseModel):
    name: str
    party_character_ids: List[str]
    boss_template_id: str
    rounds_max: int
    trials: int
    enable_3_stage: Optional[bool] = False
    quick_actions_mode: Optional[QuickActionsMode] = QuickActionsMode.none
    decision_policy: Optional[dict] = {}


class SimulationConfigRead(BaseModel):
    id: UUID
    name: str
    party_character_ids: List[str]
    boss_template_id: str
    rounds_max: int
    trials: int
    enable_3_stage: bool
    quick_actions_mode: QuickActionsMode
    decision_policy: dict

    class Config:
        orm_mode = True


class SimulationRunRead(BaseModel):
    id: UUID
    config_id: UUID
    status: SimStatus
    metrics: Optional[dict] = None

    class Config:
        orm_mode = True
