/**
 * Game Engine Event API Integration
 * 
 * This module provides a bridge between the game engine and the ASCII scene generator.
 * It listens for game events and triggers scene updates accordingly.
 */

export type GameEvent = {
  type: 'scene_change' | 'character_enter' | 'character_exit' | 'effect_trigger' | 'chat_message';
  data: any;
  timestamp: string;
};

export type SceneUpdateHandler = (scene: string, event: GameEvent) => void;

/**
 * Event API client for game engine integration
 */
export class GameEngineEventAPI {
  private handlers: Set<SceneUpdateHandler> = new Set();
  private wsConnection: WebSocket | null = null;
  private serverUrl: string;

  constructor(serverUrl: string = 'ws://localhost:3001/ws') {
    this.serverUrl = serverUrl;
  }

  /**
   * Connect to the ASCII scene server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.wsConnection = new WebSocket(this.serverUrl);

        this.wsConnection.onopen = () => {
          console.log('Connected to ASCII scene server');
          resolve();
        };

        this.wsConnection.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.type === 'scene') {
              this.notifyHandlers(message.scene, {
                type: 'scene_change',
                data: message,
                timestamp: message.timestamp || new Date().toISOString(),
              });
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        this.wsConnection.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.wsConnection.onclose = () => {
          console.log('Disconnected from ASCII scene server');
          this.wsConnection = null;
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Disconnect from the server
   */
  disconnect() {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  /**
   * Register a handler for scene updates
   */
  onSceneUpdate(handler: SceneUpdateHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  /**
   * Notify all registered handlers
   */
  private notifyHandlers(scene: string, event: GameEvent) {
    this.handlers.forEach((handler) => handler(scene, event));
  }

  /**
   * Send a game event to generate a new scene
   */
  async sendGameEvent(event: GameEvent) {
    if (!this.wsConnection || this.wsConnection.readyState !== WebSocket.OPEN) {
      throw new Error('Not connected to server');
    }

    // Map game event to appropriate message type
    let message: any;

    if (event.type === 'chat_message' && event.data.text) {
      message = {
        type: 'chat',
        text: event.data.text,
      };
    } else if (event.type === 'scene_change' && event.data.spec) {
      message = {
        type: 'scene',
        spec: event.data.spec,
      };
    } else {
      // Convert other game events to chat-like messages
      message = {
        type: 'chat',
        text: this.gameEventToText(event),
      };
    }

    this.wsConnection.send(JSON.stringify(message));
  }

  /**
   * Convert game event to text that can be parsed by chat tagger
   */
  private gameEventToText(event: GameEvent): string {
    switch (event.type) {
      case 'character_enter':
        return `${event.data.character} enters the ${event.data.location || 'scene'}`;
      case 'character_exit':
        return `${event.data.character} leaves`;
      case 'effect_trigger':
        return `${event.data.effect} appears`;
      default:
        return event.data.description || '';
    }
  }

  /**
   * Request a scene update based on current game state
   */
  async requestSceneUpdate(gameState: {
    location?: string;
    characters?: string[];
    effects?: string[];
  }) {
    // Build a text description from game state
    const parts: string[] = [];
    
    if (gameState.location) {
      parts.push(gameState.location);
    }
    
    if (gameState.characters && gameState.characters.length > 0) {
      parts.push(gameState.characters.join(', '));
    }
    
    if (gameState.effects && gameState.effects.length > 0) {
      parts.push(gameState.effects.join(', '));
    }
    
    const text = parts.join('. ');
    
    await this.sendGameEvent({
      type: 'chat_message',
      data: { text },
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Example usage:
 * 
 * const api = new GameEngineEventAPI();
 * await api.connect();
 * 
 * api.onSceneUpdate((scene, event) => {
 *   console.log('New scene:', scene);
 *   // Update game UI with new ASCII scene
 * });
 * 
 * api.sendGameEvent({
 *   type: 'character_enter',
 *   data: { character: 'cultivator', location: 'temple' },
 *   timestamp: new Date().toISOString(),
 * });
 */
