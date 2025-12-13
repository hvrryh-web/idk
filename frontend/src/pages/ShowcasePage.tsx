/**
 * ShowcasePage - Character and item showcase gallery
 * 
 * Displays character portraits, collected items, and achievements
 */

import { useState } from 'react';
import { 
  Image as ImageIcon,
  User,
  Award,
  Gem
} from 'lucide-react';
import { ROTKPageLayout, ROTKButton } from '../components/rotk';

interface ShowcaseItem {
  id: string;
  type: 'character' | 'item' | 'achievement';
  name: string;
  nameCjk: string;
  image?: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: '1',
    type: 'character',
    name: 'Guan Yu',
    nameCjk: '关羽',
    description: 'The God of War, known for his loyalty and martial prowess.',
    rarity: 'legendary',
  },
  {
    id: '2',
    type: 'character',
    name: 'Zhao Yun',
    nameCjk: '赵云',
    description: 'The Dragon of Changshan, legendary spear wielder.',
    rarity: 'legendary',
  },
  {
    id: '3',
    type: 'item',
    name: 'Green Dragon Crescent Blade',
    nameCjk: '青龙偃月刀',
    description: 'The legendary weapon of Guan Yu, weighing 82 jin.',
    rarity: 'legendary',
  },
  {
    id: '4',
    type: 'achievement',
    name: 'First Blood',
    nameCjk: '初战告捷',
    description: 'Win your first battle.',
    rarity: 'common',
  },
  {
    id: '5',
    type: 'item',
    name: 'Spirit Cultivation Manual',
    nameCjk: '修炼秘籍',
    description: 'A basic manual for beginning cultivators.',
    rarity: 'rare',
  },
];

const rarityColors = {
  common: 'var(--rotk-ink-wash)',
  rare: 'var(--rotk-blue)',
  epic: 'var(--rotk-jade)',
  legendary: 'var(--rotk-gold)',
};

export default function ShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'character' | 'item' | 'achievement'>('all');
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);

  const filteredItems = selectedCategory === 'all' 
    ? showcaseItems 
    : showcaseItems.filter(item => item.type === selectedCategory);

  const categories = [
    { id: 'all', label: 'All', icon: ImageIcon },
    { id: 'character', label: 'Characters', icon: User },
    { id: 'item', label: 'Items', icon: Gem },
    { id: 'achievement', label: 'Achievements', icon: Award },
  ] as const;

  return (
    <ROTKPageLayout
      title="Showcase Gallery"
      titleCjk="展示"
      subtitle="Your collection of characters, items, and achievements"
      variant="parchment"
      icon={<ImageIcon size={28} color="white" />}
      accentColor="var(--rotk-gold)"
      backRoute="/personal-hub"
    >
      {/* Category Filters */}
      <div 
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {categories.map(cat => (
          <ROTKButton
            key={cat.id}
            variant={selectedCategory === cat.id ? 'primary' : 'secondary'}
            size="medium"
            icon={cat.icon}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </ROTKButton>
        ))}
      </div>

      {/* Gallery Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: `3px solid ${rarityColors[item.rarity]}`,
              borderRadius: '12px',
              padding: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: 'var(--rotk-shadow-raised)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              e.currentTarget.style.boxShadow = `var(--rotk-shadow-floating), 0 0 20px ${rarityColors[item.rarity]}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'var(--rotk-shadow-raised)';
            }}
          >
            {/* Image Placeholder */}
            <div
              style={{
                width: '100%',
                aspectRatio: '1',
                background: `linear-gradient(135deg, ${rarityColors[item.rarity]}20, ${rarityColors[item.rarity]}40)`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                border: `2px solid ${rarityColors[item.rarity]}60`,
              }}
            >
              {item.type === 'character' && <User size={48} color={rarityColors[item.rarity]} />}
              {item.type === 'item' && <Gem size={48} color={rarityColors[item.rarity]} />}
              {item.type === 'achievement' && <Award size={48} color={rarityColors[item.rarity]} />}
            </div>

            {/* Item Info */}
            <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', color: 'var(--rotk-ink-black)' }}>
              {item.name}
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: rarityColors[item.rarity], fontWeight: 'bold' }}>
              {item.nameCjk}
            </p>
            <span
              style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                padding: '0.15rem 0.5rem',
                background: rarityColors[item.rarity],
                color: 'white',
                borderRadius: '8px',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
            >
              {item.rarity}
            </span>
          </div>
        ))}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
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
              border: `4px solid ${rarityColors[selectedItem.rarity]}`,
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              boxShadow: `0 0 40px ${rarityColors[selectedItem.rarity]}60`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  background: rarityColors[selectedItem.rarity],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedItem.type === 'character' && <User size={40} color="white" />}
                {selectedItem.type === 'item' && <Gem size={40} color="white" />}
                {selectedItem.type === 'achievement' && <Award size={40} color="white" />}
              </div>
              <div>
                <h2 style={{ margin: 0, color: 'var(--rotk-ink-black)' }}>{selectedItem.name}</h2>
                <p style={{ margin: 0, color: rarityColors[selectedItem.rarity], fontWeight: 'bold', fontSize: '1.25rem' }}>
                  {selectedItem.nameCjk}
                </p>
              </div>
            </div>
            <p style={{ lineHeight: 1.6, marginBottom: '1.5rem' }}>{selectedItem.description}</p>
            <ROTKButton variant="secondary" onClick={() => setSelectedItem(null)}>
              Close
            </ROTKButton>
          </div>
        </div>
      )}
    </ROTKPageLayout>
  );
}
