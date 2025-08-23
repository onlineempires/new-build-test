import { LibraryItem } from '../types/library';

// Mock user progress data - in production this would come from API/database
interface UserProgress {
  [courseId: string]: {
    completedLessons: string[];
    currentLesson?: string;
    lastWatched?: string;
  };
}

// Mock progress data
const mockUserProgress: UserProgress = {
  'trust-cycles': {
    completedLessons: ['lesson-1', 'lesson-2'],
    currentLesson: 'lesson-3',
    lastWatched: 'lesson-2'
  },
  'content-marketing-mastery': {
    completedLessons: ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5', 'lesson-6', 'lesson-7'],
    currentLesson: 'lesson-8',
    lastWatched: 'lesson-7'
  },
  'productivity-systems': {
    completedLessons: ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4'],
    currentLesson: 'lesson-5',
    lastWatched: 'lesson-4'
  },
  'creating-opportunities': {
    completedLessons: ['lesson-1'],
    currentLesson: 'lesson-2',
    lastWatched: 'lesson-1'
  },
  'theory-call': {
    completedLessons: ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5'],
    currentLesson: null, // Course completed
    lastWatched: 'lesson-5'
  }
};

// Get the first lesson URL for a course
export function getFirstLessonHref(courseId: string): string {
  // For courses that exist in the system, use proper routing
  const existingCourses = ['tiktok-mastery', 'facebook-advertising-mastery', 'sales-psychology'];
  
  if (existingCourses.includes(courseId)) {
    return `/courses/${courseId}/lesson-1-1`; // Existing format: lesson-module-lesson
  }
  
  // For new library items, use /learn routing to avoid conflicts
  return `/learn/${courseId}/lesson/lesson-1`;
}

// Get the next incomplete lesson URL for a course based on user progress
export function getNextLessonHref(courseId: string, userId?: string): string {
  const progress = mockUserProgress[courseId];
  
  if (!progress) {
    // No progress yet, start from lesson 1
    return getFirstLessonHref(courseId);
  }
  
  if (progress.currentLesson) {
    // User has a current lesson to continue
    const existingCourses = ['tiktok-mastery', 'facebook-advertising-mastery', 'sales-psychology'];
    
    if (existingCourses.includes(courseId)) {
      return `/courses/${courseId}/${progress.currentLesson}`;
    }
    
    return `/learn/${courseId}/lesson/${progress.currentLesson}`;
  }
  
  // Course might be completed, go to last lesson
  if (progress.lastWatched) {
    const existingCourses = ['tiktok-mastery', 'facebook-advertising-mastery', 'sales-psychology'];
    
    if (existingCourses.includes(courseId)) {
      return `/courses/${courseId}/${progress.lastWatched}`;
    }
    
    return `/learn/${courseId}/lesson/${progress.lastWatched}`;
  }
  
  // Fallback to first lesson
  return getFirstLessonHref(courseId);
}

// Check if user has started a course
export function hasUserStartedCourse(courseId: string, userId?: string): boolean {
  const progress = mockUserProgress[courseId];
  return progress && progress.completedLessons.length > 0;
}

// Get user progress percentage for a course
export function getUserProgressPercentage(courseId: string, userId?: string): number {
  const progress = mockUserProgress[courseId];
  if (!progress) return 0;
  
  // Mock total lessons per course (in production this would be fetched from course data)
  const totalLessons: { [key: string]: number } = {
    'trust-cycles': 8,
    'content-marketing-mastery': 12,
    'productivity-systems': 5,
    'creating-opportunities': 5,
    'theory-call': 5,
    'philosophy-of-offers': 6,
    'social-optics': 5,
    'biz-ops': 10,
    'limiting-beliefs': 4,
    'next-5-years': 8,
    'leadership-fundamentals': 6,
    'sales-psychology-deep-dive': 8
  };
  
  const total = totalLessons[courseId] || 10;
  const completed = progress.completedLessons.length;
  
  return Math.round((completed / total) * 100);
}

