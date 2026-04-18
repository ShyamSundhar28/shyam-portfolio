from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uuid
import os
import re
import requests

import json
from gtts import gTTS
import moviepy as mpe
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi
from dotenv import load_dotenv

load_dotenv()

# S-Drive SSD Optimized paths
os.environ["IMAGEIO_FFMPEG_EXE"] = r"s:\ffmpeg-8.0.1-essentials_build\bin\ffmpeg.exe"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "outputs")
os.makedirs(OUTPUT_DIR, exist_ok=True)


# Configure Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI(title="Automated YouTube Shorts Generator API")

@app.get("/api/outputs/{filename}")
async def serve_output(filename: str):
    """Serves files from the outputs directory on the S drive."""
    path = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(path):
        return FileResponse(path)
    raise HTTPException(status_code=404, detail="File not found")


@app.get("/")
async def serve_ui():
    """Serves the main UI for the application."""
    if os.path.exists("index.html"):
        return FileResponse("index.html")
    return {"message": "index.html not found. Please create it."}

@app.get("/generation/{job_id}")
async def view_generation(job_id: str):
    """Serves the dedicated generation monitoring page."""
    if os.path.exists("generation.html"):
        return FileResponse("generation.html")
    return {"message": "generation.html not found."}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")

# Placeholder in-memory store for tracking jobs
generation_jobs: Dict[str, Any] = {}

class GenerateRequest(BaseModel):
    topic: str
    video_id: str
    region: str = "US"


def parse_duration(duration_str):
    """Parse an ISO8601 duration string (e.g., 'PT1H2M3S') and return duration in seconds."""
    hours = minutes = seconds = 0
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration_str)
    if match:
        if match.group(1): hours = int(match.group(1))
        if match.group(2): minutes = int(match.group(2))
        if match.group(3): seconds = int(match.group(3))
    return hours * 3600 + minutes * 60 + seconds

@app.get("/api/categories/{region}")
async def get_categories(region: str):
    """Fetches available video categories for a specific region."""
    if not YOUTUBE_API_KEY:
        # Mock data fallback
        return {"categories": [{"id": "1", "title": "Film & Animation"}, {"id": "10", "title": "Music"}, {"id": "17", "title": "Sports"}, {"id": "24", "title": "Entertainment"}, {"id": "27", "title": "Education"}]}
        
    url = "https://www.googleapis.com/youtube/v3/videoCategories"
    params = {"part": "snippet", "regionCode": region, "key": YOUTUBE_API_KEY}
    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
        
    data = response.json()
    categories = []
    for item in data.get("items", []):
        if item.get("snippet", {}).get("assignable", False):
            categories.append({"id": item.get("id"), "title": item.get("snippet", {}).get("title")})
            
    return {"categories": categories}

@app.get("/api/trending/{region}")
async def get_trending_videos(region: str, category_id: Optional[str] = None):
    """
    Fetches the top 10 trending long-form videos for a specific region using the YouTube Data API v3.
    It filters out existing YouTube Shorts (duration < 60s).
    Requires YOUTUBE_API_KEY in .env
    """
    if not YOUTUBE_API_KEY:
        # Fallback realistic mock data...
        return {
            "videos": [
                {
                    "id": "mock_1",
                    "title": f"Top Trending Tech News in {region}",
                    "channel": "Tech Central",
                    "thumbnail": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=640&q=80",
                    "views": "1.2M views",
                    "description": "A deep dive into the latest technological advancements globally...",
                    "engagement_ratio": 0.045
                },
                {
                    "id": "mock_2",
                    "title": f"AI Breakthroughs Explored ({region} Edition)",
                    "channel": "AI Explained",
                    "thumbnail": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=640&q=80",
                    "views": "850K views",
                    "description": "Understanding how generative AI is transforming industries...",
                    "engagement_ratio": 0.052
                },
                {
                    "id": "mock_3",
                    "title": "Cloud Computing Trends 2026",
                    "channel": "Cloud Architect Weekly",
                    "thumbnail": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=640&q=80",
                    "views": "2.1M views",
                    "description": "The evolution of serverless and event-driven architectures...",
                    "engagement_ratio": 0.038
                }
            ]
        }

    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "snippet,statistics,contentDetails",
        "chart": "mostPopular",
        "regionCode": region,
        "maxResults": 50,
        "key": YOUTUBE_API_KEY
    }
    if category_id:
        params["videoCategoryId"] = category_id
    
    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
        
    data = response.json()
    videos = []
    
    for item in data.get("items", []):
        duration_str = item.get("contentDetails", {}).get("duration", "")
        if duration_str:
            duration_sec = parse_duration(duration_str)
            if duration_sec < 300:
                continue  # Skip videos under 5 mins (usually includes all shorts and minor clips)

        snippet = item.get("snippet", {})
        title = snippet.get("title", "")
        # Explicitly skip if #shorts is in title just to be extra safe
        if "#shorts" in title.lower():
            continue

        stats = item.get("statistics", {})
        
        view_count = int(stats.get("viewCount", 0))
        like_count = int(stats.get("likeCount", 0))
        comment_count = int(stats.get("commentCount", 0))
        
        engagement_ratio = 0.0
        if view_count > 0:
            engagement_ratio = (like_count + comment_count) / view_count
        
        # Get highest resolution thumbnail
        thumbnails = snippet.get("thumbnails", {})
        thumb_url = thumbnails.get("maxres", thumbnails.get("high", thumbnails.get("medium", {}))).get("url", "")
        
        videos.append({
            "id": item.get("id"),
            "title": snippet.get("title"),
            "channel": snippet.get("channelTitle"),
            "thumbnail": thumb_url,
            "views": f"{view_count:,} views",
            "description": snippet.get("description", "")[:150] + "...",
            "engagement_ratio": engagement_ratio
        })
            
    # Sort videos by engagement ratio descending
    videos.sort(key=lambda x: x["engagement_ratio"], reverse=True)
    
    return {"videos": videos[:10]}

