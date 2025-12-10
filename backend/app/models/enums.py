"""Enums matching schema.sql enum types."""
import enum


class CharacterType(str, enum.Enum):
    PC = "PC"
    Boss = "Boss"
    NPC = "NPC"


class SpeedBand(str, enum.Enum):
    Normal = "Normal"
    Fast = "Fast"
    SuperFast = "SuperFast"


class TechniqueTier(str, enum.Enum):
    Basic = "Basic"
    Std = "Std"
    Maj = "Maj"
    Innate = "Innate"


class TechniqueAxis(str, enum.Enum):
    Body = "Body"
    Mind = "Mind"
    Soul = "Soul"
    Mixed = "Mixed"


class FateColour(str, enum.Enum):
    Red = "Red"
    Blue = "Blue"
    Green = "Green"
    Black = "Black"
    Gold = "Gold"


class FateAspect(str, enum.Enum):
    Body = "Body"
    Mind = "Mind"
    Soul = "Soul"


class BossRank(str, enum.Enum):
    Lieutenant = "Lieutenant"
    Major = "Major"
    General = "General"
    Boss = "Boss"
    Final = "Final"


class QuickActionsMode(str, enum.Enum):
    none = "none"
    defensive_only = "defensive_only"
    full = "full"


class SimStatus(str, enum.Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"
