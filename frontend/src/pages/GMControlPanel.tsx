/**
 * Game Master Control Panel
 * 
 * Provides GM-level controls for managing ComfyUI art generation,
 * including remote start/stop, progress monitoring, and batch operations.
 */

import React, { useState, useEffect } from 'react';
import './GMControlPanel.css';

interface GenerationSession {
  session_id: string;
  status: string;
  total_jobs: number;
  completed_jobs: number;
  failed_jobs: number;
  in_progress_jobs: number;
  estimated_time_remaining: number | null;
}

interface GenerationJob {
  job_id: string;
  character_id: string;
  generation_type: string;
  status: string;
  progress_percent: number;
  error_message?: string;
}

const API_BASE = 'http://localhost:8000/api/v1/gm';

export const GMControlPanel: React.FC = () => {
  const [sessions, setSessions] = useState<GenerationSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionJobs, setSessionJobs] = useState<GenerationJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for new generation
  const [characterIds, setCharacterIds] = useState<string>('');
  const [generationTypes, setGenerationTypes] = useState<string[]>(['portrait']);
  const [useLora, setUseLora] = useState(true);
  const [priority, setPriority] = useState('normal');
  
  // Batch generation form
  const [manifestPath, setManifestPath] = useState('manifests/diao-chan-lu-bu.json');
  const [parallelJobs, setParallelJobs] = useState(1);

  // Auto-refresh sessions every 2 seconds
  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch session jobs when selected session changes
  useEffect(() => {
    if (selectedSession) {
      fetchSessionJobs(selectedSession);
      const interval = setInterval(() => fetchSessionJobs(selectedSession), 2000);
      return () => clearInterval(interval);
    }
  }, [selectedSession]);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_BASE}/art-generation/sessions`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  const fetchSessionJobs = async (sessionId: string) => {
    try {
      const response = await fetch(`${API_BASE}/art-generation/jobs/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSessionJobs(data);
      }
    } catch (err) {
      console.error('Failed to fetch session jobs:', err);
    }
  };

  const startArtGeneration = async () => {
    setLoading(true);
    setError(null);

    const charIds = characterIds.split(',').map(id => id.trim()).filter(id => id);
    
    if (charIds.length === 0) {
      setError('Please enter at least one character ID');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/art-generation/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character_ids: charIds,
          generation_types: generationTypes,
          use_lora: useLora,
          priority: priority,
          auto_cleanup: true,
        }),
      });

      if (response.ok) {
        const session = await response.json();
        setSelectedSession(session.session_id);
        setCharacterIds('');
        await fetchSessions();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to start generation');
      }
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const startBatchGeneration = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/art-generation/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manifest_path: manifestPath,
          character_filter: null,
          generation_types: generationTypes,
          parallel_jobs: parallelJobs,
        }),
      });

      if (response.ok) {
        const session = await response.json();
        setSelectedSession(session.session_id);
        await fetchSessions();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to start batch generation');
      }
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const controlSession = async (sessionId: string, action: string) => {
    try {
      const response = await fetch(`${API_BASE}/art-generation/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          action: action,
        }),
      });

      if (response.ok) {
        await fetchSessions();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || `Failed to ${action} session`);
      }
    } catch (err) {
      setError(`Error: ${err}`);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`${API_BASE}/art-generation/session/${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (selectedSession === sessionId) {
          setSelectedSession(null);
          setSessionJobs([]);
        }
        await fetchSessions();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to delete session');
      }
    } catch (err) {
      setError(`Error: ${err}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return '#4CAF50';
      case 'completed': return '#2196F3';
      case 'paused': return '#FF9800';
      case 'stopped': return '#9E9E9E';
      case 'error': return '#F44336';
      case 'failed': return '#F44336';
      default: return '#757575';
    }
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const toggleGenerationType = (type: string) => {
    if (generationTypes.includes(type)) {
      setGenerationTypes(generationTypes.filter(t => t !== type));
    } else {
      setGenerationTypes([...generationTypes, type]);
    }
  };

  return (
    <div className="gm-control-panel">
      <h1>🎮 Game Master Control Panel</h1>
      <p className="subtitle">ComfyUI Art Generation Management</p>

      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="panel-grid">
        {/* Left Column: Generation Controls */}
        <div className="panel-section">
          <h2>Start New Generation</h2>
          
          <div className="form-section">
            <h3>Character Generation</h3>
            <label>
              Character IDs (comma-separated):
              <input
                type="text"
                value={characterIds}
                onChange={(e) => setCharacterIds(e.target.value)}
                placeholder="npc-diao-chan, npc-lu-bu"
                disabled={loading}
              />
            </label>

            <label>Generation Types:</label>
            <div className="checkbox-group">
              {['portrait', 'fullbody', 'expressions', 'poses_sheet', 'outfits_sheet', 'character_sheet'].map(type => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={generationTypes.includes(type)}
                    onChange={() => toggleGenerationType(type)}
                    disabled={loading}
                  />
                  {type}
                </label>
              ))}
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useLora}
                onChange={(e) => setUseLora(e.target.checked)}
                disabled={loading}
              />
              Use Character LoRAs
            </label>

            <label>
              Priority:
              <select value={priority} onChange={(e) => setPriority(e.target.value)} disabled={loading}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </label>

            <button
              className="btn-primary"
              onClick={startArtGeneration}
              disabled={loading || characterIds.trim() === ''}
            >
              {loading ? '⏳ Starting...' : '🚀 Start Generation'}
            </button>
          </div>

          <div className="form-section">
            <h3>Batch Generation from Manifest</h3>
            <label>
              Manifest Path:
              <input
                type="text"
                value={manifestPath}
                onChange={(e) => setManifestPath(e.target.value)}
                disabled={loading}
              />
            </label>

            <label>
              Parallel Jobs:
              <input
                type="number"
                min="1"
                max="4"
                value={parallelJobs}
                onChange={(e) => setParallelJobs(parseInt(e.target.value))}
                disabled={loading}
              />
            </label>

            <button
              className="btn-primary"
              onClick={startBatchGeneration}
              disabled={loading}
            >
              {loading ? '⏳ Starting...' : '📦 Start Batch Generation'}
            </button>
          </div>
        </div>

        {/* Right Column: Active Sessions */}
        <div className="panel-section">
          <h2>Active Sessions ({sessions.length})</h2>
          
          {sessions.length === 0 ? (
            <p className="empty-state">No active sessions. Start a generation to see it here.</p>
          ) : (
            <div className="sessions-list">
              {sessions.map(session => (
                <div
                  key={session.session_id}
                  className={`session-card ${selectedSession === session.session_id ? 'selected' : ''}`}
                  onClick={() => setSelectedSession(session.session_id)}
                >
                  <div className="session-header">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(session.status) }}
                    >
                      {session.status}
                    </span>
                    <span className="session-id">{session.session_id.substring(0, 8)}...</span>
                  </div>
                  
                  <div className="session-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(session.completed_jobs / session.total_jobs) * 100}%`,
                          backgroundColor: getStatusColor(session.status),
                        }}
                      />
                    </div>
                    <div className="progress-text">
                      {session.completed_jobs} / {session.total_jobs} completed
                      {session.failed_jobs > 0 && ` (${session.failed_jobs} failed)`}
                    </div>
                  </div>

                  {session.estimated_time_remaining && (
                    <div className="eta">
                      ETA: {formatTime(session.estimated_time_remaining)}
                    </div>
                  )}

                  <div className="session-controls">
                    {session.status === 'running' && (
                      <button
                        className="btn-small"
                        onClick={(e) => {
                          e.stopPropagation();
                          controlSession(session.session_id, 'pause');
                        }}
                      >
                        ⏸ Pause
                      </button>
                    )}
                    {session.status === 'paused' && (
                      <button
                        className="btn-small"
                        onClick={(e) => {
                          e.stopPropagation();
                          controlSession(session.session_id, 'resume');
                        }}
                      >
                        ▶ Resume
                      </button>
                    )}
                    {(session.status === 'running' || session.status === 'paused') && (
                      <button
                        className="btn-small btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          controlSession(session.session_id, 'stop');
                        }}
                      >
                        ⏹ Stop
                      </button>
                    )}
                    {(session.status === 'completed' || session.status === 'stopped' || session.status === 'error') && (
                      <button
                        className="btn-small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.session_id);
                        }}
                      >
                        🗑 Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Job Details */}
      {selectedSession && (
        <div className="panel-section full-width">
          <h2>Job Details - Session {selectedSession.substring(0, 8)}...</h2>
          
          {sessionJobs.length === 0 ? (
            <p className="empty-state">No jobs in this session yet.</p>
          ) : (
            <div className="jobs-table">
              <table>
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Character</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionJobs.map(job => (
                    <tr key={job.job_id}>
                      <td>{job.job_id}</td>
                      <td>{job.character_id}</td>
                      <td>{job.generation_type}</td>
                      <td>
                        <span
                          className="status-badge small"
                          style={{ backgroundColor: getStatusColor(job.status) }}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td>
                        <div className="mini-progress-bar">
                          <div
                            className="mini-progress-fill"
                            style={{ width: `${job.progress_percent}%` }}
                          />
                        </div>
                        <span className="progress-percent">{job.progress_percent.toFixed(0)}%</span>
                      </td>
                      <td className="error-cell">{job.error_message || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GMControlPanel;
