import { NextApiRequest, NextApiResponse } from 'next';
import { LessonProgress, CourseProgress } from '../../types/progress';

// Mock progress database - in production, use real database
const mockProgressDB: { [key: string]: CourseProgress } = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { course, lesson, userId = 'mock-user' } = req.query;
    
    if (!course) {
      return res.status(400).json({ error: 'Course slug required' });
    }

    const courseKey = `${userId}:${course}`;
    const courseProgress = mockProgressDB[courseKey] || {};

    if (lesson) {
      // Get specific lesson progress
      const lessonProgress = courseProgress[lesson as string] || {
        watchedPct: 0,
        completed: false
      };
      return res.status(200).json(lessonProgress);
    } else {
      // Get all course progress
      return res.status(200).json(courseProgress);
    }
  }

  if (req.method === 'POST') {
    const { userId = 'mock-user', courseSlug, lessonSlug, watchedPct, completed, completedAt } = req.body;

    if (!courseSlug || !lessonSlug) {
      return res.status(400).json({ error: 'Course and lesson slugs required' });
    }

    const courseKey = `${userId}:${courseSlug}`;
    if (!mockProgressDB[courseKey]) {
      mockProgressDB[courseKey] = {};
    }

    mockProgressDB[courseKey][lessonSlug] = {
      watchedPct: watchedPct || 0,
      completed: completed || false,
      ...(completedAt && { completedAt })
    };

    return res.status(200).json(mockProgressDB[courseKey][lessonSlug]);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}