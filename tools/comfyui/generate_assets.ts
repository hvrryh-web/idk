#!/usr/bin/env node
/**
 * ComfyUI Asset Generator
 * 
 * Generates character customization assets using ComfyUI API
 * Reads asset_spec.yaml and generates all required assets
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

interface AssetSpec {
  version: string;
  output_dir: string;
  manifest_output: string;
  base_models: BaseModel[];
  categories: Category[];
  style: Style;
  comfyui: ComfyUIConfig;
}

interface BaseModel {
  id: string;
  name: string;
  workflow: string;
  prompt_template: string;
  output_filename: string;
  dimensions: { width: number; height: number };
  seed: number;
  negative_prompt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  workflow: string;
  options: Option[];
}

interface Option {
  id: string;
  name: string;
  layers: Layer[];
  thumbnail_output: string;
}

interface Layer {
  type: string;
  prompt_template: string;
  output_filename: string;
  seed: number;
}

interface Style {
  base_style: string;
  quality_tags: string;
  negative_base: string;
}

interface ComfyUIConfig {
  url: string;
  timeout: number;
  polling_interval: number;
  use_websocket: boolean;
}

/**
 * Load YAML file (simple parser for our needs)
 */
function loadYAML(filepath: string): any {
  const content = fs.readFileSync(filepath, 'utf-8');
  // Simple YAML parser - in production use a proper library like 'js-yaml'
  console.warn('Using simplified YAML parser. For production, install js-yaml package.');
  
  // This is a very basic parser for our specific format
  // In real implementation, use: import yaml from 'js-yaml'; return yaml.load(content);
  try {
    return JSON.parse(content.replace(/:\s+/g, ': ').replace(/\n\s+/g, '\n'));
  } catch {
    console.error('YAML parsing failed. Please install js-yaml: npm install js-yaml @types/js-yaml');
    process.exit(1);
  }
}

/**
 * Read prompt template file
 */
function readPromptTemplate(templatePath: string): string {
  const fullPath = path.join(__dirname, templatePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Prompt template not found: ${fullPath}`);
    return '';
  }
  return fs.readFileSync(fullPath, 'utf-8').trim();
}

/**
 * Make HTTP request to ComfyUI API
 */
function httpRequest(url: string, options: any, data?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

/**
 * Submit workflow to ComfyUI
 */
async function submitWorkflow(
  comfyuiUrl: string,
  workflow: any,
  promptText: string,
  negativePrompt: string,
  seed: number,
  width: number,
  height: number
): Promise<string> {
  // Replace template variables in workflow
  const workflowStr = JSON.stringify(workflow)
    .replace(/\{\{positive_prompt\}\}/g, promptText)
    .replace(/\{\{negative_prompt\}\}/g, negativePrompt)
    .replace(/\{\{seed\}\}/g, String(seed))
    .replace(/\{\{width\}\}/g, String(width))
    .replace(/\{\{height\}\}/g, String(height))
    .replace(/\{\{checkpoint_name\}\}/g, 'model.safetensors')
    .replace(/\{\{output_prefix\}\}/g, 'character_');

  const payload = {
    prompt: JSON.parse(workflowStr).nodes,
  };

  const response = await httpRequest(`${comfyuiUrl}/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, JSON.stringify(payload));

  if (!response.prompt_id) {
    throw new Error('Failed to submit workflow to ComfyUI');
  }

  return response.prompt_id;
}

/**
 * Poll for completion
 */
async function pollForCompletion(
  comfyuiUrl: string,
  promptId: string,
  timeout: number,
  interval: number
): Promise<any> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout * 1000) {
    try {
      const history = await httpRequest(`${comfyuiUrl}/history/${promptId}`, { method: 'GET' });
      
      if (history[promptId]?.status?.completed) {
        return history[promptId];
      }
      
      await new Promise(resolve => setTimeout(resolve, interval * 1000));
    } catch (error) {
      console.error('Error polling ComfyUI:', error);
    }
  }
  
  throw new Error('Timeout waiting for ComfyUI completion');
}

/**
 * Download generated image
 */
