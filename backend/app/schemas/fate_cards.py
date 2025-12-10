"""Fate card schemas matching OpenAPI spec."""
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel

from app.models.enums import FateAspect, FateColour


class DeathCardCreate(BaseModel):
    name: str
    summary: Optional[str] = ""
    tags: Optional[List[str]] = []
    mechanical_hooks: Optional[dict] = {}


class DeathCardRead(BaseModel):
    id: UUID
    name: str
    summary: str
    tags: List[str]
    mechanical_hooks: dict

    class Config:
        orm_mode = True


class BodyCardCreate(BaseModel):
    name: str
    summary: Optional[str] = ""
    stat_mods: Optional[dict] = {}
    spd_mod: Optional[int] = 0
    archetype_hint: Optional[str] = None
    mechanical_hooks: Optional[dict] = {}


class BodyCardRead(BaseModel):
    id: UUID
    name: str
    summary: str
    stat_mods: dict
    spd_mod: int
    archetype_hint: Optional[str] = None
    mechanical_hooks: dict

    class Config:
        orm_mode = True


class SeedCardCreate(BaseModel):
    colour: FateColour
    aspect: FateAspect
    keywords: Optional[List[str]] = []
    mechanical_bias: Optional[dict] = {}


class SeedCardRead(BaseModel):
    id: UUID
    colour: FateColour
    aspect: FateAspect
    keywords: List[str]
    mechanical_bias: dict

    class Config:
        orm_mode = True
