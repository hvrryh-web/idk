/**
 * Category Tabs Component
 * 
 * Displays tabs for switching between customization categories
 */

import React from "react";
import { CategoryType } from "../data/types";
import { useCharacterCreatorStore } from "../state/useCharacterCreatorStore";

export function CategoryTabs() {
  const { manifest, selectedCategory, setSelectedCategory } = useCharacterCreatorStore();

  if (!manifest) {
    return null;
  }

  return (
    <div style={styles.container} role="tablist">
      {manifest.categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        return (
          <button
            key={category.id}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`panel-${category.id}`}
            style={{
              ...styles.tab,
              ...(isSelected ? styles.tabActive : {}),
            }}
            onClick={() => setSelectedCategory(category.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedCategory(category.id);
              }
            }}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "0.5rem",
    padding: "0.5rem",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
    overflowX: "auto" as const,
  },
  tab: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#3a3a3a",
    color: "#b0b0b0",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500" as const,
    transition: "all 0.2s ease",
    whiteSpace: "nowrap" as const,
    outline: "none",
  },
  tabActive: {
    backgroundColor: "#4a7aaa",
    color: "#ffffff",
    fontWeight: "600" as const,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
};
