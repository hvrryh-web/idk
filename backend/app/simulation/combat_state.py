"""Combat state management for simulation."""
from dataclasses import dataclass, field
from typing import Dict, List, Optional
from uuid import UUID


@dataclass
class CombatantState:
    """Runtime state for a combatant (PC or Boss) during combat."""

    id: UUID
    name: str
    is_boss: bool

    # Core stats
    thp: int
    max_thp: int
    ae: int
    max_ae: int
    ae_reg: int
    dr: float
    strain: int
    guard: int

    # SPD band for 3-stage combat
    spd_band: str = "Normal"

    # Technique IDs available to this combatant
    technique_ids: List[UUID] = field(default_factory=list)

    # Temporary modifiers (reset each round or after duration)
    temp_dr_modifier: float = 0.0
    temp_guard_modifier: int = 0

    def is_alive(self) -> bool:
        """Check if combatant is still alive."""
        return self.thp > 0

    def apply_damage(self, damage: int, routing: str = "THP") -> int:
        """
        Apply damage based on routing.
        Returns actual damage dealt to THP.
        """
        if routing == "Guard" and self.guard > 0:
            # Damage goes to guard first
            guard_damage = min(damage, self.guard)
            self.guard -= guard_damage
            remaining = damage - guard_damage
            if remaining > 0:
                self.thp = max(0, self.thp - remaining)
            return remaining
        elif routing == "Strain":
            # Direct strain damage
            self.strain += damage
            return 0
        else:  # THP or default
            # Direct THP damage
            actual_damage = min(damage, self.thp)
            self.thp = max(0, self.thp - damage)
            return actual_damage

    def apply_ae_cost(self, cost: int):
        """Apply AE cost, capping at 0."""
        self.ae = max(0, self.ae - cost)

    def apply_strain(self, strain: int):
        """Apply strain to combatant."""
        self.strain += strain

    def regenerate_ae(self):
        """Regenerate AE at end of round."""
        self.ae = min(self.max_ae, self.ae + self.ae_reg)

    def get_effective_dr(self) -> float:
        """Get DR with temporary modifiers applied."""
        return max(0.0, min(1.0, self.dr + self.temp_dr_modifier))


@dataclass
class CombatState:
    """Overall combat state for a simulation trial."""

    round_number: int = 0
    party: List[CombatantState] = field(default_factory=list)
    boss: Optional[CombatantState] = None

    # History tracking
    damage_dealt: Dict[UUID, int] = field(default_factory=dict)
    ae_history: Dict[UUID, List[int]] = field(default_factory=dict)
    strain_history: Dict[UUID, List[int]] = field(default_factory=dict)

    def party_alive(self) -> bool:
        """Check if at least one party member is alive."""
        return any(pc.is_alive() for pc in self.party)

    def boss_alive(self) -> bool:
        """Check if boss is alive."""
        return self.boss is not None and self.boss.is_alive()

    def record_damage(self, attacker_id: UUID, damage: int):
        """Record damage dealt by an attacker."""
        if attacker_id not in self.damage_dealt:
            self.damage_dealt[attacker_id] = 0
        self.damage_dealt[attacker_id] += damage

    def record_round_stats(self):
        """Record AE and Strain for all combatants at end of round."""
        for pc in self.party:
            if pc.id not in self.ae_history:
                self.ae_history[pc.id] = []
                self.strain_history[pc.id] = []
            self.ae_history[pc.id].append(pc.ae)
            self.strain_history[pc.id].append(pc.strain)

        if self.boss:
            if self.boss.id not in self.ae_history:
                self.ae_history[self.boss.id] = []
                self.strain_history[self.boss.id] = []
            self.ae_history[self.boss.id].append(self.boss.ae)
            self.strain_history[self.boss.id].append(self.boss.strain)
