import os
import json
import language_tool_python
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
from google.genai import types

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))

GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_KEY_ENV = 'GEMINI_API_KEY'

# DEBUG: Print the API key info so the backend knows what it sees
gemini_key = os.environ.get(GEMINI_KEY_ENV)
print(f"🔍 DEBUG: {GEMINI_KEY_ENV} =", 'SET' if gemini_key else 'NOT SET')

app = Flask(__name__)
CORS(app)

client = None
if gemini_key:
    try:
        client = genai.Client(api_key=gemini_key)
        print("✅ Gemini API key loaded successfully!")
    except Exception as exc:
        print("❌ Failed to create Gemini client:", exc)
        client = None
else:
    print(f"❌ {GEMINI_KEY_ENV} not found in environment variables!")
    print("🔄 Running in TEST MODE - some features will use fallback responses")

def call_gemini(prompt, system_instruction, temperature=0.7, max_output_tokens=200):
    if not client:
        raise RuntimeError('Gemini client is not configured. Set GEMINI_API_KEY.')

    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        temperature=temperature,
        max_output_tokens=max_output_tokens
    )

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config=config
    )

    # `response.text` returns the generated content as a single string.
    return response.text.strip()

@app.route("/")
def index():
    return "Hindi Learning API is running!"

@app.route("/api/test")
def test():
    return jsonify({"status": "ok", "message": "Backend is working!"})

