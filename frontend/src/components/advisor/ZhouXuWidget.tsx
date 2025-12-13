import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ZhouXuAdvisor.css';
import * as zhouXuService from '../../services/zhouXuService';

// Types for the advisor system
interface AdvisorMessage {
  id: string;
  type: 'user' | 'advisor';
  text: string;
  timestamp: Date;
  emotionalTags?: string[];
  conversationType?: string;
}

interface QuickHelpItem {
  id: string;
  title: string;
  category: string;
  keywords: string[];
}

// Logging status for display
interface LogsInfo {
  hasAutoSave: boolean;
  manualSaves: string[];
  totalSizeKb: number;
}

// Quick help items for fast search
const quickHelpItems: QuickHelpItem[] = [
  { id: 'cultivation-basics', title: 'Cultivation Basics', category: 'Mechanics', keywords: ['cultivation', 'qi', 'realm', 'breakthrough'] },
  { id: 'combat-system', title: 'Combat System', category: 'Mechanics', keywords: ['combat', 'fight', 'attack', 'defend', 'technique'] },
  { id: 'soul-core', title: 'Soul Core', category: 'Mechanics', keywords: ['soul', 'core', 'awakening', 'ability'] },
  { id: 'character-creation', title: 'Character Creation', category: 'Rules', keywords: ['character', 'create', 'new', 'start', 'begin'] },
  { id: 'techniques', title: 'Techniques Guide', category: 'Mechanics', keywords: ['technique', 'skill', 'martial', 'art'] },
  { id: 'pillars', title: 'Three Pillars', category: 'Mechanics', keywords: ['violence', 'influence', 'revelation', 'pillar'] },
  { id: 'fate-cards', title: 'Fate Cards', category: 'Mechanics', keywords: ['fate', 'card', 'death', 'body', 'seed'] },
  { id: 'domain-source', title: 'Domain Sources', category: 'Setting', keywords: ['domain', 'source', 'element', 'power'] },
];

// Fallback local responses (used when backend is unavailable)
const getLocalAdvisorResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('greet')) {
    return "Ah, my sworn brother! How does the day find you? I was just reviewing our campaign strategies, but your presence is always the priority.";
  }
  
  if (lowerQuery.includes('how are you') || lowerQuery.includes("how's it going")) {
    return "I fare well when you fare well, brother. Our fates are intertwined like the rivers that flow to the sea. And you?";
  }
  
  if (lowerQuery.includes('combat') || lowerQuery.includes('fight') || lowerQuery.includes('battle')) {
    return "Combat in our world follows the Three-Stage system. Each round has Initiation, Exchange, and Resolution phases. Would you like me to explain the action economy, or perhaps the role of Techniques?";
  }
  
  if (lowerQuery.includes('cultivation') || lowerQuery.includes('realm') || lowerQuery.includes('breakthrough')) {
    return "Cultivation is the path to power. Your Soul Cultivation Level (SCL) determines your current realm. Focus on balancing the Three Pillars - Violence, Influence, and Revelation - to progress. Shall I elaborate on any pillar?";
  }
  
  if (lowerQuery.includes('technique') || lowerQuery.includes('skill')) {
    return "Techniques are divided by type and pillar alignment. Violence techniques excel in direct combat, Influence techniques affect others' minds and actions, while Revelation techniques uncover hidden truths. Each has unique Action Energy costs.";
  }
  
  if (lowerQuery.includes('fate') || lowerQuery.includes('card')) {
    return "Fate Cards represent the threads of destiny woven into your being. Death cards govern mortality and transcendence, Body cards enhance physical prowess, and Seed cards channel elemental essence. Drawing wisely shapes your path.";
  }
  
  if (lowerQuery.includes('help') || lowerQuery.includes('tutorial') || lowerQuery.includes('start') || lowerQuery.includes('begin')) {
    return "Of course, brother! For new cultivators, I recommend starting with Character Creation, then understanding the Combat System basics. The wiki contains detailed articles on all mechanics. What aspect interests you most?";
  }
  
  if (lowerQuery.includes('thank')) {
    return "You honor me with your gratitude, brother. Remember, the path of cultivation is long, but you do not walk it alone. I am always here to guide you.";
  }
  
  if (lowerQuery.includes('sad') || lowerQuery.includes('upset') || lowerQuery.includes('down')) {
    return "Brother... I am here. Whatever weighs upon you, you do not carry it alone. Speak your heart - I will listen.";
  }
  
  if (lowerQuery.includes('worried') || lowerQuery.includes('anxious') || lowerQuery.includes('scared')) {
    return "Even the mightiest generals feel worry before battle. It shows wisdom, not weakness. Tell me what concerns you, and together we shall find a path forward.";
  }
  
  if (lowerQuery.includes('bye') || lowerQuery.includes('goodbye') || lowerQuery.includes('farewell')) {
    return "Until we meet again, brother. May the winds favor your journey. Remember: you are never truly alone in your struggles.";
  }
  
  return "An intriguing thought, brother. Let me consider... I suggest consulting the relevant wiki article for detailed information. You may also use the search bar below to find specific topics. Is there a particular aspect I can clarify?";
};

