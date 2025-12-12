/**
 * Swatch Picker Component
 * 
 * Displays color swatches for customization
 */

import React from "react";
import { SwatchType } from "../data/types";
import { useCharacterCreatorStore } from "../state/useCharacterCreatorStore";
import { getSwatchPalette } from "../data/manifest";

export function SwatchPicker() {
  const { manifest, appearance, selectSwatch } = useCharacterCreatorStore();

  if (!manifest) {
    return null;
  }

  const swatchTypes = [SwatchType.SKIN, SwatchType.HAIR, SwatchType.FABRIC];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Colors</h3>
      {swatchTypes.map((swatchType) => {
        const palette = getSwatchPalette(manifest, swatchType);
        if (!palette) return null;

        const selectedSwatchId = appearance.swatches[swatchType];

        return (
          <div key={swatchType} style={styles.paletteSection}>
            <h4 style={styles.paletteTitle}>{palette.name}</h4>
            <div
              style={styles.swatchGrid}
              role="radiogroup"
              aria-label={palette.name}
            >
              {palette.swatches.map((swatch) => {
                const isSelected = selectedSwatchId === swatch.id;
                return (
                  <button
                    key={swatch.id}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={swatch.name}
                    title={swatch.name}
                    style={{
                      ...styles.swatch,
                      backgroundColor: swatch.hexColor,
                      ...(isSelected ? styles.swatchSelected : {}),
                    }}
                    onClick={() => selectSwatch(swatchType, swatch.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectSwatch(swatchType, swatch.id);
                      }
                    }}
                  >
                    {isSelected && <div style={styles.checkmark}>✓</div>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.5rem",
    padding: "1rem",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
  },
  title: {
    margin: 0,
    fontSize: "1.3rem",
    color: "#ffffff",
    fontWeight: "600" as const,
  },
  paletteSection: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.75rem",
  },
  paletteTitle: {
    margin: 0,
    fontSize: "1rem",
    color: "#e0e0e0",
    fontWeight: "500" as const,
  },
  swatchGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
    gap: "0.5rem",
  },
  swatch: {
    position: "relative" as const,
    width: "40px",
    height: "40px",
    border: "2px solid transparent",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  swatchSelected: {
    borderColor: "#ffffff",
    boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.3), 0 4px 8px rgba(0, 0, 0, 0.3)",
    transform: "scale(1.1)",
  },
  checkmark: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#ffffff",
    fontSize: "1.2rem",
    fontWeight: "bold" as const,
    textShadow: "0 0 4px rgba(0, 0, 0, 0.8)",
  },
};
