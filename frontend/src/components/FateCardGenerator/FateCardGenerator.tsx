import { useState, useCallback } from "react";
import type { FateCard } from "../../types";
import "../styles/FateCardDisplay.css";
import "./FateCardGenerator.css";

interface FateCardGeneratorProps {
  card: FateCard;
  onGenerationComplete?: (card: FateCard, imageUrl: string) => void;
}

interface GenerationStatus {
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  imageUrl?: string;
  error?: string;
}

const API_BASE = "/api/v1/fate-cards";

export default function FateCardGenerator({
  card,
  onGenerationComplete,
}: FateCardGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const startGeneration = useCallback(async () => {
    setIsGenerating(true);
    setGenerationStatus(null);

    try {
      const response = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          card_type: card.type,
          card_id: card.id.replace(`${card.type}-`, "").replace(/-/g, "_"),
          card_name: card.name,
          rarity: card.rarity,
          color_scheme: card.colour,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Generation failed");
      }

      const data = await response.json();
      
      setGenerationStatus({
        jobId: data.job_id,
        status: "queued",
        progress: 0,
      });

      // Start polling for status
      pollStatus(data.job_id);
    } catch (error) {
      setGenerationStatus({
        jobId: "",
        status: "failed",
        progress: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      setIsGenerating(false);
    }
  }, [card]);

  const pollStatus = useCallback(async (jobId: string) => {
    const maxAttempts = 120; // 2 minutes max
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setGenerationStatus((prev) => ({
          ...prev!,
          status: "failed",
          error: "Generation timed out",
        }));
        setIsGenerating(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/status/${jobId}`);
        const data = await response.json();

        setGenerationStatus({
          jobId,
          status: data.status,
          progress: data.progress_percent || 0,
          imageUrl: data.outputs?.final,
          error: data.error_message,
        });

        if (data.status === "completed") {
          setIsGenerating(false);
          if (data.outputs?.final) {
            setPreviewUrl(data.outputs.final);
            onGenerationComplete?.(card, data.outputs.final);
          }
          return;
        }

        if (data.status === "failed") {
          setIsGenerating(false);
          return;
        }

        // Continue polling
        attempts++;
        setTimeout(poll, 1000);
      } catch (error) {
        attempts++;
        setTimeout(poll, 2000); // Longer delay on error
      }
    };

    poll();
  }, [card, onGenerationComplete]);

  const getStatusMessage = () => {
    if (!generationStatus) return "";
    
    switch (generationStatus.status) {
      case "queued":
        return "Waiting in queue...";
      case "processing":
        return `Generating: ${Math.round(generationStatus.progress)}%`;
      case "completed":
        return "Generation complete!";
      case "failed":
        return `Failed: ${generationStatus.error || "Unknown error"}`;
      default:
        return "";
    }
  };

  const getCardTypeIcon = () => {
    switch (card.type) {
      case "death":
        return "💀";
      case "body":
        return "💪";
      case "seed":
        return "🌱";
      default:
        return "🃏";
    }
  };

  const getRarityClass = () => {
    return `rarity-${card.rarity}`;
  };

  return (
    <div className={`fate-card-generator ${getRarityClass()}`}>
      <div className="generator-card-header">
        <span className="card-type-icon">{getCardTypeIcon()}</span>
        <h4>{card.name}</h4>
        <span className={`rarity-badge ${card.rarity}`}>{card.rarity}</span>
      </div>

      <div className="generator-preview-area">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={`${card.name} artwork`}
            className="generated-preview"
          />
        ) : (
          <div className="placeholder-preview">
            <div className="placeholder-icon">{getCardTypeIcon()}</div>
            <p>{card.summary}</p>
          </div>
        )}
      </div>

      <div className="generator-info">
        <p className="card-description">{card.description}</p>
        
        {card.keywords && card.keywords.length > 0 && (
          <div className="card-keywords">
            {card.keywords.map((keyword) => (
              <span key={keyword} className="keyword-tag">
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="generator-controls">
        {isGenerating ? (
          <div className="generation-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${generationStatus?.progress || 0}%` }}
              />
            </div>
            <p className="status-message">{getStatusMessage()}</p>
          </div>
        ) : (
          <button
            className="generate-button"
            onClick={startGeneration}
            disabled={generationStatus?.status === "completed"}
          >
            {generationStatus?.status === "completed"
              ? "✓ Generated"
              : "🎨 Generate Artwork"}
          </button>
        )}
      </div>

      {generationStatus?.status === "failed" && (
        <div className="error-message">
          <p>⚠️ {generationStatus.error}</p>
          <button className="retry-button" onClick={startGeneration}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
