import React, { useState } from 'react';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';

export default function GameScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);

  const scenes = [
    {
      title: 'Prologue: The Awakening',
      description: 'You stand at the threshold of the cultivation world, sensing the flow of aether for the first time...',
      image: null, // Placeholder for future background images
    },
    {
      title: 'Chapter 1: First Steps',
      description: 'The ancient scrolls reveal the path of the Low-Sequence cultivator...',
      image: null,
    },
  ];

  return (
    <div className="game-screen">
      <div className="screen-border">
        <div className="screen-inner">
          <div className="screen-content">
            {/* CRT TV Effect Overlay */}
            <div className="crt-overlay"></div>
            
            {/* Game Scene Content */}
            <div className="scene-container">
              <div className="scene-background">
                {/* Placeholder for scene background - will show gradient for now */}
                <div className="scene-gradient"></div>
              </div>
              
              <div className="scene-text-box">
                <h2 className="scene-title">{scenes[currentScene].title}</h2>
                <p className="scene-description">{scenes[currentScene].description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="game-controls">
        <button
          className="control-btn"
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button
          className="control-btn"
          onClick={() => setCurrentScene((currentScene + 1) % scenes.length)}
          title="Next Scene"
        >
          <SkipForward size={20} />
        </button>
        
        <div className="volume-control">
          <Volume2 size={20} />
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="70"
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
}
