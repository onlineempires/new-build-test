// Library-specific types for lesson progress and data structures
export type LessonProgress = {
  watchedPct: number; // 0..100
  completed: boolean;
  completedAt?: string;
};

export type LessonState = "completed" | "ready" | "locked";

export interface LibraryLesson {
  id: string;
  title: string;
  duration: number; // in seconds
  videoUrl?: string;
  description?: string;
  isLocked?: boolean;
  resources?: {
    title: string;
    url: string;
    type: 'pdf' | 'link' | 'download';
  }[];
  transcript?: string;
}

export interface LibraryCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  lessons: LibraryLesson[];
  type: 'course' | 'masterclass' | 'replay';
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface LibraryProgressResponse {
  watchedPct: number;
  completed: boolean;
  completedAt?: string;
}

export interface LibraryProgressRequest {
  userId: string;
  courseSlug: string;
  lessonSlug: string;
  watchedPct: number;
  completed: boolean;
  completedAt?: string;
}