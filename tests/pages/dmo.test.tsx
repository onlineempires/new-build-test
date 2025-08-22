import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock DMO logic functions
const checkPathUnlocked = (pathIndex: number, completedPaths: number[]): boolean => {
  // Path 1 is always unlocked
  if (pathIndex === 0) return true;
  
  // Subsequent paths require previous path completion
  return completedPaths.includes(pathIndex - 1);
};

const calculateDailyXPCap = (streak: number): number => {
  const baseXP = 100;
  const streakBonus = Math.min(streak * 10, 50); // Max 50 bonus XP
  return baseXP + streakBonus;
};

const checkXPCapReached = (dailyXP: number, cap: number): boolean => {
  return dailyXP >= cap;
};

const calculatePathProgress = (completedTasks: number, totalTasks: number): number => {
  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
};

describe('DMO Path Locking Logic', () => {
  describe('checkPathUnlocked', () => {
    it('should always unlock the first path', () => {
      expect(checkPathUnlocked(0, [])).toBe(true);
      expect(checkPathUnlocked(0, [1, 2])).toBe(true);
    });

    it('should unlock paths sequentially', () => {
      const completedPaths = [0];
      
      // Path 2 should be unlocked after completing path 1
      expect(checkPathUnlocked(1, completedPaths)).toBe(true);
      
      // Path 3 should be locked until path 2 is completed
      expect(checkPathUnlocked(2, completedPaths)).toBe(false);
      
      // After completing path 2
      completedPaths.push(1);
      expect(checkPathUnlocked(2, completedPaths)).toBe(true);
    });

    it('should handle non-sequential completion attempts', () => {
      const completedPaths: number[] = [];
      
      // Cannot unlock path 3 without completing paths 1 and 2
      expect(checkPathUnlocked(2, completedPaths)).toBe(false);
      
      // Complete path 1
      completedPaths.push(0);
      expect(checkPathUnlocked(2, completedPaths)).toBe(false);
      
      // Complete path 2
      completedPaths.push(1);
      expect(checkPathUnlocked(2, completedPaths)).toBe(true);
    });
  });

  describe('XP Cap System', () => {
    it('should calculate daily XP cap based on streak', () => {
      expect(calculateDailyXPCap(0)).toBe(100); // No streak
      expect(calculateDailyXPCap(1)).toBe(110); // 1 day streak
      expect(calculateDailyXPCap(3)).toBe(130); // 3 day streak
      expect(calculateDailyXPCap(5)).toBe(150); // 5 day streak (max bonus)
      expect(calculateDailyXPCap(10)).toBe(150); // 10 day streak (capped at max)
    });

    it('should detect when XP cap is reached', () => {
      const cap = 100;
      
      expect(checkXPCapReached(50, cap)).toBe(false);
      expect(checkXPCapReached(99, cap)).toBe(false);
      expect(checkXPCapReached(100, cap)).toBe(true);
      expect(checkXPCapReached(150, cap)).toBe(true);
    });

    it('should handle edge cases for XP calculations', () => {
      expect(calculateDailyXPCap(-1)).toBe(100); // Negative streak
      expect(calculateDailyXPCap(0.5)).toBe(105); // Fractional streak
      expect(calculateDailyXPCap(100)).toBe(150); // Very high streak
    });
  });

  describe('Path Progress Calculation', () => {
    it('should calculate progress percentage correctly', () => {
      expect(calculatePathProgress(0, 10)).toBe(0);
      expect(calculatePathProgress(5, 10)).toBe(50);
      expect(calculatePathProgress(10, 10)).toBe(100);
      expect(calculatePathProgress(3, 7)).toBe(43); // Rounded
    });

    it('should handle edge cases', () => {
      expect(calculatePathProgress(0, 0)).toBe(0); // No tasks
      expect(calculatePathProgress(5, 0)).toBe(0); // Division by zero
      expect(calculatePathProgress(-1, 10)).toBe(-10); // Negative completed
      expect(calculatePathProgress(15, 10)).toBe(150); // Over-completion
    });
  });

  describe('DMO Reset Mechanism', () => {
    it('should reset progress at midnight', () => {
      const mockDate = new Date('2024-01-15T23:59:59');
      const nextDay = new Date('2024-01-16T00:00:01');
      
      // Mock daily reset check
      const shouldReset = (lastActivity: Date, currentTime: Date): boolean => {
        return lastActivity.getDate() !== currentTime.getDate() ||
               lastActivity.getMonth() !== currentTime.getMonth() ||
               lastActivity.getFullYear() !== currentTime.getFullYear();
      };
      
      expect(shouldReset(mockDate, nextDay)).toBe(true);
      expect(shouldReset(mockDate, mockDate)).toBe(false);
    });

    it('should preserve streak if completed yesterday', () => {
      const yesterday = new Date('2024-01-14T15:00:00');
      const today = new Date('2024-01-15T10:00:00');
      const twoDaysAgo = new Date('2024-01-13T15:00:00');
      
      const maintainStreak = (lastCompletion: Date, currentDate: Date): boolean => {
        const diffMs = currentDate.getTime() - lastCompletion.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return diffDays === 1;
      };
      
      expect(maintainStreak(yesterday, today)).toBe(true);
      expect(maintainStreak(twoDaysAgo, today)).toBe(false);
    });
  });

  describe('Anti-Gaming Mechanisms', () => {
    it('should prevent rapid task completion', () => {
      const taskTimestamps: number[] = [];
      const MIN_TASK_DURATION = 5000; // 5 seconds minimum
      
      const isValidTaskCompletion = (lastTimestamp: number, currentTimestamp: number): boolean => {
        return currentTimestamp - lastTimestamp >= MIN_TASK_DURATION;
      };
      
      const now = Date.now();
      taskTimestamps.push(now);
      
      // Too fast - should be invalid
      expect(isValidTaskCompletion(now, now + 2000)).toBe(false);
      
      // Valid timing
      expect(isValidTaskCompletion(now, now + 6000)).toBe(true);
    });

    it('should limit XP gain per task', () => {
      const MAX_XP_PER_TASK = 25;
      
      const validateXPGain = (xp: number): number => {
        return Math.min(xp, MAX_XP_PER_TASK);
      };
      
      expect(validateXPGain(10)).toBe(10);
      expect(validateXPGain(25)).toBe(25);
      expect(validateXPGain(50)).toBe(25); // Capped
      expect(validateXPGain(100)).toBe(25); // Capped
    });

    it('should detect suspicious activity patterns', () => {
      const completionTimes = [
        1000, 1005, 1010, 1015, 1020, // Too regular - likely automated
      ];
      
      const detectSuspiciousPattern = (times: number[]): boolean => {
        if (times.length < 3) return false;
        
        const intervals: number[] = [];
        for (let i = 1; i < times.length; i++) {
          intervals.push(times[i] - times[i - 1]);
        }
        
        // Check if intervals are too consistent (variance < 2)
        const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / intervals.length;
        
        return variance < 2;
      };
      
      expect(detectSuspiciousPattern(completionTimes)).toBe(true);
      
      const legitimateTimes = [
        1000, 1087, 1203, 1290, 1456, // Natural variation
      ];
      expect(detectSuspiciousPattern(legitimateTimes)).toBe(false);
    });
  });
});