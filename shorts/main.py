import sys
from generator import generate_script

def main():
    if len(sys.argv) < 2:
        print("Usage: python main.py <prompt>")
        sys.exit(1)
    
    prompt = " ".join(sys.argv[1:])
    print(f"--- Generating Script for '{prompt}' ---\n")
    
    try:
        script = generate_script(prompt)
        print(script)
        print("\n--- Generation Complete ---")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
