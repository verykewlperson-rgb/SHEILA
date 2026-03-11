import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  Mic, 
  Crown, 
  Sword, 
  Target,
  TrendingUp,
  Clock,
  User,
  Star,
  Plus,
  Search,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { useProfile } from '../contexts/ProfileContext';

const mockPrompts = [
  'Share a short introduction about yourself in Hindi.',
  'Describe your favorite festival using at least two adjectives.',
  'Explain how to make chai in Hindi, step by step.',
  'Talk about one hobby you enjoy and why it makes you happy.',
  'Describe a proud moment when you helped someone in Hindi.'
];

const activeBattles = [
  { opponent: 'Ankita', rank: 'silver', points: 1720, timeLeft: '03:18', yourScore: 86, opponentScore: 82 },
  { opponent: 'Rohit', rank: 'gold', points: 2210, timeLeft: '11:24', yourScore: 78, opponentScore: 80 }
];

const leaderboard = [
  { name: 'Anjali', rank: 'champion', points: 3620, wins: 42 },
  { name: 'Dev', rank: 'diamond', points: 2890, wins: 35 },
  { name: 'Meera', rank: 'gold', points: 2410, wins: 29 },
  { name: 'Sahil', rank: 'silver', points: 1830, wins: 21 }
];

const DuelingFriends = () => {
  const { winDuel, loseDuel, userStats, recentActivity } = useProfile();
  const [isInDuel, setIsInDuel] = useState(false);
  const [duelType, setDuelType] = useState('pronunciation');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [opponentAnswer, setOpponentAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [duelHistory, setDuelHistory] = useState([]);
  const [sessionStats, setSessionStats] = useState({
    duelsPlayed: 0,
    duelsWon: 0,
    averageScore: 0,
    bestScore: 0
  });

  // Get speech recognition language code
  const getSpeechRecognitionLang = () => {
    return 'hi-IN';
  };

  // Get speech synthesis language code
  const getSpeechSynthesisLang = () => {
    return 'hi-IN';
  };

  const startDuel = (opponent) => {
    const prompt = mockPrompts[Math.floor(Math.random() * mockPrompts.length)];
    setCurrentQuestion({
      opponent,
      prompt,
      startTime: Date.now(),
      userScore: 0,
      opponentScore: 0,
      status: 'active'
    });
    setIsInDuel(true);
    toast.success(`Duel started with ${opponent.name}!`);
  };

  const submitSpeech = () => {
    if (!userAnswer.trim()) {
      toast.error('Please record your speech first!');
      return;
    }

    // Simulate AI scoring
    const userScore = Math.floor(Math.random() * 40) + 60; // 60-100
    const opponentScore = Math.floor(Math.random() * 40) + 60; // 60-100

    const userWon = userScore > opponentScore;

    // Use context functions to update profile
    if (userWon) {
      winDuel();
      setResult('Won');
      setScore(userScore);
      setOpponentScore(opponentScore);
      setSessionStats(prev => ({
        ...prev,
        duelsPlayed: prev.duelsPlayed + 1,
        duelsWon: prev.duelsWon + 1,
        averageScore: ((prev.averageScore * prev.duelsPlayed + userScore) / (prev.duelsPlayed + 1)).toFixed(2),
        bestScore: Math.max(prev.bestScore, userScore)
      }));
      toast.success('Victory! You won the duel!');
    } else {
      loseDuel();
      setResult('Lost');
      setScore(userScore);
      setOpponentScore(opponentScore);
      setSessionStats(prev => ({
        ...prev,
        duelsPlayed: prev.duelsPlayed + 1,
        averageScore: ((prev.averageScore * prev.duelsPlayed + userScore) / (prev.duelsPlayed + 1)).toFixed(2)
      }));
      toast.success('Defeat! Better luck next time!');
    }

    setCurrentQuestion(prev => ({
      ...prev,
      userScore,
      opponentScore,
      status: 'completed',
      userWon
    }));

    setIsInDuel(false);

    // Add to duel history
    setDuelHistory(prev => [
      ...prev,
      {
        opponent: currentQuestion?.opponent || 'Friend',
        date: new Date().toLocaleDateString(),
        result: userWon ? 'Won' : 'Lost',
        score: userWon ? userScore : opponentScore
      }
    ]);
  };

  const getRankInfo = (rank) => {
    const ranks = {
      bronze: { color: 'text-amber-600', bg: 'bg-amber-100', minPoints: 0, maxPoints: 1499 },
      silver: { color: 'text-gray-600', bg: 'bg-gray-100', minPoints: 1500, maxPoints: 1999 },
      gold: { color: 'text-yellow-600', bg: 'bg-yellow-100', minPoints: 2000, maxPoints: 2499 },
      diamond: { color: 'text-blue-600', bg: 'bg-blue-100', minPoints: 2500, maxPoints: 2999 },
      champion: { color: 'text-purple-600', bg: 'bg-purple-100', minPoints: 3000, maxPoints: 9999 }
    };
    return ranks[rank] || ranks.bronze;
  };

  const getRankIcon = (rank) => {
    const icons = {
      bronze: '🥉',
      silver: '🥈',
      gold: '🥇',
      diamond: '💎',
      champion: '👑'
    };
    return icons[rank] || '🥉';
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-heading font-bold text-gray-800 mb-4">
          Dueling Friends
        </h1>
        <p className="text-xl text-gray-600 font-display">
          Challenge friends in competitive speaking battles and climb the ranks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="premium-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-semibold text-gray-800">Active Battles</h2>
              <button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Battle
              </button>
            </div>

            <div className="space-y-4">
              {activeBattles.map((battle, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-soft transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                        {battle.rank.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{battle.opponent}</h3>
                        <p className="text-gray-600">{battle.rank} • {battle.points} pts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Time remaining</div>
                      <div className="text-lg font-semibold text-gray-800">{battle.timeLeft}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">{battle.yourScore}</div>
                        <div className="text-sm text-gray-600">Your Score</div>
                      </div>
                      <div className="text-gray-400">vs</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">{battle.opponentScore}</div>
                        <div className="text-sm text-gray-600">Opponent</div>
                      </div>
                    </div>
                    <button className="btn-primary">
                      Continue Battle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card mt-8">
            <h2 className="text-2xl font-heading font-semibold text-gray-800 mb-6">Leaderboard</h2>
            <div className="space-y-3">
              {leaderboard.map((player, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                        {player.rank.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{player.name}</div>
                        <div className="text-sm text-gray-600">{player.rank}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{player.points} pts</div>
                    <div className="text-sm text-gray-600">{player.wins} wins</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="premium-card">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Rank</span>
                <span className="text-gray-800 font-semibold">{userStats.rank}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Points</span>
                <span className="text-gray-800 font-semibold">{userStats.points}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Battles Won</span>
                <span className="text-gray-800 font-semibold">{userStats.wins}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Win Rate</span>
                <span className="text-gray-800 font-semibold">{userStats.winRate}%</span>
              </div>
            </div>
          </div>

          <div className="premium-card">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'win' ? 'bg-green-500' :
                    activity.type === 'loss' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-800">{activity.description}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Duel History</h3>
            <div className="space-y-3">
              {duelHistory.map((duel, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">{duel.opponent}</p>
                    <p className="text-sm text-gray-500">{duel.date}</p>
                  </div>
                  <span className={`text-sm font-semibold ${duel.result === 'Won' ? 'text-green-600' : 'text-red-600'}`}>
                    {duel.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuelingFriends; 
