/**
 * CodexCharactersPage - Character codex/compendium
 * 
 * Database of all characters, NPCs, and notable figures
 */

import React, { useState } from 'react';
import { 
  Users,
  Search,
  Star,
  Swords,
  Crown,
  Shield
} from 'lucide-react';
import { ROTKPageLayout, ROTKButton } from '../components/rotk';

interface CodexCharacter {
  id: string;
  name: string;
  nameCjk: string;
  title: string;
  faction: 'wei' | 'shu' | 'wu' | 'other';
  role: 'warrior' | 'strategist' | 'ruler' | 'general';
  description: string;
  stats: {
    war: number;
    int: number;
    pol: number;
    cha: number;
  };
}

const codexCharacters: CodexCharacter[] = [
  {
    id: '1',
    name: 'Cao Cao',
    nameCjk: '曹操',
    title: 'Hero of Chaos',
    faction: 'wei',
    role: 'ruler',
    description: 'The cunning ruler of Wei, known for his strategic brilliance and ruthless ambition.',
    stats: { war: 96, int: 92, pol: 94, cha: 96 },
  },
  {
    id: '2',
    name: 'Liu Bei',
    nameCjk: '刘备',
    title: 'Lord of Benevolence',
    faction: 'shu',
    role: 'ruler',
    description: 'The virtuous ruler of Shu, descended from the Han imperial line.',
    stats: { war: 76, int: 75, pol: 78, cha: 99 },
  },
  {
    id: '3',
    name: 'Sun Quan',
    nameCjk: '孙权',
    title: 'Young Lord of Wu',
    faction: 'wu',
    role: 'ruler',
    description: 'The patient ruler who inherited and expanded the kingdom of Wu.',
    stats: { war: 72, int: 88, pol: 92, cha: 90 },
  },
  {
    id: '4',
    name: 'Zhuge Liang',
    nameCjk: '诸葛亮',
    title: 'Sleeping Dragon',
    faction: 'shu',
    role: 'strategist',
    description: 'The legendary strategist of Shu, master of military tactics and inventions.',
    stats: { war: 54, int: 100, pol: 95, cha: 92 },
  },
  {
    id: '5',
    name: 'Guan Yu',
    nameCjk: '关羽',
    title: 'God of War',
    faction: 'shu',
    role: 'warrior',
    description: 'The legendary warrior known for his unwavering loyalty and martial prowess.',
    stats: { war: 97, int: 75, pol: 62, cha: 93 },
  },
  {
    id: '6',
    name: 'Lu Bu',
    nameCjk: '吕布',
    title: 'Flying General',
    faction: 'other',
    role: 'warrior',
    description: 'The mightiest warrior of the era, feared for his unmatched combat skills.',
    stats: { war: 100, int: 30, pol: 20, cha: 25 },
  },
];

const factionColors = {
  wei: 'var(--rotk-blue)',
  shu: 'var(--rotk-jade)',
  wu: 'var(--rotk-cinnabar)',
  other: 'var(--rotk-ink-wash)',
};

const roleIcons = {
  warrior: Swords,
  strategist: Star,
  ruler: Crown,
  general: Shield,
};

