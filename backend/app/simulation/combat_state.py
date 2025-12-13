"""Combat state management for simulation."""
from dataclasses import dataclass, field
from typing import Dict, List, Optional
from uuid import UUID


# Condition types for the three pillars
VIOLENCE_CONDITIONS = ["wounded", "crippled", "downed", "ruined_body"]
INFLUENCE_CONDITIONS = ["shaken", "compromised", "subjugated", "shattered_broken"]
REVELATION_CONDITIONS = ["disturbed", "fractured", "unhinged", "shattered_broken"]


@dataclass
class CostTracks:
    """Blood/Fate/Stain cost tracks."""

    blood: int = 0
    fate: int = 0
    stain: int = 0
    maximum: int = 10

    def mark_blood(self, amount: int = 1) -> bool:
        """Mark Blood track. Returns True if threshold reached."""
        self.blood = min(self.maximum, self.blood + amount)
        return self.blood >= 3  # Threshold for auto-Wounded

    def mark_fate(self, amount: int = 1):
        """Mark Fate track."""
        self.fate = min(self.maximum, self.fate + amount)

    def mark_stain(self, amount: int = 1):
        """Mark Stain track."""
        self.stain = min(self.maximum, self.stain + amount)

    def to_dict(self) -> Dict:
        """Convert to dictionary for API response."""
        return {
            "blood": {"current": self.blood, "maximum": self.maximum},
            "fate": {"current": self.fate, "maximum": self.maximum},
            "stain": {"current": self.stain, "maximum": self.maximum},
        }


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

    # SCL for cap enforcement
    scl: int = 5

    # Conditions for each pillar
    conditions: List[str] = field(default_factory=list)

    # Cost tracks
    cost_tracks: CostTracks = field(default_factory=CostTracks)

    def is_alive(self) -> bool:
        """Check if combatant is still alive."""
        return self.thp > 0 and not self.is_incapacitated()

    def is_incapacitated(self) -> bool:
        """Check if combatant has a 4th degree condition."""
        incapacitating = ["ruined_body", "shattered_broken"]
        return any(cond in self.conditions for cond in incapacitating)

    def get_sequence_band(self) -> str:
        """Get Sequence band label based on SCL."""
        if self.scl <= 2:
            return "Cursed-Sequence"
        elif self.scl <= 4:
            return "Low-Sequence"
        elif self.scl <= 7:
            return "Mid-Sequence"
        elif self.scl <= 10:
            return "High-Sequence"
        else:
            return "Transcendent"

    def apply_condition(self, pillar: str, condition: str) -> bool:
        """
        Apply a condition if not already present.
        Returns True if condition was applied.
        """
        if condition not in self.conditions:
            self.conditions.append(condition)
            return True
        return False

    def get_condition_degree(self, pillar: str) -> int:
        """
        Get the highest condition degree for a pillar.
        Returns 0-4 (0 = no conditions).
        """
        if pillar == "violence":
            for i, cond in enumerate(VIOLENCE_CONDITIONS, start=1):
                if cond in self.conditions:
                    return i
        elif pillar == "influence":
            for i, cond in enumerate(INFLUENCE_CONDITIONS, start=1):
                if cond in self.conditions:
                    return i
        elif pillar == "revelation":
            for i, cond in enumerate(REVELATION_CONDITIONS, start=1):
                if cond in self.conditions:
                    return i
        return 0

    def escalate_condition(self, pillar: str) -> Optional[str]:
        """
        Escalate condition to next degree.
        Returns the new condition name or None if already at max.
        
        get_condition_degree() returns:
        - 0: no conditions (next is ladder[0])
        - 1: 1st degree present (next is ladder[1])
        - etc.
        """
        if pillar == "violence":
            ladder = VIOLENCE_CONDITIONS
        elif pillar == "influence":
            ladder = INFLUENCE_CONDITIONS
        elif pillar == "revelation":
            ladder = REVELATION_CONDITIONS
        else:
            return None

        current_degree = self.get_condition_degree(pillar)
        # current_degree acts as index to next condition (0 = no conditions, apply ladder[0])
        if current_degree < len(ladder):
            new_condition = ladder[current_degree]
            self.apply_condition(pillar, new_condition)
            return new_condition
        return None

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
