# Romance of Three Kingdoms Visual Novel Style Prompt Templates

## Overview

This document contains shared prompt templates for generating consistent Visual Novel art assets in the Romance of Three Kingdoms (ROTK) style. All workflows should use these blocks to ensure visual consistency across portraits, CGs, backgrounds, and UI elements.

---

## Style Block (Use in all workflows)

```
Romance of Three Kingdoms game art, KOEI Tecmo quality, Dynasty Warriors aesthetic, semi-realistic painted illustration, heroic historical-fantasy tone, warm cinematic lighting with gold and amber tones, high contrast, luminous rim light, strong facial structure, expressive brows, period-appropriate hair and beards, layered robes and armor with embossed trim, muted jewel tones, painterly soft gradients, Yuto Sano inspired, Han dynasty aesthetic, wuxia fantasy, ink wash painting influence, professional game illustration, AAA game character art, 8k, masterpiece, best quality
```

## Negative Prompt Block (Use in all workflows)

```
modern clothing, contemporary fashion, anime cel shading, photoreal uncanny skin, oversharp outlines, logo text, watermark stamps, signature, brand marks, blurry, low quality, amateur, bad anatomy, ugly, deformed, disfigured, extra limbs, mutated, western cartoon style, chibi, super deformed, simple background, nsfw, nude, text overlays
```

---

## Portrait Template

### Purpose
VN character portraits (bust/half-body), transparent or flat background.

### Base Prompt

```
{style_block}, portrait bust, upper body centered, facing slightly 3/4 view, clean background gradient, dramatic lighting from upper left, ornate {armor_type} with {faction_color} accents, {age_description}, {facial_hair_description}, {mood_expression}, detailed fabric rendering, silk sheen, embroidered patterns, strong jawline, period-accurate hairstyle
```

### Variable Substitutions

- `{armor_type}`: "ornate plate armor", "elaborate cultivation robes", "scholar's flowing garments", "general's cape and pauldrons"
- `{faction_color}`: "imperial red and gold", "jade green", "deep blue", "bronze and copper"
- `{age_description}`: "youthful features, smooth skin, bright eyes", "mature features, distinguished bearing", "weathered elder, wisdom lines, gray hair"
- `{facial_hair_description}`: "clean-shaven", "short trimmed beard", "long flowing beard, dignified", "thin mustache"
- `{mood_expression}`: "calm neutral expression", "determined resolute gaze", "wise contemplative look", "fierce battle-ready intensity"

### Example Prompts

**Strategic Advisor (Zhuge Liang-style)**
```
Romance of Three Kingdoms game art, KOEI Tecmo quality, Dynasty Warriors aesthetic, semi-realistic painted illustration, heroic historical-fantasy tone, warm cinematic lighting with gold and amber tones, high contrast, luminous rim light, portrait bust, upper body centered, facing slightly 3/4 view, clean background gradient, dramatic lighting from upper left, elaborate scholar's flowing garments with jade green and white accents, mature features, distinguished bearing, clean-shaven, wise contemplative look, detailed fabric rendering, silk sheen, embroidered crane patterns, refined features, feather fan accessory hint, period-accurate topknot hairstyle, masterpiece, best quality
```

**Mighty General (Guan Yu-style)**
```
Romance of Three Kingdoms game art, KOEI Tecmo quality, Dynasty Warriors aesthetic, semi-realistic painted illustration, heroic historical-fantasy tone, warm cinematic lighting with gold and amber tones, high contrast, luminous rim light, portrait bust, upper body centered, facing slightly 3/4 view, clean background gradient, dramatic lighting from upper left, ornate plate armor with imperial green and gold dragon motifs, middle-aged features, battle-hardened dignity, long flowing magnificent beard, fierce battle-ready intensity with righteous dignity, detailed armor rendering, elaborate pauldrons, crimson face undertones, imposing warrior presence, period-accurate bound hair, masterpiece, best quality
```

