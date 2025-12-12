#!/usr/bin/env python3
"""
Asset naming linter for frontend/public/assets/
"""
import os
import re

PATTERN = re.compile(r"^[a-z]+-[a-z0-9-]+-[a-z0-9]+_[1-2]x\.(png|svg|webp|woff2|json)$")
ASSET_DIR = "frontend/public/assets"
invalid = []
for fname in os.listdir(ASSET_DIR):
    if not PATTERN.match(fname):
        invalid.append(fname)
if invalid:
    print("Invalid asset names:")
    for f in invalid:
        print(f"  {f}")
    exit(1)
else:
    print("All asset names are valid.")
