from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.simulations import QuickActionsMode, SimStatus


class SimulationConfigBase(BaseModel):
    name: Optional[str] = None
    boss_template_id: Optional[str] = None
    params: dict = Field(default_factory=dict)
    quick_actions_mode: QuickActionsMode = QuickActionsMode.none


class SimulationConfigCreate(SimulationConfigBase):
    name: str


class SimulationConfigRead(SimulationConfigBase):
    id: str
    created_at: datetime

    class Config:
        orm_mode = True


class SimulationRunRead(BaseModel):
    id: str
    config_id: str
    status: SimStatus
    result: Optional[dict] = None
    iterations: Optional[float] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        orm_mode = True

