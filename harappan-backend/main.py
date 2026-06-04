import io
import os
import base64
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageOps
from rembg import remove, new_session
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Harappan Artifact AI Restoration API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading background removal AI...")
session = new_session("u2net")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) 

MATERIAL_REPORTS = {
    "Terracotta Red": "Based on archaeological findings at Mohenjo-Daro, terracotta was a foundational material for everyday figurines. The rich reddish-brown hue comes from firing iron-rich alluvial clay found along the Indus River. This restoration applies a standard oxidative firing pigment, revealing how the object would have appeared fresh from the kiln before thousands of years of topsoil bleaching.",
    "Iron Oxide Dark": "Dark iron oxide slips were frequently used by Indus Valley artisans to create contrasting patterns on pottery and seals. By applying this dark hematite-based pigment, we simulate an artifact that was intentionally darkened for ceremonial or administrative importance, a technique known to increase the durability and visual weight of the stone.",
    "Indigo Blue": "While less common for raw ceramics, the Indus Valley civilization was one of the earliest to domesticate and utilize Indigofera tinctoria (indigo). This hypothetical restoration explores the artifact as it might have appeared if dyed or painted for high-status trade, utilizing the deep, colorfast blues that were highly prized in ancient Mesopotamian trade routes.",
    "Limestone Natural": "This restoration strips away centuries of environmental staining, soot, and soil accumulation to reveal the raw, unpainted archaeological state of the stone. Steatite and limestone were carved with micro-tools, and leaving them unpainted allowed the intricate script and animal motifs to cast sharp, legible shadows when used as administrative stamps.",
    "Lapis Lazuli": "Lapis Lazuli was immensely valuable, mined primarily in the Badakhshan region of modern-day Afghanistan, a known trading partner of the Harappans. This restoration hypothesizes the artifact as a luxury elite item, either carved directly from lapis or coated in an ultramarine pigment, indicating extreme wealth and high societal rank."
}

@app.post("/api/restore-pigment")
async def restore_pigment(
    file: UploadFile = File(...),
    target_material: str = Form("Terracotta Red") 
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    try:
        image_bytes = await file.read()

        # 1. Image Processing Pipeline
        mask_bytes = remove(image_bytes, session=session)
        mask_image = Image.open(io.BytesIO(mask_bytes)).convert("RGBA")
        original = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
        
        # OpenAI DALL-E 2 Edit requires strictly square PNG images.
        # We resize the images to 1024x1024 to satisfy the API requirements.
        original_square = original.resize((1024, 1024))
        mask_square = mask_image.resize((1024, 1024))

        # 2. Prepare the Mask for OpenAI
        # DALL-E requires the area you want to change to be completely transparent (Alpha 0).
        # rembg gives us the object as opaque. So we MUST invert the alpha channel here.
        alpha_channel = mask_square.split()[3]
        inverted_alpha = ImageOps.invert(alpha_channel)
        
        # Create a blank mask and apply the inverted alpha
        dalle_mask = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
        dalle_mask.putalpha(inverted_alpha)

        # 3. Convert to bytes for OpenAI
        orig_byte_arr = io.BytesIO()
        original_square.save(orig_byte_arr, format='PNG')
        orig_byte_arr = orig_byte_arr.getvalue()

        mask_byte_arr = io.BytesIO()
        dalle_mask.save(mask_byte_arr, format='PNG')
        mask_byte_arr = mask_byte_arr.getvalue()

        # 4. Prompt Engineering for Restoration
        # We specifically tell GPT to fill cracks and guess the original color based on the material
        prompt = f"A museum-quality macro photograph of a flawlessly restored ancient Indus Valley artifact. It is made of {target_material}. The object is in pristine, freshly-crafted condition. All cracks, chips, and damage have been completely repaired and smoothed out. The original vivid colors and structural integrity are fully restored. Maintain the exact lighting and background of the original image."

        print(f"Sending to OpenAI: {prompt}")


        response = client.images.edit(
            model="gpt-image-2",
            image=("original.png", orig_byte_arr, "image/png"),
            mask=("mask.png", mask_byte_arr, "image/png"),
            prompt=prompt,
            n=1,
            size="1024x1024"
        )

        b64_data = response.data[0].b64_json
        restored_image_url = f"data:image/png;base64,{b64_data}"
        
        # 6. Fetch the corresponding historical report
        report_text = MATERIAL_REPORTS.get(
            target_material, 
            "No specific historical data available for this material configuration."
        )

        return {
            "status": "success",
            "restored_image_url": restored_image_url,
            "analysis_report": report_text
        }

    except Exception as e:
        print(f"Processing Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))