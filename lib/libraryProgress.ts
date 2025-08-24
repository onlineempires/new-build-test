import { getCourseLessons } from '../utils/courseRouting';

export interface ResumeInfo {
  href: string;
  started: boolean;
}

export interface LibraryCourse {
  slug: string;
  title: string;
  summary: string;
  durationLabel: string; // "48 minutes"
  imageUrl: string;
  isNew?: boolean;
  lessons: { slug: string }[];
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

// Enhanced version for hover preview - supports LibraryItem and LibraryCourse
export function getResumeForCourse(userId: string, course: LibraryCourse | any) {
  // Read localStorage or call existing progress API:
  // key: lib:prog:${userId}:${course.slug} -> { lastLessonSlug?: string }
  const saved = typeof window !== "undefined"
    ? localStorage.getItem(`lib:prog:${userId}:${course.slug}`)
    : null;

  const lastData = saved ? JSON.parse(saved) : null;
  const lastLessonSlug = lastData?.lastLessonSlug;
  
  // If we have lessons array, use it; otherwise fallback
  const lessons = course.lessons || [];
  const lessonSlug = lastLessonSlug || lessons?.[0]?.slug || "lesson-1";
  const started = Boolean(lastLessonSlug);

  return {
    href: `/learn/${course.slug}/lesson/${lessonSlug}`.toLowerCase(),
    started,
    label: started ? "Continue course" : "Watch now",
  };
}