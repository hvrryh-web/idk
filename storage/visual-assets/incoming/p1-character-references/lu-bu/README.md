# P1: Character References Upload Checklist

**Priority:** 🔴 CRITICAL  
**Total Assets:** 20 images  
**Status:** 0/20 uploaded

## Why This is Priority 1

These character references are **required** for:
- ✅ LoRA training (character-specific models)
- ✅ ComfyUI art generation
- ✅ GM Control Panel functionality
- ✅ ASCII base model generation

**Without these, art generation features cannot function.**

---

## Lu Bu (10 images)

**Upload Here:** This folder (`lu-bu/`)

### Download Source
All images available at: [GitHub Issue #92](https://github.com/hvrryh-web/idk/issues/92#issuecomment-3649199612)

### Required Files

- [ ] `lu-bu-001-fullbody-primary.jpg`
  - URL: https://github.com/user-attachments/assets/e7e00e23-f8d3-4a72-a1f8-1baea51679a2
  - Description: Full body armored warrior pose
  - Use: Primary reference for full-body generation

- [ ] `lu-bu-002-costume-variants.jpg`
  - URL: https://github.com/user-attachments/assets/ee9c2343-d6f7-46fe-a175-8491b822d3ed
  - Description: Multiple armor variations and styles
  - Use: Reference for armor variety

- [ ] `lu-bu-003-combat-pose.jpg`
  - URL: https://github.com/user-attachments/assets/bd0dd1d3-ad62-4fc0-b696-a8423d211f93
  - Description: Dynamic combat stance with weapon
  - Use: Action pose reference for combat scenes

- [ ] `lu-bu-004-portrait-detail.jpg`
  - URL: https://github.com/user-attachments/assets/31ae98f9-930e-4ae0-9416-99ada1cc3d86
  - Description: Detailed facial close-up showing armor
  - Use: Face reference for facial consistency

- [ ] `lu-bu-005-standing-reference.jpg`
  - URL: https://github.com/user-attachments/assets/b84c0f2f-fd59-4141-bb27-706f5f2fc71e
  - Description: Full standing pose, complete armor design
  - Use: Pose reference for idle/commanding stances

- [ ] `lu-bu-006-reference.jpg`
  - URL: https://github.com/user-attachments/assets/7260bac4-05fe-43cd-a4db-a2bc88b213ac
  - Description: Additional reference material

- [ ] `lu-bu-007-reference.jpg`
  - URL: https://github.com/user-attachments/assets/b53b5017-d4db-41b5-8fa1-60a0b63dddf2
  - Description: Additional reference material

- [ ] `lu-bu-008-reference.jpg`
  - URL: https://github.com/user-attachments/assets/24f68dae-bc41-44a1-a63d-ed0290962830
  - Description: Additional reference material

- [ ] `lu-bu-009-reference.jpg`
  - URL: https://github.com/user-attachments/assets/4af1e41b-219d-481d-ab5a-8870a48bbe98
  - Description: Additional reference material

- [ ] `lu-bu-010-reference.jpg`
  - URL: https://github.com/user-attachments/assets/70b73481-d50f-4783-88fc-4c305bc0d3eb
  - Description: Additional reference material

### Character Details

**Visual Identity:**
- Gender: Male
- Archetype: Legendary warrior, unmatched martial prowess
- Primary Colors: Dark steel, black armor, red/crimson accents
- Hair: Long dark hair, dramatic movement
- Outfit: Heavy ornate armor with elaborate decorations
- Weapon: Sky Piercer (Fang Tian Ji) - crescent-bladed halberd

### Next Steps After Upload

1. ✅ Files uploaded to this folder
2. Run: `./tools/asset_pipeline_manager.py process`
3. Select 4-6 best images for LoRA training
4. Stage and approve for deployment
5. Files will be copied to:
   - `tools/comfyui/reference_images/lu-bu/`
   - `models/loras/training-data/lu-bu/` (selected images)
   - `frontend/public/assets/characters/reference/lu-bu/`

---

## Progress Tracker

**Lu Bu:** 0/10 uploaded  
**Status:** ⏳ Waiting for uploads

Once all 10 files are in this folder, run the processing command.
