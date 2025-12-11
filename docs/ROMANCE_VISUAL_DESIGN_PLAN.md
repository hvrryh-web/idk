# Romance of the Three Kingdoms Visual Novel Integration (Yuto Sano-Inspired)

This plan revises the earlier Romance of the Three Kingdoms visual design blueprint with a ComfyUI asset pipeline tuned for a Yuto Sano-inspired painterly style. It focuses on a semi-realistic, luminous look with soft gradients, sculpted rim light, and clean compositional silhouettes.

## Visual Design Pillars
- **Art Direction:** Late Eastern Han / Three Kingdoms motifs with jade, lacquer, carved wood, and brass. Texture mixes: parchment, silk, and ink-wash overlays.
- **Palette:** Imperial reds/golds for authority; jade/teal strategic layers; parchment neutrals for UI; battlefield scenes lean earth/steel with saturated aura accents. Apply subtle bloom and vignette for the Yuto Sano look.
- **Typography:** Brush-style headers for flavor, paired with clean sans-serif for body text. Maintain stroke outlines/shadows for legibility on textured backdrops.

## Screen Concepts
- **Map Screen:** Ink-wash world map on parchment with animated clouds; province nodes as lacquered plaques; resource ribbons on bamboo slips.
- **War Map Screen:** War-room tabletop diorama with miniature terrain; lantern side-lighting and vignette; toggles for supply, morale, weather, elevation.
- **City Screen:** Elevated walled-city overview; districts marked with hanging lantern pins; ambient market/smoke loops; tooltips on bamboo strips.
- **Regional Map Screen:** Roads as ink strokes; forts/farms/cities marked; faction influence heatmap; margin stamps for events.
- **World Map Screen:** Antique atlas frame; drifting sumi-e fog-of-war; animated banners for major warlords.
- **City Personal View:** Ground-level scenes with depth-of-field; silk-scroll dialogue boxes; busts with painterly rim light.
- **Heroes Conversation:** 2–3 busts with parallax; animated cloth/flags; brushstroke FX, petals/embers; choices as jade plaques or wax-sealed slips.

## ComfyUI Asset Pipeline (Yuto Sano-Inspired Conversion)
1. **Style Control Setup**
   - Use a Yuto Sano-inspired LoRA/style embedding; apply consistent LUTs, bloom, and film grain in a shared post-process node.
   - Keep a style board: soft gradients, luminous rim light, crisp silhouettes against misty or parchment-toned backgrounds.

2. **Character Portraits**
   - Prompt: "Romance of the Three Kingdoms, semi-realistic, ornate Han armor or dynasty robes, painterly soft gradients, luminous rim light, delicate fabric detail, Yuto Sano illustration style." 
   - Workflow: text-to-image → face restore → upscale → color-grade via LUT → overlay subtle paper grain.
   - Output busts with neutral, angry, calm, and shocked expressions for reuse.

3. **Backgrounds**
   - Generate ink-wash + semi-realistic hybrids (city markets, palace halls, war rooms, plains, river crossings) using depth maps for parallax.
   - Apply Yuto Sano tonemapping: gentle bloom, desaturated shadows, warm highlights; keep horizon haze for atmospheric depth.

4. **Maps & Icons**
   - Create parchment/ink base layers via text-to-image; convert to Yuto Sano palette with gradient maps and bloom overlay.
   - Generate faction banners separately; vectorize unit/resource icons for clarity after AI pass. Keep lacquered frames and jade plaques.

5. **FX & Overlays**
   - Brushstroke slashes, aura glows, embers, falling petals generated as transparent PNGs; apply bloom and slight chromatic drift to match the style.
   - Maintain reusable FX packs for combat and dialogue emphasis.

6. **Consistency & QA**
   - Batch-apply the LUT/grain/vignette stack via a ComfyUI reusable node group.
   - Audit color balance across screens; ensure UI text contrast over textured panels.
   - Store prompt presets and negative prompts for stable reproducibility.

## Integration Steps
1. **Style Bible:** Update palette swatches, borders, icons, and lighting references to include Yuto Sano cues (soft gradients, rim light, bloom).
2. **Blockframes:** Wireframe each screen with placeholders; confirm UX flow before asset swap.
3. **Asset Generation:** Batch characters, backgrounds, banners, FX through the Yuto Sano ComfyUI pipeline; curate and retouch.
4. **Parallax & FX:** Add depth maps to backgrounds; set layered FX triggers for combat hits and dialogue beats.
5. **Map Layers:** Build parchment base, apply influence heatmaps, add faction banners and clickable nodes.
6. **Implementation:** Replace placeholders with final assets; apply global post-process (LUT + bloom + vignette + grain).
7. **Polish:** Tune animation timings; pair with SFX (qin/guqin, war drums); performance pass on target hardware.

## Deliverables
- Updated style bible with Yuto Sano-inspired palettes and lighting.
- AI-assisted asset packs: character busts, backgrounds, maps, FX overlays.
- UI components: scroll panels, jade plaques, banners, stamps, buttons, cursors.
- Map pack: world/regional/city tabletop variants plus markers and banners.
- Integration guide: scene composition, layer order, parallax depths, FX cues, and ComfyUI preset settings.
