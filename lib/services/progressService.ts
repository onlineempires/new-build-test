import { 
  loadProgressFromStorage, 
  getCurrentProgress, 
  getCurrentUserLevel, 
  getAllCourses,
  CourseData,
  calculateUserLevel
} from '../api/courses';
import { getCurrentStreak, initializeStreak } from './streakService';

// Cache for course data to avoid repeated API calls
let courseDataCache: CourseData | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 1000; // Reduced to 1 second to prevent stale data issues

// Unified progress calculation
export interface UnifiedProgress {
  completedCourses: number;
  totalCourses: number;
  coursesCompleted: number; // alias for compatibility
  coursesTotal: number; // alias for compatibility
  totalXP: number;
  xpPoints: number; // alias for compatibility
  currentLevel: any;
  level: string; // alias for compatibility
  learningStreakDays: number;
  progressPercent: number;
  completedLessons: string[];
  lastUpdateTime: number;
}

// Get cached course data or fetch fresh
export const getCachedCourseData = async (forceRefresh: boolean = false): Promise<CourseData> => {
  const now = Date.now();
  
  // Check for lesson progress invalidation flag
  const shouldInvalidate = typeof window !== 'undefined' && 
    sessionStorage.getItem('progressCacheInvalidated');
  
  // Return cached data if still valid and not invalidated
  if (!forceRefresh && !shouldInvalidate && courseDataCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return courseDataCache;
  }
  
  // Clear invalidation flag
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('progressCacheInvalidated');
  }
  
  // Fetch fresh data
  courseDataCache = await getAllCourses();
  cacheTimestamp = now;
  return courseDataCache;
};

// Get unified progress across the app
export const getUnifiedProgress = async (): Promise<UnifiedProgress> => {
  // Load from storage first
  loadProgressFromStorage();
  
  // Get current progress
  const progress = getCurrentProgress();
  
  // Force fresh course data if cache might be stale
  const shouldForceRefresh = typeof window !== 'undefined' && 
    sessionStorage.getItem('progressCacheInvalidated');
  
  // Get course data (cached or forced refresh)
  const courseData = await getCachedCourseData(!!shouldForceRefresh);
  const totalCourses = courseData.startHereCourses.length + courseData.socialMediaCourses.length;
  
  // Calculate completed courses by checking actual lesson completion status
  // CRITICAL: Use ONLY lesson-based completion to avoid double-counting
  let actualCompletedCourses = 0;
  const allCourses = [...courseData.startHereCourses, ...courseData.socialMediaCourses];
  
  console.log('🔍 PROGRESS CALCULATION DEBUG:', {
    totalCourses: allCourses.length,
    completedLessonsInGlobalState: progress.completedLessons.length,
    completedLessonsArray: progress.completedLessons,
    cacheForced: !!shouldForceRefresh
  });
  
  allCourses.forEach((course, index) => {
    // Count course as completed ONLY if ALL lessons are actually completed
    const totalLessonsInCourse = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
    
    // CRITICAL: Check lesson completion against our global progress state, not course data
    const completedLessonsInCourse = course.modules.reduce((sum, module) => {
      return sum + module.lessons.filter(lesson => {
        // Use the actual global progress state, not the lesson.isCompleted flag
        const isInProgressState = progress.completedLessons.includes(lesson.id);
        if (isInProgressState !== lesson.isCompleted) {
          console.log(`⚠️ Mismatch for lesson ${lesson.id}: progressState=${isInProgressState}, lessonFlag=${lesson.isCompleted}`);
        }
        return isInProgressState;
      }).length;
    }, 0);
    
    // CRITICAL: Calculate completion based on ACTUAL lesson data, not course.isCompleted flag
    const isCompleted = totalLessonsInCourse > 0 && completedLessonsInCourse === totalLessonsInCourse;
    
    console.log(`📊 Course ${index + 1} (${course.title}):`, {
      totalLessons: totalLessonsInCourse,
      completedLessons: completedLessonsInCourse,
      isCompleted: isCompleted,
      courseProgress: course.progress,
      courseIsCompleted: course.isCompleted,
      usingCalculatedCompletion: true
    });
    
    // FIXED: Use our calculated completion, NOT the course.isCompleted flag
    if (isCompleted) {
      actualCompletedCourses++;
      console.log(`✅ Course "${course.title}" counted as completed (${completedLessonsInCourse}/${totalLessonsInCourse} lessons)`);
    } else {
      console.log(`❌ Course "${course.title}" NOT completed (${completedLessonsInCourse}/${totalLessonsInCourse} lessons)`);
    }
  });
  
  console.log('🏆 FINAL CALCULATION:', {
    actualCompletedCourses,
    totalCourses: allCourses.length
  });
  
  // Calculate current level based on ACTUAL completed courses
  const currentLevel = calculateUserLevel(actualCompletedCourses);
  
  // Setup global cache invalidation function
  if (typeof window !== 'undefined') {
    (window as any).invalidateProgressCache = invalidateProgressCache;
  }
  
  return {
    completedCourses: actualCompletedCourses,
    totalCourses,
    coursesCompleted: actualCompletedCourses, // alias
    coursesTotal: totalCourses, // alias
    totalXP: progress.totalXP,
    xpPoints: progress.totalXP, // alias
    currentLevel,
    level: currentLevel.name, // alias
    learningStreakDays: initializeStreak().currentStreak, // Real streak calculation
    progressPercent: totalCourses > 0 ? Math.round((actualCompletedCourses / totalCourses) * 100) : 0,
    completedLessons: progress.completedLessons,
    lastUpdateTime: progress.lastUpdateTime
  };
};

// Invalidate cache when progress changes
export const invalidateProgressCache = () => {
  courseDataCache = null;
  cacheTimestamp = 0;
  // Also clear any browser-level caches that might interfere
  if (typeof window !== 'undefined') {
    // Force a complete cache refresh by updating a timestamp
    sessionStorage.setItem('progressCacheInvalidated', Date.now().toString());
  }
};

// Fast stats for display (uses cached data when available)
export const getFastStats = async () => {
  try {
    // Check if we should use cached stats (for very recent calls)
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('fastStatsCache');
      const cacheInvalidated = sessionStorage.getItem('progressCacheInvalidated');
      
      if (cached && !cacheInvalidated) {
        const { data, timestamp } = JSON.parse(cached);
        // Use cache only if it's less than 500ms old AND not invalidated
        // Reduced from 2 seconds to prevent stale data
        if ((Date.now() - timestamp) < 500) {
          return data;
        }
      }
    }
    
    const progress = await getUnifiedProgress();
    const stats = {
      coursesCompleted: progress.completedCourses,
      coursesTotal: progress.totalCourses,
      learningStreakDays: progress.learningStreakDays,
      commissions: 2847.00,
      newLeads: 47,
      progressPercent: progress.progressPercent,
      xpPoints: progress.totalXP,
      level: progress.level
    };
    
    // Cache the result
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fastStatsCache', JSON.stringify({
        data: stats,
        timestamp: Date.now()
      }));
      // Clear the invalidation flag
      sessionStorage.removeItem('progressCacheInvalidated');
    }
    
    return stats;
  } catch (error) {
    console.warn('Error getting fast stats:', error);
    // Return default stats on error
    return {
      coursesCompleted: 0,
      coursesTotal: 0,
      learningStreakDays: 0,
      commissions: 0,
      newLeads: 0,
      progressPercent: 0,
      xpPoints: 0,
      level: 'Rookie'
    };
  }
};