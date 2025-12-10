from typing import Optional

from pydantic import BaseModel, Field

from app.models.boss_templates import BossRank


class BossTemplateBase(BaseModel):
    name: Optional[str] = None
    rank: Optional[BossRank] = None
    traits: dict = Field(default_factory=dict)


class BossTemplateCreate(BossTemplateBase):
    name: str
    rank: BossRank


class BossTemplateUpdate(BossTemplateBase):
    pass


class BossTemplateRead(BossTemplateBase):
    id: str

    class Config:
        orm_mode = True