**Noble Warrior Prince (Zhao Yun-style)**
```
Romance of Three Kingdoms game art, KOEI Tecmo quality, Dynasty Warriors aesthetic, semi-realistic painted illustration, heroic historical-fantasy tone, warm cinematic lighting with gold and amber tones, high contrast, luminous rim light, portrait bust, upper body centered, facing slightly 3/4 view, clean background gradient, dramatic lighting from upper left, pristine white and silver armor with blue silk accents, youthful but mature features, heroic handsomeness, clean-shaven, determined noble gaze with subtle warmth, detailed armor rendering, flowing cape, athletic warrior build, chivalrous bearing, period-accurate flowing hair with headband, masterpiece, best quality
```

**Ambitious Warlord (Cao Cao-style)**
```
Romance of Three Kingdoms game art, KOEI Tecmo quality, Dynasty Warriors aesthetic, semi-realistic painted illustration, heroic historical-fantasy tone, warm cinematic lighting with gold and amber tones, high contrast, luminous rim light, portrait bust, upper body centered, facing slightly 3/4 view, clean background gradient, dramatic lighting from upper left, dark imposing court robes with purple and gold embroidery, mature calculating features, commanding presence, short elegant beard, shrewd intelligent expression with hidden ambition, detailed fabric rendering, imperial regalia hints, strategic mastermind aura, period-accurate formal headwear, masterpiece, best quality
```

**Benevolent Lord (Liu Bei-style)**
```
Romance of Three Kingdoms game art, KOEI Tecmo quality, Dynasty Warriors aesthetic, semi-realistic painted illustration, heroic historical-fantasy tone, warm cinematic lighting with gold and amber tones, high contrast, luminous rim light, portrait bust, upper body centered, facing slightly 3/4 view, clean background gradient, dramatic lighting from upper left, refined nobleman's robes with imperial yellow and jade accents, kind dignified features, compassionate bearing, thin refined beard and mustache, gentle wise expression with inner strength, detailed silk rendering, understated elegance, virtuous leader presence, unusually long earlobes, period-accurate noble hairstyle, masterpiece, best quality
```

**Court Lady / Female Strategist**
```
Romance of Three Kingdoms game art, KOEI Tecmo quality, Dynasty Warriors aesthetic, semi-realistic painted illustration, heroic historical-fantasy tone, warm cinematic lighting with gold and amber tones, high contrast, luminous rim light, portrait bust, upper body centered, facing slightly 3/4 view, clean background gradient, dramatic lighting from upper left, elegant court hanfu with embroidered phoenix motifs, refined feminine features, intelligent bearing, elaborate traditional hairstyle with jade hairpins, composed calculating expression, detailed silk rendering, flowing sleeves, graceful but formidable presence, period-accurate cosmetics, masterpiece, best quality
```

---

## Group Poster Template

### Purpose
Promotional key art / chapter splash with multiple figures.

### Base Prompt

```
{style_block}, epic group composition, key art promotional poster, central hero figure sharp focus in foreground, supporting cast arranged behind with progressive depth blur, faction unity theme, dramatic clouds or smoke in background, battlefield atmosphere or palace grandeur, war banners and faction symbols, golden hour lighting with dramatic shadows, cinematic wide angle, heroic poses, varying character heights for visual interest, complementary color harmony, no logos, no text
```

### Depth Layering Instructions

- **Foreground (sharp)**: Main hero, full detail, strongest rim light
- **Midground (slight blur)**: 2-3 supporting characters, good detail, softer edges
- **Background (atmospheric)**: Additional figures, army silhouettes, or architectural elements with atmospheric haze

### Example Prompts

**Oath of the Peach Garden**
```
Romance of Three Kingdoms game art, KOEI Tecmo quality, Dynasty Warriors aesthetic, semi-realistic painted illustration, heroic historical-fantasy tone, epic group composition, key art promotional poster, three sworn brothers united, central figure in yellow nobleman's robes as primary focus, flanking warriors in green armor and dark warrior attire, peach blossoms falling dramatically, golden sunset lighting, misty mountain temple background with atmospheric depth, brotherhood oath scene, dramatic low angle shot, complementary warm color palette, no logos, no text, masterpiece, best quality
```

