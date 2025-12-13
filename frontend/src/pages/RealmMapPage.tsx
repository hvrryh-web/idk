/**
 * RealmMapPage - Spiritual realm and cosmic territory navigation
 * 
 * Displays cultivation realms, spiritual zones, and cosmic territories
 */

import { useState } from 'react';
import { 
  Sparkles,
  Lock,
  Star,
  Zap
} from 'lucide-react';
import { ROTKPageLayout } from '../components/rotk';

interface Realm {
  id: string;
  name: string;
  nameCjk: string;
  description: string;
  level: number;
  unlocked: boolean;
  color: string;
  icon: React.ElementType;
}

const realms: Realm[] = [
  {
    id: 'mortal',
    name: 'Mortal Realm',
    nameCjk: '凡人境',
    description: 'The starting point of all cultivators. Master the basics of Qi manipulation.',
    level: 1,
    unlocked: true,
    color: 'var(--rotk-bronze)',
    icon: Star,
  },
  {
    id: 'foundation',
    name: 'Foundation Establishment',
    nameCjk: '筑基境',
    description: 'Build your spiritual foundation and open your meridians.',
    level: 2,
    unlocked: true,
    color: 'var(--rotk-jade)',
    icon: Zap,
  },
  {
    id: 'core',
    name: 'Core Formation',
    nameCjk: '金丹境',
    description: 'Form your golden core and unlock true spiritual power.',
    level: 3,
    unlocked: false,
    color: 'var(--rotk-gold)',
    icon: Sparkles,
  },
  {
    id: 'nascent',
    name: 'Nascent Soul',
    nameCjk: '元婴境',
    description: 'Birth your nascent soul and transcend mortal limitations.',
    level: 4,
    unlocked: false,
    color: 'var(--rotk-blue)',
    icon: Sparkles,
  },
  {
    id: 'immortal',
    name: 'Immortal Ascension',
    nameCjk: '仙人境',
    description: 'Achieve immortality and join the ranks of the celestials.',
    level: 5,
    unlocked: false,
    color: 'var(--rotk-cinnabar)',
    icon: Sparkles,
  },
];

export default function RealmMapPage() {
  const [, setSelectedRealm] = useState<Realm | null>(null);

  return (
    <ROTKPageLayout
      title="Realm Map"
      titleCjk="境界地图"
      subtitle="Navigate the spiritual realms and cultivation territories"
      variant="ink"
      icon={<Sparkles size={28} color="white" />}
      accentColor="var(--rotk-jade)"
      backRoute="/map-hub"
    >
      {/* Realm Path Visualization */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative',
          padding: '2rem 0',
        }}
      >
        {/* Connecting Line */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '2rem',
            bottom: '2rem',
            width: '4px',
            background: 'linear-gradient(180deg, var(--rotk-jade) 0%, var(--rotk-gold) 50%, var(--rotk-cinnabar) 100%)',
            transform: 'translateX(-50%)',
            borderRadius: '2px',
            opacity: 0.3,
          }}
        />

        {realms.map((realm) => (
          <div
            key={realm.id}
            onClick={() => realm.unlocked && setSelectedRealm(realm)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              padding: '1.5rem',
              background: realm.unlocked 
                ? `linear-gradient(90deg, transparent 0%, ${realm.color}20 50%, transparent 100%)`
                : 'rgba(100,100,100,0.1)',
              border: `2px solid ${realm.unlocked ? realm.color : 'var(--rotk-ink-wash)'}`,
              borderRadius: '12px',
              cursor: realm.unlocked ? 'pointer' : 'not-allowed',
              opacity: realm.unlocked ? 1 : 0.5,
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 1,
            }}
            onMouseEnter={(e) => {
              if (realm.unlocked) {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = `0 0 30px ${realm.color}40`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Level Indicator */}
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: realm.unlocked ? realm.color : 'var(--rotk-ink-gray)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid var(--rotk-gold)',
                boxShadow: realm.unlocked ? `0 0 20px ${realm.color}60` : 'none',
                flexShrink: 0,
              }}
            >
              {realm.unlocked ? (
                <realm.icon size={28} color="white" />
              ) : (
                <Lock size={24} color="var(--rotk-parchment-aged)" />
              )}
            </div>

            {/* Realm Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--rotk-parchment)' }}>
                  {realm.name}
                </h3>
                <span style={{ color: realm.color, fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {realm.nameCjk}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--rotk-parchment-aged)', lineHeight: 1.5 }}>
                {realm.description}
              </p>
            </div>

            {/* Level Badge */}
            <div
              style={{
                padding: '0.5rem 1rem',
                background: realm.unlocked ? realm.color : 'var(--rotk-ink-gray)',
                borderRadius: '20px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                flexShrink: 0,
              }}
            >
              Level {realm.level}
            </div>
          </div>
        ))}
      </div>

      {/* Current Realm Info */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'rgba(0,168,107,0.1)',
          border: '2px solid var(--rotk-jade)',
          borderRadius: '12px',
          textAlign: 'center',
        }}
      >
        <h3 style={{ margin: '0 0 0.5rem', color: 'var(--rotk-jade)' }}>Current Cultivation</h3>
        <p style={{ margin: 0, color: 'var(--rotk-parchment-aged)' }}>
          You are at <strong style={{ color: 'var(--rotk-jade)' }}>Foundation Establishment</strong> realm.
          Continue cultivating to unlock higher realms.
        </p>
      </div>
    </ROTKPageLayout>
  );
}
