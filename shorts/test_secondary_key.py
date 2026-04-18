import os
import requests
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

# Try the YouTube API key as a secondary test
api_key = os.getenv("YOUTUBE_API_KEY")
cse_id = os.getenv("GOOGLE_CSE_ID")

print(f"Testing with YOUTUBE_API_KEY: {api_key[:10]}...")
print(f"CSE_ID: {cse_id}")

query = "cricket"
url = f"https://customsearch.googleapis.com/customsearch/v1?key={api_key}&cx={cse_id}&q={query}&searchType=image"

try:
    response = requests.get(url)
    print(f"Status: {response.status_code}")
    print(response.json())
except Exception as e:
    print(f"Error: {e}")
