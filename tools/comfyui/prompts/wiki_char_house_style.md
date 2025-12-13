# Wiki Character Art - House Style Definition

## House Style: Modern Manga-Illustration + RO3K

This document defines the shared style blocks used by all Wiki Character Art workflows.
The style is inspired by modern manga cover-grade illustration with Romance of Three Kingdoms (RO3K) aesthetic influences, creating an original "House Style" that is cohesive with the game's visual base.

---

## STYLE_BLOCK

Use this positive prompt block as the foundation for all wiki character art generation:

```
STYLE_BLOCK = """
masterpiece, best quality, highly detailed illustration,
modern manga illustration style, professional character art,
crisp confident ink lines, clean linework, minimal sketchiness,
smooth controlled shading, cel-to-soft shading hybrid, tasteful gradients,
high-fidelity facial features, detailed expressive eyes, clean skin rendering,
costume detail emphasis, embroidered trims, brocade patterns, intricate accessories,
Romance of Three Kingdoms aesthetic, Han dynasty inspired, wuxia xianxia fantasy,
rich saturated colors, controlled highlights, strong silhouette readability,
studio lighting, professional game illustration, AAA character art quality,
sharp focus, high contrast, vibrant yet tasteful color palette,
three kingdoms color palette, rich reds, blacks, jade teal accents, gold trim
"""
```

### Style Breakdown

| Aspect | Description |
|--------|-------------|
| **Linework** | Crisp, confident ink lines; minimal sketchiness; professional illustration quality |
| **Shading** | Smooth, controlled cel-to-soft shading hybrid (not flat, not painterly blur) |
| **Facial Features** | High-fidelity eyes, lashes, brows; clean skin rendering (avoid plastic look) |
| **Costume Detail** | Emphasis on embroidered trims, brocade patterns, armor plates, accessories |
| **Color Palette** | RO3K world-consistent: rich reds, blacks, jade/teal accents, gold trim; restrained neon |
| **Readability** | High readability at thumbnail size for wiki cards |

---

## NEGATIVE_BLOCK

Use this negative prompt block to avoid common artifacts and unwanted styles:

```
NEGATIVE_BLOCK = """
lowres, bad anatomy, bad hands, missing fingers, extra fingers, extra digits,
fewer digits, cropped, worst quality, low quality, normal quality,
jpeg artifacts, signature, watermark, username, logo, text, typography,
cover text, title text, blurry, out of focus,
photoreal skin pores, overly realistic, hyper realistic,
oversharp AI artifacts, noise, dithering, deformed,
anime chibi, super deformed, cartoonish,
heavy painterly smears, oil painting texture, impressionist blur,
overexposed bloom, lens flare, chromatic aberration,
western comic style, american cartoon, disney style,
3d render, cgi, uncanny valley,
duplicate, multiple views on single canvas, split image,
nsfw, nude, suggestive, revealing clothing,
background clutter, busy background, noisy background
"""
```

### What to Avoid

| Category | Avoid |
|----------|-------|
| **Text/Branding** | Logos, cover typography, watermarks, signatures |
| **AI Artifacts** | Deformed hands, extra fingers, oversharp edges, plastic skin |
| **Wrong Styles** | Anime chibi, heavy painterly smears, noisy dithering, overexposed bloom |
| **Realism Issues** | Photoreal skin pores, hyper-realistic rendering |
| **Content** | NSFW, background clutter |

---

## Per-Workflow Prompt Templates

### Portrait Template (Wiki Highlight Bust)

```
PORTRAIT_TEMPLATE = """
{STYLE_BLOCK},
character portrait, bust shot, upper body portrait,
3/4 view facing slightly left, centered composition,
{character_name}, {character_description},
{visual_traits},
{outfit_description},
{faction_colors},
clean gradient background, studio backdrop,
dramatic rim lighting from upper left,
high detail face, expressive eyes, dignified expression
"""
```

### Full-Body Template (Wiki Featured Render)

