#!/usr/bin/env node
/**
 * Wiki Character Art Generator
 * 
 * Generates high-quality character artwork for wiki pages using ComfyUI.
 * Only processes Player Characters and Named Characters with allowed: true.
 * 
 * Usage:
 *   npx tsx tools/generate_wiki_character_art.ts [options]
 * 
 * Options:
 *   --manifest <path>      Path to wiki_characters.json manifest (default: manifests/wiki_characters.json)
 *   --char <char_id>       Generate for specific character only
 *   --type <type>          Generate only: portrait, fullbody, or expressions
 *   --variant <variant>    Generate specific variant only
 *   --dry-run              Preview what would be generated without calling ComfyUI
 *   --output <path>        Override output directory
 *   --help                 Show this help message
 */

import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';

// ============================================================================
// Type Definitions
// ============================================================================

interface VisualTraits {
  gender: string;
  age_range: string;
  hair_color: string;
  hair_style: string;
  eye_color: string;
  skin_tone: string;
  build: string;
  distinctive_features: string | null;
}

interface Outfit {
  description: string;
  primary_color: string;
  secondary_color: string;
  accent_color?: string;
  armor_elements?: string[] | null;
  style_tier: string;
}

interface SignatureProps {
  weapon?: string;
  accessories?: string[];
}

interface Palette {
  primary: string;
  secondary: string;
  accent: string;
  background_gradient?: string[];
}

interface CharacterVariants {
  portrait?: string[];
  fullbody?: string[];
  expressions?: string[];
}

interface GenerationSeeds {
  portrait_base: number;
  fullbody_base: number;
  expressions_base: number;
}

interface Character {
  char_id: string;
  display_name: string;
  role: string;
  faction: string;
  character_type: string;
  allowed: boolean;
  visual_traits: VisualTraits;
  outfit: Outfit;
  signature_props?: SignatureProps;
  palette: Palette;
  variants: CharacterVariants;
  generation_seeds?: GenerationSeeds;
}

interface GenerationConfig {
  output_base_path: string;
  checkpoint_model: string;
  house_style_lora: string | null;
  enable_background_removal: boolean;
  generate_thumbnails: boolean;
  thumbnail_size: { width: number; height: number };
}

interface Manifest {
  name: string;
  version: string;
  generation_config: GenerationConfig;
  characters: Character[];
}

interface GenerationJob {
  char_id: string;
  display_name: string;
  type: 'portrait' | 'fullbody' | 'expressions';
  variant: string;
  seed: number;
  prompt: string;
  negative_prompt: string;
  output_path: string;
  metadata: Record<string, unknown>;
}

interface GenerationResult {
  job: GenerationJob;
  success: boolean;
  output_file?: string;
  error?: string;
  prompt_id?: string;
}

// ============================================================================
// Style Block Definitions
// ============================================================================

const STYLE_BLOCK = `masterpiece, best quality, highly detailed illustration, modern manga illustration style, professional character art, crisp confident ink lines, clean linework, minimal sketchiness, smooth controlled shading, cel-to-soft shading hybrid, tasteful gradients, high-fidelity facial features, detailed expressive eyes, clean skin rendering, costume detail emphasis, embroidered trims, brocade patterns, intricate accessories, Romance of Three Kingdoms aesthetic, Han dynasty inspired, wuxia xianxia fantasy, rich saturated colors, controlled highlights, strong silhouette readability, studio lighting, professional game illustration, AAA character art quality, sharp focus, high contrast, vibrant yet tasteful color palette, three kingdoms color palette, rich reds, blacks, jade teal accents, gold trim`;

const NEGATIVE_BLOCK = `lowres, bad anatomy, bad hands, missing fingers, extra fingers, extra digits, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, logo, text, typography, cover text, title text, blurry, out of focus, photoreal skin pores, overly realistic, hyper realistic, oversharp AI artifacts, noise, dithering, deformed, anime chibi, super deformed, cartoonish, heavy painterly smears, oil painting texture, impressionist blur, overexposed bloom, lens flare, chromatic aberration, western comic style, american cartoon, disney style, 3d render, cgi, uncanny valley, duplicate, multiple views on single canvas, split image, nsfw, nude, suggestive, revealing clothing, background clutter, busy background, noisy background`;

