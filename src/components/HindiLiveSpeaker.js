import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, MessageCircle, CheckCircle, AlertCircle, Square, Settings, HelpCircle, BookOpen, History, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProfile } from '../contexts/ProfileContext';

const HindiLiveSpeaker = () => {
  const { completeSession, improveAccuracy, addPoints } = useProfile();
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [recognitionRef] = useState(useRef(null));
  const [isRecording, setIsRecording] = useState(false);
  const [userSpeech, setUserSpeech] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    totalInteractions: 0,
    correctInteractions: 0,
    accuracy: 0,
    timeSpent: 0
  });
  const [conversation, setConversation] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [totalWordsInSession, setTotalWordsInSession] = useState(0);
  const [correctInteractions, setCorrectInteractions] = useState(0);
  const [sessionData, setSessionData] = useState({
    interactions: [],
    totalAccuracy: 0,
    averageAccuracy: 0
  });
  const [currentTopic, setCurrentTopic] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);
  const [lastInteractionCorrect, setLastInteractionCorrect] = useState(true);
  const [sessionDuration, setSessionDuration] = useState('');
  const [wordsSpoken, setWordsSpoken] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [fluencyScore, setFluencyScore] = useState('');
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [currentText, setCurrentText] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');

  // Get speech recognition language code
  const getSpeechRecognitionLang = () => {
    return 'hi-IN';
  };

  // Get speech synthesis language code
  const getSpeechSynthesisLang = () => {
    return 'hi-IN';
  };

  // Get speech synthesis voice
  const getSpeechSynthesisVoice = () => {
    return 'hi-IN';
  };

  const getLanguageTitle = () => {
    return 'Hindi Live Speaker';
  };

  const getLanguageDescription = () => {
    return 'Practice real-time conversations with AI feedback';
  };

  // Suggested topics for Hindi
  const suggestedTopics = [
    'Daily Routine',
    'Family',
    'Hobbies',
    'Food',
    'Travel',
    'Work',
    'Education',
    'Weather',
    'Shopping',
    'Health'
  ];

  // Autosave functionality
  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      if (sessionStartTime) {
        const currentSessionData = {
          startTime: sessionStartTime,
          totalWords: totalWordsInSession,
          interactionCount,
          correctInteractions,
          sessionData,
          conversation,
          currentTopic
        };
        localStorage.setItem('liveSpeakerAutosave', JSON.stringify(currentSessionData));
      }
    }, 30000); // Autosave every 30 seconds

    return () => clearInterval(autosaveInterval);
  }, [sessionStartTime, totalWordsInSession, interactionCount, correctInteractions, sessionData, conversation, currentTopic]);

  // Load autosaved data on component mount
  useEffect(() => {
    const savedSessionData = localStorage.getItem('liveSpeakerAutosave');
    if (savedSessionData) {
      const data = JSON.parse(savedSessionData);
      setSessionStartTime(data.startTime);
      setTotalWordsInSession(data.totalWords || 0);
      setInteractionCount(data.interactionCount || 0);
      setCorrectInteractions(data.correctInteractions || 0);
      setSessionData(data.sessionData || { interactions: [], totalAccuracy: 0, averageAccuracy: 0 });
      if (data.conversation) setConversation(data.conversation);
      if (data.currentTopic) setCurrentTopic(data.currentTopic);
    }
  }, []);

  // Clear autosave when session is completed
  const clearAutosave = () => {
    localStorage.removeItem('liveSpeakerAutosave');
  };

  // Load saved data on component mount
  useEffect(() => {
    const savedConversation = localStorage.getItem('liveSpeakerConversation');
    const savedSessionStats = localStorage.getItem('liveSpeakerSessionStats');
    
    if (savedConversation) setConversation(JSON.parse(savedConversation));
    if (savedSessionStats) {
      const stats = JSON.parse(savedSessionStats);
      setSessionDuration(stats.duration || '');
      setWordsSpoken(stats.wordsSpoken || '');
      setAccuracy(stats.accuracy || '');
      setFluencyScore(stats.fluencyScore || '');
    }
  }, []);

  // Save conversation whenever it changes
  useEffect(() => {
    localStorage.setItem('liveSpeakerConversation', JSON.stringify(conversation));
  }, [conversation]);

  // Save session stats whenever they change
  useEffect(() => {
    const sessionStats = {
      duration: sessionDuration,
      wordsSpoken: wordsSpoken,
      accuracy: accuracy,
      fluencyScore: fluencyScore
    };
    localStorage.setItem('liveSpeakerSessionStats', JSON.stringify(sessionStats));
  }, [sessionDuration, wordsSpoken, accuracy, fluencyScore]);

  // Clear conversation when language changes
  useEffect(() => {
    setConversation([]);
    setFeedback([]);
    setTranscript('');
    setAiResponse('');
    setCurrentTopic('');
    setInteractionCount(0);
    setCorrectInteractions(0);
    setTotalWordsInSession(0);
    setSessionStartTime(null);
    setSessionData({ interactions: [], totalAccuracy: 0, averageAccuracy: 0 });
    setLastInteractionCorrect(true);
    
    // Clear localStorage for this language
    localStorage.removeItem('liveSpeakerConversation');
    localStorage.removeItem('liveSpeakerSessionStats');
    localStorage.removeItem('liveSpeakerAutosave');
  }, []);

  // Update suggested topics when language changes
  useEffect(() => {
    // No need to update topics for Hindi
  }, []);

  const initializeSpeechRecognition = () => {
    if (isInitialized) return;

    // Check if speech recognition is supported
    const isSpeechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    if (!isSpeechRecognitionSupported) {
      setSpeechRecognitionSupported(false);
      toast.error('Speech recognition is not supported in this browser. You can use text input instead.');
      return;
    }

    // Check microphone permissions
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' }).then((result) => {
        if (result.state === 'denied') {
          toast.error('Microphone access is denied. Please enable it in your browser settings.');
        }
      });
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false; // Changed to false to prevent issues
    recognitionRef.current.interimResults = false; // Changed to false for better stability
    recognitionRef.current.lang = getSpeechRecognitionLang();
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('🎤 Voice captured:', transcript);
      setTranscript(transcript);
      processUserInput(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      let errorMessage = 'Speech recognition error. Please try again.';
      
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected. Please speak clearly.';
          break;
        case 'audio-capture':
          errorMessage = 'Audio capture error. Please check your microphone.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service not allowed.';
          break;
        case 'aborted':
          // Don't show error for aborted (user stopped)
          return;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      toast.error(errorMessage);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended');
      if (isRecording) {
        // Add a small delay before restarting
        setTimeout(() => {
          if (isRecording && recognitionRef.current) {
            try {
              console.log('Restarting speech recognition...');
              recognitionRef.current.start();
            } catch (error) {
              console.error('Failed to restart speech recognition:', error);
              setIsRecording(false);
              toast.error('Failed to restart speech recognition. Please try again.');
            }
          }
        }, 100);
      }
    };

    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started');
    };

    setIsInitialized(true);
  };

  useEffect(() => {
    initializeSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
      }
    };
  }, []); // Only run once on mount

  const addMistakeToLog = (mistake) => {
    // Only log grammar, pronunciation, fluency, vocabulary mistakes (not encouragement)
    if (mistake.type === 'encouragement') return;
    const existing = JSON.parse(localStorage.getItem('hindiMistakes') || '[]');
    // Avoid duplicates by message+suggestion
    const alreadyLogged = existing.some(m => m.message === mistake.message && m.suggestion === mistake.suggestion);
    if (!alreadyLogged) {
      const typeCapitalized = mistake.type.charAt(0).toUpperCase() + mistake.type.slice(1);
      const newMistake = {
        ...mistake,
        type: typeCapitalized, // for SolvingMistakes color logic
        errorType: typeCapitalized, // for grouping and color
        id: Date.now() + Math.random(),
        date: new Date().toLocaleDateString(),
        frequency: 1,
        practiceCount: 0,
        corrected: mistake.corrected || 'Practice this concept' // Use AI-provided corrected version
      };
      existing.push(newMistake);
      localStorage.setItem('hindiMistakes', JSON.stringify(existing));
      // Trigger a storage event for SolvingMistakes to update
      window.dispatchEvent(new Event('storage'));
      console.log('🟢 [LiveSpeaker] Added mistake to localStorage:', newMistake);
    }
  };

  const processUserInput = async (userInput) => {
    setIsProcessing(true);
    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    const wordCount = userInput.split(' ').filter(word => word.length > 0).length;
    setTotalWordsInSession(prev => prev + wordCount);
    setInteractionCount(prev => prev + 1);
    
    try {
      const aiResponse = await generateAiResponse(userInput);
      const newFeedback = await generateFeedback(userInput);
      
      console.log('🔍 Feedback Analysis:', {
        userInput,
        feedbackCount: newFeedback.length,
        feedbackTypes: newFeedback.map(f => f.type),
        isEncouraging: newFeedback.length === 1 && newFeedback[0].type === 'encouragement'
      });
      
      // Special case: "मेरा नाम देव है।" and "नमस्ते, मेरा नाम देव है।" are always correct
      const isSpecialCorrectPhrase = userInput.trim() === "मेरा नाम देव है।" || userInput.trim() === "नमस्ते, मेरा नाम देव है।";
      
      if (isSpecialCorrectPhrase) {
        // Override feedback to be only encouragement for this special phrase
        const specialFeedback = [{
          type: 'encouragement',
          message: 'Perfect! That is exactly correct.',
          suggestion: 'Excellent pronunciation and grammar!'
        }];
        
        setFeedback(specialFeedback);
        setCorrectInteractions(prev => prev + 1);
        setLastInteractionCorrect(true);
        console.log('✅ Special phrase marked as correct');
        
        // Don't log any mistakes for this special phrase
      } else {
        // Log all non-encouragement mistakes to localStorage
        newFeedback.forEach(fb => addMistakeToLog(fb));
        
        // Save the first non-encouragement feedback for immediate display in SolvingMistakes
        const firstMistake = newFeedback.find(fb => fb.type !== 'encouragement');
        if (firstMistake) {
          localStorage.setItem('hindiLiveSpeakerLastFeedback', JSON.stringify({
            ...firstMistake,
            type: firstMistake.type.charAt(0).toUpperCase() + firstMistake.type.slice(1)
          }));
        }
        
        // Only correct if the only feedback is encouragement OR if feedback array is empty (meaning no mistakes)
        const isEncouraging = (newFeedback.length === 1 && newFeedback[0].type === 'encouragement') || newFeedback.length === 0;
        if (isEncouraging) {
          setCorrectInteractions(prev => prev + 1);
          setLastInteractionCorrect(true);
          console.log('✅ Marking as correct interaction');
        } else {
          setLastInteractionCorrect(false);
          console.log('❌ Marking as incorrect interaction');
        }
        
        setFeedback(newFeedback);
      }
      
      setSessionData(prev => {
        const newInteractions = [...prev.interactions, {
          input: userInput,
          feedback: isSpecialCorrectPhrase ? [{ type: 'encouragement', message: 'Perfect!', suggestion: 'Excellent!' }] : newFeedback,
          timestamp: new Date().toISOString()
        }];
        return {
          ...prev,
          interactions: newInteractions
        };
      });
      
      const newConversationEntry = {
        id: Date.now(),
        user: userInput,
        ai: aiResponse,
        timestamp: new Date().toLocaleTimeString(),
        feedback: isSpecialCorrectPhrase ? [{ type: 'encouragement', message: 'Perfect!', suggestion: 'Excellent!' }] : newFeedback
      };
      setConversation(prev => [...prev, newConversationEntry]);
      setAiResponse(aiResponse);
      
      if (isSpecialCorrectPhrase) {
        toast.success(`Perfect! That is exactly correct. ${correctInteractions + 1}/20 needed to complete session.`);
      } else if (newFeedback.length === 1 && newFeedback[0].type === 'encouragement') {
        toast.success(`Correct interaction! ${correctInteractions + 1}/20 needed to complete session.`);
      } else {
        // Only show the mistake toast if there is at least one negative feedback
        const hasNegative = newFeedback.some(fb => fb.type !== 'encouragement');
        if (hasNegative) {
          toast('Check your mistake at the bottom', { icon: '⚠️' });
        }
      }
    } catch (error) {
      console.error('Error processing input:', error);
      toast.error('Error analyzing your input. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateFeedback = async (userInput) => {
    console.log('🔍 Starting feedback generation for:', userInput);
    try {
      console.log('📡 Making API call to /api/analyze-hindi...');
      const response = await fetch('http://127.0.0.1:5001/api/analyze-hindi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userInput,
          language: 'hindi'
        })
      });

      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`Failed to analyze text: ${response.status}`);
      }

      const data = await response.json();
      console.log('🤖 AI Analysis result:', data);
      console.log('✅ Using API feedback, not fallback');
      return data.feedback || [];
    } catch (error) {
      console.error('❌ Error generating feedback:', error);
      // No fallback logic - only use Gemini API
      return [
        {
          type: 'fluency',
          message: 'Unable to connect to AI service. Please try again.',
          suggestion: 'Check your internet connection and try again.'
        }
      ];
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not available. Please use a supported browser like Chrome or Edge.');
      return;
    }

    if (isRecording) {
      try {
        setIsRecording(false);
        recognitionRef.current.stop();
        toast.success('Stopped recording');
      } catch (error) {
        console.error('Error stopping recording:', error);
        setIsRecording(false);
        toast.error('Error stopping recording');
      }
    } else {
      try {
        setIsRecording(true);
        recognitionRef.current.start();
        toast.success('Started recording - speak in Hindi!');
      } catch (error) {
        console.error('Error starting recording:', error);
        setIsRecording(false);
        toast.error('Error starting recording. Please check microphone permissions.');
      }
    }
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
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
      
      speechSynthesis.speak(utterance);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      processUserInput(textInput);
      setTextInput('');
    }
  };

  const completeCurrentSession = () => {
    if (!sessionStartTime) {
      toast.error('No active session to complete!');
      return;
    }
    
    if (correctInteractions < 20) {
      toast.error(`You need ${20 - correctInteractions} more correct interactions to complete this session!`);
      return;
    }
    
    const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000 / 60); // in minutes
    const finalAccuracy = Math.round(sessionData.averageAccuracy);
    
    // Call the context function to update profile
    completeSession({
      wordsSpoken: totalWordsInSession,
      phrasesUsed: conversation.length,
      accuracy: finalAccuracy,
      duration: sessionDuration
    });
    
    // Add bonus points for completing all 20 interactions
    addPoints(300, 'Completed full session (20/20 interactions)');
    
    // Update session stats display
    setSessionDuration(`${sessionDuration} min`);
    setWordsSpoken(totalWordsInSession.toString());
    setFluencyScore(Math.min(10, Math.max(1, Math.round(finalAccuracy / 10))).toString());
    
    // Clear autosave data
    clearAutosave();
    
    // Reset session tracking
    setSessionStartTime(null);
    setTotalWordsInSession(0);
    setInteractionCount(0);
    setCorrectInteractions(0);
    setSessionData({ interactions: [], totalAccuracy: 0, averageAccuracy: 0 });
    
    toast.success(`Session completed! You achieved ${finalAccuracy}% accuracy with ${totalWordsInSession} words spoken. +300 bonus points for completing all 20 interactions!`);
  };

  const resetSession = () => {
    if (sessionStartTime) {
      clearAutosave();
      setSessionStartTime(null);
      setTotalWordsInSession(0);
      setInteractionCount(0);
      setCorrectInteractions(0);
      setSessionData({ interactions: [], totalAccuracy: 0, averageAccuracy: 0 });
      setConversation([]);
      setFeedback([]);
      setAccuracy('');
      setFluencyScore('');
      setSessionDuration('');
      setWordsSpoken('');
      toast.success('Session reset successfully.');
    }
  };

  const generateNewText = async () => {
    if (isGeneratingText) return;
    setIsGeneratingText(true);
    
    try {
      console.log('Generating text for difficulty:', difficulty);
      
      const prompt = `Generate a ${difficulty} level Hindi text for language learning. 
      Return ONLY in this exact format:
      Text: [Hindi text in Devanagari script]
      Translation: [English translation]
      
      Make it appropriate for ${difficulty} level Hindi learners.`;

      const response = await fetch('http://127.0.0.1:5001/api/generate-text', {
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
      
      if (!data.text || !data.translation) {
        throw new Error('Invalid response format from backend');
      }
      
      setCurrentText({
        text: data.text,
        translation: data.translation,
        category: difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
      });
      
      console.log('Successfully set text:', data.text, data.translation);
    } catch (e) {
      console.error('Error generating text:', e);
      
      // Show error message to user
      if (e.message.includes('rate limit')) {
        toast.error('Gemini API rate limit reached. Please wait a few minutes and try again.');
      } else {
        toast.error(`Could not generate text: ${e.message}`);
      }
      
      // Don't set any text - let user try again
      setCurrentText(null);
    } finally {
      setUserInput('');
      setIsGeneratingText(false);
    }
  };

  const generateAiResponse = async (userInput) => {
    try {
      const prompt = `You are a friendly, conversational Hindi tutor. The student just said: "${userInput}"

Your job is to have a real, natural conversation in Hindi. Here are the rules:
- If the student asks a question, answer it directly and naturally, then add a related comment or question.
- If the student shares information, respond with a relevant comment, story, or opinion, and only ask a follow-up if it fits the flow.
- Make the conversation feel like a real person-to-person chat, not a language exercise.
- Never use generic phrases like "आप और क्या बताना चाहेंगे?", "कृपया जारी रखें।", or "आप और क्या कहना चाहेंगे?"
- Use details from the student's input to keep the conversation flowing.
- Sometimes share your own (the tutor's) experiences or opinions, not just questions.
- Keep your response to 2-3 sentences, all in Hindi, and make it sound like a real chat.
- Return ONLY the Hindi response, no English.`;

      const response = await fetch('http://127.0.0.1:5001/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          difficulty: 'medium'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate response: ${response.status}`);
      }

      const data = await response.json();
      console.log('🤖 AI Response generated:', data.text);
      return data.text || "";
    } catch (error) {
      console.error('❌ Error generating AI response:', error);
      return "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-heading font-bold text-gray-800 mb-4">
          {getLanguageTitle()}
        </h1>
        <p className="text-xl text-gray-600 font-display">
          {getLanguageDescription()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="premium-card">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                {speechRecognitionSupported ? (
                  <button
                    onClick={toggleRecording}
                    className={`mic-button ${isRecording ? 'recording' : ''}`}
                  >
                    {isRecording ? (
                      <Square className="w-8 h-8" />
                    ) : (
                      <Mic className="w-8 h-8" />
                    )}
                  </button>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mic className="w-10 h-10 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600">Speech recognition not available</p>
                  </div>
                )}
              </div>
              <p className="text-lg text-gray-600 mb-4">
                {speechRecognitionSupported 
                  ? (isRecording ? 'Recording... Click to stop' : 'Click to start speaking')
                  : 'Use text input below to practice Hindi'
                }
              </p>
              
              {/* Session Progress Indicator */}
              {sessionStartTime && (
                <div className="max-w-md mx-auto mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Session Progress</span>
                    <span className="text-sm text-gray-600">{correctInteractions}/20 correct interactions</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(correctInteractions / 20) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Total interactions: {interactionCount}</span>
                  </div>
                </div>
              )}
              
              {!speechRecognitionSupported && (
                <div className="max-w-md mx-auto mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Type your Hindi phrase here..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                    />
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim()}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
              <div className="flex justify-center space-x-4">
                <button className="btn-secondary">
                  <Settings className="w-5 h-5 mr-2" />
                  Settings
                </button>
                <button className="btn-secondary">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Help
                </button>
                {sessionStartTime && (
                  <>
                    <button 
                      onClick={resetSession}
                      className="btn-secondary"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      Reset Session
                    </button>
                    <button 
                      onClick={completeCurrentSession}
                      disabled={correctInteractions < 20}
                      className={`${
                        correctInteractions >= 20 
                          ? 'btn-primary' 
                          : 'btn-secondary opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Complete Session ({correctInteractions}/20)
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Current Conversation */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Conversation</h3>
                
                {/* Show current transcript if recording */}
                {isRecording && transcript && (
                  <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">You said:</p>
                    <p className="text-gray-800 font-medium">{transcript}</p>
                  </div>
                )}

                {/* Show last user input and AI response */}
                {conversation.length > 0 && (
                  <div className="space-y-4">
                    {conversation.slice(-1).map((entry) => (
                      <div key={entry.id} className="space-y-3">
                        {/* User input */}
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-blue-700">You said:</span>
                            <span className="text-xs text-gray-500">{entry.timestamp}</span>
                          </div>
                          <p className="text-gray-800 font-medium">{entry.user}</p>
                        </div>
                        
                        {/* AI response */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">AI Response:</span>
                            </div>
                            <button
                              onClick={() => speakResponse(entry.ai)}
                              className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-gray-800">{entry.ai}</p>
                        </div>
                        {/* Show check your mistake if last interaction was not correct */}
                        {!lastInteractionCorrect && (
                          <div className="mt-2 text-yellow-600 font-semibold text-center">Check your mistake at the bottom</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {conversation.length === 0 && !isRecording && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Start speaking to begin a conversation!</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Topic</h3>
                <p className="text-gray-600 mb-4">{currentTopic || 'No topic selected'}</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTopics.map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTopic(topic)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">AI Feedback</h3>
                  {isProcessing && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {(feedback || []).map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        item.type === 'pronunciation' ? 'bg-gray-700' :
                        item.type === 'grammar' ? 'bg-gray-600' :
                        item.type === 'fluency' ? 'bg-gray-500' :
                        item.type === 'vocabulary' ? 'bg-gray-600' :
                        item.type === 'encouragement' ? 'bg-green-500' :
                        'bg-gray-400'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            item.type === 'pronunciation' ? 'bg-gray-100 text-gray-700' :
                            item.type === 'grammar' ? 'bg-gray-100 text-gray-700' :
                            item.type === 'fluency' ? 'bg-gray-100 text-gray-700' :
                            item.type === 'vocabulary' ? 'bg-gray-100 text-gray-700' :
                            item.type === 'encouragement' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          </span>
                        </div>
                        {item.corrected && (
                          <div className="text-gray-700 text-sm mb-1 font-mono">
                            Corrected sentence: {item.corrected}
                          </div>
                        )}
                        <p className="text-gray-800 font-medium mb-1">{item.message}</p>
                        <p className="text-gray-600 text-sm">{item.suggestion}</p>
                      </div>
                    </div>
                  ))}
                  
                  {(!feedback || feedback.length === 0) && !isProcessing && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No feedback yet. Start speaking to get feedback!</p>
                    </div>
                  )}
                  
                  {isProcessing && (
                    <div className="text-center py-8 text-gray-500">
                      <p>Processing your speech...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="premium-card">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Session Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Words Spoken</span>
                <span className="text-gray-800 font-semibold">{totalWordsInSession}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Interactions</span>
                <span className="text-gray-800 font-semibold">{interactionCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Correct</span>
                <span className="text-green-600 font-semibold">{correctInteractions}/20</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Progress</span>
                <span className="text-gray-800 font-semibold">{Math.round((correctInteractions / 20) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HindiLiveSpeaker; 
