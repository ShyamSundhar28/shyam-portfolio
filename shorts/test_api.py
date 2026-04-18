import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from the parent directory's .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'youtube-shorts-generator', '.env'))

api_key = os.getenv("GOOGLE_API_KEY")
print(f"Using API Key: {api_key[:5]}...{api_key[-5:] if api_key else 'None'}")
genai.configure(api_key=api_key)

try:
    print("Available models:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error: {e}")
