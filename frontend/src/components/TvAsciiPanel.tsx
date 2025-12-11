import { useCallback, useMemo, useState } from "react";
import "../styles/TvAsciiPanel.css";

interface TvAsciiPanelProps {
  asciiArt: string;
  onRefresh: () => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
}

export default function TvAsciiPanel({
  asciiArt,
  onRefresh,
  loading = false,
  error,
}: TvAsciiPanelProps) {
  const [fontSize, setFontSize] = useState(13);
  const [inverted, setInverted] = useState(false);

  const handleRefresh = useCallback(async () => {
    try {
      await onRefresh();
    } catch (err) {
      console.error("Failed to refresh ASCII art", err);
    }
  }, [onRefresh]);

  const displayArt = useMemo(
    () => asciiArt || "Awaiting TV render...",
    [asciiArt]
  );

  return (
    <section className={`tv-panel ${inverted ? "tv-panel--inverted" : ""}`}>
      <header className="tv-panel__header">
        <div>
          <h3>TV ASCII Panel</h3>
          <p className="tv-panel__subtitle">
            Shared render output for the room. Resize, zoom, or invert for clarity.
          </p>
        </div>
        <div className="tv-panel__controls">
          <label className="tv-panel__control">
            <span>Zoom</span>
            <input
              type="range"
              min={10}
              max={24}
              step={1}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              aria-label="ASCII art zoom"
            />
            <span className="tv-panel__value">{fontSize}px</span>
          </label>
          <label className="tv-panel__control">
            <input
              type="checkbox"
              checked={inverted}
              onChange={(e) => setInverted(e.target.checked)}
            />
            <span>Invert contrast</span>
          </label>
          <button
            className="tv-panel__button"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Swap art"}
          </button>
        </div>
      </header>

      {error && <div className="tv-panel__error">{error}</div>}

      <div className="tv-panel__body" style={{ fontSize: `${fontSize}px` }}>
        <pre className="tv-panel__art">{displayArt}</pre>
      </div>
    </section>
  );
}
