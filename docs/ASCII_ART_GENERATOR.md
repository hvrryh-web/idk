# ASCII Art Generator

The ASCII Art Generator allows Game Masters to convert images into ASCII art for display on the TV screen in the game room.

## Features

- **Multiple Style Presets**: Choose from Cyberpunk Neon, Wuxia Ink, or Retro Terminal styles
- **Real-time Preview**: See both the original image and ASCII conversion side-by-side
- **Caching**: Duplicate conversions are automatically cached for faster retrieval
- **Customizable Display**: Adjust font size and contrast on the TV screen
- **Recent Conversions**: Quick access to recently generated ASCII art

## Usage

### Accessing the ASCII Art Generator

1. Navigate to the Game Room (home page)
2. Click the "🎨 ASCII Art Generator" button in the Quick Navigation section
3. This will open the GM Console with the ASCII Art Generator interface

### Converting an Image

1. **Upload Image**: Click "Select Image" and choose an image file (JPEG, PNG, etc.)
2. **Choose Style**: Select a style preset from the dropdown:
   - **Cyberpunk Neon**: High-contrast with bold characters, supports color
   - **Wuxia Ink**: Detailed brush-stroke aesthetic inspired by ink paintings
   - **Retro Terminal**: Classic block-shading terminal aesthetic
3. **Convert**: Click "Convert to ASCII" to generate the ASCII art
4. **Preview**: View the generated ASCII art in the preview panel
5. **Send to TV**: Click "📺 Send to TV Screen" to display on the game screen

### Customizing TV Display

On the TV screen panel, you can:
- **Adjust Font Size**: Use the slider to change ASCII character size (8-20px)
- **Toggle High Contrast**: Enable for better visibility
- **Toggle Monochrome**: Switch between colored and black/white display

## API Endpoints

### Convert Image

```bash
POST /api/v1/ascii/convert?style=retro_terminal&width=80&height=40
Content-Type: multipart/form-data
```

**Parameters:**
- `file`: Image file (required)
- `style`: Style preset name (optional, default: retro_terminal)
- `width`: Target width in characters (optional)
- `height`: Target height in characters (optional)

**Response:**
```json
{
  "id": "uuid",
  "ascii_art": "ASCII art content...",
  "width": 80,
  "height": 40,
  "style": "retro_terminal",
  "preset_name": "Retro Terminal",
  "content_hash": "abc123",
  "use_color": false
}
```

### Get Available Presets

```bash
GET /api/v1/ascii/presets
```

**Response:**
```json
{
  "retro_terminal": {
    "name": "Retro Terminal",
    "description": "Classic block-shading terminal aesthetic",
    "use_color": false
  },
  "cyberpunk": {
    "name": "Cyberpunk Neon",
    "description": "High-contrast cyberpunk aesthetic with bold characters",
    "use_color": true
  },
  "wuxia": {
    "name": "Wuxia Ink",
    "description": "Flowing brush-stroke aesthetic inspired by ink paintings",
    "use_color": false
  }
}
```

### Retrieve ASCII Artifact

```bash
GET /api/v1/ascii/{artifact_id}
```

**Response:** Same as conversion response

### List Recent Artifacts

```bash
GET /api/v1/ascii?skip=0&limit=20
```

**Response:**
```json
[
  {
    "id": "uuid",
    "width": 80,
    "height": 40,
    "style": "retro_terminal",
    "preset_name": "Retro Terminal",
    "content_hash": "abc123",
    "created_at": "2024-01-01T00:00:00"
  }
]
```

## Database Schema

The ASCII artifacts are stored in the `ascii_artifacts` table:

```sql
CREATE TABLE ascii_artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_hash VARCHAR(16) UNIQUE NOT NULL,
    ascii_art TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    style VARCHAR(50) NOT NULL,
    preset_name VARCHAR(100) NOT NULL,
    use_color BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

To apply the schema, run:

```bash
psql postgresql://postgres:postgres@localhost:5432/wuxuxian -f backend/schema.sql
```

## Technical Details

### Conversion Algorithm

1. **Image Loading**: Load image using Pillow (PIL)
2. **Preprocessing**: Convert to grayscale and resize to target dimensions
3. **Character Mapping**: Map pixel brightness (0-255) to character ramp
4. **Aspect Ratio Correction**: Account for character width/height ratio
5. **Caching**: Generate content hash and check for existing conversion

### Performance

- **Conversion Speed**: ~50-200ms for typical images (depending on size)
- **Caching**: Duplicate conversions return instantly from database
- **Maximum Dimensions**: 160x90 characters (configurable)
- **Supported Formats**: JPEG, PNG, GIF, BMP, and other PIL-supported formats

### Character Ramps

Each style preset uses a different character ramp:

- **Cyberpunk**: ` .:-=+*#%@` (10 characters, high contrast)
- **Wuxia**: ` .'`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$` (70 characters, detailed)
- **Retro Terminal**: ` ░▒▓█` (5 characters, block shading)

## Testing

Run the test suite:

```bash
# Backend tests
cd backend
pytest tests/test_ascii_converter.py tests/test_ascii_api.py -v

# All backend tests
pytest tests/ -v
```

**Test Coverage:**
- 8 unit tests for ASCII converter
- 9 integration tests for API endpoints
- All 17 ASCII-related tests passing

## Future Enhancements

- [ ] WebSocket support for real-time TV updates
- [ ] Color support with ANSI escape codes
- [ ] Dithering algorithms for smoother gradients
- [ ] Edge detection for better silhouettes
- [ ] Custom character ramp editor
- [ ] Batch conversion for scene packs
- [ ] Export to text file
- [ ] Performance metrics and monitoring
