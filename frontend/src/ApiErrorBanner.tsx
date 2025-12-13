export function ApiErrorBanner({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <div style={{ background: "#ffdddd", color: "#900", padding: "1em", position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <strong>API Error:</strong> {error}
    </div>
  );
}
