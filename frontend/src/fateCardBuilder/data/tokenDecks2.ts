/**
 * Fate Card Builder - Token Decks (Part 2)
 * Cursed Technique Core and Technique Mechanism decks
 */

import { CategoryId, AnswerTokenDeck, Side } from "../types";

// ============================================================================
// CURSED TECHNIQUE CORE DECK
// ============================================================================

export const CURSED_TECHNIQUE_CORE_DECK: AnswerTokenDeck = {
  deckId: "deck-cursed-technique-core",
  categoryId: CategoryId.CURSED_TECHNIQUE_CORE,
  tokens: [
    {
      id: "ctc-01",
      label: "Manipulation",
      sides: {
        [Side.NORTH]: "Control objects within range",
        [Side.EAST]: "Manipulate the emotions of others",
        [Side.SOUTH]: "Alter the properties of materials",
        [Side.WEST]: "Command living creatures briefly"
      },
      tags: {
        [Side.NORTH]: ["object", "control"],
        [Side.EAST]: ["emotion", "mental"],
        [Side.SOUTH]: ["matter", "transmute"],
        [Side.WEST]: ["life", "command"]
      }
    },
    {
      id: "ctc-02",
      label: "Generation",
      sides: {
        [Side.NORTH]: "Create constructs from cursed energy",
        [Side.EAST]: "Generate elemental forces",
        [Side.SOUTH]: "Produce copies of observed objects",
        [Side.WEST]: "Manifest abstract concepts as real"
      },
      tags: {
        [Side.NORTH]: ["construct", "creation"],
        [Side.EAST]: ["element", "force"],
        [Side.SOUTH]: ["copy", "replicate"],
        [Side.WEST]: ["concept", "abstract"]
      }
    },
    {
      id: "ctc-03",
      label: "Enhancement",
      sides: {
        [Side.NORTH]: "Amplify physical abilities exponentially",
        [Side.EAST]: "Enhance the properties of touched objects",
        [Side.SOUTH]: "Boost allies' techniques temporarily",
        [Side.WEST]: "Magnify specific sensory abilities"
      },
      tags: {
        [Side.NORTH]: ["physical", "amplify"],
        [Side.EAST]: ["object", "improve"],
        [Side.SOUTH]: ["ally", "support"],
        [Side.WEST]: ["sense", "perception"]
      }
    },
    {
      id: "ctc-04",
      label: "Binding",
      sides: {
        [Side.NORTH]: "Restrict movement with cursed chains",
        [Side.EAST]: "Seal enemy techniques temporarily",
        [Side.SOUTH]: "Create barriers that trap targets",
        [Side.WEST]: "Link fates between two subjects"
      },
      tags: {
        [Side.NORTH]: ["restrict", "chain"],
        [Side.EAST]: ["seal", "technique"],
        [Side.SOUTH]: ["barrier", "trap"],
        [Side.WEST]: ["link", "fate"]
      }
    },
    {
      id: "ctc-05",
      label: "Void",
      sides: {
        [Side.NORTH]: "Erase techniques and energy",
        [Side.EAST]: "Create zones of absolute stillness",
        [Side.SOUTH]: "Negate cursed effects",
        [Side.WEST]: "Consume and nullify power"
      },
      tags: {
        [Side.NORTH]: ["erase", "destroy"],
        [Side.EAST]: ["stillness", "freeze"],
        [Side.SOUTH]: ["negate", "cancel"],
        [Side.WEST]: ["consume", "nullify"]
      }
    },
    {
      id: "ctc-06",
      label: "Transformation",
      sides: {
        [Side.NORTH]: "Shapeshift your own body",
        [Side.EAST]: "Convert energy types freely",
        [Side.SOUTH]: "Transform matter into different forms",
        [Side.WEST]: "Change the nature of concepts"
      },
      tags: {
        [Side.NORTH]: ["shapeshift", "body"],
        [Side.EAST]: ["energy", "convert"],
        [Side.SOUTH]: ["matter", "transmute"],
        [Side.WEST]: ["concept", "reality"]
      }
    },
    {
      id: "ctc-07",
      label: "Perception",
      sides: {
        [Side.NORTH]: "See all possible futures briefly",
        [Side.EAST]: "Read the intentions of others",
        [Side.SOUTH]: "Perceive the flow of cursed energy",
        [Side.WEST]: "View distant locations instantly"
      },
      tags: {
        [Side.NORTH]: ["future", "precognition"],
        [Side.EAST]: ["mind", "intention"],
        [Side.SOUTH]: ["energy", "sight"],
        [Side.WEST]: ["distance", "remote"]
      }
    },
    {
      id: "ctc-08",
      label: "Severance",
      sides: {
        [Side.NORTH]: "Cut through any physical material",
        [Side.EAST]: "Sever connections between things",
        [Side.SOUTH]: "Split concepts and bindings",
        [Side.WEST]: "Cleave space itself"
      },
      tags: {
        [Side.NORTH]: ["cut", "sharp"],
        [Side.EAST]: ["connection", "break"],
        [Side.SOUTH]: ["concept", "divide"],
        [Side.WEST]: ["space", "cleave"]
      }
    },
    {
      id: "ctc-09",
      label: "Resonance",
      sides: {
        [Side.NORTH]: "Harmonize with others' energy",
        [Side.EAST]: "Amplify through sound vibrations",
        [Side.SOUTH]: "Sync multiple techniques together",
        [Side.WEST]: "Create feedback loops of power"
      },
      tags: {
        [Side.NORTH]: ["harmony", "sync"],
        [Side.EAST]: ["sound", "vibration"],
        [Side.SOUTH]: ["multiple", "combo"],
        [Side.WEST]: ["feedback", "loop"]
      }
    },
    {
      id: "ctc-10",
      label: "Reversal",
      sides: {
        [Side.NORTH]: "Reverse the effects of techniques",
        [Side.EAST]: "Turn attacks back on attackers",
        [Side.SOUTH]: "Invert positive and negative effects",
        [Side.WEST]: "Rewind time on objects slightly"
      },
      tags: {
        [Side.NORTH]: ["reverse", "undo"],
        [Side.EAST]: ["reflect", "counter"],
        [Side.SOUTH]: ["invert", "flip"],
        [Side.WEST]: ["time", "rewind"]
      }
    },
    {
      id: "ctc-11",
      label: "Shadow",
      sides: {
        [Side.NORTH]: "Store objects in shadows",
        [Side.EAST]: "Travel through darkness",
        [Side.SOUTH]: "Create living shadow constructs",
        [Side.WEST]: "Bind targets with their own shadow"
      },
      tags: {
        [Side.NORTH]: ["storage", "pocket"],
        [Side.EAST]: ["travel", "teleport"],
        [Side.SOUTH]: ["construct", "minion"],
        [Side.WEST]: ["bind", "shadow"]
      }
    },
    {
      id: "ctc-12",
      label: "Exchange",
      sides: {
        [Side.NORTH]: "Swap positions with targets",
        [Side.EAST]: "Trade properties between objects",
        [Side.SOUTH]: "Exchange damage for energy",
        [Side.WEST]: "Substitute reality with illusion"
      },
      tags: {
        [Side.NORTH]: ["teleport", "swap"],
        [Side.EAST]: ["property", "trade"],
        [Side.SOUTH]: ["damage", "convert"],
        [Side.WEST]: ["illusion", "reality"]
      }
    }
  ]
};