@app.post("/api/generate")
async def start_generation(req: GenerateRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    generation_jobs[job_id] = {
        "status": "Initializing",
        "topic": req.topic,
        "video_url": None,
        "logs": []
    }
    
    # Send the heavy generation pipeline to a background task so it doesn't block the API
    background_tasks.add_task(generate_short_pipeline, job_id, req.topic, req.video_id)
    
    return {"job_id": job_id, "message": "Generation started successfully"}

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    if job_id not in generation_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return generation_jobs[job_id]


def generate_short_pipeline(job_id: str, topic: str, video_id: str):
    """
    Main orchestration pipeline for creating the YouTube Short.
    Steps: Summarize -> Emotion -> Audio -> Images -> Assembly -> Output.
    """
    def log(msg):
        if job_id in generation_jobs:
            generation_jobs[job_id]["logs"].append(msg)
            generation_jobs[job_id]["status"] = msg
        print(f"[{job_id}] {msg}")

    try:
        log(f"Fetching transcript for video ID: {video_id}")
        
        transcript_text = "No transcript available."
        try:
            # Try to fetch any available transcript, prioritizing English
            try:
                transcript_list = YouTubeTranscriptApi().fetch(video_id, languages=['en'])
            except:
                # Fallback: get the first available transcript from the list
                available_transcripts = YouTubeTranscriptApi().list(video_id)
                # Pick the first one regardless of language
                first_transcript = next(iter(available_transcripts))
                transcript_list = first_transcript.fetch()

            # Handle both dictionary and object formats for snippet data
            transcript_text = " ".join([
                t['text'] if isinstance(t, dict) else getattr(t, 'text', '') 
                for t in transcript_list
            ])
            log("Transcript successfully fetched.")
        except Exception as transcript_err:
            log(f"Transcript fetch failed: {str(transcript_err)}. Falling back to metadata...")
            # Fallback could be pulling from metadata but transcript is better.

        log("Generating Summary & Script using Gemini API...")
        if not GOOGLE_API_KEY:
            raise Exception("GOOGLE_API_KEY not found in .env")

        try:
            # Trying Gemini 2.0 (2026 current) first, then falling back to latest 1.5
            gemini_models = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash']
            
            model = None
            last_err = "No models available"
            
            for m_name in gemini_models:
                try:
                    model = genai.GenerativeModel(m_name)
                    # Test talk to ensure model exists in this project
                    test_res = model.generate_content("ping", request_options={"timeout": 10})
                    if test_res: 
                        log(f"Successfully connected to Gemini Model: {m_name}")
                        break
                except Exception as e:
                    last_err = str(e)
                    model = None
                    continue
            
            if not model:
                raise Exception(f"Gemini project search failed: {last_err}")

            prompt = f"""
            Analyze the following transcript of a trending YouTube video about '{topic}'.
            Create a comprehensive, high-engagement 1-minute script for a YouTube Short.
            The script MUST summarize the full video from start to finish, following a clear narrative flow:
            1. A strong "hook" from the beginning.
            2. Key highlights and insights from the middle.
            3. A solid conclusion or takeaway from the end.
            
            Transcript:
            {transcript_text[:8000]} # Increased transcript length for better coverage
            
            Format the output as ONLY the spoken script, without any scene descriptions, stage directions, or headers. Ensure the pacing is suitable for a 60-second delivery.
            """

            response = model.generate_content(prompt)
            short_script = response.text.strip()
        except Exception as gemini_err:
            log(f"Gemini API failed or model search failed: {str(gemini_err)}. Falling back to Hugging Face...")
            short_script = generate_with_hf(topic, transcript_text, "script")

        generation_jobs[job_id]["script"] = short_script
        log(f"Script secured! (Ready for Voiceover)")

        log("Synthesizing Audio using Google TTS...")
        audio_filename = f"{job_id}.mp3"
        audio_path = os.path.join(OUTPUT_DIR, audio_filename)
        tts = gTTS(text=short_script, lang='en')
        tts.save(audio_path)
        generation_jobs[job_id]["audio_url"] = f"/api/outputs/{audio_filename}"
        
        log("Analyzing script for visual keywords...")
        try:
            keyword_prompt = f"Analyze this script and return 5-8 short, descriptive visual keywords for an Unsplash image search. Format as a comma-separated list without any extra text.\n\nScript: {short_script}"
            kw_response = model.generate_content(keyword_prompt)
            keywords_text = kw_response.text.strip()
        except:
            log("Gemini keyword analysis failed. Falling back to Hugging Face keywords...")
            keywords_text = generate_with_hf(topic, short_script, "keywords")
        
        keywords = keywords_text.split(",")
        generation_jobs[job_id]["keywords"] = [k.strip() for k in keywords]
        
        log("Audio & Visual Keywords Ready.")
        generation_jobs[job_id]["status"] = "Audio & Keywords Generated"

    except Exception as e:
        log(f"Final Pipeline Error: {str(e)}")
        if job_id in generation_jobs:
            generation_jobs[job_id]["status"] = "Error"

def generate_with_hf(topic, context_text, task="script"):
    """
    Bulletproof Fallback: Tries multiple high-availability models with auto-warmup.
    """
    token = os.getenv("HF_API_TOKEN")
    if not token:
        raise Exception("HF_API_TOKEN missing. Please check .env")

    # High availability models (circa 2026)
    models = [
        "google/gemma-2-9b-it",
        "meta-llama/Llama-3.1-8B-Instruct",
        "mistralai/Mistral-7B-Instruct-v0.3"
    ]
    
    headers = {"Authorization": f"Bearer {token}"}
    
    if task == "script":
        prompt = f"""Write a HIGH-ENGAGEMENT, 60-second spoken script about {topic} based on the transcript below.
        CRITICAL: The script must be exactly 160-180 words to ensure a 1-minute delivery with gTTS.
        Structure: Hook (5s) -> 3 Main Points (45s) -> Outro (10s).
        Provide ONLY the spoken words.
        Transcript snippet: {context_text[:4000]}"""
    else:
        prompt = f"Extract 6 visual keywords for Unsplash: {context_text[:1500]}"

    payload = {
        "inputs": f"<start_of_turn>user\n{prompt}<end_of_turn>\n<start_of_turn>model\n",
        "parameters": {"max_new_tokens": 800, "temperature": 0.8}
    }

    import time
    for model_id in models:
        url = f"https://api-inference.huggingface.co/models/{model_id}"
        print(f"[{task}] Trying model: {model_id}")
        
        for attempt in range(5): # Aggressive retry for loading models
            try:
                response = requests.post(url, headers=headers, json=payload, timeout=45)
                output = response.json()

                if isinstance(output, dict) and "estimated_time" in output:
                    wait = min(output["estimated_time"], 15)
                    print(f"Model {model_id} is warming up... waiting {wait}s")
                    time.sleep(wait)
                    continue

                if isinstance(output, list) and len(output) > 0:
                    text = output[0].get("generated_text", "")
                    if text: return text.strip()
                
                if isinstance(output, dict) and "generated_text" in output:
                    return output["generated_text"].strip()
                
                if "error" in str(output).lower():
                    print(f"Model {model_id} error: {output}")
                    break # Skip to next model

            except Exception as e:
                print(f"Request failed: {str(e)}")
                break # Skip to next model
    
    return f"Manual script for {topic}: The video discusses {context_text[:100]}... (Please add detail for 60s)"
