/**
 * CharacterShowcasePage - Displays Lu Bu and Diao Chan character profiles
 * with their visual assets in a gallery format
 */

import { useState } from 'react';
import { CharacterPortrait } from '../components/rotk/CharacterPortrait';
import { Panel9Slice, ROTKButton, StatBar, StatusChip } from '../components/rotk';
import { useCharacterAssets } from '../services/useCharacterAssets';
import { FACTION_COLORS } from '../services/characterAssetService';
import { Swords, Heart, Shield, Zap } from 'lucide-react';
import '../styles/rotkTheme.css';

// Extended character stats for showcase
const CHARACTER_STATS = {
  'lu-bu': {
    hp: 150,
    maxHp: 150,
    atk: 99,
    def: 85,
    int: 32,
    str: 98,
    troops: 12000,
    skills: ['Sky Piercer', 'Red Hare Charge', 'Unmatched Valor'],
    quote: '"Among men, Lu Bu. Among horses, Red Hare."',
  },
  'diao-chan': {
    hp: 80,
    maxHp: 80,
    atk: 45,
    def: 40,
    int: 92,
    str: 35,
    troops: 3000,
    skills: ['Moon Dance', 'Alluring Grace', 'Chain Stratagem'],
    quote: '"Beauty that toppled kingdoms, wisdom that shaped destinies."',
  },
};