// ============================================================================
// TECHNIQUE MECHANISM DECK
// ============================================================================

export const TECHNIQUE_MECHANISM_DECK: AnswerTokenDeck = {
  deckId: "deck-technique-mechanism",
  categoryId: CategoryId.TECHNIQUE_MECHANISM,
  tokens: [
    {
      id: "tm-01",
      label: "Voice Command",
      sides: {
        [Side.NORTH]: "Speak the technique's true name",
        [Side.EAST]: "Chant a short incantation",
        [Side.SOUTH]: "Whisper activation trigger",
        [Side.WEST]: "Shout command word"
      },
      tags: {
        [Side.NORTH]: ["voice", "true-name"],
        [Side.EAST]: ["chant", "incantation"],
        [Side.SOUTH]: ["whisper", "subtle"],
        [Side.WEST]: ["shout", "loud"]
      }
    },
    {
      id: "tm-02",
      label: "Hand Signs",
      sides: {
        [Side.NORTH]: "Form complex mudra sequence",
        [Side.EAST]: "Snap fingers in pattern",
        [Side.SOUTH]: "Draw sigil in the air",
        [Side.WEST]: "Clap hands together"
      },
      tags: {
        [Side.NORTH]: ["mudra", "complex"],
        [Side.EAST]: ["snap", "quick"],
        [Side.SOUTH]: ["sigil", "draw"],
        [Side.WEST]: ["clap", "simple"]
      }
    },
    {
      id: "tm-03",
      label: "Focus Object",
      sides: {
        [Side.NORTH]: "Channel through worn talisman",
        [Side.EAST]: "Touch marked stone to activate",
        [Side.SOUTH]: "Focus through crystal lens",
        [Side.WEST]: "Use inherited family relic"
      },
      tags: {
        [Side.NORTH]: ["talisman", "worn"],
        [Side.EAST]: ["stone", "touch"],
        [Side.SOUTH]: ["crystal", "focus"],
        [Side.WEST]: ["relic", "family"]
      }
    },
    {
      id: "tm-04",
      label: "Mental Focus",
      sides: {
        [Side.NORTH]: "Visualize detailed mental image",
        [Side.EAST]: "Enter meditative state",
        [Side.SOUTH]: "Focus killing intent",
        [Side.WEST]: "Achieve emotional clarity"
      },
      tags: {
        [Side.NORTH]: ["visualize", "image"],
        [Side.EAST]: ["meditate", "calm"],
        [Side.SOUTH]: ["intent", "aggressive"],
        [Side.WEST]: ["emotion", "clarity"]
      }
    },
    {
      id: "tm-05",
      label: "Movement",
      sides: {
        [Side.NORTH]: "Strike specific stance",
        [Side.EAST]: "Spin counterclockwise",
        [Side.SOUTH]: "Step in ritual pattern",
        [Side.WEST]: "Leap to initiate"
      },
      tags: {
        [Side.NORTH]: ["stance", "position"],
        [Side.EAST]: ["spin", "rotation"],
        [Side.SOUTH]: ["step", "pattern"],
        [Side.WEST]: ["leap", "jump"]
      }
    },
    {
      id: "tm-06",
      label: "Blood Price",
      sides: {
        [Side.NORTH]: "Draw your own blood",
        [Side.EAST]: "Cut palm on ritual blade",
        [Side.SOUTH]: "Bite tongue to activate",
        [Side.WEST]: "Shed tears mixed with blood"
      },
      tags: {
        [Side.NORTH]: ["blood", "draw"],
        [Side.EAST]: ["cut", "blade"],
        [Side.SOUTH]: ["tongue", "bite"],
        [Side.WEST]: ["tears", "blood"]
      }
    },
    {
      id: "tm-07",
      label: "Eye Contact",
      sides: {
        [Side.NORTH]: "Lock eyes with target",
        [Side.EAST]: "Close eyes to activate",
        [Side.SOUTH]: "Blink in specific pattern",
        [Side.WEST]: "Glare with intent"
      },
      tags: {
        [Side.NORTH]: ["gaze", "lock"],
        [Side.EAST]: ["close", "blind"],
        [Side.SOUTH]: ["blink", "pattern"],
        [Side.WEST]: ["glare", "intensity"]
      }
    },
    {
      id: "tm-08",
      label: "Breath Control",
      sides: {
        [Side.NORTH]: "Hold breath for ten seconds",
        [Side.EAST]: "Exhale slowly and completely",
        [Side.SOUTH]: "Hyperventilate briefly",
        [Side.WEST]: "Breathe in cursed energy"
      },
      tags: {
        [Side.NORTH]: ["hold", "control"],
        [Side.EAST]: ["exhale", "release"],
        [Side.SOUTH]: ["rapid", "hyperventilate"],
        [Side.WEST]: ["inhale", "energy"]
      }
    },
    {
      id: "tm-09",
      label: "Emotion Trigger",
      sides: {
        [Side.NORTH]: "Recall moment of rage",
        [Side.EAST]: "Channel grief into power",
        [Side.SOUTH]: "Feel overwhelming joy",
        [Side.WEST]: "Embrace perfect calm"
      },
      tags: {
        [Side.NORTH]: ["rage", "anger"],
        [Side.EAST]: ["grief", "sorrow"],
        [Side.SOUTH]: ["joy", "happiness"],
        [Side.WEST]: ["calm", "peace"]
      }
    },
    {
      id: "tm-10",
      label: "Environmental",
      sides: {
        [Side.NORTH]: "Activate under moonlight",
        [Side.EAST]: "Requires touching earth",
        [Side.SOUTH]: "Only works in darkness",
        [Side.WEST]: "Needs flowing water nearby"
      },
      tags: {
        [Side.NORTH]: ["moon", "night"],
        [Side.EAST]: ["earth", "ground"],
        [Side.SOUTH]: ["darkness", "shadow"],
        [Side.WEST]: ["water", "flow"]
      }
    },
    {
      id: "tm-11",
      label: "Timing",
      sides: {
        [Side.NORTH]: "Count down from five",
        [Side.EAST]: "React within split second",
        [Side.SOUTH]: "Charge for full minute",
        [Side.WEST]: "Activate at exact moment"
      },
      tags: {
        [Side.NORTH]: ["countdown", "delay"],
        [Side.EAST]: ["instant", "fast"],
        [Side.SOUTH]: ["charge", "slow"],
        [Side.WEST]: ["timing", "precise"]
      }
    },
    {
      id: "tm-12",
      label: "Pain",
      sides: {
        [Side.NORTH]: "Endure self-inflicted wound",
        [Side.EAST]: "Feel echoed pain of target",
        [Side.SOUTH]: "Accept damage as catalyst",
        [Side.WEST]: "Break a finger to activate"
      },
      tags: {
        [Side.NORTH]: ["wound", "self-harm"],
        [Side.EAST]: ["echo", "empathy"],
        [Side.SOUTH]: ["damage", "accept"],
        [Side.WEST]: ["break", "bone"]
      }
    }
  ]
};
