// Learning Streak Service
// Calculates real learning streaks based on lesson completion dates

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakActive: boolean;
}

// Get streak data from localStorage
const getStoredStreakData = (): StreakData => {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastActivityDate: '', streakActive: false };
  }
  
  try {
    const stored = localStorage.getItem('learningStreak');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load streak data:', error);
  }
  
  return { currentStreak: 0, longestStreak: 0, lastActivityDate: '', streakActive: false };
};

// Store streak data in localStorage
const storeStreakData = (data: StreakData) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('learningStreak', JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to store streak data:', error);
  }
};

// Check if two dates are consecutive days
const areConsecutiveDays = (date1: Date, date2: Date): boolean => {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  const diffDays = Math.floor(diffTime / oneDay);
  return diffDays === 1;
};

// Check if date is today
const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Check if date is yesterday
const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

// Update streak when a lesson is completed
export const updateStreakOnLessonComplete = () => {
  const streakData = getStoredStreakData();
  const today = new Date();
  const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // If no previous activity, start with streak of 1
  if (!streakData.lastActivityDate) {
    const newData: StreakData = {
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: todayString,
      streakActive: true
    };
    storeStreakData(newData);
    return newData;
  }
  
  const lastActivityDate = new Date(streakData.lastActivityDate);
  
  // If activity is today, don't change streak (already counted for today)
  if (isToday(lastActivityDate)) {
    return streakData;
  }
  
  // If last activity was yesterday, increment streak
  if (isYesterday(lastActivityDate)) {
    const newStreak = streakData.currentStreak + 1;
    const newData: StreakData = {
      currentStreak: newStreak,
      longestStreak: Math.max(streakData.longestStreak, newStreak),
      lastActivityDate: todayString,
      streakActive: true
    };
    storeStreakData(newData);
    return newData;
  }
  
  // If more than one day has passed, reset streak to 1
  const newData: StreakData = {
    currentStreak: 1,
    longestStreak: streakData.longestStreak,
    lastActivityDate: todayString,
    streakActive: true
  };
  storeStreakData(newData);
  return newData;
};

// Get current streak status
export const getCurrentStreak = (): StreakData => {
  const streakData = getStoredStreakData();
  
  if (!streakData.lastActivityDate) {
    return streakData;
  }
  
  const lastActivityDate = new Date(streakData.lastActivityDate);
  const today = new Date();
  
  // If last activity was today or yesterday, streak is still active
  if (isToday(lastActivityDate) || isYesterday(lastActivityDate)) {
    return { ...streakData, streakActive: true };
  }
  
  // If more than one day has passed, streak is broken but don't reset the counter
  // (we'll reset it when they complete another lesson)
  return { ...streakData, streakActive: false };
};

// Initialize streak with demo data if completely new user
export const initializeStreak = (): StreakData => {
  const streakData = getStoredStreakData();
  
  // If no streak data exists, create some demo data
  if (!streakData.lastActivityDate) {
    const demoData: StreakData = {
      currentStreak: 5,
      longestStreak: 12,
      lastActivityDate: new Date().toISOString().split('T')[0],
      streakActive: true
    };
    storeStreakData(demoData);
    return demoData;
  }
  
  return getCurrentStreak();
};