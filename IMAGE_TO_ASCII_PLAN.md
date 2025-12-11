# Image-to-ASCII Art System - Research & Implementation Plan

## Executive Summary

Transform the current manual ASCII asset system into an automated image-to-ASCII art generation system capable of converting images, using ML/DL models, and generating ASCII art from text prompts.

## Reference Analysis

### Example: High-Resolution ASCII Art
Reference: https://ianparberry.com/art/ascii/shader/hires/ASCII-ukiyowaves2048-gray.png

**Key Observations:**
1. **Brightness Mapping**: Uses character density to represent brightness
2. **High Resolution**: 2048px equivalent detail in ASCII characters
3. **Grayscale Conversion**: Original image converted to grayscale
4. **Character Palette**: Dense (@, #, $) to sparse (., ,, space)
5. **Fixed-Width Font**: Monospace rendering essential
6. **Aspect Ratio Correction**: Character height/width ratio considered

## Current System Limitations

### Manual Asset Creation
- ❌ Requires hand-crafting every asset
- ❌ Limited scalability
- ❌ Inconsistent quality
- ❌ Time-consuming updates
- ❌ No dynamic generation

### Static Asset Library
- ❌ Fixed set of 56 pre-made assets
- ❌ Cannot adapt to new content
- ❌ Limited variety and customization
- ❌ Memory intensive (all assets preloaded)

## Proposed Architecture

### Core Components

#### 1. Image-to-ASCII Converter (Foundation)
```typescript
interface ImageToASCIIConfig {
  width: number;           // Output width in characters
  height?: number;         // Output height (auto-calculated if not provided)
  characters: string;      // Character palette (dense to sparse)
  invert: boolean;         // Invert brightness mapping
  algorithm: 'brightness' | 'edge-detection' | 'dithering' | 'ml-enhanced';
}

class ImageToASCIIConverter {
  async convertImage(
    imageData: Buffer | string,
    config: ImageToASCIIConfig
  ): Promise<string>;
  
  async convertURL(url: string, config: ImageToASCIIConfig): Promise<string>;
  
  async convertBase64(
    base64: string,
    config: ImageToASCIIConfig
  ): Promise<string>;
}
```

#### 2. Character Palette System
```typescript
const PALETTES = {
  // Standard palette (10 levels)
  standard: '@%#*+=-:. ',
  
  // Extended palette (70 levels) - from reference
  extended: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
  
  // Block elements palette
  blocks: '█▓▒░ ',
  
  // Custom game palette
  game: '▓▒░.:- ',
  
  // High contrast
  highContrast: '█▄▀ ',
};
```

#### 3. ML/DL Enhancement Layer
```typescript
interface MLASCIIModel {
  name: string;
  type: 'gan' | 'transformer' | 'diffusion';
  
  // Generate ASCII from text prompt
  generateFromPrompt(prompt: string, config: Config): Promise<string>;
  
  // Enhance existing ASCII art
  enhance(asciiArt: string, config: Config): Promise<string>;
  
  // Style transfer to ASCII
  applyStyle(asciiArt: string, styleRef: string): Promise<string>;
}
```

#### 4. Real-time Processing Pipeline
```typescript
interface ASCIIPipeline {
  // Process image through multiple stages
  stages: Array<{
    name: string;
    processor: (input: ImageData) => ImageData;
  }>;
  
  // Pre-processing
  preprocess: {
    resize: boolean;
    grayscale: boolean;
    contrast: number;
    brightness: number;
    edgeDetection: boolean;
  };
  
  // Post-processing
  postprocess: {
    smoothing: boolean;
    denoise: boolean;
    sharpen: boolean;
  };
}
```

## Implementation Phases

### Phase 1: Foundation (Current Sprint)
**Duration:** 2-3 days
**Goal:** Basic image-to-ASCII conversion

**Deliverables:**
1. ✅ Brightness-based converter
2. ✅ Character palette system
3. ✅ Aspect ratio correction
4. ✅ Grayscale conversion
5. ✅ Basic API endpoint
6. ✅ Test suite

**Technologies:**
- `sharp` - High-performance image processing
- `jimp` - Pure JavaScript image manipulation
- Canvas API for browser-side processing

**Example Code:**
```typescript
import sharp from 'sharp';

async function imageToASCII(
  imagePath: string,
  width: number = 80,
  palette: string = PALETTES.extended
): Promise<string> {
  // Load and process image
  const image = sharp(imagePath);
  const metadata = await image.metadata();
  
  // Calculate height maintaining aspect ratio
  // Character aspect ratio: typically 2:1 (height:width)
  const aspectRatio = (metadata.height! / metadata.width!) * 0.5;
  const height = Math.floor(width * aspectRatio);
  
  // Resize and convert to grayscale
  const { data, info } = await image
    .resize(width, height, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  // Map pixels to characters
  const ascii: string[] = [];
  for (let y = 0; y < info.height; y++) {
    let line = '';
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const brightness = data[idx]; // 0-255
      
      // Map brightness to character
      const charIdx = Math.floor(
        (brightness / 255) * (palette.length - 1)
      );
      line += palette[charIdx];
    }
    ascii.push(line);
  }
  
  return ascii.join('\n');
}
```

### Phase 2: Advanced Algorithms (Week 2)
**Goal:** Enhanced conversion quality

**Deliverables:**
1. Edge detection integration
2. Dithering algorithms (Floyd-Steinberg)
3. Multi-pass processing
4. Color-to-ASCII support (ANSI colors)
5. Batch processing

**Algorithms:**

**Edge Detection:**
```typescript
function sobelEdgeDetection(image: ImageData): ImageData {
  const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  const sobelY = [[1, 2, 1], [0, 0, 0], [-1, -2, -1]];
  
  // Apply Sobel operator
  // Use edge strength to select character density
  // ...
}
```

**Floyd-Steinberg Dithering:**
```typescript
function floydSteinbergDither(
  image: ImageData,
  palette: string
): ImageData {
  // Distribute quantization error to neighboring pixels
  // Produces more detailed ASCII art
  // ...
}
```

### Phase 3: ML/DL Integration (Week 3-4)
**Goal:** AI-powered ASCII generation

**Approaches:**

#### 3.1 Pre-trained Models
```typescript
// Use existing ML models
import { pipeline } from '@huggingface/transformers';

const generator = await pipeline(
  'text-to-image',
  'stabilityai/stable-diffusion-2'
);

// Generate image from prompt
const image = await generator(prompt);

// Convert to ASCII
const ascii = await imageToASCII(image, config);
```

#### 3.2 Fine-tuned LLM
```typescript
// Fine-tune GPT-style model on ASCII art corpus
const model = await loadModel('ascii-art-llm');

const asciiArt = await model.generate({
  prompt: "Generate ASCII art of a dragon",
  style: "detailed",
  width: 80,
  height: 40
});
```

#### 3.3 GAN for ASCII Generation
```typescript
// Train GAN on ASCII art dataset
class ASCIIGenerator {
  generator: tf.LayersModel;
  discriminator: tf.LayersModel;
  
  async train(dataset: ASCIIArtDataset): Promise<void>;
  
  async generate(
    latentVector: tf.Tensor,
    conditions: Conditions
  ): Promise<string>;
}
```

### Phase 4: Production Integration (Week 5)
**Goal:** Seamless integration with existing system

**Features:**
1. Backward compatibility layer
2. Asset migration tool
3. Hybrid mode (manual + generated)
4. Performance optimization
5. Caching strategy

## Technical Specifications

### Algorithm: Brightness Mapping

**Standard Approach:**
```
1. Load image
2. Resize to target dimensions
3. Convert to grayscale
4. For each pixel:
   a. Get brightness value (0-255)
   b. Normalize to palette index
   c. Select character from palette
5. Assemble character grid
6. Output ASCII string
```

**Enhanced Approach:**
```
1. Pre-process:
   - Contrast adjustment
   - Edge enhancement
   - Noise reduction
2. Multi-pass analysis:
   - Brightness map
   - Edge map
   - Detail map
3. Combine maps with weights:
   char = selectCharacter(
     brightness * 0.6 +
     edges * 0.3 +
     detail * 0.1
   )
4. Post-process:
   - Smoothing
   - Character substitution
```

### Character Palettes

**Design Principles:**
1. **Perceptual Density**: Characters ordered by visual weight
2. **Readability**: Distinct characters at each level
3. **Aesthetics**: Visually pleasing combinations

**Recommended Palettes:**

```typescript
const PALETTES = {
  // 10-level (simple, fast)
  simple: '@%#*+=-:. ',
  
  // 70-level (detailed, reference standard)
  detailed: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
  
  // 15-level (balanced)
  balanced: '@&#$%+*!=;:-,. ',
  
  // Block characters (uniform density)
  blocks: '█▓▒░ ',
  
  // Emoticons (playful)
  emoji: '😀😃😄😁😆😊🙂😐😑😕🙁☹️😢😭 ',
};
```

### Aspect Ratio Correction

**Problem**: Characters are taller than wide (typically 2:1 ratio)

**Solution**:
```typescript
const CHAR_ASPECT_RATIO = 0.5; // width/height

function calculateOutputHeight(
  imageWidth: number,
  imageHeight: number,
  targetWidth: number
): number {
  const imageAspect = imageHeight / imageWidth;
  return Math.floor(targetWidth * imageAspect * CHAR_ASPECT_RATIO);
}
```

## Modern Technologies & Libraries

### Image Processing
- **sharp** (Node.js): Fast, production-ready image processing
- **jimp** (JavaScript): Pure JS, browser-compatible
- **canvas** (Browser): HTML5 Canvas API
- **Pillow** (Python): If using Python for ML models

### Machine Learning
- **TensorFlow.js**: Browser/Node.js ML
- **ONNX Runtime**: Cross-platform ML inference
- **Hugging Face Transformers**: Pre-trained models
- **Stable Diffusion**: Image generation

### API & Integration
- **Express**: REST API server
- **Socket.io**: Real-time updates
- **Bull**: Job queue for batch processing
- **Redis**: Caching layer

## API Design

### New Endpoints

#### 1. Convert Image to ASCII
```http
POST /ascii/convert
Content-Type: multipart/form-data

{
  "image": <file>,
  "width": 80,
  "palette": "detailed",
  "algorithm": "brightness"
}

Response:
{
  "ascii": "...",
  "metadata": {
    "width": 80,
    "height": 40,
    "characters": 3200,
    "processingTime": 250
  }
}
```

#### 2. Generate from Prompt
```http
POST /ascii/generate
Content-Type: application/json

{
  "prompt": "a fierce dragon breathing fire",
  "width": 100,
  "height": 50,
  "style": "detailed",
  "model": "stable-diffusion"
}

Response:
{
  "ascii": "...",
  "seed": 12345,
  "model": "stable-diffusion-v2"
}
```

#### 3. Convert URL to ASCII
```http
GET /ascii/from-url?url=https://...&width=80

Response:
{
  "ascii": "..."
}
```

#### 4. Batch Convert
```http
POST /ascii/batch
Content-Type: application/json

{
  "images": ["url1", "url2", ...],
  "config": {...}
}

Response:
{
  "jobId": "uuid",
  "status": "processing"
}

GET /ascii/batch/:jobId
Response:
{
  "status": "complete",
  "results": [...]
}
```

## Performance Considerations

### Optimization Strategies

1. **Caching**
   - Cache converted images with hash keys
   - Redis for hot cache
   - File system for cold storage

2. **Lazy Loading**
   - Generate on-demand, not preload
   - Progressive rendering for large images

3. **Worker Pools**
   - Parallel processing for batch jobs
   - Dedicated GPU for ML models

4. **Resolution Tiers**
   - Low: 40x20 (mobile)
   - Medium: 80x40 (tablet)
   - High: 120x60 (desktop)
   - Ultra: 200x100 (4K)

### Performance Targets

| Operation | Target | Notes |
|-----------|--------|-------|
| Basic conversion (80x40) | <100ms | Brightness mapping |
| Enhanced conversion | <500ms | With edge detection |
| ML generation | <5s | With caching |
| Batch (10 images) | <2s | Parallel processing |

## Integration with Existing System

### Migration Strategy

**Phase 1: Parallel Systems**
- Keep existing manual assets
- Add image-to-ASCII alongside
- Gradual feature migration

**Phase 2: Hybrid Mode**
- Use generated ASCII for dynamic content
- Keep manual assets for key visuals
- Allow manual overrides

**Phase 3: Full Migration**
- Deprecate manual asset system
- Generate all content dynamically
- Archive legacy assets

### Backward Compatibility

```typescript
// Adapter layer
class ASCIIAssetAdapter {
  async loadAsset(name: string): Promise<AsciiAsset> {
    // Try loading from cache
    const cached = await cache.get(name);
    if (cached) return cached;
    
    // Try loading manual asset
    try {
      return await loadManualAsset(name);
    } catch {
      // Fall back to generation
      return await generateAsset(name);
    }
  }
}
```

## Research References

### Academic Papers
1. "Structure-based ASCII Art Generation Using Deep Learning" (2023)
2. "GANs for ASCII Art Generation" (2022)
3. "Text-to-ASCII with Transformer Models" (2024)

### Existing Tools
1. **ascii-art** (npm): Basic conversion
2. **image-to-ascii** (npm): CLI tool
3. **ASCII Art Studio**: Desktop application
4. **Kakikun**: Online generator

### Datasets
1. ASCII Art Archive (10K+ pieces)
2. Text Art Database
3. Game ASCII collections

## Success Metrics

### Quality Metrics
- Perceptual similarity score (SSIM)
- User preference testing
- Detail preservation ratio
- Character utilization efficiency

### Performance Metrics
- Conversion speed (images/second)
- Memory usage (MB per image)
- Cache hit rate (%)
- API response time (ms)

## Next Steps

### Immediate Actions (This Sprint)
1. ✅ Install dependencies (sharp, jimp)
2. ✅ Implement basic brightness mapping
3. ✅ Create character palette system
4. ✅ Build REST API endpoints
5. ✅ Add caching layer
6. ✅ Write unit tests
7. ✅ Update documentation

### Short-term (Next Sprint)
1. Add edge detection
2. Implement dithering
3. Color ASCII support
4. Batch processing
5. Performance optimization

### Long-term (Next Month)
1. ML model integration
2. Text-to-ASCII generation
3. Style transfer
4. Advanced algorithms
5. Production deployment

## Conclusion

This redesign transforms the ASCII system from a static asset library to a dynamic image-to-ASCII art generation platform, leveraging modern image processing, ML/DL models, and generative AI to create high-quality ASCII visualizations on-demand.

The phased approach ensures:
- ✅ Backward compatibility
- ✅ Gradual migration
- ✅ Performance optimization
- ✅ Scalability
- ✅ Future-proof architecture
