import type { Technique } from "../../types";

interface TechniqueSelectorProps {
  techniques: Technique[];
  currentAE: number;
  onSelectTechnique: (techId: string) => void;
  disabled?: boolean;
}

export default function TechniqueSelector({
  techniques,
  currentAE,
  onSelectTechnique,
  disabled = false,
}: TechniqueSelectorProps) {
  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: "#222",
        borderRadius: "8px",
        marginBottom: "12px",
      }}
    >
      <h3 style={{ margin: "0 0 12px 0" }}>Available Techniques</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {techniques.map((tech) => {
          const aeCost = tech.ae_cost || tech.cost || 0;
          const canAfford = currentAE >= aeCost;
          const isDisabled = !canAfford || disabled;

          return (
            <button
              key={tech.id}
              onClick={() => !isDisabled && tech.id && onSelectTechnique(String(tech.id))}
              disabled={isDisabled}
              style={{
                padding: "12px",
                backgroundColor: isDisabled ? "#333" : "#445",
                border: canAfford ? "2px solid #5f5" : "2px solid #555",
                borderRadius: "6px",
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.5 : 1,
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span style={{ fontSize: "1em", fontWeight: "bold" }}>
                  {canAfford ? "✓" : "✗"} {tech.name}
                </span>
                <span style={{ fontSize: "0.9em", color: canAfford ? "#5f5" : "#f55" }}>
                  {aeCost} AE
                </span>
              </div>

              <div style={{ fontSize: "0.85em", color: "#aaa", marginTop: "4px" }}>
                {tech.description || "No description"}
              </div>

              <div style={{ fontSize: "0.8em", color: "#888", marginTop: "6px" }}>
                {tech.base_damage && `Damage: ${tech.base_damage}`}
                {tech.self_strain && ` | Self-Strain: +${tech.self_strain}`}
              </div>

              {!canAfford && (
                <div style={{ fontSize: "0.8em", color: "#f55", marginTop: "4px" }}>
                  Not enough AE (need {aeCost - currentAE} more)
                </div>
              )}
            </button>
          );
        })}

        {techniques.length === 0 && (
          <p style={{ color: "#888", fontStyle: "italic", margin: "12px 0" }}>
            No techniques available
          </p>
        )}
      </div>
    </div>
  );
}
