export interface DMOTask {
  id: string;
  title: string;
  description: string;
  duration: string;
  xpReward: number;
  category: 'connections' | 'conversations' | 'content' | 'learning';
  completed: boolean;
  timeCompleted?: string;
}

export interface DMOPath {
  id: string;
  name: string;
  title: string;
  description: string;
  hoursPerDay: number;
  color: string;
  icon: string;
  tasks: DMOTask[];
  totalXP: number;
  estimatedTime: number; // in minutes
}

export interface DMOProgress {
  date: string;
  selectedPath?: string;
  completedTasks: string[];
  xpEarned: number;
  completed: boolean;
  timeStarted?: string;
  timeCompleted?: string;
}

export interface DMOStats {
  currentStreak: number;
  longestStreak: number;
  totalDaysCompleted: number;
  totalXPEarned: number;
  achievements: string[];
  favoritePathId?: string;
  lastCompletedDate?: string;
}

// DMO Achievement System
export const DMO_ACHIEVEMENTS = {
  FIRST_DAY: {
    id: 'first_day',
    title: 'First Steps',
    description: 'Complete your first DMO',
    icon: '🎯',
    xpBonus: 50
  },
  STREAK_3: {
    id: 'streak_3',
    title: '3-Day Warrior',
    description: 'Complete 3 days in a row',
    icon: '🔥',
    xpBonus: 100
  },
  STREAK_7: {
    id: 'streak_7',
    title: 'Weekly Champion',
    description: 'Complete 7 days in a row',
    icon: '👑',
    xpBonus: 250
  },
  STREAK_30: {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Complete 30 days in a row',
    icon: '💎',
    xpBonus: 1000
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete Express path 5 times',
    icon: '⚡',
    xpBonus: 200
  },
  STEADY_CLIMBER: {
    id: 'steady_climber',
    title: 'Steady Climber',
    description: 'Complete Steady Climber path 10 times',
    icon: '🏔️',
    xpBonus: 400
  }
} as const;

