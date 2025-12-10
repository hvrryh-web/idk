from pydantic import BaseModel


class EffectModuleBase(BaseModel):
    id: str
    name: str
    base_cost_per_rank: float


class EffectModuleCreate(EffectModuleBase):
    pass


class EffectModuleRead(EffectModuleBase):
    class Config:
        orm_mode = True

