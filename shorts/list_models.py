import os
from google import genai
from dotenv import load_dotenv

# Load environment variables
env_paths = [
    os.path.join(os.path.dirname(__file__), '..', '.env'),
    os.path.join(os.getcwd(), '.env')
]
for path in env_paths:
    if os.path.exists(path):
        load_dotenv(path)
        break

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    api_key = "AIzaSyAL2bBHRTs_a9hL7oCNK-m44eKg1P5927Q"

client = genai.Client(api_key=api_key)
try:
    models = client.models.list()
    for m in models:
        print(m.name)
except Exception as e:
    print(f"Error: {e}")
