/**
 * CharacterGeneratorPanel
 * 
 * Main interface for triggering character generation with ComfyUI.
 * Allows users to configure character attributes and start generation.
 */

import React, { useState, useCallback } from 'react';
import { Wand2, Upload, Loader2 } from 'lucide-react';

interface CharacterGeneratorPanelProps {
  characterId?: string;
  onGenerationStart?: (jobId: string) => void;
  onError?: (error: string) => void;
}

type GenerationType = 'full' | 'poses' | 'outfits' | 'sheet';
type PillarEmphasis = 'violence' | 'influence' | 'revelation' | '';

interface GenerationConfig {
  basePrompt: string;
  pillarEmphasis: PillarEmphasis;
  sclLevel: number;
  skinTone: string;
  hairColor: string;
  clothingColors: string;
  faceReference: File | null;
}

const API_BASE = '/api/v1/comfyui';

export const CharacterGeneratorPanel: React.FC<CharacterGeneratorPanelProps> = ({
  characterId,
  onGenerationStart,
  onError,
}) => {
  const [generationType, setGenerationType] = useState<GenerationType>('full');
  const [isGenerating, setIsGenerating] = useState(false);
  const [comfyuiStatus, setComfyuiStatus] = useState<'unknown' | 'available' | 'unavailable'>('unknown');
  
  const [config, setConfig] = useState<GenerationConfig>({
    basePrompt: 'wuxia cultivator, martial artist, Chinese fantasy character',
    pillarEmphasis: '',
    sclLevel: 1,
    skinTone: 'fair',
    hairColor: 'black',
    clothingColors: 'white and blue',
    faceReference: null,
  });

  // Check ComfyUI availability
  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      const data = await response.json();
      setComfyuiStatus(data.comfyui_available ? 'available' : 'unavailable');
    } catch {
      setComfyuiStatus('unavailable');
    }
  }, []);

  React.useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const handleConfigChange = <K extends keyof GenerationConfig>(
    key: K,
    value: GenerationConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Constants for file validation
  const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleFaceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        onError?.(`Invalid file type. Allowed: PNG, JPG, JPEG, WebP`);
        event.target.value = ''; // Clear the input
        return;
      }
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        onError?.(`File too large. Maximum size: ${MAX_FILE_SIZE_MB}MB`);
        event.target.value = ''; // Clear the input
        return;
      }
      
      handleConfigChange('faceReference', file);
    }
  };

  const startGeneration = async () => {
    if (!characterId) {
      onError?.('No character selected');
      return;
    }

    setIsGenerating(true);

    try {
      // If face reference is provided, extract embedding first
      let faceEmbeddingId: string | null = null;
      if (config.faceReference) {
        const formData = new FormData();
        formData.append('image', config.faceReference);
        formData.append('character_id', characterId);

        const faceResponse = await fetch(`${API_BASE}/face/extract`, {
          method: 'POST',
          body: formData,
        });

        if (!faceResponse.ok) {
          throw new Error('Failed to extract face embedding');
        }

        const faceData = await faceResponse.json();
        faceEmbeddingId = faceData.embedding_id;
      }

      // Determine endpoint based on generation type
      const endpoints: Record<GenerationType, string> = {
        full: '/generate/character',
        poses: '/generate/poses-sheet',
        outfits: '/generate/outfits-sheet',
        sheet: '/generate/character-sheet',
      };

      const endpoint = `${API_BASE}${endpoints[generationType]}`;

      // Build request body
      const body: Record<string, unknown> = {
        character_id: characterId,
        base_prompt: config.basePrompt,
        scl_level: config.sclLevel,
      };

      if (generationType === 'full') {
        body.pillar_emphasis = config.pillarEmphasis || null;
        body.skin_tone = config.skinTone;
        body.hair_color = config.hairColor;
        body.clothing_colors = config.clothingColors;
        body.face_reference = faceEmbeddingId;
      } else if (generationType === 'poses' || generationType === 'outfits') {
        body.face_embedding_id = faceEmbeddingId;
      } else if (generationType === 'sheet') {
        body.include_stats = true;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Generation failed');
      }

      const data = await response.json();
      onGenerationStart?.(data.job_id);

    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const pillarOptions: { value: PillarEmphasis; label: string; color: string }[] = [
    { value: '', label: 'None', color: '#666' },
    { value: 'violence', label: 'Violence', color: '#FF4444' },
    { value: 'influence', label: 'Influence', color: '#4444FF' },
    { value: 'revelation', label: 'Revelation', color: '#44FF44' },
  ];

  return (
    <div className="character-generator-panel" style={styles.panel}>
      <h2 style={styles.title}>
        <Wand2 size={24} />
        Character Generator
      </h2>

      {/* ComfyUI Status */}
      <div style={styles.statusBar}>
        <span>ComfyUI Status: </span>
        <span style={{
          color: comfyuiStatus === 'available' ? '#4CAF50' :
                 comfyuiStatus === 'unavailable' ? '#F44336' : '#FFC107'
        }}>
          {comfyuiStatus === 'available' ? '● Connected' :
           comfyuiStatus === 'unavailable' ? '● Disconnected' : '● Checking...'}
        </span>
        <button onClick={checkHealth} style={styles.refreshButton}>↻</button>
      </div>

      {/* Generation Type */}
      <div style={styles.section}>
        <label style={styles.label}>Generation Type</label>
        <div style={styles.buttonGroup}>
          {(['full', 'poses', 'outfits', 'sheet'] as GenerationType[]).map((type) => (
            <button
              key={type}
              onClick={() => setGenerationType(type)}
              style={{
                ...styles.typeButton,
                ...(generationType === type ? styles.typeButtonActive : {}),
              }}
            >
              {type === 'full' && '7-Layer Full'}
              {type === 'poses' && 'Poses Sheet'}
              {type === 'outfits' && 'Outfits Sheet'}
              {type === 'sheet' && 'Character Sheet'}
            </button>
          ))}
        </div>
      </div>

      {/* Base Prompt */}
      <div style={styles.section}>
        <label style={styles.label}>Character Description</label>
        <textarea
          value={config.basePrompt}
          onChange={(e) => handleConfigChange('basePrompt', e.target.value)}
          placeholder="Describe your character..."
          style={styles.textarea}
          rows={3}
        />
      </div>

      {/* Pillar Emphasis */}
      {generationType === 'full' && (
        <div style={styles.section}>
          <label style={styles.label}>Pillar Emphasis</label>
          <div style={styles.pillarGroup}>
            {pillarOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleConfigChange('pillarEmphasis', option.value)}
                style={{
                  ...styles.pillarButton,
                  borderColor: option.color,
                  backgroundColor: config.pillarEmphasis === option.value ? option.color : 'transparent',
                  color: config.pillarEmphasis === option.value ? '#fff' : option.color,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SCL Level */}
      <div style={styles.section}>
        <label style={styles.label}>
          Soul Cultivation Level (SCL): {config.sclLevel}
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={config.sclLevel}
          onChange={(e) => handleConfigChange('sclLevel', parseInt(e.target.value))}
          style={styles.slider}
        />
        <div style={styles.sliderLabels}>
          <span>Novice</span>
          <span>Master</span>
          <span>Immortal</span>
        </div>
      </div>

      {/* Appearance Options */}
      {generationType === 'full' && (
        <div style={styles.section}>
          <label style={styles.label}>Appearance</label>
          <div style={styles.row}>
            <input
              type="text"
              value={config.skinTone}
              onChange={(e) => handleConfigChange('skinTone', e.target.value)}
              placeholder="Skin tone"
              style={styles.input}
            />
            <input
              type="text"
              value={config.hairColor}
              onChange={(e) => handleConfigChange('hairColor', e.target.value)}
              placeholder="Hair color"
              style={styles.input}
            />
          </div>
          <input
            type="text"
            value={config.clothingColors}
            onChange={(e) => handleConfigChange('clothingColors', e.target.value)}
            placeholder="Clothing colors"
            style={{ ...styles.input, marginTop: '8px' }}
          />
        </div>
      )}

      {/* Face Reference */}
      <div style={styles.section}>
        <label style={styles.label}>Face Reference (Optional)</label>
        <div style={styles.uploadArea}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFaceUpload}
            id="face-upload"
            style={{ display: 'none' }}
          />
          <label htmlFor="face-upload" style={styles.uploadLabel}>
            <Upload size={20} />
            {config.faceReference ? config.faceReference.name : 'Upload reference image'}
          </label>
        </div>
        <small style={styles.hint}>
          Upload a face image for consistent character appearance across all outputs
        </small>
      </div>

      {/* Generate Button */}
      <button
        onClick={startGeneration}
        disabled={isGenerating || comfyuiStatus !== 'available' || !characterId}
        style={{
          ...styles.generateButton,
          ...(isGenerating || comfyuiStatus !== 'available' ? styles.generateButtonDisabled : {}),
        }}
      >
        {isGenerating ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 size={20} />
            Generate Character
          </>
        )}
      </button>

      {!characterId && (
        <p style={styles.warning}>Please select a character first</p>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  panel: {
    padding: '20px',
    backgroundColor: '#1a1a2e',
    borderRadius: '12px',
    color: '#fff',
    fontFamily: 'system-ui, sans-serif',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    fontSize: '1.5rem',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#2a2a4e',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '0.9rem',
  },
  refreshButton: {
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  section: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 500,
    color: '#aaa',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  typeButton: {
    padding: '8px 16px',
    border: '1px solid #444',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: '#aaa',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  typeButtonActive: {
    borderColor: '#6366f1',
    backgroundColor: '#6366f1',
    color: '#fff',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2a2a4e',
    border: '1px solid #444',
    borderRadius: '6px',
    color: '#fff',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  pillarGroup: {
    display: 'flex',
    gap: '8px',
  },
  pillarButton: {
    flex: 1,
    padding: '10px',
    border: '2px solid',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: 500,
  },
  slider: {
    width: '100%',
    accentColor: '#6366f1',
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: '#666',
    marginTop: '4px',
  },
  row: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    backgroundColor: '#2a2a4e',
    border: '1px solid #444',
    borderRadius: '6px',
    color: '#fff',
  },
  uploadArea: {
    border: '2px dashed #444',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
  },
  uploadLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    color: '#888',
  },
  hint: {
    display: 'block',
    marginTop: '6px',
    color: '#666',
    fontSize: '0.8rem',
  },
  generateButton: {
    width: '100%',
    padding: '14px 24px',
    backgroundColor: '#6366f1',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.2s',
  },
  generateButtonDisabled: {
    backgroundColor: '#444',
    cursor: 'not-allowed',
  },
  warning: {
    textAlign: 'center',
    color: '#FFC107',
    fontSize: '0.9rem',
    marginTop: '8px',
  },
};

export default CharacterGeneratorPanel;