// DMO Path Definitions
export const DMO_PATHS: DMOPath[] = [
  {
    id: 'express',
    name: 'Express',
    title: '1 Hour Per Day',
    description: 'Perfect for busy beginners getting started',
    hoursPerDay: 1,
    color: 'blue',
    icon: '⚡',
    totalXP: 150,
    estimatedTime: 60,
    tasks: [
      {
        id: 'exp_1',
        title: 'Check and respond to friend requests',
        description: 'Accept relevant connections (5 min)',
        duration: '5 min',
        xpReward: 15,
        category: 'connections',
        completed: false
      },
      {
        id: 'exp_2',
        title: 'Send 5-10 friend requests with personal messages',
        description: 'Target quality prospects in your market (15 min)',
        duration: '15 min',
        xpReward: 25,
        category: 'connections',
        completed: false
      },
      {
        id: 'exp_3',
        title: 'Message 3-5 warm prospects with value',
        description: 'Share resources, tips, or helpful content (15 min)',
        duration: '15 min',
        xpReward: 30,
        category: 'conversations',
        completed: false
      },
      {
        id: 'exp_4',
        title: 'Engage with 10+ posts in your timeline',
        description: 'Like, comment meaningfully, and share (10 min)',
        duration: '10 min',
        xpReward: 20,
        category: 'connections',
        completed: false
      },
      {
        id: 'exp_5',
        title: 'Create and post 1 value-driven post',
        description: 'Educational, motivational, or behind-the-scenes content (15 min)',
        duration: '15 min',
        xpReward: 35,
        category: 'content',
        completed: false
      },
      {
        id: 'exp_6',
        title: 'Join and engage in 1-2 relevant groups',
        description: 'Find and participate in industry groups (5 min)',
        duration: '5 min',
        xpReward: 25,
        category: 'connections',
        completed: false
      }
    ]
  },
  {
    id: 'pocket_builder',
    name: 'Pocket Builder',
    title: '2 Hours Per Day',
    description: 'For those building their business steadily',
    hoursPerDay: 2,
    color: 'green',
    icon: '🚀',
    totalXP: 300,
    estimatedTime: 120,
    tasks: [
      {
        id: 'pb_1',
        title: 'Check and respond to friend requests',
        description: 'Accept relevant connections (5 min)',
        duration: '5 min',
        xpReward: 15,
        category: 'connections',
        completed: false
      },
      {
        id: 'pb_2',
        title: 'Send 15-25 friend requests with personal messages',
        description: 'Target quality prospects in your market (10 min)',
        duration: '10 min',
        xpReward: 20,
        category: 'connections',
        completed: false
      },
      {
        id: 'pb_3',
        title: 'Engage with 20+ posts in your timeline',
        description: 'Like, comment meaningfully, and share (10 min)',
        duration: '10 min',
        xpReward: 15,
        category: 'connections',
        completed: false
      },
      {
        id: 'pb_4',
        title: 'Join and engage in 2-3 relevant groups',
        description: 'Find and participate in industry groups (5 min)',
        duration: '5 min',
        xpReward: 10,
        category: 'connections',
        completed: false
      },
      {
        id: 'pb_5',
        title: 'Message 10-15 warm prospects with value',
        description: 'Share resources, tips, or helpful content (20 min)',
        duration: '20 min',
        xpReward: 25,
        category: 'conversations',
        completed: false
      },
      {
        id: 'pb_6',
        title: 'Follow up with previous conversations',
        description: 'Continue building relationships (15 min)',
        duration: '15 min',
        xpReward: 20,
        category: 'conversations',
        completed: false
      },
      {
        id: 'pb_7',
        title: 'Conduct 1-2 product/opportunity mini-presentations',
        description: 'Share your business opportunity briefly (10 min)',
        duration: '10 min',
        xpReward: 15,
        category: 'conversations',
        completed: false
      },
      {
        id: 'pb_8',
        title: 'Create and post 2-3 high-value posts',
        description: 'Educational, motivational, or behind-the-scenes content (20 min)',
        duration: '20 min',
        xpReward: 25,
        category: 'content',
        completed: false
      },
      {
        id: 'pb_9',
        title: 'Record and post 1 short educational video',
        description: 'Quick tip, testimonial, or product demo (15 min)',
        duration: '15 min',
        xpReward: 20,
        category: 'content',
        completed: false
      },
      {
        id: 'pb_10',
        title: 'Update stories with behind-the-scenes content',
        description: 'Show your daily routine or business activities (10 min)',
        duration: '10 min',
        xpReward: 15,
        category: 'content',
        completed: false
      }
    ]
  },
  {
    id: 'steady_climber',
    name: 'Steady Climber',
    title: '4 Hours Per Day',
    description: 'For serious business builders',
    hoursPerDay: 4,
    color: 'orange',
    icon: '🏔️',
    totalXP: 500,
    estimatedTime: 240,
    tasks: [
      {
        id: 'sc_1',
        title: 'Check and respond to friend requests',
        description: 'Accept relevant connections (10 min)',
        duration: '10 min',
        xpReward: 15,
        category: 'connections',
        completed: false
      },
      {
        id: 'sc_2',
        title: 'Send 25-50 friend requests with personal messages',
        description: 'Target quality prospects in your market (20 min)',
        duration: '20 min',
        xpReward: 30,
        category: 'connections',
        completed: false
      },
      {
        id: 'sc_3',
        title: 'Engage with 30+ posts in your timeline',
        description: 'Like, comment meaningfully, and share (15 min)',
        duration: '15 min',
        xpReward: 20,
        category: 'connections',
        completed: false
      },
      {
        id: 'sc_4',
        title: 'Join and engage in 3-5 relevant groups',
        description: 'Find and participate in industry groups (15 min)',
        duration: '15 min',
        xpReward: 15,
        category: 'connections',
        completed: false
      },
      {
        id: 'sc_5',
        title: 'Message 20-30 warm prospects with value',
        description: 'Share resources, tips, or helpful content (40 min)',
        duration: '40 min',
        xpReward: 40,
        category: 'conversations',
        completed: false
      },
      {
        id: 'sc_6',
        title: 'Follow up with previous conversations',
        description: 'Continue building relationships (20 min)',
        duration: '20 min',
        xpReward: 25,
        category: 'conversations',
        completed: false
      },
      {
        id: 'sc_7',
        title: 'Conduct 3-5 product/opportunity presentations',
        description: 'Share your business opportunity (30 min)',
        duration: '30 min',
        xpReward: 35,
        category: 'conversations',
        completed: false
      },
      {
        id: 'sc_8',
        title: 'Host or participate in live training/Q&A',
        description: 'Share knowledge or learn from others (20 min)',
        duration: '20 min',
        xpReward: 30,
        category: 'learning',
        completed: false
      },
      {
        id: 'sc_9',
        title: 'Create and post 3-4 high-value posts',
        description: 'Educational, motivational, or behind-the-scenes content (30 min)',
        duration: '30 min',
        xpReward: 35,
        category: 'content',
        completed: false
      },
      {
        id: 'sc_10',
        title: 'Record and post 2-3 educational videos',
        description: 'Tips, testimonials, or product demos (30 min)',
        duration: '30 min',
        xpReward: 40,
        category: 'content',
        completed: false
      },
      {
        id: 'sc_11',
        title: 'Update stories throughout the day',
        description: 'Show your daily routine and business activities (20 min)',
        duration: '20 min',
        xpReward: 20,
        category: 'content',
        completed: false
      },
      {
        id: 'sc_12',
        title: 'Research and connect with industry leaders',
        description: 'Build relationships with key influencers (20 min)',
        duration: '20 min',
        xpReward: 25,
        category: 'connections',
        completed: false
      }
    ]
  },
  {
    id: 'full_throttle',
    name: 'Full Throttle',
    title: '6+ Hours Per Day',
    description: 'Maximum acceleration for rapid growth',
    hoursPerDay: 6,
    color: 'red',
    icon: '🔥',
    totalXP: 800,
    estimatedTime: 360,
    tasks: [
      {
        id: 'ft_1',
        title: 'Check and respond to friend requests',
        description: 'Accept relevant connections (15 min)',
        duration: '15 min',
        xpReward: 20,
        category: 'connections',
        completed: false
      },
      {
        id: 'ft_2',
        title: 'Send 50+ friend requests with personal messages',
        description: 'Target quality prospects in your market (30 min)',
        duration: '30 min',
        xpReward: 40,
        category: 'connections',
        completed: false
      },
      {
        id: 'ft_3',
        title: 'Engage with 50+ posts in your timeline',
        description: 'Like, comment meaningfully, and share (20 min)',
        duration: '20 min',
        xpReward: 25,
        category: 'connections',
        completed: false
      },
      {
        id: 'ft_4',
        title: 'Join and engage in 5+ relevant groups',
        description: 'Find and participate in industry groups (20 min)',
        duration: '20 min',
        xpReward: 20,
        category: 'connections',
        completed: false
      },
      {
        id: 'ft_5',
        title: 'Message 40+ warm prospects with value',
        description: 'Share resources, tips, or helpful content (60 min)',
        duration: '60 min',
        xpReward: 60,
        category: 'conversations',
        completed: false
      },
      {
        id: 'ft_6',
        title: 'Follow up with previous conversations',
        description: 'Continue building relationships (30 min)',
        duration: '30 min',
        xpReward: 35,
        category: 'conversations',
        completed: false
      },
      {
        id: 'ft_7',
        title: 'Conduct 5+ product/opportunity presentations',
        description: 'Share your business opportunity (45 min)',
        duration: '45 min',
        xpReward: 50,
        category: 'conversations',
        completed: false
      },
      {
        id: 'ft_8',
        title: 'Host live training or webinar',
        description: 'Lead educational content for your audience (45 min)',
        duration: '45 min',
        xpReward: 60,
        category: 'learning',
        completed: false
      },
      {
        id: 'ft_9',
        title: 'Participate in team calls and trainings',
        description: 'Join team meetings and educational sessions (30 min)',
        duration: '30 min',
        xpReward: 30,
        category: 'learning',
        completed: false
      },
      {
        id: 'ft_10',
        title: 'Create and post 5+ high-value posts',
        description: 'Educational, motivational, or behind-the-scenes content (45 min)',
        duration: '45 min',
        xpReward: 50,
        category: 'content',
        completed: false
      },
      {
        id: 'ft_11',
        title: 'Record and post multiple educational videos',
        description: 'Tips, testimonials, product demos (45 min)',
        duration: '45 min',
        xpReward: 55,
        category: 'content',
        completed: false
      },
      {
        id: 'ft_12',
        title: 'Update stories throughout the day',
        description: 'Show your daily routine and business activities (25 min)',
        duration: '25 min',
        xpReward: 25,
        category: 'content',
        completed: false
      },
      {
        id: 'ft_13',
        title: 'Research and connect with industry leaders',
        description: 'Build relationships with key influencers (30 min)',
        duration: '30 min',
        xpReward: 35,
        category: 'connections',
        completed: false
      },
      {
        id: 'ft_14',
        title: 'Plan and schedule next day content',
        description: 'Prepare content calendar and strategy (20 min)',
        duration: '20 min',
        xpReward: 30,
        category: 'content',
        completed: false
      },
      {
        id: 'ft_15',
        title: 'Mentor team members or new recruits',
        description: 'Support your team with guidance and training (30 min)',
        duration: '30 min',
        xpReward: 40,
        category: 'learning',
        completed: false
      }
    ]
  }
];

