import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mic, 
  BookOpen, 
  Users, 
  Headphones, 
  Volume2, 
  Trophy,
  Home,
  User,
  Star,
  Languages
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Import components
import LiveSpeaker from './components/HindiLiveSpeaker';
import SolvingMistakes from './components/SolvingMistakes';
import DuelingFriends from './components/DuelingFriends';
import HearAndType from './components/HearAndType';
import Pronouncer from './components/Pronouncer';
import UserProfile from './components/UserProfile';

// Import context
import { ProfileProvider, useProfile } from './contexts/ProfileContext';

function Navigation() {
  const location = useLocation();
  const { userStats } = useProfile();

  const navItems = [
    { path: '/', icon: Home, label: 'Home', color: 'text-gray-700' },
    { path: '/live-speaker', icon: Mic, label: 'Live Speaker', color: 'text-gray-600' },
    { path: '/mistakes', icon: BookOpen, label: 'Mistakes', color: 'text-gray-600' },
    { path: '/dueling', icon: Users, label: 'Dueling', color: 'text-gray-600' },
    { path: '/hear-type', icon: Headphones, label: 'Hear & Type', color: 'text-gray-600' },
    { path: '/pronouncer', icon: Volume2, label: 'Pronouncer', color: 'text-gray-600' },
    { path: '/profile', icon: User, label: 'Profile', color: 'text-gray-600' },
  ];

  const getRankColor = (rank) => {
    const colors = {
      bronze: 'rank-bronze',
      silver: 'rank-silver',
      gold: 'rank-gold',
      diamond: 'rank-diamond',
      champion: 'rank-champion'
    };
    return colors[rank] || 'rank-bronze';
  };

  return (
    <nav className="glass shadow-premium rounded-2xl mx-4 mb-8 mt-6">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg">
              <Languages size={24} className="text-gray-800" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-gray-800 tracking-tight">
              हिंदी सीखें
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`rank-badge ${getRankColor(userStats.rank)}`}>{userStats.rank.charAt(0).toUpperCase() + userStats.rank.slice(1)}</span>
            <span className="text-base text-gray-600 font-semibold">{userStats.points} pts</span>
            <span className="text-lg">🇮🇳</span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-4">
        <div className="flex space-x-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl transition-all duration-300 whitespace-nowrap font-semibold text-base shadow-soft ${
                  isActive 
                    ? 'bg-gray-900 text-white shadow-premium' 
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-800'
                }`}
              >
                <Icon size={22} className={isActive ? 'text-white' : 'text-gray-600'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function HomePage() {
  const navigate = useNavigate();

  const handleFeatureClick = (path) => {
    navigate(path);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-white"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="absolute inset-0 bg-gray-100/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium mb-8 shadow-lg"
            >
              <span className="mr-2">🇮🇳</span>
              AI-Powered Hindi Learning Platform
            </motion.div>
            
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-7xl font-heading font-bold text-gray-900 mb-6 leading-tight"
            >
              हिंदी सीखें
              <span className="block bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Master Hindi with AI Intelligence
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Experience the future of language learning with real-time AI conversations, 
              personalized feedback, and interactive exercises designed for rapid progress.
            </motion.p>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button 
                onClick={() => handleFeatureClick('/live-speaker')}
                className="group relative px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="relative z-10">Start Learning Now</span>
                <div className="absolute inset-0 bg-gray-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1">
                Watch Demo
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="group cursor-pointer"
              onClick={() => handleFeatureClick('/live-speaker')}
            >
              <div className="absolute inset-0 bg-gray-200/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-4">Live Speaker</h3>
                <p className="text-gray-600 leading-relaxed">
                  Practice real-time conversations with AI that provides instant feedback on pronunciation, grammar, and fluency.
                </p>
                <div className="mt-6 flex items-center text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                  <span>Start Speaking</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="group cursor-pointer"
              onClick={() => handleFeatureClick('/hear-type')}
            >
              <div className="absolute inset-0 bg-gray-200/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-4">Hear & Type</h3>
                <p className="text-gray-600 leading-relaxed">
                  Listen to Hindi phrases and type what you hear. Perfect for improving listening comprehension and spelling.
                </p>
                <div className="mt-6 flex items-center text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                  <span>Start Listening</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="group cursor-pointer"
              onClick={() => handleFeatureClick('/pronouncer')}
            >
              <div className="absolute inset-0 bg-gray-200/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Volume2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-4">Pronouncer</h3>
                <p className="text-gray-600 leading-relaxed">
                  Master Hindi pronunciation with AI-powered feedback. Practice individual words and get instant corrections.
                </p>
                <div className="mt-6 flex items-center text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                  <span>Start Pronouncing</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gray-200/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="w-16 h-16 bg-gray-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-4">Progress Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor your learning journey with detailed analytics, achievements, and personalized insights to optimize your progress.
                </p>
                <div className="mt-6 flex items-center text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                  <span>View Stats</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="group cursor-pointer"
              onClick={() => handleFeatureClick('/mistakes')}
            >
              <div className="absolute inset-0 bg-gray-200/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-4">Solving Mistakes</h3>
                <p className="text-gray-600 leading-relaxed">
                  Learn from your mistakes with detailed explanations and practice similar questions to reinforce learning.
                </p>
                <div className="mt-6 flex items-center text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                  <span>Review Mistakes</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="group cursor-pointer"
              onClick={() => handleFeatureClick('/dueling')}
            >
              <div className="absolute inset-0 bg-gray-200/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-4">Dueling Friends</h3>
                <p className="text-gray-600 leading-relaxed">
                  Challenge your friends in fun Hindi learning competitions. Compare progress and motivate each other.
                </p>
                <div className="mt-6 flex items-center text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                  <span>Start Dueling</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="group cursor-pointer"
              onClick={() => handleFeatureClick('/profile')}
            >
              <div className="absolute inset-0 bg-gray-200/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="w-16 h-16 bg-gray-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-4">Progress Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor your learning journey with detailed analytics, achievements, and personalized insights to optimize your progress.
                </p>
                <div className="mt-6 flex items-center text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                  <span>View Stats</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Loved by Learners Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful learners who have transformed their Hindi skills with our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  S
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">Beginner → Advanced</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                "The AI conversations are incredible! I went from knowing basic greetings to having full conversations in just 3 months."
              </p>
              <div className="flex text-gray-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  M
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Michael Chen</div>
                  <div className="text-sm text-gray-600">Business Professional</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                "Perfect for business travel! The pronunciation feedback helped me communicate confidently with Indian clients."
              </p>
              <div className="flex text-gray-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  P
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Priya Patel</div>
                  <div className="text-sm text-gray-600">Heritage Learner</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                "As someone reconnecting with my roots, this platform made learning Hindi fun and engaging. Highly recommend!"
              </p>
              <div className="flex text-gray-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-6"
          >
            Ready to Master Hindi?
          </motion.h2>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 mb-8"
          >
            Join thousands of learners and start your Hindi journey today
          </motion.p>
          <motion.button 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function App() {
  return (
    <ProfileProvider>
      <Router>
        <div className="min-h-screen">
          <Navigation />
          <main className="pb-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/live-speaker" element={<LiveSpeaker />} />
              <Route path="/mistakes" element={<SolvingMistakes />} />
              <Route path="/dueling" element={<DuelingFriends />} />
              <Route path="/hear-type" element={<HearAndType />} />
              <Route path="/pronouncer" element={<Pronouncer />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </ProfileProvider>
  );
}

export default App; 