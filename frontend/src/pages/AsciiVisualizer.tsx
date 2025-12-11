import React, { useState, useEffect, useRef } from 'react';
import AsciiCenter from '../components/AsciiCenter';

/**
 * AsciiVisualizer page - Enhanced version with WebSocket support
 * 
 * Features:
 * - Real-time scene updates via WebSocket
 * - Chat-to-scene generation
 * - Asset library browser
 * - Multiple scene presets
 */
export default function AsciiVisualizer() {
  const [scene, setScene] = useState<string>('Connect to see ASCII art');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatText, setChatText] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const [assets, setAssets] = useState<any>({ backgrounds: [], characters: [], effects: [] });
  const wsRef = useRef<WebSocket | null>(null);

  const baseUrl = import.meta.env.VITE_ASCII_SERVER_URL || 'http://localhost:3001';
  const wsUrl = baseUrl.replace('http', 'ws') + '/ws';

  // Connect to WebSocket on mount
  useEffect(() => {
    connectWebSocket();
    loadAssets();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('Connected to WebSocket');
        setWsConnected(true);
        setError(null);
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'scene') {
            setScene(message.scene);
          } else if (message.type === 'error') {
            setError(message.error);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
        setWsConnected(false);
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setWsConnected(false);
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };
      
      wsRef.current = ws;
    } catch (err: any) {
      setError(`Failed to connect: ${err.message}`);
    }
  };

  const loadAssets = async () => {
    try {
      const types = ['background', 'character', 'effect'];
      const results: any = { backgrounds: [], characters: [], effects: [] };
      
      for (const type of types) {
        const response = await fetch(`${baseUrl}/assets?type=${type}`);
        const data = await response.json();
        results[`${type}s`] = data.assets;
      }
      
      setAssets(results);
    } catch (err) {
      console.error('Failed to load assets:', err);
    }
  };

  const fetchScene = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/scene`);
      if (!response.ok) {
        throw new Error(`Failed to fetch scene: ${response.statusText}`);
      }
      const text = await response.text();
      setScene(text);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch scene');
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = () => {
    if (!chatText.trim()) return;
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat',
        text: chatText,
      }));
      setChatText('');
    } else {
      setError('WebSocket not connected');
    }
  };

  const loadPreset = (preset: string) => {
    const presets: Record<string, string> = {
      forest: 'A man and woman meet in the forest',
      temple: 'A cultivator enters the temple with sparkles',
      cave: 'An elder appears in the cave with smoke',
      ocean: 'A guardian stands by the ocean with energy',
    };
    
    setChatText(presets[preset] || '');
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 8 }}>ASCII Visual Image Generator</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Real-time ASCII art generation with chat integration and WebSocket support.
      </p>

      {/* Connection Status */}
      <div style={{
        padding: 8,
        marginBottom: 16,
        background: wsConnected ? '#e8f5e9' : '#ffebee',
        color: wsConnected ? '#2e7d32' : '#c62828',
        borderRadius: 4,
        fontSize: 14,
      }}>
        {wsConnected ? '🟢 Connected to server' : '🔴 Disconnected - attempting to reconnect...'}
      </div>

      {/* Chat Input */}
      <div style={{ marginBottom: 24 }}>
        <h3>Chat-to-Scene Generation</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            type="text"
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            placeholder="Enter scene description (e.g., 'cultivator in temple with energy')"
            style={{
              flex: 1,
              padding: '10px',
              fontSize: 14,
              fontFamily: 'monospace',
              border: '1px solid #ccc',
              borderRadius: 4,
            }}
          />
          <button
            onClick={sendChatMessage}
            disabled={!wsConnected || !chatText.trim()}
            style={{
              padding: '10px 20px',
              fontSize: 14,
              fontFamily: 'monospace',
              cursor: (!wsConnected || !chatText.trim()) ? 'not-allowed' : 'pointer',
              background: (!wsConnected || !chatText.trim()) ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: 4,
            }}
          >
            Generate
          </button>
        </div>
        
        {/* Presets */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, color: '#666', marginRight: 8 }}>Presets:</span>
          {['forest', 'temple', 'cave', 'ocean'].map((preset) => (
            <button
              key={preset}
              onClick={() => loadPreset(preset)}
              style={{
                padding: '6px 12px',
                fontSize: 12,
                fontFamily: 'monospace',
                cursor: 'pointer',
                background: '#f5f5f5',
                border: '1px solid #ccc',
                borderRadius: 4,
              }}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Traditional Fetch Button */}
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
          {loading ? 'Loading...' : 'Render Default Scene'}
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

      {/* Asset Library */}
      <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
        <h3>Available Assets</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <h4 style={{ marginTop: 0 }}>Backgrounds</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: 14 }}>
              {assets.backgrounds.map((asset: string) => (
                <li key={asset} style={{ padding: '4px 0' }}>📍 {asset}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ marginTop: 0 }}>Characters</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: 14 }}>
              {assets.characters.map((asset: string) => (
                <li key={asset} style={{ padding: '4px 0' }}>👤 {asset}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ marginTop: 0 }}>Effects</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: 14 }}>
              {assets.effects.map((asset: string) => (
                <li key={asset} style={{ padding: '4px 0' }}>✨ {asset}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Features Completed */}
      <div style={{ marginTop: 24, padding: 16, background: '#e8f5e9', borderRadius: 4 }}>
        <h3>✅ Features Implemented</h3>
        <ul>
          <li>✅ Chat-tagging system for dynamic asset selection</li>
          <li>✅ WebSocket support for real-time scene updates</li>
          <li>✅ Expanded asset library (9 backgrounds/characters/effects)</li>
          <li>✅ Metadata files for precise anchor points (12 assets)</li>
          <li>✅ Game engine event API integration module</li>
        </ul>
      </div>
    </div>
  );
}
