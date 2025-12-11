import React from "react";

export function DebugPanel({ lastApiCall, lastStatus, apiError }: { lastApiCall: string | null, lastStatus: number | null, apiError: string | null }) {
  return (
    <div style={{ position: "fixed", bottom: 0, right: 0, background: "#222", color: "#fff", padding: "1em", zIndex: 1000, fontSize: "0.9em" }}>
      <div><strong>Last API Call:</strong> {lastApiCall || "-"}</div>
      <div><strong>Status:</strong> {lastStatus !== null ? lastStatus : "-"}</div>
      <div><strong>Error:</strong> {apiError || "None"}</div>
    </div>
  );
}
