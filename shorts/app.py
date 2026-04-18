from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
import uuid
import generator

app = FastAPI()

# Mount static and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse(request, "index.html", {})

@app.post("/clarify")
async def clarify(prompt: str = Form(...)):
    question = generator.get_clarification_question(prompt)
    return {"question": question}

@app.post("/generate")
async def generate(prompt: str = Form(...)):
    print(f"DEBUG: Generating for prompt: {prompt}")
    try:
        # 1. Generate Script
        script = generator.generate_script(prompt)
        print(f"DEBUG: Script generated: {script[:100]}...")
        
        # 2. Extract Keywords & Generate Visual Prompts
        keywords = generator.extract_keywords(script, prompt)
        print(f"DEBUG: Keywords: {keywords}")
        
        scenes = generator.generate_visual_prompts(prompt, keywords)
        print(f"DEBUG: Scenes: {scenes}")
        
        image_urls = generator.fetch_images(keywords, prompt)
        print(f"DEBUG: Image URLs: {image_urls}")
        
        # 3. Generate Audio
        filename = f"{uuid.uuid4()}.mp3"
        output_path = os.path.join("static", filename)
        generator.text_to_speech(script, output_path)
        
        return {
            "success": True,
            "script": script,
            "audio_url": f"/static/{filename}",
            "keywords": keywords,
            "images": image_urls
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
