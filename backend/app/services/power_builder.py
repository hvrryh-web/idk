"""Power Builder service for HERO-style Soul Core Technique construction."""
from typing import Dict, List
from uuid import UUID

from app.models.characters import Character
from app.models.enums import FateColour, TechniqueAxis, TechniqueTier
from app.models.fate_cards import BodyCard, DeathCard, SeedCard
from app.models.techniques import Technique

# Constants
P_MAGIC = 10.0  # Power budget per magic rank

# Colour multipliers for HERO-style costing
COLOUR_MULTIPLIERS = {
    FateColour.Red: 1.0,
    FateColour.Blue: 1.0,
    FateColour.Green: 1.0,
    FateColour.Black: 1.2,
    FateColour.Gold: 1.5,
}


def build_innate_technique(
    character: Character,
    death_card: DeathCard,
    body_card: BodyCard,
    seed_cards: List[SeedCard],
    soul_thesis: str,
    modules: List[Dict],  # [{"id": str, "rank": int}, ...]
    advantages: List[str],
    limitations: List[str],
    technique_id: str = None,
) -> Technique:
    """
    Build a Soul Core (Innate) Technique using HERO-style power building.

    Steps:
    1. Compute magic_rank from character stats
    2. Compute Innate_PowerBudget = magic_rank * P_MAGIC
    3. Compute colour multipliers from seed cards
    4. Compute BaseCost, ActiveCost, RealCost
    5. Validate RealCost <= Innate_PowerBudget
    6. Map modules to Technique fields
    7. Populate build_meta
    8. Return Technique instance
    """

    # Step 1: Compute magic_rank (from MND + SOL, simplified)
    magic_rank = (character.mnd + character.sol) // 2

    # Step 2: Compute power budget
    innate_power_budget = magic_rank * P_MAGIC

    # Step 3: Compute colour multipliers from seed cards
    colours = [seed.colour for seed in seed_cards]
    avg_colour_multiplier = sum(COLOUR_MULTIPLIERS[c] for c in colours) / len(colours) if colours else 1.0

    # Step 4: Compute costs
    # BaseCost = Σ(ranks × base_cost_per_rank × colour_multiplier)
    # For now, we use a simplified calculation assuming module base costs are in the modules list
    base_cost = 0.0
    for module in modules:
        # In a real implementation, we'd look up base_cost_per_rank from EffectModule table
        # For now, assume rank directly contributes to base cost
        module_cost = module["rank"] * 2.0 * avg_colour_multiplier
        base_cost += module_cost

    # Advantage total (each advantage adds +25%)
    adv_total = len(advantages) * 0.25

    # Limitation total (each limitation adds +25% discount)
    lim_total = len(limitations) * 0.25

    # ActiveCost = BaseCost × (1 + AdvTotal)
    active_cost = base_cost * (1 + adv_total)

    # RealCost = ActiveCost / (1 + LimTotal)
    real_cost = active_cost / (1 + lim_total) if lim_total > 0 else active_cost

    # Step 5: Validate (log overspend but don't block)
    is_within_budget = real_cost <= innate_power_budget

    # Step 6: Map modules to Technique fields
    # Simple mapping: assume modules contribute to base_damage
    base_damage = sum(module["rank"] * 10.0 for module in modules if "DMG" in module["id"])
    ae_cost = sum(module["rank"] * 5.0 for module in modules)
    dr_debuff = sum(module["rank"] * 0.05 for module in modules if "DR_SHRED" in module["id"])
    boss_strain = sum(module["rank"] * 2.0 for module in modules if "STRAIN_SPIKE" in module["id"])

    # Determine axis based on seed aspects
    aspects = [seed.aspect for seed in seed_cards]
    if aspects and all(a == aspects[0] for a in aspects):
        # All same aspect
        axis = TechniqueAxis[aspects[0].value]
    else:
        axis = TechniqueAxis.Mixed

    # Step 7: Populate build_meta
    build_meta = {
        "magic_rank": magic_rank,
        "budget": innate_power_budget,
        "base_cost_discounted": base_cost,
        "active_cost": active_cost,
        "real_cost": real_cost,
        "is_within_budget": is_within_budget,
        "modules": modules,
        "advantages": advantages,
        "limitations": limitations,
        "seed_colours": [c.value for c in colours],
        "death_card": death_card.name,
        "body_card": body_card.name,
        "soul_thesis": soul_thesis,
    }

    # Step 8: Create Technique instance
    technique = Technique(
        id=technique_id or f"{character.name}_Innate",
        name=f"{soul_thesis} Soul Core",
        tier=TechniqueTier.Innate,
        archetype=body_card.archetype_hint or "Mixed",
        axis=axis,
        target_pool="mixed",  # Innate techniques can target multiple pools
        base_offrank_bias=0.0,
        base_damage=base_damage,
        ae_cost=ae_cost,
        self_strain=0.0,
        damage_to_thp=0.5,
        damage_to_php=0.3,
        damage_to_mshp=0.2,
        boss_strain_on_hit=boss_strain,
        dr_debuff=dr_debuff,
        ally_shield=None,
        build_meta=build_meta,
    )

    return technique
