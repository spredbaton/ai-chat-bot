from fastapi import FastAPI, UploadFile, Form
from PIL import Image
from io import BytesIO
from sentence_transformers import SentenceTransformer
from transformers import Blip2Processor, Blip2ForConditionalGeneration
import torch

app = FastAPI()

# Load captioning model
caption_model = Blip2ForConditionalGeneration.from_pretrained(
    "Salesforce/blip2-opt-2.7b", device_map="auto", torch_dtype=torch.float16
)
caption_processor = Blip2Processor.from_pretrained("Salesforce/blip2-opt-2.7b")

# Embedding model
embed_model = SentenceTransformer("BAAI/bge-small-en-v1.5")

@app.post("/caption")
async def caption_image(file: UploadFile):
    contents = await file.read()
    image = Image.open(BytesIO(contents)).convert("RGB")

    inputs = caption_processor(images=image, return_tensors="pt").to("cuda")
    output_ids = caption_model.generate(**inputs)
    caption = caption_processor.decode(output_ids[0], skip_special_tokens=True)

    embedding = embed_model.encode(caption).tolist()

    return {"caption": caption, "embedding": embedding}

@app.post("/embed")
async def embed_text(query: str = Form(...)):
    embedding = embed_model.encode(query).tolist()
    return {"embedding": embedding}
