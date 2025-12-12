/**
 * LayerProgressView
 * 
 * Visual 7-layer progress indicator with previews.
 * Shows generation progress through each layer of the pipeline.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Circle, Loader2, X, Clock, Download } from 'lucide-react';

interface LayerProgressViewProps {
  jobId: string;
  onComplete?: (outputs: Record<string, string>) => void;
  onCancel?: () => void;
  onError?: (error: string) => void;
}

interface JobStatus {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  current_layer: number;
  total_layers: number;
  progress_percent: number;
  eta: number | null;
  error_message: string | null;
}

interface LayerInfo {
  id: string;
  name: string;
  description: string;
}

const LAYERS: LayerInfo[] = [
  { id: 'sketch', name: 'Base Sketch', description: 'Rough composition and pose' },
  { id: 'lineart', name: 'Line Art', description: 'Clean structural lines' },
  { id: 'flat_color', name: 'Base Colors', description: 'Flat color blocking' },
  { id: 'shaded', name: 'Shading', description: 'Light and shadow mapping' },
  { id: 'detailed', name: 'Details', description: 'Fine detail enhancement' },
  { id: 'effects', name: 'Effects', description: 'Qi auras and effects' },
  { id: 'final', name: 'Final Render', description: 'Professional polish' },
];

const API_BASE = '/api/v1/comfyui';

export const LayerProgressView: React.FC<LayerProgressViewProps> = ({
  jobId,
  onComplete,
  onCancel,
  onError,
}) => {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [isConnected, setIsConnected] = useState(false);

  // Poll for status updates
  const pollStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/status/${jobId}`);
      if (!response.ok) {
        throw new Error('Failed to get status');
      }
      const data: JobStatus = await response.json();
      setStatus(data);

      if (data.status === 'completed') {
        onComplete?.(previews);
      } else if (data.status === 'failed') {
        onError?.(data.error_message || 'Generation failed');
      }
    } catch (error) {
      console.error('Status poll error:', error);
    }
  }, [jobId, onComplete, onError, previews]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}${API_BASE}/progress/${jobId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'progress') {
          setStatus({
            job_id: data.job_id,
            status: data.status,
            current_layer: data.current_layer,
            total_layers: data.total_layers,
            progress_percent: data.progress_percent,
            eta: null,
            error_message: data.error_message,
          });
        } else if (data.type === 'complete') {
          setStatus((prev) => prev ? { ...prev, status: 'completed' } : null);
          onComplete?.(data.layer_outputs || {});
        } else if (data.type === 'error') {
          setStatus((prev) => prev ? { ...prev, status: 'failed' } : null);
          onError?.(data.error_message || 'Generation failed');
        }
      } catch (e) {
        console.error('WebSocket message parse error:', e);
      }
    };

    ws.onerror = () => {
      setIsConnected(false);
      // Fall back to polling
      const pollInterval = setInterval(pollStatus, 2000);
      return () => clearInterval(pollInterval);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [jobId, onComplete, onError, pollStatus]);

  // Initial status fetch
  useEffect(() => {
    pollStatus();
  }, [pollStatus]);

  const handleCancel = async () => {
    try {
      await fetch(`${API_BASE}/job/${jobId}`, { method: 'DELETE' });
      onCancel?.();
    } catch (error) {
      console.error('Cancel error:', error);
    }
  };

  const handleDownload = async (layer?: string) => {
    const url = layer
      ? `${API_BASE}/download/${jobId}?layer=${layer}`
      : `${API_BASE}/download/${jobId}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `character_${layer || 'final'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const currentLayer = status?.current_layer || 0;
  const isComplete = status?.status === 'completed';
  const isFailed = status?.status === 'failed';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          {isComplete ? '✓ Generation Complete' : 
           isFailed ? '✗ Generation Failed' :
           'Generating Character...'}
        </h3>
        
        <div style={styles.connectionStatus}>
          <span style={{
            ...styles.connectionDot,
            backgroundColor: isConnected ? '#4CAF50' : '#FFC107',
          }} />
          {isConnected ? 'Live Updates' : 'Polling'}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div 
          style={{
            ...styles.progressBar,
            width: `${status?.progress_percent || 0}%`,
            backgroundColor: isFailed ? '#F44336' : '#6366f1',
          }}
        />
        <span style={styles.progressText}>
          {Math.round(status?.progress_percent || 0)}%
        </span>
      </div>

      {/* ETA */}
      {status?.eta && !isComplete && !isFailed && (
        <div style={styles.eta}>
          <Clock size={14} />
          Estimated time remaining: {Math.ceil(status.eta / 60)} min
        </div>
      )}

      {/* Layer List */}
      <div style={styles.layerList}>
        {LAYERS.map((layer, index) => {
          const layerNum = index + 1;
          const isCompleted = layerNum < currentLayer || isComplete;
          const isActive = layerNum === currentLayer && !isComplete && !isFailed;
          const isPending = layerNum > currentLayer && !isComplete;

          return (
            <div
              key={layer.id}
              style={{
                ...styles.layerItem,
                ...(isActive ? styles.layerItemActive : {}),
                ...(isCompleted ? styles.layerItemCompleted : {}),
              }}
            >
              <div style={styles.layerIcon}>
                {isCompleted ? (
                  <CheckCircle size={20} color="#4CAF50" />
                ) : isActive ? (
                  <Loader2 size={20} className="animate-spin" style={{ color: '#6366f1' }} />
                ) : (
                  <Circle size={20} color="#666" />
                )}
              </div>
              
              <div style={styles.layerInfo}>
                <span style={styles.layerName}>{layer.name}</span>
                <span style={styles.layerDesc}>{layer.description}</span>
              </div>

              {/* Preview thumbnail */}
              {isCompleted && previews[layer.id] && (
                <img
                  src={previews[layer.id]}
                  alt={layer.name}
                  style={styles.preview}
                />
              )}

              {/* Download layer button */}
              {isCompleted && (
                <button
                  onClick={() => handleDownload(layer.id)}
                  style={styles.downloadLayerBtn}
                  title={`Download ${layer.name}`}
                >
                  <Download size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {isFailed && status?.error_message && (
        <div style={styles.errorBox}>
          {status.error_message}
        </div>
      )}

      {/* Action Buttons */}
      <div style={styles.actions}>
        {!isComplete && !isFailed && (
          <button onClick={handleCancel} style={styles.cancelButton}>
            <X size={16} />
            Cancel
          </button>
        )}

        {isComplete && (
          <button onClick={() => handleDownload()} style={styles.downloadButton}>
            <Download size={16} />
            Download Final Image
          </button>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px',
    backgroundColor: '#1a1a2e',
    borderRadius: '12px',
    color: '#fff',
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    margin: 0,
    fontSize: '1.2rem',
  },
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: '#888',
  },
  connectionDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  progressContainer: {
    position: 'relative',
    height: '24px',
    backgroundColor: '#2a2a4e',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  progressBar: {
    height: '100%',
    transition: 'width 0.3s ease-out',
  },
  progressText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  eta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    color: '#888',
    marginBottom: '16px',
  },
  layerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
  },
  layerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#2a2a4e',
    borderRadius: '8px',
    border: '1px solid transparent',
    transition: 'all 0.2s',
  },
  layerItemActive: {
    borderColor: '#6366f1',
    backgroundColor: '#3a3a5e',
  },
  layerItemCompleted: {
    opacity: 0.8,
  },
  layerIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
  },
  layerInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  layerName: {
    fontWeight: 500,
    fontSize: '0.95rem',
  },
  layerDesc: {
    fontSize: '0.8rem',
    color: '#888',
  },
  preview: {
    width: '48px',
    height: '48px',
    objectFit: 'cover',
    borderRadius: '6px',
  },
  downloadLayerBtn: {
    padding: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  errorBox: {
    padding: '12px',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    border: '1px solid #F44336',
    borderRadius: '8px',
    color: '#F44336',
    fontSize: '0.9rem',
    marginBottom: '16px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: '1px solid #666',
    borderRadius: '6px',
    color: '#888',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  downloadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
};

export default LayerProgressView;
