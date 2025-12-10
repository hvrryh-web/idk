from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.fate_cards import FateAspect, FateColour


class DeathCardBase(BaseModel):
    name: Optional[str] = None
    summary: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    mechanical_hooks: dict = Field(default_factory=dict)


class DeathCardCreate(DeathCardBase):
    name: str
    summary: str


class DeathCardRead(DeathCardBase):
    id: str

    class Config:
        orm_mode = True


class BodyCardBase(BaseModel):
    name: Optional[str] = None
    summary: Optional[str] = None
    stat_mods: dict = Field(default_factory=dict)
    spd_mod: int = 0
    archetype_hint: Optional[str] = None
    mechanical_hooks: dict = Field(default_factory=dict)


class BodyCardCreate(BodyCardBase):
    name: str
    summary: str


class BodyCardRead(BodyCardBase):
    id: str

    class Config:
        orm_mode = True


class SeedCardBase(BaseModel):
    colour: Optional[FateColour] = None
    aspect: Optional[FateAspect] = None
    keywords: List[str] = Field(default_factory=list)
    mechanical_bias: dict = Field(default_factory=dict)


class SeedCardCreate(SeedCardBase):
    colour: FateColour
    aspect: FateAspect


class SeedCardRead(SeedCardBase):
    id: str

    class Config:
        orm_mode = True

