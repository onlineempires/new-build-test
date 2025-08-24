import { getCourseLessons } from '../utils/courseRouting';

export interface ResumeInfo {
  href: string;
  started: boolean;
}

export function getResumeHref(userId: string, courseSlug: string): ResumeInfo {
  const lessons = getCourseLessons(courseSlug);
  
  if (!lessons || lessons.length === 0) {
    return {
      href: `/library/learn/${courseSlug}/lesson/lesson-1`,
      started: false
    };
  }

  // Check localStorage for any completed lessons
  let hasProgress = false;
  let firstIncompleteLesson = lessons[0];

  for (const lesson of lessons) {
    const key = `lib:prog:${userId}:${courseSlug}:${lesson.id}`;
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const progress = JSON.parse(cached);
        if (progress.completed || progress.watchedPct > 0) {
          hasProgress = true;
        }
        if (!progress.completed && !firstIncompleteLesson.isCompleted) {
          firstIncompleteLesson = lesson;
          break;
        }
      }
    } catch (e) {
      // Skip invalid cache entries
    }
  }

  return {
    href: `/library/learn/${courseSlug}/lesson/${firstIncompleteLesson.id}`,
    started: hasProgress
  };
}