import os
from google import genai


def test_gemini_key():
    """Verify that GEMINI_API_KEY can call Gemini 2.5 Flash-Lite."""
    api_key = os.getenv('GEMINI_API_KEY')

    if not api_key:
        print("❌ No GEMINI_API_KEY found in environment variables!")
        print("Please set GEMINI_API_KEY before running this script.")
        return False

    if api_key.startswith('sk-'):
        print("❌ The current key looks like an OpenAI key. Please use a Gemini key instead.")
        return False

    print(f"✅ GEMINI_API_KEY found: {api_key[:10]}...")

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents="Say 'Hello' in Hindi."
        )
        print("✅ Gemini API test successful!")
        print(f"Response: {response.text}")
        return True
    except Exception as e:
        print(f"❌ Gemini API test failed: {e}")
        return False


if __name__ == "__main__":
    test_gemini_key()
