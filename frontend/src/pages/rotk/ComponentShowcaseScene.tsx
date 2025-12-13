/**
 * ComponentShowcaseScene - Demo scene showcasing all new UI components
 * 
 * Displays DraggableToken, ScrollOverlay, InitiativePanel, and EventChoiceDialog
 */

import { useState, useCallback } from 'react';
import {
  DraggableToken,
  ScrollOverlay,
  InitiativePanel,
  EventChoiceDialog,
  ROTKButton,
  Panel9Slice,
  InitiativeEntry,
  DialogChoice,
} from '../../components/rotk';
import { Eye, MessageSquare, Users, Sword, Map } from 'lucide-react';
import '../../styles/rotkTheme.css';

// Demo data
const demoTokens = [
  { id: 'token-1', label: 'Zhao Yun', labelCjk: '赵云', variant: 'character' as const, position: { x: 150, y: 200 } },
  { id: 'token-2', label: 'Guan Yu', labelCjk: '关羽', variant: 'character' as const, position: { x: 250, y: 250 } },
  { id: 'token-3', label: 'Enemy Scout', variant: 'enemy' as const, position: { x: 400, y: 180 } },
  { id: 'token-4', label: 'Village Elder', labelCjk: '村长', variant: 'npc' as const, position: { x: 350, y: 300 } },
  { id: 'token-5', label: 'Supply Crate', variant: 'object' as const, position: { x: 200, y: 350 } },
];

const demoInitiativeEntries: InitiativeEntry[] = [
  { id: 'init-1', name: 'Zhao Yun', nameCjk: '赵云', initiative: 18, isAlly: true, hasActed: false },
  { id: 'init-2', name: 'Zhang Liao', nameCjk: '张辽', initiative: 16, isAlly: false, hasActed: false },
  { id: 'init-3', name: 'Guan Yu', nameCjk: '关羽', initiative: 14, isAlly: true, hasActed: true },
  { id: 'init-4', name: 'Xu Huang', nameCjk: '徐晃', initiative: 12, isAlly: false, hasActed: false },
  { id: 'init-5', name: 'Liu Bei', nameCjk: '刘备', initiative: 10, isAlly: true, hasActed: false },
];

const demoChoices: DialogChoice[] = [
  { id: 'choice-1', text: 'Accept the alliance proposal', textCjk: '接受联盟提议', consequence: 'positive' },
  { id: 'choice-2', text: 'Negotiate for better terms', textCjk: '协商更好的条件', consequence: 'neutral' },
  { id: 'choice-3', text: 'Reject the proposal outright', textCjk: '直接拒绝', consequence: 'negative' },
  { id: 'choice-4', text: 'Consult with your advisors first', textCjk: '先与谋士商议', isDisabled: true, disabledReason: 'Zhuge Liang is unavailable' },
];

