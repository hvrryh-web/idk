import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system' | 'npc';
  timestamp: Date;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to WuXuxian TTRPG! The cultivation journey begins...',
      sender: 'system',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate NPC response after a delay
    setTimeout(() => {
      const npcMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Your message echoes through the cultivation realm...',
        sender: 'npc',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, npcMessage]);
    }, 1000);
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h3>Cultivation Chronicle</h3>
        <span className="chat-status">Connected</span>
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`chat-message chat-message-${message.sender}`}>
            <div className="message-content">
              <span className="message-text">{message.text}</span>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="chat-send-btn" disabled={!inputValue.trim()}>
          <Send size={20} strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}
