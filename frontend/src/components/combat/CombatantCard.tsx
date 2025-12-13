import type { CombatantState } from "../../types";
import ConditionBadge from "./ConditionBadge";
import CostTrackDisplay from "./CostTrackDisplay";

interface CombatantCardProps {
  combatant: CombatantState;
  isAlly: boolean;
  isActive: boolean;
  isTargetable: boolean;
  isSelected: boolean;
  onSelect?: () => void;
}

export default function CombatantCard({
  combatant,
  isAlly,
  isActive,
  isTargetable,
  isSelected,
  onSelect,
}: CombatantCardProps) {
  const thpPercent = combatant.max_thp > 0 ? (combatant.thp / combatant.max_thp) * 100 : 0;
  const aePercent = combatant.max_ae > 0 ? (combatant.ae / combatant.max_ae) * 100 : 0;
  const strainPercent = (combatant.strain / 10) * 100;

  const cardStyle: React.CSSProperties = {
    border: isActive ? "3px solid gold" : isSelected ? "2px solid cyan" : "1px solid #666",
    opacity: isTargetable ? 1.0 : combatant.thp > 0 ? 0.9 : 0.5,
    cursor: isTargetable ? "pointer" : "default",
    padding: "12px",
    margin: "8px",
    backgroundColor: isSelected ? "#334" : "#222",
    borderRadius: "8px",
    width: "200px",
    boxShadow: isTargetable ? "0 0 15px rgba(0, 255, 255, 0.5)" : "none",
    transition: "all 0.3s ease",
  };

  return (
    <div style={cardStyle} onClick={isTargetable ? onSelect : undefined}>
      <h3 style={{ margin: "0 0 8px 0", color: isAlly ? "#5f5" : "#f55" }}>{combatant.name}</h3>
      <p style={{ margin: "4px 0", fontSize: "0.9em", color: "#aaa" }}>
        {combatant.is_boss ? "Boss" : "Character"}
        {combatant.scl !== undefined && (
          <span style={{ marginLeft: "8px", color: "#88f" }}>
            SCL {combatant.scl}
          </span>
        )}
        {combatant.sequence_band && (
          <span
            style={{
              display: "block",
              fontSize: "0.85em",
              color: "#999",
              marginTop: "2px",
            }}
          >
            {combatant.sequence_band}
          </span>
        )}
      </p>

      {/* THP Bar */}
      <div style={{ marginBottom: "8px" }}>
        <div style={{ fontSize: "0.85em", marginBottom: "2px" }}>
          THP: {combatant.thp}/{combatant.max_thp}
        </div>
        <div
          style={{
            width: "100%",
            height: "12px",
            backgroundColor: "#333",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${thpPercent}%`,
              height: "100%",
              backgroundColor: thpPercent > 50 ? "#5f5" : thpPercent > 25 ? "#ff5" : "#f55",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* AE Bar */}
      <div style={{ marginBottom: "8px" }}>
        <div style={{ fontSize: "0.85em", marginBottom: "2px" }}>
          AE: {combatant.ae}/{combatant.max_ae}
        </div>
        <div
          style={{
            width: "100%",
            height: "10px",
            backgroundColor: "#333",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${aePercent}%`,
              height: "100%",
              backgroundColor: "#55f",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* Strain Bar (if any) */}
      {combatant.strain > 0 && (
        <div style={{ marginBottom: "8px" }}>
          <div style={{ fontSize: "0.85em", marginBottom: "2px" }}>
            Strain: {combatant.strain}/10
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              backgroundColor: "#333",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${strainPercent}%`,
                height: "100%",
                backgroundColor: strainPercent > 70 ? "#f33" : "#f93",
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>
      )}

      {/* Guard (if any) */}
      {combatant.guard > 0 && (
        <div style={{ fontSize: "0.85em", marginBottom: "4px", color: "#aaa" }}>
          Guard: {combatant.guard}
        </div>
      )}

      {/* SPD Band */}
      <div style={{ fontSize: "0.85em", marginBottom: "4px", color: "#aaa" }}>
        SPD: {combatant.spd_band}
      </div>

      {/* Conditions */}
      {combatant.conditions && combatant.conditions.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          {combatant.conditions.map((cond, i) => (
            <ConditionBadge key={i} condition={cond} />
          ))}
        </div>
      )}

      {/* Cost Tracks (if available) */}
      {combatant.cost_tracks && (
        <CostTrackDisplay costTracks={combatant.cost_tracks} compact />
      )}
    </div>
  );
}
