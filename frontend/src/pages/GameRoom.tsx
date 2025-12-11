import { useNavigate } from "react-router-dom";
import { useState, useEffect, type ChangeEvent } from "react";
import { fetchCharacters } from "../api";
import { saveAsciiArt, loadAsciiArt } from "../asciiStore";
import type { Character } from "../types";

const densityRamp = "@%#*+=-:. ";
const maxAsciiWidth = 80;

const convertImageToAscii = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      const scale = Math.min(maxAsciiWidth / image.width, 1);
      const width = Math.max(1, Math.floor(image.width * scale));
      const height = Math.max(1, Math.floor(image.height * scale * 0.5));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      ctx.drawImage(image, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height).data;
      let ascii = "";

      for (let y = 0; y < height; y += 1) {
        let row = "";
        for (let x = 0; x < width; x += 1) {
          const offset = (y * width + x) * 4;
          const r = imageData[offset];
          const g = imageData[offset + 1];
          const b = imageData[offset + 2];
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          const densityIndex = Math.floor((luminance / 255) * (densityRamp.length - 1));
          row += densityRamp[densityRamp.length - 1 - densityIndex];
        }
        ascii += `${row}\n`;
      }

      resolve(ascii.trimEnd());
    };

    image.onerror = () => reject(new Error("Failed to load image for conversion"));
    image.src = src;
  });
};

export default function GameRoom() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionStatus, setConversionStatus] = useState("Idle");
  const [asciiArt, setAsciiArt] = useState(() => loadAsciiArt());
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    loadCharacters();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const loadCharacters = async () => {
    try {
      const data = await fetchCharacters();
      setCharacters(data);
    } catch (error) {
      console.error("Failed to load characters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchAlphaTest = () => {
    if (characters.length > 0) {
      navigate(`/profile/${characters[0].id}`);
    } else {
      alert("No characters available. Please create a character first.");
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setConversionStatus(file ? `Selected ${file.name}` : "Idle");
    setAsciiArt(loadAsciiArt());
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleConvertToAscii = () => {
    if (!selectedFile) {
      setConversionStatus("Please select an image to convert.");
      return;
    }

    setIsConverting(true);
    setConversionStatus("Reading image...");

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setConversionStatus("Processing pixels...");
        const ascii = await convertImageToAscii(reader.result as string);
        setAsciiArt(ascii);
        setConversionStatus("Conversion complete. Preview ready.");
      } catch (error) {
        console.error(error);
        setConversionStatus("Conversion failed. Please try a different image.");
      } finally {
        setIsConverting(false);
      }
    };
    reader.onerror = () => {
      setIsConverting(false);
      setConversionStatus("Could not read file. Please try again.");
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleSendToGameScreen = () => {
    if (!asciiArt) {
      setConversionStatus("Generate ASCII art before sending to the game screen.");
      return;
    }

    saveAsciiArt(asciiArt);
    setConversionStatus("ASCII art saved for the game screen.");
  };

  return (
    <div className="game-room">
      <div className="hero-section">
        <h1>WuXuxian TTRPG</h1>
        <p className="subtitle">A Fire Emblem–inspired, Xianxia-themed Visual Novel TTRPG</p>
      </div>

      <div className="action-section">
        <button className="launch-button" onClick={handleLaunchAlphaTest} disabled={loading}>
          🚀 LAUNCH ALPHA TEST
        </button>
        {loading && <p>Loading characters...</p>}
        {!loading && characters.length === 0 && (
          <p className="warning">No characters found. Create a character to begin.</p>
        )}
      </div>

      <div className="character-roster">
        <h2>Available Characters</h2>
        {characters.length > 0 ? (
          <ul className="character-list">
            {characters.map((char) => (
              <li key={char.id}>
                <button onClick={() => navigate(`/profile/${char.id}`)}>
                  {char.name} ({char.type})
                </button>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No characters yet.</p>
        )}
      </div>

      <div className="tv-panel">
        <div className="tv-header">
          <div>
            <h2>Broadcast to Game Room Screen</h2>
            <p className="tv-subtitle">Upload an image, convert it to ASCII, and beam it to the in-room TV.</p>
          </div>
          <span className="tv-indicator" aria-label="TV power indicator" />
        </div>

        <div className="tv-controls">
          <label className="file-picker">
            <span role="img" aria-label="satellite">🛰️</span> Load Reference Image
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          <div className="control-buttons">
            <button onClick={handleConvertToAscii} disabled={!selectedFile || isConverting}>
              {isConverting ? "Converting..." : "Convert to ASCII"}
            </button>
            <button onClick={handleSendToGameScreen} disabled={!asciiArt}>Send to Game Screen</button>
          </div>
          <p className="conversion-status">Status: {conversionStatus}</p>
        </div>

        <div className="tv-body">
          {previewUrl && (
            <div className="preview-window">
              <p className="preview-title">Input Preview</p>
              <img src={previewUrl} alt={selectedFile?.name ?? "Selected asset"} />
            </div>
          )}
          <div className="ascii-window">
            <p className="preview-title">ASCII Output</p>
            <pre className="ascii-preview" aria-live="polite">{asciiArt || "Awaiting conversion..."}</pre>
          </div>
        </div>
      </div>

      <div className="quick-nav">
        <h3>Quick Navigation</h3>
        <nav>
          <button onClick={() => navigate("/wiki")}>📚 Knowledge Wiki</button>
          <button onClick={() => navigate("/help")}>❓ Help & Search</button>
          <button onClick={() => navigate("/characters")}>👥 Character Manager</button>
          <button onClick={() => navigate("/ascii")}>🖼️ ASCII Renderer</button>
        </nav>
      </div>
    </div>
  );
}
