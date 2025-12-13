/**
 * CharacterStatsPage - Comprehensive character statistics view
 * 
 * Shows all character stats, abilities, equipment, and progression
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft,
  Heart,
  Zap,
  Shield,
  Swords,
  Brain,
  Eye,
  Crown,
  Flame,
  Snowflake,
  Circle,
  TrendingUp,
  Home
} from "lucide-react";
import Button from "../components/Button";
import { fetchCharacters } from "../api";
import type { Character } from "../types";

interface StatBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  icon: React.ElementType;
}

function StatBar({ label, value, maxValue, color, icon: Icon }: StatBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icon size={16} color={color} />
          <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{label}</span>
        </div>
        <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{value} / {maxValue}</span>
      </div>
      <div 
        style={{ 
          height: '12px', 
          background: 'rgba(0,0,0,0.2)', 
          borderRadius: '6px',
          overflow: 'hidden',
          border: `1px solid ${color}40`,
        }}
      >
        <div 
          style={{ 
            height: '100%', 
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            borderRadius: '6px',
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </div>
  );
}

interface StatBlockProps {
  label: string;
  value: number;
  color: string;
  icon: React.ElementType;
}

function StatBlock({ label, value, color, icon: Icon }: StatBlockProps) {
  return (
    <div 
      style={{
        background: 'rgba(255,255,255,0.8)',
        border: `2px solid ${color}`,
        borderRadius: '10px',
        padding: '1rem',
        textAlign: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      <Icon size={24} color={color} style={{ marginBottom: '0.5rem' }} />
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

export default function CharacterStatsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharacter = async () => {
      try {
        const characters = await fetchCharacters();
        const found = id 
          ? characters.find(c => String(c.id) === id) 
          : characters[0];
        setCharacter(found || null);
      } catch (error) {
        console.error("Failed to load character:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCharacter();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Cinzel, serif' }}>
        Loading character stats...
      </div>
    );
  }

  if (!character) {
    return (
      <div 
        style={{
          background: 'var(--parchment)',
          borderRadius: '18px',
          padding: '2rem',
          margin: '2rem auto',
          maxWidth: '800px',
          textAlign: 'center',
          fontFamily: 'Cinzel, serif',
        }}
      >
        <h2>No Character Found</h2>
        <p>Create a character to view stats</p>
        <Button variant="primary" onClick={() => navigate("/characters")}>
          Go to Character Manager
        </Button>
      </div>
    );
  }

  // Calculate SCL
  const primaryStats = [
    character.strength ?? 0,
    character.dexterity ?? 0,
    character.constitution ?? 0,
    character.intelligence ?? 0,
    character.wisdom ?? 0,
    character.charisma ?? 0,
    character.perception ?? 0,
    character.resolve ?? 0,
    character.presence ?? 0,
  ];
  const primarySum = primaryStats.reduce((sum, val) => sum + val, 0);
  const aetherSum = (character.aether_fire ?? 0) + (character.aether_ice ?? 0) + (character.aether_void ?? 0);
  const scl = Math.floor(primarySum / 9) + Math.floor((aetherSum / 3) * 0.5);

  return (
    <div 
      className="character-stats-page"
      style={{
        background: 'var(--parchment)',
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(124,63,0,0.08)',
        border: '6px solid #c9b18a',
        fontFamily: 'Cinzel, serif',
        color: '#3a2c13',
        padding: '2rem',
        margin: '2rem auto',
        maxWidth: '1000px',
      }}
    >
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '3px solid var(--imperial-gold)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Button
            variant="secondary"
            size="small"
            icon={Home}
            onClick={() => navigate("/home")}
          >
            Home
          </Button>
          <Button
            variant="secondary"
            size="small"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--dynasty-red)' }}>
            {character.name}
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: '#666' }}>
            {character.type?.toUpperCase()} • SCL {scl}
          </p>
        </div>
        <div 
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--gradient-dynasty)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid var(--imperial-gold)',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          {scl}
        </div>
      </div>

      {/* Combat Stats */}
      <div 
        style={{
          background: 'rgba(139,0,0,0.05)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          border: '2px solid var(--dynasty-red)',
        }}
      >
        <h2 style={{ margin: '0 0 1rem', color: 'var(--dynasty-red)', fontSize: '1.25rem' }}>
          Combat Statistics
        </h2>
        <StatBar 
          label="Hit Points (HP)" 
          value={100} 
          maxValue={100} 
          color="var(--fire-red)" 
          icon={Heart}
        />
        <StatBar 
          label="Action Energy (AE)" 
          value={50} 
          maxValue={60} 
          color="var(--water-blue)" 
          icon={Zap}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
            <Shield size={20} color="var(--imperial-bronze)" />
            <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>15</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Guard</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
            <TrendingUp size={20} color="var(--jade-green)" />
            <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>0.25</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>DR</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
            <Flame size={20} color="var(--dynasty-crimson)" />
            <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>3</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Strain</div>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div 
        style={{
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ margin: '0 0 1rem', color: 'var(--dynasty-red)', fontSize: '1.25rem' }}>
          Primary Attributes
        </h2>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem',
          }}
        >
          <StatBlock label="Strength" value={character.strength ?? 0} color="var(--fire-red)" icon={Swords} />
          <StatBlock label="Dexterity" value={character.dexterity ?? 0} color="var(--jade-green)" icon={Zap} />
          <StatBlock label="Constitution" value={character.constitution ?? 0} color="var(--earth-yellow)" icon={Shield} />
          <StatBlock label="Intelligence" value={character.intelligence ?? 0} color="var(--water-blue)" icon={Brain} />
          <StatBlock label="Wisdom" value={character.wisdom ?? 0} color="var(--soul-essence)" icon={Eye} />
          <StatBlock label="Charisma" value={character.charisma ?? 0} color="var(--imperial-gold)" icon={Crown} />
        </div>
      </div>

      {/* Secondary Stats */}
      <div 
        style={{
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ margin: '0 0 1rem', color: 'var(--dynasty-red)', fontSize: '1.25rem' }}>
          Secondary Attributes
        </h2>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem',
          }}
        >
          <StatBlock label="Perception" value={character.perception ?? 0} color="var(--jade-green)" icon={Eye} />
          <StatBlock label="Resolve" value={character.resolve ?? 0} color="var(--imperial-bronze)" icon={Shield} />
          <StatBlock label="Presence" value={character.presence ?? 0} color="var(--soul-essence)" icon={Crown} />
        </div>
      </div>

      {/* Aether Stats */}
      <div 
        style={{
          background: 'rgba(99,102,241,0.05)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '2px solid var(--water-blue)',
        }}
      >
        <h2 style={{ margin: '0 0 1rem', color: 'var(--water-blue)', fontSize: '1.25rem' }}>
          Aether Affinities
        </h2>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
          }}
        >
          <StatBlock label="Fire" value={character.aether_fire ?? 0} color="var(--fire-red)" icon={Flame} />
          <StatBlock label="Ice" value={character.aether_ice ?? 0} color="var(--water-blue)" icon={Snowflake} />
          <StatBlock label="Void" value={character.aether_void ?? 0} color="var(--soul-essence)" icon={Circle} />
        </div>
      </div>

      {/* Actions */}
      <div 
        style={{
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <Button variant="primary" size="medium" onClick={() => navigate(`/profile/${character.id}`)}>
          View Full Profile
        </Button>
        <Button variant="secondary" size="medium" onClick={() => navigate(`/cultivation/${character.id}`)}>
          Cultivation Path
        </Button>
        <Button variant="secondary" size="medium" onClick={() => navigate(`/soul-core/${character.id}`)}>
          Soul Core
        </Button>
      </div>
    </div>
  );
}
