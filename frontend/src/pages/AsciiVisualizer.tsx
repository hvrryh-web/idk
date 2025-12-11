import React, { useState } from 'react';
import AsciiCenter from '../components/AsciiCenter';

/**
 * AsciiVisualizer page - PoC for ASCII text-to-image generation
 * 
 * Demonstrates the ASCII art composition system with a forest scene
 * and character overlays. This is a proof-of-concept that will be
 * integrated with the game chat system for dynamic scene generation.
 */
export default function AsciiVisualizer() {
  const [scene, setScene] = useState<string>('Press "Render PoC Scene" to see ASCII art');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScene = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use environment variable or fallback to localhost for development
      const baseUrl = import.meta.env.VITE_ASCII_SERVER_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/scene`);
      if (!response.ok) {
        throw new Error(`Failed to fetch scene: ${response.statusText}`);
      }
      const text = await response.text();
      setScene(text);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch scene');
      setScene('Error loading scene. Make sure the ASCII server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 8 }}>ASCII Visual Image Generator (PoC)</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Proof-of-concept for generating ASCII art scenes with background and character overlays.
        This will be integrated with game chat for dynamic scene generation.
      </p>

      <div style={{ marginBottom: 24 }}>
        <button
          onClick={fetchScene}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: 16,
            fontFamily: 'monospace',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: 4,
          }}
        >
          {loading ? 'Loading...' : 'Render PoC Scene'}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: 12,
            marginBottom: 24,
            background: '#ffebee',
            color: '#c62828',
            borderRadius: 4,
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      <AsciiCenter scene={scene} />

      <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
        <h3>Next Steps</h3>
        <ul>
          <li>Connect to chat-tagging system for dynamic asset selection</li>
          <li>Add WebSocket support for real-time scene updates</li>
          <li>Expand asset library with more backgrounds and characters</li>
          <li>Add metadata files for precise anchor points</li>
          <li>Integrate with game engine event API</li>
        </ul>
      </div>
    </div>
  );
}
