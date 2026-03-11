import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  Volume2, 
  Mic, 
  RotateCcw,
  TrendingUp,
  Clock,
  Filter,
  Download,
  Target,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useProfile } from '../contexts/ProfileContext';

const SolvingMistakes = () => {
  const { userStats } = useProfile();
  const [mistakes, setMistakes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [questionType, setQuestionType] = useState('pronunciation'); // 'pronunciation' or 'typing'

  // Load mistakes from localStorage on component mount
  useEffect(() => {
    console.log('🔍 [SolvingMistakes] Loading mistakes from localStorage...');
    const savedMistakes = localStorage.getItem('hindiMistakes');
    let allMistakes = [];
    
    if (savedMistakes) {
      allMistakes = JSON.parse(savedMistakes);
      console.log('📦 [SolvingMistakes] Found saved mistakes:', allMistakes.length, allMistakes);
    } else {
      console.log('📦 [SolvingMistakes] No saved mistakes found');
    }
    
    // Load last feedback from Live Speaker and add it as a mistake if it's not encouragement
    const lastFeedback = localStorage.getItem('hindiLiveSpeakerLastFeedback');
    if (lastFeedback) {
      try {
        const feedback = JSON.parse(lastFeedback);
        console.log('🎯 Found last feedback:', feedback);
        // Only add if it's not encouragement and not already in the list
        if (feedback.type && feedback.type !== 'Encouragement' && feedback.type !== 'encouragement') {
          const existingMistake = allMistakes.find(m => 
            m.message === feedback.message && m.suggestion === feedback.suggestion
          );
          
          if (!existingMistake) {
            const newMistake = {
              id: Date.now() + Math.random(),
              type: feedback.type,
              message: feedback.message,
              suggestion: feedback.suggestion,
              corrected: feedback.corrected || 'Practice this concept',
              errorType: feedback.type,
              date: new Date().toLocaleDateString(),
              frequency: 1,
              practiceCount: 0
            };
            allMistakes.unshift(newMistake); // Add to the beginning
            console.log('✅ Added feedback as mistake:', newMistake);
          }
        }
      } catch (error) {
        console.error('❌ Error parsing last feedback:', error);
      }
    }
    
    console.log('🎯 Final mistakes array:', allMistakes.length, 'mistakes');
    console.log('📝 Mistakes:', allMistakes);
    
    setMistakes(allMistakes);
    localStorage.setItem('hindiMistakes', JSON.stringify(allMistakes));
  }, []);

  // Save mistakes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hindiMistakes', JSON.stringify(mistakes));
  }, [mistakes]);

  // Listen for storage changes to update mistakes in real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'hindiMistakes' || e.key === 'hindiLiveSpeakerLastFeedback') {
        // Reload mistakes when storage changes
        const savedMistakes = localStorage.getItem('hindiMistakes');
        if (savedMistakes) {
          const parsed = JSON.parse(savedMistakes);
          setMistakes(parsed);
          console.log('🔄 [SolvingMistakes] Reloaded mistakes from storage event:', parsed);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const refreshMistakes = () => {
    const savedMistakes = localStorage.getItem('hindiMistakes');
    if (savedMistakes) {
      setMistakes(JSON.parse(savedMistakes));
      toast.success('Mistakes refreshed!');
    } else {
      toast.error('No mistakes found');
    }
  };

  const addTestMistake = () => {
    const testMistake = {
      id: Date.now() + Math.random(),
      type: 'Test',
      message: 'This is a test mistake to verify the system is working.',
      suggestion: 'This should appear in the mistake list.',
      corrected: 'Test correction',
      errorType: 'Test',
      date: new Date().toLocaleDateString(),
      frequency: 1,
      practiceCount: 0
    };
    
    setMistakes(prev => [testMistake, ...prev]);
    localStorage.setItem('hindiMistakes', JSON.stringify([testMistake, ...mistakes]));
    toast.success('Test mistake added!');
  };

  const startPractice = (mistake) => {
    // Generate a proper practice question instead of using the mistake message
    generateSimilarQuestion(mistake.type);
    setUserAnswer('');
    toast.success('Practice session started!');
  };

  const checkAttempt = async () => {
    if (!currentQuestion) return;

    // Use Gemini to check if the user's answer is correct or close enough
    try {
      const response = await fetch('http://127.0.0.1:5001/api/check-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAnswer: userAnswer,
          answers: currentQuestion.allAnswers || [currentQuestion.corrected], // Use all answers if available
          question: currentQuestion.message,
          questionType: currentQuestion.type
        })
      });
      if (!response.ok) {
        throw new Error('Failed to check answer');
      }
      const data = await response.json();
      if (data.isCorrect) {
        toast.success('Excellent! You got it right!');
        updateMistakeProgress(currentQuestion.id, true);
        setTimeout(() => {
          generateSimilarQuestion(currentQuestion.type);
          setUserAnswer('');
        }, 1500);
      } else {
        toast.error('Try again. Here\'s the correct answer.');
        updateMistakeProgress(currentQuestion.id, false);
        setFeedback({
          userAnswer: userAnswer,
          correctAnswer: currentQuestion.corrected,
          message: data.explanation || "Here's the correct answer:"
        });
        setTimeout(() => {
          generateSimilarQuestion(currentQuestion.type);
          setUserAnswer('');
          setFeedback(null);
        }, 3000);
      }
    } catch (e) {
      toast.error('Could not check answer.');
    }
  };

  const calculateSimilarity = (attempt, correct) => {
    // Simple similarity calculation (in real app, use more sophisticated NLP)
    const attemptWords = attempt.toLowerCase().split(' ');
    const correctWords = correct.toLowerCase().split(' ');
    const commonWords = attemptWords.filter(word => correctWords.includes(word));
    return commonWords.length / Math.max(attemptWords.length, correctWords.length);
  };

  const updateMistakeProgress = (mistakeId, wasCorrect) => {
    setMistakes(prev => prev.map(mistake => {
      if (mistake.id === mistakeId) {
        return {
          ...mistake,
          frequency: wasCorrect ? Math.max(0, mistake.frequency - 1) : mistake.frequency + 1,
          lastPracticed: new Date().toISOString().split('T')[0]
        };
      }
      return mistake;
    }));
  };

  // Pool of questions for each type
  const questionPools = {
    'Grammar': [
      { question: 'Complete this sentence with the correct verb form: मैं दिल्ली ___ (जाना)', answer: 'जा रहा हूँ' },
      { question: 'Fill in the blank: वह स्कूल ___ (जाना) है', answer: 'जा रही' },
      { question: 'Choose the correct form: तुम क्या ___ (करना) हो?', answer: 'कर रहे' }
    ],
    'Vocabulary': [
      { question: 'Translate this word to Hindi: "water"', answer: 'पानी' },
      { question: 'Translate to Hindi: "book"', answer: 'किताब' },
      { question: 'Translate to Hindi: "friend"', answer: 'दोस्त' }
    ],
    'Fluency': [
      { question: 'Complete this sentence: मैं सुबह 7 बजे ___ (उठना)', answer: 'उठता हूँ' },
      { question: 'Fill in the blank: वह बहुत ___ बोलती है (तेज़/धीरे)', answer: 'धीरे' },
      { question: 'Make a sentence using: "आज मौसम अच्छा है"', answer: 'आज मौसम अच्छा है' }
    ],
    'Pronunciation': [
      { question: 'Practice pronouncing this word: नमस्ते', answer: 'नमस्ते' },
      { question: 'Say this phrase: आप कैसे हैं?', answer: 'आप कैसे हैं?' },
      { question: 'Pronounce: धन्यवाद', answer: 'धन्यवाद' }
    ]
  };

  // Track last question index for each type to avoid repeats
  const lastQuestionIndexRef = React.useRef({});

  const generateSimilarQuestion = async (mistakeType) => {
    try {
      console.log('Generating similar question for type:', mistakeType);
      
      const response = await fetch('http://127.0.0.1:5001/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionType: mistakeType,
          difficulty: 'medium'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate question');
      }

      const data = await response.json();
      console.log('Generated question:', data);
      
      if (!data.question || !data.answers) {
        throw new Error('Invalid response format from backend');
      }
      
      setCurrentQuestion({
        id: Date.now(),
        type: mistakeType,
        message: data.question,
        corrected: data.answers[0], // Use the first answer as the primary correct answer
        suggestion: 'Practice typing the correct answer',
        errorType: mistakeType,
        date: new Date().toISOString().split('T')[0],
        allAnswers: data.answers // Store all possible answers
      });
    } catch (error) {
      console.error('Error generating question:', error);
      
      // Fallback to hardcoded questions
      const pool = questionPools[mistakeType] || questionPools['Grammar'];
      let randomIndex = Math.floor(Math.random() * pool.length);
      // Avoid repeating the last question
      if (lastQuestionIndexRef.current[mistakeType] === randomIndex && pool.length > 1) {
        randomIndex = (randomIndex + 1) % pool.length;
      }
      lastQuestionIndexRef.current[mistakeType] = randomIndex;
      const question = pool[randomIndex];
      setCurrentQuestion({
        id: Date.now(),
        type: mistakeType,
        message: question.question,
        corrected: question.answer,
        suggestion: 'Practice typing the correct answer',
        errorType: mistakeType,
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language code
      utterance.lang = 'hi-IN';
      
      // Get available voices and select a native speaker
      const voices = speechSynthesis.getVoices();
      let selectedVoice = null;
      
      // Look for Hindi voices
      selectedVoice = voices.find(voice => 
        voice.lang.includes('hi-IN') || 
        voice.lang.includes('hi') ||
        voice.name.toLowerCase().includes('hindi') ||
        voice.name.toLowerCase().includes('indian')
      );
      
      // If no native voice found, try to find any voice with the correct language
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('hi'));
      }
      
      // Set the voice if found
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using voice:', selectedVoice.name, 'for language:', 'hindi');
      } else {
        console.log('No native voice found for hindi, using default');
      }
      
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      
      speechSynthesis.speak(utterance);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      hard: 'text-red-600 bg-red-100'
    };
    return colors[difficulty] || colors.medium;
  };

  const getErrorTypeColor = (type) => {
    const colors = {
      'Word Order': 'text-blue-600 bg-blue-100',
      'Pronunciation': 'text-purple-600 bg-purple-100',
      'Grammar': 'text-orange-600 bg-orange-100',
      'Verb Agreement': 'text-indigo-600 bg-indigo-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  // Derived statistics
  const totalMistakes = mistakes.length;

  // Calculate weeklyMistakes (mistakes practiced in the last 7 days)
  const now = new Date();
  const weeklyMistakes = mistakes.filter(m => {
    const last = new Date(m.lastPracticed);
    return (now - last) / (1000 * 60 * 60 * 24) <= 7;
  }).length;

  // Placeholder for improvement (could be calculated based on previous stats)
  const improvement = 0;

  // Practice areas: group by errorType and show progress as percentage of total mistakes
  const errorTypes = Array.from(new Set(mistakes.map(m => m.errorType)));
  const totalMistakesCount = mistakes.length;
  const practiceAreas = errorTypes.map(type => {
    const count = mistakes.filter(m => m.errorType === type).length;
    return {
      name: type,
      progress: totalMistakesCount > 0 ? Math.round((count / totalMistakesCount) * 100) : 0
    };
  });

  // Calculate mistake categories for the sidebar
  const mistakeCategories = mistakes.reduce((acc, mistake) => {
    const type = mistake.type || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-heading font-bold text-gray-800 mb-4">
          Solving Mistakes
        </h1>
        <p className="text-xl text-gray-600 font-display">
          Review and practice corrected versions of your common errors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="premium-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-semibold text-gray-800">Mistake Log</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={refreshMistakes}
                  className="btn-secondary"
                  title="Refresh mistakes from storage"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Practice Interface */}
              {currentQuestion && (
                <div className="border border-blue-300 rounded-xl p-6 bg-blue-50 mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      currentQuestion.type === 'Pronunciation' ? 'bg-gray-700' :
                      currentQuestion.type === 'Grammar' ? 'bg-gray-600' :
                      currentQuestion.type === 'Fluency' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span className="text-lg font-semibold text-blue-800">Practice Session</span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-800 font-medium mb-2">{currentQuestion.message}</p>
                    <p className="text-gray-600 text-sm mb-4">{currentQuestion.suggestion}</p>
                    
                    {currentQuestion.type === 'Pronunciation' ? (
                      <div className="text-center py-6">
                        <div className="mb-4">
                          <Volume2 className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-lg font-medium text-gray-800 mb-2">Pronunciation Practice</p>
                          <p className="text-gray-600">This is a pronunciation mistake. Use the Pronouncer section to practice speaking and get audio feedback.</p>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentQuestion(null);
                            toast.success('Navigate to the Pronouncer section to practice pronunciation!');
                          }}
                          className="btn-primary"
                        >
                          Go to Pronouncer
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
                          <p className="text-gray-800 font-medium">{currentQuestion.message}</p>
                        </div>
                        
                        {/* Feedback Display */}
                        {feedback && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
                            <p className="text-yellow-800 font-medium mb-2">{feedback.message}</p>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">Your answer: <span className="font-medium text-gray-800">{feedback.userAnswer}</span></p>
                              <p className="text-sm text-gray-600">Correct answer: <span className="font-medium text-green-700">{feedback.correctAnswer}</span></p>
                            </div>
                          </div>
                        )}
                        
                        <textarea
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Type your answer here..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={checkAttempt}
                            disabled={!userAnswer.trim()}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Check Answer
                          </button>
                          <button
                            onClick={() => {
                              generateSimilarQuestion(currentQuestion.type);
                              setUserAnswer('');
                            }}
                            className="btn-secondary"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Try Similar Question
                          </button>
                          <button
                            onClick={() => {
                              setCurrentQuestion(null);
                              setUserAnswer('');
                            }}
                            className="btn-secondary"
                          >
                            Close Practice
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Existing mistake log */}
              {[...mistakes].reverse().map((mistake, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-soft transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        mistake.type === 'Pronunciation' ? 'bg-gray-700' :
                        mistake.type === 'Grammar' ? 'bg-gray-600' :
                        mistake.type === 'Fluency' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}></div>
                      <span className="font-semibold text-lg text-gray-800">{mistake.type}</span>
                    </div>
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        // Remove mistake from log and update localStorage
                        const updated = mistakes.filter((_, i) => i !== mistakes.length - 1 - index);
                        setMistakes(updated);
                        localStorage.setItem('hindiMistakes', JSON.stringify(updated));
                        toast.success('Marked as finished!');
                      }}
                    >
                      Mark as Finished
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => speakText(mistake.corrected)}
                        className="flex items-center space-x-2 text-accent-600 hover:text-accent-700 font-medium"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Listen</span>
                      </button>
                      <button 
                        onClick={() => startPractice(mistake)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 font-medium"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Practice</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Practice count:</span>
                      <span className="text-sm font-medium text-gray-700">{mistake.practiceCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="premium-card">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Mistake Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Mistakes</span>
                <span className="text-gray-800 font-semibold">{totalMistakes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">This Week</span>
                <span className="text-gray-800 font-semibold">{weeklyMistakes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Improvement</span>
                <span className="text-green-600 font-semibold">+{improvement}%</span>
              </div>
            </div>
          </div>

          <div className="premium-card">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Practice Focus</h3>
            <div className="space-y-3">
              {practiceAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{area.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-700 h-2 rounded-full"
                        style={{ width: `${area.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{area.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Mistake Categories</h3>
            <div className="space-y-3">
              {Object.entries(mistakeCategories).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{category}</span>
                  <span className="text-sm text-gray-500">{count} mistakes</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolvingMistakes; 
