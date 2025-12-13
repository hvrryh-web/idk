# P3: ASCII Base Models Upload Guide

**Priority:** 🟠 MEDIUM  
**Total Assets:** 26 images  
**Status:** 0/26 uploaded

## Why This is Priority 3

These ASCII base models enable:
- ✅ ASCII combat illustration generation
- ✅ Simplified character art for combat scenes
- ✅ Lower detail requirements (works with same LoRAs)
- ✅ Retro-style combat visualizations

---

## Character Poses (14 images)

**Upload to:** `character-poses/` subfolder

**Specifications:**
- Format: PNG with transparency or high-contrast B&W
- Size: 512x512px (square) or 512x768px (full-body)
- File naming: `ascii-char-{name}-{pose}.png`
- High contrast silhouettes work best

**Diao Chan (6 poses):**
- [ ] `ascii-char-diao-chan-idle.png` - Standing neutral
- [ ] `ascii-char-diao-chan-attack.png` - Attacking with weapon
- [ ] `ascii-char-diao-chan-defend.png` - Defensive stance
- [ ] `ascii-char-diao-chan-skill.png` - Special ability
- [ ] `ascii-char-diao-chan-hurt.png` - Taking damage
- [ ] `ascii-char-diao-chan-victory.png` - Victory pose

**Lu Bu (6 poses):**
- [ ] `ascii-char-lu-bu-idle.png` - Standing neutral
- [ ] `ascii-char-lu-bu-attack.png` - Attacking with halberd
- [ ] `ascii-char-lu-bu-defend.png` - Defensive stance
- [ ] `ascii-char-lu-bu-skill.png` - Special ability
- [ ] `ascii-char-lu-bu-hurt.png` - Taking damage
- [ ] `ascii-char-lu-bu-victory.png` - Victory pose

**Generic Warrior (2 poses):**
- [ ] `ascii-char-warrior-idle.png` - NPC idle
- [ ] `ascii-char-warrior-attack.png` - NPC attack

**Design Notes:**
- Simplified silhouettes (avoid small details)
- Strong pose lines and clear gestures
- Can be generated from P1 references using LoRAs with simplified prompts
- High contrast works better for ASCII conversion

---

## Weapons & Effects (8 images)

**Upload to:** `weapons-effects/` subfolder

**Specifications:**
- Format: PNG with transparency
- Size: 256x256px or 512x512px
- File naming: `ascii-{type}-{name}.png`
- Clear silhouettes and shapes

**Required:**
- [ ] `ascii-weapon-sword.png` - Straight sword silhouette
- [ ] `ascii-weapon-spear.png` - Spear/lance silhouette
- [ ] `ascii-weapon-halberd.png` - Fang Tian Ji (Lu Bu's weapon)
- [ ] `ascii-effect-slash.png` - Slashing attack effect
- [ ] `ascii-effect-thrust.png` - Thrusting attack effect
- [ ] `ascii-effect-qi-burst.png` - Qi energy burst
- [ ] `ascii-effect-fire.png` - Fire element effect
- [ ] `ascii-effect-lightning.png` - Lightning effect

---

## Environment Elements (4 images)

**Upload to:** `environment-elements/` subfolder

**Specifications:**
- Format: PNG with transparency
- Size: 512x512px (tileable where needed)
- File naming: `ascii-env-{name}.png`
- Simple, recognizable shapes

**Required:**
- [ ] `ascii-env-ground.png` - Ground/terrain texture
- [ ] `ascii-env-rocks.png` - Rock formations
- [ ] `ascii-env-trees.png` - Tree silhouettes
- [ ] `ascii-env-walls.png` - Wall/barrier structures

---

## Generation Tips

These can be generated using the same character LoRAs from P1:

```bash
# Example: Generate ASCII base model for Diao Chan idle pose
# Uses existing diao-chan LoRA with simplified ASCII-optimized prompt

Prompt: "simple silhouette, high contrast, black and white, 
         diaochan character standing idle pose, clear outline,
         minimal details, ASCII art style, full body"

# This produces simpler images suitable for ASCII conversion
```

## Processing Command

```bash
./tools/asset_pipeline_manager.py process
./tools/asset_pipeline_manager.py stage
./tools/asset_pipeline_manager.py approve --id <asset_id>
./tools/asset_pipeline_manager.py deploy --target comfyui
```

## Progress Tracker

- Character Poses: 0/14 uploaded
- Weapons/Effects: 0/8 uploaded
- Environment: 0/4 uploaded
- **Total: 0/26 uploaded**
