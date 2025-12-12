#!/usr/bin/env python3
"""
Script to index docs/patch-notes/ and update CHANGELOG.md
"""
import os
import re
from datetime import datetime

PATCH_DIR = "docs/patch-notes/"
CHANGELOG = "CHANGELOG.md"
PATCH_PATTERN = re.compile(r"PATCH-(\d{8})-(\d{3})")

entries = []
for fname in sorted(os.listdir(PATCH_DIR)):
    if PATCH_PATTERN.match(fname):
        with open(os.path.join(PATCH_DIR, fname)) as f:
            content = f.read().strip()
        date, num = PATCH_PATTERN.match(fname).groups()
        entries.append(f"## Patch {date}-{num}\n\n{content}\n")

header = f"# Changelog\n\nLast updated: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n"
with open(CHANGELOG, "w") as f:
    f.write(header)
    for entry in entries:
        f.write(entry + "\n")
print(f"CHANGELOG.md updated with {len(entries)} patch notes.")
