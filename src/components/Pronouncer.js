import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  CheckCircle, 
  AlertCircle, 
  Target,
  TrendingUp,
  Star,
  RotateCcw,
  Play,
  Pause,
  Square,
  Settings,
  HelpCircle,
  BarChart3,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useProfile } from '../contexts/ProfileContext';

const Pronouncer = () => {
  const { addPoints, learnWords, improveAccuracy } = useProfile();
  const [currentWord, setCurrentWord] = useState(null);
  const [userRecording, setUserRecording] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [recognitionRef] = useState(useRef(null));
  const [currentCategory, setCurrentCategory] = useState('All');
  const [sessionStats, setSessionStats] = useState({
    wordsPracticed: 0,
    averageScore: 0,
    timeSpent: 0,
    improvement: 0
  });
  const [wordCategories, setWordCategories] = useState([
    { name: 'All', count: 0 },
    { name: 'Greetings', count: 0 },
    { name: 'Politeness', count: 0 },
    { name: 'Basic', count: 0 },
    { name: 'Formal', count: 0 },
    { name: 'Advanced', count: 0 }
  ]);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);
  const [hasGeneratedFirstWord, setHasGeneratedFirstWord] = useState(false);

  // Get speech recognition language code
  const getSpeechRecognitionLang = () => {
    return 'hi-IN';
  };

  // Get speech synthesis language code
  const getSpeechSynthesisLang = () => {
    return 'hi-IN';
  };

  // Load saved data on component mount
  useEffect(() => {
    const savedScore = localStorage.getItem('pronouncerScore');
    const savedAttempts = localStorage.getItem('pronouncerAttempts');
    if (savedScore) setScore(parseInt(savedScore));
    if (savedAttempts) setTotalAttempts(parseInt(savedAttempts));
  }, []);

  // Save data when score or attempts change
  useEffect(() => {
    localStorage.setItem('pronouncerScore', score.toString());
    localStorage.setItem('pronouncerAttempts', totalAttempts.toString());
    updateSessionStats();
    updateWordCategories();
  }, [score, totalAttempts]);

  const currentWordRef = useRef(currentWord);
  useEffect(() => {
    currentWordRef.current = currentWord;
  }, [currentWord]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = getSpeechRecognitionLang();

      recognitionRef.current.onresult = (event) => {
        const wordToCompare = currentWordRef.current;
        console.log('currentWord at recognition:', wordToCompare);
        if (!wordToCompare || !wordToCompare.word) {
          toast.error('No word to compare. Please try again.');
          return;
        }
        const userSpeech = event.results[0][0].transcript;
        setUserRecording(userSpeech);
        analyzePronunciation(userSpeech, wordToCompare.word);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast.error('Speech recognition error. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    } else {
      toast.error('Speech recognition not supported in this browser.');
    }
  }, []);

  // Generate first word when component mounts
  useEffect(() => {
    if (!currentWord && !hasGeneratedFirstWord) {
      setHasGeneratedFirstWord(true);
      generateNewWord();
    }
  }, []);

  // Generate new word when difficulty changes
  useEffect(() => {
    if (currentWord && !isGeneratingWord) {
      generateNewWord();
    }
  }, [difficulty]);

  // Reset component when language changes
  useEffect(() => {
    setCurrentWord(null);
    setUserRecording('');
    setFeedback(null);
    setHasGeneratedFirstWord(false);
    // Generate new word for the new language
    setTimeout(() => {
      generateNewWord();
    }, 100);
  }, []);

  const generateNewWord = async () => {
    if (isGeneratingWord) return;
    setIsGeneratingWord(true);
    
    try {
      console.log('Generating word for difficulty:', difficulty);
      
      const prompt = `Generate a ${difficulty} level Hindi word for language learning. 
      Return ONLY in this exact format:
      Word: [Hindi word in Devanagari script]
      Translation: [English translation]
      Tip: [Pronunciation tip in English]
      
      Make it appropriate for ${difficulty} level Hindi learners.`;

      const response = await fetch('http://127.0.0.1:5001/api/generate-word', {
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
      
      if (!data.word || !data.translation || !data.tips) {
        throw new Error('Invalid response format from backend');
      }
      
      setCurrentWord({
        word: data.word,
        translation: data.translation,
        tips: data.tips,
        category: difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
      });
      
      console.log('Successfully set word:', data.word, data.translation);
    } catch (e) {
      console.error('Error generating word:', e);
      
      // Show error message to user
      if (e.message.includes('rate limit')) {
        toast.error('Gemini API rate limit reached. Please wait a few minutes and try again.');
      } else {
        toast.error(`Could not generate word: ${e.message}`);
      }
      
      // Don't set any word - let user try again
      setCurrentWord(null);
    } finally {
      setFeedback(null);
      setUserRecording('');
      setIsGeneratingWord(false);
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not available');
      return;
    }

    setUserRecording('');
    setFeedback(null);
    recognitionRef.current.start();
    setIsRecording(true);
    toast.success('Recording started - speak now!');
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const playWord = () => {
    if (!currentWord) return;

    setIsPlaying(true);
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      
      // Set language code
      utterance.lang = getSpeechSynthesisLang();
      
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
        console.log('Using voice:', selectedVoice.name, 'for language:', 'Hindi');
      } else {
        console.log('No native voice found for Hindi, using default');
      }
      
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlaying(false), 2000);
      toast.success('Listen to the pronunciation!');
    }
  };

  const analyzePronunciation = async (userSpeech, correctWord) => {
    try {
      // Use Gemini to check if the user's pronunciation is correct or close enough
      const response = await fetch('http://127.0.0.1:5001/api/check-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAnswer: userSpeech,
          correctAnswer: correctWord,
          question: `Pronounce this word: "${correctWord}"`,
          questionType: 'Pronunciation'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to check pronunciation');
      }

      const data = await response.json();
      console.log('Pronunciation check result:', data);
      
      const isCorrect = data.isCorrect;
      const explanation = data.explanation;
      
      // Calculate accuracy based on similarity if not correct
      let accuracy = isCorrect ? 100 : 0;
      if (!isCorrect) {
        accuracy = Math.round(calculateSimilarity(userSpeech, correctWord) * 100);
      }
      
      let feedbackMessage = '';
      if (isCorrect) {
        feedbackMessage = 'Correct! Well done!';
        toast.success(`Correct! Accuracy: ${accuracy}%`);
        // Add points and improve accuracy
        console.log('Pronouncer: Adding 5 points for correct pronunciation');
        addPoints(5, 'Correct pronunciation');
        console.log('Pronouncer: Improving accuracy');
        improveAccuracy(accuracy);
        console.log('Pronouncer: Learning 1 word');
        learnWords(1);
      } else {
        feedbackMessage = 'Try again!';
        toast.error(`Try again! Accuracy: ${accuracy}%`);
        // Small consolation points for effort
        console.log('Pronouncer: Adding 1 point for pronunciation practice');
        addPoints(1, 'Pronunciation practice');
      }
      
      setFeedback({
        accuracy,
        isCorrect,
        message: feedbackMessage,
        userSpeech,
        explanation: explanation
      });
      setScore(prev => prev + (isCorrect ? 10 : 0));
      setTotalAttempts(prev => prev + 1);
    } catch (error) {
      console.error('Error checking pronunciation:', error);
      
      // Fallback to old similarity calculation
      const similarity = calculateSimilarity(userSpeech, correctWord);
      const accuracy = Math.round(similarity * 100);
      let isCorrect = similarity >= 0.7;
      let feedbackMessage = '';
      
      if (isCorrect) {
        feedbackMessage = 'Correct! Well done!';
        toast.success(`Correct! Accuracy: ${accuracy}%`);
        addPoints(5, 'Correct pronunciation');
        improveAccuracy(accuracy);
        learnWords(1);
      } else {
        feedbackMessage = 'Try again!';
        toast.error(`Try again! Accuracy: ${accuracy}%`);
        addPoints(1, 'Pronunciation practice');
      }
      
      setFeedback({
        accuracy,
        isCorrect,
        message: feedbackMessage,
        userSpeech
      });
      setScore(prev => prev + (isCorrect ? 10 : 0));
      setTotalAttempts(prev => prev + 1);
    }
  };

  const calculateSimilarity = (userSpeech, correctWord) => {
    // Normalize, remove punctuation, whitespace, and invisible chars, and use Unicode NFC
    const clean = (str) =>
      (str || '')
        .normalize('NFC')
        .replace(/[।॥.,!?;:'"`\-\[\](){}<>\s\u200C\u200D]/g, '') // Remove punctuation, whitespace, ZWNJ/ZWJ
        .toLowerCase();

    const normalizedUser = clean(userSpeech);
    const normalizedCorrect = clean(correctWord);

    console.log('Normalized user:', normalizedUser);
    console.log('Normalized correct:', normalizedCorrect);

    // If exact match, return 1.0
    if (normalizedUser === normalizedCorrect) {
      console.log('Exact match found!');
      return 1.0;
    }

    // If one is empty, return 0
    if (!normalizedUser || !normalizedCorrect) return 0;

    // Split into words (should be single word, but for robustness)
    const inputWords = normalizedUser.split(/\s+/).filter(Boolean);
    const correctWords = normalizedCorrect.split(/\s+/).filter(Boolean);

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
    const maxWords = Math.max(inputWords.length, correctWords.length);
    const wordSimilarity = matchingWords / maxWords;

    // Character-level similarity (Levenshtein)
    const charSimilarity = calculateCharacterSimilarity(normalizedUser, normalizedCorrect);
    const isSingleWord = correctWords.length <= 1;
    const finalSimilarity = isSingleWord
      ? (wordSimilarity * 0.3) + (charSimilarity * 0.7)
      : (wordSimilarity * 0.7) + (charSimilarity * 0.3);

    console.log('Word similarity:', wordSimilarity);
    console.log('Character similarity:', charSimilarity);
    console.log('Final similarity:', finalSimilarity);

    return finalSimilarity;
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

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'text-green-600',
      'A': 'text-green-600',
      'B': 'text-yellow-600',
      'C': 'text-orange-600',
      'D': 'text-red-600'
    };
    return colors[grade] || colors.C;
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playCorrectPronunciation = () => {
    if (currentWord) {
      playWord();
    }
  };

  const updateSessionStats = () => {
    const newSessionStats = {
      wordsPracticed: totalAttempts,
      averageScore: totalAttempts > 0 ? Math.round(score / totalAttempts) : 0,
      timeSpent: Math.round(totalAttempts * 2), // Estimate 2 minutes per word
      improvement: totalAttempts > 5 ? Math.round((score / totalAttempts - 5) * 2) : 0 // Simple improvement calculation
    };
    setSessionStats(newSessionStats);
  };

  const updateWordCategories = () => {
    if (!currentWord) return;
    
    const newCategories = [...wordCategories];
    const category = newCategories.find(c => c.name === currentWord.category);
    if (category) {
      category.count++;
    }
    setWordCategories(newCategories);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-heading font-bold text-gray-800 mb-4">
          Pronouncer
        </h1>
        <p className="text-xl text-gray-600 font-display">
          Perfect your pronunciation with targeted feedback on individual words
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="premium-card">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <button
                  onClick={toggleRecording}
                  className={`mic-button ${isRecording ? 'recording' : ''}`}
                  disabled={!currentWord || !currentWord.word}
                >
                  {isRecording ? (
                    <Square className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </button>
              </div>
              <p className="text-lg text-gray-600 mb-4">
                {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
              </p>
              <div className="flex justify-center space-x-4">
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
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Difficulty Level</h3>
                <div className="flex space-x-2">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        difficulty === level
                          ? 'bg-gray-700 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Word</h3>
                <div className="text-center">
                  {!currentWord || !currentWord.word ? (
                    <div className="py-8">
                      <p className="text-gray-600 mb-4">No word loaded yet</p>
                      <button
                        onClick={generateNewWord}
                        disabled={isGeneratingWord}
                        className={`btn-primary ${isGeneratingWord ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isGeneratingWord ? (
                          <>
                            <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Generating Word...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-5 h-5 mr-2" />
                            Generate First Word
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-gray-800 mb-2">{currentWord.word}</p>
                      <p className="text-gray-600 mb-4">{currentWord.translation}</p>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={playCorrectPronunciation}
                          className="btn-secondary"
                        >
                          <Volume2 className="w-5 h-5 mr-2" />
                          Listen to Correct Pronunciation
                        </button>
                        <button
                          onClick={generateNewWord}
                          disabled={isGeneratingWord}
                          className={`btn-secondary ${isGeneratingWord ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isGeneratingWord ? (
                            <>
                              <div className="w-5 h-5 mr-2 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-5 h-5 mr-2" />
                              Next Word
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {userRecording && feedback && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Result</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Your answer:</p>
                      <p className="text-gray-800 font-medium">{feedback.userSpeech}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Correct answer:</p>
                      <p className="text-gray-800 font-medium text-green-600">{currentWord.word}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Accuracy:</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gray-700 h-2 rounded-full"
                            style={{ width: `${feedback.accuracy}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{feedback.accuracy}%</span>
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
                <span className="text-gray-600">Words Practiced</span>
                <span className="text-gray-800 font-semibold">{sessionStats.wordsPracticed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Score</span>
                <span className="text-gray-800 font-semibold">{sessionStats.averageScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Time Spent</span>
                <span className="text-gray-800 font-semibold">{sessionStats.timeSpent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Improvement</span>
                <span className="text-green-600 font-semibold">+{sessionStats.improvement}%</span>
              </div>
            </div>
          </div>

          <div className="premium-card">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Word Categories</h3>
            <div className="space-y-3">
              {wordCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCategory(category.name)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    currentCategory === category.name
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm">{category.count} words</span>
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

export default Pronouncer; 
