import os
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
from google import genai
client = genai.Client(api_key=api_key)

for model_name in ["gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-flash-latest"]:
    print(f"\n--- Testing {model_name} ---")
    try:
        response = client.models.generate_content(model=model_name, contents="Say hello in one word")
        print(f"OK: {response.text}")
        break
    except Exception as e:
        print(f"FAILED: {str(e)[:120]}")
