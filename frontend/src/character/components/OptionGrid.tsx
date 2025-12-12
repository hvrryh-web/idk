/**
 * Option Grid Component
 * 
 * Displays selectable options for the current category
 */

import { useCharacterCreatorStore } from "../state/useCharacterCreatorStore";
import { getCategoryById } from "../data/manifest";

export function OptionGrid() {
  const { manifest, selectedCategory, appearance, selectOption } = useCharacterCreatorStore();

  if (!manifest) {
    return <div style={styles.loading}>Loading options...</div>;
  }

  const category = getCategoryById(manifest, selectedCategory);
  
  if (!category) {
    return <div style={styles.error}>Category not found</div>;
  }

  const selectedOptionId = appearance.selections[selectedCategory];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>{category.name}</h3>
        <p style={styles.description}>{category.description}</p>
      </div>
      <div
        style={styles.grid}
        role="radiogroup"
        aria-label={`${category.name} options`}
      >
        {category.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              style={{
                ...styles.option,
                ...(isSelected ? styles.optionSelected : {}),
              }}
              onClick={() => selectOption(selectedCategory, option.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  selectOption(selectedCategory, option.id);
                }
              }}
            >
              {option.thumbnail && (
                <img
                  src={option.thumbnail}
                  alt={option.name}
                  style={styles.thumbnail}
                />
              )}
              <div style={styles.optionName}>{option.name}</div>
              {isSelected && <div style={styles.checkmark}>✓</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  header: {
    paddingBottom: "0.5rem",
    borderBottom: "2px solid #3a3a3a",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
    color: "#ffffff",
    fontWeight: "600" as const,
  },
  description: {
    margin: "0.5rem 0 0 0",
    fontSize: "0.9rem",
    color: "#b0b0b0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "1rem",
    padding: "0.5rem",
  },
  option: {
    position: "relative" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem",
    backgroundColor: "#3a3a3a",
    border: "2px solid transparent",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
  },
  optionSelected: {
    backgroundColor: "#4a7aaa",
    borderColor: "#6a9aca",
    boxShadow: "0 4px 8px rgba(74, 122, 170, 0.3)",
  },
  thumbnail: {
    width: "64px",
    height: "64px",
    objectFit: "cover" as const,
    borderRadius: "4px",
    backgroundColor: "#2a2a2a",
  },
  optionName: {
    fontSize: "0.9rem",
    color: "#e0e0e0",
    textAlign: "center" as const,
    fontWeight: "500" as const,
  },
  checkmark: {
    position: "absolute" as const,
    top: "0.5rem",
    right: "0.5rem",
    width: "24px",
    height: "24px",
    backgroundColor: "#22c55e",
    color: "#ffffff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    fontWeight: "bold" as const,
  },
  loading: {
    padding: "2rem",
    textAlign: "center" as const,
    color: "#b0b0b0",
  },
  error: {
    padding: "2rem",
    textAlign: "center" as const,
    color: "#ef4444",
  },
};
