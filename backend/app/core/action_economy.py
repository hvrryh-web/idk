"""
Action Economy Module

Implements ADR-0008: Turn Structure, Action Economy, and Scene Procedures
Implements ADR-0011: Sequence Level Scheduler and Multi-Stage Round Resolution

This module provides:
- SeqLVL (Sequence Level) calculations
- Action budget ladder (Base-X system)
- Speed bands (+fast, +very fast)
- Multi-stage round state machine
- Initiative and reaction ordering

Reference: docs/adr/ADR-0008-turn-structure-action-economy.md
Reference: docs/adr/ADR-0011-sequence-level-scheduler.md
Patch: ALPHA-0.4-20251212
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Tuple

# =============================================================================
# Constants (ADR-0008/0011 Locked)
# =============================================================================

BASE_X_DIVISOR = 3  # Action budget advances every 3 seqLVL
BASE_ACTIONS = {"major": 1, "minor": 1, "bonus": 1, "reaction": 1}


# =============================================================================
# Speed Band Enum
# =============================================================================

class SpeedBand(int, Enum):
    """Speed band modifiers per ADR-0008."""
    NORMAL = 0
    FAST = 1       # +fast
    VERY_FAST = 2  # +very fast


# =============================================================================
# Round Stage Enum
# =============================================================================

class RoundStage(int, Enum):
    """Round stages per ADR-0011."""
    START_OF_ROUND = 0
    BONUS_STAGE = 1
    MINOR_STAGE = 2
    MAJOR_STAGE = 3
    END_OF_ROUND = 4


# =============================================================================
# SeqLVL Calculations
# =============================================================================

def calculate_seq_lvl_base_from_scl(scl: int) -> int:
    """
    Calculate base sequence level from SCL per ADR-0008.

    seqLVL_base = 3 × max(1, SCL − 1)
    """
    return 3 * max(1, scl - 1)


def calculate_seq_lvl(
    scl: int,
    speed_band: SpeedBand = SpeedBand.NORMAL,
    over_scl_band: int = 0
) -> int:
    """
    Calculate effective sequence level per ADR-0008.

    seqLVL = seqLVL_base + (3 × SpeedBand) + (3 × Over-SCL Band)
    """
    base = calculate_seq_lvl_base_from_scl(scl)
    return base + (3 * speed_band.value) + (3 * over_scl_band)


def calculate_seq_lvl_band(seq_lvl: int) -> int:
    """Calculate seqLVL band (floor(seqLVL / 3))."""
    return seq_lvl // 3


# =============================================================================
# Action Budget
# =============================================================================

@dataclass
class ActionBudget:
    """Action budget for a round."""
    major: int = 1
    minor: int = 1
    bonus: int = 1
    reaction: int = 1
    nuance: int = 0  # From +very fast

    def total_actions(self) -> int:
        """Total non-reaction actions available."""
        return self.major + self.minor + self.bonus


def calculate_action_budget(
    seq_lvl: int,
    has_very_fast: bool = False
) -> ActionBudget:
    """
    Calculate action budget from seqLVL per ADR-0008.

    Base3: 1 Major, 1 Minor, 1 Bonus
    For each +3 seqLVL above 3, add in order: Bonus, Minor, Major (cycle)
    """
    bands_above_base = max(0, (seq_lvl - 3) // 3)

    major = 1
    minor = 1
    bonus = 1

    for i in range(bands_above_base):
        cycle_pos = i % 3
        if cycle_pos == 0:
            bonus += 1
        elif cycle_pos == 1:
            minor += 1
        else:
            major += 1

    nuance = 1 if has_very_fast else 0

    return ActionBudget(
        major=major,
        minor=minor,
        bonus=bonus,
        reaction=1,
        nuance=nuance
    )


def get_action_budget_table() -> Dict[int, ActionBudget]:
    """
    Generate the action budget table for reference.

    Returns a dict mapping seqLVL to ActionBudget.
    """
    table = {}
    for seq_lvl in range(3, 25, 3):
        table[seq_lvl] = calculate_action_budget(seq_lvl)
    return table


# =============================================================================
# Action Type Enum
# =============================================================================

class ActionType(str, Enum):
    """Action types per ADR-0008."""
    MAJOR = "Major"
    MINOR = "Minor"
    BONUS = "Bonus"
    REACTION = "Reaction"
    NUANCE = "Nuance"


# =============================================================================
# Reaction Tier
# =============================================================================

class ReactionTier(str, Enum):
    """Reaction tier per ADR-0008/0011."""
    BASIC = "Basic"
    IMPROVED = "Improved"      # +fast
    IMPROVED_PLUS = "ImprovedPlus"  # +very fast (Improved + Prepare + Nuance)


def get_reaction_tier(speed_band: SpeedBand) -> ReactionTier:
    """Get reaction tier from speed band."""
    if speed_band == SpeedBand.VERY_FAST:
        return ReactionTier.IMPROVED_PLUS
    elif speed_band == SpeedBand.FAST:
        return ReactionTier.IMPROVED
    else:
        return ReactionTier.BASIC


# =============================================================================
# Round State Machine
# =============================================================================

@dataclass
class Declaration:
    """An action declaration."""
    actor_id: str
    action_type: ActionType
    technique_id: Optional[str] = None
    target_ids: List[str] = field(default_factory=list)
    front_id: Optional[str] = None


@dataclass
class Reaction:
    """A pending reaction."""
    actor_id: str
    trigger_type: str
    technique_id: Optional[str] = None
    priority: int = 0  # Higher = resolves first
    seq_lvl: int = 0
    initiative: int = 0


@dataclass
class RoundState:
    """State of the current round."""
    round_number: int = 1
    current_stage: RoundStage = RoundStage.START_OF_ROUND
    declarations: Dict[RoundStage, List[Declaration]] = field(default_factory=dict)
    pending_reactions: List[Reaction] = field(default_factory=list)
    action_budgets_remaining: Dict[str, ActionBudget] = field(default_factory=dict)

    def advance_stage(self) -> RoundStage:
        """Advance to next stage, cycling to next round if needed."""
        if self.current_stage == RoundStage.END_OF_ROUND:
            self.round_number += 1
            self.current_stage = RoundStage.START_OF_ROUND
            self.declarations.clear()
        else:
            self.current_stage = RoundStage(self.current_stage.value + 1)
        return self.current_stage

    def add_declaration(self, stage: RoundStage, declaration: Declaration) -> None:
        """Add a declaration for a stage."""
        if stage not in self.declarations:
            self.declarations[stage] = []
        self.declarations[stage].append(declaration)

    def add_reaction(self, reaction: Reaction) -> None:
        """Add a pending reaction."""
        self.pending_reactions.append(reaction)
        # Sort by priority (descending), then seqLVL (descending), then initiative (descending)
        self.pending_reactions.sort(
            key=lambda r: (r.priority, r.seq_lvl, r.initiative),
            reverse=True
        )

    def pop_reaction(self) -> Optional[Reaction]:
        """Pop the highest priority reaction."""
        if self.pending_reactions:
            return self.pending_reactions.pop(0)
        return None

    def clear_reactions(self) -> None:
        """Clear all pending reactions."""
        self.pending_reactions.clear()


# =============================================================================
# Initiative
# =============================================================================

@dataclass
class InitiativeEntry:
    """An entry in the initiative order."""
    actor_id: str
    roll: int
    seq_lvl_band: int
    modifier: int
    total: int

    @property
    def sort_key(self) -> Tuple[int, int, str]:
        """Sort key for initiative ordering (descending)."""
        return (self.total, self.seq_lvl_band, self.actor_id)


def calculate_initiative_modifier(
    seq_lvl: int,
    skill_bonus: int = 0,
    tag_modifiers: int = 0
) -> int:
    """Calculate initiative modifier."""
    seq_lvl_band = calculate_seq_lvl_band(seq_lvl)
    return seq_lvl_band + skill_bonus + tag_modifiers


def create_initiative_entry(
    actor_id: str,
    d20_roll: int,
    seq_lvl: int,
    skill_bonus: int = 0,
    tag_modifiers: int = 0
) -> InitiativeEntry:
    """Create an initiative entry."""
    seq_lvl_band = calculate_seq_lvl_band(seq_lvl)
    modifier = seq_lvl_band + skill_bonus + tag_modifiers
    total = d20_roll + modifier

    return InitiativeEntry(
        actor_id=actor_id,
        roll=d20_roll,
        seq_lvl_band=seq_lvl_band,
        modifier=modifier,
        total=total
    )


def sort_initiative_order(entries: List[InitiativeEntry]) -> List[InitiativeEntry]:
    """Sort initiative entries in descending order."""
    return sorted(entries, key=lambda e: e.sort_key, reverse=True)


# =============================================================================
# Prepare State
# =============================================================================

@dataclass
class PreparedState:
    """A prepared state from the Prepare action."""
    actor_id: str
    source_action: ActionType  # What action was used to create this
    expires_at_round_end: bool = True
    consumed: bool = False

    # What the prepared state can be used for
    can_convert_bonus_to_minor: bool = True
    can_add_virtual_rank: bool = True
    virtual_rank_technique_id: Optional[str] = None
    can_open_reaction_window: bool = True
    reaction_technique_id: Optional[str] = None


# =============================================================================
# Combat State
# =============================================================================

@dataclass
class CombatState:
    """Complete state for a combat scene."""
    scene_id: str
    round_state: RoundState = field(default_factory=RoundState)
    initiative_order: List[InitiativeEntry] = field(default_factory=list)
    actor_seq_lvls: Dict[str, int] = field(default_factory=dict)
    actor_speed_bands: Dict[str, SpeedBand] = field(default_factory=dict)
    prepared_states: Dict[str, PreparedState] = field(default_factory=dict)

    def get_actor_action_budget(self, actor_id: str) -> ActionBudget:
        """Get action budget for an actor."""
        seq_lvl = self.actor_seq_lvls.get(actor_id, 3)
        speed_band = self.actor_speed_bands.get(actor_id, SpeedBand.NORMAL)
        has_very_fast = speed_band == SpeedBand.VERY_FAST
        return calculate_action_budget(seq_lvl, has_very_fast)

    def start_combat(self) -> None:
        """Initialize combat state."""
        self.round_state = RoundState()
        # Calculate action budgets for all actors
        for actor_id in self.actor_seq_lvls:
            budget = self.get_actor_action_budget(actor_id)
            self.round_state.action_budgets_remaining[actor_id] = budget

    def start_new_round(self) -> None:
        """Start a new round, refreshing action budgets."""
        self.round_state.round_number += 1
        self.round_state.current_stage = RoundStage.START_OF_ROUND
        self.round_state.declarations.clear()
        self.round_state.clear_reactions()

        # Refresh action budgets
        for actor_id in self.actor_seq_lvls:
            budget = self.get_actor_action_budget(actor_id)
            self.round_state.action_budgets_remaining[actor_id] = budget

        # Expire prepared states
        expired = [
            actor_id for actor_id, state in self.prepared_states.items()
            if state.expires_at_round_end
        ]
        for actor_id in expired:
            del self.prepared_states[actor_id]
