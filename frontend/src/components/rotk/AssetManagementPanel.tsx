/**
 * AssetManagementPanel - Admin panel for managing character assets
 * 
 * Shows asset status for all characters, identifies missing assets,
 * and provides interface to trigger ComfyUI generation.
 */

import { useState } from 'react';
import { useAllCharacterAssets, useAssetGenerationStatus } from '../../services/useCharacterAssets';
import { CharacterAssetData } from '../../services/characterAssetService';
import { CharacterPortrait } from './CharacterPortrait';
import { Panel9Slice } from './Panel9Slice';
import { ROTKButton } from './ROTKButton';
import { ScrollOverlay } from './ScrollOverlay';
import { RefreshCw, Download, AlertTriangle, Check, Image } from 'lucide-react';
import '../../styles/rotkTheme.css';

export interface AssetManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssetManagementPanel({ isOpen, onClose }: AssetManagementPanelProps) {
  const { characters, missingAssets, isLoading, refresh } = useAllCharacterAssets();
  const { needsGeneration, missingCount } = useAssetGenerationStatus();
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterAssetData | null>(null);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'complete' | 'error'>('idle');

  const handleGenerateAll = async () => {
    setGenerationStatus('generating');
    
    // In a real implementation, this would call a backend API
    // that triggers the ComfyUI generation script
    try {
      // Simulate API call
      console.log('Triggering ComfyUI generation for:', missingAssets.map(c => c.id));
      
      // Show instructions for manual generation
      alert(
        'To generate missing assets, run:\n\n' +
        'cd scripts/comfyui\n' +
        `python generate_portraits.py --characters ${missingAssets.map(c => c.id).join(' ')}\n\n` +
        'Ensure ComfyUI is running at http://localhost:8188'
      );
      
      setGenerationStatus('complete');
      setTimeout(() => {
        setGenerationStatus('idle');
        refresh();
      }, 2000);
    } catch (error) {
      console.error('Generation failed:', error);
      setGenerationStatus('error');
    }
  };

  const handleGenerateSingle = (characterId: string) => {
    console.log('Triggering ComfyUI generation for:', characterId);
    alert(
      `To generate portrait for ${characterId}, run:\n\n` +
      'cd scripts/comfyui\n' +
      `python generate_portraits.py --characters ${characterId}\n\n` +
      'Ensure ComfyUI is running at http://localhost:8188'
    );
  };

  const getStatusIcon = (char: CharacterAssetData) => {
    if (char.hasPortrait || char.hasBust) {
      return <Check size={14} color="#00A86B" />;
    }
    return <AlertTriangle size={14} color="#DAA520" />;
  };

  if (!isOpen) return null;