// Utility Functions
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getTimeUntilMidnight = (): string => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

export const shouldResetProgress = (lastDate: string): boolean => {
  const today = getTodayString();
  return lastDate !== today;
};

// DMO Service Functions
export const getDMOProgress = (): DMOProgress | null => {
  if (typeof window === 'undefined') return null;
  
  const today = getTodayString();
  const stored = localStorage.getItem(`dmo_progress_${today}`);
  
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

// Check if user has already selected a path today
export const hasSelectedPathToday = (): boolean => {
  const progress = getDMOProgress();
  return !!(progress && progress.selectedPath);
};

// Get today's selected path (if any)
export const getTodaysSelectedPath = (): string | null => {
  const progress = getDMOProgress();
  return progress?.selectedPath || null;
};

export const saveDMOProgress = (progress: DMOProgress): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(`dmo_progress_${progress.date}`, JSON.stringify(progress));
};

// Reset path selection (only for testing/admin purposes)
export const resetDMOProgress = (): void => {
  if (typeof window === 'undefined') return;
  
  const today = getTodayString();
  localStorage.removeItem(`dmo_progress_${today}`);
};

// Validate daily XP to prevent gaming (max one completion per day)
export const validateDailyXP = (currentXP: number, pathId: string): number => {
  const path = DMO_PATHS.find(p => p.id === pathId);
  if (!path) return 0;
  
  // Ensure XP doesn't exceed the maximum possible for the selected path
  return Math.min(currentXP, path.totalXP);
};

