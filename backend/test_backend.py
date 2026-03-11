import requests
import json
import os

def test_backend():
    print("🧪 Testing Backend Connection")
    print("=" * 40)
    
    # Test 1: Basic connection
    try:
        response = requests.get('http://127.0.0.1:5001/api/test')
        if response.status_code == 200:
            print("✅ Backend is running!")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Backend responded with status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Is it running?")
        print("Run: python ai_api.py")
        return False
    
    print()
    
    # Test 2: Check API key status
    print("🔑 Checking Gemini API Key Status")
    print("-" * 30)
    
    api_key = os.getenv('OPENAI_API_KEY')
    if api_key and not api_key.startswith('sk-'):
        print(f"✅ GEMINI_API_KEY is set: {api_key[:7]}...")
    else:
        print("❌ No valid GEMINI_API_KEY found!")
        print("Set your API key with: ./setup_api_key.ps1")
        return False
    
    print()
    
    # Test 3: Generate a question
    print("📝 Testing Question Generation")
    print("-" * 30)
    
    try:
        response = requests.post('http://127.0.0.1:5001/api/generate-question', 
                               json={'questionType': 'Vocabulary', 'difficulty': 'easy'})
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Question generated successfully!")
            print(f"Question: {data.get('question', 'N/A')}")
            print(f"Answers: {data.get('answers', [])}")
        else:
            print(f"❌ Failed to generate question: {response.status_code}")
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error generating question: {e}")
        return False
    
    print()
    
    # Test 4: Test answer checking
    print("✅ Testing Answer Checking")
    print("-" * 30)
    
    try:
        response = requests.post('http://127.0.0.1:5001/api/check-answer',
                               json={
                                   'userAnswer': 'पानी',
                                   'answers': ['पानी', 'जल'],
                                   'question': 'Translate this word to Hindi: "water"'
                               })
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Answer checking works!")
            print(f"Result: {data}")
        else:
            print(f"❌ Failed to check answer: {response.status_code}")
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error checking answer: {e}")
        return False
    
    print()
    print("🎉 All tests passed! Your backend is working correctly.")
    return True

if __name__ == "__main__":
    test_backend() 
