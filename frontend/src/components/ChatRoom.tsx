import { useState, useEffect } from "react";
import "../styles/ChatRoom.css";

interface Message {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface ChatRoomProps {
  roomId: string;
}

export default function ChatRoom({ roomId }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API call and socket subscription
    // For now, show placeholder messages
    setMessages([
      {
        id: "1",
        author: "System",
        text: `Welcome to ${roomId} room!`,
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        author: "System",
        text: "Chat functionality will be implemented in Phase 1.",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [roomId]);

  const handleSend = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/rooms/${roomId}/messages`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ text }),
      // });

      // Optimistic update
      const newMessage: Message = {
        id: Date.now().toString(),
        author: "You",
        text: text,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h2>Room: {roomId}</h2>
      </div>
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <span className="message-author">{msg.author}:</span>
            <span className="message-text">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading || !text.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
