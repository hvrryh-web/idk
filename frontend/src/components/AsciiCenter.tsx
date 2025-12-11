import React from 'react';

type Props = {
  scene: string;
};

/**
 * AsciiCenter component displays ASCII art centered in the viewport
 * with monospace font and appropriate styling for game scenes.
 */
export default function AsciiCenter({ scene }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        background: '#000',
        color: '#c7f9cc',
        padding: 16,
        boxSizing: 'border-box',
        borderRadius: 8,
      }}
    >
      <pre
        style={{
          fontFamily: 'monospace',
          fontSize: 14,
          lineHeight: 1.0,
          margin: 0,
          whiteSpace: 'pre',
          textAlign: 'center',
        }}
      >
        {scene}
      </pre>
    </div>
  );
}
