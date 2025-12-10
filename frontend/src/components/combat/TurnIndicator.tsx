import type { CombatPhase } from '../../types';

interface TurnIndicatorProps {
  round: number;
  phase: CombatPhase;
  activeCharacter: string | null;
}

export default function TurnIndicator({ round, phase, activeCharacter }: TurnIndicatorProps) {
  const phaseNames: Record<CombatPhase, string> = {
    Quick1: 'Stage 1: Quick Actions (Fast SPD)',
    Major: 'Stage 2: Major Actions',
    Quick2: 'Stage 3: Quick Actions (Slow SPD)',
  };

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#334',
        borderRadius: '8px',
        marginBottom: '16px',
        border: '2px solid #555',
      }}
    >
      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '4px' }}>
        Round {round} - {phaseNames[phase]}
      </div>
      {activeCharacter && (
        <div style={{ fontSize: '0.95em', color: '#aaa' }}>Acting: {activeCharacter}</div>
      )}
    </div>
  );
}
