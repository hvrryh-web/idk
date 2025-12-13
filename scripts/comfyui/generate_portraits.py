#!/usr/bin/env python3
"""
ComfyUI Character Portrait Generator

This script calls the ComfyUI API to generate character portrait images
for NPCs and sample characters used in the frontend.

Usage:
    python generate_portraits.py [--config CONFIG_FILE] [--output OUTPUT_DIR]

Requirements:
    - ComfyUI server running (default: http://localhost:8188)
    - Python 3.8+
    - requests library

Configuration:
    The script reads character definitions from a JSON config file and generates
    portraits using ComfyUI's API with appropriate prompts for each character.
"""

import argparse
import json
import os
import time
from pathlib import Path
from typing import Any, Optional, List, Dict
import urllib.request
import urllib.error

# ComfyUI server configuration
DEFAULT_COMFYUI_URL = "http://localhost:8188"
DEFAULT_OUTPUT_DIR = "frontend/public/assets/characters/generated"
DEFAULT_CONFIG_FILE = "scripts/comfyui/character_config.json"

# Base workflow for portrait generation
BASE_WORKFLOW = {
    "3": {
        "class_type": "KSampler",
        "inputs": {
            "cfg": 7,
            "denoise": 1,
            "latent_image": ["5", 0],
            "model": ["4", 0],
            "negative": ["7", 0],
            "positive": ["6", 0],
            "sampler_name": "euler",
            "scheduler": "normal",
            "seed": 0,
            "steps": 20
        }
    },
    "4": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": {
            "ckpt_name": "sd_xl_base_1.0.safetensors"
        }
    },
    "5": {
        "class_type": "EmptyLatentImage",
        "inputs": {
            "batch_size": 1,
            "height": 1024,
            "width": 768
        }
    },
    "6": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "clip": ["4", 1],
            "text": ""
        }
    },
    "7": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "clip": ["4", 1],
            "text": "blurry, low quality, distorted, deformed, ugly, bad anatomy, watermark, text, signature"
        }
    },
    "8": {
        "class_type": "VAEDecode",
        "inputs": {
            "samples": ["3", 0],
            "vae": ["4", 2]
        }
    },
    "9": {
        "class_type": "SaveImage",
        "inputs": {
            "filename_prefix": "character",
            "images": ["8", 0]
        }
    }
}

# Style presets for different character types
STYLE_PRESETS = {
    "warrior": "ancient Chinese warrior, armor, heroic pose, dramatic lighting, oil painting style, highly detailed, 4k",
    "strategist": "ancient Chinese scholar, robes, wise expression, study background, classical painting style, highly detailed",
    "general": "ancient Chinese military general, ornate armor, commanding presence, battlefield background, epic art style",
    "noble": "ancient Chinese noble, elegant robes, refined features, palace background, portrait painting style",
    "villain": "ancient Chinese warlord, menacing expression, dark armor, dramatic shadows, epic fantasy art",
    "female_warrior": "ancient Chinese female warrior, elegant armor, fierce expression, martial arts pose, beautiful detailed art",
    "advisor": "ancient Chinese court advisor, scholarly robes, thoughtful expression, scrolls and books, classical art style",
}

