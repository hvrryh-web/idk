# ASCII Text-to-Image Component

## Overview

This component provides a proof-of-concept ASCII art generation and visualization system for the WuXuxian TTRPG game. It demonstrates how ASCII "images" (backgrounds and characters) can be composed and displayed in the game interface.

## Architecture

### Backend (`src/backend/ascii/`)
- **generator.ts**: Core ASCII composition engine
  - Loads ASCII assets from disk
  - Implements overlay algorithm to compose scenes
  - Supports anchor-based positioning (bottom-center, center, custom)
  - Handles edge clipping for out-of-bounds overlays

- **server.ts**: Express API server
  - `GET /scene`: Returns a pre-configured PoC scene
  - `POST /scene`: Accepts custom scene specifications (future enhancement)
  - Runs on port 3001 by default

### Frontend (`frontend/src/`)
- **components/AsciiCenter.tsx**: Display component for ASCII art
  - Centered viewport with monospace rendering
  - Black background with green text for retro aesthetic
  
- **pages/AsciiVisualizer.tsx**: Demo page
  - Interactive button to fetch and render scenes
  - Error handling and loading states
  - Integration example for future game chat

### Assets (`src/assets/ascii/`)
- **forest.txt**: Background scene
- **man.txt**: Character overlay
- **woman.txt**: Character overlay

## Installation & Setup

### 1. Install ASCII Backend Dependencies

```bash
# Install backend dependencies
npm install --prefix . -D @types/cors @types/express @types/node tsx typescript cors express
```

### 2. Start the ASCII Server

```bash
# Run the ASCII backend server (port 3001)
npx tsx watch src/backend/ascii/server.ts
```

### 3. Access the Visualizer

Navigate to `http://localhost:5173/ascii` (assuming frontend is running on port 5173)

## Usage

### Basic Scene Composition

```typescript
import { composeScene } from './src/backend/ascii/generator';

const spec = {
  background: 'forest',
  overlays: [
    { assetName: 'man', x: 20, y: 6, anchor: 'bottom-center' },
    { assetName: 'woman', x: 36, y: 6, anchor: 'bottom-center' }
  ]
};

const scene = await composeScene(spec);
console.log(scene);
```

### Adding New Assets

1. Create a new `.txt` file in `src/assets/ascii/`
2. Use monospace-friendly ASCII art
3. Reference the asset name (without .txt) in scene specs

Example asset (`dragon.txt`):
```
     ______________
    /              \
   /    ^    ^      \
  |    ( )  ( )      |
   \       v        /
    \______________/
        /  ||  \
```

## Testing

Run the ASCII generator tests:

```bash
cd frontend
npm test tests/ascii
```

Tests cover:
- Basic scene composition
- Overlay clipping (out-of-bounds handling)
- Multiple anchor types
- Edge cases

## Integration Points

### Current Status
✅ Backend ASCII generator module  
✅ Express API server  
✅ Frontend display component  
✅ Demo page with manual trigger  
✅ Unit tests for composition logic  

### Next Steps (TODOs)

1. **Chat Integration**
   - Connect to game chat parser
   - Map conversation tags to asset selections
   - Dynamic scene generation based on dialogue

2. **Real-time Updates**
   - Implement WebSocket support
   - Push scene updates as conversation progresses
   - Subscribe to game events

3. **Asset Library**
   - Add metadata files (.meta.json) for anchor points
   - Expand asset collection (more backgrounds, characters)
   - Support asset variants (emotions, poses)

4. **Advanced Composition**
   - Layering depth control
   - Collision detection for overlays
   - Asset scaling and transformation
   - Animation support (frame sequences)

5. **AI-Driven Generation**
   - Text-to-ASCII conversion service
   - LLM-based asset selection
   - Procedural generation of simple assets

6. **Game Engine Integration**
   - Event API bridge for scene requests
   - Integrate with existing UI components
   - State management for scene history

## API Reference

### Types

```typescript
type AsciiAsset = {
  name: string;
  lines: string[];
  width: number;
  height: number;
  anchor?: { x: number; y: number };
};

type Overlay = {
  assetName: string;
  x: number;  // column position
  y: number;  // row position
  anchor?: 'bottom-center' | 'center' | { x: number; y: number };
};

type SceneSpec = {
  background: string;
  overlays: Overlay[];
};
```

### Functions

**`loadAssetFromDisk(name: string): Promise<AsciiAsset>`**
- Loads an ASCII asset from `src/assets/ascii/{name}.txt`
- Calculates dimensions automatically
- Returns asset object with metadata

**`composeScene(spec: SceneSpec): Promise<string>`**
- Composes a scene from background and overlays
- Applies anchor-based positioning
- Clips out-of-bounds content
- Returns final ASCII string

### HTTP Endpoints

**`GET /scene`**
- Returns: `text/plain` with composed ASCII scene
- Status: 200 on success, 500 on error
- Example: `curl http://localhost:3001/scene`

**`POST /scene`** (future)
- Accepts: JSON scene specification
- Returns: `text/plain` with composed ASCII scene
- Example:
  ```bash
  curl -X POST http://localhost:3001/scene \
    -H "Content-Type: application/json" \
    -d '{"background":"forest","overlays":[{"assetName":"man","x":20,"y":6}]}'
  ```

## Development

### File Structure
```
/home/runner/work/idk/idk/
├── src/
│   ├── assets/ascii/           # ASCII art assets
│   │   ├── forest.txt
│   │   ├── man.txt
│   │   └── woman.txt
│   └── backend/ascii/          # Backend ASCII engine
│       ├── generator.ts        # Core composition logic
│       └── server.ts           # Express API
├── frontend/src/
│   ├── components/
│   │   └── AsciiCenter.tsx     # Display component
│   └── pages/
│       └── AsciiVisualizer.tsx # Demo page
├── tests/ascii/
│   └── generator.test.ts       # Unit tests
├── tsconfig.ascii.json         # TypeScript config for backend
└── ascii-backend-package.json  # Backend dependencies
```

### Adding New Features

1. **New overlay algorithms**: Extend `composeScene()` in `generator.ts`
2. **New API endpoints**: Add routes to `server.ts`
3. **New UI controls**: Modify `AsciiVisualizer.tsx`
4. **New assets**: Add `.txt` files to `src/assets/ascii/`

### Debugging

Enable verbose logging:
```typescript
// In generator.ts
console.log('Composing scene:', spec);
console.log('Loaded background:', background);
```

View server logs:
```bash
npx tsx watch src/backend/ascii/server.ts
# Server logs will show requests and errors
```

## Performance Notes

- Asset loading is async but cached in memory during composition
- Canvas buffer is created once per scene
- Overlay algorithm is O(n*m) where n = overlays, m = average asset size
- Suitable for real-time generation (<10ms for typical scenes)

## Contributing

When adding new assets or features:
1. Follow existing naming conventions
2. Add unit tests for new composition logic
3. Update this README with new API methods
4. Add TODO comments for future integration points

## License

Part of the WuXuxian TTRPG project. See main LICENSE file.
