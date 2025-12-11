# ASCII Renderer and ANSI Output

This feature converts uploaded images into ASCII art on the server with optional colorized ANSI output.
Caching is performed using the image hash plus render settings to avoid redundant conversions.

## Backend API

- **Endpoint:** `POST /api/v1/render/ascii`
- **Payload:** multipart form data
  - `file` (required): PNG, JPEG, WEBP, or GIF. Max size: 5 MB.
  - `charset`: `dense` (default) or `sparse`.
  - `brightness_threshold`: `0-255` (default: `48`), values below are treated as empty space.
  - `width`: output width in characters (`8-320`, default: `80`).
  - `color`: `true` to emit ANSI color codes for each glyph.

**Example request (curl)**

```bash
curl -X POST http://localhost:8000/api/v1/render/ascii \
  -F "file=@/path/to/image.png" \
  -F "charset=dense" \
  -F "brightness_threshold=64" \
  -F "width=96" \
  -F "color=true"
```

**Response body**

```json
{
  "ascii": "...output...",
  "cached": false,
  "duration_ms": 18.4,
  "charset": "dense",
  "brightness_threshold": 64,
  "width": 96,
  "colorized": true
}
```

Requests exceeding the size limit return **413**. Unsupported MIME types return **400** with the allowed types listed.

## Frontend usage

Navigate to **ASCII Renderer** from the Game Room quick navigation or visit `/ascii` directly.

- Upload an image (screen readers announce supported formats and size limits).
- Choose **Dense** or **Sparse** character sets.
- Adjust the **Brightness threshold** slider to control when pixels become blank space.
- Set **Output width** to match your terminal or layout.
- Toggle **Colorize output** to emit ANSI escape codes and preview inline colors.
- Toggle **High-contrast preview** for improved visibility in dark or accessibility modes.

Cached responses surface a status message indicating the reuse of a previous render.