export function ComponentShowcaseScene() {
  const [tokens, setTokens] = useState(demoTokens);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [currentTurn, setCurrentTurn] = useState(0);
  
  // Overlay states
  const [showScrollOverlay, setShowScrollOverlay] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [overlayVariant, setOverlayVariant] = useState<'scroll' | 'paper' | 'ink'>('scroll');
  const [overlaySize, setOverlaySize] = useState<'small' | 'medium' | 'large'>('medium');
  
  const handleTokenPositionChange = useCallback((id: string, position: { x: number; y: number }) => {
    setTokens(prev => prev.map(t => t.id === id ? { ...t, position } : t));
  }, []);
  
  const handleTokenSelect = useCallback((id: string) => {
    setSelectedToken(id);
  }, []);
  
  const handleNextTurn = useCallback(() => {
    setCurrentTurn(prev => (prev + 1) % demoInitiativeEntries.length);
  }, []);
  
  const handleChoiceSelect = useCallback((choiceId: string) => {
    console.log('Selected choice:', choiceId);
    setShowEventDialog(false);
  }, []);
  
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#1A1A1A',
        padding: '2rem',
        boxSizing: 'border-box',
      }}
    >
      {/* Page Title */}
      <div
        style={{
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: '2rem',
            fontWeight: 700,
            color: '#D4AF37',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          UI Component Showcase
        </h1>
        <p
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.875rem',
            color: '#D4C5A9',
            marginTop: '0.5rem',
          }}
        >
          New ROTK UI components for maps, overlays, and dialogs
        </p>
      </div>
      
      {/* Control Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <ROTKButton variant="primary" icon={Eye} onClick={() => setShowScrollOverlay(true)}>
          Scroll Overlay
        </ROTKButton>
        <ROTKButton variant="gold" icon={MessageSquare} onClick={() => setShowEventDialog(true)}>
          NPC Dialog
        </ROTKButton>
        <ROTKButton variant="secondary" icon={Users} onClick={handleNextTurn}>
          Next Turn
        </ROTKButton>
      </div>
      
      {/* Overlay Variant Selector */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        <span style={{ color: '#D4C5A9', fontSize: '0.75rem', marginRight: '0.5rem' }}>Overlay Style:</span>
        {(['scroll', 'paper', 'ink'] as const).map(v => (
          <button
            key={v}
            onClick={() => setOverlayVariant(v)}
            style={{
              padding: '0.25rem 0.75rem',
              background: overlayVariant === v ? '#D4AF37' : '#2D2D2D',
              color: overlayVariant === v ? '#1A1A1A' : '#D4C5A9',
              border: '1px solid #CD7F32',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              textTransform: 'capitalize',
            }}
          >
            {v}
          </button>
        ))}
        <span style={{ color: '#D4C5A9', fontSize: '0.75rem', marginLeft: '1rem', marginRight: '0.5rem' }}>Size:</span>
        {(['small', 'medium', 'large'] as const).map(s => (
          <button
            key={s}
            onClick={() => setOverlaySize(s)}
            style={{
              padding: '0.25rem 0.75rem',
              background: overlaySize === s ? '#D4AF37' : '#2D2D2D',
              color: overlaySize === s ? '#1A1A1A' : '#D4C5A9',
              border: '1px solid #CD7F32',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              textTransform: 'capitalize',
            }}
          >
            {s}
          </button>
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Draggable Token Map Area */}
        <Panel9Slice variant="ink" corners={true}>
          <div style={{ marginBottom: '1rem' }}>
            <h2
              style={{
                fontFamily: '"Cinzel", Georgia, serif',
                fontSize: '1rem',
                color: '#D4AF37',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Map size={18} />
              Draggable Token Demo
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#D4C5A9', margin: '0.5rem 0 0 0' }}>
              Drag tokens around the map. Click to select.
            </p>
          </div>
          
          {/* Token Map Area */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 400,
              background: 'linear-gradient(135deg, #2D2D2D 0%, #1A1A1A 100%)',
              border: '2px solid #424242',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            {/* Grid overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  linear-gradient(rgba(205, 127, 50, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(205, 127, 50, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                pointerEvents: 'none',
              }}
            />
            
            {/* Tokens */}
            {tokens.map(token => (
              <DraggableToken
                key={token.id}
                id={token.id}
                label={token.label}
                labelCjk={token.labelCjk}
                variant={token.variant}
                size="medium"
                position={token.position}
                onPositionChange={handleTokenPositionChange}
                onSelect={handleTokenSelect}
                isSelected={selectedToken === token.id}
              />
            ))}
          </div>
          
          {/* Selected token info */}
          {selectedToken && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid #D4AF37',
                borderRadius: '4px',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: '#D4AF37' }}>
                Selected: {tokens.find(t => t.id === selectedToken)?.label}
              </span>
            </div>
          )}
        </Panel9Slice>
        
        {/* Initiative Panel */}
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <h2
              style={{
                fontFamily: '"Cinzel", Georgia, serif',
                fontSize: '1rem',
                color: '#D4AF37',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Sword size={18} />
              Initiative Panel
            </h2>
          </div>
          
          <InitiativePanel
            entries={demoInitiativeEntries}
            currentTurn={currentTurn}
            roundNumber={3}
            orientation="vertical"
            onEntryClick={(id) => console.log('Clicked:', id)}
          />
        </div>
      </div>
      
      {/* Horizontal Initiative Panel Demo */}
      <div style={{ marginTop: '2rem', maxWidth: '1200px', margin: '2rem auto 0' }}>
        <h3
          style={{
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: '0.875rem',
            color: '#D4C5A9',
            marginBottom: '0.75rem',
          }}
        >
          Horizontal Initiative Panel
        </h3>
        <InitiativePanel
          entries={demoInitiativeEntries}
          currentTurn={currentTurn}
          roundNumber={3}
          orientation="horizontal"
        />
      </div>
      
      {/* Scroll Overlay Demo */}
      <ScrollOverlay
        isOpen={showScrollOverlay}
        onClose={() => setShowScrollOverlay(false)}
        variant={overlayVariant}
        size={overlaySize}
        title="Imperial Decree"
        titleCjk="皇帝诏书"
        transition="inkBlot"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p
            style={{
              fontFamily: '"Noto Serif SC", SimSun, serif',
              fontSize: '1rem',
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            天子诏曰：近日边疆告急，各地诸侯当团结一致，共御外敌。特此颁布诏令，望各位将军谨遵圣谕。
          </p>
          <p
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: overlayVariant === 'ink' ? '#D4C5A9' : '#424242',
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            The Emperor decrees: With threats at the border, all lords must unite against our common enemy. 
            This imperial edict commands all generals to heed this call to arms.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <ROTKButton variant="primary" onClick={() => setShowScrollOverlay(false)}>
              Accept
            </ROTKButton>
            <ROTKButton variant="secondary" onClick={() => setShowScrollOverlay(false)}>
              Close
            </ROTKButton>
          </div>
        </div>
      </ScrollOverlay>
      
      {/* Event Choice Dialog Demo */}
      <EventChoiceDialog
        isOpen={showEventDialog}
        onClose={() => setShowEventDialog(false)}
        speakerName="Sun Quan"
        speakerNameCjk="孙权"
        speakerTitle="Lord of Wu"
        dialogueText="My lord, the time has come for us to forge an alliance. Together, we can stand against the might of Cao Cao's forces. What say you to this proposal?"
        dialogueTextCjk="主公，结盟之时已到。若我们携手共进，定能抵御曹操的大军。不知您意下如何？"
        choices={demoChoices}
        onChoiceSelect={handleChoiceSelect}
        showTypewriter={true}
        typewriterSpeed={25}
      />
      
      {/* Scene Label */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          padding: '0.5rem 1rem',
          background: 'rgba(26, 26, 26, 0.9)',
          border: '1px solid #CD7F32',
          borderRadius: '4px',
          zIndex: 10,
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
          Component Showcase
        </span>
      </div>
    </div>
  );
}

export default ComponentShowcaseScene;
