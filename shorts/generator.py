import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
from gtts import gTTS
import requests
import re
import spacy
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer, util

# Load NLP models lazily
nlp_model = None
kw_model = None
similarity_model = None

def get_nlp():
    global nlp_model
    if nlp_model is None:
        try:
            nlp_model = spacy.load("en_core_web_sm")
        except:
            nlp_model = None
    return nlp_model

def get_kw_model():
    global kw_model
    if kw_model is None:
        try:
            kw_model = KeyBERT()
        except:
            kw_model = None
    return kw_model

def get_similarity_model():
    global similarity_model
    if similarity_model is None:
        try:
            similarity_model = SentenceTransformer('all-MiniLM-L6-v2')
        except:
            similarity_model = None
    return similarity_model

# Load environment variables
env_paths = [
    os.path.join(os.path.dirname(__file__), '.env'), # PROPRIETARY: Prioritize local .env in shorts folder
    os.path.join(os.path.dirname(__file__), '..', '.env'),
    os.path.join(os.path.dirname(__file__), '..', 'youtube-shorts-generator', '.env'),
    os.path.join(os.getcwd(), '.env')
]
loaded_any = False
for path in env_paths:
    print(f"DEBUG: Checking for env at {path}")
    if os.path.exists(path):
        load_dotenv(path)
        print(f"DEBUG: Loaded env from {path}")
        loaded_any = True
        break

api_key = os.getenv("GOOGLE_API_KEY")
cse_id = os.getenv("GOOGLE_CSE_ID")
unsplash_key = os.getenv("UNSPLASH_ACCESS_KEY")

print(f"DEBUG: API Key present: {bool(api_key)}")
print(f"DEBUG: CSE ID present: {bool(cse_id)}")

# Create a global genai client
client = genai.Client(api_key=api_key)

def get_clarification_question(prompt: str) -> str:
    """
    Asks Gemini to clarify the user's intent with specific facts to avoid confusion.
    """
    cl_prompt = f"The user entered the prompt: '{prompt}'. Identify the top 2-3 key facts about this subject (e.g., if it's a person, what is their profession and current role?). Then, create a one-sentence confirmation question. Format: 'You want a 60-second Short about [Name], the [Fact 1] and [Fact 2], right?'"
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=cl_prompt
        )
        return response.text.strip() if response.text else f"You want a Short about '{prompt}', right?"
    except:
        return f"You want a Short about '{prompt}', right?"

def generate_script(prompt: str) -> str:
    """
    Generates a two-paragraph script for a 1-minute YouTube Short using Gemini.
    """
    full_prompt = f"Write a compelling, high-engagement script for a 60-second YouTube Short about: {prompt}. Exactly two paragraphs. 140-160 words. Spoken text only."
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=full_prompt
        )
        return response.text.strip() if response.text else "Error generating script."
    except Exception as e:
        print(f"Error generating script: {e}")
        return "Error generating script."

def extract_keywords(script: str, original_prompt: str) -> list:
    """
    Advanced keyword extraction using spaCy (NER) and KeyBERT.
    Then ranked by similarity to the original prompt.
    """
    entities = []
    nlp = get_nlp()
    if nlp:
        doc = nlp(script)
        entities = [ent.text for ent in doc.ents if ent.label_ in ["PERSON", "ORG", "GPE", "EVENT", "PRODUCT"]]
    
    bert_words = []
    kw_m = get_kw_model()
    if kw_m:
        keywords_bert = kw_m.extract_keywords(script, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=10)
        bert_words = [kw[0] for kw in keywords_bert]
    
    # Combined and ranked by similarity to original prompt
    candidates = list(set(entities + bert_words))
    if not candidates:
        return [original_prompt] * 6

    sim_model = get_similarity_model()
    if sim_model:
        prompt_embedding = sim_model.encode(original_prompt)
        candidate_embeddings = sim_model.encode(candidates)
        similarities = util.cos_sim(prompt_embedding, candidate_embeddings)[0]
        
        # Zip and sort
        scored_candidates = sorted(zip(similarities.tolist(), candidates), key=lambda x: x[0], reverse=True)
        return [c[1] for c in scored_candidates[:6]]
    
    return candidates[:6]

def generate_visual_prompts(user_input_prompt: str, keywords: list) -> list:
    """
    Uses Gemini to generate 6 expert visual scenes based on NLP-extracted keywords.
    """
    keyword_str = ", ".join(keywords)
    prompt = f"Expert Visual Prompt Generator. Topic: {user_input_prompt}. Keywords: {keyword_str}. Generate exactly 6 unique, highly relevant scene prompts. Format: Scene X: [Details]"
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        if not response.text: return []
        scenes = re.findall(r"Scene \d+: (.+)", response.text)
        return scenes[:6]
    except Exception as e:
        print(f"Error generating visual prompts: {e}")
        return []

