import os
import requests
from dotenv import load_dotenv

# Path to the .env file in the LOCAL directory (shorts/)
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

api_key = os.getenv("GOOGLE_API_KEY")
cse_id = os.getenv("GOOGLE_CSE_ID")

print(f"Testing with API_KEY: {api_key[:10] if api_key else 'None'}... and CSE_ID: {cse_id}")

query = "Hardik Pandya cricketer"
url = f"https://customsearch.googleapis.com/customsearch/v1?key={api_key}&cx={cse_id}&q={query}&searchType=image&num=5"

try:
    response = requests.get(url)
    data = response.json()
    if 'items' in data:
        print("Success! Found images:")
        for item in data['items']:
            print(f"- {item['link']}")
    else:
        print("Error: 'items' not in response.")
        print(f"Full response: {data}")
except Exception as e:
    print(f"Exception: {e}")
