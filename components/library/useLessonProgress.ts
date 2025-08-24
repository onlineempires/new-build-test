"use client";
import { useEffect, useState } from "react";
import type { LessonProgress } from "./types";

export function useLessonProgress(userId: string, courseSlug: string, lessonSlug: string) {
  const key = `lib:prog:${userId}:${courseSlug}:${lessonSlug}`;
  const [state, setState] = useState<LessonProgress>({ watchedPct: 0, completed: false });

  useEffect(() => {
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        setState(JSON.parse(cached));
      } catch (e) {
        console.warn('Failed to parse cached progress:', e);
      }
    }
    fetch(`/library/api/progress?course=${courseSlug}&lesson=${lessonSlug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setState(d))
      .catch(() => {
        // Silent fail, use cached data
      });
  }, [key, courseSlug, lessonSlug]);

  async function persist(next: LessonProgress) {
    setState(next); // optimistic
    localStorage.setItem(key, JSON.stringify(next));
    try {
      await fetch("/library/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseSlug, lessonSlug, ...next }),
      });
    } catch {
      // keep optimistic - could add retry logic here
    }
  }

  return {
    progress: state,
    setWatched: (pct: number) => persist({ ...state, watchedPct: pct }),
    setCompleted: (done: boolean) =>
      persist({ ...state, completed: done, completedAt: done ? new Date().toISOString() : undefined }),
  };
}