const PORTRAIT_COMPOSITION = `character portrait, bust shot, upper body portrait, 3/4 view facing slightly left, centered composition, clean gradient background, studio backdrop, dramatic rim lighting from upper left, high detail face, expressive eyes, dignified expression, hands not visible or simplified`;

const FULLBODY_COMPOSITION = `full body character render, standing pose, dynamic stance, full figure visible from head to feet, clean studio background, subtle gradient, professional lighting setup, rim light accent, detailed costume, visible accessories, centered composition, strong silhouette`;

const EXPRESSION_COMPOSITION = `character expression sheet, bust portrait, face-focused crop, consistent character identity throughout, same outfit, same lighting, clean white background, uniform framing`;

// ============================================================================
// Utility Functions
// ============================================================================

function loadManifest(manifestPath: string): Manifest {
  const fullPath = path.resolve(manifestPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Manifest file not found: ${fullPath}`);
  }
  const content = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(content);
}

function buildCharacterPrompt(char: Character, type: 'portrait' | 'fullbody' | 'expressions'): string {
  const traits = char.visual_traits;
  const outfit = char.outfit;
  
  // Build visual traits description
  const visualDesc = [
    `${traits.gender}`,
    `${traits.age_range} age`,
    `${traits.hair_color} ${traits.hair_style} hair`,
    `${traits.eye_color} eyes`,
    `${traits.skin_tone} skin`,
    `${traits.build} build`,
    traits.distinctive_features || ''
  ].filter(Boolean).join(', ');
  
  // Build outfit description
  const outfitDesc = [
    outfit.description,
    `${outfit.primary_color} primary color`,
    `${outfit.secondary_color} secondary accents`,
    outfit.accent_color ? `${outfit.accent_color} accent details` : '',
    outfit.armor_elements ? outfit.armor_elements.join(', ') : ''
  ].filter(Boolean).join(', ');
  
  // Build signature props
  const propsDesc = char.signature_props ? [
    char.signature_props.weapon || '',
    ...(char.signature_props.accessories || [])
  ].filter(Boolean).join(', ') : '';
  
  // Build faction colors
  const factionColors = `${char.faction} faction colors`;
  
  // Select composition based on type
  let composition: string;
  switch (type) {
    case 'portrait':
      composition = PORTRAIT_COMPOSITION;
      break;
    case 'fullbody':
      composition = FULLBODY_COMPOSITION;
      break;
    case 'expressions':
      composition = EXPRESSION_COMPOSITION;
      break;
  }
  
  // Combine all elements
  const prompt = [
    STYLE_BLOCK,
    composition,
    char.display_name,
    visualDesc,
    outfitDesc,
    propsDesc,
    factionColors
  ].filter(Boolean).join(', ');
  
  return prompt;
}

function getSeed(char: Character, type: 'portrait' | 'fullbody' | 'expressions', variantIndex: number): number {
  const seeds = char.generation_seeds || {
    portrait_base: hashString(char.char_id + '_portrait') % 2147483647,
    fullbody_base: hashString(char.char_id + '_fullbody') % 2147483647,
    expressions_base: hashString(char.char_id + '_expressions') % 2147483647
  };
  
  switch (type) {
    case 'portrait':
      return seeds.portrait_base + variantIndex;
    case 'fullbody':
      return seeds.fullbody_base + variantIndex;
    case 'expressions':
      return seeds.expressions_base + variantIndex;
  }
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// ============================================================================
// ComfyUI API Functions
// ============================================================================

async function httpRequest(
  url: string,
  options: { method: string; headers?: Record<string, string> },
  data?: string
): Promise<{ status: number; data: unknown }> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode || 0, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode || 0, data: body });
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function checkComfyUIHealth(comfyuiUrl: string): Promise<boolean> {
  try {
    const response = await httpRequest(`${comfyuiUrl}/system_stats`, { method: 'GET' });
    return response.status === 200;
  } catch {
    return false;
  }
}

async function submitWorkflow(
  comfyuiUrl: string,
  workflow: Record<string, unknown>
): Promise<string | null> {
  try {
    const response = await httpRequest(
      `${comfyuiUrl}/prompt`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      JSON.stringify({ prompt: workflow })
    );
    
    if (response.status === 200 && typeof response.data === 'object' && response.data !== null) {
      return (response.data as { prompt_id?: string }).prompt_id || null;
    }
  } catch (error) {
    console.error('Error submitting workflow:', error);
  }
  return null;
}

async function pollForCompletion(
  comfyuiUrl: string,
  promptId: string,
  timeout: number = 300,
  interval: number = 2
): Promise<Record<string, unknown> | null> {
  const startTime = Date.now();
  
  while ((Date.now() - startTime) < timeout * 1000) {
    try {
      const response = await httpRequest(
        `${comfyuiUrl}/history/${promptId}`,
        { method: 'GET' }
      );
      
      if (response.status === 200 && typeof response.data === 'object' && response.data !== null) {
        const data = response.data as Record<string, unknown>;
        const promptData = data[promptId] as Record<string, unknown> | undefined;
        
        if (promptData?.outputs) {
          return promptData;
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, interval * 1000));
    } catch (error) {
      console.error('Error polling:', error);
    }
  }
  
  return null;
}

async function downloadImage(
  comfyuiUrl: string,
  filename: string,
  outputPath: string
): Promise<boolean> {
  return new Promise((resolve) => {
    const url = `${comfyuiUrl}/view?filename=${encodeURIComponent(filename)}`;
    const file = fs.createWriteStream(outputPath);
    
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    protocol.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      console.error('Download error:', err);
      resolve(false);
    });
  });
}

// ============================================================================
// Workflow Building Functions
// ============================================================================

function buildPortraitWorkflow(
  job: GenerationJob,
  config: GenerationConfig
): Record<string, unknown> {
  return {
    "1": {
      "class_type": "CheckpointLoaderSimple",
      "inputs": {
        "ckpt_name": config.checkpoint_model
      }
    },
    "2": {
      "class_type": "CLIPTextEncode",
      "inputs": {
        "text": job.prompt,
        "clip": ["1", 1]
      }
    },
    "3": {
      "class_type": "CLIPTextEncode",
      "inputs": {
        "text": job.negative_prompt,
        "clip": ["1", 1]
      }
    },
    "4": {
      "class_type": "EmptyLatentImage",
      "inputs": {
        "width": 1024,
        "height": 1536,
        "batch_size": 1
      }
    },
    "5": {
      "class_type": "KSampler",
      "inputs": {
        "seed": job.seed,
        "steps": 30,
        "cfg": 7.0,
        "sampler_name": "dpmpp_2m",
        "scheduler": "karras",
        "denoise": 1.0,
        "model": ["1", 0],
        "positive": ["2", 0],
        "negative": ["3", 0],
        "latent_image": ["4", 0]
      }
    },
    "6": {
      "class_type": "VAEDecode",
      "inputs": {
        "samples": ["5", 0],
        "vae": ["1", 2]
      }
    },
    "7": {
      "class_type": "SaveImage",
      "inputs": {
        "filename_prefix": `wiki_${job.char_id}_portrait_${job.variant}`,
        "images": ["6", 0]
      }
    }
  };
}

function buildFullbodyWorkflow(
  job: GenerationJob,
  config: GenerationConfig
): Record<string, unknown> {
  return {
    "1": {
      "class_type": "CheckpointLoaderSimple",
      "inputs": {
        "ckpt_name": config.checkpoint_model
      }
    },
    "2": {
      "class_type": "CLIPTextEncode",
      "inputs": {
        "text": job.prompt,
        "clip": ["1", 1]
      }
    },
    "3": {
      "class_type": "CLIPTextEncode",
      "inputs": {
        "text": job.negative_prompt + ", cut off feet, cropped body",
        "clip": ["1", 1]
      }
    },
    "4": {
      "class_type": "EmptyLatentImage",
      "inputs": {
        "width": 1024,
        "height": 1536,
        "batch_size": 1
      }
    },
    "5": {
      "class_type": "KSampler",
      "inputs": {
        "seed": job.seed,
        "steps": 30,
        "cfg": 7.0,
        "sampler_name": "dpmpp_2m",
        "scheduler": "karras",
        "denoise": 1.0,
        "model": ["1", 0],
        "positive": ["2", 0],
        "negative": ["3", 0],
        "latent_image": ["4", 0]
      }
    },
    "6": {
      "class_type": "VAEDecode",
      "inputs": {
        "samples": ["5", 0],
        "vae": ["1", 2]
      }
    },
    "7": {
      "class_type": "SaveImage",
      "inputs": {
        "filename_prefix": `wiki_${job.char_id}_fullbody_${job.variant}`,
        "images": ["6", 0]
      }
    }
  };
}

function buildExpressionsWorkflow(
  job: GenerationJob,
  config: GenerationConfig
): Record<string, unknown> {
  // For expressions, we generate a batch
  return {
    "1": {
      "class_type": "CheckpointLoaderSimple",
      "inputs": {
        "ckpt_name": config.checkpoint_model
      }
    },
    "2": {
      "class_type": "CLIPTextEncode",
      "inputs": {
        "text": job.prompt + ", multiple expressions, neutral happy angry sad determined surprised, consistent identity throughout",
        "clip": ["1", 1]
      }
    },
    "3": {
      "class_type": "CLIPTextEncode",
      "inputs": {
        "text": job.negative_prompt + ", different character between expressions, inconsistent features",
        "clip": ["1", 1]
      }
    },
    "4": {
      "class_type": "EmptyLatentImage",
      "inputs": {
        "width": 1024,
        "height": 1024,
        "batch_size": 6
      }
    },
    "5": {
      "class_type": "KSampler",
      "inputs": {
        "seed": job.seed,
        "steps": 28,
        "cfg": 7.0,
        "sampler_name": "dpmpp_2m",
        "scheduler": "karras",
        "denoise": 1.0,
        "model": ["1", 0],
        "positive": ["2", 0],
        "negative": ["3", 0],
        "latent_image": ["4", 0]
      }
    },
    "6": {
      "class_type": "VAEDecode",
      "inputs": {
        "samples": ["5", 0],
        "vae": ["1", 2]
      }
    },
    "7": {
      "class_type": "SaveImage",
      "inputs": {
        "filename_prefix": `wiki_${job.char_id}_expressions`,
        "images": ["6", 0]
      }
    }
  };
}

// ============================================================================
// Main Generation Logic
// ============================================================================

function buildGenerationJobs(
  manifest: Manifest,
  targetCharId?: string,
  targetType?: string,
  targetVariant?: string
): GenerationJob[] {
  const jobs: GenerationJob[] = [];
  const config = manifest.generation_config;
  
  for (const char of manifest.characters) {
    // Skip if not allowed
    if (!char.allowed) {
      console.log(`⏭️  Skipping ${char.display_name} (${char.char_id}) - not allowed for wiki art generation`);
      continue;
    }
    
    // Skip if specific character requested and this isn't it
    if (targetCharId && char.char_id !== targetCharId) {
      continue;
    }
    
    const charOutputDir = path.join(config.output_base_path, char.char_id);
    
    // Portrait variants
    if ((!targetType || targetType === 'portrait') && char.variants.portrait) {
      for (let i = 0; i < char.variants.portrait.length; i++) {
        const variant = char.variants.portrait[i];
        if (targetVariant && variant !== targetVariant) continue;
        
        const seed = getSeed(char, 'portrait', i);
        const outputPath = path.join(charOutputDir, `portrait_${variant}_${seed}.png`);
        
        jobs.push({
          char_id: char.char_id,
          display_name: char.display_name,
          type: 'portrait',
          variant,
          seed,
          prompt: buildCharacterPrompt(char, 'portrait'),
          negative_prompt: NEGATIVE_BLOCK,
          output_path: outputPath,
          metadata: {
            workflow_name: 'wiki_char_portrait_detailed',
            workflow_version: '1.0.0',
            character_id: char.char_id,
            character_name: char.display_name,
            faction: char.faction,
            role: char.role,
            variant,
            seed,
            checkpoint_model: config.checkpoint_model,
            resolution: { width: 1024, height: 1536 }
          }
        });
      }
    }
    
    // Full-body variants
    if ((!targetType || targetType === 'fullbody') && char.variants.fullbody) {
      for (let i = 0; i < char.variants.fullbody.length; i++) {
        const variant = char.variants.fullbody[i];
        if (targetVariant && variant !== targetVariant) continue;
        
        const seed = getSeed(char, 'fullbody', i);
        const outputPath = path.join(charOutputDir, `fullbody_${variant}_${seed}.png`);
        
        jobs.push({
          char_id: char.char_id,
          display_name: char.display_name,
          type: 'fullbody',
          variant,
          seed,
          prompt: buildCharacterPrompt(char, 'fullbody'),
          negative_prompt: NEGATIVE_BLOCK,
          output_path: outputPath,
          metadata: {
            workflow_name: 'wiki_char_fullbody_detailed',
            workflow_version: '1.0.0',
            character_id: char.char_id,
            character_name: char.display_name,
            faction: char.faction,
            role: char.role,
            variant,
            seed,
            checkpoint_model: config.checkpoint_model,
            resolution: { width: 1024, height: 1536 }
          }
        });
      }
    }
    
    // Expression sheets
    if ((!targetType || targetType === 'expressions') && char.variants.expressions) {
      for (let i = 0; i < char.variants.expressions.length; i++) {
        const variant = char.variants.expressions[i];
        if (targetVariant && variant !== targetVariant) continue;
        
        const seed = getSeed(char, 'expressions', i);
        const outputPath = path.join(charOutputDir, `expressions_${seed}.png`);
        
        jobs.push({
          char_id: char.char_id,
          display_name: char.display_name,
          type: 'expressions',
          variant,
          seed,
          prompt: buildCharacterPrompt(char, 'expressions'),
          negative_prompt: NEGATIVE_BLOCK,
          output_path: outputPath,
          metadata: {
            workflow_name: 'wiki_char_expressions_sheet',
            workflow_version: '1.0.0',
            character_id: char.char_id,
            character_name: char.display_name,
            faction: char.faction,
            role: char.role,
            grid_layout: variant === 'extended_9' ? '3x3' : '2x3',
            seed,
            checkpoint_model: config.checkpoint_model,
            resolution: { width: 2048, height: 3072 }
          }
        });
      }
    }
  }
  
  return jobs;
}

async function executeJob(
  job: GenerationJob,
  config: GenerationConfig,
  comfyuiUrl: string,
  dryRun: boolean
): Promise<GenerationResult> {
  console.log(`\n🎨 Generating: ${job.display_name} - ${job.type} (${job.variant})`);
  console.log(`   Seed: ${job.seed}`);
  console.log(`   Output: ${job.output_path}`);
  
  if (dryRun) {
    console.log('   [DRY RUN] Would generate with ComfyUI');
    return { job, success: true };
  }
  
  // Build appropriate workflow
  let workflow: Record<string, unknown>;
  switch (job.type) {
    case 'portrait':
      workflow = buildPortraitWorkflow(job, config);
      break;
    case 'fullbody':
      workflow = buildFullbodyWorkflow(job, config);
      break;
    case 'expressions':
      workflow = buildExpressionsWorkflow(job, config);
      break;
  }
  
  // Submit to ComfyUI
  const promptId = await submitWorkflow(comfyuiUrl, workflow);
  if (!promptId) {
    return { job, success: false, error: 'Failed to submit workflow to ComfyUI' };
  }
  
  console.log(`   Submitted (prompt_id: ${promptId})`);
  
  // Poll for completion
  const result = await pollForCompletion(comfyuiUrl, promptId);
  if (!result) {
    return { job, success: false, error: 'Workflow execution failed or timed out', prompt_id: promptId };
  }
  
  // Extract output filename
  const outputs = result.outputs as Record<string, { images?: { filename: string }[] }>;
  let outputFilename: string | undefined;
  
  for (const nodeOutput of Object.values(outputs)) {
    if (nodeOutput?.images?.[0]?.filename) {
      outputFilename = nodeOutput.images[0].filename;
      break;
    }
  }
  
  if (!outputFilename) {
    return { job, success: false, error: 'No output image found', prompt_id: promptId };
  }
  
  // Ensure output directory exists
  ensureDirectoryExists(path.dirname(job.output_path));
  
  // Download image
  const downloadSuccess = await downloadImage(comfyuiUrl, outputFilename, job.output_path);
  if (!downloadSuccess) {
    return { job, success: false, error: 'Failed to download generated image', prompt_id: promptId };
  }
  
  // Write sidecar metadata JSON
  const metadataPath = job.output_path.replace('.png', '.json');
  const metadata = {
    ...job.metadata,
    prompt_positive: job.prompt,
    prompt_negative: job.negative_prompt,
    generation_timestamp: new Date().toISOString(),
    comfyui_prompt_id: promptId
  };
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  console.log(`   ✅ Saved: ${job.output_path}`);
  
  return { job, success: true, output_file: job.output_path, prompt_id: promptId };
}

async function generateIndex(
  results: GenerationResult[],
  outputBasePath: string
): Promise<void> {
  const successfulResults = results.filter(r => r.success && r.output_file);
  
  const index = {
    generated_at: new Date().toISOString(),
    total_generated: successfulResults.length,
    characters: {} as Record<string, {
      display_name: string;
      assets: {
        portraits: string[];
        fullbody: string[];
        expressions: string[];
      };
    }>
  };
  
  for (const result of successfulResults) {
    const charId = result.job.char_id;
    
    if (!index.characters[charId]) {
      index.characters[charId] = {
        display_name: result.job.display_name,
        assets: {
          portraits: [],
          fullbody: [],
          expressions: []
        }
      };
    }
    
    const relativePath = result.output_file!.replace(outputBasePath + '/', '');
    
    switch (result.job.type) {
      case 'portrait':
        index.characters[charId].assets.portraits.push(relativePath);
        break;
      case 'fullbody':
        index.characters[charId].assets.fullbody.push(relativePath);
        break;
      case 'expressions':
        index.characters[charId].assets.expressions.push(relativePath);
        break;
    }
  }
  
  const indexPath = path.join(outputBasePath, 'index.json');
  ensureDirectoryExists(outputBasePath);
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`\n📋 Index written to: ${indexPath}`);
}

// ============================================================================
// CLI Entry Point
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  // Parse arguments
  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx >= 0 && args[idx + 1] ? args[idx + 1] : undefined;
  };
  
  const hasFlag = (flag: string): boolean => args.includes(flag);
  
  if (hasFlag('--help') || hasFlag('-h')) {
    console.log(`
Wiki Character Art Generator

Generates high-quality character artwork for wiki pages using ComfyUI.
Only processes Player Characters and Named Characters with allowed: true.

Usage:
  npx tsx tools/generate_wiki_character_art.ts [options]

Options:
  --manifest <path>      Path to wiki_characters.json manifest
                         (default: manifests/wiki_characters.json)
  --char <char_id>       Generate for specific character only
  --type <type>          Generate only: portrait, fullbody, or expressions
  --variant <variant>    Generate specific variant only
  --dry-run              Preview what would be generated without calling ComfyUI
  --output <path>        Override output directory
  --comfyui-url <url>    ComfyUI server URL (default: http://127.0.0.1:8188)
  --help                 Show this help message

Examples:
  # Generate all wiki art for all allowed characters
  npx tsx tools/generate_wiki_character_art.ts

  # Generate only portraits for a specific character
  npx tsx tools/generate_wiki_character_art.ts --char pc-001 --type portrait

  # Preview what would be generated
  npx tsx tools/generate_wiki_character_art.ts --dry-run
`);
    return;
  }
  
  const manifestPath = getArg('--manifest') || 'manifests/wiki_characters.json';
  const targetCharId = getArg('--char');
  const targetType = getArg('--type');
  const targetVariant = getArg('--variant');
  const dryRun = hasFlag('--dry-run');
  const outputOverride = getArg('--output');
  const comfyuiUrl = getArg('--comfyui-url') || process.env.COMFYUI_URL || 'http://127.0.0.1:8188';
  
  console.log('🖼️  Wiki Character Art Generator');
  console.log('================================\n');
  
  // Load manifest
  console.log(`Loading manifest: ${manifestPath}`);
  let manifest: Manifest;
  try {
    manifest = loadManifest(manifestPath);
    console.log(`✅ Loaded manifest v${manifest.version} with ${manifest.characters.length} characters`);
  } catch (error) {
    console.error(`❌ Failed to load manifest: ${error}`);
    process.exit(1);
  }
  
  // Override output path if specified
  if (outputOverride) {
    manifest.generation_config.output_base_path = outputOverride;
  }
  
  // Check ComfyUI availability (unless dry run)
  if (!dryRun) {
    console.log(`\nChecking ComfyUI at ${comfyuiUrl}...`);
    const isHealthy = await checkComfyUIHealth(comfyuiUrl);
    if (!isHealthy) {
      console.error('❌ ComfyUI is not available. Please start ComfyUI and try again.');
      console.error('   Or use --dry-run to preview what would be generated.');
      process.exit(1);
    }
    console.log('✅ ComfyUI is available');
  }
  
  // Build job list
  const jobs = buildGenerationJobs(manifest, targetCharId, targetType, targetVariant);
  
  if (jobs.length === 0) {
    console.log('\n⚠️  No jobs to process. Check:');
    console.log('   - Characters have allowed: true');
    console.log('   - Characters have variants defined');
    console.log('   - Filter options (--char, --type, --variant) match existing entries');
    return;
  }
  
  console.log(`\n📝 Generation Plan: ${jobs.length} jobs`);
  
  // Count by type
  const typeCounts = jobs.reduce((acc, job) => {
    acc[job.type] = (acc[job.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log(`   Portraits: ${typeCounts['portrait'] || 0}`);
  console.log(`   Full-body: ${typeCounts['fullbody'] || 0}`);
  console.log(`   Expression sheets: ${typeCounts['expressions'] || 0}`);
  
  // Execute jobs
  const results: GenerationResult[] = [];
  
  for (const job of jobs) {
    const result = await executeJob(job, manifest.generation_config, comfyuiUrl, dryRun);
    results.push(result);
    
    if (!result.success) {
      console.error(`   ❌ Error: ${result.error}`);
    }
  }
  
  // Generate index
  if (!dryRun && results.some(r => r.success)) {
    await generateIndex(results, manifest.generation_config.output_base_path);
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n================================');
  console.log('📊 Generation Summary');
  console.log(`   ✅ Successful: ${successful}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   Total: ${results.length}`);
  
  if (dryRun) {
    console.log('\n[DRY RUN] No actual generation performed.');
  }
  
  if (failed > 0) {
    process.exit(1);
  }
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export { loadManifest, buildCharacterPrompt, buildGenerationJobs };
