import type { FateCard } from "../types";

// Death Cards - Represent how a character faces mortality and endings
export const DEATH_CARDS: FateCard[] = [
  {
    id: "death-silent-river",
    name: "Silent River",
    type: "death",
    description: "A calm acceptance of endings that creates resilience. You flow around obstacles like water, accepting what cannot be changed.",
    summary: "Serene acceptance grants inner peace and resilience.",
    rarity: "common",
    keywords: ["serene", "patient", "adaptive"],
    mechanicalHooks: { resilience: 1, ae_reg: 1 },
    artPath: "/assets/fate-cards/death/silent-river.svg",
  },
  {
    id: "death-burning-phoenix",
    name: "Burning Phoenix",
    type: "death",
    description: "Death is not the end but a transformation. You rise from defeat stronger, your spirit unbroken by setback.",
    summary: "Rise from defeat with renewed strength.",
    rarity: "uncommon",
    keywords: ["rebirth", "transformation", "defiant"],
    mechanicalHooks: { recovery: 2, guard_regen: 1 },
    artPath: "/assets/fate-cards/death/burning-phoenix.svg",
  },
  {
    id: "death-void-mirror",
    name: "Void Mirror",
    type: "death",
    description: "You see death as an illusion, a reflection of fear. This perspective grants clarity in the face of danger.",
    summary: "See through illusions to find truth.",
    rarity: "rare",
    keywords: ["clarity", "fearless", "transcendent"],
    mechanicalHooks: { insight: 2, dr_bonus: 1 },
    artPath: "/assets/fate-cards/death/void-mirror.svg",
  },
  {
    id: "death-eternal-watcher",
    name: "Eternal Watcher",
    type: "death",
    description: "Death is the silent observer of all things. You embody this patience, outlasting your foes through endurance.",
    summary: "Patience and endurance outlast all opposition.",
    rarity: "common",
    keywords: ["patient", "enduring", "vigilant"],
    mechanicalHooks: { endurance: 1, thp_bonus: 3 },
    artPath: "/assets/fate-cards/death/eternal-watcher.svg",
  },
];

// Body Cards - Represent physical form and combat style
export const BODY_CARDS: FateCard[] = [
  {
    id: "body-stone-anchor",
    name: "Stone Anchor",
    type: "body",
    description: "Roots the wielder with steady footwork and unshakable focus. Your body is an immovable fortress.",
    summary: "Unshakable defense and steadfast resolve.",
    rarity: "common",
    archetype: "Defender",
    keywords: ["sturdy", "defensive", "grounded"],
    statMods: { bod: 1, sol: 1 },
    mechanicalHooks: { guard_bonus: 1, spd_mod: -1 },
    artPath: "/assets/fate-cards/body/stone-anchor.svg",
  },
  {
    id: "body-lightning-step",
    name: "Lightning Step",
    type: "body",
    description: "Move with the speed of thunder, striking before enemies can react. Your body becomes a blur of motion.",
    summary: "Incredible speed and precision strikes.",
    rarity: "uncommon",
    archetype: "Striker",
    keywords: ["fast", "precise", "elusive"],
    statMods: { mnd: 2, bod: 1 },
    mechanicalHooks: { spd_mod: 2, dodge_bonus: 1 },
    artPath: "/assets/fate-cards/body/lightning-step.svg",
  },
  {
    id: "body-iron-mountain",
    name: "Iron Mountain",
    type: "body",
    description: "Your body is as unyielding as the mountains. Absorb punishment that would fell lesser warriors.",
    summary: "Tremendous durability and physical power.",
    rarity: "uncommon",
    archetype: "Defender",
    keywords: ["tough", "enduring", "powerful"],
    statMods: { bod: 2, sol: 1 },
    mechanicalHooks: { thp_bonus: 5, dr_bonus: 1 },
    artPath: "/assets/fate-cards/body/iron-mountain.svg",
  },
  {
    id: "body-serpent-coil",
    name: "Serpent Coil",
    type: "body",
    description: "Flexible and adaptive, you strike from unexpected angles and slip past defenses with ease.",
    summary: "Flexibility and cunning in combat.",
    rarity: "common",
    archetype: "Striker",
    keywords: ["flexible", "cunning", "adaptive"],
    statMods: { mnd: 1, bod: 1 },
    mechanicalHooks: { counter_bonus: 1, ae_cost_reduction: 1 },
    artPath: "/assets/fate-cards/body/serpent-coil.svg",
  },
  {
    id: "body-crane-stance",
    name: "Crane Stance",
    type: "body",
    description: "Balance and grace define your movements. Dance through combat with elegance and deadly precision.",
    summary: "Graceful movements with perfect balance.",
    rarity: "rare",
    archetype: "Controller",
    keywords: ["graceful", "balanced", "flowing"],
    statMods: { mnd: 2, sol: 1 },
    mechanicalHooks: { dodge_bonus: 2, ae_reg: 1 },
    artPath: "/assets/fate-cards/body/crane-stance.svg",
  },
];

