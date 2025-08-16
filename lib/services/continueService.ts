import { getCachedCourseData } from './progressService';
import { Course, getCurrentProgress, loadProgressFromStorage } from '../api/courses';
import { getStartCoursePriority, COURSE_CONFIG } from '../config/courseConfig';

export interface ContinueData {
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  progressPercent: number;
  href: string;
  thumbnailUrl?: string;
  isNewUser?: boolean;
  courseId: string;
  moduleId: string;
  lessonId: string;
}

// Find the next lesson to continue from
const findNextLesson = (course: Course) => {
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      if (!lesson.isCompleted) {
        return {
          lesson,
          module,
          moduleIndex: course.modules.indexOf(module),
          lessonIndex: module.lessons.indexOf(lesson)
        };
      }
    }
  }
  return null; // Course is completed
};

// Calculate the progress percentage for a course
const calculateCourseProgress = (course: Course) => {
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = course.modules.reduce((acc, module) => 
    acc + module.lessons.filter(lesson => lesson.isCompleted).length, 0
  );
  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
};

// Find the first incomplete course based on priority order
const findFirstIncompleteCourse = (startHereCourses: Course[], socialMediaCourses: Course[]) => {
  const priorityOrder = getStartCoursePriority();
  
  // First, check Start Here courses in priority order
  for (const courseId of priorityOrder) {
    const course = startHereCourses.find(c => c.id === courseId);
    if (course) {
      const progress = calculateCourseProgress(course);
      // Return first course that is not 100% complete
      if (progress < 100) {
        return course;
      }
    }
  }
  
  // If all Start Here courses are completed, check remaining Start Here courses
  for (const course of startHereCourses) {
    if (!priorityOrder.includes(course.id)) {
      const progress = calculateCourseProgress(course);
      if (progress < 100) {
        return course;
      }
    }
  }
  
  // Finally, check Social Media courses
  for (const course of socialMediaCourses) {
    const progress = calculateCourseProgress(course);
    if (progress < 100) {
      return course;
    }
  }
  
  return null; // All courses completed
};

// Get the first "Start Here" course for new users based on configuration
const getFirstStartHereCourse = (startHereCourses: Course[]) => {
  const priorityOrder = getStartCoursePriority();
  
  // Find course by priority order
  for (const courseId of priorityOrder) {
    const course = startHereCourses.find(c => c.id === courseId);
    if (course) {
      return course;
    }
  }
  
  // Fallback to first available course
  return startHereCourses.length > 0 ? startHereCourses[0] : null;
};

export const getContinueData = async (): Promise<ContinueData | null> => {
  try {
    // Load progress and course data
    loadProgressFromStorage();
    const progress = getCurrentProgress();
    const courseData = await getCachedCourseData();
    
    const allCourses = [...courseData.startHereCourses, ...courseData.socialMediaCourses];
    
    // Check if user has any progress at all
    const hasAnyProgress = progress.completedLessons.length > 0;
    
    let targetCourse: Course | null = null;
    let isNewUser = false;
    
    // Always show the first incomplete course based on priority order
    // This ensures proper learning progression
    targetCourse = findFirstIncompleteCourse(courseData.startHereCourses, courseData.socialMediaCourses);
    
    // If no incomplete course found (all completed), show first course
    if (!targetCourse) {
      targetCourse = getFirstStartHereCourse(courseData.startHereCourses);
    }
    
    // Determine if user is new (no progress at all)
    isNewUser = !hasAnyProgress;
    
    if (!targetCourse) {
      return null; // No courses available
    }
    
    const courseProgress = calculateCourseProgress(targetCourse);
    
    if (isNewUser || courseProgress === 0) {
      // New user or no progress - show first lesson of first module
      const firstModule = targetCourse.modules[0];
      const firstLesson = firstModule?.lessons[0];
      
      if (!firstModule || !firstLesson) {
        return null;
      }
      
      return {
        courseTitle: targetCourse.title,
        moduleTitle: firstModule.title,
        lessonTitle: firstLesson.title,
        progressPercent: 0,
        href: `/courses/${targetCourse.id}/${firstLesson.id}`,
        thumbnailUrl: targetCourse.thumbnailUrl,
        isNewUser: true,
        courseId: targetCourse.id,
        moduleId: firstModule.id,
        lessonId: firstLesson.id
      };
    } else {
      // Existing user with progress - find next lesson
      const nextLessonData = findNextLesson(targetCourse);
      
      if (!nextLessonData) {
        // Course is completed - show celebration and next course option
        return {
          courseTitle: targetCourse.title,
          moduleTitle: COURSE_CONFIG.COMPLETED_COURSE_MESSAGES.moduleTitle,
          lessonTitle: COURSE_CONFIG.COMPLETED_COURSE_MESSAGES.lessonTitle,
          progressPercent: 100,
          href: `/courses`,
          thumbnailUrl: targetCourse.thumbnailUrl,
          isNewUser: false,
          courseId: targetCourse.id,
          moduleId: '',
          lessonId: ''
        };
      }
      
      return {
        courseTitle: targetCourse.title,
        moduleTitle: nextLessonData.module.title,
        lessonTitle: nextLessonData.lesson.title,
        progressPercent: courseProgress,
        href: `/courses/${targetCourse.id}/${nextLessonData.lesson.id}`,
        thumbnailUrl: targetCourse.thumbnailUrl,
        isNewUser: false,
        courseId: targetCourse.id,
        moduleId: nextLessonData.module.id,
        lessonId: nextLessonData.lesson.id
      };
    }
    
  } catch (error) {
    console.error('Error getting continue data:', error);
    return null;
  }
};