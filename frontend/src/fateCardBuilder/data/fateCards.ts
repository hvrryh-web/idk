/**
 * Fate Card Builder - Fate Cards Data
 * 
 * Defines the 6 main Fate Cards (categories), each with 4 questions.
 */

import { CategoryId, FateCardData } from "../types";

export const FATE_CARDS: FateCardData[] = [
  {
    id: "fc-prior-life-demise",
    categoryId: CategoryId.PRIOR_LIFE_DEMISE,
    name: "Prior Life Demise",
    description: "How did your previous life end? What circumstances led to your isekai reincarnation?",
    deckId: "deck-prior-life-demise",
    questions: [
      {
        index: 0,
        text: "What was the manner of your death?",
        guidance: "Choose the circumstances that ended your prior life"
      },
      {
        index: 1,
        text: "What emotion defined your final moments?",
        guidance: "The feeling that carried over into rebirth"
      },
      {
        index: 2,
        text: "What regret haunts you from your past life?",
        guidance: "An unfulfilled desire or unresolved conflict"
      },
      {
        index: 3,
        text: "What memory lingers strongest?",
        guidance: "A defining moment from your previous existence"
      }
    ]
  },
  {
    id: "fc-relife-vessel",
    categoryId: CategoryId.RELIFE_VESSEL,
    name: "ReLife Vessel",
    description: "Your new body in this world. What form has fate given you?",
    deckId: "deck-relife-vessel",
    questions: [
      {
        index: 0,
        text: "What physical trait stands out most?",
        guidance: "A distinctive feature of your new form"
      },
      {
        index: 1,
        text: "What limitation does this body impose?",
        guidance: "A constraint or weakness you must work around"
      },
      {
        index: 2,
        text: "What hidden potential lies dormant?",
        guidance: "An ability waiting to be unlocked"
      },
      {
        index: 3,
        text: "How does your vessel connect to cursed energy?",
        guidance: "Your body's affinity or method of channeling power"
      }
    ]
  },
  {
    id: "fc-cursed-technique-core",
    categoryId: CategoryId.CURSED_TECHNIQUE_CORE,
    name: "Cursed Technique Core",
    description: "The fundamental nature of your cursed technique. What power has awakened within you?",
    deckId: "deck-cursed-technique-core",
    questions: [
      {
        index: 0,
        text: "What is the primary effect of your technique?",
        guidance: "The core ability or power it grants"
      },
      {
        index: 1,
        text: "What domain or aspect does it govern?",
        guidance: "The conceptual space your technique controls"
      },
      {
        index: 2,
        text: "What is its signature manifestation?",
        guidance: "How the technique appears when activated"
      },
      {
        index: 3,
        text: "What makes it unique among techniques?",
        guidance: "The distinctive quality that sets it apart"
      }
    ]
  },
  {
    id: "fc-technique-mechanism",
    categoryId: CategoryId.TECHNIQUE_MECHANISM,
    name: "Technique Mechanism",
    description: "How your cursed technique is activated and controlled.",
    deckId: "deck-technique-mechanism",
    questions: [
      {
        index: 0,
        text: "What triggers the technique's activation?",
        guidance: "Voice, gesture, focus object, or thought"
      },
      {
        index: 1,
        text: "What preparation or stance is required?",
        guidance: "Any prerequisite positioning or state"
      },
      {
        index: 2,
        text: "What sensory indicator signals its use?",
        guidance: "Visual, auditory, or other perceptible sign"
      },
      {
        index: 3,
        text: "What determines its effective range?",
        guidance: "Distance, line of sight, or other limiting factor"
      }
    ]
  },
  {
    id: "fc-binding-vows-costs",
    categoryId: CategoryId.BINDING_VOWS_COSTS,
    name: "Binding Vows & Costs",
    description: "Every power has its price. What restrictions and consequences govern your technique?",
    deckId: "deck-binding-vows-costs",
    questions: [
      {
        index: 0,
        text: "What resource does the technique consume?",
        guidance: "Physical stamina, mental focus, or something else"
      },
      {
        index: 1,
        text: "What condition limits its use?",
        guidance: "Time of day, emotional state, or other restriction"
      },
      {
        index: 2,
        text: "What backlash or side effect occurs?",
        guidance: "The cost paid after using the technique"
      },
      {
        index: 3,
        text: "What binding vow strengthens it?",
        guidance: "A self-imposed restriction that increases power"
      }
    ]
  },
  {
    id: "fc-growth-awakening",
    categoryId: CategoryId.GROWTH_AWAKENING,
    name: "Growth & Awakening",
    description: "How will your technique evolve? What potential lies ahead?",
    deckId: "deck-growth-awakening",
    questions: [
      {
        index: 0,
        text: "What catalyst will unlock greater power?",
        guidance: "An event or realization that triggers growth"
      },
      {
        index: 1,
        text: "What advanced application awaits mastery?",
        guidance: "A more powerful or refined use of the technique"
      },
      {
        index: 2,
        text: "What domain expansion could you develop?",
        guidance: "The ultimate expression of your technique"
      },
      {
        index: 3,
        text: "What risk comes with this evolution?",
        guidance: "The danger of pushing beyond current limits"
      }
    ]
  }
];

export function getFateCardById(id: string): FateCardData | undefined {
  return FATE_CARDS.find(card => card.id === id);
}

export function getFateCardByCategoryId(categoryId: CategoryId): FateCardData | undefined {
  return FATE_CARDS.find(card => card.categoryId === categoryId);
}
