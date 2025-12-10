"""Player-controlled combat logic for the UI."""
from typing import Dict, List, Optional
from uuid import UUID

from app.simulation.combat_state import CombatState, CombatantState
from app.simulation.engine import TechniqueData, execute_technique


class PlayerCombatSession:
    """Manages a player-controlled combat session."""

    def __init__(
        self,
        encounter_id: str,
        party: List[CombatantState],
        enemies: List[CombatantState],
        techniques: Dict[UUID, TechniqueData],
        enable_3_stage: bool = False,
    ):
        self.encounter_id = encounter_id
        self.state = CombatState(round_number=1, party=party, boss=enemies[0] if enemies else None)
        self.enemies = enemies
        self.techniques = techniques
        self.enable_3_stage = enable_3_stage
        self.current_phase = "Quick1" if enable_3_stage else "Major"
        self.active_character_index = 0
        self.combat_ended = False
        self.victor: Optional[str] = None
        self.log_entries: List[Dict] = []

    def get_active_character(self) -> Optional[CombatantState]:
        """Get the currently active character."""
        if self.active_character_index < len(self.state.party):
            return self.state.party[self.active_character_index]
        return None

    def is_player_turn(self) -> bool:
        """Check if it's currently a player's turn."""
        return not self.combat_ended and self.get_active_character() is not None

    def execute_player_action(
        self, actor_id: str, action_type: str, technique_id: Optional[str] = None, target_id: Optional[str] = None
    ) -> List[Dict]:
        """Execute a player action (technique or quick action)."""
        new_log_entries = []

        if self.combat_ended:
            return new_log_entries

        # Find actor
        actor = next((c for c in self.state.party if str(c.id) == actor_id), None)
        if not actor:
            return new_log_entries

        if action_type == "technique" and technique_id and target_id:
            # Find target
            target = next((e for e in self.enemies if str(e.id) == target_id), None)
            if not target:
                return new_log_entries

            # Find technique
            tech_uuid = UUID(technique_id)
            if tech_uuid not in self.techniques:
                return new_log_entries

            technique = self.techniques[tech_uuid]

            # Execute technique
            execute_technique(actor, target, technique, self.state)

            # Log entry
            new_log_entries.append(
                {
                    "timestamp": 0,
                    "actor": actor.name,
                    "action": f"uses {technique.name}",
                    "target": target.name,
                    "result": "Hit!",
                    "damage": technique.base_damage,
                }
            )

            # Check if target is defeated
            if not target.is_alive():
                new_log_entries.append(
                    {
                        "timestamp": 0,
                        "actor": target.name,
                        "action": "is defeated",
                        "result": "Defeated!",
                    }
                )

        # Advance to next character or phase
        self.advance_turn()

        # Check combat end conditions
        if not self.state.party_alive():
            self.combat_ended = True
            self.victor = "enemies"
            new_log_entries.append({"timestamp": 0, "actor": "Combat", "action": "ended", "result": "Party defeated!"})
        elif not any(e.is_alive() for e in self.enemies):
            self.combat_ended = True
            self.victor = "party"
            new_log_entries.append({"timestamp": 0, "actor": "Combat", "action": "ended", "result": "Victory!"})

        self.log_entries.extend(new_log_entries)
        return new_log_entries

    def execute_quick_action(self, actor_id: str, quick_action_type: str) -> List[Dict]:
        """Execute a quick action."""
        new_log_entries = []

        if self.combat_ended:
            return new_log_entries

        # Find actor
        actor = next((c for c in self.state.party if str(c.id) == actor_id), None)
        if not actor:
            return new_log_entries

        # Execute quick action based on type
        if quick_action_type == "GUARD_SHIFT":
            actor.guard += 10
            new_log_entries.append(
                {"timestamp": 0, "actor": actor.name, "action": "Guard Shift", "result": "Guard +10"}
            )
        elif quick_action_type == "DODGE":
            actor.temp_dr_modifier += 0.2
            new_log_entries.append(
                {"timestamp": 0, "actor": actor.name, "action": "Dodge", "result": "DR +20% this round"}
            )
        elif quick_action_type == "BRACE":
            actor.guard += 5
            actor.temp_dr_modifier += 0.1
            new_log_entries.append(
                {"timestamp": 0, "actor": actor.name, "action": "Brace", "result": "Guard +5, DR +10%"}
            )
        elif quick_action_type == "AE_PULSE":
            actor.ae = min(actor.max_ae, actor.ae + 3)
            new_log_entries.append({"timestamp": 0, "actor": actor.name, "action": "AE Pulse", "result": "AE +3"})
        elif quick_action_type == "STRAIN_VENT":
            actor.strain = max(0, actor.strain - 1)
            new_log_entries.append(
                {"timestamp": 0, "actor": actor.name, "action": "Strain Vent", "result": "Strain -1"}
            )

        # Advance turn
        self.advance_turn()

        self.log_entries.extend(new_log_entries)
        return new_log_entries

    def advance_turn(self):
        """Advance to the next character's turn or next phase."""
        self.active_character_index += 1

        # If all party members have acted in this phase
        if self.active_character_index >= len(self.state.party):
            self.active_character_index = 0

            # Advance phase
            if self.enable_3_stage:
                if self.current_phase == "Quick1":
                    self.current_phase = "Major"
                elif self.current_phase == "Major":
                    self.current_phase = "Quick2"
                else:
                    # End of round
                    self.end_round()
            else:
                # Simple 1-beat: end round after all party members act
                self.end_round()

    def end_round(self):
        """Process end of round: regenerate AE, enemy turns, etc."""
        # Regenerate AE for party
        for pc in self.state.party:
            if pc.is_alive():
                pc.regenerate_ae()

        # Enemy turns (simple AI)
        for enemy in self.enemies:
            if enemy.is_alive() and self.state.party_alive():
                # Simple AI: attack random living party member
                import random

                living_pcs = [pc for pc in self.state.party if pc.is_alive()]
                if living_pcs:
                    target = random.choice(living_pcs)
                    # Find first available technique
                    for tech_id in enemy.technique_ids or []:
                        tech_uuid = UUID(str(tech_id))
                        if tech_uuid in self.techniques:
                            technique = self.techniques[tech_uuid]
                            if enemy.ae >= technique.ae_cost:
                                execute_technique(enemy, target, technique, self.state)
                                self.log_entries.append(
                                    {
                                        "timestamp": 0,
                                        "actor": enemy.name,
                                        "action": f"uses {technique.name}",
                                        "target": target.name,
                                        "result": "Hit!",
                                        "damage": technique.base_damage,
                                    }
                                )
                                break

        # Regenerate AE for enemies
        for enemy in self.enemies:
            if enemy.is_alive():
                enemy.regenerate_ae()

        # Clear temporary modifiers
        for pc in self.state.party:
            pc.temp_dr_modifier = 0.0
        for enemy in self.enemies:
            enemy.temp_dr_modifier = 0.0

        # Start new round
        self.state.round_number += 1
        self.current_phase = "Quick1" if self.enable_3_stage else "Major"
        self.active_character_index = 0

        self.log_entries.append({"timestamp": 0, "actor": "Round", "action": "starts", "result": f"Round {self.state.round_number}"})

    def get_combat_state_dict(self) -> Dict:
        """Return the current combat state as a dictionary."""
        active_char = self.get_active_character()

        return {
            "encounter_id": self.encounter_id,
            "round": self.state.round_number,
            "phase": self.current_phase,
            "party": [self._combatant_to_dict(c) for c in self.state.party],
            "enemies": [self._combatant_to_dict(e) for e in self.enemies],
            "active_character_id": str(active_char.id) if active_char else None,
            "is_player_turn": self.is_player_turn(),
            "combat_ended": self.combat_ended,
            "victor": self.victor,
        }

    def _combatant_to_dict(self, combatant: CombatantState) -> Dict:
        """Convert a combatant to a dictionary."""
        return {
            "id": str(combatant.id),
            "name": combatant.name,
            "is_boss": combatant.is_boss,
            "thp": combatant.thp,
            "max_thp": combatant.max_thp,
            "ae": combatant.ae,
            "max_ae": combatant.max_ae,
            "ae_reg": combatant.ae_reg,
            "dr": combatant.dr,
            "strain": combatant.strain,
            "guard": combatant.guard,
            "spd_band": combatant.spd_band,
            "technique_ids": [str(tid) for tid in combatant.technique_ids] if combatant.technique_ids else [],
            "conditions": [],  # TODO: Implement conditions
        }