// Check if today's DMO is already completed
export const isDMOCompletedToday = (): boolean => {
  const progress = getDMOProgress();
  return !!(progress && progress.completed);
};

// Get completion rate for today
export const getTodayCompletionRate = (): number => {
  const progress = getDMOProgress();
  if (!progress || !progress.selectedPath) return 0;
  
  const path = DMO_PATHS.find(p => p.id === progress.selectedPath);
  if (!path) return 0;
  
  return Math.round((progress.completedTasks.length / path.tasks.length) * 100);
};

export const getDMOStats = (): DMOStats => {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysCompleted: 0,
      totalXPEarned: 0,
      achievements: []
    };
  }
  
  const stored = localStorage.getItem('dmo_stats');
  
  if (!stored) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysCompleted: 0,
      totalXPEarned: 0,
      achievements: []
    };
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysCompleted: 0,
      totalXPEarned: 0,
      achievements: []
    };
  }
};

export const saveDMOStats = (stats: DMOStats): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('dmo_stats', JSON.stringify(stats));
};

export const calculateStreak = (): number => {
  if (typeof window === 'undefined') return 0;
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 365; i++) { // Check up to a year
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateString = checkDate.toISOString().split('T')[0];
    
    const progress = localStorage.getItem(`dmo_progress_${dateString}`);
    
    if (progress) {
      const parsed: DMOProgress = JSON.parse(progress);
      if (parsed.completed) {
        streak++;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  
  return streak;
};

export const checkNewAchievements = (stats: DMOStats, newProgress: DMOProgress): string[] => {
  const newAchievements: string[] = [];
  
  // Check for new achievements
  if (stats.totalDaysCompleted === 0) {
    newAchievements.push(DMO_ACHIEVEMENTS.FIRST_DAY.id);
  }
  
  if (stats.currentStreak === 2) {
    newAchievements.push(DMO_ACHIEVEMENTS.STREAK_3.id);
  }
  
  if (stats.currentStreak === 6) {
    newAchievements.push(DMO_ACHIEVEMENTS.STREAK_7.id);
  }
  
  if (stats.currentStreak === 29) {
    newAchievements.push(DMO_ACHIEVEMENTS.STREAK_30.id);
  }
  
  // Path-specific achievements
  const pathCompletions = countPathCompletions(newProgress.selectedPath || '');
  
  if (newProgress.selectedPath === 'express' && pathCompletions === 5) {
    newAchievements.push(DMO_ACHIEVEMENTS.SPEED_DEMON.id);
  }
  
  if (newProgress.selectedPath === 'steady_climber' && pathCompletions === 10) {
    newAchievements.push(DMO_ACHIEVEMENTS.STEADY_CLIMBER.id);
  }
  
  return newAchievements.filter(id => !stats.achievements.includes(id));
};

export const countPathCompletions = (pathId: string): number => {
  if (typeof window === 'undefined') return 0;
  
  let count = 0;
  
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - i);
    const dateString = checkDate.toISOString().split('T')[0];
    
    const progress = localStorage.getItem(`dmo_progress_${dateString}`);
    
    if (progress) {
      const parsed: DMOProgress = JSON.parse(progress);
      if (parsed.completed && parsed.selectedPath === pathId) {
        count++;
      }
    }
  }
  
  return count;
};