// Determine the correct CTA text based on progress
export function getCTAText(item: LibraryItem, userId?: string): string {
  if (item.isLocked) {
    return 'Unlock Access';
  }
  
  const progress = getUserProgressPercentage(item.slug, userId);
  
  if (progress === 0) {
    return 'Start Course';
  } else if (progress === 100) {
    return 'Watch Again';
  } else {
    return 'Continue Course';
  }
}

// Get the appropriate route based on progress
export function getCourseRoute(item: LibraryItem, userId?: string): string {
  if (item.isLocked) {
    return item.purchaseHref || '/upgrade';
  }
  
  const hasStarted = hasUserStartedCourse(item.slug, userId);
  
  if (hasStarted) {
    return getNextLessonHref(item.slug, userId);
  }
  
  return getFirstLessonHref(item.slug);
}

// Event tracking for analytics
export function trackCourseAction(action: 'start' | 'continue', item: LibraryItem, targetHref: string): void {
  const eventName = action === 'start' ? 'library_start_clicked' : 'library_continue_clicked';
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, {
      detail: {
        slug: item.slug,
        title: item.title,
        type: item.type,
        targetHref,
        timestamp: new Date().toISOString()
      }
    }));
    
    // Also log for debugging
    console.log(`📚 Course Action: ${action}`, {
      course: item.title,
      slug: item.slug,
      href: targetHref
    });
  }
}

// Mock lesson data for a course (would come from API in production)
export interface Lesson {
  id: string;
  title: string;
  duration: number; // in seconds
  isCompleted: boolean;
  isLocked?: boolean;
}

