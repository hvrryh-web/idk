import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCombatState, executeAction, executeQuickAction, fetchTechniques } from "../../api";
import CombatantCard from "./CombatantCard";
import TurnIndicator from "./TurnIndicator";
import TechniqueSelector from "./TechniqueSelector";
import QuickActionPanel from "./QuickActionPanel";
import CombatLog from "./CombatLog";
import type { CombatState, LogEntry, Technique } from "../../types";

export default function CombatView() {
  const { encounterId } = useParams<{ encounterId: string }>();
  const navigate = useNavigate();

  const [combatState, setCombatState] = useState<CombatState | null>(null);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [targetMode, setTargetMode] = useState(false);
  const [combatLog, setCombatLog] = useState<LogEntry[]>([]);

  useEffect(() => {
    loadCombatState();
    loadTechniques();
  }, [encounterId]);

  const loadCombatState = async () => {
    if (!encounterId) return;
    try {
      const state = await getCombatState(encounterId);
      setCombatState(state);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load combat state");
      setLoading(false);
    }
  };

  const loadTechniques = async () => {
    try {
      const techs = await fetchTechniques();
      setTechniques(techs);
    } catch (err) {
      console.error("Failed to load techniques:", err);
    }
  };

  const handleTechniqueSelect = (techId: string) => {
    setSelectedTechnique(techId);
    setTargetMode(true);
  };

  const handleTargetSelect = async (targetId: string) => {
    if (!encounterId || !selectedTechnique || !combatState) return;

    try {
      const activeCharId = combatState.active_character_id;
      if (!activeCharId) return;

      const response = await executeAction(
        encounterId,
        activeCharId,
        "technique",
        selectedTechnique,
        targetId
      );

      setCombatState(response.combat_state);
      setCombatLog((prev) => [...prev, ...response.log_entries]);
      setSelectedTechnique(null);
      setTargetMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to execute action");
      setTargetMode(false);
    }
  };

  const handleQuickAction = async (actionType: string) => {
    if (!encounterId || !combatState) return;

    try {
      const activeCharId = combatState.active_character_id;
      if (!activeCharId) return;

      const response = await executeQuickAction(encounterId, activeCharId, actionType);

      setCombatState(response.combat_state);
      setCombatLog((prev) => [...prev, ...response.log_entries]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to execute quick action");
    }
  };

  const handleCancelTarget = () => {
    setSelectedTechnique(null);
    setTargetMode(false);
  };

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <h2>Loading combat...</h2>
      </div>
    );
  }

  if (error || !combatState) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <h2>Error</h2>
        <p style={{ color: "#f55" }}>{error || "Combat state not found"}</p>
        <button onClick={() => navigate("/")}>Return to Home</button>
      </div>
    );
  }

  if (combatState.combat_ended) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <h1>{combatState.victor === "party" ? "⚔️ VICTORY ⚔️" : "💀 DEFEAT 💀"}</h1>
        <p style={{ fontSize: "1.2em", marginTop: "16px" }}>Combat has ended!</p>
        <div style={{ marginTop: "24px" }}>
          <button onClick={() => navigate("/")} style={{ padding: "12px 24px", fontSize: "1em" }}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const activeCharacter = combatState.active_character_id
    ? [...combatState.party, ...combatState.enemies].find(
        (c) => c.id === combatState.active_character_id
      )
    : null;

  const availableTechniques = activeCharacter
    ? techniques.filter((t) => t.id && activeCharacter.technique_ids?.includes(String(t.id)))
    : [];

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "16px" }}>Combat Encounter</h1>

      <TurnIndicator
        round={combatState.round}
        phase={combatState.phase}
        activeCharacter={activeCharacter?.name || null}
      />

      {targetMode && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#334",
            borderRadius: "8px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "1.1em" }}>🎯 Select Target</span>
          <button onClick={handleCancelTarget} style={{ padding: "8px 16px" }}>
            Cancel
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: "12px", color: "#5f5" }}>Party</h3>
          {combatState.party.map((char) => (
            <CombatantCard
              key={char.id}
              combatant={char}
              isAlly={true}
              isActive={char.id === combatState.active_character_id}
              isTargetable={false}
              isSelected={false}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3em",
            color: "#888",
          }}
        >
          VS
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: "12px", color: "#f55" }}>Enemies</h3>
          {combatState.enemies.map((char) => (
            <CombatantCard
              key={char.id}
              combatant={char}
              isAlly={false}
              isActive={char.id === combatState.active_character_id}
              isTargetable={targetMode && char.thp > 0}
              isSelected={false}
              onSelect={() => handleTargetSelect(char.id)}
            />
          ))}
        </div>
      </div>

      {combatState.is_player_turn && activeCharacter && (
        <div style={{ marginBottom: "24px" }}>
          {combatState.phase === "Major" && (
            <TechniqueSelector
              techniques={availableTechniques}
              currentAE={activeCharacter.ae}
              onSelectTechnique={handleTechniqueSelect}
              disabled={targetMode}
            />
          )}

          {(combatState.phase === "Quick1" || combatState.phase === "Quick2") && (
            <QuickActionPanel onSelectQuickAction={handleQuickAction} disabled={targetMode} />
          )}
        </div>
      )}

      <CombatLog entries={combatLog} maxHeight="300px" />
    </div>
  );
}
