import os
from google import genai

api_key = os.getenv('GEMINI_API_KEY')

if not api_key:
    raise SystemExit('Please set GEMINI_API_KEY before running this script!')

print('Testing Gemini API key...')
print(f'Key prefix: {api_key[:10]}...')

try:
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model='gemini-2.5-flash-lite',
        contents='Translate "Hello" to Hindi briefly.'
    )
    print('✅ Gemini API key works!')
    print('Response:', response.text)
except Exception as exc:
    print('❌ Gemini API key failed:', exc)
    raise
