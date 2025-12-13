/**
 * ConditionBadge Component
 *
 * Displays a condition badge with color-coded severity based on the
 * Wuxiaxian TTRPG condition ladder system:
 * - 1st Degree: Minor effect (yellow)
 * - 2nd Degree: Moderate effect (orange)
 * - 3rd Degree: Severe effect (red)
 * - 4th Degree: Critical/incapacitating (dark red)
 */

import React from "react";

interface ConditionBadgeProps {
  condition: string;
  pillar?: "violence" | "influence" | "revelation";
}

interface ConditionData {
  label: string;
  degree: 1 | 2 | 3 | 4;
  effect: string;
  color: string;
  bgColor: string;
}

const CONDITION_MAP: Record<string, ConditionData> = {
  // Violence conditions (Body)
  wounded: {
    label: "Wounded",
    degree: 1,
    effect: "-2 to physical actions",
    color: "#fff",
    bgColor: "#b8860b", // Dark golden
  },
  crippled: {
    label: "Crippled",
    degree: 2,
    effect: "Wounded penalties + Hindered movement",
    color: "#fff",
    bgColor: "#d2691e", // Chocolate
  },
  downed: {
    label: "Downed",
    degree: 3,
    effect: "Prone, can only crawl or take limited actions",
    color: "#fff",
    bgColor: "#cd5c5c", // Indian red
  },
  ruined_body: {
    label: "Ruined Body",
    degree: 4,
    effect: "Incapacitated - requires story intervention to recover",
    color: "#fff",
    bgColor: "#8b0000", // Dark red
  },

  // Influence conditions (Mind)
  shaken: {
    label: "Shaken",
    degree: 1,
    effect: "-2 to social/mental actions",
    color: "#fff",
    bgColor: "#4682b4", // Steel blue
  },
  compromised: {
    label: "Compromised",
    degree: 2,
    effect: "Shaken penalties + vulnerable to manipulation",
    color: "#fff",
    bgColor: "#483d8b", // Dark slate blue
  },
  subjugated: {
    label: "Subjugated",
    degree: 3,
    effect: "Must follow influence or flee",
    color: "#fff",
    bgColor: "#6a5acd", // Slate blue
  },

  // Revelation conditions (Soul)
  disturbed: {
    label: "Disturbed",
    degree: 1,
    effect: "-2 to perception and willpower",
    color: "#fff",
    bgColor: "#556b2f", // Dark olive green
  },
  fractured: {
    label: "Fractured",
    degree: 2,
    effect: "Disturbed penalties + reality distortion",
    color: "#fff",
    bgColor: "#228b22", // Forest green
  },
  unhinged: {
    label: "Unhinged",
    degree: 3,
    effect: "Must flee or lash out irrationally",
    color: "#fff",
    bgColor: "#006400", // Dark green
  },

  // Shared 4th degree
  shattered_broken: {
    label: "Shattered/Broken",
    degree: 4,
    effect: "Incapacitated - story-level consequence",
    color: "#fff",
    bgColor: "#1a0a0a", // Near black
  },
};

function getDegreeIcon(degree: number): string {
  switch (degree) {
    case 1:
      return "•";
    case 2:
      return "••";
    case 3:
      return "•••";
    case 4:
      return "✦";
    default:
      return "";
  }
}

export default function ConditionBadge({
  condition,
  pillar: _pillar,
}: ConditionBadgeProps): React.ReactElement {
  const conditionKey = condition.toLowerCase().replace(/[\s-]/g, "_");
  const data = CONDITION_MAP[conditionKey];

  if (!data) {
    // Unknown condition - show generic badge
    return (
      <span
        style={{
          display: "inline-block",
          padding: "2px 8px",
          marginRight: "4px",
          marginBottom: "4px",
          backgroundColor: "#666",
          color: "#fff",
          borderRadius: "4px",
          fontSize: "0.75em",
          fontWeight: 500,
        }}
        title={`Unknown condition: ${condition}`}
      >
        {condition}
      </span>
    );
  }

  const badgeStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "2px 8px",
    marginRight: "4px",
    marginBottom: "4px",
    backgroundColor: data.bgColor,
    color: data.color,
    borderRadius: "4px",
    fontSize: "0.75em",
    fontWeight: 500,
    cursor: "help",
    boxShadow:
      data.degree === 4 ? "0 0 6px rgba(139, 0, 0, 0.6)" : "0 1px 2px rgba(0,0,0,0.3)",
  };

  const degreeStyle: React.CSSProperties = {
    fontSize: "0.8em",
    opacity: 0.8,
    letterSpacing: data.degree === 4 ? "0" : "-1px",
  };

  return (
    <span style={badgeStyle} title={`${data.label} (${data.degree}°): ${data.effect}`}>
      <span style={degreeStyle}>{getDegreeIcon(data.degree)}</span>
      <span>{data.label}</span>
    </span>
  );
}

export { CONDITION_MAP };
export type { ConditionData, ConditionBadgeProps };