@app.route('/api/generate-word', methods=['POST'])
def generate_word():
    try:
        data = request.get_json()
        prompt = data.get('prompt', 'Generate a Hindi word for learning')
        difficulty = data.get('difficulty', 'medium')
        print(f"🎯 Generating word for difficulty: {difficulty}")
        if not client:
            return jsonify({'error': 'AI service not available. Please set GEMINI_API_KEY.'}), 500

        ai_response = call_gemini(
            prompt, 
            "You are a helpful Hindi language tutor. Generate Hindi words for language learning.",
            temperature=0.7,
            max_output_tokens=150
        )
        print(f"🤖 Gemini Response: {ai_response}")
        
        # Parse the response
        lines = ai_response.split('\n')
        word = ""
        translation = ""
        tips = ""
        
        for line in lines:
            if line.startswith('Word:'):
                word = line.replace('Word:', '').strip()
            elif line.startswith('Translation:'):
                translation = line.replace('Translation:', '').strip()
            elif line.startswith('Tip:'):
                tips = line.replace('Tip:', '').strip()
        
        if not word or not translation:
            # Fallback parsing
            parts = ai_response.split('\n')
            if len(parts) >= 2:
                word = parts[0].strip()
                translation = parts[1].strip()
                tips = "Practice pronunciation"
        
        return jsonify({
            'word': word,
            'translation': translation,
            'tips': tips
        })
        
    except Exception as e:
        print(f"❌ Error generating word: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-phrase', methods=['POST'])
def generate_phrase():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        difficulty = data.get('difficulty', 'medium')
        print(f"🎯 Generating phrase for difficulty: {difficulty}")
        if not client:
            return jsonify({'error': 'AI service not available. Please set GEMINI_API_KEY.'}), 500
        
        ai_response = call_gemini(
            prompt,
            "You are a helpful Hindi language tutor. Generate Hindi phrases for language learning.",
            temperature=0.7,
            max_output_tokens=200
        )
        print(f"🤖 Gemini Response: {ai_response}")
        
        # Parse the response
        lines = ai_response.split('\n')
        phrase = ""
        translation = ""
        
        for line in lines:
            if line.startswith('Phrase:'):
                phrase = line.replace('Phrase:', '').strip()
            elif line.startswith('Translation:'):
                translation = line.replace('Translation:', '').strip()
        
        if not phrase or not translation:
            # Fallback parsing
            parts = ai_response.split('\n')
            if len(parts) >= 2:
                phrase = parts[0].strip()
                translation = parts[1].strip()
        
        return jsonify({
            'phrase': phrase,
            'translation': translation
        })
        
    except Exception as e:
        print(f"❌ Error generating phrase: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-hindi', methods=['POST'])
def analyze_hindi():
    try:
        data = request.get_json()
        text = data.get('text', '')
        language = data.get('language', 'hindi')
        print(f"🎯 Analyzing Hindi text: {text}")
        if not client:
            return jsonify({'error': 'AI service not available. Please set GEMINI_API_KEY.'}), 500
        
        prompt = f"""Analyze this Hindi text for language learning purposes: "{text}"

Provide feedback in this exact JSON format:
{{
    "feedback": [
        {{
            "type": "grammar|vocabulary|pronunciation|fluency|encouragement",
            "message": "Specific feedback message",
            "suggestion": "How to improve",
            "corrected": "Corrected version of the text (if applicable)"
        }}
    ]
}}

Focus on:
- Grammar: verb conjugation, word order, sentence structure
- Vocabulary: word choice, natural expressions
- Pronunciation: sound patterns, stress, intonation
- Fluency: speaking pace, connecting thoughts
- Encouragement: positive reinforcement when appropriate

For grammar and vocabulary mistakes, provide a corrected version in the "corrected" field.
For pronunciation and fluency, you can leave "corrected" as the original text.
For encouragement, leave "corrected" as the original text.

Return ONLY the JSON, no other text."""
        ai_response = call_gemini(
            prompt,
            "You are a Hindi language tutor. Analyze text and provide constructive feedback in JSON format.",
            temperature=0.3,
            max_output_tokens=400
        )
        print(f"🤖 Gemini Response: {ai_response}")
        
        # Try to parse JSON response
        try:
            result = json.loads(ai_response)
            
            # Ensure each feedback item has a corrected field
            if 'feedback' in result:
                for feedback_item in result['feedback']:
                    if 'corrected' not in feedback_item:
                        feedback_item['corrected'] = text  # Use original text as fallback
            
            return jsonify(result)
        except json.JSONDecodeError:
            # Fallback: create basic feedback
            return jsonify({
                'feedback': [{
                    'type': 'encouragement',
                    'message': 'Good effort! Keep practicing.',
                    'suggestion': 'Continue speaking and listening to improve.',
                    'corrected': text
                }]
            })
        
    except Exception as e:
        print(f"❌ Error analyzing Hindi: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-text', methods=['POST'])
def generate_text():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        difficulty = data.get('difficulty', 'medium')
        print(f"🎯 Generating text for difficulty: {difficulty}")
        if not client:
            return jsonify({'error': 'AI service not available. Please set GEMINI_API_KEY.'}), 500
        
        ai_response = call_gemini(
            prompt,
            "You are a helpful Hindi language tutor. Generate natural Hindi responses for conversations.",
            temperature=0.7,
            max_output_tokens=200
        )
        print(f"🤖 Gemini Response: {ai_response}")
        
        # For conversational responses, just return the text directly
        # Don't try to parse Text: and Translation: format
        return jsonify({
            'text': ai_response,
            'translation': 'Conversational response'
        })
        
    except Exception as e:
        print(f"❌ Error generating text: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/check-answer', methods=['POST'])
def check_answer():
    try:
        data = request.get_json()
        user_answer = data.get('userAnswer', '').strip()
        answers = data.get('answers')
        question = data.get('question', '')
        correct_answer = data.get('correctAnswer', '').strip()
        language = data.get('language', 'hi')  # Default to Hindi

        print(f"🎯 [check-answer] user='{user_answer}', answers={answers}, question='{question}', correct_answer='{correct_answer}'")

        # Accept both new (answers array) and old (correctAnswer) payloads
        correct_answers = []
        if answers and isinstance(answers, list) and len(answers) > 0:
            correct_answers = [a.strip() for a in answers]
        elif correct_answer:
            correct_answers = [correct_answer]
        else:
            print("❌ [check-answer] No answers or correctAnswer provided.")
            return jsonify({'isCorrect': False, 'explanation': 'No correct answers provided to check against.'})

        # Check for exact match
        if user_answer in correct_answers:
            return jsonify({'isCorrect': True, 'explanation': 'Your answer is exactly correct!'})

        # Use LanguageTool for grammar/spelling check
        try:
            tool = language_tool_python.LanguageTool(language)
            matches = tool.check(user_answer)
            corrected = language_tool_python.utils.correct(user_answer, matches)
            # If the corrected version matches a correct answer, accept it
            if corrected in correct_answers:
                return jsonify({'isCorrect': True, 'explanation': 'Your answer is correct after minor corrections.'})
            # If there are grammar/spelling issues, provide feedback
            if matches:
                feedback_msgs = [m.message for m in matches]
                return jsonify({'isCorrect': False, 'explanation': ' '.join(feedback_msgs), 'suggestion': corrected})
            # If no grammar issues but not matching, mark as incorrect
            return jsonify({'isCorrect': False, 'explanation': 'Your answer is not correct. Please try again.', 'suggestion': corrected})
        except Exception as e:
            print(f"❌ [check-answer] LanguageTool error: {e}")
            return jsonify({'isCorrect': False, 'explanation': f'Grammar check error: {e}'})
    except Exception as e:
        print(f"❌ [check-answer] Internal error: {e}")
        return jsonify({'isCorrect': False, 'explanation': f'Internal server error: {e}'})

def calculate_similarity(str1, str2):
    """Calculate similarity between two strings using Levenshtein distance"""
    if not str1 or not str2:
        return 0.0
    
    # Normalize strings
    str1 = str1.strip().lower()
    str2 = str2.strip().lower()
    
    if str1 == str2:
        return 1.0
    
    # Calculate Levenshtein distance
    len1, len2 = len(str1), len(str2)
    matrix = [[0] * (len2 + 1) for _ in range(len1 + 1)]
    
    for i in range(len1 + 1):
        matrix[i][0] = i
    for j in range(len2 + 1):
        matrix[0][j] = j
    
    for i in range(1, len1 + 1):
        for j in range(1, len2 + 1):
            if str1[i-1] == str2[j-1]:
                matrix[i][j] = matrix[i-1][j-1]
            else:
                matrix[i][j] = min(
                    matrix[i-1][j] + 1,      # deletion
                    matrix[i][j-1] + 1,      # insertion
                    matrix[i-1][j-1] + 1     # substitution
                )
    
    distance = matrix[len1][len2]
    max_len = max(len1, len2)
    similarity = 1 - (distance / max_len)
    
    return similarity

@app.route('/api/generate-question', methods=['POST'])
def generate_question():
    try:
        data = request.get_json()
        question_type = data.get('questionType', 'Vocabulary')
        difficulty = data.get('difficulty', 'medium')
        if not client:
            return jsonify({'error': 'AI service not available. Please set GEMINI_API_KEY.'}), 500

        # Define prompt templates for each type and difficulty
        prompt_templates = {
            'Vocabulary': {
                'easy': """Generate an easy Hindi vocabulary question for beginners. Return JSON with two fields: 'question' (the question prompt) and 'answers' (an array of all possible correct answers, including synonyms and alternate spellings). Example: {"question": "Translate this word to Hindi: 'water'", "answers": ["पानी", "जल", "नीर"]}""",
                'medium': """Generate a medium difficulty Hindi vocabulary question for intermediate learners. Return JSON with two fields: 'question' (the question prompt) and 'answers' (an array of all possible correct answers, including synonyms and alternate spellings).""",
                'hard': """Generate a challenging Hindi vocabulary question for advanced learners. Return JSON with two fields: 'question' (the question prompt) and 'answers' (an array of all possible correct answers, including synonyms and alternate spellings)."""
            },
            'Grammar': {
                'easy': """Generate an easy Hindi grammar fill-in-the-blank question for beginners. Return JSON with two fields: 'question' (the question prompt) and 'answers' (an array of all possible correct answers, including alternate forms).""",
                'medium': """Generate a medium difficulty Hindi grammar question for intermediate learners. Return JSON with two fields: 'question' (the question prompt) and 'answers' (an array of all possible correct answers, including alternate forms).""",
                'hard': """Generate a challenging Hindi grammar question for advanced learners. Return JSON with two fields: 'question' (the question prompt) and 'answers' (an array of all possible correct answers, including alternate forms)."""
            },
            'Fluency': {
                'easy': """Generate an easy Hindi sentence completion question for beginners. Return JSON with two fields: 'question' and 'answers' (all valid completions).""",
                'medium': """Generate a medium difficulty Hindi fluency question for intermediate learners. Return JSON with two fields: 'question' and 'answers' (all valid completions).""",
                'hard': """Generate a challenging Hindi fluency question for advanced learners. Return JSON with two fields: 'question' and 'answers' (all valid completions)."""
            },
            'Pronunciation': {
                'easy': """Generate an easy Hindi pronunciation practice question for beginners. Return JSON with two fields: 'question' and 'answers' (all valid pronunciations/spellings).""",
                'medium': """Generate a medium difficulty Hindi pronunciation question for intermediate learners. Return JSON with two fields: 'question' and 'answers' (all valid pronunciations/spellings).""",
                'hard': """Generate a challenging Hindi pronunciation question for advanced learners. Return JSON with two fields: 'question' and 'answers' (all valid pronunciations/spellings)."""
            }
        }
        
        # Get the appropriate prompt template
        type_templates = prompt_templates.get(question_type, prompt_templates['Vocabulary'])
        prompt = type_templates.get(difficulty, type_templates['medium'])

        ai_response = call_gemini(
            prompt,
            "You are a Hindi language tutor. Generate questions and all possible correct answers in JSON only.",
            temperature=0.7,
            max_output_tokens=220
        )
        print(f"🤖 [generate-question] Gemini response: {ai_response}")
        try:
            result = json.loads(ai_response)
            if 'question' in result and 'answers' in result:
                return jsonify(result)
            else:
                print("❌ [generate-question] AI response missing fields.")
                return jsonify({'error': 'AI response missing fields.'}), 500
        except Exception as json_err:
            print(f"❌ [generate-question] JSON parse error: {json_err}")
            return jsonify({'error': 'Could not parse AI response.'}), 500
    except Exception as e:
        print(f"❌ [generate-question] Internal error: {e}")
        return jsonify({'error': f'Internal server error: {e}'}), 500

if __name__ == '__main__':
    app.run(debug=False, port=5001)
