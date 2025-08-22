import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCachedCourseData,
  calculateUnifiedProgress,
  invalidateProgressCache,
} from '../../../lib/services/progressService';
import * as coursesApi from '../../../lib/api/courses';

// Mock the courses API
vi.mock('../../../lib/api/courses', () => ({
  loadProgressFromStorage: vi.fn(),
  getCurrentProgress: vi.fn(),
  getCurrentUserLevel: vi.fn(),
  getAllCourses: vi.fn(),
  calculateUserLevel: vi.fn(),
}));

describe('progressService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset module-level cache
    vi.resetModules();
    sessionStorage.clear();
    localStorage.clear();
  });

  describe('calculateUserLevel', () => {
    it('should calculate correct level for XP ranges', () => {
      const testCases = [
        { xp: 0, expected: { name: 'Beginner', number: 1, color: 'blue', xpToNext: 100 } },
        { xp: 50, expected: { name: 'Beginner', number: 1, color: 'blue', xpToNext: 50 } },
        { xp: 100, expected: { name: 'Apprentice', number: 2, color: 'green', xpToNext: 200 } },
        { xp: 300, expected: { name: 'Practitioner', number: 3, color: 'yellow', xpToNext: 200 } },
        { xp: 500, expected: { name: 'Specialist', number: 4, color: 'purple', xpToNext: 300 } },
        { xp: 800, expected: { name: 'Expert', number: 5, color: 'red', xpToNext: 400 } },
        { xp: 1200, expected: { name: 'Master', number: 6, color: 'indigo', xpToNext: 500 } },
        { xp: 1700, expected: { name: 'Grandmaster', number: 7, color: 'pink', xpToNext: 1000 } },
        { xp: 2700, expected: { name: 'Legend', number: 8, color: 'orange', xpToNext: 0 } },
      ];

      testCases.forEach(({ xp, expected }) => {
        const result = coursesApi.calculateUserLevel(xp);
        expect(result.name).toBe(expected.name);
        expect(result.number).toBe(expected.number);
        expect(result.color).toBe(expected.color);
        expect(result.xpToNext).toBe(expected.xpToNext);
      });
    });

    it('should handle negative XP values', () => {
      const result = coursesApi.calculateUserLevel(-100);
      expect(result.name).toBe('Beginner');
      expect(result.number).toBe(1);
      expect(result.totalXP).toBe(0);
    });

    it('should calculate progress percentage correctly', () => {
      const result = coursesApi.calculateUserLevel(150);
      expect(result.progress).toBe(25); // 50/200 = 25%
    });
  });

  describe('getCachedCourseData', () => {
    it('should fetch fresh data when cache is empty', async () => {
      const mockCourseData = {
        courses: [
          { id: 'course1', title: 'Test Course', totalLessons: 10 }
        ],
        totalLessons: 10,
        completedLessons: 5,
      };

      vi.mocked(coursesApi.getAllCourses).mockResolvedValue(mockCourseData);

      const result = await getCachedCourseData();
      expect(result).toEqual(mockCourseData);
      expect(coursesApi.getAllCourses).toHaveBeenCalledTimes(1);
    });

    it('should use cached data within cache duration', async () => {
      const mockCourseData = {
        courses: [
          { id: 'course1', title: 'Test Course', totalLessons: 10 }
        ],
        totalLessons: 10,
        completedLessons: 5,
      };

      vi.mocked(coursesApi.getAllCourses).mockResolvedValue(mockCourseData);

      // First call
      await getCachedCourseData();
      // Second call within cache duration
      await getCachedCourseData();

      expect(coursesApi.getAllCourses).toHaveBeenCalledTimes(1);
    });

    it('should refresh cache when forceRefresh is true', async () => {
      const mockCourseData = {
        courses: [],
        totalLessons: 0,
        completedLessons: 0,
      };

      vi.mocked(coursesApi.getAllCourses).mockResolvedValue(mockCourseData);

      // First call
      await getCachedCourseData();
      // Force refresh
      await getCachedCourseData(true);

      expect(coursesApi.getAllCourses).toHaveBeenCalledTimes(2);
    });

    it('should refresh cache when invalidation flag is set', async () => {
      const mockCourseData = {
        courses: [],
        totalLessons: 0,
        completedLessons: 0,
      };

      vi.mocked(coursesApi.getAllCourses).mockResolvedValue(mockCourseData);

      // First call
      await getCachedCourseData();
      
      // Set invalidation flag
      sessionStorage.setItem('progressCacheInvalidated', 'true');
      
      // Second call should refresh due to invalidation
      await getCachedCourseData();

      expect(coursesApi.getAllCourses).toHaveBeenCalledTimes(2);
      expect(sessionStorage.getItem('progressCacheInvalidated')).toBeNull();
    });
  });

  describe('calculateUnifiedProgress', () => {
    it('should calculate unified progress correctly', async () => {
      const mockCourseData = {
        courses: [
          { id: 'course1', title: 'Course 1', totalLessons: 10, completedLessons: 5 },
          { id: 'course2', title: 'Course 2', totalLessons: 20, completedLessons: 10 },
        ],
        totalLessons: 30,
        completedLessons: 15,
      };

      const mockProgress = {
        completedLessons: ['lesson1', 'lesson2'],
        xp: 250,
      };

      const mockUserLevel = {
        name: 'Apprentice',
        number: 2,
        color: 'green',
        totalXP: 250,
      };

      vi.mocked(coursesApi.getAllCourses).mockResolvedValue(mockCourseData);
      vi.mocked(coursesApi.getCurrentProgress).mockResolvedValue(mockProgress);
      vi.mocked(coursesApi.getCurrentUserLevel).mockResolvedValue(mockUserLevel);

      const result = await calculateUnifiedProgress();

      expect(result.completedCourses).toBe(0); // No fully completed courses
      expect(result.totalCourses).toBe(2);
      expect(result.totalXP).toBe(250);
      expect(result.currentLevel).toEqual(mockUserLevel);
      expect(result.progressPercent).toBe(50); // 15/30 = 50%
      expect(result.completedLessons).toEqual(['lesson1', 'lesson2']);
    });

    it('should handle empty course data', async () => {
      const mockCourseData = {
        courses: [],
        totalLessons: 0,
        completedLessons: 0,
      };

      vi.mocked(coursesApi.getAllCourses).mockResolvedValue(mockCourseData);
      vi.mocked(coursesApi.getCurrentProgress).mockResolvedValue({ completedLessons: [], xp: 0 });
      vi.mocked(coursesApi.getCurrentUserLevel).mockResolvedValue({
        name: 'Beginner',
        number: 1,
        color: 'blue',
        totalXP: 0,
      });

      const result = await calculateUnifiedProgress();

      expect(result.completedCourses).toBe(0);
      expect(result.totalCourses).toBe(0);
      expect(result.totalXP).toBe(0);
      expect(result.progressPercent).toBe(0);
    });
  });

  describe('invalidateProgressCache', () => {
    it('should set invalidation flag in sessionStorage', () => {
      invalidateProgressCache();
      expect(sessionStorage.getItem('progressCacheInvalidated')).toBe('true');
    });
  });
});