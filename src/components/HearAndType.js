import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Headphones, 
  Volume2, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Play,
  Pause,
  Target,
  TrendingUp,
  Star,
  Settings,
  HelpCircle,
  BarChart3,
  BookOpen,
  Square
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useProfile } from '../contexts/ProfileContext';

const HearAndType = () => {
  const { addPoints, learnWords } = useProfile();
  const [currentPhrase, setCurrentPhrase] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [sessionStats, setSessionStats] = useState({
    phrasesPracticed: 0,
    averageScore: 0,
    timeSpent: 0,
    improvement: 0
  });
  const [phraseCategories, setPhraseCategories] = useState([
    { name: 'All', count: 0 },
    { name: 'Greetings', count: 0 },
    { name: 'Politeness', count: 0 },
    { name: 'Basic', count: 0 },
    { name: 'Formal', count: 0 },
    { name: 'Advanced', count: 0 }
  ]);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isGeneratingPhrase, setIsGeneratingPhrase] = useState(false);
  const [hasGeneratedFirstPhrase, setHasGeneratedFirstPhrase] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentAccuracy, setCurrentAccuracy] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [accuracyHistory, setAccuracyHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get speech synthesis language code
  const getSpeechSynthesisLang = () => {
    return 'hi-IN';
  };

  // Get the best available voice for Hindi
  const getBestVoice = () => {
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
    
    return selectedVoice;
  };

  // Load saved data on component mount
  useEffect(() => {
    const savedScore = localStorage.getItem('hearAndTypeScore');
    const savedAttempts = localStorage.getItem('hearAndTypeAttempts');
    
    if (savedScore) setScore(parseInt(savedScore));
    if (savedAttempts) setTotalAttempts(parseInt(savedAttempts));
  }, []);

  // Generate first phrase when component mounts (only once)
  useEffect(() => {
    if (!currentPhrase && !isGeneratingPhrase && !hasGeneratedFirstPhrase) {
      setHasGeneratedFirstPhrase(true);
      generateNewPhrase();
    }
  }, []); // Empty dependency array to run only once on mount

  // Generate new phrase when difficulty changes
  useEffect(() => {
    if (currentPhrase && !isGeneratingPhrase) {
      generateNewPhrase();
    }
  }, [difficulty]);

  // Reset component when language changes
  useEffect(() => {
    setCurrentPhrase(null);
    setUserInput('');
    setIsGeneratingPhrase(false);
    // Generate new phrase for the new language
    setTimeout(() => {
      generateNewPhrase();
    }, 100);
  }, [difficulty]);

  // Save data when score or attempts change
  useEffect(() => {
    localStorage.setItem('hearAndTypeScore', score.toString());
    localStorage.setItem('hearAndTypeAttempts', totalAttempts.toString());
  }, [score, totalAttempts]);

  const generateNewPhrase = async () => {
    if (isGeneratingPhrase) return;
    setIsGeneratingPhrase(true);
    
    try {
      console.log('Generating phrase for difficulty:', difficulty);
      
      const prompt = `Generate a ${difficulty} level Hindi phrase for language learning. 
      Return ONLY in this exact format:
      Phrase: [Hindi phrase in Devanagari script]
      Translation: [English translation]
      
      Make it appropriate for ${difficulty} level Hindi learners.`;

      const response = await fetch('http://127.0.0.1:5001/api/generate-phrase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          difficulty: difficulty
        })
      });

      console.log('Backend response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend API error:', errorText);
        
        // Check if it's a rate limit error
        if (response.status === 429) {
        throw new Error('Gemini API rate limit reached. Please wait a few minutes and try again.');
        }
        
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);
      
      if (!data.phrase || !data.translation) {
        throw new Error('Invalid response format from backend');
      }
      
      setCurrentPhrase({
        text: data.phrase,
        translation: data.translation,
        category: difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
      });
      
      console.log('Successfully set phrase:', data.phrase, data.translation);
    } catch (e) {
      console.error('Error generating phrase:', e);
      
      // Show error message to user
      if (e.message.includes('rate limit')) {
        toast.error('Gemini API rate limit reached. Please wait a few minutes and try again.');
      } else {
        toast.error(`Could not generate phrase: ${e.message}`);
      }
      
      // Don't set any phrase - let user try again
      setCurrentPhrase(null);
    } finally {
      setUserInput('');
      setIsGeneratingPhrase(false);
    }
  };

  const togglePlayback = () => {
    if (!currentPhrase) return;

    setIsPlaying(!isPlaying);
    
    // Simulate speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentPhrase.text);
      
      // Set language code
      utterance.lang = getSpeechSynthesisLang();
      
      // Get the best available voice
      const selectedVoice = getBestVoice();
      
      // Set the voice if found
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using voice:', selectedVoice.name, 'for language:', 'Hindi');
      } else {
        console.log('No native voice found for', 'Hindi', 'using default');
      }
      
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    } else {
      // Fallback for browsers without speech synthesis
      setTimeout(() => setIsPlaying(false), 2000);
      toast.success('Listen carefully to the phrase!');
    }
  };

  const checkAnswer = async () => {
    if (!userInput.trim() || !currentPhrase) return;

    setIsLoading(true);
    setTotalAttempts(prev => prev + 1);
    
    try {
      // Use Gemini to check if the user's answer is correct or close enough
      const response = await fetch('http://127.0.0.1:5001/api/check-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAnswer: userInput,
          correctAnswer: currentPhrase.text,
          question: `Listen and type: "${currentPhrase.translation}"`,
          questionType: 'HearAndType'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to check answer');
      }

      const data = await response.json();
      console.log('Answer check result:', data);
      
      const isCorrect = data.isCorrect;
      const explanation = data.explanation;
      
      // Calculate accuracy based on similarity if not correct
      let accuracy = isCorrect ? 100 : 0;
      if (!isCorrect) {
        accuracy = calculateSimilarity(userInput, currentPhrase.text);
      }
      
      setIsCorrect(isCorrect);
      setCurrentAccuracy(accuracy);
      setShowAnswer(true);
      
      // Add to accuracy history
      setAccuracyHistory(prev => [...prev, accuracy]);

      if (isCorrect) {
        setScore(prev => prev + 10);
        toast.success(`Correct! Accuracy: ${accuracy}%`);
        // Add points and learn words
        console.log('Awarding 10 points for correct phrase typing');
        addPoints(10, 'Correct phrase typing');
        console.log('Awarding 4 points for learning 2 words');
        learnWords(2); // Learn 2 words from the phrase
        
        // Reset for next phrase after a short delay
        setTimeout(() => {
          setUserInput('');
          setShowAnswer(false);
          setIsCorrect(false);
          generateNewPhrase();
        }, 2000);
      } else {
        toast.error(`Try again! Accuracy: ${accuracy}%`);
        // Small consolation points for effort
        console.log('Awarding 2 points for practice');
        addPoints(2, 'Phrase typing practice');
      }
    } catch (error) {
      console.error('Error checking answer:', error);
      toast.error('Could not check answer. Please try again.');
      
      // Fallback to old similarity calculation
      const similarity = calculateSimilarity(userInput, currentPhrase.text);
      const accuracy = Math.round(similarity * 100);
      const correct = similarity >= 0.8;
      
      setIsCorrect(correct);
      setCurrentAccuracy(accuracy);
      setShowAnswer(true);
      setAccuracyHistory(prev => [...prev, accuracy]);

      if (correct) {
        setScore(prev => prev + 10);
        toast.success(`Correct! Accuracy: ${accuracy}%`);
        addPoints(10, 'Correct phrase typing');
        learnWords(2);
        
        setTimeout(() => {
          setUserInput('');
          setShowAnswer(false);
          setIsCorrect(false);
          generateNewPhrase();
        }, 2000);
      } else {
        toast.error(`Try again! Accuracy: ${accuracy}%`);
        addPoints(2, 'Phrase typing practice');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSimilarity = (input, correct) => {
    // Normalize both strings
    const normalizedInput = input.trim().toLowerCase();
    const normalizedCorrect = correct.trim().toLowerCase();
    
    // If exact match, return 1.0
    if (normalizedInput === normalizedCorrect) {
      return 1.0;
    }
    
    // Split into words
    const inputWords = normalizedInput.split(/\s+/).filter(word => word.length > 0);
    const correctWords = normalizedCorrect.split(/\s+/).filter(word => word.length > 0);
    
    // If one is empty, return 0
    if (inputWords.length === 0 || correctWords.length === 0) {
      return 0;
    }
    
    // Count matching words
    let matchingWords = 0;
    const usedCorrectWords = new Set();
    
    for (const inputWord of inputWords) {
      for (let i = 0; i < correctWords.length; i++) {
        if (!usedCorrectWords.has(i) && inputWord === correctWords[i]) {
          matchingWords++;
          usedCorrectWords.add(i);
          break;
        }
      }
    }
    
    // Calculate similarity based on word overlap
    const maxWords = Math.max(inputWords.length, correctWords.length);
    const wordSimilarity = matchingWords / maxWords;
    
    // Also consider character-level similarity for partial matches
    const charSimilarity = calculateCharacterSimilarity(normalizedInput, normalizedCorrect);
    
    // Combine word and character similarity (weighted average)
    return (wordSimilarity * 0.7) + (charSimilarity * 0.3);
  };

  const calculateCharacterSimilarity = (input, correct) => {
    if (input === correct) return 1.0;
    if (input.length === 0 || correct.length === 0) return 0;
    
    // Use Levenshtein distance for character similarity
    const matrix = [];
    for (let i = 0; i <= input.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= correct.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= input.length; i++) {
      for (let j = 1; j <= correct.length; j++) {
        if (input[i - 1] === correct[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + 1
          );
        }
      }
    }
    
    const distance = matrix[input.length][correct.length];
    const maxLength = Math.max(input.length, correct.length);
    return 1 - (distance / maxLength);
  };

  const getDifficultyColor = (level) => {
    const colors = {
      easy: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      hard: 'text-red-600 bg-red-100'
    };
    return colors[level] || colors.medium;
  };

  const getAccuracy = () => {
    if (accuracyHistory.length === 0) return 0;
    const average = accuracyHistory.reduce((sum, acc) => sum + acc, 0) / accuracyHistory.length;
    return Math.round(average);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-heading font-bold text-gray-800 mb-4">
          Hear & Type
        </h1>
        <p className="text-xl text-gray-600 font-display">
          Train your ear by listening to Hindi phrases and typing what you hear
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="premium-card">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <button
                  onClick={togglePlayback}
                  disabled={!currentPhrase}
                  className="w-20 h-20 bg-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white shadow-premium transition-all duration-300"
                >
                  {isPlaying ? (
                    <Square className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </button>
              </div>
              <p className="text-lg text-gray-600 mb-4">
                {currentPhrase ? 'Click to listen to the phrase' : 'No phrase available'}
              </p>
              <div className="flex justify-center space-x-4">
                {!currentPhrase && (
                  <button
                    onClick={generateNewPhrase}
                    disabled={isGeneratingPhrase}
                    className={`btn-primary ${isGeneratingPhrase ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isGeneratingPhrase ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating Phrase...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Generate Phrase
                      </>
                    )}
                  </button>
                )}
                <button className="btn-secondary">
                  <Settings className="w-5 h-5 mr-2" />
                  Settings
                </button>
                <button className="btn-secondary">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Help
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Type What You Hear</h3>
                {currentPhrase ? (
                  <>
                    <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Current phrase:</p>
                      <p className="text-lg font-medium text-gray-800">{currentPhrase.text}</p>
                      <p className="text-sm text-gray-500">{currentPhrase.translation}</p>
                    </div>
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Type what you hear..."
                      className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-gray-600">
                        {userInput.length} characters
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={checkAnswer}
                          disabled={!userInput.trim()}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Check Answer
                        </button>
                        <button
                          onClick={generateNewPhrase}
                          disabled={isGeneratingPhrase}
                          className={`btn-secondary ${isGeneratingPhrase ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isGeneratingPhrase ? (
                            <>
                              <div className="w-4 h-4 mr-2 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Next Phrase
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Generate a phrase to start practicing</p>
                    <button
                      onClick={generateNewPhrase}
                      disabled={isGeneratingPhrase}
                      className={`btn-primary ${isGeneratingPhrase ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isGeneratingPhrase ? (
                        <>
                          <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Generating Phrase...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-5 h-5 mr-2" />
                          Generate Phrase
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {showAnswer && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Result</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Your answer:</p>
                      <p className="text-gray-800 font-medium">{userInput}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Correct answer:</p>
                      <p className="text-gray-800 font-medium text-green-600">{currentPhrase.text}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Accuracy:</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gray-700 h-2 rounded-full"
                            style={{ width: `${currentAccuracy}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{currentAccuracy}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="premium-card">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Session Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phrases Completed</span>
                <span className="text-gray-800 font-semibold">{totalAttempts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Accuracy</span>
                <span className="text-gray-800 font-semibold">{getAccuracy()}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Time Spent</span>
                <span className="text-gray-800 font-semibold">{/* sessionStats.timeSpent */}</span>
              </div>
            </div>
          </div>

          <div className="premium-card">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Difficulty Level</h3>
            <div className="space-y-3">
              {['easy', 'medium', 'hard'].map((level, index) => (
                <button
                  key={index}
                  onClick={() => setDifficulty(level)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    difficulty === level
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HearAndType; 
