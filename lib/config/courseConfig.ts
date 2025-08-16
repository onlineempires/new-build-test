// Course Configuration for Admin Control
// This file allows easy management of course priorities and new user experience

export const COURSE_CONFIG = {
  // Primary "Start Here" course for new users
  // Change this ID to modify which course new users see first
  PRIMARY_START_COURSE_ID: 'business-blueprint',
  
  // Alternative start courses (in priority order)
  // If primary course is not available, system will use these in order
  FALLBACK_START_COURSES: [
    'discovery-process',
    'next-steps'
  ],
  
  // New user messaging
  NEW_USER_MESSAGES: {
    welcomeTitle: 'Start Your Journey',
    continueButtonText: 'Start Your Journey',
    continueButtonIcon: 'fas fa-rocket'
  },
  
  // Returning user messaging
  RETURNING_USER_MESSAGES: {
    continueButtonText: 'Continue Learning',
    continueButtonIcon: 'fas fa-play'
  },
  
  // Completed course messaging
  COMPLETED_COURSE_MESSAGES: {
    moduleTitle: 'Course Completed! 🎉',
    lessonTitle: 'Choose your next adventure',
    continueButtonText: 'Choose Next Course',
    continueButtonIcon: 'fas fa-graduation-cap'
  }
};

// Helper function to get the primary start course by priority
export const getPrimaryStartCourseId = (): string => {
  return COURSE_CONFIG.PRIMARY_START_COURSE_ID;
};

// Helper function to get all start course IDs in priority order
export const getStartCoursePriority = (): string[] => {
  return [
    COURSE_CONFIG.PRIMARY_START_COURSE_ID,
    ...COURSE_CONFIG.FALLBACK_START_COURSES
  ];
};