import { useState, useEffect } from 'react';
import { LessonProgress } from '../types/progress';

// Mock auth hook - in production, get from real auth context
const useAuth = () => ({ userId: 'mock-user' });

export function useLessonProgress(courseSlug: string, lessonSlug: string) {
  const { userId } = useAuth();
  const key = `prog:${userId}:${courseSlug}:${lessonSlug}`;
  const [progress, setProgress] = useState<LessonProgress>({ 
    watchedPct: 0, 
    completed: false 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseSlug || !lessonSlug) return;

    // Load from localStorage first for immediate UI feedback
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        const cachedProgress = JSON.parse(cached);
        setProgress(cachedProgress);
      } catch (e) {
        console.warn('Failed to parse cached progress:', e);
      }
    }

    // Then fetch from server to sync
    fetch(`/api/progress?course=${courseSlug}&lesson=${lessonSlug}&userId=${userId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setProgress(data);
          localStorage.setItem(key, JSON.stringify(data));
        }
      })
      .catch(err => {
        console.warn('Failed to fetch progress:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [key, courseSlug, lessonSlug, userId]);

  async function persist(next: LessonProgress) {
    const prevProgress = progress;
    
    // Optimistic update
    setProgress(next);
    localStorage.setItem(key, JSON.stringify(next));

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId, 
          courseSlug, 
          lessonSlug, 
          ...next 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save progress');
      }

      const savedProgress = await response.json();
      setProgress(savedProgress);
      localStorage.setItem(key, JSON.stringify(savedProgress));

      // Emit completion event if completed
      if (next.completed && !prevProgress.completed) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('learn_lesson_completed', {
            detail: {
              courseSlug,
              lessonSlug,
              userId,
              timestamp: new Date().toISOString()
            }
          }));
        }
      }
    } catch (error) {
      console.warn('Progress save failed, keeping optimistic state:', error);
      // We keep the optimistic state but could add retry logic here
    }
  }

  return {
    progress,
    loading,
    setWatchedPct: (pct: number) => persist({ 
      ...progress, 
      watchedPct: pct 
    }),
    toggleCompleted: (done: boolean) => persist({ 
      ...progress, 
      completed: done, 
      completedAt: done ? new Date().toISOString() : undefined 
    }),
  };
}