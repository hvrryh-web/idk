/**
 * Complication Badge Component
 * 
 * Displays current complication count and list of complications.
 */

import React from "react";
import { ComplicationEntry } from "../types";

interface ComplicationBadgeProps {
  count: number;
  complications: ComplicationEntry[];
  expanded?: boolean;
}

export function ComplicationBadge({
  count,
  complications,
  expanded = false
}: ComplicationBadgeProps) {
  const [isExpanded, setIsExpanded] = React.useState(expanded);

  if (count === 0) {
    return (
      <div style={styles.badge}>
        <div style={styles.countZero}>
          ✓ No Complications
        </div>
      </div>
    );
  }

  return (
    <div style={styles.badge}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          ...styles.countButton,
          ...(count > 3 ? styles.countWarning : {}),
          ...(count > 5 ? styles.countDanger : {})
        }}
        aria-label={`${count} complications. Click to ${isExpanded ? "collapse" : "expand"}`}
        aria-expanded={isExpanded}
      >
        <span style={styles.icon}>⚠</span>
        <span style={styles.countText}>{count}</span>
        <span style={styles.label}>
          Complication{count !== 1 ? "s" : ""}
        </span>
        <span style={styles.arrow}>{isExpanded ? "▼" : "▶"}</span>
      </button>

      {isExpanded && complications.length > 0 && (
        <div style={styles.list}>
          <div style={styles.listHeader}>Complications:</div>
          {complications.map((comp, index) => (
            <div key={`${comp.categoryId}-${comp.timestamp}`} style={styles.listItem}>
              <div style={styles.itemNumber}>{index + 1}.</div>
              <div style={styles.itemContent}>
                <div style={styles.itemDescription}>{comp.description}</div>
                <div style={styles.itemMeta}>
                  {formatCategoryName(comp.categoryId)} • {comp.reason}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatCategoryName(categoryId: string): string {
  return categoryId
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const styles: Record<string, React.CSSProperties> = {
  badge: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "stretch",
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #333"
  },
  countZero: {
    padding: "8px 16px",
    color: "#4ade80",
    fontSize: "14px",
    fontWeight: "500"
  },
  countButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    backgroundColor: "transparent",
    border: "none",
    color: "#fbbf24",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s"
  },
  countWarning: {
    color: "#fb923c"
  },
  countDanger: {
    color: "#ef4444"
  },
  icon: {
    fontSize: "16px"
  },
  countText: {
    fontSize: "18px",
    fontWeight: "700",
    minWidth: "24px",
    textAlign: "center" as const
  },
  label: {
    flex: 1,
    textAlign: "left" as const
  },
  arrow: {
    fontSize: "10px",
    opacity: 0.7
  },
  list: {
    padding: "12px",
    borderTop: "1px solid #333",
    backgroundColor: "#0a0a0a"
  },
  listHeader: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#888",
    marginBottom: "8px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px"
  },
  listItem: {
    display: "flex",
    gap: "8px",
    padding: "8px 0",
    borderBottom: "1px solid #222"
  },
  itemNumber: {
    color: "#666",
    fontWeight: "600",
    fontSize: "12px",
    minWidth: "20px"
  },
  itemContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px"
  },
  itemDescription: {
    color: "#e5e5e5",
    fontSize: "13px",
    lineHeight: "1.4"
  },
  itemMeta: {
    color: "#888",
    fontSize: "11px"
  }
};
