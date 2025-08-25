import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import {
  DMO_PATHS,
  DMOPath,
  DMOProgress,
  DMOStats,
  getDMOProgress,
  saveDMOProgress,
  getDMOStats,
  saveDMOStats,
  getTodayString,
  getTimeUntilMidnight,
  shouldResetProgress,
  calculateStreak,
  checkNewAchievements,
  DMO_ACHIEVEMENTS,
  hasSelectedPathToday,
  getTodaysSelectedPath,
  validateDailyXP,
  isDMOCompletedToday
} from '../lib/api/dmo';

const DMOPage = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [progress, setProgress] = useState<DMOProgress | null>(null);
  const [stats, setStats] = useState<DMOStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalDaysCompleted: 0,
    totalXPEarned: 0,
    achievements: []
  });
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [timeUntilReset, setTimeUntilReset] = useState<string>('');
  const [hasPathSelected, setHasPathSelected] = useState<boolean>(false);

  useEffect(() => {
    initializeDMO();
    
    // Update countdown every minute
    const interval = setInterval(() => {
      setTimeUntilReset(getTimeUntilMidnight());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const initializeDMO = () => {
    const today = getTodayString();
    const existingProgress = getDMOProgress();
    const currentStats = getDMOStats();
    
    // Check if user has already selected a path today
    const pathSelected = hasSelectedPathToday();
    const todaysPath = getTodaysSelectedPath();
    
    setHasPathSelected(pathSelected);
    
    // Reset progress if it's a new day
    if (!existingProgress || shouldResetProgress(existingProgress.date)) {
      const newProgress: DMOProgress = {
        date: today,
        completedTasks: [],
        xpEarned: 0,
        completed: false
      };
      
      setProgress(newProgress);
      setSelectedPath(null);
      setHasPathSelected(false);
      saveDMOProgress(newProgress);
    } else {
      setProgress(existingProgress);
      setSelectedPath(todaysPath);
    }
    
    // Update streak
    const currentStreak = calculateStreak();
    const updatedStats = {
      ...currentStats,
      currentStreak,
      longestStreak: Math.max(currentStats.longestStreak, currentStreak)
    };
    
    setStats(updatedStats);
    saveDMOStats(updatedStats);
    setTimeUntilReset(getTimeUntilMidnight());
  };

  const selectPath = (pathId: string) => {
    if (!progress || hasPathSelected) return;
    
    const updatedProgress = {
      ...progress,
      selectedPath: pathId,
      timeStarted: new Date().toISOString()
    };
    
    setProgress(updatedProgress);
    setSelectedPath(pathId);
    setHasPathSelected(true);
    saveDMOProgress(updatedProgress);
  };

  const toggleTask = (taskId: string) => {
    if (!progress || !selectedPath) return;
    
    const path = DMO_PATHS.find(p => p.id === selectedPath);
    if (!path) return;
    
    const task = path.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const isCompleted = progress.completedTasks.includes(taskId);
    let newCompletedTasks: string[];
    let newXP = progress.xpEarned;
    
    if (isCompleted) {
      // Remove task
      newCompletedTasks = progress.completedTasks.filter(id => id !== taskId);
      newXP -= task.xpReward;
    } else {
      // Add task
      newCompletedTasks = [...progress.completedTasks, taskId];
      newXP += task.xpReward;
    }
    
    // Validate XP to prevent gaming
    newXP = validateDailyXP(newXP, selectedPath);
    
    const allTasksCompleted = newCompletedTasks.length === path.tasks.length;
    const updatedProgress: DMOProgress = {
      ...progress,
      completedTasks: newCompletedTasks,
      xpEarned: newXP,
      completed: allTasksCompleted,
      timeCompleted: allTasksCompleted ? new Date().toISOString() : undefined
    };
    
    setProgress(updatedProgress);
    saveDMOProgress(updatedProgress);
    
    // Update stats if DMO completed (only once per day to prevent gaming)
    if (allTasksCompleted && !progress.completed) {
      const today = getTodayString();
      
      // Prevent multiple completions on the same day
      if (stats.lastCompletedDate !== today) {
        const newStreak = stats.currentStreak + 1;
        const updatedStats: DMOStats = {
          ...stats,
          currentStreak: newStreak,
          longestStreak: Math.max(stats.longestStreak, newStreak),
          totalDaysCompleted: stats.totalDaysCompleted + 1,
          totalXPEarned: stats.totalXPEarned + newXP,
          lastCompletedDate: today,
          favoritePathId: selectedPath
        };
        
        // Check for new achievements
        const newAchievements = checkNewAchievements(stats, updatedProgress);
        if (newAchievements.length > 0) {
          updatedStats.achievements = [...stats.achievements, ...newAchievements];
          setShowAchievement(newAchievements[0]); // Show first new achievement
          
          // Calculate achievement XP bonus
          newAchievements.forEach(achievementId => {
            const achievement = Object.values(DMO_ACHIEVEMENTS).find(a => a.id === achievementId);
            if (achievement) {
              updatedStats.totalXPEarned += achievement.xpBonus;
            }
          });
        }
        
        setStats(updatedStats);
        saveDMOStats(updatedStats);
      }
    }
  };

  // Note: Path reset is not allowed once selected - enforces one path per day
  // This prevents gaming the system and ensures commitment to daily selection
  // Progress will reset automatically at midnight
  const cannotResetPath = () => {
    // This function exists to document the business logic:
    // Users cannot change their path selection once made for the day
    // This ensures commitment and prevents gaming multiple paths for extra XP
    return true;
  };

  const getPathColor = (color: string) => {
    const colors = {
      blue: {
        card: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        icon: 'text-blue-600',
        accent: 'text-blue-700'
      },
      green: {
        card: 'bg-green-50 border-green-200 hover:bg-green-100',
        button: 'bg-green-600 hover:bg-green-700 text-white',
        icon: 'text-green-600',
        accent: 'text-green-700'
      },
      orange: {
        card: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
        button: 'bg-orange-600 hover:bg-orange-700 text-white',
        icon: 'text-orange-600',
        accent: 'text-orange-700'
      },
      red: {
        card: 'bg-red-50 border-red-200 hover:bg-red-100',
        button: 'bg-red-600 hover:bg-red-700 text-white',
        icon: 'text-red-600',
        accent: 'text-red-700'
      }
    };
    return colors[color as keyof typeof colors] || {
      card: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
      button: 'bg-gray-600 hover:bg-gray-700 text-white',
      icon: 'text-gray-600',
      accent: 'text-gray-700'
    };
  };

  const getTaskIcon = (category: string) => {
    const icons = {
      connections: '👥',
      conversations: '💬', 
      content: '📝',
      learning: '📚'
    };
    return icons[category as keyof typeof icons] || '✅';
  };

  const getCategoryStats = (pathId: string) => {
    if (!progress) return { connections: 0, conversations: 0, content: 0, learning: 0 };
    
    const path = DMO_PATHS.find(p => p.id === pathId);
    if (!path) return { connections: 0, conversations: 0, content: 0, learning: 0 };
    
    const stats = { connections: 0, conversations: 0, content: 0, learning: 0 };
    
    path.tasks.forEach(task => {
      if (progress.completedTasks.includes(task.id)) {
        stats[task.category]++;
      }
    });
    
    return stats;
  };

  const calculateProgress = (pathId: string) => {
    const path = DMO_PATHS.find(p => p.id === pathId);
    if (!path || !progress) return 0;
    
    return Math.round((progress.completedTasks.length / path.tasks.length) * 100);
  };

  const selectedPathData = selectedPath ? DMO_PATHS.find(p => p.id === selectedPath) : null;

  return (
    <>
      <Head>
        <title>Daily Method of Operation (DMO) - Digital Era</title>
        <meta name="description" content="Choose your daily commitment level and complete structured tasks to build consistent business growth" />
      </Head>

      <AppLayout user={{ id: 123, name: 'Ashley Kemp', avatarUrl: '/default-avatar.png' }}>
        <div className="p-3 sm:p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">🎯</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold theme-text-primary">Daily Method of Operation (DMO)</h1>
            </div>
            <p className="theme-text-secondary">
              Choose your daily commitment level and complete structured tasks to build consistent business growth.
            </p>
          </div>

          {/* Important Notice - With Banner Color */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 mb-6 text-white">
            <div className="flex items-center">
              <div className="w-5 h-5 text-white mr-3">
                <i className="fas fa-info-circle"></i>
              </div>
              <div>
                <p className="text-sm text-white">
                  <span className="font-medium">One DMO Selection Per Day</span> - Choose your commitment level wisely.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards - Simplified */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="theme-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold theme-text-primary">{stats.currentStreak}</div>
              <div className="text-sm theme-text-secondary">Current Streak</div>
            </div>
            <div className="theme-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold theme-text-primary">{progress?.completedTasks.length || 0}</div>
              <div className="text-sm theme-text-secondary">Tasks Today</div>
            </div>
            <div className="theme-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold theme-text-primary">{progress?.xpEarned || 0}</div>
              <div className="text-sm theme-text-secondary">Daily XP</div>
            </div>
            <div className="theme-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold theme-text-primary">#{stats.totalDaysCompleted + 1}</div>
              <div className="text-sm theme-text-secondary">Rank</div>
            </div>
          </div>

          {/* Path Selection or Task List */}
          {!selectedPath && !hasPathSelected ? (
            <>
              {/* DMO Paths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {DMO_PATHS.map((path) => {
                  const pathColors = getPathColor(path.color);
                  return (
                    <div
                      key={path.id}
                      className={`rounded-xl shadow-sm border transition-all duration-200 overflow-hidden ${pathColors.card}`}
                    >
                      <div className="p-6 text-center border-b border-gray-100">
                        <div className={`text-4xl mb-3 ${pathColors.icon}`}>{path.icon}</div>
                        <h3 className={`text-xl font-bold mb-2 ${pathColors.accent}`}>{path.name}</h3>
                        <p className="text-sm theme-text-secondary mb-3">{path.description}</p>
                        <div className={`text-lg font-semibold ${pathColors.accent}`}>{path.title}</div>
                      </div>
                      
                      <div className="p-6 bg-white">
                        <div className="grid grid-cols-2 gap-4 text-sm theme-text-secondary mb-4">
                          <div className="text-center">
                            <div className={`font-semibold text-lg ${pathColors.accent}`}>{path.tasks.length}</div>
                            <div>Tasks</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-semibold text-lg ${pathColors.accent}`}>{path.totalXP} XP</div>
                            <div>Reward</div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => selectPath(path.id)}
                          disabled={hasPathSelected}
                          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                            hasPathSelected 
                              ? 'bg-gray-400 text-white cursor-not-allowed' 
                              : pathColors.button
                          }`}
                        >
                          {hasPathSelected ? 'Path Already Selected' : 'Choose Success Path'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : !selectedPath && hasPathSelected ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold theme-text-primary mb-2">Loading Your Selected Path...</h3>
              <p className="theme-text-secondary mb-4">
                You have already selected a DMO path today. Loading your progress...
              </p>
              <div className="text-sm theme-text-muted">
                Resets in {timeUntilReset}
              </div>
            </div>
          ) : (
            <>
              {/* Selected Path Header */}
              {selectedPathData && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-500 font-medium flex items-center">
                      <i className="fas fa-lock mr-2"></i>
                      Path Locked Until Midnight Reset
                    </div>
                  </div>
                  
                  <div className={`border rounded-xl p-6 mb-6 ${getPathColor(selectedPathData.color).card}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedPathData.name} DMO - {selectedPathData.title}</h2>
                        <p className="text-sm text-gray-600 mb-2">{selectedPathData.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <i className="fas fa-clock mr-1"></i>
                            <span>{timeUntilReset} until daily reset</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900 mb-1">{calculateProgress(selectedPath || '')}%</div>
                        <div className="text-sm text-gray-500">
                          {progress?.completedTasks.length}/{selectedPathData.tasks.length} tasks completed
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Progress */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {Object.entries(getCategoryStats(selectedPath || '')).map(([category, count]) => {
                      const totalInCategory = selectedPathData.tasks.filter(t => t.category === category).length;
                      if (totalInCategory === 0) return null;
                      
                      return (
                        <div key={category} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                          <div className="text-2xl mb-1">{getTaskIcon(category)}</div>
                          <div className="text-lg font-bold text-gray-900">{count}/{totalInCategory}</div>
                          <div className="text-sm text-gray-600 capitalize">{category}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Task List */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="space-y-4">
                      {selectedPathData.tasks.map((task) => {
                        const isCompleted = progress?.completedTasks.includes(task.id) || false;
                        
                        return (
                          <div
                            key={task.id}
                            className={`flex items-start p-4 rounded-lg border transition-all duration-200 ${
                              isCompleted 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center mr-4">
                              <input
                                type="checkbox"
                                checked={isCompleted}
                                onChange={() => toggleTask(task.id)}
                                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className={`font-medium ${isCompleted ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                                    {task.title}
                                  </h4>
                                  <p className={`text-sm mt-1 ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                                    {task.description}
                                  </p>
                                </div>
                                <div className="ml-4 text-right">
                                  <div className={`text-sm font-medium ${isCompleted ? 'text-green-700' : 'text-blue-600'}`}>
                                    +{task.xpReward} XP
                                  </div>
                                  <div className={`text-xs ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                                    {task.duration}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Progress Summary - Simplified */}
                  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Daily Progress - One Path Only
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Complete all tasks to earn your daily XP and maintain your streak. Path cannot be changed until midnight.
                        </p>
                        <div className="text-xs text-gray-500">
                          Resets in {timeUntilReset} • Max XP: {selectedPathData.totalXP}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {progress?.completed ? (
                          <div className="space-y-2">
                            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium text-sm border border-green-200">
                              ✓ Complete!
                            </div>
                            <button
                              onClick={() => setShowCertificate(true)}
                              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                            >
                              View Certificate
                            </button>
                          </div>
                        ) : (
                          <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                            <div className="text-lg font-bold text-gray-900">
                              {progress?.completedTasks.length || 0} / {selectedPathData.tasks.length}
                            </div>
                            <div className="text-sm text-gray-500">
                              {calculateProgress(selectedPath || '')}% complete
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Success Certificate Modal */}
        {showCertificate && selectedPathData && progress?.completed && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg mx-auto overflow-hidden">
              {/* Certificate Header */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 text-center">
                <div className="text-3xl mb-1">🏆</div>
                <h2 className="text-xl font-bold text-white mb-1">Daily Success Certificate</h2>
                <p className="text-yellow-100 text-xs">Digital Era DMO Achievement</p>
              </div>
              
              {/* Certificate Body */}
              <div className="p-4 text-center">
                <div className="border-2 border-dashed border-yellow-400 rounded-lg p-3 mb-3">
                  <div className="text-4xl mb-2">{selectedPathData.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Congratulations!</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Ashley Kemp</strong> completed the
                  </p>
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-3 py-2 rounded-lg mb-3">
                    <div className="text-sm font-bold">{selectedPathData.name} DMO</div>
                    <div className="text-xs opacity-90">{selectedPathData.title}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
                    <div className="text-center">
                      <div className="font-bold text-sm text-gray-900">{selectedPathData.tasks.length}</div>
                      <div>Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-sm text-gray-900">{progress.xpEarned}</div>
                      <div>XP</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-sm text-gray-900">{selectedPathData.estimatedTime}m</div>
                      <div>Time</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric' 
                    })}
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    Streak: {stats.currentStreak} • Total XP: {stats.totalXPEarned}
                  </div>
                </div>
                
                {/* Share Buttons */}
                <div className="flex flex-col gap-2 justify-center">
                  <button
                    onClick={() => {
                      const text = `🎯 Just completed my ${selectedPathData.name} DMO today! ${selectedPathData.tasks.length} tasks done, ${progress.xpEarned} XP earned. Building my business one day at a time! 💪 #DigitalEra #DMO #Success`;
                      const url = 'https://www.facebook.com/groups/onlineempiresvip';
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <i className="fab fa-facebook-f mr-2"></i>
                    Share to Facebook Group
                  </button>
                  
                  <button
                    onClick={() => {
                      // Create and download certificate image
                      const canvas = document.createElement('canvas');
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        canvas.width = 600;
                        canvas.height = 400;
                        
                        // Background
                        const gradient = ctx.createLinearGradient(0, 0, 600, 400);
                        gradient.addColorStop(0, '#fbbf24');
                        gradient.addColorStop(1, '#f59e0b');
                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, 0, 600, 400);
                        
                        // Border
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 6;
                        ctx.strokeRect(15, 15, 570, 370);
                        
                        // Title
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 32px Arial';
                        ctx.textAlign = 'center';
                        ctx.fillText('SUCCESS CERTIFICATE', 300, 80);
                        
                        // Name
                        ctx.font = 'bold 24px Arial';
                        ctx.fillStyle = '#1f2937';
                        ctx.fillText('Ashley Kemp', 300, 130);
                        
                        // DMO Info
                        ctx.font = 'bold 20px Arial';
                        ctx.fillText(`${selectedPathData.name} DMO`, 300, 180);
                        
                        // Stats
                        ctx.font = '16px Arial';
                        ctx.fillText(`${selectedPathData.tasks.length} Tasks • ${progress.xpEarned} XP`, 300, 220);
                        
                        // Date
                        ctx.font = '14px Arial';
                        ctx.fillText(new Date().toLocaleDateString(), 300, 280);
                        
                        // Signature
                        ctx.font = 'italic 12px Arial';
                        ctx.fillText('Digital Era Community', 300, 340);
                        
                        // Download
                        const link = document.createElement('a');
                        link.download = `DMO-Certificate-${selectedPathData.name}-${new Date().toISOString().split('T')[0]}.png`;
                        link.href = canvas.toDataURL();
                        link.click();
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Download Certificate
                  </button>
                </div>
              </div>
              
              {/* Certificate Footer */}
              <div className="bg-gray-100 px-4 py-3 text-center">
                <button
                  onClick={() => setShowCertificate(false)}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Achievement Modal */}
        {showAchievement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md mx-auto">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Achievement Unlocked!</h2>
              
              {(() => {
                const achievement = Object.values(DMO_ACHIEVEMENTS).find(a => a.id === showAchievement);
                return achievement ? (
                  <>
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 mb-4">{achievement.description}</p>
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-medium mb-4">
                      +{achievement.xpBonus} XP Bonus!
                    </div>
                  </>
                ) : null;
              })()}
              
              <button
                onClick={() => setShowAchievement(null)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Awesome!
              </button>
            </div>
          </div>
        )}
      </AppLayout>
    </>
  );
};

export default DMOPage;