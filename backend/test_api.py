import requests
import json

def test_api():
    base_url = "http://127.0.0.1:5001"
    
    # Test 1: Check if server is running
    try:
        response = requests.get(f"{base_url}/api/test")
        print("✅ Test endpoint:", response.json())
    except Exception as e:
        print("❌ Test endpoint failed:", e)
        return
    
    # Test 2: Generate a question
    try:
        response = requests.post(f"{base_url}/api/generate-question", 
                               json={"questionType": "Vocabulary", "difficulty": "medium"})
        print("✅ Generate question:", response.json())
    except Exception as e:
        print("❌ Generate question failed:", e)
    
    # Test 3: Check a correct answer
    try:
        response = requests.post(f"{base_url}/api/check-answer", 
                               json={
                                   "userAnswer": "पानी",
                                   "answers": ["पानी", "जल", "नीर"],
                                   "question": "Translate this word to Hindi: water",
                                   "questionType": "Vocabulary"
                               })
        print("✅ Check correct answer:", response.json())
    except Exception as e:
        print("❌ Check correct answer failed:", e)
    
    # Test 4: Check an incorrect answer
    try:
        response = requests.post(f"{base_url}/api/check-answer", 
                               json={
                                   "userAnswer": "गलत",
                                   "answers": ["पानी", "जल", "नीर"],
                                   "question": "Translate this word to Hindi: water",
                                   "questionType": "Vocabulary"
                               })
        print("✅ Check incorrect answer:", response.json())
    except Exception as e:
        print("❌ Check incorrect answer failed:", e)
    
    # Test 5: Check a partially correct answer
    try:
        response = requests.post(f"{base_url}/api/check-answer", 
                               json={
                                   "userAnswer": "पान",
                                   "answers": ["पानी", "जल", "नीर"],
                                   "question": "Translate this word to Hindi: water",
                                   "questionType": "Vocabulary"
                               })
        print("✅ Check partial answer:", response.json())
    except Exception as e:
        print("❌ Check partial answer failed:", e)

if __name__ == "__main__":
    test_api() 