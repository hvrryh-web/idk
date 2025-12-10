interface QuickActionPanelProps {
  onSelectQuickAction: (action: string) => void;
  disabled?: boolean;
}

const QUICK_ACTIONS = [
  { id: 'GUARD_SHIFT', name: '🛡️ Guard Shift', description: 'Increase Guard by 10' },
  { id: 'DODGE', name: '⚡ Dodge', description: '+20% DR this round' },
  { id: 'BRACE', name: '🔰 Brace', description: '+5 Guard + 10% DR' },
  { id: 'AE_PULSE', name: '⚡ AE Pulse', description: 'Gain +3 AE immediately' },
  { id: 'STRAIN_VENT', name: '💨 Strain Vent', description: 'Reduce Strain by 1' },
  { id: 'STANCE_SWITCH', name: '🔄 Stance Switch', description: 'Toggle Defensive/Offensive' },
  { id: 'COUNTER_PREP', name: '⚔️ Counter Prep', description: 'Prepare counter-attack' },
];

export default function QuickActionPanel({ onSelectQuickAction, disabled = false }: QuickActionPanelProps) {
  return (
    <div style={{ padding: '12px', backgroundColor: '#222', borderRadius: '8px', marginBottom: '12px' }}>
      <h3 style={{ margin: '0 0 12px 0' }}>Quick Actions (No AE Cost)</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => !disabled && onSelectQuickAction(action.id)}
            disabled={disabled}
            style={{
              padding: '10px',
              backgroundColor: disabled ? '#333' : '#445',
              border: '1px solid #666',
              borderRadius: '6px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
            title={action.description}
          >
            <div style={{ fontSize: '0.95em', fontWeight: 'bold' }}>{action.name}</div>
            <div style={{ fontSize: '0.75em', color: '#aaa', marginTop: '4px' }}>{action.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
