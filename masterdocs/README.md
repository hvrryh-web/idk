# Masterdocs — Ingest Segmentation Task

Task: Segment Masterdocs into ingestible chunks for downstream processing (embedding, indexing, QA/chat, etc.)

Goal
- Break large Masterdoc files into chunks that are within the target token/size limits for your ingestion pipeline while preserving coherence, context, and retrievability.

Constraints
- Target maximum chunk size: X tokens (replace X with your ingestion limit, e.g., 2000 tokens).
- Overlap: 10–20% overlap between adjacent chunks to preserve context (adjust as needed).
- Chunk boundaries should prefer semantic boundaries (headings, sections, paragraphs) over fixed byte/line counts.

Step-by-step procedure
1. Determine limits
   - Confirm the maximum tokens/characters per chunk allowed by your embedding or LLM ingestion system (set as TARGET_TOKENS).
   - Decide overlap size (OVERLAP_TOKENS or percentage).

2. Preprocess the Masterdoc
   - Normalize whitespace and remove extraneous control characters.
   - Keep any important metadata (document title, author, date, version) in the document header.
   - Optionally split out non-text assets (images, binary attachments) and reference them via metadata.

3. Segment by semantic structure (preferred)
   - Use document outline/headings (H1, H2, H3) to split into natural sections.
   - If a section exceeds TARGET_TOKENS, recursively split by subsections, then by paragraphs, then by sentence boundaries.
   - Make sure chunks start and end at logical points (e.g., not mid-sentence).

4. Fallback segmentation rules
   - If semantic boundaries are absent or unreliable, segment by paragraph groups (aggregate paragraphs until approaching TARGET_TOKENS).
   - If paragraphs are extremely long, split within paragraphs at sentence boundaries.

5. Overlap and context
   - Add an OVERLAP (e.g., the last N sentences or M tokens of the previous chunk) at the beginning of the next chunk to maintain continuity.
   - Ensure overlap does not push a chunk over TARGET_TOKENS.

6. Metadata and chunk naming
   - Each chunk should include metadata:
     - source_document: original filename or ID
     - chunk_id: e.g., `<source>_part_001`
     - chunk_index: integer
     - total_chunks (optional)
     - position_hint: heading path or character range
     - created_at and version
   - Use a consistent filename scheme, e.g. `sourcefilename__part_001.md` or JSONL entries.

7. File formats for ingestion
   - Textual chunks: Markdown (.md) or plain text (.txt) preserving headings.
   - Structured ingestion: JSONL with fields {id, text, metadata}.
   - Ensure encoding is UTF-8.

8. Quality checks
   - Verify token/character counts per chunk are within limits.
   - Run a quick coherence check: last sentence of chunk N and first sentence of chunk N+1 should not be duplicate (deduplicate overlap if necessary).
   - Ensure all headings are preserved in at least the first chunk that contains them.

9. Indexing & provenance
   - Keep a mapping file (manifest) that lists all chunks and their source metadata for traceability.
   - Store original Masterdoc and the segmentation manifest alongside the chunks.

10. Automation tips
   - Implement a script that:
     - Accepts a Masterdoc path and TARGET_TOKENS + OVERLAP settings.
     - Emits chunks in the chosen format and updates the manifest.
   - Use existing libraries for token counting for your model (e.g., tiktoken or tokenizer appropriate to your LLM).
   - Add a dry-run mode that outputs chunk boundaries without writing files.

11. Acceptance criteria
   - All original content is covered by the chunks or the manifest references (no untracked sections).
   - No chunk exceeds TARGET_TOKENS.
   - Metadata present and consistent for all chunks.
   - Manifest exists and is machine-readable (JSON or CSV).

Example (high-level)
- Masterdoc: product_spec.md (20k tokens)
- TARGET_TOKENS = 2000, OVERLAP = 200 tokens
- Result: product_spec__part_001.md … product_spec__part_010.md + manifest.jsonl

Notes and next steps
- Replace placeholder TARGET_TOKENS with your actual ingestion limits.
- If you want, I can supply a reference segmentation script (Python) that uses a tokenizer to split by tokens and produce JSONL output.
