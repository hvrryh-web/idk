import { useState, useEffect } from "react";
import { fetchCharacters } from "../api";
import type { Character } from "../types";
import CharacterAvatar from "./CharacterAvatar";
import FateCardDeck from "./FateCardDeck";
import "../styles/CharacterPanel.css";

export default function CharacterPanel() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCharacter();
  }, []);

  const loadCharacter = async () => {
    try {
      const characters = await fetchCharacters();
      // For now, use the first character
      if (characters.length > 0) {
        setCharacter(characters[0]);
      }
    } catch (error) {
      console.error("Failed to load character:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="character-panel loading">Loading character...</div>;
  }

  if (!character) {
    return <div className="character-panel empty">No character selected</div>;
  }

  return (
    <div className="character-panel">
      <div className="panel-header">
        <CharacterAvatar
          avatar={character.avatar}
          name={character.name}
          size="medium"
          showName={false}
        />
        <div className="header-text">
          <h3>{character.name}</h3>
          <span className="scl-badge">SCL: {character.scl || 0}</span>
        </div>
      </div>

      {character.fateCards && (
        <div className="fate-cards-section">
          <h4>Fate Cards</h4>
          <FateCardDeck fateCards={character.fateCards} size="small" layout="vertical" />
        </div>
      )}

      <div className="stats-section">
        <h4>Primary Stats</h4>
        <div className="stats-grid">
          <StatRow label="STR" value={character.strength} />
          <StatRow label="DEX" value={character.dexterity} />
          <StatRow label="CON" value={character.constitution} />
          <StatRow label="INT" value={character.intelligence} />
          <StatRow label="WIS" value={character.wisdom} />
          <StatRow label="CHA" value={character.charisma} />
          <StatRow label="PER" value={character.perception} />
          <StatRow label="RES" value={character.resolve} />
          <StatRow label="PRE" value={character.presence} />
        </div>
      </div>

      <div className="stats-section">
        <h4>Aether Stats</h4>
        <div className="stats-grid">
          <StatRow label="Fire" value={character.aether_fire} />
          <StatRow label="Ice" value={character.aether_ice} />
          <StatRow label="Void" value={character.aether_void} />
        </div>
      </div>

      <div className="tracks-section">
        <h4>Cost Tracks</h4>
        <TrackBar
          label="Blood"
          current={character.cost_tracks?.blood?.current || 0}
          maximum={character.cost_tracks?.blood?.maximum || 10}
        />
        <TrackBar
          label="Fate"
          current={character.cost_tracks?.fate?.current || 0}
          maximum={character.cost_tracks?.fate?.maximum || 10}
        />
        <TrackBar
          label="Stain"
          current={character.cost_tracks?.stain?.current || 0}
          maximum={character.cost_tracks?.stain?.maximum || 10}
        />
      </div>

      <div className="conditions-section">
        <h4>Conditions</h4>
        <ConditionDisplay
          label="Violence"
          value={character.conditions?.violence?.current || 0}
        />
        <ConditionDisplay
          label="Influence"
          value={character.conditions?.influence?.current || 0}
        />
        <ConditionDisplay
          label="Revelation"
          value={character.conditions?.revelation?.current || 0}
        />
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value?: number }) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value ?? 0}</span>
    </div>
  );
}

function TrackBar({
  label,
  current,
  maximum,
}: {
  label: string;
  current: number;
  maximum: number;
}) {
  const percentage = maximum > 0 ? (current / maximum) * 100 : 0;

  return (
    <div className="track-bar">
      <div className="track-label">
        {label}: {current}/{maximum}
      </div>
      <div className="track-progress">
        <div className="track-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function ConditionDisplay({ label, value }: { label: string; value: number }) {
  return (
    <div className="condition-display">
      <span className="condition-label">{label}</span>
      <span className="condition-value">{value}</span>
    </div>
  );
}