```
FULLBODY_TEMPLATE = """
{STYLE_BLOCK},
full body character render, standing pose, dynamic stance,
full figure visible from head to feet,
{character_name}, {character_description},
{visual_traits},
{outfit_description},
{signature_props},
{faction_colors},
clean studio background, subtle gradient,
professional lighting setup, rim light accent,
detailed costume, visible accessories, weapon if applicable
"""
```

### Expression Sheet Template (2x3 or 3x3 Grid)

```
EXPRESSION_SHEET_TEMPLATE = """
{STYLE_BLOCK},
character expression sheet, emotion reference,
multiple expressions grid layout,
{character_name}, {character_description},
{visual_traits},
consistent character identity, same outfit throughout,
neutral, happy, angry, sad, determined, surprised,
bust crop uniform framing, white background per cell,
clean separation between expressions
"""
```

---

## Palette Guidelines

### RO3K Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Imperial Red | `#C41E3A` | Primary accent, martial characters, violence pillar |
| Jade Teal | `#00A86B` | Revelation pillar, mystical elements, cultivation |
| Dynasty Gold | `#D4AF37` | Trim, ornaments, nobility, high-status |
| Ink Black | `#1C1C1C` | Linework, shadows, armor base |
| Silk White | `#FAF0E6` | Clothing base, backgrounds, scholar characters |
| Azure Blue | `#007FFF` | Influence pillar, ethereal effects, sky |
| Bronze | `#CD7F32` | Military equipment, earth tones |
| Vermillion | `#E34234` | Accents, fire effects |

### Faction Colors (Example)

| Faction | Primary | Secondary | Accent |
|---------|---------|-----------|--------|
| Wei | Dark Blue `#1E3A5F` | Silver `#C0C0C0` | Gold `#FFD700` |
| Shu | Green `#228B22` | White `#FFFFFF` | Gold `#FFD700` |
| Wu | Red `#B22222` | Black `#000000` | Gold `#FFD700` |
| Jin | Purple `#800080` | Silver `#C0C0C0` | Gold `#FFD700` |
| Neutral | Gray `#808080` | Brown `#8B4513` | Bronze `#CD7F32` |

---

## Identity Anchors

To maintain character consistency across multiple generations (especially for expression sheets), use these "identity anchor" keywords:

```
IDENTITY_ANCHORS = """
same character throughout, consistent identity,
{eye_color} eyes, {hair_color} {hair_style} hair,
{distinctive_features},
{facial_structure},
character-specific color palette maintained
"""
```

---

## Technical Parameters

### Recommended Generation Settings

| Parameter | Portrait | Full-Body | Expression Sheet |
|-----------|----------|-----------|------------------|
| Resolution | 1024×1536 | 1024×1536 or 1216×832 | 2048×2048 (3x3 grid) |
| Steps | 28-35 | 28-35 | 25-30 |
| CFG | 7.0-7.5 | 7.0-7.5 | 7.0 |
| Sampler | DPM++ 2M Karras | DPM++ 2M Karras | DPM++ 2M Karras |
| Denoise | 1.0 (new) / 0.4-0.5 (refine) | 1.0 (new) / 0.4-0.5 (refine) | 1.0 |

### Face Refinement Pass

For portrait and full-body workflows, apply a second pass with:

```
FACE_REFINE_SETTINGS = {
    "denoise_strength": 0.3,
    "mask_area": "face_region",
    "steps": 15,
    "cfg": 6.5,
    "focus_prompt_addition": "detailed face, sharp eyes, perfect facial features"
}
```

---

## Output Naming Convention

```
wiki_assets/characters/{char_id}/
├── portrait_{variant}_{seed}.png
├── portrait_{variant}_{seed}.json  # sidecar metadata
├── fullbody_{variant}_{seed}.png
├── fullbody_{variant}_{seed}.json
├── expressions_{seed}.png
└── expressions_{seed}.json
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-XX | Initial house style definition |

---

## Notes

- This style definition is designed to be cohesive with the existing RO3K/Three Kingdoms visual base established in the repository.
- Do NOT attempt to replicate any single living artist's exact style.
- The goal is an original "House Style" that combines modern manga-illustration quality with historical Chinese aesthetics.
- All generated assets must be free of logos, watermarks, and cover typography.
