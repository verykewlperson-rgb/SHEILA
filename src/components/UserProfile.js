import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Target, 
  Star,
  Award,
  Clock,
  BookOpen,
  Mic,
  Headphones,
  Volume2,
  Users,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';

const UserProfile = () => {
  const { 
    userStats, 
    achievements, 
    recentActivity, 
    updateUserStats, 
    resetProfile, 
    restoreFromBackup, 
    hasBackup, 
    manualSave
  } = useProfile();
  
  const [showProgressChart, setShowProgressChart] = useState(false);
  const [showDailyGoalModal, setShowDailyGoalModal] = useState(false);
  const [newDailyGoal, setNewDailyGoal] = useState(userStats.dailyGoal);

  const getLanguageLearnerTitle = () => {
    return 'Hindi Learner';
  };

  const getRankInfo = (rank) => {
    const ranks = {
      bronze: { color: 'text-amber-600', bg: 'bg-amber-100', icon: '🥉', minPoints: 0, maxPoints: 1499 },
      silver: { color: 'text-gray-600', bg: 'bg-gray-100', icon: '🥈', minPoints: 1500, maxPoints: 1999 },
      gold: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '🥇', minPoints: 2000, maxPoints: 2499 },
      diamond: { color: 'text-blue-600', bg: 'bg-blue-100', icon: '💎', minPoints: 2500, maxPoints: 2999 },
      champion: { color: 'text-purple-600', bg: 'bg-purple-100', icon: '👑', minPoints: 3000, maxPoints: 9999 }
    };
    return ranks[rank] || ranks.bronze;
  };

  const getActivityIcon = (type) => {
    const icons = {
      speaking: Mic,
      duel: Users,
      listening: Headphones,
      pronunciation: Volume2,
      mistakes: BookOpen,
      rank: Trophy,
      achievement: Award
    };
    return icons[type] || Clock;
  };

  const getProgressToNextRank = () => {
    const currentRank = getRankInfo(userStats.rank);
    const nextRankPoints = currentRank.maxPoints + 1;
    const progress = ((userStats.points - currentRank.minPoints) / (currentRank.maxPoints - currentRank.minPoints)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const getNextRank = () => {
    const ranks = ['bronze', 'silver', 'gold', 'diamond', 'champion'];
    const currentIndex = ranks.indexOf(userStats.rank);
    return currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null;
  };

  // Quick action functions
  const handleSetDailyGoal = () => {
    setShowDailyGoalModal(true);
  };

  const handleSaveDailyGoal = () => {
    updateUserStats({ dailyGoal: newDailyGoal });
    setShowDailyGoalModal(false);
  };

  const handleViewProgressChart = () => {
    setShowProgressChart(!showProgressChart);
  };

  const handleSchedulePractice = () => {
    // This would integrate with a calendar system in a real app
    console.log('Schedule practice clicked');
  };

  const handleResetProfile = () => {
    resetProfile();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Your Profile</h1>
        <p className="text-white/90">
          Track your learning journey, achievements, and rank progression
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-2">
          <div className="card mb-8">
            <div className="flex items-center space-x-8">
              <div className="text-6xl">{getRankInfo(userStats.rank).icon}</div>
              <div className="flex-1">
                <h2 className="text-3xl font-heading font-bold mb-2 text-premium-blue">{getLanguageLearnerTitle()}</h2>
                <div className="flex items-center space-x-4 mb-3">
                  <span className={`rank-badge ${getRankInfo(userStats.rank).bg} ${getRankInfo(userStats.rank).color}`}>{userStats.rank.charAt(0).toUpperCase() + userStats.rank.slice(1)}</span>
                  <span className="text-lg font-semibold text-premium-dark">{userStats.points} points</span>
                </div>
                
                {/* Progress to next rank */}
                {getNextRank() && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress to {getNextRank().charAt(0).toUpperCase() + getNextRank().slice(1)}</span>
                      <span>{Math.round(getProgressToNextRank())}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${getProgressToNextRank()}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.totalSessions}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.streakDays}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-orange-600">{userStats.duelsWon}</div>
              <div className="text-sm text-gray-600">Duels Won</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon size={20} className="text-primary-500" />
                        <div>
                          <p className="font-medium text-gray-800">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">+{activity.points}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>No activity yet. Start practicing to see your progress!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learning Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Learning Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Words Learned</span>
                <span className="font-semibold">{userStats.totalWords}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phrases Practiced</span>
                <span className="font-semibold">{userStats.totalPhrases}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duel Win Rate</span>
                <span className="font-semibold">
                  {userStats.duelsWon + userStats.duelsLost > 0 
                    ? Math.round((userStats.duelsWon / (userStats.duelsWon + userStats.duelsLost)) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Daily Goal</span>
                <span className="font-semibold">{userStats.dailyGoal} points</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3">
                  {achievement.earned ? (
                    <Award size={20} className="text-yellow-500" />
                  ) : (
                    <Star size={20} className="text-gray-300" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${achievement.earned ? 'text-gray-800' : 'text-gray-400'}`}>
                      {achievement.name}
                    </p>
                    <p className={`text-xs ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                    {achievement.earned && achievement.date && (
                      <p className="text-xs text-green-600">Earned {achievement.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button onClick={handleSetDailyGoal} className="w-full btn-primary text-sm">
                <Target size={16} className="mr-2" />
                Set Daily Goal
              </button>
              <button onClick={handleViewProgressChart} className="w-full btn-secondary text-sm">
                <TrendingUp size={16} className="mr-2" />
                {showProgressChart ? 'Hide' : 'View'} Progress Chart
              </button>
              <button onClick={handleSchedulePractice} className="w-full btn-secondary text-sm">
                <Calendar size={16} className="mr-2" />
                Schedule Practice
              </button>
              <button onClick={manualSave} className="w-full btn-secondary text-sm bg-blue-600 hover:bg-blue-700 text-white">
                <RefreshCw size={16} className="mr-2" />
                Manual Save
              </button>
              {hasBackup() && (
                <button onClick={restoreFromBackup} className="w-full btn-secondary text-sm bg-green-600 hover:bg-green-700 text-white">
                  <RefreshCw size={16} className="mr-2" />
                  Restore from Backup
                </button>
              )}
              <button onClick={handleResetProfile} className="w-full btn-secondary text-sm">
                Reset Profile
              </button>
            </div>
          </div>

          {/* Rank System */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Rank System</h3>
            <div className="space-y-2">
              {['bronze', 'silver', 'gold', 'diamond', 'champion'].map((rank) => {
                const rankInfo = getRankInfo(rank);
                const isCurrentRank = rank === userStats.rank;
                const isUnlocked = userStats.points >= rankInfo.minPoints;
                
                return (
                  <div
                    key={rank}
                    className={`flex items-center justify-between p-2 rounded-lg border-2 ${
                      isCurrentRank 
                        ? 'border-primary-500 bg-primary-50' 
                        : isUnlocked
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{rankInfo.icon}</span>
                      <span className={`font-medium ${
                        isCurrentRank ? 'text-primary-700' : 
                        isUnlocked ? 'text-green-700' : 'text-gray-400'
                      }`}>
                        {rank.charAt(0).toUpperCase() + rank.slice(1)}
                      </span>
                    </div>
                    {isCurrentRank && <CheckCircle size={16} className="text-primary-600" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Goal Modal */}
      {showDailyGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Set Daily Goal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Points Goal
                </label>
                <input
                  type="number"
                  value={newDailyGoal}
                  onChange={(e) => setNewDailyGoal(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="10"
                  max="500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveDailyGoal}
                  className="flex-1 btn-primary"
                >
                  Save Goal
                </button>
                <button
                  onClick={() => setShowDailyGoalModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Chart Modal */}
      {showProgressChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Progress Chart</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{userStats.points}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Rank</span>
                  <span className="font-medium">{userStats.rank.charAt(0).toUpperCase() + userStats.rank.slice(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sessions Completed</span>
                  <span className="font-medium">{userStats.totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Achievements Earned</span>
                  <span className="font-medium">{achievements.filter(a => a.earned).length}/{achievements.length}</span>
                </div>
              </div>
              <button
                onClick={() => setShowProgressChart(false)}
                className="w-full btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserProfile; 