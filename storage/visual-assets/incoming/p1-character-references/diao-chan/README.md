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

## Diao Chan (10 images)

**Upload Here:** This folder (`diao-chan/`)

### Download Source
All images available at: [GitHub Issue #92](https://github.com/hvrryh-web/idk/issues/92#issuecomment-3649199612)

### Required Files

- [ ] `diao-chan-001-fullbody-primary.jpg`
  - URL: https://github.com/user-attachments/assets/54792596-238c-42e7-bf77-c55429382940
  - Description: Full body pose, purple robes, dynamic flowing fabric
  - Use: Primary reference for full-body generation

- [ ] `diao-chan-002-costume-variants.jpg`
  - URL: https://github.com/user-attachments/assets/85367db6-c196-4dca-8737-c79a7b3332c8
  - Description: Multiple costume variations in horizontal layout
  - Use: Reference for outfit variety

- [ ] `diao-chan-003-artistic-portrait.jpg`
  - URL: https://github.com/user-attachments/assets/81585c59-6139-44cd-acba-c6d36c805268
  - Description: Soft painted style with ribbon weapon
  - Use: Style reference for artistic rendering

- [ ] `diao-chan-004-closeup-portrait.jpg`
  - URL: https://github.com/user-attachments/assets/18714f50-cc38-4521-b1e5-3a01f249602c
  - Description: Detailed facial close-up with ornate accessories
  - Use: Face reference for facial consistency

- [ ] `diao-chan-005-standing-pose.jpg`
  - URL: https://github.com/user-attachments/assets/193d7b73-3764-4b70-b762-5ec2ad71e0f5
  - Description: Full body standing pose with weapon
  - Use: Pose reference for combat/idle stances

- [ ] `diao-chan-006-reference.jpg`
  - URL: https://github.com/user-attachments/assets/5be6ba86-82f9-40ae-bf35-5d73f7188dbe
  - Description: Additional reference material

- [ ] `diao-chan-007-reference.jpg`
  - URL: https://github.com/user-attachments/assets/c33bc381-12b7-46cb-803e-209df95ef198
  - Description: Additional reference material

- [ ] `diao-chan-008-reference.jpg`
  - URL: https://github.com/user-attachments/assets/08d05ca2-b65a-4b24-b17e-6bbab9ed483e
  - Description: Additional reference material

- [ ] `diao-chan-009-reference.jpg`
  - URL: https://github.com/user-attachments/assets/594f25a4-8e9c-4f8d-bc59-d7c32df2c156
  - Description: Additional reference material

- [ ] `diao-chan-010-reference.jpg`
  - URL: https://github.com/user-attachments/assets/07912207-4d9c-4656-bac4-ce1f0f871891
  - Description: Additional reference material

### Character Details

**Visual Identity:**
- Gender: Female
- Archetype: Legendary beauty, elegant warrior
- Primary Colors: Purple, pink, jade green
- Hair: Long black with elaborate ornaments
- Outfit: Flowing robes with layered fabrics
- Weapon: Chain whip or ribbon weapon

### Next Steps After Upload

1. ✅ Files uploaded to this folder
2. Run: `./tools/asset_pipeline_manager.py process`
3. Select 4-6 best images for LoRA training
4. Stage and approve for deployment
5. Files will be copied to:
   - `tools/comfyui/reference_images/diao-chan/`
   - `models/loras/training-data/diao-chan/` (selected images)
   - `frontend/public/assets/characters/reference/diao-chan/`

---

## Progress Tracker

**Diao Chan:** 0/10 uploaded  
**Status:** ⏳ Waiting for uploads

Once all 10 files are in this folder, run the processing command.
