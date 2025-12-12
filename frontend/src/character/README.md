# Character Customization Module

This module implements the character appearance customization system for the WuXuxian TTRPG web application.

## Features

- **5 Customization Categories**: Hair, Eyes, Brows, Mouth, Outfit (each with ≥5 options)
- **Color Swatches**: Skin tones, hair colors, and fabric colors  
- **Base Models**: Male and female character bases
- **Live Preview**: Real-time canvas rendering with <50ms update target
- **Undo/Redo**: Full history support (up to 50 states)
- **Deterministic Randomizer**: Seed-based randomization for reproducibility
- **Export/Import**: JSON export/import and PNG export (full-body and portrait)
- **Data-Driven UI**: All options loaded from manifest (no hard-coded options)
- **ComfyUI Integration**: Asset generation pipeline using ComfyUI API

## Architecture

```
character/
├── CharacterCreatorPage.tsx       # Main page component
├── components/                    # UI components
│   ├── PreviewPane.tsx           # Canvas-based preview
│   ├── CategoryTabs.tsx          # Category navigation
│   ├── OptionGrid.tsx            # Option selection grid
│   └── SwatchPicker.tsx          # Color swatch picker
├── data/                         # Data models and types
│   ├── types.ts                  # TypeScript type definitions
│   ├── defaults.ts               # Default configurations
│   └── manifest.ts               # Manifest loader and validator
├── rendering/                    # Rendering engine
│   ├── compositor.ts             # Character compositing
│   └── layers.ts                 # Layer management
└── state/                        # State management
    └── useCharacterCreatorStore.ts  # Zustand store
```

## Usage

### Accessing the Character Creator

Navigate to `/character/create` in the application.

### Basic Operations

- **Select Base Model**: Choose male or female base character
- **Choose Category**: Click tabs to switch between Hair, Eyes, Brows, Mouth, Outfit
- **Select Option**: Click on an option to apply it
- **Change Colors**: Use swatch pickers to change skin, hair, and fabric colors
- **Randomize**: Generate random appearance
- **Undo/Redo**: Step backwards/forwards through history
- **Reset**: Return to default appearance
- **Export**: Save as PNG (full-body or portrait) or JSON
- **Import**: Load character from JSON file

### Data Model

Character appearances are stored as JSON objects:

```typescript
{
  "version": "1.0.0",
  "baseModel": "female",
  "selections": {
    "hair": "hair-001",
    "eyes": "eyes-001",
    "brows": "brows-001",
    "mouth": "mouth-001",
    "outfit": "outfit-001"
  },
  "swatches": {
    "skin": "skin-fair",
    "hair": "hair-black",
    "fabric": "fabric-jade"
  },
  "seed": 42  // Optional: for reproducible randomization
}
```

## Asset Management

### Asset Manifest

All customization options are defined in:
```
/public/assets/characters/asset_manifest.json
```

The manifest drives the UI - adding new options to the manifest makes them immediately available without code changes.

### Asset Structure

```
/public/assets/characters/
├── asset_manifest.json           # Manifest file
├── bases/                        # Base character models
│   ├── female_base_neutral.png
│   └── male_base_neutral.png
├── overlays/                     # Overlay layers
│   ├── hair/                     # Hair layers (front/back)
│   ├── eyes/                     # Eye overlays
│   ├── brows/                    # Eyebrow overlays
│   ├── mouth/                    # Expression overlays
│   └── outfit/                   # Outfit layers (inner/outer)
└── masks/                        # Optional: masks for recoloring
```

### Adding New Options

1. Generate assets using the ComfyUI pipeline (see `tools/comfyui/README.md`)
2. Add new entries to `asset_manifest.json`
3. Restart the frontend - new options will appear automatically

## ComfyUI Integration

The module includes a ComfyUI-driven asset generation pipeline. See:
- `tools/comfyui/README.md` - Complete pipeline documentation
- `tools/comfyui/asset_spec.yaml` - Asset generation specification
- `tools/comfyui/generate_assets.ts` - Asset generator script

## Rendering

### Layer Order

Layers are rendered in deterministic order:
1. Base body
2. Face base (optional)
3. Eyes
4. Brows
5. Mouth
6. Hair (back)
7. Outfit (inner)
8. Outfit (outer)
9. Accessories (future)
10. Hair (front)

### Color Tinting

Layers marked as `swatchApplicable` can be tinted with selected colors. The current implementation uses a simple multiply blend mode. For more sophisticated recoloring, provide mask images.

### Performance

- Target: <50ms per preview update
- Canvas-based rendering for performance
- Cached image loading
- Optimized layer composition

## State Management

The module uses Zustand for state management:

```typescript
const {
  manifest,           // Asset manifest
  appearance,         // Current appearance
  selectOption,       // Select an option
  selectSwatch,       // Select a color
  randomize,          // Randomize appearance
  undo, redo,         // History navigation
  exportAppearance,   // Export to JSON
  importAppearance,   // Import from JSON
} = useCharacterCreatorStore();
```

### Persistence

- **Auto-save**: Changes are automatically saved to localStorage
- **Export**: Manual export to JSON file
- **Import**: Load from exported JSON file

## Testing

Basic smoke tests:

```bash
cd frontend
npm test -- character
```

## Future Enhancements

- [ ] Mask-based recoloring (more sophisticated than tinting)
- [ ] Animation support (idle, talking, etc.)
- [ ] Additional customization categories (tattoos, scars, accessories)
- [ ] Social features (share characters, community presets)
- [ ] Advanced dependency/exclusion rules
- [ ] 3D preview option (using Three.js)
- [ ] Mobile-optimized interface

## Troubleshooting

### Preview Not Updating
- Check browser console for errors
- Verify asset_manifest.json is valid JSON
- Ensure all image paths in manifest point to existing files

### Missing Options
- Verify options are defined in asset_manifest.json
- Check that asset files exist in the specified paths
- Clear browser cache and refresh

### Performance Issues
- Reduce image sizes (target: <200KB per layer)
- Optimize images (use WebP format)
- Check for console warnings about slow renders

## References

- Design Doc: `docs/wuxiaxian-reference/` (system mechanics)
- ComfyUI Pipeline: `tools/comfyui/README.md`
- Asset Convention: `frontend/public/assets/README.md`
- Architecture: `ARCHITECTURE.md`
