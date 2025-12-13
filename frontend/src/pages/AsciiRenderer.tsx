import { useMemo, useState, type ReactNode } from "react";
import { renderAsciiArt } from "../api";
import type { AsciiRenderResponse } from "../types";

const CHARSETS = [
  { value: "dense", label: "Dense (@%#*+=-:. )" },
  { value: "sparse", label: "Sparse (@#S%?*+;:,. )" },
];

const BRIGHTNESS_MIN = 0;
const BRIGHTNESS_MAX = 255;

export default function AsciiRenderer() {
  const [file, setFile] = useState<File | null>(null);
  const [charset, setCharset] = useState("dense");
  const [brightnessThreshold, setBrightnessThreshold] = useState(48);
  const [width, setWidth] = useState(80);
  const [colorized, setColorized] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [result, setResult] = useState<AsciiRenderResponse | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ansiNodes = useMemo(() => {
    if (!result || !result.colorized) return null;
    // eslint-disable-next-line no-control-regex
    const regex = /\u001b\[38;2;(\d+);(\d+);(\d+)m|\u001b\[0m/g;
    const nodes: ReactNode[] = [];
    let lastIndex = 0;
    let currentColor: string | undefined;
    let key = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(result.ascii || "")) !== null) {
      if (match.index > lastIndex) {
        const chunk = (result.ascii || "").slice(lastIndex, match.index);
        nodes.push(
          <span key={`chunk-${key++}`} style={{ color: currentColor }}>
            {chunk}
          </span>
        );
      }

      if (match[0] === "\u001b[0m") {
        currentColor = undefined;
      } else {
        currentColor = `rgb(${match[1]}, ${match[2]}, ${match[3]})`;
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < (result.ascii || "").length) {
      nodes.push(
        <span key={`tail-${key}`} style={{ color: currentColor }}>
          {(result.ascii || "").slice(lastIndex)}
        </span>
      );
    }

    return nodes;
  }, [result]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setStatus(null);

    if (!file) {
      setError("Please choose an image to convert.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("charset", charset);
    formData.append("brightness_threshold", String(brightnessThreshold));
    formData.append("width", String(width));
    formData.append("color", String(colorized));

    setIsSubmitting(true);
    setStatus("Uploading and converting image...");

    try {
      const response = await renderAsciiArt(formData);
      setResult(response);
      setStatus(
        response.cached
          ? "Served from cache. Rendering skipped for identical input."
          : `Rendered in ${response.duration_ms ? response.duration_ms.toFixed(1) : "0"} ms.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to render image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`ascii-studio ${highContrast ? "high-contrast" : ""}`}
      aria-live="polite"
    >
      <header className="ascii-header">
        <div>
          <p className="eyebrow">Image to ASCII</p>
          <h1>Render images as ANSI-friendly ASCII art</h1>
          <p className="lede">
            Upload an image, choose a character set, tune brightness, and opt into colorized
            ANSI output for terminals. All settings are cached by image hash to avoid redundant
            conversions.
          </p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="secondary"
            onClick={() => setHighContrast((value) => !value)}
            aria-pressed={highContrast}
            aria-label="Toggle high-contrast viewing mode"
          >
            {highContrast ? "Disable" : "Enable"} high-contrast mode
          </button>
        </div>
      </header>

      <form className="ascii-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="file-upload">Upload image</label>
          <input
            id="file-upload"
            name="file"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            aria-label="Upload an image to convert to ASCII"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            required
          />
          <small>Supported types: PNG, JPEG, WEBP, GIF. Max size: 5 MB.</small>
        </div>

        <div className="grid two-col">
          <div className="field">
            <label htmlFor="charset">Character set</label>
            <select
              id="charset"
              value={charset}
              onChange={(event) => setCharset(event.target.value)}
              aria-label="Choose ASCII density"
            >
              {CHARSETS.map((set) => (
                <option key={set.value} value={set.value}>
                  {set.label}
                </option>
              ))}
            </select>
            <small>Dense maps more symbols to brightness; sparse uses fewer, blockier shapes.</small>
          </div>

          <div className="field inline">
            <div className="field">
              <label htmlFor="brightness">Brightness threshold</label>
              <input
                id="brightness"
                type="range"
                min={BRIGHTNESS_MIN}
                max={BRIGHTNESS_MAX}
                value={brightnessThreshold}
                onChange={(event) => setBrightnessThreshold(Number(event.target.value))}
                aria-label="Brightness threshold slider"
              />
              <div className="range-meta" aria-live="polite">
                <span>Shadow cutoff</span>
                <strong>{brightnessThreshold}</strong>
                <span>Highlight</span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="width">Output width (chars)</label>
              <input
                id="width"
                type="number"
                min={24}
                max={160}
                step={2}
                value={width}
                aria-label="Output width in characters"
                onChange={(event) => setWidth(Number(event.target.value))}
              />
              <small>Adjust for your terminal or layout. Height auto scales with aspect ratio.</small>
            </div>
          </div>
        </div>

        <div className="toggles" role="group" aria-label="Output options">
          <label className="toggle">
            <input
              type="checkbox"
              checked={colorized}
              onChange={(event) => setColorized(event.target.checked)}
              aria-label="Enable colorized ANSI output"
            />
            <span>Colorize output with ANSI codes</span>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(event) => setHighContrast(event.target.checked)}
              aria-label="Use high-contrast view"
            />
            <span>High-contrast preview</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? "Converting..." : "Render ASCII"}
          </button>
          {status && (
            <p className="status" role="status">
              {status}
            </p>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </div>
      </form>

      {result && (
        <section className="ascii-output" aria-live="polite">
          <div className="output-meta">
            <h2>ASCII output</h2>
            <div className="badges">
              <span className="badge">Charset: {result.charset}</span>
              <span className="badge">Threshold: {result.brightness_threshold}</span>
              <span className="badge">Width: {result.width}</span>
              <span className="badge">{result.cached ? "Cached" : "Fresh render"}</span>
              {result.colorized && <span className="badge">Colorized ANSI</span>}
            </div>
          </div>

          <div className="preview" aria-label="ASCII preview">
            <pre className={`ascii-preview ${highContrast ? "contrast" : ""}`}>
              {result.colorized && ansiNodes ? ansiNodes : result.ascii}
            </pre>
          </div>

          <label className="field" htmlFor="raw-output">
            Raw output (copy-friendly)
            <textarea
              id="raw-output"
              value={result.ascii}
              readOnly
              rows={10}
              aria-label="Raw ASCII output"
            />
          </label>
        </section>
      )}
    </div>
  );
}
