/**
 * CombatResultModal Component
 *
 * Displays combat outcome with victory/defeat styling,
 * conditions gained, cost track changes, and story continuation.
 */

import React from "react";
import type { CombatantState, LogEntry } from "../../types";

interface CombatResult {
  victor: "party" | "enemies" | null;
  party: CombatantState[];
  enemies: CombatantState[];
  combatLog: LogEntry[];
}

interface CombatResultModalProps {
  result: CombatResult;
  onContinue: () => void;
  onRematch?: () => void;
}

function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    wounded: "Wounded (1°)",
    crippled: "Crippled (2°)",
    downed: "Downed (3°)",
    ruined_body: "Ruined Body (4°)",
    shaken: "Shaken (1°)",
    compromised: "Compromised (2°)",
    subjugated: "Subjugated (3°)",
    disturbed: "Disturbed (1°)",
    fractured: "Fractured (2°)",
    unhinged: "Unhinged (3°)",
    shattered_broken: "Shattered/Broken (4°)",
  };
  return labels[condition.toLowerCase()] || condition;
}

function CombatantSummary({ combatant, isAlly }: { combatant: CombatantState; isAlly: boolean }) {
  const isDefeated = combatant.thp <= 0;
  const hasConditions = combatant.conditions && combatant.conditions.length > 0;
  
  const bloodCurrent = combatant.cost_tracks?.blood?.current ?? 0;
  const fateCurrent = combatant.cost_tracks?.fate?.current ?? 0;
  const stainCurrent = combatant.cost_tracks?.stain?.current ?? 0;
  const hasCostMarks = bloodCurrent > 0 || fateCurrent > 0 || stainCurrent > 0;

  return (
    <div
      style={{
        padding: "12px",
        marginBottom: "8px",
        backgroundColor: isDefeated ? "#2a1a1a" : "#1a2a1a",
        borderRadius: "8px",
        borderLeft: `4px solid ${isDefeated ? "#c44" : isAlly ? "#4c4" : "#c44"}`,
        opacity: isDefeated ? 0.7 : 1,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>
          {combatant.name}
          {isDefeated && <span style={{ color: "#c44", marginLeft: "8px" }}>(Defeated)</span>}
        </span>
        <span style={{ color: "#888" }}>
          THP: {combatant.thp}/{combatant.max_thp}
        </span>
      </div>

      {hasConditions && (
        <div style={{ marginTop: "8px" }}>
          <span style={{ color: "#888", fontSize: "0.9em" }}>Conditions: </span>
          {combatant.conditions?.map((cond, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                padding: "2px 8px",
                marginRight: "4px",
                backgroundColor: "#533",
                borderRadius: "4px",
                fontSize: "0.85em",
              }}
            >
              {getConditionLabel(cond)}
            </span>
          ))}
        </div>
      )}

      {hasCostMarks && (
        <div style={{ marginTop: "8px", display: "flex", gap: "12px", fontSize: "0.9em" }}>
          {bloodCurrent > 0 && (
            <span style={{ color: "#dc3545" }}>
              💉 Blood: {bloodCurrent}
            </span>
          )}
          {fateCurrent > 0 && (
            <span style={{ color: "#6f42c1" }}>
              🌀 Fate: {fateCurrent}
            </span>
          )}
          {stainCurrent > 0 && (
            <span style={{ color: "#1a1a2e" }}>
              🖤 Stain: {stainCurrent}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function CombatResultModal({
  result,
  onContinue,
  onRematch,
}: CombatResultModalProps): React.ReactElement {
  const isVictory = result.victor === "party";

  const modalStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: "#1a1a1a",
    borderRadius: "16px",
    padding: "32px",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    border: `4px solid ${isVictory ? "#4a4" : "#a44"}`,
    boxShadow: `0 0 40px ${isVictory ? "rgba(68, 170, 68, 0.5)" : "rgba(170, 68, 68, 0.5)"}`,
  };

  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "24px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "2.5em",
    fontWeight: "bold",
    color: isVictory ? "#5f5" : "#f55",
    textShadow: `0 0 20px ${isVictory ? "rgba(85, 255, 85, 0.5)" : "rgba(255, 85, 85, 0.5)"}`,
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "1.2em",
    color: "#aaa",
    marginTop: "8px",
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: "24px",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "1.1em",
    fontWeight: "bold",
    color: "#888",
    marginBottom: "12px",
    borderBottom: "1px solid #333",
    paddingBottom: "8px",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "16px 32px",
    fontSize: "1.1em",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: isVictory ? "#4a4" : "#666",
    color: "#fff",
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "transparent",
    border: "2px solid #666",
    color: "#aaa",
    marginLeft: "12px",
  };

  // Count total conditions gained by party
  const partyConditions = result.party.flatMap((c) => c.conditions || []);
  const totalDamageDealt = result.combatLog
    .filter((e) => e.damage && e.damage > 0)
    .reduce((sum, e) => sum + (e.damage || 0), 0);

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            {isVictory ? "⚔️ VICTORY ⚔️" : "💀 DEFEAT 💀"}
          </h1>
          <p style={subtitleStyle}>
            {isVictory
              ? "Your party has triumphed over the enemy!"
              : "Your party has been defeated..."}
          </p>
        </div>

        {/* Party Status */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Party Status</div>
          {result.party.map((combatant) => (
            <CombatantSummary key={combatant.id} combatant={combatant} isAlly={true} />
          ))}
        </div>

        {/* Combat Summary */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Combat Summary</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div
              style={{
                padding: "12px",
                backgroundColor: "#222",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2em", color: "#5af" }}>{totalDamageDealt}</div>
              <div style={{ color: "#888", fontSize: "0.9em" }}>Total Damage Dealt</div>
            </div>
            <div
              style={{
                padding: "12px",
                backgroundColor: "#222",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2em", color: partyConditions.length > 0 ? "#f95" : "#5f5" }}>
                {partyConditions.length}
              </div>
              <div style={{ color: "#888", fontSize: "0.9em" }}>Conditions Gained</div>
            </div>
          </div>
        </div>

        {/* Consequences */}
        {partyConditions.length > 0 && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>⚠️ Consequences</div>
            <div style={{ padding: "12px", backgroundColor: "#2a1a1a", borderRadius: "8px" }}>
              <p style={{ margin: 0, color: "#f95" }}>
                Your party has suffered the following conditions that will persist after combat:
              </p>
              <ul style={{ margin: "12px 0 0 0", paddingLeft: "20px" }}>
                {partyConditions.map((cond, i) => (
                  <li key={i} style={{ color: "#ccc", marginBottom: "4px" }}>
                    {getConditionLabel(cond)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button style={primaryButtonStyle} onClick={onContinue}>
            {isVictory ? "Continue Story" : "Accept Defeat"}
          </button>
          {onRematch && (
            <button style={secondaryButtonStyle} onClick={onRematch}>
              Rematch
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export type { CombatResult, CombatResultModalProps };
