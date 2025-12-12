import React, { useState, useRef, useEffect } from 'react';
import './ZhouXuAdvisor.css';

// Types for the advisor system
interface AdvisorMessage {
  id: string;
  type: 'user' | 'advisor';
  text: string;
  timestamp: Date;
}

interface QuickHelpItem {
  id: string;
  title: string;
  category: string;
  keywords: string[];
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

// Advisor responses based on context
const getAdvisorResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('greet')) {
    return "Greetings, cultivator. I am Zhou Xu, your Divine Advisor. I am here to guide you through the intricacies of this world. What wisdom do you seek?";
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
    return "Of course! For new cultivators, I recommend starting with Character Creation, then understanding the Combat System basics. The wiki contains detailed articles on all mechanics. What aspect interests you most?";
  }
  
  if (lowerQuery.includes('thank')) {
    return "You honor me with your gratitude. Remember, the path of cultivation is long, but you do not walk it alone. I am always here to guide you.";
  }
  
  return "An intriguing question. Let me consider... I suggest consulting the relevant wiki article for detailed information. You may also use the search bar below to find specific topics. Is there a particular aspect I can clarify?";
};

interface ZhouXuWidgetProps {
  onOpenFullHelp?: () => void;
  onNavigateToArticle?: (articleId: string) => void;
}

/**
 * Zhou Xu Advisor Widget - Bottom-right overlay
 * Provides quick help access and chat functionality
 */
export const ZhouXuWidget: React.FC<ZhouXuWidgetProps> = ({ 
  onOpenFullHelp,
  onNavigateToArticle 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<AdvisorMessage[]>([
    {
      id: '1',
      type: 'advisor',
      text: "Greetings, cultivator. I am Zhou Xu, your Divine Advisor. How may I assist you on your journey?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<QuickHelpItem[]>([]);
  const [expression, setExpression] = useState<'welcoming' | 'explaining' | 'thinking' | 'pleased'>('welcoming');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: AdvisorMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setExpression('thinking');

    // Simulate advisor thinking
    setTimeout(() => {
      const response = getAdvisorResponse(inputValue);
      const advisorMessage: AdvisorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'advisor',
        text: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, advisorMessage]);
      setExpression('explaining');
      
      // Return to welcoming after response
      setTimeout(() => setExpression('welcoming'), 3000);
    }, 800);
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
              <span className="advisor-status">Ready to assist</span>
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
                </div>
              </div>
            ))}
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
              placeholder="Ask Zhou Xu..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <span>➤</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZhouXuWidget;
