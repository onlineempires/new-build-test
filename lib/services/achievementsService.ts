import { getCurrentProgress, LEVEL_TIERS, calculateUserLevel } from '../api/courses';
import { getUnifiedProgress } from './progressService';

export interface Achievement {
  id: string;
  type: 'course' | 'xp' | 'streak' | 'level' | 'commission';
  title: string;
  description: string;
  timeAgo: string;
  timestamp: number;
  isNew: boolean;
}

// XP tier thresholds for achievements
const XP_TIERS = [
  { threshold: 100, name: 'First Steps' },
  { threshold: 250, name: 'Getting Started' },
  { threshold: 500, name: 'Learning Momentum' },
  { threshold: 1000, name: 'Knowledge Seeker' },
  { threshold: 2000, name: 'Dedicated Learner' },
  { threshold: 3000, name: 'Expert in Training' },
  { threshold: 5000, name: 'Master Student' },
  { threshold: 10000, name: 'Learning Legend' }
];

// Course completion achievements
const COURSE_ACHIEVEMENTS = {
  'business-blueprint': { name: 'Business Blueprint', xp: 375, tier: 'Foundation' },
  'discovery-process': { name: 'Discovery Process', xp: 375, tier: 'Foundation' },
  'next-steps': { name: 'Next Steps', xp: 500, tier: 'Foundation' },
  'tiktok-mastery': { name: 'TikTok Mastery', xp: 625, tier: 'Advanced' },
  'facebook-advertising': { name: 'Facebook Advertising Mastery', xp: 875, tier: 'Advanced' },
  'instagram-marketing': { name: 'Instagram Marketing', xp: 550, tier: 'Intermediate' },
  'sales-funnel-mastery': { name: 'Sales Funnel Mastery', xp: 750, tier: 'Advanced' }
};

// Get achievements from localStorage
const getStoredAchievements = (): Achievement[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('userAchievements');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load achievements:', error);
    return [];
  }
};

// Store achievements in localStorage
const storeAchievements = (achievements: Achievement[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('userAchievements', JSON.stringify(achievements));
  } catch (error) {
    console.warn('Failed to store achievements:', error);
  }
};

// Add a new achievement
const addAchievement = (achievement: Omit<Achievement, 'id' | 'timestamp' | 'isNew' | 'timeAgo'>) => {
  const achievements = getStoredAchievements();
  const newAchievement: Achievement = {
    ...achievement,
    id: `${achievement.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    timeAgo: 'Just now',
    isNew: true
  };
  
  // Check if similar achievement already exists (prevent duplicates)
  const exists = achievements.some(a => 
    a.type === achievement.type && 
    a.title === achievement.title &&
    (Date.now() - a.timestamp) < 60000 // Within last minute
  );
  
  if (!exists) {
    achievements.unshift(newAchievement); // Add to beginning
    storeAchievements(achievements);
  }
  
  return newAchievement;
};

// Calculate time ago string
const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

// Check and add course completion achievement
export const checkCourseCompletion = async (courseId: string, courseName: string) => {
  const courseInfo = COURSE_ACHIEVEMENTS[courseId as keyof typeof COURSE_ACHIEVEMENTS];
  
  if (courseInfo) {
    addAchievement({
      type: 'course',
      title: `Completed "${courseInfo.name}" course`,
      description: `Earned ${courseInfo.xp} XP • ${courseInfo.tier} Level`
    });
  }
};

// Check and add XP milestone achievements
export const checkXPMilestone = async (currentXP: number) => {
  for (const tier of XP_TIERS) {
    if (currentXP >= tier.threshold) {
      const achievements = getStoredAchievements();
      const exists = achievements.some(a => 
        a.type === 'xp' && 
        a.title.includes(tier.name)
      );
      
      if (!exists) {
        addAchievement({
          type: 'xp',
          title: `Reached ${tier.threshold} XP - ${tier.name}`,
          description: 'Your learning journey is paying off!'
        });
      }
    }
  }
};

// Check and add level up achievements
export const checkLevelUp = async (completedCourses: number) => {
  const currentLevel = calculateUserLevel(completedCourses);
  const achievements = getStoredAchievements();
  
  const exists = achievements.some(a => 
    a.type === 'level' && 
    a.title.includes(currentLevel.name)
  );
  
  if (!exists && completedCourses >= currentLevel.min) {
    addAchievement({
      type: 'level',
      title: `Leveled up to ${currentLevel.name}!`,
      description: `You've completed ${completedCourses} course${completedCourses > 1 ? 's' : ''}`
    });
  }
};

// Check streak achievements (mock for now)
export const checkStreakAchievement = async (streakDays: number) => {
  const streakMilestones = [3, 7, 14, 30, 60, 100];
  
  for (const milestone of streakMilestones) {
    if (streakDays >= milestone) {
      const achievements = getStoredAchievements();
      const exists = achievements.some(a => 
        a.type === 'streak' && 
        a.title.includes(`${milestone}-day`)
      );
      
      if (!exists) {
        addAchievement({
          type: 'streak',
          title: `Achieved ${milestone}-day learning streak`,
          description: 'Consistency is the key to mastery!'
        });
      }
    }
  }
};

// Get recent achievements with proper time formatting
export const getRecentAchievements = (): Achievement[] => {
  const achievements = getStoredAchievements();
  
  // Update time ago and isNew status
  return achievements.map(achievement => ({
    ...achievement,
    timeAgo: getTimeAgo(achievement.timestamp),
    isNew: (Date.now() - achievement.timestamp) < 24 * 60 * 60 * 1000 // Last 24 hours
  })).slice(0, 10); // Return last 10 achievements
};

// Process all achievements based on current progress
export const processAchievements = async () => {
  try {
    const progress = await getUnifiedProgress();
    
    // Check XP milestones
    await checkXPMilestone(progress.totalXP);
    
    // Check level achievements
    await checkLevelUp(progress.completedCourses);
    
    // Check streak achievements (using mock data for now)
    await checkStreakAchievement(progress.learningStreakDays);
    
  } catch (error) {
    console.warn('Error processing achievements:', error);
  }
};

// Initialize achievements with some demo data if empty
export const initializeAchievements = () => {
  const achievements = getStoredAchievements();
  
  if (achievements.length === 0) {
    // Add some initial achievements for demo
    const demoAchievements: Achievement[] = [
      {
        id: 'demo_commission',
        type: 'commission',
        title: 'Earned $150 in affiliate commissions',
        description: 'Your marketing skills are paying off!',
        timeAgo: '2 hours ago',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        isNew: true
      },
      {
        id: 'demo_streak',
        type: 'streak',
        title: 'Achieved 5-day learning streak',
        description: 'Consistency is the key to success!',
        timeAgo: '1 day ago',
        timestamp: Date.now() - 24 * 60 * 60 * 1000,
        isNew: false
      }
    ];
    
    storeAchievements(demoAchievements);
  }
};

// Convert achievements to simple string array for compatibility
export const getAchievementStrings = (): string[] => {
  const achievements = getRecentAchievements();
  return achievements.map(a => `${a.title} • ${a.timeAgo}`);
};