  return (
    <ScrollOverlay
      isOpen={isOpen}
      onClose={onClose}
      variant="scroll"
      size="large"
      title="Asset Management"
      titleCjk="资源管理"
    >
      <div style={{ padding: '1rem' }}>
        {/* Summary Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'rgba(45, 45, 45, 0.5)',
            borderRadius: '4px',
            border: '1px solid #CD7F32',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: '"Cinzel", Georgia, serif',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#D4AF37',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              Character Assets
            </h3>
            <p
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.75rem',
                color: '#D4C5A9',
                margin: '0.25rem 0 0 0',
              }}
            >
              {characters.length} characters • {missingCount} missing assets
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <ROTKButton
              variant="secondary"
              size="small"
              icon={RefreshCw}
              onClick={refresh}
              disabled={isLoading}
            >
              Refresh
            </ROTKButton>
            
            {needsGeneration && (
              <ROTKButton
                variant="gold"
                size="small"
                icon={Download}
                onClick={handleGenerateAll}
                disabled={generationStatus === 'generating'}
              >
                {generationStatus === 'generating' ? 'Generating...' : `Generate All (${missingCount})`}
              </ROTKButton>
            )}
          </div>
        </div>

        {/* Status Message */}
        {generationStatus === 'complete' && (
          <div
            style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              background: 'rgba(0, 168, 107, 0.2)',
              border: '1px solid #00A86B',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Check size={16} color="#00A86B" />
            <span style={{ fontSize: '0.75rem', color: '#00A86B' }}>
              Generation command copied. Run the script to generate assets.
            </span>
          </div>
        )}

        {/* Character Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {characters.map(char => (
            <div
              key={char.id}
              style={{
                padding: '0.75rem',
                cursor: 'pointer',
                opacity: isLoading ? 0.5 : 1,
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(45, 45, 45, 0.9) 100%)',
                border: '2px solid #CD7F32',
                borderRadius: '4px',
              }}
              onClick={() => setSelectedCharacter(char)}
            >
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {/* Portrait */}
                <CharacterPortrait
                  characterId={char.id}
                  size="medium"
                  shape="square"
                  showFactionBorder={true}
                />
                
                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontFamily: '"Noto Serif SC", SimSun, serif',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#D4AF37',
                      }}
                    >
                      {char.nameCjk}
                    </span>
                    {getStatusIcon(char)}
                  </div>
                  
                  <span
                    style={{
                      fontFamily: '"Cinzel", Georgia, serif',
                      fontSize: '0.75rem',
                      color: '#FDF6E3',
                      textTransform: 'uppercase',
                    }}
                  >
                    {char.name}
                  </span>
                  
                  <div
                    style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <StatusBadge 
                      label="Portrait" 
                      available={char.hasPortrait} 
                    />
                    <StatusBadge 
                      label="Bust" 
                      available={char.hasBust} 
                    />
                    <StatusBadge 
                      label="Thumb" 
                      available={char.hasThumbnail} 
                    />
                  </div>
                  
                  {!char.hasPortrait && !char.hasBust && (
                    <ROTKButton
                      variant="secondary"
                      size="small"
                      icon={Image}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateSingle(char.id);
                      }}
                      style={{ marginTop: '0.5rem' }}
                    >
                      Generate
                    </ROTKButton>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Character Detail */}
        {selectedCharacter && (
          <div
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              width: 300,
              zIndex: 1000,
            }}
          >
            <Panel9Slice variant="parchment">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h4
                    style={{
                      fontFamily: '"Noto Serif SC", SimSun, serif',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#8B0000',
                      margin: 0,
                    }}
                  >
                    {selectedCharacter.nameCjk}
                  </h4>
                  <span
                    style={{
                      fontFamily: '"Cinzel", Georgia, serif',
                      fontSize: '0.875rem',
                      color: '#424242',
                    }}
                  >
                    {selectedCharacter.name}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCharacter(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    color: '#8B0000',
                  }}
                >
                  ×
                </button>
              </div>
              
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#424242',
                  margin: '0.5rem 0',
                  lineHeight: 1.5,
                }}
              >
                {selectedCharacter.description || 'No description available.'}
              </p>
              
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    padding: '0.125rem 0.5rem',
                    background: '#CD7F32',
                    borderRadius: '2px',
                    fontSize: '0.625rem',
                    color: '#FDF6E3',
                    textTransform: 'uppercase',
                  }}
                >
                  {selectedCharacter.faction}
                </span>
                <span
                  style={{
                    padding: '0.125rem 0.5rem',
                    background: '#424242',
                    borderRadius: '2px',
                    fontSize: '0.625rem',
                    color: '#FDF6E3',
                    textTransform: 'uppercase',
                  }}
                >
                  {selectedCharacter.style}
                </span>
              </div>
            </Panel9Slice>
          </div>
        )}

        {/* ComfyUI Instructions */}
        <Panel9Slice
          variant="parchment"
          style={{ marginTop: '1.5rem' }}
        >
          <h4
            style={{
              fontFamily: '"Cinzel", Georgia, serif',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#8B0000',
              margin: '0 0 0.5rem 0',
              textTransform: 'uppercase',
            }}
          >
            ComfyUI Generation Instructions
          </h4>
          <ol
            style={{
              fontSize: '0.75rem',
              color: '#424242',
              margin: 0,
              paddingLeft: '1.25rem',
              lineHeight: 1.8,
            }}
          >
            <li>Start ComfyUI: <code>cd /path/to/ComfyUI && python main.py</code></li>
            <li>Ensure SDXL checkpoint is installed</li>
            <li>Run generation: <code>cd scripts/comfyui && python generate_portraits.py</code></li>
            <li>Generated images will appear in <code>frontend/public/assets/characters/generated/</code></li>
            <li>Click "Refresh" to reload asset status</li>
          </ol>
        </Panel9Slice>
      </div>
    </ScrollOverlay>
  );
}

// Helper component for status badges
function StatusBadge({ label, available }: { label: string; available: boolean }) {
  return (
    <span
      style={{
        padding: '0.125rem 0.375rem',
        background: available 
          ? 'rgba(0, 168, 107, 0.2)' 
          : 'rgba(117, 117, 117, 0.2)',
        border: `1px solid ${available ? '#00A86B' : '#757575'}`,
        borderRadius: '2px',
        fontSize: '0.5rem',
        color: available ? '#00A86B' : '#757575',
        textTransform: 'uppercase',
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}

export default AssetManagementPanel;
