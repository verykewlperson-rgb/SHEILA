import requests
import json

def test_endpoints():
    base_url = "http://127.0.0.1:5001"
    
    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"Root endpoint: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Root endpoint failed: {e}")
        return
    
    # Test generate-word endpoint
    try:
        response = requests.post(
            f"{base_url}/api/generate-word",
            headers={"Content-Type": "application/json"},
            json={"prompt": "Generate a simple Hindi word", "difficulty": "easy"}
        )
        print(f"Generate-word endpoint: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Generate-word endpoint failed: {e}")
    
    # Test generate-phrase endpoint
    try:
        response = requests.post(
            f"{base_url}/api/generate-phrase",
            headers={"Content-Type": "application/json"},
            json={"prompt": "Generate a simple Hindi phrase", "difficulty": "easy"}
        )
        print(f"Generate-phrase endpoint: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Generate-phrase endpoint failed: {e}")

if __name__ == "__main__":
    test_endpoints() 