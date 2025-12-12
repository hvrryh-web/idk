/**
 * Fate Card Builder - Answer Token Decks
 * 
 * Defines the answer token decks for each category.
 * Each deck has 12 tokens, each token has 4 sides (N/E/S/W).
 */

import { CategoryId, AnswerTokenDeck, Side } from "../types";

// ============================================================================
// PRIOR LIFE DEMISE DECK
// ============================================================================

export const PRIOR_LIFE_DEMISE_DECK: AnswerTokenDeck = {
  deckId: "deck-prior-life-demise",
  categoryId: CategoryId.PRIOR_LIFE_DEMISE,
  tokens: [
    {
      id: "pld-01",
      label: "Sudden Accident",
      sides: {
        [Side.NORTH]: "Died in a vehicle collision while rushing to help someone",
        [Side.EAST]: "Fell from a great height while working to save others",
        [Side.SOUTH]: "Drowned trying to rescue a stranger",
        [Side.WEST]: "Struck by lightning during a storm"
      },
      tags: {
        [Side.NORTH]: ["heroic", "urgent"],
        [Side.EAST]: ["sacrifice", "heights"],
        [Side.SOUTH]: ["water", "selfless"],
        [Side.WEST]: ["natural", "sudden"]
      }
    },
    {
      id: "pld-02",
      label: "Betrayal",
      sides: {
        [Side.NORTH]: "Murdered by a trusted friend over jealousy",
        [Side.EAST]: "Poisoned by a family member for inheritance",
        [Side.SOUTH]: "Betrayed by a lover who sought power",
        [Side.WEST]: "Sold out by a business partner to rivals"
      },
      tags: {
        [Side.NORTH]: ["betrayal", "friendship"],
        [Side.EAST]: ["family", "greed"],
        [Side.SOUTH]: ["romance", "ambition"],
        [Side.WEST]: ["business", "rivalry"]
      }
    },
    {
      id: "pld-03",
      label: "Disease",
      sides: {
        [Side.NORTH]: "Succumbed to a long illness while researching a cure",
        [Side.EAST]: "Died from a rare genetic condition",
        [Side.SOUTH]: "Contracted a fatal disease while volunteering",
        [Side.WEST]: "Weakened by chronic pain that finally ended"
      },
      tags: {
        [Side.NORTH]: ["illness", "research"],
        [Side.EAST]: ["genetic", "rare"],
        [Side.SOUTH]: ["service", "infection"],
        [Side.WEST]: ["pain", "chronic"]
      }
    },
    {
      id: "pld-04",
      label: "Violence",
      sides: {
        [Side.NORTH]: "Killed defending innocents from attackers",
        [Side.EAST]: "Murdered during a random act of violence",
        [Side.SOUTH]: "Executed for standing against tyranny",
        [Side.WEST]: "Died in crossfire during a conflict"
      },
      tags: {
        [Side.NORTH]: ["heroic", "defense"],
        [Side.EAST]: ["random", "tragic"],
        [Side.SOUTH]: ["rebellion", "justice"],
        [Side.WEST]: ["war", "collateral"]
      }
    },
    {
      id: "pld-05",
      label: "Sacrifice",
      sides: {
        [Side.NORTH]: "Gave your life to save a child",
        [Side.EAST]: "Died shielding others from danger",
        [Side.SOUTH]: "Sacrificed yourself in a hostage situation",
        [Side.WEST]: "Chose death to protect a secret"
      },
      tags: {
        [Side.NORTH]: ["children", "selfless"],
        [Side.EAST]: ["shield", "protection"],
        [Side.SOUTH]: ["hostage", "brave"],
        [Side.WEST]: ["secret", "loyalty"]
      }
    },
    {
      id: "pld-06",
      label: "Exhaustion",
      sides: {
        [Side.NORTH]: "Worked to death trying to support your family",
        [Side.EAST]: "Collapsed from stress and overwork",
        [Side.SOUTH]: "Died from neglecting your health for your dreams",
        [Side.WEST]: "Burned out pursuing perfection"
      },
      tags: {
        [Side.NORTH]: ["family", "duty"],
        [Side.EAST]: ["stress", "overwork"],
        [Side.SOUTH]: ["ambition", "neglect"],
        [Side.WEST]: ["perfection", "burnout"]
      }
    },
    {
      id: "pld-07",
      label: "Mystery",
      sides: {
        [Side.NORTH]: "Vanished under unexplained circumstances",
        [Side.EAST]: "Died in your sleep without warning",
        [Side.SOUTH]: "Lost consciousness and never woke",
        [Side.WEST]: "Stepped through a door and never returned"
      },
      tags: {
        [Side.NORTH]: ["disappearance", "mystery"],
        [Side.EAST]: ["sudden", "peaceful"],
        [Side.SOUTH]: ["unconscious", "unknown"],
        [Side.WEST]: ["portal", "strange"]
      }
    },
    {
      id: "pld-08",
      label: "Old Age",
      sides: {
        [Side.NORTH]: "Died peacefully surrounded by loved ones",
        [Side.EAST]: "Passed away alone with many regrets",
        [Side.SOUTH]: "Lived long but unfulfilled",
        [Side.WEST]: "Reached the end having taught others"
      },
      tags: {
        [Side.NORTH]: ["peaceful", "love"],
        [Side.EAST]: ["lonely", "regret"],
        [Side.SOUTH]: ["unfulfilled", "longing"],
        [Side.WEST]: ["legacy", "teaching"]
      }
    },
    {
      id: "pld-09",
      label: "Fire",
      sides: {
        [Side.NORTH]: "Burned while saving others from flames",
        [Side.EAST]: "Trapped in a burning building",
        [Side.SOUTH]: "Died in an explosion",
        [Side.WEST]: "Consumed by wildfire while fleeing"
      },
      tags: {
        [Side.NORTH]: ["fire", "rescue"],
        [Side.EAST]: ["trapped", "smoke"],
        [Side.SOUTH]: ["explosion", "sudden"],
        [Side.WEST]: ["nature", "wildfire"]
      }
    },
    {
      id: "pld-10",
      label: "Cold",
      sides: {
        [Side.NORTH]: "Froze to death lost in a blizzard",
        [Side.EAST]: "Succumbed to cold while helping stranded travelers",
        [Side.SOUTH]: "Fell through ice and drowned",
        [Side.WEST]: "Died of hypothermia after giving away your coat"
      },
      tags: {
        [Side.NORTH]: ["cold", "lost"],
        [Side.EAST]: ["helping", "weather"],
        [Side.SOUTH]: ["ice", "water"],
        [Side.WEST]: ["selfless", "cold"]
      }
    },
    {
      id: "pld-11",
      label: "Despair",
      sides: {
        [Side.NORTH]: "Ended your life feeling hopeless",
        [Side.EAST]: "Gave up after losing everything dear",
        [Side.SOUTH]: "Died of a broken heart",
        [Side.WEST]: "Faded away from isolation and loneliness"
      },
      tags: {
        [Side.NORTH]: ["suicide", "hopeless"],
        [Side.EAST]: ["loss", "despair"],
        [Side.SOUTH]: ["heartbreak", "grief"],
        [Side.WEST]: ["isolation", "lonely"]
      }
    },
    {
      id: "pld-12",
      label: "Defiance",
      sides: {
        [Side.NORTH]: "Killed fighting for what you believed in",
        [Side.EAST]: "Executed for refusing to submit",
        [Side.SOUTH]: "Died challenging an unjust authority",
        [Side.WEST]: "Fell defending the weak against the powerful"
      },
      tags: {
        [Side.NORTH]: ["fight", "belief"],
        [Side.EAST]: ["execution", "defiant"],
        [Side.SOUTH]: ["rebellion", "justice"],
        [Side.WEST]: ["protection", "brave"]
      }
    }
  ]
};

