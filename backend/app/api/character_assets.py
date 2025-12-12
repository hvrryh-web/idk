from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional, List
import subprocess
import os

router = APIRouter()

class AssetRequest(BaseModel):
    character_name: str
    style: Optional[str] = "yuto-sano"
    description: Optional[str] = None  # Custom prompt for character

class MultiVariantRequest(BaseModel):
    character_name: str
    variants: List[str] = ["yuto-sano", "alt", "variant"]
    descriptions: Optional[List[str]] = None  # Custom prompts per variant
# To integrate with ComfyUI, replace the placeholder logic with a subprocess or API call to generate the image.

@router.post("/generate-character-variants")
def generate_character_variants(req: MultiVariantRequest):
    asset_dir = os.path.join("..", "frontend", "public", "assets", "characters")
    os.makedirs(asset_dir, exist_ok=True)
    results = []
    for i, variant in enumerate(req.variants):
        filename = f"{req.character_name.lower().replace(' ', '-')}-{variant}.jpg"
        output_path = os.path.join(asset_dir, filename)
        # Compose prompt
        if req.descriptions and i < len(req.descriptions):
            prompt = req.descriptions[i]
        else:
            prompt = f"Romance of the Three Kingdoms, {req.character_name}, {variant} style, ink-wash, semi-realistic, portrait, dynasty armor, painterly rim light, LUT, bloom, vignette, grain overlay"
        negative_prompt = "blurry, low quality, watermark, extra limbs, distorted perspective"
        # Example ComfyUI API call (replace with actual endpoint and payload)
        # import requests
        # comfyui_url = "http://localhost:8188/api/generate"
        # payload = {"prompt": prompt, "negative_prompt": negative_prompt, "output_path": output_path, "width": 512, "height": 768, "steps": 28, "style": variant}
        try:
            # Uncomment and adjust for real ComfyUI API
            # response = requests.post(comfyui_url, json=payload)
            # response.raise_for_status()
            # For now, just create a placeholder file
            with open(output_path, "wb") as f:
                f.write(b"")
            status = "success"
        except Exception as e:
            status = f"error: {str(e)}"
        asset_url = f"/assets/characters/{filename}"
        results.append({"status": status, "path": output_path, "url": asset_url, "character": req.character_name, "variant": variant})
    return {"results": results}

@router.post("/generate-character-asset")
def generate_character_asset(req: AssetRequest):
    asset_dir = os.path.join("..", "frontend", "public", "assets", "characters")
    os.makedirs(asset_dir, exist_ok=True)
    filename = f"{req.character_name.lower().replace(' ', '-')}-{req.style}.jpg"
    output_path = os.path.join(asset_dir, filename)

    # Compose prompt for ComfyUI
    prompt = req.description or f"Romance of the Three Kingdoms, {req.character_name}, Yuto Sano style, ink-wash, semi-realistic, portrait, dynasty armor, painterly rim light, LUT, bloom, vignette, grain overlay"
    negative_prompt = "blurry, low quality, watermark, extra limbs, distorted perspective"

    # Example ComfyUI API call (replace with actual endpoint and payload)
    # This is a placeholder for demonstration
    import requests
    comfyui_url = "http://localhost:8188/api/generate"
    payload = {
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "output_path": output_path,
        "width": 512,
        "height": 768,
        "steps": 28,
        "style": req.style
    }
    try:
        # Uncomment and adjust for real ComfyUI API
        # response = requests.post(comfyui_url, json=payload)
        # response.raise_for_status()
        # For now, just create a placeholder file
        with open(output_path, "wb") as f:
            f.write(b"")
        status = "success"
    except Exception as e:
        status = f"error: {str(e)}"

    # Return asset URL for frontend use
    asset_url = f"/assets/characters/{filename}"
    return {"status": status, "path": output_path, "url": asset_url, "character": req.character_name, "style": req.style}

# To integrate with ComfyUI, replace the placeholder logic with a subprocess or API call to generate the image.
