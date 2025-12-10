import { useEffect, useRef } from 'react';
import type { LogEntry } from '../../types';

interface CombatLogProps {
  entries: LogEntry[];
  maxHeight?: string;
}

export default function CombatLog({ entries, maxHeight = '200px' }: CombatLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <div
      style={{
        border: '1px solid #555',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#1a1a1a',
        maxHeight,
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h3 style={{ margin: 0 }}>Combat Log</h3>
        <span style={{ fontSize: '0.85em', color: '#888' }}>{entries.length} entries</span>
      </div>

      <div style={{ fontSize: '0.9em' }}>
        {entries.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>Combat log is empty</p>
        ) : (
          entries.map((entry, i) => (
            <div
              key={i}
              style={{
                padding: '6px 0',
                borderBottom: i < entries.length - 1 ? '1px solid #333' : 'none',
              }}
            >
              <div style={{ color: '#5cf' }}>
                &gt; {entry.actor} {entry.action}
                {entry.target && ` on ${entry.target}`}
              </div>
              <div style={{ color: '#ccc', paddingLeft: '12px' }}>{entry.result}</div>
              {entry.damage !== undefined && (
                <div style={{ color: '#f88', paddingLeft: '12px' }}>{entry.damage} damage dealt</div>
              )}
              {entry.conditions && entry.conditions.length > 0 && (
                <div style={{ color: '#fa5', paddingLeft: '12px' }}>
                  Conditions: {entry.conditions.join(', ')}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
