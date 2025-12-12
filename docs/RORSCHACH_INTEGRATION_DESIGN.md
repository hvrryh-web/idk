# Rorschach Test Integration - Design Document

## Overview
Integrate psychological Rorschach inkblot test as a category within the Fate Card Builder system to help determine character personality traits and cursed technique manifestation.

## Integration Approach

### 1. Add as 7th Fate Card Category

**New Category ID:**
```typescript
export enum CategoryId {
  RORSCHACH_TEST = "rorschach_test", // NEW
  PRIOR_LIFE_DEMISE = "prior_life_demise",
  RELIFE_VESSEL = "relife_vessel",
  CURSED_TECHNIQUE_CORE = "cursed_technique_core",
  TECHNIQUE_MECHANISM = "technique_mechanism",
  BINDING_VOWS_COSTS = "binding_vows_costs",
  GROWTH_AWAKENING = "growth_awakening",
}
```

**Placement in Flow:**
- Option A: After Foundation Chat, before Prior Life Demise
- Option B: After ReLife Vessel, before Cursed Technique Core
- **Recommended: Option A** - Establishes psychological baseline early

### 2. Rorschach Question Structure

**4 Inkblot Questions:**

1. **Question 1: "What do you see in this first image?"**
   - Guidance: "Your first instinct reveals your approach to conflict"
   - **Token Sides (interpretations):**
     - N: "I see conflict and struggle" → Aggressive/Confrontational
     - E: "I see balance and harmony" → Diplomatic/Peaceful
     - S: "I see power and dominance" → Ambitious/Controlling
     - W: "I see vulnerability and need" → Empathetic/Protective

2. **Question 2: "What emotions does this second image evoke?"**
   - Guidance: "Your emotional response shapes your cursed energy nature"
   - **Token Sides:**
     - N: "Fear and anxiety" → Defensive techniques
     - E: "Anger and determination" → Offensive techniques
     - S: "Curiosity and wonder" → Exploratory/Adaptive techniques
     - W: "Sadness and longing" → Support/Healing techniques

3. **Question 3: "What story does this third image tell?"**
   - Guidance: "Your narrative reveals your worldview"
   - **Token Sides:**
     - N: "A tale of transformation and rebirth" → Growth-oriented
     - E: "A tale of loss and redemption" → Redemption-driven
     - S: "A tale of conquest and victory" → Achievement-focused
     - W: "A tale of connection and bonds" → Relationship-centered

4. **Question 4: "What does this final image represent to you?"**
   - Guidance: "Your interpretation reflects your inner truth"
   - **Token Sides:**
     - N: "Order and structure" → Methodical/Systematic
     - E: "Chaos and freedom" → Spontaneous/Creative
     - S: "Duality and balance" → Harmonious/Adaptive
     - W: "Mystery and the unknown" → Intuitive/Mystical

### 3. Rorschach Token Deck (12 Tokens)

Each token represents a different inkblot interpretation category:

```typescript
{
  id: "ror-01",
  label: "The Warrior",
  sides: {
    N: "I see weapons clashing in battle",
    E: "I see shields protecting the weak",
    S: "I see a soldier standing guard",
    W: "I see scars of past conflicts"
  },
  tags: {
    N: ["aggressive", "combat", "offense"],
    E: ["defensive", "protection", "guardian"],
    S: ["vigilant", "duty", "stalwart"],
    W: ["experience", "survivor", "scarred"]
  }
}
```

**12 Token Categories:**
1. The Warrior - Combat/Conflict
2. The Healer - Care/Support
3. The Seeker - Knowledge/Truth
4. The Shadow - Hidden/Mysterious
5. The Creator - Build/Transform
6. The Destroyer - Break/Dismantle
7. The Guardian - Protect/Defend
8. The Trickster - Deceive/Adapt
9. The Sage - Wisdom/Understanding
10. The Beast - Primal/Instinct
11. The Dreamer - Imagination/Vision
12. The Judge - Justice/Order

### 4. Visual Implementation

**Inkblot Images:**
- Use placeholder inkblot SVGs initially
- 4 distinct inkblot images, one per question
- Styled as mysterious, symmetric patterns
- Black ink on white/cream background
- **ComfyUI Integration:** Generate stylized inkblots later

**UI Presentation:**
```
┌────────────────────────────────────┐
│   Rorschach Test - Question 1/4    │
├────────────────────────────────────┤
│                                     │
│      [Inkblot SVG Image]           │
│                                     │
│  "What do you see in this image?"  │
│                                     │
│   [Draw 3 Interpretation Tokens]   │
│                                     │
└────────────────────────────────────┘
```

