import { useState, useEffect } from 'react';
import { useUserRole } from '../contexts/UserRoleContext';

interface UserFlags {
  pressedNotReadyInBLB?: boolean;
  pressedNotReadyTimestamp?: number;
}

interface CourseProgress {
  [courseId: string]: {
    status: 'not_started' | 'in_progress' | 'completed';
    completedLessons: number;
    totalLessons: number;
    progress: number;
  };
}

interface CourseGatingState {
  isTrial: boolean;
  hasPressedNotReady: boolean;
  businessBlueprintDone: boolean;
  canAccessDiscovery: boolean;
  canAccessNextSteps: boolean;
  userFlags: UserFlags;
  progress: CourseProgress;
}

export function useCourseGating(): CourseGatingState & {
  setNotReadyFlag: () => void;
  updateProgress: (courseId: string, progress: any) => void;
  resetGatingState: () => void;
} {
  const { currentRole } = useUserRole();
  const [userFlags, setUserFlags] = useState<UserFlags>({});
  const [progress, setProgress] = useState<CourseProgress>({});

  // Load state from localStorage on mount
  useEffect(() => {
    // Load user flags
    const storedFlags = localStorage.getItem('userFlags');
    if (storedFlags) {
      try {
        setUserFlags(JSON.parse(storedFlags));
      } catch (e) {
        console.warn('Failed to parse stored user flags');
      }
    }

    // Load course progress
    const storedProgress = localStorage.getItem('courseProgress');
    if (storedProgress) {
      try {
        setProgress(JSON.parse(storedProgress));
      } catch (e) {
        console.warn('Failed to parse stored course progress');
      }
    }
  }, []);

  // Define helper booleans based on user state and progress
  const isTrial = currentRole === 'free' || currentRole === 'trial';
  const hasPressedNotReady = userFlags.pressedNotReadyInBLB === true;
  const businessBlueprintDone = progress['business-blueprint']?.status === 'completed';
  
  // Gating logic - CRITICAL: Only apply progression locks to trial users
  // Premium members (monthly/annual) get immediate access to ALL courses without progression requirements
  // Only free trial + $1 trial users should progress step by step
  const isPremiumMember = currentRole === 'monthly' || currentRole === 'annual';
  const canAccessDiscovery = isPremiumMember || businessBlueprintDone || hasPressedNotReady;
  const canAccessNextSteps = isPremiumMember || businessBlueprintDone;

  // Function to set the "Not Ready Yet" flag
  const setNotReadyFlag = () => {
    const newFlags = {
      ...userFlags,
      pressedNotReadyInBLB: true,
      pressedNotReadyTimestamp: Date.now()
    };
    setUserFlags(newFlags);
    localStorage.setItem('userFlags', JSON.stringify(newFlags));
  };

  // Function to update course progress
  const updateProgress = (courseId: string, courseProgress: any) => {
    const newProgress = {
      ...progress,
      [courseId]: courseProgress
    };
    setProgress(newProgress);
    localStorage.setItem('courseProgress', JSON.stringify(newProgress));
  };

  // Function to reset all gating state for testing
  const resetGatingState = () => {
    setUserFlags({});
    setProgress({});
    localStorage.removeItem('userFlags');
    localStorage.removeItem('courseProgress');
    
    // Also clear all course progress from the courses API
    localStorage.removeItem('learningProgress');
    
    // Clear any cached course data
    sessionStorage.removeItem('fastStatsCache');
    sessionStorage.setItem('progressCacheInvalidated', Date.now().toString());
    
    // Trigger a page reload to refresh all components with reset data
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return {
    isTrial,
    hasPressedNotReady,
    businessBlueprintDone,
    canAccessDiscovery,
    canAccessNextSteps,
    userFlags,
    progress,
    setNotReadyFlag,
    updateProgress,
    resetGatingState
  };
}