def fetch_images(keywords: list, original_prompt: str) -> list:
    """
    STRICT: Fetches 6 unique images using Google CSE as primary.
    Falls back to Unsplash ONLY if Google fails.
    """
    queries = [original_prompt] + keywords
    final_images = []
    used_links = set()
    sim_model = get_similarity_model()

    if api_key and cse_id:
        print("DEBUG: Starting Google CSE search...")
        for q in queries[:10]:
            if len(final_images) >= 6: break
            try:
                url = f"https://customsearch.googleapis.com/customsearch/v1?key={api_key}&cx={cse_id}&q={q}&searchType=image&num=10"
                res = requests.get(url).json()
                items = res.get('items', [])
                if not items: 
                    print(f"DEBUG: No items found for query '{q}' in Google Search.")
                    continue

                scored_items = []
                if sim_model:
                    prompt_embedding = sim_model.encode(f"{original_prompt} {q}")
                    for item in items:
                        link = item['link']
                        if link in used_links: continue
                        title = item.get('title', '')
                        snippet = item.get('snippet', '')
                        metadata_text = f"{title} {snippet}"
                        meta_embedding = sim_model.encode(metadata_text)
                        score = util.cos_sim(prompt_embedding, meta_embedding).item()
                        scored_items.append((score, link))
                else:
                    for item in items:
                        if item['link'] not in used_links:
                            scored_items.append((0, item['link']))

                scored_items.sort(key=lambda x: x[0], reverse=True)
                for score, link in scored_items:
                    if link not in used_links:
                        final_images.append(link)
                        used_links.add(link)
                        print(f"DEBUG: Added image from Google Search: {link}")
                        break
            except Exception as e:
                print(f"DEBUG: Google Search error for query '{q}': {e}")
    else:
        print("DEBUG: Google credentials missing. Skipping primary search.")

    # Fallback to Unsplash if missing images
    if len(final_images) < 6:
        print(f"DEBUG: Google search provided {len(final_images)} images. Falling back to Unsplash for remainder.")
        missing_count = 6 - len(final_images)
        unsplash_res = fetch_images_unsplash(queries, original_prompt)
        
        for url in unsplash_res:
            if url not in used_links:
                final_images.append(url)
                used_links.add(url)
                if len(final_images) >= 6: break

    while len(final_images) < 6:
        final_images.append("https://images.unsplash.com/photo-1531415074968-036ba1b575da")
        
    return final_images[:6]

def fetch_images_unsplash(queries: list, original_prompt: str) -> list:
    """
    Improved Unsplash fallback. Ensures 6 unique and relevant images.
    """
    image_results = []
    used_ids = set()
    
    # Process up to 6 unique queries
    # Dedup queries first to avoid redundant searches
    unique_queries = []
    for q in queries:
        if q.lower() not in [uq.lower() for uq in unique_queries]:
            unique_queries.append(q)
    
    while len(unique_queries) < 10: # Give some buffer
        unique_queries.append(original_prompt)

    for q in unique_queries:
        if len(image_results) >= 6:
            break
            
        try:
            # Clean query: take first 2-3 words, remove punctuation
            clean_q = re.sub(r'[^\w\s]', '', q).strip()
            # If the keyword is too short or abstract, combine with prompt
            if len(clean_q.split()) < 2:
                search_q = f"{original_prompt} {clean_q}"
            else:
                search_q = clean_q

            res = requests.get(f"https://api.unsplash.com/search/photos?query={search_q}&per_page=15&client_id={unsplash_key or 'xJ61lsCDcP-cBa1D9UGv1_p0Uun_SbJFA1lEPt0Wt_g'}").json()
            results = res.get('results', [])
            
            # Find the best unique result from this search
            found_for_q = False
            for r in results:
                if r['id'] not in used_ids:
                    image_results.append(r['urls']['regular'])
                    used_ids.add(r['id'])
                    found_for_q = True
                    break
            
            # If still nothing for this specific query, try a broader search later
        except Exception as e:
            print(f"Unsplash error for '{q}': {e}")

    # Final padding with unique results if still less than 6
    if len(image_results) < 6:
        try:
            res = requests.get(f"https://api.unsplash.com/search/photos?query={original_prompt}&per_page=30&client_id={unsplash_key or 'xJ61lsCDcP-cBa1D9UGv1_p0Uun_SbJFA1lEPt0Wt_g'}").json()
            for r in res.get('results', []):
                if r['id'] not in used_ids:
                    image_results.append(r['urls']['regular'])
                    used_ids.add(r['id'])
                    if len(image_results) >= 6: break
        except: pass

    while len(image_results) < 6:
        image_results.append("https://images.unsplash.com/photo-1531415074968-036ba1b575da")

    return image_results[:6]

def text_to_speech(text: str, output_path: str):
    """
    Converts text to speech using gTTS and saves it to the output_path.
    """
    tts = gTTS(text=text, lang='en')
    tts.save(output_path)
    return output_path

if __name__ == "__main__":
    # Quick test
    test_prompt = "tiger"
    print(f"Generating script for: {test_prompt}...\n")
    script = generate_script(test_prompt)
    print(script)
