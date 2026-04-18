import generator
import os
import sys

prompt = "Virat Kohli"
print(f"--- TESTING GENERATION FOR: {prompt} ---")

try:
    script = generator.generate_script(prompt)
    print(f"\n[SCRIPT]\n{script[:200]}...")

    keywords = generator.extract_keywords(script, prompt)
    print(f"\n[KEYWORDS]\n{keywords}")

    scenes = generator.generate_visual_prompts(prompt, keywords)
    print(f"\n[SCENES]\n{scenes}")

    images = generator.fetch_images(scenes, prompt)
    print(f"\n[IMAGES]\n{images}")
    
    if len(images) < 6:
        print(f"\n[ERROR] Only {len(images)} images generated. Expected 6.")
except Exception as e:
    print(f"\n[CRITICAL ERROR] {e}")
    import traceback
    traceback.print_exc()
