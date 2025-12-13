import { useCallback, useEffect, useState } from "react";
import ChatRoom from "../components/ChatRoom";
import DiceTray from "../components/DiceTray";
import CharacterPanel from "../components/CharacterPanel";
import RoomList from "../components/RoomList";
import TvAsciiPanel from "../components/TvAsciiPanel";
import { fetchAsciiArt } from "../api";
import "../styles/GameScreen.css";

export default function GameScreen() {
  const [selectedRoom, setSelectedRoom] = useState<string>("main");
  const [asciiArt, setAsciiArt] = useState("");
  const [asciiError, setAsciiError] = useState<string | null>(null);
  const [loadingArt, setLoadingArt] = useState(false);

  const refreshAsciiArt = useCallback(async () => {
    setLoadingArt(true);
    setAsciiError(null);
    try {
      const result = await fetchAsciiArt();
      setAsciiArt(result.art || "");
    } catch (error) {
      console.error("Failed to fetch ASCII art", error);
      setAsciiError("Unable to fetch ASCII art. Try swapping again.");
    } finally {
      setLoadingArt(false);
    }
  }, []);

  useEffect(() => {
    refreshAsciiArt();
  }, [refreshAsciiArt]);

  return (
    <div className="game-screen" style={{background: 'var(--parchment)', borderRadius: '18px', boxShadow: '0 4px 24px rgba(124,63,0,0.08)', border: '6px solid #c9b18a', fontFamily: 'Cinzel, serif', color: '#3a2c13', padding: '2rem', margin: '2rem 0'}}>
      <aside className="game-sidebar">
        <RoomList onRoomSelect={setSelectedRoom} selectedRoom={selectedRoom} />
        <CharacterPanel />
      </aside>
      <main className="game-main">
        <section className="game-content">
          <div className="game-panels">
            <div style={{display: 'flex', gap: '2rem', alignItems: 'flex-start'}}>
              <div className="chat-panel">
                <ChatRoom roomId={selectedRoom} />
              </div>
              <DiceTray />
            </div>
            <TvAsciiPanel
              asciiArt={asciiArt}
              onRefresh={refreshAsciiArt}
              loading={loadingArt}
              error={asciiError}
            />
          </div>
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