# Default character definitions
DEFAULT_CHARACTERS = [
    {
        "id": "guan-yu",
        "name": "Guan Yu",
        "name_cjk": "关羽",
        "style": "warrior",
        "description": "legendary warrior with long black beard, red face, green robe armor, wielding Green Dragon Crescent Blade",
        "faction": "shu"
    },
    {
        "id": "zhang-fei",
        "name": "Zhang Fei",
        "name_cjk": "张飞",
        "style": "warrior",
        "description": "fierce warrior with wild beard, intimidating expression, wielding serpent spear",
        "faction": "shu"
    },
    {
        "id": "zhao-yun",
        "name": "Zhao Yun",
        "name_cjk": "赵云",
        "style": "warrior",
        "description": "noble young warrior in white armor, handsome features, wielding dragon spear",
        "faction": "shu"
    },
    {
        "id": "zhuge-liang",
        "name": "Zhuge Liang",
        "name_cjk": "诸葛亮",
        "style": "strategist",
        "description": "wise strategist with feather fan, white robe, calm expression, knowing smile",
        "faction": "shu"
    },
    {
        "id": "liu-bei",
        "name": "Liu Bei",
        "name_cjk": "刘备",
        "style": "noble",
        "description": "benevolent lord with long earlobes, kind expression, imperial yellow robes",
        "faction": "shu"
    },
    {
        "id": "cao-cao",
        "name": "Cao Cao",
        "name_cjk": "曹操",
        "style": "villain",
        "description": "ambitious warlord with sharp features, calculating gaze, dark ornate armor",
        "faction": "wei"
    },
    {
        "id": "cao-ren",
        "name": "Cao Ren",
        "name_cjk": "曹仁",
        "style": "general",
        "description": "stalwart general with determined expression, heavy armor, defensive stance",
        "faction": "wei"
    },
    {
        "id": "zhang-liao",
        "name": "Zhang Liao",
        "name_cjk": "张辽",
        "style": "warrior",
        "description": "fierce general with sharp eyes, Wei armor, halberd weapon",
        "faction": "wei"
    },
    {
        "id": "sun-quan",
        "name": "Sun Quan",
        "name_cjk": "孙权",
        "style": "noble",
        "description": "young lord with purple eyes, noble bearing, Wu kingdom robes",
        "faction": "wu"
    },
    {
        "id": "zhou-yu",
        "name": "Zhou Yu",
        "name_cjk": "周瑜",
        "style": "strategist",
        "description": "handsome strategist and musician, elegant robes, confident expression",
        "faction": "wu"
    },
    {
        "id": "lu-xun",
        "name": "Lu Xun",
        "name_cjk": "陆逊",
        "style": "strategist",
        "description": "young scholar-general, scholarly appearance, determined eyes",
        "faction": "wu"
    },
    {
        "id": "diao-chan",
        "name": "Diao Chan",
        "name_cjk": "貂蝉",
        "style": "female_warrior",
        "description": "beautiful dancer with flowing silk robes, graceful pose, moonlit scene",
        "faction": "neutral"
    },
    {
        "id": "lu-bu",
        "name": "Lu Bu",
        "name_cjk": "吕布",
        "style": "villain",
        "description": "mightiest warrior with phoenix plume, ornate armor, riding Red Hare, intimidating presence",
        "faction": "neutral"
    },
    {
        "id": "sima-yi",
        "name": "Sima Yi",
        "name_cjk": "司马懿",
        "style": "advisor",
        "description": "cunning strategist with hawk-like gaze, dark robes, scheming expression",
        "faction": "wei"
    },
]


def build_prompt(character: dict) -> str:
    """Build the generation prompt for a character."""
    style_base = STYLE_PRESETS.get(character.get("style", "warrior"), STYLE_PRESETS["warrior"])
    description = character.get("description", "")
    
    # Faction color hints
    faction_colors = {
        "shu": "green and gold colors",
        "wei": "blue and silver colors", 
        "wu": "red and orange colors",
        "neutral": "neutral earth tones"
    }
    faction = character.get("faction", "neutral")
    color_hint = faction_colors.get(faction, "")
    
    prompt = f"portrait of {character['name']}, {description}, {style_base}, {color_hint}, Romance of the Three Kingdoms style, masterpiece quality"
    
    return prompt


def queue_prompt(prompt_workflow: dict, server_url: str) -> str:
    """Queue a prompt to ComfyUI and return the prompt ID."""
    data = json.dumps({"prompt": prompt_workflow}).encode('utf-8')
    req = urllib.request.Request(
        f"{server_url}/prompt",
        data=data,
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result.get("prompt_id", "")
    except urllib.error.URLError as e:
        print(f"Error connecting to ComfyUI: {e}")
        return ""


def check_progress(prompt_id: str, server_url: str) -> tuple[bool, Optional[list]]:
    """Check the progress of a prompt and return (is_complete, output_images)."""
    try:
        with urllib.request.urlopen(f"{server_url}/history/{prompt_id}", timeout=10) as response:
            history = json.loads(response.read().decode('utf-8'))
            
        if prompt_id in history:
            outputs = history[prompt_id].get("outputs", {})
            if outputs:
                # Find SaveImage node outputs
                for node_id, node_output in outputs.items():
                    if "images" in node_output:
                        return True, node_output["images"]
            return True, None
        return False, None
    except urllib.error.URLError:
        return False, None


def download_image(image_info: dict, output_path: Path, server_url: str) -> bool:
    """Download a generated image from ComfyUI."""
    filename = image_info.get("filename", "")
    subfolder = image_info.get("subfolder", "")
    
    url = f"{server_url}/view?filename={filename}&subfolder={subfolder}&type=output"
    
    try:
        with urllib.request.urlopen(url, timeout=60) as response:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, 'wb') as f:
                f.write(response.read())
            return True
    except urllib.error.URLError as e:
        print(f"Error downloading image: {e}")
        return False


