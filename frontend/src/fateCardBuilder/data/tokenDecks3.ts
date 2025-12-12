/**
 * Fate Card Builder - Token Decks (Part 3)
 * Binding Vows & Costs and Growth & Awakening decks
 */

import { CategoryId, AnswerTokenDeck, Side } from "../types";

// ============================================================================
// BINDING VOWS & COSTS DECK
// ============================================================================

export const BINDING_VOWS_COSTS_DECK: AnswerTokenDeck = {
  deckId: "deck-binding-vows-costs",
  categoryId: CategoryId.BINDING_VOWS_COSTS,
  tokens: [
    {
      id: "bvc-01",
      label: "Stamina Drain",
      sides: {
        [Side.NORTH]: "Exhaustion proportional to power used",
        [Side.EAST]: "Severe fatigue after each use",
        [Side.SOUTH]: "Physical weakness for hours after",
        [Side.WEST]: "Energy depleted, risk of collapse"
      },
      tags: {
        [Side.NORTH]: ["exhaustion", "scaling"],
        [Side.EAST]: ["fatigue", "severe"],
        [Side.SOUTH]: ["weak", "duration"],
        [Side.WEST]: ["collapse", "risk"]
      }
    },
    {
      id: "bvc-02",
      label: "Mental Strain",
      sides: {
        [Side.NORTH]: "Splitting headaches after use",
        [Side.EAST]: "Memory becomes fuzzy temporarily",
        [Side.SOUTH]: "Concentration impaired for a time",
        [Side.WEST]: "Risk of losing consciousness"
      },
      tags: {
        [Side.NORTH]: ["headache", "pain"],
        [Side.EAST]: ["memory", "fuzzy"],
        [Side.SOUTH]: ["focus", "impaired"],
        [Side.WEST]: ["unconscious", "risk"]
      }
    },
    {
      id: "bvc-03",
      label: "Life Force",
      sides: {
        [Side.NORTH]: "Shortens lifespan slightly each use",
        [Side.EAST]: "Ages you visibly when activated",
        [Side.SOUTH]: "Burns years off your life",
        [Side.WEST]: "Consumes vitality permanently"
      },
      tags: {
        [Side.NORTH]: ["lifespan", "cost"],
        [Side.EAST]: ["aging", "visible"],
        [Side.SOUTH]: ["burn", "years"],
        [Side.WEST]: ["vitality", "permanent"]
      }
    },
    {
      id: "bvc-04",
      label: "Emotional Cost",
      sides: {
        [Side.NORTH]: "Feel overwhelming sadness after",
        [Side.EAST]: "Lose ability to feel joy temporarily",
        [Side.SOUTH]: "Experience targets' pain",
        [Side.WEST]: "Emotions become numb for days"
      },
      tags: {
        [Side.NORTH]: ["sadness", "grief"],
        [Side.EAST]: ["joy", "loss"],
        [Side.SOUTH]: ["empathy", "pain"],
        [Side.WEST]: ["numb", "empty"]
      }
    },
    {
      id: "bvc-05",
      label: "Time Restriction",
      sides: {
        [Side.NORTH]: "Only usable during full moon",
        [Side.EAST]: "Can't use more than once per day",
        [Side.SOUTH]: "Requires 24-hour cooldown",
        [Side.WEST]: "Limited to three times weekly"
      },
      tags: {
        [Side.NORTH]: ["moon", "rare"],
        [Side.EAST]: ["daily", "limit"],
        [Side.SOUTH]: ["cooldown", "24hr"],
        [Side.WEST]: ["weekly", "limited"]
      }
    },
    {
      id: "bvc-06",
      label: "Material Price",
      sides: {
        [Side.NORTH]: "Requires rare catalyst to activate",
        [Side.EAST]: "Consumes valuable material each use",
        [Side.SOUTH]: "Needs prepared ritual components",
        [Side.WEST]: "Burns through cursed objects"
      },
      tags: {
        [Side.NORTH]: ["rare", "catalyst"],
        [Side.EAST]: ["consume", "material"],
        [Side.SOUTH]: ["ritual", "prepared"],
        [Side.WEST]: ["object", "burn"]
      }
    },
    {
      id: "bvc-07",
      label: "Collateral",
      sides: {
        [Side.NORTH]: "Damages surroundings uncontrollably",
        [Side.EAST]: "Harms nearby allies slightly",
        [Side.SOUTH]: "Leaves cursed area after use",
        [Side.WEST]: "Destroys environment in radius"
      },
      tags: {
        [Side.NORTH]: ["area", "uncontrolled"],
        [Side.EAST]: ["ally", "harm"],
        [Side.SOUTH]: ["cursed", "lingering"],
        [Side.WEST]: ["destruction", "radius"]
      }
    },
    {
      id: "bvc-08",
      label: "Sensory Loss",
      sides: {
        [Side.NORTH]: "Temporary blindness after use",
        [Side.EAST]: "Lose hearing for several minutes",
        [Side.SOUTH]: "Touch becomes numb",
        [Side.WEST]: "All senses dulled for hours"
      },
      tags: {
        [Side.NORTH]: ["blind", "sight"],
        [Side.EAST]: ["deaf", "hearing"],
        [Side.SOUTH]: ["touch", "numb"],
        [Side.WEST]: ["all-senses", "dulled"]
      }
    },
    {
      id: "bvc-09",
      label: "Revealed",
      sides: {
        [Side.NORTH]: "Must explain technique to enemy",
        [Side.EAST]: "Activation is highly visible",
        [Side.SOUTH]: "Leaves obvious evidence of use",
        [Side.WEST]: "Broadcast technique to all nearby"
      },
      tags: {
        [Side.NORTH]: ["explain", "reveal"],
        [Side.EAST]: ["visible", "obvious"],
        [Side.SOUTH]: ["evidence", "trail"],
        [Side.WEST]: ["broadcast", "announce"]
      }
    },
    {
      id: "bvc-10",
      label: "Injury Risk",
      sides: {
        [Side.NORTH]: "Self-inflicted cuts appear",
        [Side.EAST]: "Bones crack under strain",
        [Side.SOUTH]: "Internal bleeding possible",
        [Side.WEST]: "Body tears itself apart slightly"
      },
      tags: {
        [Side.NORTH]: ["cuts", "bleeding"],
        [Side.EAST]: ["bones", "crack"],
        [Side.SOUTH]: ["internal", "bleeding"],
        [Side.WEST]: ["tear", "damage"]
      }
    },
    {
      id: "bvc-11",
      label: "Vulnerability",
      sides: {
        [Side.NORTH]: "Defense lowered during activation",
        [Side.EAST]: "Can't move while technique active",
        [Side.SOUTH]: "Exposed to counter-attacks",
        [Side.WEST]: "Immune system weakened after"
      },
      tags: {
        [Side.NORTH]: ["defense", "lowered"],
        [Side.EAST]: ["immobile", "stuck"],
        [Side.SOUTH]: ["counter", "exposed"],
        [Side.WEST]: ["immune", "sick"]
      }
    },
    {
      id: "bvc-12",
      label: "Bound Oath",
      sides: {
        [Side.NORTH]: "Cannot use against innocents",
        [Side.EAST]: "Must declare intent before use",
        [Side.SOUTH]: "Only works in self-defense",
        [Side.WEST]: "Forbidden in sacred places"
      },
      tags: {
        [Side.NORTH]: ["innocent", "restriction"],
        [Side.EAST]: ["declare", "announce"],
        [Side.SOUTH]: ["defense", "only"],
        [Side.WEST]: ["sacred", "forbidden"]
      }
    }
  ]
};

