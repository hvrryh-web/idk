import { useState } from "react";
import ChatRoom from "../components/ChatRoom";
import CharacterPanel from "../components/CharacterPanel";
import RoomList from "../components/RoomList";
import "../styles/GameScreen.css";

export default function GameScreen() {
  const [selectedRoom, setSelectedRoom] = useState<string>("main");

  return (
    <div className="game-screen">
      <aside className="game-sidebar">
        <RoomList onRoomSelect={setSelectedRoom} selectedRoom={selectedRoom} />
        <CharacterPanel />
      </aside>
      <main className="game-main">
        <section className="game-content">
          <ChatRoom roomId={selectedRoom} />
        </section>
        <footer className="combat-hud-area">
          <div className="combat-placeholder">
            Combat HUD (Phase 2)
          </div>
        </footer>
      </main>
    </div>
  );
}
