import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  // Add a unique ID to track if the context is being recreated
  const contextId = useRef(Date.now() + Math.random());
  
  console.log('ProfileProvider created with ID:', contextId.current);
  
  // Initialize with default values
  const [userStats, setUserStats] = useState({
    rank: 'bronze',
    points: 0,
    totalSessions: 0,
    streakDays: 0,
    accuracy: 0,
    totalWords: 0,
    totalPhrases: 0,
    duelsWon: 0,
    duelsLost: 0,
    dailyGoal: 50,
    lastPracticeDate: null
  });

  const [achievements, setAchievements] = useState([
    { id: 1, name: 'First Steps', description: 'Complete your first speaking session', earned: false, date: null, requirement: 1, type: 'sessions' },
    { id: 2, name: 'Week Warrior', description: 'Practice for 7 consecutive days', earned: false, date: null, requirement: 7, type: 'streak' },
    { id: 3, name: 'Pronunciation Master', description: 'Achieve 90% accuracy in pronunciation', earned: false, date: null, requirement: 90, type: 'accuracy' },
    { id: 4, name: 'Duel Champion', description: 'Win 10 duels', earned: false, date: null, requirement: 10, type: 'duels' },
    { id: 5, name: 'Vocabulary Builder', description: 'Learn 100 words', earned: false, date: null, requirement: 100, type: 'words' },
    { id: 6, name: 'Silver Rank', description: 'Reach Silver rank', earned: false, date: null, requirement: 1500, type: 'points' }
  ]);

  const [recentActivity, setRecentActivity] = useState([]);
  const isInitialized = useRef(false);

  // Load data from localStorage on mount
  useEffect(() => {
    console.log('ProfileContext: Loading data from localStorage...');
    
    // Test localStorage functionality
    try {
      localStorage.setItem('testKey', 'testValue');
      const testValue = localStorage.getItem('testKey');
      console.log('localStorage test:', testValue === 'testValue' ? 'PASSED' : 'FAILED');
      localStorage.removeItem('testKey');
    } catch (error) {
      console.error('localStorage test FAILED:', error);
    }
    
    try {
      const savedStats = localStorage.getItem('userProfileStats');
      const savedAchievements = localStorage.getItem('userProfileAchievements');
      const savedActivity = localStorage.getItem('userProfileActivity');
      
      console.log('ProfileContext: Found saved data:', {
        stats: savedStats ? 'yes' : 'no',
        achievements: savedAchievements ? 'yes' : 'no',
        activity: savedActivity ? 'yes' : 'no'
      });
      
      if (savedStats) {
        const parsedStats = JSON.parse(savedStats);
        console.log('ProfileContext: Loading stats:', parsedStats);
        setUserStats(prev => ({ ...prev, ...parsedStats }));
      }
      
      if (savedAchievements) {
        const parsedAchievements = JSON.parse(savedAchievements);
        console.log('ProfileContext: Loading achievements:', parsedAchievements);
        setAchievements(parsedAchievements);
      }
      
      if (savedActivity) {
        const parsedActivity = JSON.parse(savedActivity);
        console.log('ProfileContext: Loading activity:', parsedActivity);
        setRecentActivity(parsedActivity);
      }
      
      isInitialized.current = true;
    } catch (error) {
      console.error('Error loading profile data:', error);
      // If there's an error, start fresh
      isInitialized.current = true;
    }
  }, []);

  // Save data whenever it changes (only after initialization)
  useEffect(() => {
    if (!isInitialized.current) return;
    
    console.log('ProfileContext: Saving userStats to localStorage:', userStats);
    try {
      localStorage.setItem('userProfileStats', JSON.stringify(userStats));
      console.log('ProfileContext: userStats saved successfully');
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  }, [userStats]);

  useEffect(() => {
    if (!isInitialized.current) return;
    
    console.log('ProfileContext: Saving achievements to localStorage:', achievements);
    try {
      localStorage.setItem('userProfileAchievements', JSON.stringify(achievements));
      console.log('ProfileContext: achievements saved successfully');
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }, [achievements]);

  useEffect(() => {
    if (!isInitialized.current) return;
    
    console.log('ProfileContext: Saving activity to localStorage:', recentActivity);
    try {
      localStorage.setItem('userProfileActivity', JSON.stringify(recentActivity));
      console.log('ProfileContext: activity saved successfully');
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  }, [recentActivity]);

  // Helper functions
  const calculateRank = (points) => {
    if (points >= 3000) return 'champion';
    if (points >= 2500) return 'diamond';
    if (points >= 2000) return 'gold';
    if (points >= 1500) return 'silver';
    return 'bronze';
  };

  const addActivity = (title, type, points) => {
    const newActivity = {
      id: Date.now() + Math.random(),
      title,
      type,
      points,
      date: new Date().toLocaleDateString()
    };
    
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only 10 most recent
  };

  const checkAchievements = (newStats) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.earned) return achievement;
      
      let earned = false;
      switch (achievement.type) {
        case 'sessions':
          earned = newStats.totalSessions >= achievement.requirement;
          break;
        case 'streak':
          earned = newStats.streakDays >= achievement.requirement;
          break;
        case 'accuracy':
          earned = newStats.accuracy >= achievement.requirement;
          break;
        case 'duels':
          earned = newStats.duelsWon >= achievement.requirement;
          break;
        case 'words':
          earned = newStats.totalWords >= achievement.requirement;
          break;
        case 'points':
          earned = newStats.points >= achievement.requirement;
          break;
      }
      
      if (earned && !achievement.earned) {
        addActivity(`Achievement Unlocked: ${achievement.name}`, 'achievement', 50);
        return {
          ...achievement,
          earned: true,
          date: new Date().toLocaleDateString()
        };
      }
      
      return achievement;
    }));
  };

  const updateUserStats = (updates) => {
    setUserStats(prev => {
      const newStats = { ...prev, ...updates };
      
      // Check for rank progression
      const newRank = calculateRank(newStats.points);
      if (newRank !== newStats.rank) {
        newStats.rank = newRank;
        addActivity(`Reached ${newRank.charAt(0).toUpperCase() + newRank.slice(1)} rank!`, 'rank', 100);
      }
      
      // Check achievements
      checkAchievements(newStats);
      
      return newStats;
    });
  };

  // Main functions for components to call
  const completeSession = (sessionData = {}) => {
    const {
      wordsSpoken = 0,
      phrasesUsed = 0,
      accuracy = 0,
      duration = 0
    } = sessionData;

    setUserStats(prev => {
      const newStats = {
        ...prev,
        totalSessions: prev.totalSessions + 1,
        points: prev.points + 100,
        totalWords: prev.totalWords + wordsSpoken,
        totalPhrases: prev.totalPhrases + phrasesUsed,
        accuracy: Math.round((prev.accuracy + accuracy) / 2)
      };
      
      // Check for rank progression
      const newRank = calculateRank(newStats.points);
      if (newRank !== newStats.rank) {
        newStats.rank = newRank;
        addActivity(`Reached ${newRank.charAt(0).toUpperCase() + newRank.slice(1)} rank!`, 'rank', 100);
      }
      
      // Check achievements
      checkAchievements(newStats);
      
      return newStats;
    });
    addActivity('Completed speaking session', 'speaking', 100);
  };

  const winDuel = () => {
    setUserStats(prev => {
      const newStats = { 
        ...prev, 
        duelsWon: prev.duelsWon + 1,
        points: prev.points + 50
      };
      
      // Check for rank progression
      const newRank = calculateRank(newStats.points);
      if (newRank !== newStats.rank) {
        newStats.rank = newRank;
        addActivity(`Reached ${newRank.charAt(0).toUpperCase() + newRank.slice(1)} rank!`, 'rank', 100);
      }
      
      // Check achievements
      checkAchievements(newStats);
      
      return newStats;
    });
    addActivity('Won a duel!', 'duel', 50);
  };

  const loseDuel = () => {
    updateUserStats({
      ...userStats,
      duelsLost: userStats.duelsLost + 1
    });
    addActivity('Lost a duel', 'duel', 0);
  };

  const improveAccuracy = (newAccuracy) => {
    updateUserStats({
      ...userStats,
      accuracy: Math.round((userStats.accuracy + newAccuracy) / 2)
    });
  };

  const learnWords = (wordCount) => {
    updateUserStats({
      ...userStats,
      totalWords: userStats.totalWords + wordCount
    });
  };

  const setDailyGoal = (goal) => {
    updateUserStats({ dailyGoal: goal });
  };

  const addPoints = (points, reason) => {
    console.log('ProfileContext: addPoints called with', points, 'points for reason:', reason);
    setUserStats(prev => {
      console.log('ProfileContext: Previous points:', prev.points, 'Adding:', points);
      const newStats = { ...prev, points: prev.points + points };
      console.log('ProfileContext: New points total:', newStats.points);
      
      // Check for rank progression
      const newRank = calculateRank(newStats.points);
      if (newRank !== newStats.rank) {
        newStats.rank = newRank;
        addActivity(`Reached ${newRank.charAt(0).toUpperCase() + newRank.slice(1)} rank!`, 'rank', 100);
      }
      
      // Check achievements
      checkAchievements(newStats);
      
      return newStats;
    });
    addActivity(reason, 'points', points);
  };

  const resetProfile = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset your profile? This will permanently delete all your progress, points, achievements, and activity history. This action cannot be undone.'
    );
    
    if (!confirmed) return;
    
    // Create backup before reset
    const backup = {
      userStats,
      achievements,
      recentActivity,
      timestamp: new Date().toISOString()
    };
    
    try {
      localStorage.setItem('userProfileBackup', JSON.stringify(backup));
      console.log('Backup created before reset');
    } catch (error) {
      console.error('Error creating backup:', error);
    }
    
    // Reset to default values
    const defaultStats = {
      rank: 'bronze',
      points: 0,
      totalSessions: 0,
      streakDays: 0,
      accuracy: 0,
      totalWords: 0,
      totalPhrases: 0,
      duelsWon: 0,
      duelsLost: 0,
      dailyGoal: 50,
      lastPracticeDate: null
    };
    
    const defaultAchievements = achievements.map(a => ({ ...a, earned: false, date: null }));
    
    setUserStats(defaultStats);
    setAchievements(defaultAchievements);
    setRecentActivity([]);
    
    // Clear localStorage
    try {
      localStorage.removeItem('userProfileStats');
      localStorage.removeItem('userProfileAchievements');
      localStorage.removeItem('userProfileActivity');
      console.log('localStorage cleared');
    } catch (error) {
      console.error('Error clearing profile data:', error);
    }
    
    console.log('Reset completed successfully');
    alert('Profile reset successfully! All progress has been cleared.\n\nA backup of your previous progress has been saved. You can restore it from the User Profile page.');
  };

  const restoreFromBackup = () => {
    try {
      const backupData = localStorage.getItem('userProfileBackup');
      if (!backupData) {
        alert('No backup found to restore from.');
        return;
      }
      
      const backup = JSON.parse(backupData);
      const confirmed = window.confirm(
        `Restore profile from backup created on ${new Date(backup.timestamp).toLocaleString()}?\n\nThis will replace your current progress with the backed up data.`
      );
      
      if (!confirmed) return;
      
      setUserStats(backup.userStats);
      setAchievements(backup.achievements);
      setRecentActivity(backup.recentActivity);
      
      // Save the restored data to localStorage
      localStorage.setItem('userProfileStats', JSON.stringify(backup.userStats));
      localStorage.setItem('userProfileAchievements', JSON.stringify(backup.achievements));
      localStorage.setItem('userProfileActivity', JSON.stringify(backup.recentActivity));
      
      alert('Profile restored successfully from backup!');
    } catch (error) {
      console.error('Error restoring from backup:', error);
      alert('Error restoring from backup. Please try again.');
    }
  };

  const hasBackup = () => {
    try {
      const backupData = localStorage.getItem('userProfileBackup');
      return !!backupData;
    } catch {
      return false;
    }
  };

  const manualSave = () => {
    console.log('Manual save triggered');
    try {
      localStorage.setItem('userProfileStats', JSON.stringify(userStats));
      localStorage.setItem('userProfileAchievements', JSON.stringify(achievements));
      localStorage.setItem('userProfileActivity', JSON.stringify(recentActivity));
      console.log('Manual save completed successfully');
      alert('Profile saved manually!');
    } catch (error) {
      console.error('Manual save failed:', error);
      alert('Manual save failed: ' + error.message);
    }
  };

  const value = {
    userStats,
    achievements,
    recentActivity,
    updateUserStats,
    completeSession,
    winDuel,
    loseDuel,
    improveAccuracy,
    learnWords,
    setDailyGoal,
    addActivity,
    addPoints,
    resetProfile,
    restoreFromBackup,
    hasBackup,
    manualSave
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}; 