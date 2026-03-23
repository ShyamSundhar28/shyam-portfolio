from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import os

from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Automated YouTube Shorts Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")

# Placeholder in-memory store for tracking jobs
generation_jobs = {}

class GenerateRequest(BaseModel):
    topic: str
    video_id: str
    region: str = "US"

import re

def parse_duration(duration_str):
    """Parse an ISO8601 duration string (e.g., 'PT1H2M3S') and return duration in seconds."""
    hours = minutes = seconds = 0
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration_str)
    if match:
        if match.group(1): hours = int(match.group(1))
        if match.group(2): minutes = int(match.group(2))
        if match.group(3): seconds = int(match.group(3))
    return hours * 3600 + minutes * 60 + seconds

@app.get("/api/trending/{region}")
async def get_trending_videos(region: str):
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
                    "description": "A deep dive into the latest technological advancements globally..."
                },
                {
                    "id": "mock_2",
                    "title": f"AI Breakthroughs Explored ({region} Edition)",
                    "channel": "AI Explained",
                    "thumbnail": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=640&q=80",
                    "views": "850K views",
                    "description": "Understanding how generative AI is transforming industries..."
                },
                {
                    "id": "mock_3",
                    "title": "Cloud Computing Trends 2026",
                    "channel": "Cloud Architect Weekly",
                    "thumbnail": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=640&q=80",
                    "views": "2.1M views",
                    "description": "The evolution of serverless and event-driven architectures..."
                }
            ]
        }

    import requests
    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "snippet,statistics,contentDetails",
        "chart": "mostPopular",
        "regionCode": region,
        "maxResults": 50,
        "key": YOUTUBE_API_KEY
    }
    
    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
        
    data = response.json()
    videos = []
    
    for item in data.get("items", []):
        duration_str = item.get("contentDetails", {}).get("duration", "")
        if duration_str:
            duration_sec = parse_duration(duration_str)
            if duration_sec < 60:
                continue  # Skip short videos (under 60s)
                
        snippet = item.get("snippet", {})
        stats = item.get("statistics", {})
        
        # Get highest resolution thumbnail
        thumbnails = snippet.get("thumbnails", {})
        thumb_url = thumbnails.get("maxres", thumbnails.get("high", thumbnails.get("medium", {}))).get("url", "")
        
        videos.append({
            "id": item.get("id"),
            "title": snippet.get("title"),
            "channel": snippet.get("channelTitle"),
            "thumbnail": thumb_url,
            "views": f"{int(stats.get('viewCount', 0)):,} views",
            "description": snippet.get("description", "")[:150] + "..."
        })
        
        if len(videos) >= 10:
            break
            
    return {"videos": videos}

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
    background_tasks.add_task(generate_short_pipeline, job_id, req.topic)
    
    return {"job_id": job_id, "message": "Generation started successfully"}

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    if job_id not in generation_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return generation_jobs[job_id]


def generate_short_pipeline(job_id: str, topic: str):
    """
    Main orchestration pipeline for creating the YouTube Short.
    Steps: Summarize -> Emotion -> Audio -> Images -> Assembly -> Output.
    """
    def log(msg):
        generation_jobs[job_id]["logs"].append(msg)
        generation_jobs[job_id]["status"] = msg
        print(f"[{job_id}] {msg}")

    try:
        log(f"Fetching trending content for topic: {topic}")
        # TODO: Implement Beautiful Soup / YouTube API scraping
        
        log("Executing Hybrid Summarization (TF-IDF & BART)...")
        # TODO: Integrate Hugging Face transformers pipeline
        
        log("Running text through Emotion Classifier...")
        # TODO: Detect text tone and output label
        
        log("Synthesizing narration using gTTS...")
        # TODO: Use gTTS to create audio.mp3
        
        log("Retrieving visual media (Unsplash/DuckDuckGo fallback)...")
        # TODO: Fetch around 6 images matched to the script chunks
        
        log("Assembling final video using MoviePy and FFmpeg...")
        # TODO: Stitch images, audio, and watermarking into output.mp4
        
        log("Deployment Finished")
        generation_jobs[job_id]["status"] = "Completed"
        generation_jobs[job_id]["video_url"] = f"/downloads/{job_id}/output.mp4"
        
    except Exception as e:
        log(f"Failed with error: {str(e)}")
        generation_jobs[job_id]["status"] = "Error"