export default function CodexCharactersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<CodexCharacter | null>(null);

  const filteredCharacters = codexCharacters.filter(char => {
    const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         char.nameCjk.includes(searchQuery) ||
                         char.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFaction = !selectedFaction || char.faction === selectedFaction;
    return matchesSearch && matchesFaction;
  });

  return (
    <ROTKPageLayout
      title="Character Codex"
      titleCjk="人物图鉴"
      subtitle="Database of heroes, strategists, and rulers"
      variant="parchment"
      icon={<Users size={28} color="white" />}
      accentColor="var(--rotk-jade)"
      backRoute="/codex-hub"
    >
      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--rotk-ink-wash)',
            }} 
          />
          <input
            type="text"
            placeholder="Search characters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.75rem',
              border: '2px solid var(--rotk-bronze)',
              borderRadius: '8px',
              fontFamily: 'var(--rotk-font-body)',
              fontSize: '1rem',
              background: 'white',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['wei', 'shu', 'wu', 'other'] as const).map(faction => (
            <button
              key={faction}
              onClick={() => setSelectedFaction(selectedFaction === faction ? null : faction)}
              style={{
                padding: '0.5rem 1rem',
                background: selectedFaction === faction ? factionColors[faction] : 'white',
                color: selectedFaction === faction ? 'white' : factionColors[faction],
                border: `2px solid ${factionColors[faction]}`,
                borderRadius: '8px',
                fontFamily: 'var(--rotk-font-heading)',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {faction}
            </button>
          ))}
        </div>
      </div>

      {/* Character Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filteredCharacters.map(char => {
          const RoleIcon = roleIcons[char.role];
          return (
            <div
              key={char.id}
              onClick={() => setSelectedCharacter(char)}
              style={{
                background: 'white',
                border: `3px solid ${factionColors[char.faction]}`,
                borderRadius: '12px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: 'var(--rotk-shadow-raised)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `var(--rotk-shadow-floating), 0 0 20px ${factionColors[char.faction]}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--rotk-shadow-raised)';
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: factionColors[char.faction],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <RoleIcon size={24} color="white" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--rotk-ink-black)' }}>
                    {char.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: factionColors[char.faction], fontWeight: 'bold' }}>{char.nameCjk}</span>
                    <span style={{ color: 'var(--rotk-ink-wash)', fontSize: '0.85rem' }}>• {char.title}</span>
                  </div>
                </div>
              </div>

              {/* Stats Preview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {Object.entries(char.stats).map(([stat, value]) => (
                  <div key={stat} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: value >= 90 ? 'var(--rotk-cinnabar)' : 'var(--rotk-ink-black)' }}>
                      {value}
                    </div>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--rotk-ink-wash)' }}>
                      {stat}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCharacters.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--rotk-ink-wash)' }}>
          <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>No characters found matching your criteria.</p>
        </div>
      )}

      {/* Character Detail Modal */}
      {selectedCharacter && (
        <div
          onClick={() => setSelectedCharacter(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--rotk-parchment)',
              border: `4px solid ${factionColors[selectedCharacter.faction]}`,
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '550px',
              width: '90%',
              boxShadow: `0 0 40px ${factionColors[selectedCharacter.faction]}60`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  background: factionColors[selectedCharacter.faction],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid var(--rotk-gold)',
                }}
              >
                {React.createElement(roleIcons[selectedCharacter.role], { size: 40, color: 'white' })}
              </div>
              <div>
                <h2 style={{ margin: 0, color: 'var(--rotk-ink-black)' }}>{selectedCharacter.name}</h2>
                <p style={{ margin: 0, color: factionColors[selectedCharacter.faction], fontWeight: 'bold', fontSize: '1.5rem' }}>
                  {selectedCharacter.nameCjk}
                </p>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--rotk-ink-wash)' }}>{selectedCharacter.title}</p>
              </div>
            </div>
            
            <p style={{ lineHeight: 1.6, marginBottom: '1.5rem' }}>{selectedCharacter.description}</p>
            
            <h3 style={{ margin: '0 0 1rem' }}>Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {Object.entries(selectedCharacter.stats).map(([stat, value]) => (
                <div key={stat} style={{ textAlign: 'center', padding: '0.75rem', background: 'white', borderRadius: '8px', border: '2px solid var(--rotk-bronze)' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: value >= 90 ? 'var(--rotk-cinnabar)' : 'var(--rotk-ink-black)' }}>
                    {value}
                  </div>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--rotk-ink-wash)' }}>
                    {stat === 'war' ? 'WAR' : stat === 'int' ? 'INT' : stat === 'pol' ? 'POL' : 'CHA'}
                  </div>
                </div>
              ))}
            </div>

            <ROTKButton variant="secondary" onClick={() => setSelectedCharacter(null)}>
              Close
            </ROTKButton>
          </div>
        </div>
      )}
    </ROTKPageLayout>
  );
}
