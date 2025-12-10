"""Quick action implementations for 3-stage combat."""
from enum import Enum

from app.simulation.combat_state import CombatantState


class QuickActionType(str, Enum):
    """Types of quick actions available in 3-stage combat."""

    GUARD_SHIFT = "GUARD_SHIFT"
    DODGE = "DODGE"
    BRACE = "BRACE"
    AE_PULSE = "AE_PULSE"
    STRAIN_VENT = "STRAIN_VENT"
    STANCE_SWITCH = "STANCE_SWITCH"
    COUNTER_PREP = "COUNTER_PREP"


def execute_guard_shift(combatant: CombatantState, amount: int = 20):
    """
    Increase Guard by a flat amount.

    Args:
        combatant: The combatant performing the action
        amount: Guard points to add (default: 20)
    """
    combatant.guard += amount


def execute_dodge(combatant: CombatantState, dr_bonus: float = 0.15):
    """
    Temporarily increase DR for this round.

    Args:
        combatant: The combatant performing the action
        dr_bonus: DR bonus to add (default: 0.15 = 15%)
    """
    combatant.temp_dr_modifier += dr_bonus


def execute_brace(combatant: CombatantState, guard_bonus: int = 30, dr_bonus: float = 0.10):
    """
    Increase both Guard and DR temporarily.

    Args:
        combatant: The combatant performing the action
        guard_bonus: Guard points to add (default: 30)
        dr_bonus: DR bonus to add (default: 0.10 = 10%)
    """
    combatant.guard += guard_bonus
    combatant.temp_dr_modifier += dr_bonus


def execute_ae_pulse(combatant: CombatantState, ae_gain: int = 3):
    """
    Immediately gain some AE (beyond normal regeneration).

    Args:
        combatant: The combatant performing the action
        ae_gain: AE points to gain (default: 3)
    """
    combatant.ae = min(combatant.max_ae, combatant.ae + ae_gain)


def execute_strain_vent(combatant: CombatantState, strain_reduction: int = 5):
    """
    Reduce current Strain.

    Args:
        combatant: The combatant performing the action
        strain_reduction: Strain points to remove (default: 5)
    """
    combatant.strain = max(0, combatant.strain - strain_reduction)


def execute_stance_switch(combatant: CombatantState, dr_change: float = 0.05):
    """
    Change combat stance, adjusting DR.
    Could be positive (defensive) or negative (aggressive).

    Args:
        combatant: The combatant performing the action
        dr_change: DR change (default: 0.05, can be negative)
    """
    combatant.temp_dr_modifier += dr_change


def execute_counter_prep(combatant: CombatantState, guard_bonus: int = 15):
    """
    Prepare for counter-attack, gaining some Guard.
    (In a full implementation, this would also set a counter flag)

    Args:
        combatant: The combatant performing the action
        guard_bonus: Guard points to add (default: 15)
    """
    combatant.guard += guard_bonus


def choose_quick_action(combatant: CombatantState) -> QuickActionType:
    """
    Choose a quick action based on combatant's current state.

    Simple policy:
    - If strain is high (>20), vent strain
    - If guard is low (<10) and AE is good (>5), use brace
    - If AE is low (<3), use AE pulse
    - Otherwise, dodge for DR

    Args:
        combatant: The combatant choosing an action

    Returns:
        The chosen quick action type
    """
    if combatant.strain > 20:
        return QuickActionType.STRAIN_VENT
    elif combatant.guard < 10 and combatant.ae > 5:
        return QuickActionType.BRACE
    elif combatant.ae < 3:
        return QuickActionType.AE_PULSE
    else:
        return QuickActionType.DODGE


def execute_quick_action(combatant: CombatantState, action_type: QuickActionType):
    """
    Execute a quick action on a combatant.

    Args:
        combatant: The combatant performing the action
        action_type: The type of quick action to execute
    """
    if action_type == QuickActionType.GUARD_SHIFT:
        execute_guard_shift(combatant)
    elif action_type == QuickActionType.DODGE:
        execute_dodge(combatant)
    elif action_type == QuickActionType.BRACE:
        execute_brace(combatant)
    elif action_type == QuickActionType.AE_PULSE:
        execute_ae_pulse(combatant)
    elif action_type == QuickActionType.STRAIN_VENT:
        execute_strain_vent(combatant)
    elif action_type == QuickActionType.STANCE_SWITCH:
        execute_stance_switch(combatant)
    elif action_type == QuickActionType.COUNTER_PREP:
        execute_counter_prep(combatant)
