import { NextRequest, NextResponse } from 'next/server';
import type { LibraryProgressRequest, LibraryProgressResponse } from '../../../../components/library/types';

// In-memory storage for demo purposes - in production, use a database
const progressStore: Map<string, LibraryProgressResponse> = new Map();

function getProgressKey(userId: string, courseSlug: string, lessonSlug: string): string {
  return `${userId}:${courseSlug}:${lessonSlug}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const course = searchParams.get('course');
  const lesson = searchParams.get('lesson');
  const userId = searchParams.get('userId') || 'mock-user';

  if (!course || !lesson) {
    return NextResponse.json({ error: 'Missing course or lesson parameter' }, { status: 400 });
  }

  const key = getProgressKey(userId, course, lesson);
  const progress = progressStore.get(key) || { watchedPct: 0, completed: false };

  return NextResponse.json(progress);
}

export async function POST(request: NextRequest) {
  try {
    const body: LibraryProgressRequest = await request.json();
    const { userId, courseSlug, lessonSlug, watchedPct, completed, completedAt } = body;

    if (!userId || !courseSlug || !lessonSlug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const key = getProgressKey(userId, courseSlug, lessonSlug);
    const progress: LibraryProgressResponse = {
      watchedPct,
      completed,
      completedAt: completed ? (completedAt || new Date().toISOString()) : undefined,
    };

    progressStore.set(key, progress);

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Failed to save progress:', error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}