export function CharacterShowcasePage() {
  const [selectedCharacter, setSelectedCharacter] = useState<'lu-bu' | 'diao-chan'>('lu-bu');
  const { character: luBu } = useCharacterAssets('lu-bu');
  const { character: diaoChan } = useCharacterAssets('diao-chan');
  
  const currentStats = CHARACTER_STATS[selectedCharacter];
  const currentCharacter = selectedCharacter === 'lu-bu' ? luBu : diaoChan;
  const factionColors = currentCharacter ? FACTION_COLORS[currentCharacter.faction] : FACTION_COLORS.neutral;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #1A1A1A 100%)',
        padding: '2rem',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: '"Noto Serif SC", SimSun, serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#D4AF37',
            textShadow: '0 4px 8px rgba(0,0,0,0.5)',
            margin: 0,
          }}
        >
          三国志英雄
        </h1>
        <p
          style={{
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: '1rem',
            color: '#D4C5A9',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            marginTop: '0.5rem',
          }}
        >
          Romance of the Three Kingdoms • Character Gallery
        </p>
      </div>

      {/* Character Selection Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <ROTKButton
          variant={selectedCharacter === 'lu-bu' ? 'primary' : 'secondary'}
          size="medium"
          icon={Swords}
          onClick={() => setSelectedCharacter('lu-bu')}
        >
          吕布 Lu Bu
        </ROTKButton>
        <ROTKButton
          variant={selectedCharacter === 'diao-chan' ? 'gold' : 'secondary'}
          size="medium"
          icon={Heart}
          onClick={() => setSelectedCharacter('diao-chan')}
        >
          貂蝉 Diao Chan
        </ROTKButton>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr',
          gap: '2rem',
          maxWidth: 1400,
          margin: '0 auto',
        }}
      >
        {/* Left - Portrait Sizes */}
        <div>
          <Panel9Slice variant="lacquer">
            <h3
              style={{
                fontFamily: '"Cinzel", Georgia, serif',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#D4AF37',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              Portrait Variants
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <CharacterPortrait
                  characterId={selectedCharacter}
                  size="large"
                  shape="square"
                  showName={true}
                  showFactionBorder={true}
                  isActive={true}
                />
                <span style={{ fontSize: '0.625rem', color: '#D4C5A9', marginTop: '0.25rem', display: 'block' }}>
                  Large (120×150)
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ textAlign: 'center' }}>
                  <CharacterPortrait
                    characterId={selectedCharacter}
                    size="medium"
                    shape="circle"
                    showFactionBorder={true}
                  />
                  <span style={{ fontSize: '0.5rem', color: '#D4C5A9', marginTop: '0.25rem', display: 'block' }}>
                    Medium Circle
                  </span>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <CharacterPortrait
                    characterId={selectedCharacter}
                    size="small"
                    shape="square"
                    showFactionBorder={true}
                  />
                  <span style={{ fontSize: '0.5rem', color: '#D4C5A9', marginTop: '0.25rem', display: 'block' }}>
                    Small
                  </span>
                </div>
              </div>
            </div>
          </Panel9Slice>
        </div>

        {/* Center - Full Portrait Display */}
        <div>
          <Panel9Slice variant="lacquer">
            <div
              style={{
                display: 'flex',
                gap: '2rem',
                alignItems: 'flex-start',
              }}
            >
              {/* Large SVG Portrait */}
              <div
                style={{
                  width: 300,
                  height: 375,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: `3px solid ${factionColors.primary}`,
                  boxShadow: `0 0 30px ${factionColors.primary}40, 0 8px 32px rgba(0,0,0,0.5)`,
                  flexShrink: 0,
                }}
              >
                <img
                  src={`/assets/characters/portraits/${selectedCharacter}.svg`}
                  alt={currentCharacter?.name || selectedCharacter}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Character Info */}
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    fontFamily: '"Noto Serif SC", SimSun, serif',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: '#D4AF37',
                    margin: 0,
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {currentCharacter?.nameCjk}
                </h2>
                <h3
                  style={{
                    fontFamily: '"Cinzel", Georgia, serif',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#FDF6E3',
                    margin: '0.25rem 0 0.5rem 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {currentCharacter?.name}
                </h3>
                
                {/* Faction Badge */}
                <div
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    background: `linear-gradient(135deg, ${factionColors.primary} 0%, ${factionColors.secondary} 100%)`,
                    border: '1px solid #D4AF37',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Cinzel", Georgia, serif',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#FDF6E3',
                      textTransform: 'uppercase',
                    }}
                  >
                    {currentCharacter?.faction} • {currentCharacter?.style}
                  </span>
                </div>

                {/* Quote */}
                <blockquote
                  style={{
                    fontFamily: '"Noto Serif SC", SimSun, serif',
                    fontSize: '0.875rem',
                    fontStyle: 'italic',
                    color: '#D4C5A9',
                    borderLeft: `3px solid ${factionColors.primary}`,
                    paddingLeft: '1rem',
                    margin: '1rem 0',
                  }}
                >
                  {currentStats.quote}
                </blockquote>

                {/* Stats */}
                <div style={{ marginTop: '1rem' }}>
                  <StatBar type="hp" current={currentStats.hp} max={currentStats.maxHp} label="HP" size="medium" />
                  
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.5rem',
                      marginTop: '1rem',
                    }}
                  >
                    <StatItem icon={<Swords size={14} />} label="ATK" value={currentStats.atk} color="#C41E3A" />
                    <StatItem icon={<Shield size={14} />} label="DEF" value={currentStats.def} color="#C0C0C0" />
                    <StatItem icon={<Zap size={14} />} label="INT" value={currentStats.int} color="#6B8DEF" />
                    <StatItem icon={<Heart size={14} />} label="STR" value={currentStats.str} color="#DAA520" />
                  </div>
                </div>

                {/* Skills */}
                <div style={{ marginTop: '1rem' }}>
                  <span
                    style={{
                      fontFamily: '"Cinzel", Georgia, serif',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#D4AF37',
                      textTransform: 'uppercase',
                    }}
                  >
                    Skills
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {currentStats.skills.map((skill, i) => (
                      <StatusChip key={i} variant="buff" label={skill} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Panel9Slice>
        </div>

        {/* Right - Bust and Thumbnail */}
        <div>
          <Panel9Slice variant="lacquer">
            <h3
              style={{
                fontFamily: '"Cinzel", Georgia, serif',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#D4AF37',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              Asset Types
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Bust */}
              <div>
                <span style={{ fontSize: '0.625rem', color: '#D4C5A9', textTransform: 'uppercase' }}>
                  Bust (Battle HUD)
                </span>
                <div
                  style={{
                    width: 150,
                    height: 187,
                    marginTop: '0.5rem',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '2px solid #CD7F32',
                  }}
                >
                  <img
                    src={`/assets/characters/busts/${selectedCharacter}.svg`}
                    alt={`${selectedCharacter} bust`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <span style={{ fontSize: '0.625rem', color: '#D4C5A9', textTransform: 'uppercase' }}>
                  Thumbnail (64×64)
                </span>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    marginTop: '0.5rem',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid #CD7F32',
                  }}
                >
                  <img
                    src={`/assets/characters/thumbnails/${selectedCharacter}.svg`}
                    alt={`${selectedCharacter} thumbnail`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </Panel9Slice>
        </div>
      </div>

      {/* Both Characters Side by Side */}
      <div style={{ marginTop: '3rem', maxWidth: 1400, margin: '3rem auto 0' }}>
        <Panel9Slice variant="parchment">
          <h3
            style={{
              fontFamily: '"Noto Serif SC", SimSun, serif',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#8B0000',
              textAlign: 'center',
              margin: '0 0 1.5rem 0',
            }}
          >
            吕布与貂蝉 • Lu Bu & Diao Chan
          </h3>
          
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '3rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Lu Bu Card */}
            <div
              style={{
                width: 200,
                textAlign: 'center',
                padding: '1rem',
                background: 'rgba(139, 0, 0, 0.1)',
                borderRadius: '8px',
                border: '2px solid #8B0000',
              }}
            >
              <div
                style={{
                  width: 180,
                  height: 225,
                  margin: '0 auto',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '3px solid #D4AF37',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                }}
              >
                <img
                  src="/assets/characters/portraits/lu-bu.svg"
                  alt="Lu Bu"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <p
                style={{
                  fontFamily: '"Cinzel", Georgia, serif',
                  fontSize: '0.75rem',
                  color: '#424242',
                  marginTop: '0.75rem',
                  lineHeight: 1.5,
                }}
              >
                The mightiest warrior of the era, unmatched in combat prowess.
              </p>
            </div>

            {/* Diao Chan Card */}
            <div
              style={{
                width: 200,
                textAlign: 'center',
                padding: '1rem',
                background: 'rgba(199, 21, 133, 0.1)',
                borderRadius: '8px',
                border: '2px solid #C71585',
              }}
            >
              <div
                style={{
                  width: 180,
                  height: 225,
                  margin: '0 auto',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '3px solid #D4AF37',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                }}
              >
                <img
                  src="/assets/characters/portraits/diao-chan.svg"
                  alt="Diao Chan"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <p
                style={{
                  fontFamily: '"Cinzel", Georgia, serif',
                  fontSize: '0.75rem',
                  color: '#424242',
                  marginTop: '0.75rem',
                  lineHeight: 1.5,
                }}
              >
                The legendary beauty whose dance changed the fate of kingdoms.
              </p>
            </div>
          </div>
        </Panel9Slice>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1rem',
        }}
      >
        <span
          style={{
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: '0.75rem',
            color: '#D4AF37',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          WuXuxian TTRPG • Character Asset Showcase
        </span>
      </div>
    </div>
  );
}

// Helper component for stat display
function StatItem({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.375rem 0.5rem',
        background: 'rgba(45, 45, 45, 0.5)',
        borderRadius: '4px',
        border: '1px solid #424242',
      }}
    >
      <span style={{ color }}>{icon}</span>
      <span
        style={{
          fontFamily: '"Cinzel", Georgia, serif',
          fontSize: '0.625rem',
          fontWeight: 600,
          color,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <span
        style={{
          marginLeft: 'auto',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.875rem',
          fontWeight: 700,
          color: '#FDF6E3',
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default CharacterShowcasePage;
