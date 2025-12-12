import type { FateCard } from "../types";
import "../styles/FateCardDisplay.css";

interface FateCardDisplayProps {
  card: FateCard;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  selected?: boolean;
  showArt?: boolean;
}

export default function FateCardDisplay({
  card,
  size = "medium",
  onClick,
  selected = false,
  showArt = true,
}: FateCardDisplayProps) {
  const rarityClass = card.rarity ? `rarity-${card.rarity}` : "";
  const typeClass = `card-type-${card.type}`;
  const sizeClass = `card-${size}`;
  const selectedClass = selected ? "selected" : "";
  const clickableClass = onClick ? "clickable" : "";

  // Determine card color based on type and attributes
  const getCardColor = () => {
    if (card.type === "seed" && card.colour) {
      const colorMap: Record<string, string> = {
        Blue: "#4A90E2",
        Red: "#E74C3C",
        Green: "#27AE60",
        Black: "#34495E",
      };
      return colorMap[card.colour] || "#95A5A6";
    }
    if (card.type === "death") return "#7F8C8D";
    if (card.type === "body") return "#D35400";
    return "#95A5A6";
  };

  return (
    <div
      className={`fate-card ${typeClass} ${rarityClass} ${sizeClass} ${selectedClass} ${clickableClass}`}
      onClick={onClick}
      style={{ borderColor: getCardColor() }}
    >
      <div className="card-header" style={{ backgroundColor: getCardColor() }}>
        <div className="card-title">
          <h3>{card.name}</h3>
          {card.rarity && <span className="card-rarity">{card.rarity}</span>}
        </div>
        <div className="card-type-badge">{card.type ? card.type.toUpperCase() : ""}</div>
      </div>

      {/* Card Art Section */}
      {showArt && card.artPath && size !== "small" && (
        <div className="card-art-container">
          <img 
            src={card.artPath} 
            alt={`${card.name} card art`}
            className="card-art"
            loading="lazy"
          />
        </div>
      )}

      <div className="card-body">
        {card.archetype && (
          <div className="card-archetype">
            <strong>Archetype:</strong> {card.archetype}
          </div>
        )}
        
        {card.aspect && (
          <div className="card-aspect">
            <strong>Aspect:</strong> {card.aspect}
            {card.colour && <span className="seed-color"> ({card.colour})</span>}
          </div>
        )}

        <div className="card-summary">{card.summary}</div>

        {size !== "small" && (
          <div className="card-description">{card.description}</div>
        )}

        {card.keywords && card.keywords.length > 0 && (
          <div className="card-keywords">
            {card.keywords.map((keyword, index) => (
              <span key={index} className="keyword-tag">
                {keyword}
              </span>
            ))}
          </div>
        )}

        {card.mechanicalHooks && size !== "small" && (
          <div className="card-mechanics">
            <strong>Mechanical Effects:</strong>
            <div className="mechanics-list">
              {Object.entries(card.mechanicalHooks).map(([key, value]) => (
                <div key={key} className="mechanic-item">
                  <span className="mechanic-name">{key.replace(/_/g, " ")}:</span>
                  <span className="mechanic-value">+{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {card.statMods && size !== "small" && (
          <div className="card-stats">
            <strong>Stat Modifiers:</strong>
            <div className="stats-list">
              {Object.entries(card.statMods).map(([key, value]) => (
                <div key={key} className="stat-item">
                  <span className="stat-name">{key.toUpperCase()}:</span>
                  <span className="stat-value">+{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
