import os
import requests
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '..', 'youtube-shorts-generator', '.env')
load_dotenv(env_path)

api_key = os.getenv("GOOGLE_API_KEY")
cse_id = os.getenv("GOOGLE_CSE_ID")

print(f"Testing with API_KEY: {api_key[:10]}...")

# Try a basic text search first
query = "Hardik Pandya"
url = f"https://customsearch.googleapis.com/customsearch/v1?key={api_key}&cx={cse_id}&q={query}&num=3"

try:
    response = requests.get(url)
    data = response.json()
    if 'items' in data:
        print("Success (Text Search)! First title:")
        print(data['items'][0]['title'])
    else:
        print("Blocked or Error in Text Search:")
        print(data)
except Exception as e:
    print(f"Exception: {e}")
