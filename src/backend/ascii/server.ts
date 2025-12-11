import express from 'express';
import cors from 'cors';
import path from 'path';
import { composeScene } from './generator';

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files if needed
const staticDir = path.resolve(process.cwd(), 'frontend', 'dist');
app.use(express.static(staticDir));

/**
 * GET /scene
 * Returns a composed ASCII scene as text/plain
 * 
 * PoC: Returns a pre-configured scene with forest background and two characters
 * TODO: Accept query params or POST body to specify custom scene configurations
 * TODO: Connect to chat-tagging system for dynamic scene generation
 */
app.get('/scene', async (req, res) => {
  try {
    // PoC: Hardcoded scene spec showing forest with man and woman characters
    // Coordinates are tweaked to center the characters in the forest scene
    const spec = {
      background: 'forest',
      overlays: [
        // Place man slightly left of center
        { assetName: 'man', x: 15, y: 6, anchor: 'bottom-center' as const },
        // Place woman to the right
        { assetName: 'woman', x: 30, y: 6, anchor: 'bottom-center' as const },
      ],
    };
    const scene = await composeScene(spec);
    res.type('text/plain').send(scene);
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

/**
 * POST /scene
 * Accepts a custom scene specification and returns the composed ASCII
 * 
 * TODO: Implement this endpoint for dynamic scene composition
 * TODO: Add validation for scene spec
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

const PORT = process.env.ASCII_PORT || 3001;
app.listen(PORT, () => {
  console.log(`ASCII PoC server running at http://localhost:${PORT}`);
});