interface ZhouXuWidgetProps {
  onOpenFullHelp?: () => void;
  onNavigateToArticle?: (articleId: string) => void;
}

type ViewMode = 'chat' | 'memory' | 'troubleshoot';
type Expression = 'welcoming' | 'explaining' | 'thinking' | 'pleased' | 'concerned' | 'confident';

/**
 * Zhou Xu Advisor Widget - Enhanced Best Friend Advisor
 * 
 * Features:
 * - Best friend advisor role (Zhou Yu treating player like Sun Ce)
 * - Emotional response system with tag-based responses
 * - Session logging for quest events
 * - Memory management UI (save, clear, load)
 * - Troubleshooting panel for players and GMs
 */
export const ZhouXuWidget: React.FC<ZhouXuWidgetProps> = ({ 
  onOpenFullHelp,
  onNavigateToArticle 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [messages, setMessages] = useState<AdvisorMessage[]>([
    {
      id: '1',
      type: 'advisor',
      text: "Ah, there you are, sworn brother! How does the day find you? I was just thinking of our next move on the campaign map, but your presence is always the priority.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<QuickHelpItem[]>([]);
  const [expression, setExpression] = useState<Expression>('welcoming');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logsInfo, setLogsInfo] = useState<LogsInfo | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [diagnosticsData, setDiagnosticsData] = useState<zhouXuService.DiagnosticsData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && viewMode === 'chat') {
      inputRef.current?.focus();
    }
  }, [isExpanded, viewMode]);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = quickHelpItems.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.keywords.some(kw => kw.includes(query))
    );
    setSearchResults(results);
  }, [searchQuery]);

  // Auto-save setup
  useEffect(() => {
    if (sessionId && isBackendAvailable) {
      // Auto-save every 2 minutes
      autoSaveTimerRef.current = setInterval(async () => {
        try {
          await zhouXuService.autoSaveSession(sessionId);
        } catch (error) {
          console.warn('Auto-save failed:', error);
        }
      }, 2 * 60 * 1000);

      return () => {
        if (autoSaveTimerRef.current) {
          clearInterval(autoSaveTimerRef.current);
        }
      };
    }
  }, [sessionId, isBackendAvailable]);

  // Load logs status when memory view is opened
  const loadLogsStatus = useCallback(async () => {
    try {
      const status = await zhouXuService.getLogsStatus();
      setLogsInfo({
        hasAutoSave: status.has_auto_save,
        manualSaves: status.manual_saves,
        totalSizeKb: status.total_size_kb,
      });
    } catch (error) {
      console.warn('Failed to load logs status:', error);
    }
  }, []);

  // Load diagnostics
  const loadDiagnostics = useCallback(async () => {
    try {
      const data = await zhouXuService.getDiagnostics();
      setDiagnosticsData(data);
    } catch (error) {
      console.warn('Failed to load diagnostics:', error);
    }
  }, []);

  useEffect(() => {
    if (viewMode === 'memory') {
      loadLogsStatus();
    } else if (viewMode === 'troubleshoot') {
      loadDiagnostics();
    }
  }, [viewMode, loadLogsStatus, loadDiagnostics]);

  // Map emotional state to expression
  const getExpressionFromState = (emotionalState: string): Expression => {
    switch (emotionalState) {
      case 'happy':
        return 'pleased';
      case 'sad':
      case 'worried':
        return 'concerned';
      case 'curious':
        return 'explaining';
      case 'frustrated':
        return 'thinking';
      default:
        return 'welcoming';
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: AdvisorMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setExpression('thinking');
    setIsLoading(true);

    try {
      // Try backend first
      const response = await zhouXuService.sendChatMessage(inputValue, sessionId || undefined);
      
      setSessionId(response.session_id);
      setIsBackendAvailable(true);
      
      const advisorMessage: AdvisorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'advisor',
        text: response.response,
        timestamp: new Date(),
        emotionalTags: response.tags_used,
        conversationType: response.conversation_type
      };
      
      setMessages(prev => [...prev, advisorMessage]);
      setExpression(getExpressionFromState(response.emotional_state));
      
    } catch (error) {
      // Fallback to local response
      console.warn('Backend unavailable, using local response:', error);
      setIsBackendAvailable(false);
      
      const localResponse = getLocalAdvisorResponse(inputValue);
      const advisorMessage: AdvisorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'advisor',
        text: localResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, advisorMessage]);
      setExpression('explaining');
    }
    
    setIsLoading(false);
    
    // Return to welcoming after response
    setTimeout(() => setExpression('welcoming'), 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickHelpClick = (item: QuickHelpItem) => {
    setSearchQuery('');
    setSearchResults([]);
    if (onNavigateToArticle) {
      onNavigateToArticle(item.id);
    }
  };

  const handleSaveSession = async () => {
    if (!sessionId) return;
    
    try {
      const result = await zhouXuService.saveSession(sessionId);
      if (result.success) {
        // Add confirmation message
        const confirmMessage: AdvisorMessage = {
          id: Date.now().toString(),
          type: 'advisor',
          text: `Session saved successfully, brother. ${result.saved_as} now holds our conversation for posterity.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, confirmMessage]);
        loadLogsStatus();
      }
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const handleClearLogs = async (keepAutoSave: boolean = true) => {
    try {
      const result = await zhouXuService.clearLogs(keepAutoSave);
      if (result.success) {
        loadLogsStatus();
        const confirmMessage: AdvisorMessage = {
          id: Date.now().toString(),
          type: 'advisor',
          text: `Cleared ${result.deleted_count} log files, brother. ${keepAutoSave ? 'The auto-save remains intact.' : 'All logs have been cleared.'}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, confirmMessage]);
      }
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
    setShowSavePrompt(false);
  };

  const handleLoadSave = async (filename: string) => {
    try {
      const result = await zhouXuService.loadSavedSession(filename);
      if (result.success) {
        setSessionId(result.session_id);
        const confirmMessage: AdvisorMessage = {
          id: Date.now().toString(),
          type: 'advisor',
          text: `Ah, I remember this conversation! Let us continue where we left off, brother.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, confirmMessage]);
        setViewMode('chat');
      }
    } catch (error) {
      console.error('Failed to load save:', error);
    }
  };

  const renderChatView = () => (
    <>
      {/* Messages area */}
      <div className="messages-container">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.type === 'advisor' ? 'advisor-message' : 'user-message'}`}
          >
            {msg.type === 'advisor' && (
              <div className="message-avatar">
                <span>周</span>
              </div>
            )}
            <div className="message-bubble">
              <p className="message-text">{msg.text}</p>
              {msg.emotionalTags && msg.emotionalTags.length > 0 && (
                <div className="message-tags">
                  {msg.emotionalTags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message advisor-message">
            <div className="message-avatar">
              <span>周</span>
            </div>
            <div className="message-bubble typing-indicator">
              <span>•</span><span>•</span><span>•</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick search */}
      <div className="quick-search">
        <input
          type="text"
          className="search-input"
          placeholder="Quick search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(item => (
              <button
                key={item.id}
                className="search-result-item"
                onClick={() => handleQuickHelpClick(item)}
              >
                <span className="result-category">{item.category}</span>
                <span className="result-title">{item.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          className="message-input"
          placeholder="Talk to Zhou Xu..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button 
          className="send-btn"
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
        >
          <span>➤</span>
        </button>
      </div>
    </>
  );

  const renderMemoryView = () => (
    <div className="memory-view">
      <div className="memory-header">
        <h4>📜 Session Memory</h4>
        <p className="memory-subtitle">Manage your conversation history</p>
      </div>
      
      <div className="memory-status">
        {!isBackendAvailable && (
          <div className="backend-warning">
            ⚠️ Backend unavailable - Local mode only
          </div>
        )}
        
        {logsInfo && (
          <>
            <div className="status-item">
              <span className="status-label">Auto-Save:</span>
              <span className={`status-value ${logsInfo.hasAutoSave ? 'active' : 'inactive'}`}>
                {logsInfo.hasAutoSave ? '✓ Available' : '✗ None'}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Manual Saves:</span>
              <span className="status-value">{logsInfo.manualSaves.length}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Storage Used:</span>
              <span className="status-value">{logsInfo.totalSizeKb.toFixed(1)} KB</span>
            </div>
          </>
        )}
      </div>

      <div className="memory-actions">
        <button 
          className="memory-btn save-btn"
          onClick={handleSaveSession}
          disabled={!sessionId || !isBackendAvailable}
        >
          💾 Save Session
        </button>
        
        <button 
          className="memory-btn clear-btn"
          onClick={() => setShowSavePrompt(true)}
          disabled={!isBackendAvailable}
        >
          🗑️ Clear Logs
        </button>
      </div>

      {logsInfo && logsInfo.manualSaves.length > 0 && (
        <div className="saves-list">
          <h5>📁 Saved Sessions</h5>
          {logsInfo.manualSaves.slice(0, 5).map(save => (
            <button
              key={save}
              className="save-item"
              onClick={() => handleLoadSave(save)}
            >
              {save.replace('.json', '')}
            </button>
          ))}
        </div>
      )}

      {showSavePrompt && (
        <div className="save-prompt-overlay">
          <div className="save-prompt">
            <h4>⚠️ Clear Logs?</h4>
            <p>Would you like to save your session before clearing?</p>
            <div className="prompt-buttons">
              <button onClick={handleSaveSession}>Save First</button>
              <button onClick={() => handleClearLogs(true)}>Keep Auto-Save</button>
              <button onClick={() => handleClearLogs(false)}>Clear All</button>
              <button onClick={() => setShowSavePrompt(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTroubleshootView = () => (
    <div className="troubleshoot-view">
      <div className="troubleshoot-header">
        <h4>🔧 Troubleshooting</h4>
        <p className="troubleshoot-subtitle">Diagnostics & System Status</p>
      </div>

      <div className="connection-status">
        <div className={`status-indicator ${isBackendAvailable ? 'connected' : 'disconnected'}`}>
          {isBackendAvailable ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
        <span className="status-text">
          {isBackendAvailable ? 'Backend API online' : 'Using local fallback'}
        </span>
      </div>

      {diagnosticsData && (
        <div className="diagnostics-panel">
          <div className="diag-item">
            <span className="diag-label">System Status:</span>
            <span className={`diag-value ${diagnosticsData.status === 'healthy' ? 'good' : 'warning'}`}>
              {diagnosticsData.status}
            </span>
          </div>
          <div className="diag-item">
            <span className="diag-label">Logs Directory:</span>
            <span className="diag-value">{diagnosticsData.logs_exist ? '✓' : '✗'}</span>
          </div>
          <div className="diag-item">
            <span className="diag-label">Player Profiles:</span>
            <span className="diag-value">{diagnosticsData.player_count}</span>
          </div>
          <div className="diag-item">
            <span className="diag-label">Total Storage:</span>
            <span className="diag-value">{diagnosticsData.total_size_mb.toFixed(2)} MB</span>
          </div>

          {diagnosticsData.issues.length > 0 && (
            <div className="issues-section">
              <h5>⚠️ Issues</h5>
              <ul>
                {diagnosticsData.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {diagnosticsData.recommendations.length > 0 && (
            <div className="recommendations-section">
              <h5>💡 Recommendations</h5>
              <ul>
                {diagnosticsData.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="troubleshoot-actions">
        <button 
          className="troubleshoot-btn"
          onClick={loadDiagnostics}
        >
          🔄 Refresh Status
        </button>
        <button 
          className="troubleshoot-btn"
          onClick={async () => {
            try {
              await zhouXuService.runCleanup();
              loadDiagnostics();
            } catch (error) {
              console.error('Cleanup failed:', error);
            }
          }}
          disabled={!isBackendAvailable}
        >
          🧹 Run Cleanup
        </button>
      </div>

      <div className="help-links">
        <h5>📚 Help Resources</h5>
        <a href="#" onClick={(e) => { e.preventDefault(); onOpenFullHelp?.(); }}>
          Open Full Help Center
        </a>
      </div>
    </div>
  );

  return (
    <div className={`zhou-xu-widget ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Collapsed state - just portrait */}
      {!isExpanded && (
        <button 
          className="zhou-xu-portrait-btn"
          onClick={() => setIsExpanded(true)}
          aria-label="Open Divine Advisor Zhou Xu"
        >
          <div className="portrait-container">
            <div className={`portrait-image expression-${expression}`}>
              <span className="portrait-placeholder">周旭</span>
            </div>
            <div className="portrait-glow"></div>
          </div>
          <div className="portrait-badge">
            <span>?</span>
          </div>
        </button>
      )}

      {/* Expanded state - full chat widget */}
      {isExpanded && (
        <div className="zhou-xu-panel">
          {/* Header */}
          <div className="panel-header">
            <div className="header-portrait">
              <div className={`mini-portrait expression-${expression}`}>
                <span>周</span>
              </div>
            </div>
            <div className="header-info">
              <h3 className="advisor-name">Divine Advisor: Zhou Xu</h3>
              <span className="advisor-status">
                {isBackendAvailable ? 'Ready to assist' : 'Offline mode'}
              </span>
            </div>
            <div className="header-actions">
              {onOpenFullHelp && (
                <button 
                  className="header-btn expand-btn"
                  onClick={onOpenFullHelp}
                  title="Open Full Help"
                >
                  <span>📖</span>
                </button>
              )}
              <button 
                className="header-btn close-btn"
                onClick={() => setIsExpanded(false)}
                title="Minimize"
              >
                <span>−</span>
              </button>
            </div>
          </div>

          {/* View mode tabs */}
          <div className="view-tabs">
            <button 
              className={`tab-btn ${viewMode === 'chat' ? 'active' : ''}`}
              onClick={() => setViewMode('chat')}
            >
              💬 Chat
            </button>
            <button 
              className={`tab-btn ${viewMode === 'memory' ? 'active' : ''}`}
              onClick={() => setViewMode('memory')}
            >
              📜 Memory
            </button>
            <button 
              className={`tab-btn ${viewMode === 'troubleshoot' ? 'active' : ''}`}
              onClick={() => setViewMode('troubleshoot')}
            >
              🔧 Help
            </button>
          </div>

          {/* View content */}
          <div className="view-content">
            {viewMode === 'chat' && renderChatView()}
            {viewMode === 'memory' && renderMemoryView()}
            {viewMode === 'troubleshoot' && renderTroubleshootView()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ZhouXuWidget;