def generate_character_portrait(
    character: dict,
    output_dir: Path,
    server_url: str,
    timeout: int = 300
) -> Optional[Path]:
    """Generate a portrait for a single character."""
    print(f"Generating portrait for {character['name']} ({character.get('name_cjk', '')})...")
    
    # Build the workflow
    workflow = json.loads(json.dumps(BASE_WORKFLOW))
    
    # Set the prompt
    prompt_text = build_prompt(character)
    workflow["6"]["inputs"]["text"] = prompt_text
    
    # Set random seed
    workflow["3"]["inputs"]["seed"] = int(time.time() * 1000) % (2**32)
    
    # Set filename prefix
    workflow["9"]["inputs"]["filename_prefix"] = f"character_{character['id']}"
    
    # Queue the prompt
    prompt_id = queue_prompt(workflow, server_url)
    if not prompt_id:
        print(f"  Failed to queue prompt for {character['name']}")
        return None
    
    print(f"  Queued prompt: {prompt_id}")
    
    # Wait for completion
    start_time = time.time()
    while time.time() - start_time < timeout:
        is_complete, images = check_progress(prompt_id, server_url)
        
        if is_complete:
            if images:
                # Download the first image
                output_path = output_dir / f"{character['id']}.png"
                if download_image(images[0], output_path, server_url):
                    print(f"  Saved: {output_path}")
                    return output_path
                else:
                    print(f"  Failed to download image")
                    return None
            else:
                print(f"  No images generated")
                return None
        
        time.sleep(2)
    
    print(f"  Timeout waiting for generation")
    return None


def check_comfyui_server(server_url: str) -> bool:
    """Check if ComfyUI server is running."""
    try:
        with urllib.request.urlopen(f"{server_url}/system_stats", timeout=5) as response:
            return response.status == 200
    except urllib.error.URLError:
        return False


def load_config(config_path: str) -> list[dict]:
    """Load character configuration from JSON file."""
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
            return config.get("characters", DEFAULT_CHARACTERS)
    return DEFAULT_CHARACTERS


def save_default_config(config_path: str) -> None:
    """Save the default character configuration to a JSON file."""
    config = {
        "characters": DEFAULT_CHARACTERS,
        "style_presets": STYLE_PRESETS,
        "settings": {
            "comfyui_url": DEFAULT_COMFYUI_URL,
            "output_dir": DEFAULT_OUTPUT_DIR,
            "timeout_per_image": 300,
            "checkpoint": "sd_xl_base_1.0.safetensors"
        }
    }
    
    os.makedirs(os.path.dirname(config_path), exist_ok=True)
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print(f"Saved default config to: {config_path}")


def main():
    parser = argparse.ArgumentParser(
        description="Generate character portraits using ComfyUI"
    )
    parser.add_argument(
        "--config",
        default=DEFAULT_CONFIG_FILE,
        help="Path to character configuration JSON file"
    )
    parser.add_argument(
        "--output",
        default=DEFAULT_OUTPUT_DIR,
        help="Output directory for generated images"
    )
    parser.add_argument(
        "--server",
        default=DEFAULT_COMFYUI_URL,
        help="ComfyUI server URL"
    )
    parser.add_argument(
        "--save-config",
        action="store_true",
        help="Save default configuration and exit"
    )
    parser.add_argument(
        "--characters",
        nargs="+",
        help="Specific character IDs to generate (default: all)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be generated without actually generating"
    )
    
    args = parser.parse_args()
    
    # Save default config if requested
    if args.save_config:
        save_default_config(args.config)
        return
    
    # Load character configuration
    characters = load_config(args.config)
    
    # Filter characters if specific ones requested
    if args.characters:
        characters = [c for c in characters if c["id"] in args.characters]
        if not characters:
            print(f"No matching characters found for: {args.characters}")
            return
    
    output_dir = Path(args.output)
    
    print(f"ComfyUI Character Portrait Generator")
    print(f"=====================================")
    print(f"Server: {args.server}")
    print(f"Output: {output_dir}")
    print(f"Characters: {len(characters)}")
    print()
    
    if args.dry_run:
        print("DRY RUN - would generate:")
        for char in characters:
            prompt = build_prompt(char)
            print(f"\n{char['id']}:")
            print(f"  Name: {char['name']} ({char.get('name_cjk', '')})")
            print(f"  Prompt: {prompt[:100]}...")
        return
    
    # Check server
    if not check_comfyui_server(args.server):
        print(f"ERROR: Cannot connect to ComfyUI server at {args.server}")
        print("Please ensure ComfyUI is running and accessible.")
        print("\nTo start ComfyUI:")
        print("  cd /path/to/ComfyUI && python main.py")
        return
    
    print("ComfyUI server connected!")
    print()
    
    # Generate portraits
    output_dir.mkdir(parents=True, exist_ok=True)
    
    results = {
        "success": [],
        "failed": []
    }
    
    for i, character in enumerate(characters, 1):
        print(f"[{i}/{len(characters)}] ", end="")
        
        output_path = generate_character_portrait(
            character,
            output_dir,
            args.server
        )
        
        if output_path:
            results["success"].append(character["id"])
        else:
            results["failed"].append(character["id"])
        
        # Small delay between generations
        if i < len(characters):
            time.sleep(1)
    
    print()
    print("Generation Complete!")
    print(f"  Success: {len(results['success'])}")
    print(f"  Failed: {len(results['failed'])}")
    
    if results["failed"]:
        print(f"\nFailed characters: {', '.join(results['failed'])}")


if __name__ == "__main__":
    main()
