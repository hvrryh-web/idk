# 📢 SRD v0.3 Release Announcement

## WUXUXIANXIA TTRPG - Unified SRD Alpha v0.3

**Release Date**: December 12, 2025
**Patch ID**: ALPHA-0.3.0-20251212
**Status**: 🟢 LIVE

---

## 🎉 What's New

We're excited to announce the release of **SRD v0.3** - the first unified System Reference Document for WUXUXIANXIA! This release consolidates all previous patches and adds major new systems.

### Highlights

🔄 **Unified SRD** - One comprehensive document replaces fragmented patches
⚔️ **Complete Cap System** - New 4×SCL formula with finer granularity
🩸 **Power Draws Blood Profiles** - Glass Cannon, Balanced, and Bulwark builds
🛡️ **Layered Durability** - Resolve Charges + DR Tiers for tactical depth
💎 **Meta-Currency System** - Fury, Clout, and Insight with clear spend rules
📊 **Boss Scaling** - Ranks 1-5 with multipliers for balanced encounters
🔧 **Backend Integration** - Code-level validation for character builders

---

## 📖 New Content

### Section 5: Caps, Tradeoffs & Power Draws Blood

The new cap system provides the mechanical foundation for balanced character building:

**Cap Formula**: `OVR + Effect Rank ≤ 4 × SCL`

**Power Draws Blood Profiles** (choose per pillar):
| Profile | Offense | Defense | Cost |
|---------|---------|---------|------|
| Balanced | 4×SCL | 4×SCL | None |
| Blood-Forward | 4×SCL+2 | 4×SCL-2 | Blood Track when hurt |
| Ward-Forward | 4×SCL-2 | 4×SCL+2 | Blood Track when killing |

This creates meaningful tradeoffs where specialization has real costs.

---

### Section 6: Durability Model & Damage Reduction

Combat now features a three-layer durability system:

**Layer 1: Resolve Charges**
- Physical (PRC), Mental (MRC), Spiritual (SRC)
- Deplete first when taking damage
- Enable Damage Reduction while active

**Layer 2: DR Tiers (0-6)**
- 0% to 60% damage reduction
- Only works while Resolve Charges remain
- Creates "break their armor" tactical gameplay

**Layer 3: Health Pools**
- THP (physical), MHP (mental), SP (spiritual)
- Final damage destination

---

### Section 7: Meta-Currencies & Cost Tracks

#### Meta-Currencies

| Currency | Pillar | Generation | Max |
|----------|--------|------------|-----|
| **Fury** | Violence | Crits, taking damage | 10 |
| **Clout** | Influence | Social victories | 10 |
| **Insight** | Revelation | Forbidden knowledge | 10 |

#### Spend Options (1/2/3/5 cost for escalating effects)
- Reroll attacks
- Bonus to rolls
- Auto-succeed saves
- Special effects

#### Cost Tracks

Blood, Fate, and Stain tracks mark when you:
- Push beyond limits (Blood)
- Manipulate destiny (Fate)
- Use forbidden techniques (Stain)

---

### Section 8: Boss Scaling Guidelines

GMs can now quickly build balanced bosses:

| Rank | HP Multiplier | Phases | Equivalent To |
|------|---------------|--------|---------------|
| 1 | 1.5× | 1 | 1-2 party members |
| 2 | 2.0× | 1 | 2-3 party members |
| 3 | 3.0× | 1 | Full party |
| 4 | 4.0× | 2 | Full party + challenge |
| 5 | 5.0× | 3 | Major boss fight |

---

## 🔧 Technical Integration

This release includes backend code integration:

**New Modules**:
- `srd_constants.py` - All game formulas and values
- `srd_validation.py` - Character cap validation
- `srd_diagnostics.py` - Debug and troubleshooting tools

**For Developers**:
```python
from app.core.srd_constants import calculate_off_cap, PDBProfile

# Calculate offense cap for SCL 5 Blood-Forward build
cap = calculate_off_cap(scl=5, profile=PDBProfile.BLOOD_FORWARD)
# Returns 22 (4*5 + 2)
```

**61 Unit Tests** ensure all formulas are correctly implemented.

---

## 📦 Migration Guide

### From Patches 0.1/0.2

1. **Use SRD_UNIFIED.md** as your primary reference
2. Previous patch files remain for historical reference
3. No rule changes to Sections 0-4 (just reorganized)
4. New Sections 5-8 add content, don't change existing

### For Character Builders

1. Update cap calculations to use 4×SCL formula
2. Add PDB profile selection per pillar
3. Implement Resolve Charge tracking
4. Add meta-currency pools

### For GMs

1. Use boss scaling table for quick encounter building
2. DR Tiers replace simple damage reduction
3. Track meta-currencies per encounter

---

## 🗓️ What's Next

### Patch 0.4 (Planned)
- Complete technique system with effect framework
- Equipment and artifact rules

### Patch 0.5 (Planned)
- GM guidelines for encounter building
- Setting and cosmology content

### Beta 1.0 (Target)
- Full frontend integration
- Complete playtest release

---

## 📁 Documentation

| Document | Purpose |
|----------|---------|
| `SRD_UNIFIED.md` | Complete rules reference |
| `SRD_INTEGRATION_GUIDE.md` | Backend integration details |
| `SRD_v0.3_DEV_DISCUSSION.md` | Design rationale |
| `PATCH-20251212-001.md` | Technical change log |

---

## 💬 Feedback

We want to hear from you! Focus areas for playtesting:

- Is the 4×SCL cap intuitive?
- Do PDB profiles create interesting choices?
- Is the Resolve Charge system tactical?
- Are meta-currency costs balanced?
- Does boss scaling produce fun encounters?

---

## 🙏 Acknowledgments

Thanks to everyone who provided feedback on patches 0.1 and 0.2. Your input shaped this unified release.

---

**Happy cultivating!** 🐉

---

*WUXUXIANXIA TTRPG Development Team*
*December 12, 2025*
