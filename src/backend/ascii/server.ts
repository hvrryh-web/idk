import express from 'express';
import cors from 'cors';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { composeScene, listAssets } from './generator';
import { chatToSceneSpec } from './chat-tagger';

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files if needed
const staticDir = path.resolve(process.cwd(), 'frontend', 'dist');
app.use(express.static(staticDir));

// Create HTTP server
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

// Store connected clients
const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  clients.add(ws);

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('Received WebSocket message:', message);

      if (message.type === 'chat') {
        // Parse chat text and generate scene
        const spec = await chatToSceneSpec(message.text);
        const scene = await composeScene(spec);
        
        // Broadcast scene to all clients
        broadcastScene(scene, message.text);
      } else if (message.type === 'scene') {
        // Direct scene specification
        const scene = await composeScene(message.spec);
        ws.send(JSON.stringify({ type: 'scene', scene }));
      }
    } catch (err: any) {
      ws.send(JSON.stringify({ type: 'error', error: err.message }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
    clients.delete(ws);
  });
  
  // Send initial connection message
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'Connected to ASCII scene generator',
  }));
});

/**
 * Broadcast scene update to all connected clients
 */
function broadcastScene(scene: string, context?: string) {
  const message = JSON.stringify({
    type: 'scene',
    scene,
    context,
    timestamp: new Date().toISOString(),
  });
  
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

/**
 * GET /scene
 * Returns a composed ASCII scene as text/plain
 * 
 * Query params:
 * - chat: Chat text to parse for scene generation
 */
app.get('/scene', async (req, res) => {
  try {
    let spec;
    
    if (req.query.chat) {
      // Generate scene from chat text
      spec = await chatToSceneSpec(req.query.chat as string);
    } else {
      // Default PoC scene
      spec = {
        background: 'forest',
        overlays: [
          { assetName: 'man', x: 15, y: 6, anchor: 'bottom-center' as const },
          { assetName: 'woman', x: 30, y: 6, anchor: 'bottom-center' as const },
        ],
      };
    }
    
    const scene = await composeScene(spec);
    res.type('text/plain').send(scene);
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

/**
 * POST /scene
 * Accepts a custom scene specification and returns the composed ASCII
 */
app.post('/scene', async (req, res) => {
  try {
    const spec = req.body;
    // Basic validation
    if (!spec.background || !Array.isArray(spec.overlays)) {
      return res.status(400).json({ error: 'Invalid scene specification' });
    }
    const scene = await composeScene(spec);
    res.type('text/plain').send(scene);
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

/**
 * GET /assets
 * Lists available assets by type
 * 
 * Query params:
 * - type: Filter by asset type (background, character, effect)
 */
app.get('/assets', async (req, res) => {
  try {
    const type = req.query.type as string | undefined;
    const assets = await listAssets(type);
    res.json({ assets });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

/**
 * POST /chat
 * Parse chat text and generate scene
 */
app.post('/chat', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Missing chat text' });
    }
    
    const spec = await chatToSceneSpec(text);
    const scene = await composeScene(spec);
    
    // Broadcast to WebSocket clients
    broadcastScene(scene, text);
    
    res.json({ scene, spec });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

const PORT = process.env.ASCII_PORT || 3001;
server.listen(PORT, () => {
  console.log(`ASCII server running at http://localhost:${PORT}`);
  console.log(`WebSocket server running at ws://localhost:${PORT}/ws`);
});
