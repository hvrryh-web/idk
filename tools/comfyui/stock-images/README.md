# Stock Image & Placeholder Asset System

This directory contains the stock image call tools and placeholder assets for the WuXuxian TTRPG.

## Overview

The stock image system provides:
1. **Placeholder Assets** - Pre-generated Xianxia-themed images for immediate use
2. **Stock Image API** - Backend service to fetch/manage stock images
3. **ComfyUI Integration** - Tools to generate new assets via ComfyUI pipelines

## Directory Structure

```
stock-images/
├── README.md                 # This file
├── manifest.json             # Asset manifest with metadata
├── categories/
│   ├── characters/           # Character portraits & poses
│   │   ├── cultivators/      # Martial artists, cultivators
│   │   ├── npcs/             # Generic NPCs
│   │   └── advisors/         # Advisor characters (like Zhou Xu)
│   ├── backgrounds/          # Scene backgrounds
│   │   ├── landscapes/       # Mountains, rivers, forests
│   │   ├── cities/           # Town and city scenes
│   │   └── interiors/        # Buildings, rooms, temples
│   ├── items/                # Equipment and objects
│   │   ├── weapons/          # Swords, staffs, etc.
│   │   ├── artifacts/        # Magical items
│   │   └── scrolls/          # Documents, scrolls
│   ├── effects/              # Visual effects
│   │   ├── qi-auras/         # Cultivation energy effects
│   │   ├── elements/         # Fire, ice, lightning, etc.
│   │   └── particles/        # Sparkles, motes, trails
│   └── ui/                   # UI elements
│       ├── frames/           # Decorative frames
│       ├── buttons/          # Button assets
│       └── panels/           # UI panels
└── thumbnails/               # Thumbnail previews
```

## Usage

### Frontend Integration

```typescript
import { getStockImage, getRandomStockImage } from '@/services/stockImageService';

// Get a specific stock image
const image = await getStockImage('characters', 'cultivators', 'male-warrior-01');

// Get a random image from a category
const randomBg = await getRandomStockImage('backgrounds', 'landscapes');
```

### Backend API

```bash
# List available categories
GET /api/v1/stock-images/categories

# List images in a category
GET /api/v1/stock-images/list/{category}/{subcategory}

# Get image metadata
GET /api/v1/stock-images/info/{image_id}

# Get random image
GET /api/v1/stock-images/random/{category}/{subcategory}
```

### ComfyUI Generation

```bash
# Generate new stock image via ComfyUI
POST /api/v1/stock-images/generate
{
  "category": "characters",
  "subcategory": "cultivators",
  "prompt": "male cultivator, sword martial artist",
  "style": "xianxia",
  "seed": 42
}
```

## Asset Manifest Format

```json
{
  "version": "1.0.0",
  "last_updated": "2024-12-13",
  "categories": {
    "characters": {
      "cultivators": [
        {
          "id": "male-warrior-01",
          "name": "Male Sword Cultivator",
          "filename": "male_warrior_01.png",
          "tags": ["male", "sword", "warrior", "cultivation"],
          "style": "xianxia",
          "dimensions": { "width": 512, "height": 768 },
          "license": "generated",
          "comfyui_seed": 42
        }
      ]
    }
  }
}
```

## Placeholder Generation

Placeholders are SVG-based images that can be used before actual assets are generated:

```typescript
// Generate a placeholder
const placeholder = generatePlaceholder({
  type: 'character',
  width: 512,
  height: 768,
  label: 'Male Cultivator',
  style: 'xianxia'
});
```

## License & Attribution

- **Generated Assets**: AI-generated images for use within the WuXuxian project
- **Stock Images**: Ensure proper licensing for any external stock images
- **Placeholders**: Project-owned SVG placeholders