// ============================================================================
// GROWTH & AWAKENING DECK
// ============================================================================

export const GROWTH_AWAKENING_DECK: AnswerTokenDeck = {
  deckId: "deck-growth-awakening",
  categoryId: CategoryId.GROWTH_AWAKENING,
  tokens: [
    {
      id: "ga-01",
      label: "Near Death",
      sides: {
        [Side.NORTH]: "Awaken when nearly killed",
        [Side.EAST]: "Power surges in mortal danger",
        [Side.SOUTH]: "Death's door unlocks potential",
        [Side.WEST]: "Surviving fatal blow triggers growth"
      },
      tags: {
        [Side.NORTH]: ["near-death", "trigger"],
        [Side.EAST]: ["danger", "surge"],
        [Side.SOUTH]: ["threshold", "unlock"],
        [Side.WEST]: ["survive", "fatal"]
      }
    },
    {
      id: "ga-02",
      label: "Emotional Peak",
      sides: {
        [Side.NORTH]: "Breakthrough moment of rage",
        [Side.EAST]: "Desperate need to protect",
        [Side.SOUTH]: "Overwhelming desire achieved",
        [Side.WEST]: "Perfect clarity in crisis"
      },
      tags: {
        [Side.NORTH]: ["rage", "anger"],
        [Side.EAST]: ["protect", "desperation"],
        [Side.SOUTH]: ["desire", "fulfill"],
        [Side.WEST]: ["clarity", "enlightenment"]
      }
    },
    {
      id: "ga-03",
      label: "Forbidden Knowledge",
      sides: {
        [Side.NORTH]: "Discover secret technique scrolls",
        [Side.EAST]: "Learn from enemy's technique",
        [Side.SOUTH]: "Ancient mentor appears in dream",
        [Side.WEST]: "Inherit knowledge from past life"
      },
      tags: {
        [Side.NORTH]: ["scroll", "secret"],
        [Side.EAST]: ["enemy", "copy"],
        [Side.SOUTH]: ["mentor", "dream"],
        [Side.WEST]: ["past-life", "memory"]
      }
    },
    {
      id: "ga-04",
      label: "Ritual Evolution",
      sides: {
        [Side.NORTH]: "Complete seven-day meditation",
        [Side.EAST]: "Undergo dangerous ceremony",
        [Side.SOUTH]: "Face trial of worthiness",
        [Side.WEST]: "Sacrifice to gain power"
      },
      tags: {
        [Side.NORTH]: ["meditation", "time"],
        [Side.EAST]: ["ceremony", "danger"],
        [Side.SOUTH]: ["trial", "prove"],
        [Side.WEST]: ["sacrifice", "cost"]
      }
    },
    {
      id: "ga-05",
      label: "Mastery",
      sides: {
        [Side.NORTH]: "Technique split into separate forms",
        [Side.EAST]: "Continuous use refines ability",
        [Side.SOUTH]: "Combine with another technique",
        [Side.WEST]: "Condense and focus power"
      },
      tags: {
        [Side.NORTH]: ["split", "versatile"],
        [Side.EAST]: ["refine", "practice"],
        [Side.SOUTH]: ["combine", "fusion"],
        [Side.WEST]: ["condense", "focus"]
      }
    },
    {
      id: "ga-06",
      label: "External Catalyst",
      sides: {
        [Side.NORTH]: "Absorb powerful cursed object",
        [Side.EAST]: "Exposure to pure cursed energy",
        [Side.SOUTH]: "Ingest rare awakening elixir",
        [Side.WEST]: "Fuse with spiritual entity"
      },
      tags: {
        [Side.NORTH]: ["object", "absorb"],
        [Side.EAST]: ["energy", "pure"],
        [Side.SOUTH]: ["elixir", "consume"],
        [Side.WEST]: ["entity", "fusion"]
      }
    },
    {
      id: "ga-07",
      label: "Domain Birth",
      sides: {
        [Side.NORTH]: "Expand technique into full domain",
        [Side.EAST]: "Create pocket dimension territory",
        [Side.SOUTH]: "Overlay reality with your will",
        [Side.WEST]: "Manifest innate domain space"
      },
      tags: {
        [Side.NORTH]: ["expand", "full"],
        [Side.EAST]: ["pocket", "dimension"],
        [Side.SOUTH]: ["reality", "overlay"],
        [Side.WEST]: ["innate", "manifest"]
      }
    },
    {
      id: "ga-08",
      label: "Inverse",
      sides: {
        [Side.NORTH]: "Discover opposite application",
        [Side.EAST]: "Reverse technique's polarity",
        [Side.SOUTH]: "Invert effect into its mirror",
        [Side.WEST]: "Apply technique backward in time"
      },
      tags: {
        [Side.NORTH]: ["opposite", "dual"],
        [Side.EAST]: ["reverse", "polarity"],
        [Side.SOUTH]: ["invert", "mirror"],
        [Side.WEST]: ["time", "reverse"]
      }
    },
    {
      id: "ga-09",
      label: "Black Flash",
      sides: {
        [Side.NORTH]: "Achieve perfect timing once",
        [Side.EAST]: "Exponential power multiplication",
        [Side.SOUTH]: "Strike in the zone of perfect flow",
        [Side.WEST]: "Transcend normal limits briefly"
      },
      tags: {
        [Side.NORTH]: ["timing", "perfect"],
        [Side.EAST]: ["multiply", "power"],
        [Side.SOUTH]: ["flow", "zone"],
        [Side.WEST]: ["transcend", "limit"]
      }
    },
    {
      id: "ga-10",
      label: "Binding Release",
      sides: {
        [Side.NORTH]: "Accept greater cost for more power",
        [Side.EAST]: "Remove one restriction permanently",
        [Side.SOUTH]: "Trade safety for effectiveness",
        [Side.WEST]: "Vow sacrifice to unlock true form"
      },
      tags: {
        [Side.NORTH]: ["cost", "increase"],
        [Side.EAST]: ["restriction", "remove"],
        [Side.SOUTH]: ["trade", "risk"],
        [Side.WEST]: ["vow", "transform"]
      }
    },
    {
      id: "ga-11",
      label: "Mutation",
      sides: {
        [Side.NORTH]: "Body adapts to technique use",
        [Side.EAST]: "Physical transformation occurs",
        [Side.SOUTH]: "Gain monstrous aspect",
        [Side.WEST]: "Evolve beyond human form"
      },
      tags: {
        [Side.NORTH]: ["adapt", "change"],
        [Side.EAST]: ["transform", "body"],
        [Side.SOUTH]: ["monster", "aspect"],
        [Side.WEST]: ["evolve", "transcend"]
      }
    },
    {
      id: "ga-12",
      label: "Resonance Sync",
      sides: {
        [Side.NORTH]: "Link with others' techniques",
        [Side.EAST]: "Amplify through group resonance",
        [Side.SOUTH]: "Technique gains from allies nearby",
        [Side.WEST]: "Merge abilities temporarily"
      },
      tags: {
        [Side.NORTH]: ["link", "connect"],
        [Side.EAST]: ["amplify", "group"],
        [Side.SOUTH]: ["ally", "boost"],
        [Side.WEST]: ["merge", "fusion"]
      }
    }
  ]
};