**Council of War**
```
Romance of Three Kingdoms game art, KOEI Tecmo quality, Dynasty Warriors aesthetic, semi-realistic painted illustration, heroic historical-fantasy tone, epic group composition, key art promotional poster, strategic war council scene, central strategist figure with feather fan in sharp focus, surrounding generals and advisors with progressive blur, war room setting with strategic maps visible, lantern lighting casting dramatic shadows, faction banners in background, tense deliberation atmosphere, varied character expressions showing debate, no logos, no text, masterpiece, best quality
```

**Clash of Titans**
```
Romance of Three Kingdoms game art, KOEI Tecmo quality, Dynasty Warriors aesthetic, semi-realistic painted illustration, heroic historical-fantasy tone, epic group composition, key art promotional poster, legendary warriors facing off, two opposing heroes as dual focal points, their armies as blurred masses behind, battlefield dust and smoke, clashing weapon energy effects, dramatic storm sky, rivalry and mutual respect evident, dynamic action composition, warm versus cool color contrast between factions, no logos, no text, masterpiece, best quality
```

---

## Background/Environment Template

### Purpose
VN backgrounds (palace halls, war camps, battlefields, mountain passes, city gates).

### Base Prompt

```
{style_block}, environment background scene, no main characters dominating composition, {environment_type}, {time_of_day} lighting, atmospheric perspective with depth layers, architectural details appropriate to Han dynasty China, ink wash painting influence in distant elements, painterly matte background style, mild filmic haze, subtle vignette, parallax-ready depth composition, warm color palette with strategic cool accents
```

### Environment Types

**Palace Interior**
```
imperial palace hall interior, dragon motifs, red lacquered columns, gold trim, ornate throne or meeting area, incense smoke wisps, lantern lighting, jade decorations, silk curtains, imposing scale
```

**War Camp**
```
military encampment at dusk, canvas tents with faction banners, weapon racks, campfire lighting, soldiers as distant silhouettes, strategic planning area, horses tethered nearby, mountain backdrop, organized chaos of preparation
```

**Battlefield (Before/After)**
```
epic battlefield plains, distant army formations, war banners catching wind, dust and atmospheric haze, dramatic sky, evidence of conflict, strategic terrain features, mountains in far background
```

**Mountain Pass / Path**
```
misty mountain path winding through peaks, pine trees, cloud layer below, ancient stone steps, pavilion or waystation visible, serene yet treacherous atmosphere, morning mist, ink wash style distant peaks
```

**City Gate / Street**
```
ancient fortified city gate, massive wooden doors with bronze fittings, guard towers, busy street scene with blurred civilian figures, market stalls, lanterns, period-accurate architecture, bustling atmosphere
```

**Teahouse / Inn**
```
traditional teahouse interior, warm lantern glow, wooden beams and screens, tea service on low tables, private meeting alcoves, gentle incense smoke, welcoming but mysterious atmosphere
```

### Example Prompts

**Imperial Throne Room**
```
Romance of Three Kingdoms game art, KOEI Tecmo quality, semi-realistic painted illustration, environment background scene, no main characters dominating composition, imperial palace hall interior, dragon motifs carved into massive red lacquered columns, gold leaf trim throughout, imposing dragon throne on raised dais, incense smoke wisps catching light, warm lantern lighting with shaft of daylight from high windows, jade and bronze decorations, flowing silk curtains in imperial yellow, grand imposing scale, painterly matte background style, mild filmic haze, subtle vignette, parallax-ready depth composition, masterpiece, best quality
```

**Warcamp at Dusk**
```
Romance of Three Kingdoms game art, KOEI Tecmo quality, semi-realistic painted illustration, environment background scene, no main characters dominating composition, military encampment at dusk, canvas command tents with red faction banners, weapon racks with halberds and spears, warm campfire lighting casting long shadows, soldiers as distant silhouettes maintaining watch, central strategy tent open showing maps, horses tethered in background, misty mountains as backdrop, organized preparation for battle, painterly matte background style, mild filmic haze, subtle vignette, masterpiece, best quality
```

---

## UI Motifs Template

### Purpose
UI ornament assets: parchment textures, embossed gold trims, brocade patterns, seal-like stamps, icon frames.

### Base Prompt

```
{style_block}, UI asset design, isolated element on transparent background, {asset_type}, period-accurate Chinese aesthetic, bronze and jade material rendering, embossed relief detail, clean edges suitable for game UI, 1024x1024 tileable where appropriate, professional game asset quality, ornate but readable
```

