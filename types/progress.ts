export type LessonKey = { 
  userId: string; 
  courseSlug: string; 
  lessonSlug: string 
};

export type LessonProgress = { 
  watchedPct: number; 
  completed: boolean; 
  completedAt?: string 
};

export type CourseProgress = {
  [lessonSlug: string]: LessonProgress;
};