async function downloadImage(
  comfyuiUrl: string,
  filename: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = `${comfyuiUrl}/view?filename=${encodeURIComponent(filename)}`;
    const file = fs.createWriteStream(outputPath);
    
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    protocol.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

/**
 * Generate a single asset
 */
async function generateAsset(
  spec: AssetSpec,
  workflow: any,
  promptText: string,
  negativePrompt: string,
  seed: number,
  width: number,
  height: number,
  outputPath: string
): Promise<void> {
  console.log(`Generating: ${outputPath}`);
  
  const comfyuiUrl = process.env.COMFYUI_URL || spec.comfyui.url;
  
  // Submit workflow
  const promptId = await submitWorkflow(
    comfyuiUrl,
    workflow,
    promptText,
    negativePrompt,
    seed,
    width,
    height
  );
  
  console.log(`  Submitted to ComfyUI (prompt_id: ${promptId})`);
  
  // Poll for completion
  const result = await pollForCompletion(
    comfyuiUrl,
    promptId,
    spec.comfyui.timeout,
    spec.comfyui.polling_interval
  );
  
  // Download image (simplified - actual implementation would parse outputs)
  console.log(`  Completed. Downloading...`);
  const outputFilename = result.outputs?.['7']?.images?.[0]?.filename || 'output.png';
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  fs.mkdirSync(outputDir, { recursive: true });
  
  await downloadImage(comfyuiUrl, outputFilename, outputPath);
  console.log(`  ✓ Saved to ${outputPath}`);
}

/**
 * Generate all assets
 */
async function generateAllAssets(specPath: string): Promise<void> {
  console.log('Loading asset specification...');
  const spec: AssetSpec = loadYAML(specPath);
  
  console.log(`\nGenerating assets for version ${spec.version}\n`);
  
  // Load workflows
  const workflows: Record<string, any> = {};
  
  // Generate base models
  console.log('=== Generating Base Models ===\n');
  for (const baseModel of spec.base_models) {
    if (!workflows[baseModel.workflow]) {
      const workflowPath = path.join(__dirname, 'workflows', baseModel.workflow);
      workflows[baseModel.workflow] = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));
    }
    
    const promptText = readPromptTemplate(baseModel.prompt_template);
    const outputPath = path.join(__dirname, spec.output_dir, baseModel.output_filename);
    
    await generateAsset(
      spec,
      workflows[baseModel.workflow],
      promptText,
      baseModel.negative_prompt,
      baseModel.seed,
      baseModel.dimensions.width,
      baseModel.dimensions.height,
      outputPath
    );
  }
  
  // Generate category options
  console.log('\n=== Generating Category Options ===\n');
  for (const category of spec.categories) {
    console.log(`Category: ${category.name}`);
    
    if (!workflows[category.workflow]) {
      const workflowPath = path.join(__dirname, 'workflows', category.workflow);
      workflows[category.workflow] = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));
    }
    
    for (const option of category.options) {
      console.log(`  Option: ${option.name}`);
      
      for (const layer of option.layers) {
        const promptText = readPromptTemplate(layer.prompt_template);
        const outputPath = path.join(__dirname, spec.output_dir, layer.output_filename);
        
        await generateAsset(
          spec,
          workflows[category.workflow],
          promptText,
          spec.style.negative_base,
          layer.seed,
          512,
          512,
          outputPath
        );
      }
    }
  }
  
  console.log('\n=== Asset Generation Complete ===\n');
  console.log('Next step: Refresh asset_manifest.json with generated assets');
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
ComfyUI Asset Generator

Usage:
  npm run generate-assets [options]

Options:
  --spec <path>    Path to asset_spec.yaml (default: asset_spec.yaml)
  --help, -h       Show this help message

Environment Variables:
  COMFYUI_URL      ComfyUI server URL (default: http://127.0.0.1:8188)
  COMFYUI_API_KEY  Optional API key for authentication

Example:
  COMFYUI_URL=http://localhost:8188 npm run generate-assets
    `);
    return;
  }
  
  const specIndex = args.indexOf('--spec');
  const specPath = specIndex >= 0 ? args[specIndex + 1] : 'asset_spec.yaml';
  const fullSpecPath = path.join(__dirname, specPath);
  
  if (!fs.existsSync(fullSpecPath)) {
    console.error(`Error: Spec file not found: ${fullSpecPath}`);
    process.exit(1);
  }
  
  try {
    await generateAllAssets(fullSpecPath);
    console.log('✓ All done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { generateAllAssets };