// ============================================================================
// RELIFE VESSEL DECK
// ============================================================================

export const RELIFE_VESSEL_DECK: AnswerTokenDeck = {
  deckId: "deck-relife-vessel",
  categoryId: CategoryId.RELIFE_VESSEL,
  tokens: [
    {
      id: "rlv-01",
      label: "Marked Eyes",
      sides: {
        [Side.NORTH]: "Eyes that shift color with emotions",
        [Side.EAST]: "Heterochromatic eyes (one blue, one gold)",
        [Side.SOUTH]: "Eyes that glow faintly in darkness",
        [Side.WEST]: "Eyes with unusual iris patterns like fractals"
      },
      tags: {
        [Side.NORTH]: ["emotion", "change"],
        [Side.EAST]: ["dual", "rare"],
        [Side.SOUTH]: ["light", "darkness"],
        [Side.WEST]: ["pattern", "unique"]
      }
    },
    {
      id: "rlv-02",
      label: "Unusual Hair",
      sides: {
        [Side.NORTH]: "Hair that moves on its own like it's alive",
        [Side.EAST]: "Hair with streaks of white from birth",
        [Side.SOUTH]: "Hair that grows unnaturally fast",
        [Side.WEST]: "Hair that changes length based on power"
      },
      tags: {
        [Side.NORTH]: ["alive", "movement"],
        [Side.EAST]: ["white", "marked"],
        [Side.SOUTH]: ["growth", "fast"],
        [Side.WEST]: ["power", "responsive"]
      }
    },
    {
      id: "rlv-03",
      label: "Birthmark",
      sides: {
        [Side.NORTH]: "A birthmark shaped like a flame on your hand",
        [Side.EAST]: "Spiral pattern birthmark on your back",
        [Side.SOUTH]: "Birthmark that pulses with your heartbeat",
        [Side.WEST]: "Runic birthmark that appeared after awakening"
      },
      tags: {
        [Side.NORTH]: ["fire", "hand"],
        [Side.EAST]: ["spiral", "back"],
        [Side.SOUTH]: ["pulse", "life"],
        [Side.WEST]: ["rune", "awakening"]
      }
    },
    {
      id: "rlv-04",
      label: "Physical Frailty",
      sides: {
        [Side.NORTH]: "Weak constitution, tire easily",
        [Side.EAST]: "Fragile bones that break easily",
        [Side.SOUTH]: "Chronic pain in limbs",
        [Side.WEST]: "Limited stamina reserves"
      },
      tags: {
        [Side.NORTH]: ["weak", "fatigue"],
        [Side.EAST]: ["fragile", "bones"],
        [Side.SOUTH]: ["pain", "chronic"],
        [Side.WEST]: ["stamina", "limited"]
      }
    },
    {
      id: "rlv-05",
      label: "Sensory Gift",
      sides: {
        [Side.NORTH]: "Can sense cursed energy at great distances",
        [Side.EAST]: "Enhanced hearing that picks up whispers",
        [Side.SOUTH]: "Touch that feels emotional residue",
        [Side.WEST]: "Vision that sees traces of past events"
      },
      tags: {
        [Side.NORTH]: ["sense", "energy"],
        [Side.EAST]: ["hearing", "sound"],
        [Side.SOUTH]: ["touch", "emotion"],
        [Side.WEST]: ["vision", "past"]
      }
    },
    {
      id: "rlv-06",
      label: "Mutation",
      sides: {
        [Side.NORTH]: "Elongated fingers perfect for precise gestures",
        [Side.EAST]: "Unusually dense muscle tissue",
        [Side.SOUTH]: "Extra joint in arms for extended reach",
        [Side.WEST]: "Skin that hardens when threatened"
      },
      tags: {
        [Side.NORTH]: ["fingers", "precision"],
        [Side.EAST]: ["muscle", "strength"],
        [Side.SOUTH]: ["reach", "flexibility"],
        [Side.WEST]: ["skin", "defense"]
      }
    },
    {
      id: "rlv-07",
      label: "Energy Reservoir",
      sides: {
        [Side.NORTH]: "Deep well of cursed energy, slow to refill",
        [Side.EAST]: "Rapid energy regeneration, small capacity",
        [Side.SOUTH]: "Energy stored in crystalized nodes",
        [Side.WEST]: "Dual energy types that must be balanced"
      },
      tags: {
        [Side.NORTH]: ["deep", "slow"],
        [Side.EAST]: ["rapid", "small"],
        [Side.SOUTH]: ["crystal", "stored"],
        [Side.WEST]: ["dual", "balance"]
      }
    },
    {
      id: "rlv-08",
      label: "Voice",
      sides: {
        [Side.NORTH]: "Voice carries supernatural resonance",
        [Side.EAST]: "Cannot speak above a whisper",
        [Side.SOUTH]: "Voice that induces calm in listeners",
        [Side.WEST]: "Words that echo with power"
      },
      tags: {
        [Side.NORTH]: ["resonance", "supernatural"],
        [Side.EAST]: ["whisper", "quiet"],
        [Side.SOUTH]: ["calm", "soothing"],
        [Side.WEST]: ["echo", "power"]
      }
    },
    {
      id: "rlv-09",
      label: "Scarred",
      sides: {
        [Side.NORTH]: "Scars that glow when using techniques",
        [Side.EAST]: "Network of scars forms a pattern",
        [Side.SOUTH]: "Scars that hurt before danger",
        [Side.WEST]: "Scars from past life carried over"
      },
      tags: {
        [Side.NORTH]: ["glow", "technique"],
        [Side.EAST]: ["pattern", "network"],
        [Side.SOUTH]: ["warning", "danger"],
        [Side.WEST]: ["past-life", "memory"]
      }
    },
    {
      id: "rlv-10",
      label: "Channels",
      sides: {
        [Side.NORTH]: "Energy flows through visible pathways",
        [Side.EAST]: "Seven chakra points clearly marked",
        [Side.SOUTH]: "Meridian lines inscribed on skin",
        [Side.WEST]: "Cursed energy circuits under the skin"
      },
      tags: {
        [Side.NORTH]: ["visible", "flow"],
        [Side.EAST]: ["chakra", "seven"],
        [Side.SOUTH]: ["meridian", "inscribed"],
        [Side.WEST]: ["circuit", "cursed"]
      }
    },
    {
      id: "rlv-11",
      label: "Aura",
      sides: {
        [Side.NORTH]: "Aura manifests as visible distortion",
        [Side.EAST]: "Temperature drops around you",
        [Side.SOUTH]: "Others feel pressure in your presence",
        [Side.WEST]: "Aura takes the form of phantom flames"
      },
      tags: {
        [Side.NORTH]: ["visible", "distortion"],
        [Side.EAST]: ["cold", "temperature"],
        [Side.SOUTH]: ["pressure", "heavy"],
        [Side.WEST]: ["flame", "phantom"]
      }
    },
    {
      id: "rlv-12",
      label: "Bloodline",
      sides: {
        [Side.NORTH]: "Born into a forgotten noble lineage",
        [Side.EAST]: "Descended from a legendary sorcerer",
        [Side.SOUTH]: "Mixed heritage of human and something else",
        [Side.WEST]: "Last survivor of a massacred clan"
      },
      tags: {
        [Side.NORTH]: ["noble", "forgotten"],
        [Side.EAST]: ["legend", "sorcerer"],
        [Side.SOUTH]: ["hybrid", "mixed"],
        [Side.WEST]: ["survivor", "clan"]
      }
    }
  ]
};

import { CURSED_TECHNIQUE_CORE_DECK, TECHNIQUE_MECHANISM_DECK } from "./tokenDecks2";
import { BINDING_VOWS_COSTS_DECK, GROWTH_AWAKENING_DECK } from "./tokenDecks3";

export const ALL_DECKS = [
  PRIOR_LIFE_DEMISE_DECK,
  RELIFE_VESSEL_DECK,
  CURSED_TECHNIQUE_CORE_DECK,
  TECHNIQUE_MECHANISM_DECK,
  BINDING_VOWS_COSTS_DECK,
  GROWTH_AWAKENING_DECK
];

export function getDeckById(deckId: string): AnswerTokenDeck | undefined {
  return ALL_DECKS.find(deck => deck.deckId === deckId);
}

export function getDeckByCategoryId(categoryId: CategoryId): AnswerTokenDeck | undefined {
  return ALL_DECKS.find(deck => deck.categoryId === categoryId);
}
