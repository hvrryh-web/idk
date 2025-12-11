import type { FateCardSet } from "../types";
import FateCardDisplay from "./FateCardDisplay";
import "../styles/FateCardDeck.css";

interface FateCardDeckProps {
  fateCards?: FateCardSet;
  size?: "small" | "medium" | "large";
  layout?: "horizontal" | "vertical" | "grid";
}

export default function FateCardDeck({
  fateCards,
  size = "small",
  layout = "horizontal",
}: FateCardDeckProps) {
  if (!fateCards) {
    return (
      <div className="fate-card-deck empty">
        <p>No Fate Cards selected</p>
      </div>
    );
  }

  const layoutClass = `deck-layout-${layout}`;

  return (
    <div className={`fate-card-deck ${layoutClass}`}>
      {fateCards.deathCard && (
        <div className="deck-section">
          <h4 className="deck-section-title">Death Card</h4>
          <FateCardDisplay card={fateCards.deathCard} size={size} />
        </div>
      )}

      {fateCards.bodyCard && (
        <div className="deck-section">
          <h4 className="deck-section-title">Body Card</h4>
          <FateCardDisplay card={fateCards.bodyCard} size={size} />
        </div>
      )}

      {fateCards.seedCards && fateCards.seedCards.length > 0 && (
        <div className="deck-section">
          <h4 className="deck-section-title">
            Seed Card{fateCards.seedCards.length > 1 ? "s" : ""}
          </h4>
          <div className="seed-cards-container">
            {fateCards.seedCards.map((card, index) => (
              <FateCardDisplay key={index} card={card} size={size} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