### 5. Impact on Character Generation

**Personality Tags Generated:**
- Combines rorschach answers into personality profile
- Examples:
  - `["aggressive", "combat", "survivor", "defensive"]` → "Battle-Hardened Protector"
  - `["healing", "empathetic", "connection", "support"]` → "Compassionate Guardian"

**Technique Influence:**
- Rorschach results influence technique manifestation style
- Aggressive → Offensive techniques emphasize damage
- Defensive → Techniques focus on protection/barriers
- Empathetic → Techniques include healing/support aspects

**Wiki Generation:**
- Add "Psychological Profile" section to character wiki
- Display rorschach interpretation summary
- Link personality traits to technique design

### 6. Data Structure

**Add to BuildState:**
```typescript
interface BuildState {
  // ... existing fields
  
  rorschachProfile?: {
    categoryId: CategoryId.RORSCHACH_TEST;
    answers: CommittedAnswer[];
    personalityTags: string[];
    profileSummary: string;
  };
}
```

**Fate Card Definition:**
```typescript
{
  id: "fc-rorschach-test",
  categoryId: CategoryId.RORSCHACH_TEST,
  name: "Rorschach Test",
  description: "Inkblot interpretations reveal your psychological foundation and shape how your cursed technique manifests.",
  deckId: "deck-rorschach",
  questions: [/* 4 questions as defined above */]
}
```

### 7. Implementation Steps

**Step 1: Data Layer**
- Add `CategoryId.RORSCHACH_TEST` to types.ts
- Create `rorschachDeck.ts` with 12 tokens × 4 sides
- Create fate card definition

**Step 2: Update Builder Flow**
- Insert RORSCHACH_TEST step after FOUNDATION_CHAT
- Update BuildStep enum to include RORSCHACH = 1.5 (or renumber)
- Update step navigation logic

**Step 3: UI Components**
- Create `RorschachInkblot.tsx` component for inkblot display
- Use SVG or base64 encoded placeholder images
- Style for mysterious, psychological atmosphere

**Step 4: Profile Generation**
- Add `generatePersonalityProfile()` function
- Analyze rorschach answers to extract tags
- Create summary text based on interpretations

**Step 5: Integration**
- Connect profile to technique generation
- Include in export JSON and summary text
- Display in Review step

**Step 6: Testing**
- Add rorschach deck data tests
- Test profile generation logic
- Integration tests for rorschach flow

### 8. Example Flow

```
1. Setup (seed, mode)
2. Foundation Chat (Action + Problem) ← REQUIRED
3. Rorschach Test (4 inkblots) ← NEW
   - Shows inkblot image
   - Player draws 3 interpretation tokens
   - Selects one interpretation
   - Builds personality profile
4. Prior Life Demise
5. ReLife Vessel
6. Cursed Technique Core
   - Uses rorschach profile to flavor technique
7. Technique Mechanism
8. Binding Vows & Costs
9. Growth & Awakening
10. Review & Export
    - Displays "Psychological Profile" section
    - Shows personality tags
    - Maps profile to technique design
```

### 9. Benefits

1. **Deeper Character Psychology:** Adds psychological depth to characters
2. **Technique Personalization:** Makes techniques feel more personal and unique
3. **Narrative Richness:** Provides storytelling hooks for GMs
4. **Player Engagement:** Interactive psychological test is engaging
5. **Wiki Content:** Generates interesting content for character wikis

### 10. Optional Enhancements

- **Multiple Inkblot Sets:** Different inkblots based on seed
- **Interpretation Explanations:** Educational tooltips about rorschach psychology
- **Profile Archetypes:** 12 predefined archetypes (matching token count)
- **GM Notes:** Generate suggestions for roleplaying the personality type

## Implementation Timeline

- **Phase 1 (Data):** 2-3 hours - Create deck and fate card data
- **Phase 2 (Types):** 1 hour - Update type definitions
- **Phase 3 (UI):** 3-4 hours - Inkblot display component
- **Phase 4 (Profile):** 2-3 hours - Profile generation logic
- **Phase 5 (Integration):** 2-3 hours - Wire into builder flow
- **Phase 6 (Testing):** 2-3 hours - Tests for new functionality

**Total Estimated:** 12-17 hours

## Conclusion

Integrating the Rorschach test as a fate card category adds psychological depth to character creation while maintaining the existing token-draw mechanic. It seamlessly fits into the current architecture and enhances both gameplay and wiki generation.