### Asset Types

**Frame Corners**
```
ornate corner bracket design, dragon scale or cloud scroll motif, bronze with gold highlights, embossed dimensional detail, symmetrical design
```

**Panel Borders**
```
horizontal or vertical border strip, interlocking geometric pattern, jade and gold color scheme, seamless tileable design, lacquered wood influence
```

**Panel Backgrounds**
```
parchment texture with subtle ink wash effects, aged paper quality, traditional Chinese paper grain, semi-transparent overlay suitable
```

**Medallions / Seals**
```
circular bronze medallion, Chinese character or faction symbol center, ornate outer ring with dragon or phoenix detail, official seal appearance, embossed metallic texture
```

**Icon Frames**
```
square or circular icon frame, jade or bronze material, simple but elegant border, suitable for 64x64 to 128x128 icons, clear center area for icon placement
```

**Ribbons / Banners**
```
flowing silk ribbon banner, imperial red or faction-appropriate color, text-ready surface, decorative ends with tassel hints, dynamic curve composition
```

### Example Prompts

**Dragon Corner Ornament**
```
Romance of Three Kingdoms game art, KOEI Tecmo quality, UI asset design, isolated element on transparent background, ornate corner bracket design, coiled dragon motif with auspicious clouds, burnished bronze base with gold leaf highlights, deeply embossed dimensional relief detail, symmetrical L-shape corner design, lacquered finish appearance, professional game asset quality, clean edges, masterpiece, best quality
```

**Jade Medallion Seal**
```
Romance of Three Kingdoms game art, KOEI Tecmo quality, UI asset design, isolated element on transparent background, circular jade medallion seal, imperial Chinese character in center, outer ring of intricate dragon chasing phoenix pattern, jade green translucent quality with gold mounting, official seal of authority appearance, embossed dimensional texture, professional game asset quality, masterpiece, best quality
```

**Parchment Panel Background**
```
Romance of Three Kingdoms game art, UI asset design, isolated element, aged parchment texture background panel, subtle ink wash watercolor bleeding at edges, traditional Chinese paper fiber grain visible, warm cream and tan color palette, occasional calligraphy ghost hints, semi-transparent quality suitable for overlay, tileable texture, professional game asset quality, masterpiece, best quality
```

---

## Post-Processing Stack

All workflows should apply this consistent post-processing:

1. **Filmic Contrast Curve**: Mild S-curve to enhance depth without crushing blacks
2. **Warm Color Balance**: Shift highlights toward amber/gold, shadows slightly cooler
3. **Subtle Vignette**: 15-25% strength, soft falloff from edges
4. **Controlled Sharpening**: Low radius, avoid crunchy artifacts
5. **Optional Film Grain**: Very subtle (5-10% opacity) for organic texture

---

## Output Specifications

| Asset Type | Resolution | Format | Naming Convention |
|------------|------------|--------|-------------------|
| Portrait | 1024x1536 or 832x1216 | PNG (alpha) | `portraits/{char_id}_{variant}_{seed}.png` |
| Group Poster | 1536x1024 or 1920x1080 | PNG | `posters/{scene_id}_{variant}_{seed}.png` |
| Background | 1920x1080 and 2560x1440 | WEBP/PNG | `backgrounds/{env_type}_{variant}_{seed}.png` |
| UI Motif | 1024x1024 (tile) | PNG (alpha) | `ui/{category}/{asset_id}_{variant}.png` |

---

## Seeds and Reproducibility

For consistent results across generation sessions:

1. Document seeds for approved outputs
2. Use deterministic sampling (DPM++ 2M Karras recommended)
3. Pin model versions in `models/README.md`
4. Store generation parameters in JSON sidecar files:

```json
{
  "asset_id": "portrait_general_001",
  "workflow": "ro3k_portrait.json",
  "seed": 42857312,
  "cfg_scale": 7.0,
  "steps": 28,
  "checkpoint": "animagine-xl-3.1.safetensors",
  "prompt_hash": "abc123...",
  "generated_at": "2024-12-12T10:30:00Z"
}
```
