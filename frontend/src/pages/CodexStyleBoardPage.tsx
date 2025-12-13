/**
 * CodexStyleBoardPage - Three Kingdoms UI Style Board showcase
 * 
 * Visual style guide and component showcase for the ROTK UI system
 */

import { useState } from 'react';
import { 
  Layout,
  Palette,
  Type,
  Square,
  Zap
} from 'lucide-react';
import { 
  ROTKPageLayout, 
  ROTKButton, 
  Panel9Slice
} from '../components/rotk';

export default function CodexStyleBoardPage() {
  const [activeSection, setActiveSection] = useState<'colors' | 'typography' | 'components'>('colors');

  return (
    <ROTKPageLayout
      title="Style Board"
      titleCjk="风格板"
      subtitle="Three Kingdoms UI Design System"
      variant="parchment"
      icon={<Layout size={28} color="white" />}
      accentColor="var(--rotk-cinnabar)"
      backRoute="/codex-hub"
    >
      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <ROTKButton
          variant={activeSection === 'colors' ? 'primary' : 'secondary'}
          size="medium"
          icon={Palette}
          onClick={() => setActiveSection('colors')}
        >
          Colors
        </ROTKButton>
        <ROTKButton
          variant={activeSection === 'typography' ? 'primary' : 'secondary'}
          size="medium"
          icon={Type}
          onClick={() => setActiveSection('typography')}
        >
          Typography
        </ROTKButton>
        <ROTKButton
          variant={activeSection === 'components' ? 'primary' : 'secondary'}
          size="medium"
          icon={Square}
          onClick={() => setActiveSection('components')}
        >
          Components
        </ROTKButton>
      </div>

      {/* Colors Section */}
      {activeSection === 'colors' && (
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--rotk-cinnabar)' }}>Color Palette</h2>
          
          {/* Primary Colors */}
          <h3 style={{ marginBottom: '1rem' }}>Primary - Ornamental</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { name: 'Gold', var: '--rotk-gold', hex: '#D4AF37' },
              { name: 'Gold Light', var: '--rotk-gold-light', hex: '#F5D48A' },
              { name: 'Bronze', var: '--rotk-bronze', hex: '#CD7F32' },
            ].map(color => (
              <div key={color.var} style={{ textAlign: 'center' }}>
                <div style={{ width: '100%', height: '60px', background: `var(${color.var})`, borderRadius: '8px', border: '2px solid var(--rotk-ink-gray)' }} />
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', fontWeight: 'bold' }}>{color.name}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--rotk-ink-wash)' }}>{color.hex}</p>
              </div>
            ))}
          </div>

          {/* Cinnabar/Lacquer */}
          <h3 style={{ marginBottom: '1rem' }}>Cinnabar & Lacquer Reds</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { name: 'Cinnabar', var: '--rotk-cinnabar', hex: '#C41E3A' },
              { name: 'Cinnabar Dark', var: '--rotk-cinnabar-dark', hex: '#8B0000' },
              { name: 'Lacquer', var: '--rotk-lacquer', hex: '#990000' },
            ].map(color => (
              <div key={color.var} style={{ textAlign: 'center' }}>
                <div style={{ width: '100%', height: '60px', background: `var(${color.var})`, borderRadius: '8px', border: '2px solid var(--rotk-ink-gray)' }} />
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', fontWeight: 'bold' }}>{color.name}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--rotk-ink-wash)' }}>{color.hex}</p>
              </div>
            ))}
          </div>

          {/* Jade */}
          <h3 style={{ marginBottom: '1rem' }}>Jade Greens</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { name: 'Jade', var: '--rotk-jade', hex: '#00A86B' },
              { name: 'Jade Light', var: '--rotk-jade-light', hex: '#3FD99B' },
              { name: 'Jade Dark', var: '--rotk-jade-dark', hex: '#006B3F' },
            ].map(color => (
              <div key={color.var} style={{ textAlign: 'center' }}>
                <div style={{ width: '100%', height: '60px', background: `var(${color.var})`, borderRadius: '8px', border: '2px solid var(--rotk-ink-gray)' }} />
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', fontWeight: 'bold' }}>{color.name}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--rotk-ink-wash)' }}>{color.hex}</p>
              </div>
            ))}
          </div>

          {/* Ink/Neutrals */}
          <h3 style={{ marginBottom: '1rem' }}>Ink & Neutrals</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
            {[
              { name: 'Ink Black', var: '--rotk-ink-black', hex: '#1A1A1A' },
              { name: 'Charcoal', var: '--rotk-charcoal', hex: '#2D2D2D' },
              { name: 'Parchment', var: '--rotk-parchment', hex: '#FDF6E3' },
            ].map(color => (
              <div key={color.var} style={{ textAlign: 'center' }}>
                <div style={{ width: '100%', height: '60px', background: `var(${color.var})`, borderRadius: '8px', border: '2px solid var(--rotk-ink-gray)' }} />
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', fontWeight: 'bold' }}>{color.name}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--rotk-ink-wash)' }}>{color.hex}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Typography Section */}
      {activeSection === 'typography' && (
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--rotk-cinnabar)' }}>Typography</h2>
          
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '2px solid var(--rotk-bronze)' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--rotk-ink-wash)', textTransform: 'uppercase' }}>Heading Font - Cinzel</h3>
              <p style={{ fontFamily: 'var(--rotk-font-heading)', fontSize: '3rem', margin: 0, color: 'var(--rotk-cinnabar)' }}>
                Romance of Three Kingdoms
              </p>
              <p style={{ fontFamily: 'var(--rotk-font-heading)', fontSize: '2rem', margin: '0.5rem 0 0', color: 'var(--rotk-ink-black)' }}>
                三国演义
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--rotk-ink-wash)', textTransform: 'uppercase' }}>CJK Heading - Noto Serif SC</h3>
              <p style={{ fontFamily: 'var(--rotk-font-heading-cjk)', fontSize: '2.5rem', margin: 0, color: 'var(--rotk-gold)' }}>
                赤壁之战 • 官渡之战 • 夷陵之战
              </p>
            </div>

            <div>
              <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--rotk-ink-wash)', textTransform: 'uppercase' }}>Body Font - Inter</h3>
              <p style={{ fontFamily: 'var(--rotk-font-body)', fontSize: '1rem', margin: 0, lineHeight: 1.6, color: 'var(--rotk-ink-black)' }}>
                The Three Kingdoms period (220–280 AD) was an era of division in ancient China, following the Han dynasty. 
                It saw the emergence of three major states: Wei, Shu, and Wu, each vying for supremacy over the land.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Components Section */}
      {activeSection === 'components' && (
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--rotk-cinnabar)' }}>Components</h2>
          
          {/* Buttons */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Buttons</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <ROTKButton variant="primary" size="large" icon={Zap}>Primary Large</ROTKButton>
              <ROTKButton variant="primary" size="medium">Primary Medium</ROTKButton>
              <ROTKButton variant="secondary" size="medium">Secondary</ROTKButton>
              <ROTKButton variant="gold" size="medium">Gold</ROTKButton>
              <ROTKButton variant="primary" size="small">Small</ROTKButton>
              <ROTKButton variant="primary" size="medium" disabled>Disabled</ROTKButton>
            </div>
          </div>

          {/* Status Chips - Placeholder */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Status Chips</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '0.25rem 0.75rem', background: 'var(--rotk-gold)', color: 'white', borderRadius: '12px', fontSize: '0.85rem' }}>ATK +15%</span>
              <span style={{ padding: '0.25rem 0.75rem', background: 'var(--rotk-jade)', color: 'white', borderRadius: '12px', fontSize: '0.85rem' }}>HP +20</span>
              <span style={{ padding: '0.25rem 0.75rem', background: 'var(--rotk-cinnabar)', color: 'white', borderRadius: '12px', fontSize: '0.85rem' }}>DEF -10%</span>
              <span style={{ padding: '0.25rem 0.75rem', background: 'var(--rotk-blue)', color: 'white', borderRadius: '12px', fontSize: '0.85rem' }}>SPD +5</span>
            </div>
          </div>

          {/* Stat Bars - Placeholder */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Stat Bars</h3>
            <div style={{ maxWidth: '400px' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}><span>HP</span><span>75/100</span></div>
                <div style={{ height: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', overflow: 'hidden' }}><div style={{ height: '100%', width: '75%', background: 'var(--rotk-hp)' }} /></div>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}><span>AE</span><span>45/60</span></div>
                <div style={{ height: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', overflow: 'hidden' }}><div style={{ height: '100%', width: '75%', background: 'var(--rotk-ae)' }} /></div>
              </div>
            </div>
          </div>

          {/* Panels */}
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Panel Variants</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <Panel9Slice variant="parchment">
                <h4 style={{ margin: '0 0 0.5rem' }}>Parchment Panel</h4>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Traditional scroll-like appearance</p>
              </Panel9Slice>
              <Panel9Slice variant="lacquer">
                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--rotk-parchment)' }}>Lacquer Panel</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--rotk-parchment-aged)' }}>Red lacquered wood finish</p>
              </Panel9Slice>
              <Panel9Slice variant="ink">
                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--rotk-parchment)' }}>Ink Panel</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--rotk-parchment-aged)' }}>Dark ink wash background</p>
              </Panel9Slice>
            </div>
          </div>
        </div>
      )}
    </ROTKPageLayout>
  );
}
