import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { composeScene, listAssets, preloadCommonAssets, getCacheStats } from './generator';
import { chatToSceneSpec } from './chat-tagger';
import { validateSceneSpec, generateQualityReport } from './validator';
import { ImageToASCIIConverter, PALETTES, type ImageToASCIIConfig } from './image-to-ascii';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Configure multer for file uploads
const upload = multer({
  dest: '/tmp/uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Initialize image-to-ASCII converter
const asciiConverter = new ImageToASCIIConverter();

// Serve static frontend files if needed
const staticDir = path.resolve(process.cwd(), 'frontend', 'dist');
app.use(express.static(staticDir));

// Preload common assets on startup
preloadCommonAssets().then(() => {
  console.log('Asset cache initialized');
});

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
    
    // Validate scene spec
    const validation = await validateSceneSpec(spec);
    if (!validation.valid) {
      return res.status(400).json({ error: 'Invalid scene specification', details: validation.errors });
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

/**
 * GET /cache/stats
 * Get cache statistics
 */
app.get('/cache/stats', (req, res) => {
  const stats = getCacheStats();
  res.json(stats);
});

/**
 * GET /quality-report
 * Get asset quality report
 */
app.get('/quality-report', async (req, res) => {
  try {
    const report = await generateQualityReport();
    res.type('text/plain').send(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

/**
 * POST /image-to-ascii
 * Convert uploaded image to ASCII art
 */
app.post('/image-to-ascii', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const config: ImageToASCIIConfig = {
      width: parseInt(req.body.width) || 80,
      height: req.body.height ? parseInt(req.body.height) : undefined,
      palette: req.body.palette || PALETTES.balanced,
      invert: req.body.invert === 'true',
      algorithm: req.body.algorithm || 'brightness',
      contrast: parseFloat(req.body.contrast) || 0,
      brightness: parseFloat(req.body.brightness) || 0,
    };
    
    const result = await asciiConverter.convertImage(req.file.path, config);
    
    // Clean up uploaded file
    try {
      const fs = await import('fs/promises');
      await fs.unlink(req.file.path);
    } catch (err) {
      console.warn('Failed to clean up uploaded file:', err);
    }
    
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

/**
 * POST /image-to-ascii/url
 * Convert image from URL to ASCII art
 */
app.post('/image-to-ascii/url', async (req, res) => {
  try {
    const { url, ...configParams } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'No URL provided' });
    }
    
    const config: ImageToASCIIConfig = {
      width: configParams.width || 80,
      height: configParams.height,
      palette: configParams.palette || PALETTES.balanced,
      invert: configParams.invert || false,
      algorithm: configParams.algorithm || 'brightness',
      contrast: configParams.contrast || 0,
      brightness: configParams.brightness || 0,
    };
    
    const result = await asciiConverter.convertURL(url, config);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

/**
 * POST /image-to-ascii/base64
 * Convert base64 image to ASCII art
 */
app.post('/image-to-ascii/base64', async (req, res) => {
  try {
    const { base64, ...configParams } = req.body;
    
    if (!base64) {
      return res.status(400).json({ error: 'No base64 data provided' });
    }
    
    const config: ImageToASCIIConfig = {
      width: configParams.width || 80,
      height: configParams.height,
      palette: configParams.palette || PALETTES.balanced,
      invert: configParams.invert || false,
      algorithm: configParams.algorithm || 'brightness',
      contrast: configParams.contrast || 0,
      brightness: configParams.brightness || 0,
    };
    
    const result = await asciiConverter.convertBase64(base64, config);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

/**
 * GET /palettes
 * List available character palettes
 */
app.get('/palettes', (req, res) => {
  res.json({
    palettes: Object.keys(PALETTES).map(name => ({
      name,
      characters: (PALETTES as any)[name],
      length: (PALETTES as any)[name].length,
    })),
  });
});

const PORT = process.env.ASCII_PORT || 3001;
server.listen(PORT, () => {
  console.log(`ASCII server running at http://localhost:${PORT}`);
  console.log(`WebSocket server running at ws://localhost:${PORT}/ws`);
  console.log(`Image-to-ASCII endpoints available`);
});