export function getCourseLessons(courseSlug: string): Lesson[] {
  // Mock lesson data - in production this would be fetched from API
  const lessonData: { [key: string]: Lesson[] } = {
    'trust-cycles': [
      { id: 'lesson-1', title: 'Understanding Trust Foundations', duration: 480, isCompleted: true },
      { id: 'lesson-2', title: 'The Psychology of First Impressions', duration: 720, isCompleted: true },
      { id: 'lesson-3', title: 'Building Rapport Quickly', duration: 600, isCompleted: false },
      { id: 'lesson-4', title: 'Trust Signals in Communication', duration: 540, isCompleted: false },
      { id: 'lesson-5', title: 'Overcoming Trust Barriers', duration: 660, isCompleted: false },
      { id: 'lesson-6', title: 'Long-term Trust Maintenance', duration: 420, isCompleted: false },
      { id: 'lesson-7', title: 'Trust in Digital Environments', duration: 780, isCompleted: false },
      { id: 'lesson-8', title: 'Measuring Trust Success', duration: 360, isCompleted: false }
    ],
    'content-marketing-mastery': [
      { id: 'lesson-1', title: 'Content Strategy Fundamentals', duration: 640, isCompleted: true },
      { id: 'lesson-2', title: 'Audience Research & Personas', duration: 720, isCompleted: true },
      { id: 'lesson-3', title: 'Content Planning & Calendar', duration: 480, isCompleted: true },
      { id: 'lesson-4', title: 'Writing for Different Platforms', duration: 840, isCompleted: true },
      { id: 'lesson-5', title: 'Visual Content Creation', duration: 600, isCompleted: true },
      { id: 'lesson-6', title: 'Video Content Mastery', duration: 960, isCompleted: true },
      { id: 'lesson-7', title: 'SEO for Content Creators', duration: 540, isCompleted: true },
      { id: 'lesson-8', title: 'Content Distribution Strategies', duration: 720, isCompleted: false },
      { id: 'lesson-9', title: 'Email Content That Converts', duration: 480, isCompleted: false },
      { id: 'lesson-10', title: 'Social Media Content', duration: 660, isCompleted: false },
      { id: 'lesson-11', title: 'Analytics & Optimization', duration: 420, isCompleted: false },
      { id: 'lesson-12', title: 'Scaling Content Production', duration: 600, isCompleted: false }
    ],
    'philosophy-of-offers': [
      { id: 'lesson-1', title: 'First Principles of Offers', duration: 900, isCompleted: false },
      { id: 'lesson-2', title: 'Value Stack Psychology', duration: 720, isCompleted: false },
      { id: 'lesson-3', title: 'Irresistible Offer Framework', duration: 1080, isCompleted: false },
      { id: 'lesson-4', title: 'Pricing Strategy Mastery', duration: 840, isCompleted: false },
      { id: 'lesson-5', title: 'Scarcity and Urgency', duration: 660, isCompleted: false },
      { id: 'lesson-6', title: 'Testing and Optimization', duration: 540, isCompleted: false }
    ],
    'social-optics': [
      { id: 'lesson-1', title: 'The Power of Perception', duration: 780, isCompleted: false },
      { id: 'lesson-2', title: 'Symbolic Communication', duration: 660, isCompleted: false },
      { id: 'lesson-3', title: 'Brand Positioning Psychology', duration: 840, isCompleted: false },
      { id: 'lesson-4', title: 'Visual Identity Mastery', duration: 720, isCompleted: false },
      { id: 'lesson-5', title: 'Social Proof Mechanics', duration: 600, isCompleted: false }
    ],
    'creating-opportunities': [
      { id: 'lesson-1', title: 'Opportunity Mindset', duration: 480, isCompleted: true },
      { id: 'lesson-2', title: 'Market Gap Analysis', duration: 600, isCompleted: false },
      { id: 'lesson-3', title: 'Trend Spotting', duration: 540, isCompleted: false },
      { id: 'lesson-4', title: 'Network Effect Strategies', duration: 720, isCompleted: false },
      { id: 'lesson-5', title: 'Timing and Execution', duration: 660, isCompleted: false }
    ],
    'productivity-systems': [
      { id: 'lesson-1', title: 'System Design Principles', duration: 420, isCompleted: true },
      { id: 'lesson-2', title: 'Time Management Frameworks', duration: 480, isCompleted: true },
      { id: 'lesson-3', title: 'Automation Strategies', duration: 540, isCompleted: true },
      { id: 'lesson-4', title: 'Energy Management', duration: 360, isCompleted: true },
      { id: 'lesson-5', title: 'Performance Optimization', duration: 300, isCompleted: false }
    ],
    'limiting-beliefs': [
      { id: 'lesson-1', title: 'Identifying Limiting Beliefs', duration: 540, isCompleted: false },
      { id: 'lesson-2', title: 'Cognitive Restructuring', duration: 660, isCompleted: false },
      { id: 'lesson-3', title: 'Empowering Mindset Shifts', duration: 480, isCompleted: false },
      { id: 'lesson-4', title: 'Action Despite Fear', duration: 420, isCompleted: false }
    ],
    'leadership-fundamentals': [
      { id: 'lesson-1', title: 'Leadership vs Management', duration: 720, isCompleted: false },
      { id: 'lesson-2', title: 'Vision and Strategy', duration: 840, isCompleted: false },
      { id: 'lesson-3', title: 'Team Building Excellence', duration: 660, isCompleted: false },
      { id: 'lesson-4', title: 'Communication Mastery', duration: 780, isCompleted: false },
      { id: 'lesson-5', title: 'Decision Making Frameworks', duration: 600, isCompleted: false },
      { id: 'lesson-6', title: 'Conflict Resolution', duration: 540, isCompleted: false }
    ]
  };
  
  return lessonData[courseSlug] || [
    // Default lessons for courses without specific data
    { id: 'lesson-1', title: 'Introduction', duration: 600, isCompleted: false },
    { id: 'lesson-2', title: 'Core Concepts', duration: 720, isCompleted: false },
    { id: 'lesson-3', title: 'Advanced Techniques', duration: 840, isCompleted: false },
    { id: 'lesson-4', title: 'Practical Applications', duration: 660, isCompleted: false },
    { id: 'lesson-5', title: 'Next Steps', duration: 480, isCompleted: false }
  ];
}