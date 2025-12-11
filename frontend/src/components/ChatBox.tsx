import { useState, useRef, useEffect } from 'react';

type Message = {
  id: number;
  sender: string;
  type: "system" | "player";
  text: string;
};

const initialMessages: Message[] = [
  { id: 1, sender: "Lu Bu", type: "system", text: "Lu Bu has entered the war room." },
  { id: 2, sender: "Diao Chan", type: "player", text: "Diao Chan: The moon is beautiful tonight." },
  { id: 3, sender: "System", type: "system", text: "Battle begins!" },
  { id: 4, sender: "Lu Bu", type: "player", text: "Lu Bu: Who dares challenge me?" },
  { id: 5, sender: "Guan Yu", type: "player", text: "Guan Yu: Our honor demands it!" },
];

type Tab = {
  label: string;
  filter: (msg: Message) => boolean;
};

const tabs: Tab[] = [
  { label: "All", filter: (_msg: Message) => true },
  { label: "System", filter: (msg: Message) => msg.type === "system" },
  { label: "Player", filter: (msg: Message) => msg.type === "player" },
  { label: "Lu Bu", filter: (msg: Message) => msg.sender === "Lu Bu" },
  { label: "Diao Chan", filter: (msg: Message) => msg.sender === "Diao Chan" },
];

function getMessageBg(type: "system" | "player", sender: string): string {
  if (type === "system") return 'linear-gradient(90deg, #e6d3b3 0%, #c9b18a 100%)';
  if (sender === "Lu Bu") return 'linear-gradient(90deg, #d4af37 0%, #7c3f00 100%)';
  if (sender === "Diao Chan") return 'linear-gradient(90deg, #eae2d6 0%, #c9b18a 100%)';
  return '#f8f5ef';
}

function getMessageBorder(type: "system" | "player", sender: string): string {
  if (type === "system") return '2px solid #7c3f00';
  if (sender === "Lu Bu") return '2px solid #d4af37';
  if (sender === "Diao Chan") return '2px solid #c9b18a';
  return '2px solid #c9b18a';
}

export default function ChatBox() {
  const [history, setHistory] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]);
  const [metaResources, setMetaResources] = useState([
    { name: "Fate", icon: "🔮", count: 3 },
    { name: "Spirit", icon: "🀄", count: 2 },
    { name: "Destiny", icon: "⚡", count: 1 },
  ]);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = () => {
    if (input.trim()) {
      let resourceText = "";
      let updatedResources = metaResources;
      if (selectedResource) {
        const idx = metaResources.findIndex(r => r.name === selectedResource);
        if (idx !== -1 && metaResources[idx].count > 0) {
          resourceText = ` [${metaResources[idx].icon} ${metaResources[idx].name} expended]`;
          updatedResources = metaResources.map((r, i) => i === idx ? { ...r, count: r.count - 1 } : r);
        }
      }
      setHistory([
        ...history,
        {
          id: history.length + 1,
          sender: "You",
          type: "player",
          text: `You: ${input}${resourceText}`,
        },
      ]);
      setMetaResources(updatedResources);
      setInput("");
      setSelectedResource(null);
    }
  };

  return (
    <div className="chat-box" style={{background: 'var(--parchment)', borderRadius: '14px', boxShadow: '0 2px 12px rgba(124,63,0,0.08)', border: '4px solid #c9b18a', fontFamily: 'Cinzel, serif', color: '#3a2c13', padding: '1rem', margin: '1rem 0', position: 'relative', maxWidth: '480px'}}>
      {/* Chat History Panel */}
      <div className="chat-history-panel" style={{marginBottom: '1rem', background: '#eae2d6', borderRadius: '10px', boxShadow: '0 2px 8px rgba(124,63,0,0.06)', padding: '0.5rem 1rem'}}>
        <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
          {tabs.map(tab => (
            <button
              key={tab.label}
              onClick={() => setSelectedTab(tab)}
              style={{background: selectedTab.label === tab.label ? '#7c3f00' : '#c9b18a', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.75rem', fontWeight: 600, cursor: 'pointer'}}
            >{tab.label}</button>
          ))}
        </div>
        <div style={{maxHeight: '120px', overflowY: 'auto'}}>
          {history.filter(selectedTab.filter).slice(-8).map(msg => (
            <div key={msg.id} style={{marginBottom: '0.25rem', fontSize: '0.95rem', background: getMessageBg(msg.type, msg.sender), border: getMessageBorder(msg.type, msg.sender), borderRadius: '8px', padding: '0.5rem 0.75rem', boxShadow: '0 1px 4px rgba(124,63,0,0.06)', display: 'flex', alignItems: 'center'}}>
              <span style={{color: msg.type === 'system' ? '#7c3f00' : msg.sender === 'Lu Bu' ? '#d4af37' : msg.sender === 'Diao Chan' ? '#7c3f00' : '#3a2c13', fontWeight: msg.type === 'system' ? 600 : 400}}>{msg.text}</span>
              {msg.type === 'system' && <span style={{marginLeft: '0.5rem', fontSize: '0.85rem', color: '#7c3f00'}}>🀄</span>}
              {msg.sender === 'Lu Bu' && <span style={{marginLeft: '0.5rem', fontSize: '1.1rem', color: '#d4af37'}}>⚔️</span>}
              {msg.sender === 'Diao Chan' && <span style={{marginLeft: '0.5rem', fontSize: '1.1rem', color: '#c9b18a'}}>🌸</span>}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Meta Resources Selector */}
      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', justifyContent: 'center'}}>
        {metaResources.map(r => (
          <button
            key={r.name}
            disabled={r.count === 0}
            onClick={() => setSelectedResource(r.name === selectedResource ? null : r.name)}
            style={{
              background: r.name === selectedResource ? '#7c3f00' : '#c9b18a',
              color: r.count === 0 ? '#bbb' : '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.25rem 0.75rem',
              fontWeight: 600,
              fontSize: '1.1rem',
              cursor: r.count === 0 ? 'not-allowed' : 'pointer',
              opacity: r.count === 0 ? 0.5 : 1,
              minWidth: '60px',
            }}
            title={r.count === 0 ? `${r.name} (none left)` : `${r.name}: ${r.count} left`}
          >{r.icon} {r.name} ({r.count})</button>
        ))}
      </div>
      {/* Message Input */}
      <div style={{display: 'flex', gap: '0.5rem'}}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{flex: 1, borderRadius: '6px', border: '2px solid #c9b18a', padding: '0.5rem', fontFamily: 'Cinzel, serif', fontSize: '1rem'}}
        />
        <button
          onClick={handleSend}
          style={{background: 'var(--imperial-gold)', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', fontWeight: 600, cursor: 'pointer'}}
        >Send</button>
      </div>
    </div>
  );
}
