import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CharacterCreationData } from "../types";
import { createCharacter } from "../api";
import CharacterAvatar from "./CharacterAvatar";
import FateCardDisplay from "./FateCardDisplay";
import { DEATH_CARDS, BODY_CARDS, SEED_CARDS } from "../data/fateCards";
import "../styles/CharacterCreation.css";

const INITIAL_DATA: CharacterCreationData = {
  step: 1,
  name: "",
  type: "pc",
  description: "",
  strength: 5,
  dexterity: 5,
  constitution: 5,
  intelligence: 5,
  wisdom: 5,
  charisma: 5,
  perception: 5,
  resolve: 5,
  presence: 5,
  aether_fire: 0,
  aether_ice: 0,
  aether_void: 0,
  selectedTechniqueIds: [],
  selectedFateCards: {},
  avatar: {
    color: "#4A90E2",
    icon: "default",
  },
};

export default function CharacterCreation() {
  const navigate = useNavigate();
  const [data, setData] = useState<CharacterCreationData>(INITIAL_DATA);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateData = (updates: Partial<CharacterCreationData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (data.step < 5) {
      updateData({ step: data.step + 1 });
    }
  };

  const prevStep = () => {
    if (data.step > 1) {
      updateData({ step: data.step - 1 });
    }
  };

  const handleCreate = async () => {
    setSaving(true);
    setError(null);
    try {
      // Destructure to exclude non-API fields from the payload
      const { step: _step, selectedFateCards: _fateCards, selectedTechniqueIds: _techIds, avatar: _avatar, ...payload } = data;
      const created = await createCharacter({
        ...payload,
        type: data.type || "pc",
      });
      navigate(`/profile/${created.id ?? ""}`);
    } catch (err) {
      console.error("Failed to create character", err);
      setError("Failed to create character. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (data.step) {
      case 1:
        return <BasicInfoStep data={data} updateData={updateData} />;
      case 2:
        return <StatsStep data={data} updateData={updateData} />;
      case 3:
        return <FateCardsStep data={data} updateData={updateData} />;
      case 4:
        return <AppearanceStep data={data} updateData={updateData} />;
      case 5:
        return <ReviewStep data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="character-creation">
      <header className="creation-header">
        <h1>Create Character</h1>
        <button onClick={() => navigate("/characters")} className="btn-cancel">
          Cancel
        </button>
      </header>

      <div className="creation-progress">
        <div className="progress-steps">
          {["Basic Info", "Stats", "Fate Cards", "Appearance", "Review"].map(
            (label, index) => (
              <div
                key={index}
                className={`progress-step ${data.step === index + 1 ? "active" : ""} ${data.step > index + 1 ? "completed" : ""}`}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-label">{label}</div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="creation-content">{renderStep()}</div>

      <div className="creation-actions">
        {data.step > 1 && (
          <button onClick={prevStep} className="btn-secondary">
            Previous
          </button>
        )}
        {data.step < 5 ? (
          <button onClick={nextStep} className="btn-primary">
            Next
          </button>
        ) : (
          <button onClick={handleCreate} className="btn-success" disabled={saving}>
            {saving ? "Creating..." : "Create Character"}
          </button>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

// Step 1: Basic Info
function BasicInfoStep({
  data,
  updateData,
}: {
  data: CharacterCreationData;
  updateData: (updates: Partial<CharacterCreationData>) => void;
}) {
  return (
    <div className="creation-step">
      <h2>Basic Information</h2>
      <div className="form-group">
        <label htmlFor="name">Character Name *</label>
        <input
          id="name"
          type="text"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          placeholder="Enter character name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="type">Character Type</label>
        <select
          id="type"
          value={data.type}
          onChange={(e) => updateData({ type: e.target.value })}
        >
          <option value="pc">Player Character</option>
          <option value="npc">NPC</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          placeholder="Enter character description..."
          rows={4}
        />
      </div>
    </div>
  );
}

// Step 2: Stats
function StatsStep({
  data,
  updateData,
}: {
  data: CharacterCreationData;
  updateData: (updates: Partial<CharacterCreationData>) => void;
}) {
  const totalPoints = 45;
  const currentTotal =
    data.strength +
    data.dexterity +
    data.constitution +
    data.intelligence +
    data.wisdom +
    data.charisma +
    data.perception +
    data.resolve +
    data.presence;
  const remainingPoints = totalPoints - currentTotal;

  const updateStat = (stat: string, value: number) => {
    updateData({ [stat]: Math.max(0, Math.min(10, value)) });
  };

  return (
    <div className="creation-step">
      <h2>Distribute Stats</h2>
      <div className="points-display">
        <span>Points Remaining: </span>
        <strong className={remainingPoints < 0 ? "over-budget" : ""}>
          {remainingPoints}
        </strong>
        <span> / {totalPoints}</span>
      </div>

      <div className="stats-editor">
        <h3>Primary Stats</h3>
        <StatEditor label="Strength" value={data.strength} onChange={(v) => updateStat("strength", v)} />
        <StatEditor label="Dexterity" value={data.dexterity} onChange={(v) => updateStat("dexterity", v)} />
        <StatEditor label="Constitution" value={data.constitution} onChange={(v) => updateStat("constitution", v)} />
        <StatEditor label="Intelligence" value={data.intelligence} onChange={(v) => updateStat("intelligence", v)} />
        <StatEditor label="Wisdom" value={data.wisdom} onChange={(v) => updateStat("wisdom", v)} />
        <StatEditor label="Charisma" value={data.charisma} onChange={(v) => updateStat("charisma", v)} />
        <StatEditor label="Perception" value={data.perception} onChange={(v) => updateStat("perception", v)} />
        <StatEditor label="Resolve" value={data.resolve} onChange={(v) => updateStat("resolve", v)} />
        <StatEditor label="Presence" value={data.presence} onChange={(v) => updateStat("presence", v)} />

        <h3 style={{ marginTop: "1.5rem" }}>Aether Stats</h3>
        <StatEditor label="Fire" value={data.aether_fire} onChange={(v) => updateStat("aether_fire", v)} />
        <StatEditor label="Ice" value={data.aether_ice} onChange={(v) => updateStat("aether_ice", v)} />
        <StatEditor label="Void" value={data.aether_void} onChange={(v) => updateStat("aether_void", v)} />
      </div>
    </div>
  );
}

// Step 3: Fate Cards
function FateCardsStep({
  data,
  updateData,
}: {
  data: CharacterCreationData;
  updateData: (updates: Partial<CharacterCreationData>) => void;
}) {
  const selectDeathCard = (cardId: string) => {
    const card = DEATH_CARDS.find((c) => c.id === cardId);
    if (card) {
      updateData({
        selectedFateCards: { ...data.selectedFateCards, deathCard: card },
      });
    }
  };

  const selectBodyCard = (cardId: string) => {
    const card = BODY_CARDS.find((c) => c.id === cardId);
    if (card) {
      updateData({
        selectedFateCards: { ...data.selectedFateCards, bodyCard: card },
      });
    }
  };

  const selectSeedCard = (cardId: string) => {
    const card = SEED_CARDS.find((c) => c.id === cardId);
    if (card) {
      updateData({
        selectedFateCards: {
          ...data.selectedFateCards,
          seedCards: [card],
        },
      });
    }
  };

  return (
    <div className="creation-step">
      <h2>Choose Fate Cards</h2>
      <p className="step-description">
        Fate cards define your character's destiny, fighting style, and elemental affinity.
      </p>

      <div className="card-selection-section">
        <h3>Death Card</h3>
        <p className="section-hint">How does your character face mortality?</p>
        <div className="card-grid">
          {DEATH_CARDS.map((card) => (
            <FateCardDisplay
              key={card.id}
              card={card}
              size="small"
              onClick={() => selectDeathCard(card.id || "")}
              selected={data.selectedFateCards?.deathCard?.id === card.id}
            />
          ))}
        </div>
      </div>

      <div className="card-selection-section">
        <h3>Body Card</h3>
        <p className="section-hint">What is your character's physical form and combat style?</p>
        <div className="card-grid">
          {BODY_CARDS.map((card) => (
            <FateCardDisplay
              key={card.id}
              card={card}
              size="small"
              onClick={() => selectBodyCard(card.id || "")}
              selected={data.selectedFateCards?.bodyCard?.id === card.id}
            />
          ))}
        </div>
      </div>

      <div className="card-selection-section">
        <h3>Seed Card</h3>
        <p className="section-hint">What is your character's elemental affinity?</p>
        <div className="card-grid">
          {SEED_CARDS.map((card) => (
            <FateCardDisplay
              key={card.id}
              card={card}
              size="small"
              onClick={() => selectSeedCard(card.id || "")}
              selected={
                data.selectedFateCards?.seedCards?.[0]?.id === card.id
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Step 4: Appearance
function AppearanceStep({
  data,
  updateData,
}: {
  data: CharacterCreationData;
  updateData: (updates: Partial<CharacterCreationData>) => void;
}) {
  const colors = [
    "#4A90E2", "#E74C3C", "#27AE60", "#F39C12", "#9B59B6",
    "#1ABC9C", "#E67E22", "#34495E", "#95A5A6", "#16A085",
  ];

  const icons = [
    "monk", "phoenix", "sage", "guardian", "adept",
    "warrior", "mage", "elder", "merchant", "alchemist",
  ];

  const patterns = [
    "none", "waves", "flames", "lotus", "mountain",
    "lightning", "scroll", "coins", "shield", "stars",
  ];

  return (
    <div className="creation-step">
      <h2>Customize Appearance</h2>

      <div className="appearance-preview">
        <CharacterAvatar avatar={data.avatar} name={data.name || ""} size="large" showName />
      </div>

      <div className="appearance-options">
        <div className="option-group">
          <h3>Avatar Color</h3>
          <div className="color-grid">
            {colors.map((color) => (
              <button
                key={color}
                className={`color-swatch ${data.avatar?.color === color ? "selected" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() =>
                  updateData({ avatar: { ...data.avatar, color } })
                }
              />
            ))}
          </div>
        </div>

        <div className="option-group">
          <h3>Icon</h3>
          <div className="icon-grid">
            {icons.map((icon) => (
              <button
                key={icon}
                className={`icon-option ${data.avatar?.icon === icon ? "selected" : ""}`}
                onClick={() => updateData({ avatar: { ...data.avatar, icon } })}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="option-group">
          <h3>Background Pattern</h3>
          <div className="pattern-grid">
            {patterns.map((pattern) => (
              <button
                key={pattern}
                className={`pattern-option ${data.avatar?.backgroundPattern === pattern ? "selected" : ""}`}
                onClick={() =>
                  updateData({
                    avatar: { ...data.avatar, backgroundPattern: pattern },
                  })
                }
              >
                {pattern}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 5: Review
function ReviewStep({ data }: { data: CharacterCreationData }) {
  const scl = Math.floor(
    (data.strength +
      data.dexterity +
      data.constitution +
      data.intelligence +
      data.wisdom +
      data.charisma +
      data.perception +
      data.resolve +
      data.presence) /
      9 +
      ((data.aether_fire + data.aether_ice + data.aether_void) / 3) * 0.5
  );

  return (
    <div className="creation-step review-step">
      <h2>Review Character</h2>

      <div className="review-section">
        <div className="review-avatar">
          <CharacterAvatar avatar={data.avatar} name={data.name || ""} size="large" showName />
        </div>

        <div className="review-basic">
          <h3>{data.name || "Unnamed Character"}</h3>
          <p className="character-type">{data.type === "pc" ? "Player Character" : "NPC"}</p>
          <p className="character-scl">Soul Cultivation Level: {scl}</p>
          {data.description && <p className="character-description">{data.description}</p>}
        </div>
      </div>

      <div className="review-section">
        <h3>Stats</h3>
        <div className="review-stats">
          <div className="stat-column">
            <h4>Primary Stats</h4>
            <div>STR: {data.strength}</div>
            <div>DEX: {data.dexterity}</div>
            <div>CON: {data.constitution}</div>
            <div>INT: {data.intelligence}</div>
            <div>WIS: {data.wisdom}</div>
            <div>CHA: {data.charisma}</div>
            <div>PER: {data.perception}</div>
            <div>RES: {data.resolve}</div>
            <div>PRE: {data.presence}</div>
          </div>
          <div className="stat-column">
            <h4>Aether Stats</h4>
            <div>Fire: {data.aether_fire}</div>
            <div>Ice: {data.aether_ice}</div>
            <div>Void: {data.aether_void}</div>
          </div>
        </div>
      </div>

      {(data.selectedFateCards?.deathCard || data.selectedFateCards?.bodyCard || data.selectedFateCards?.seedCards) && (
        <div className="review-section">
          <h3>Fate Cards</h3>
          <div className="review-fate-cards">
            {data.selectedFateCards?.deathCard && (
              <FateCardDisplay card={data.selectedFateCards.deathCard} size="small" />
            )}
            {data.selectedFateCards?.bodyCard && (
              <FateCardDisplay card={data.selectedFateCards.bodyCard} size="small" />
            )}
            {data.selectedFateCards?.seedCards?.map((card, index) => (
              <FateCardDisplay key={index} card={card} size="small" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for stat editing
function StatEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="stat-editor-row">
      <label>{label}</label>
      <div className="stat-controls">
        <button onClick={() => onChange(value - 1)}>-</button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          min="0"
          max="10"
        />
        <button onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}