// Seed Cards - Represent elemental affinities and core nature
export const SEED_CARDS: FateCard[] = [
  {
    id: "seed-azure-flow",
    name: "Azure Flow",
    type: "seed",
    description: "The mind flows like water, adapting to all situations. Gain insight and mental clarity in combat.",
    summary: "Mental flow grants adaptability and insight.",
    rarity: "common",
    colour: "Blue",
    aspect: "Mind",
    keywords: ["insight", "flow", "adaptive"],
    mechanicalHooks: { ae_reg: 1, mnd_bonus: 1 },
    artPath: "/assets/fate-cards/seed/azure-flow.svg",
  },
  {
    id: "seed-crimson-fury",
    name: "Crimson Fury",
    type: "seed",
    description: "Passion and rage fuel your techniques. Channel intense emotion into devastating power.",
    summary: "Passionate fury creates overwhelming force.",
    rarity: "uncommon",
    colour: "Red",
    aspect: "Body",
    keywords: ["passion", "power", "intense"],
    mechanicalHooks: { damage_bonus: 2, strain_risk: 1 },
    artPath: "/assets/fate-cards/seed/crimson-fury.svg",
  },
  {
    id: "seed-jade-serenity",
    name: "Jade Serenity",
    type: "seed",
    description: "Inner peace harmonizes body and spirit. Find balance in chaos and strength in tranquility.",
    summary: "Serene balance harmonizes all aspects.",
    rarity: "uncommon",
    colour: "Green",
    aspect: "Soul",
    keywords: ["harmony", "balance", "peaceful"],
    mechanicalHooks: { recovery: 1, sol_bonus: 1, strain_reduction: 1 },
    artPath: "/assets/fate-cards/seed/jade-serenity.svg",
  },
  {
    id: "seed-silver-lightning",
    name: "Silver Lightning",
    type: "seed",
    description: "The mind sharp as lightning, striking with precision. Clarity and speed in thought and action.",
    summary: "Lightning-fast thought and precision.",
    rarity: "rare",
    colour: "Blue",
    aspect: "Mind",
    keywords: ["quick", "precise", "electric"],
    mechanicalHooks: { spd_bonus: 1, ae_reg: 2, critical_chance: 1 },
    artPath: "/assets/fate-cards/seed/silver-lightning.svg",
  },
  {
    id: "seed-obsidian-void",
    name: "Obsidian Void",
    type: "seed",
    description: "Embrace the void within. Draw power from emptiness and stillness.",
    summary: "The void grants unique power and mystery.",
    rarity: "legendary",
    colour: "Black",
    aspect: "Soul",
    keywords: ["void", "mysterious", "potent"],
    mechanicalHooks: { special_power: 1, ae_reg: 1, dr_bonus: 1 },
    artPath: "/assets/fate-cards/seed/obsidian-void.svg",
  },
];

// Helper function to get a card by ID
export function getFateCardById(id: string): FateCard | undefined {
  return [...DEATH_CARDS, ...BODY_CARDS, ...SEED_CARDS].find(
    (card) => card.id === id
  );
}

// Helper function to get cards by type
export function getFateCardsByType(type: "death" | "body" | "seed"): FateCard[] {
  switch (type) {
    case "death":
      return DEATH_CARDS;
    case "body":
      return BODY_CARDS;
    case "seed":
      return SEED_CARDS;
  }
}
