import type { ActionPreview as ActionPreviewType } from '../../types';

interface ActionPreviewProps {
  preview: ActionPreviewType | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ActionPreview({ preview, onConfirm, onCancel }: ActionPreviewProps) {
  if (!preview) return null;

  const hasWarnings = preview.warnings && preview.warnings.length > 0;
  const hasCostTracks = preview.blood_marks > 0 || preview.fate_marks > 0 || preview.stain_marks > 0;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#1a1a1a',
        border: '2px solid #555',
        borderRadius: '12px',
        padding: '24px',
        minWidth: '400px',
        zIndex: 1000,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
      }}
    >
      <h2 style={{ margin: '0 0 16px 0' }}>Action Preview: {preview.technique_name}</h2>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '1.1em', marginBottom: '8px' }}>
          <strong>Cost:</strong> {preview.ae_cost} AE
        </div>
        <div style={{ fontSize: '1.1em', marginBottom: '8px' }}>
          <strong>Self-Strain:</strong> +{preview.self_strain}
        </div>
        <div style={{ fontSize: '1.1em', marginBottom: '8px' }}>
          <strong>Estimated Damage:</strong> ~{preview.estimated_damage} THP
        </div>
      </div>

      {hasCostTracks && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#332',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #664',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1em' }}>Cost Track Marks:</h3>
          {preview.blood_marks > 0 && (
            <div style={{ color: '#f55', marginBottom: '4px' }}>
              🩸 Blood Track: +{preview.blood_marks} mark(s)
            </div>
          )}
          {preview.fate_marks > 0 && (
            <div style={{ color: '#5af', marginBottom: '4px' }}>
              ⭐ Fate Track: +{preview.fate_marks} mark(s)
            </div>
          )}
          {preview.stain_marks > 0 && (
            <div style={{ color: '#a5f', marginBottom: '4px' }}>
              ☠️ Stain Track: +{preview.stain_marks} mark(s)
            </div>
          )}
        </div>
      )}

      {hasWarnings && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#331',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #864',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1em', color: '#fa5' }}>⚠️ Warnings:</h3>
          {preview.warnings.map((warning, i) => (
            <div key={i} style={{ color: '#fa5', marginBottom: '4px' }}>
              • {warning}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            backgroundColor: '#555',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1em',
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            padding: '10px 20px',
            backgroundColor: '#585',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: 'bold',
          }}
        >
          Confirm Action
        </button>
      </div>
    </div>
  );
}
