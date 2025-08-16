import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUserRole } from './UserRoleContext';

// Course categories for access control
export type CourseCategory = 'start-here' | 'all-access' | 'masterclass' | 'free-intro';

// Course access configuration
export interface CourseAccessConfig {
  courseId: string;
  category: CourseCategory;
  adminOverride?: {
    allowedRoles: string[]; // Roles that can access despite normal restrictions
    isOverridden: boolean;
  };
}

// Default course configurations
const DEFAULT_COURSE_ACCESS: CourseAccessConfig[] = [
  // Start Here courses - available to trial members
  { courseId: 'business-blueprint', category: 'start-here' },
  { courseId: 'discovery-process', category: 'start-here' },
  { courseId: 'next-steps', category: 'start-here' },
  
  // All Access courses - require monthly/annual membership
  { courseId: 'tiktok-mastery', category: 'all-access' },
  { courseId: 'facebook-advertising', category: 'all-access' },
  { courseId: 'instagram-marketing', category: 'all-access' },
  { courseId: 'sales-funnel-mastery', category: 'all-access' },
  { courseId: 'email-marketing-secrets', category: 'all-access' },
  { courseId: 'content-creation-system', category: 'all-access' },
  { courseId: 'conversion-optimization', category: 'all-access' },
  { courseId: 'traffic-generation', category: 'all-access' },
  
  // Masterclasses - separate purchase required
  { courseId: 'advanced-copywriting-masterclass', category: 'masterclass' },
  { courseId: 'scaling-systems-masterclass', category: 'masterclass' },
  
  // Free intro courses - available to all
  { courseId: 'welcome-orientation', category: 'free-intro' },
];

interface CourseAccessContextType {
  courseConfigs: CourseAccessConfig[];
  canAccessCourse: (courseId: string) => boolean;
  getCourseUpgradeMessage: (courseId: string) => string;
  updateCourseAccess: (courseId: string, config: Partial<CourseAccessConfig>) => void;
  getAccessibleCourses: () => string[];
  getRestrictedMessage: (courseId: string) => { title: string; message: string; upgradeRequired: boolean };
}

const CourseAccessContext = createContext<CourseAccessContextType | undefined>(undefined);

interface CourseAccessProviderProps {
  children: ReactNode;
}

export function CourseAccessProvider({ children }: CourseAccessProviderProps) {
  const { currentRole, permissions } = useUserRole();
  const [courseConfigs, setCourseConfigs] = useState<CourseAccessConfig[]>(DEFAULT_COURSE_ACCESS);

  // Load admin overrides from localStorage
  useEffect(() => {
    const savedOverrides = localStorage.getItem('courseAccessOverrides');
    if (savedOverrides) {
      try {
        const overrides = JSON.parse(savedOverrides);
        setCourseConfigs(prev => prev.map(config => {
          const override = overrides.find((o: any) => o.courseId === config.courseId);
          return override ? { ...config, adminOverride: override.adminOverride } : config;
        }));
      } catch (error) {
        console.error('Error loading course access overrides:', error);
      }
    }
  }, []);

  const canAccessCourse = (courseId: string): boolean => {
    const config = courseConfigs.find(c => c.courseId === courseId);
    
    // If no config found, default to normal role-based access
    if (!config) {
      return permissions.canAccessAllCourses || permissions.canAccessIntroVideos;
    }

    // Check admin override first
    if (config.adminOverride?.isOverridden && config.adminOverride.allowedRoles.includes(currentRole)) {
      return true;
    }

    // Admin can access everything
    if (permissions.isAdmin) {
      return true;
    }

    // Check category-based access
    switch (config.category) {
      case 'free-intro':
        return true; // Everyone can access free intro courses
      
      case 'start-here':
        // Free and trial members can access Start Here courses, plus all higher tiers
        return permissions.canAccessStartHereOnly || permissions.canAccessAllCourses;
      
      case 'all-access':
        // Only monthly/annual members can access all-access courses
        return permissions.canAccessAllCourses;
      
      case 'masterclass':
        // Masterclasses require separate purchase or admin access
        return permissions.canAccessMasterclasses;
      
      default:
        return false;
    }
  };

  const getCourseUpgradeMessage = (courseId: string): string => {
    const config = courseConfigs.find(c => c.courseId === courseId);
    
    if (!config) return 'Upgrade to access this course';

    switch (config.category) {
      case 'start-here':
        if (currentRole === 'free') {
          return 'Start your $1 trial to access Start Here courses';
        }
        return 'Upgrade to Monthly ($99) or Annual ($799) to unlock all courses';
      
      case 'all-access':
        if (currentRole === 'free' || currentRole === 'trial') {
          return 'Upgrade to Monthly ($99) or Annual ($799) to unlock all courses';
        }
        return 'This course is included in your membership';
      
      case 'masterclass':
        return 'Purchase this masterclass separately';
      
      default:
        return 'Upgrade to access this course';
    }
  };

  const getRestrictedMessage = (courseId: string) => {
    const config = courseConfigs.find(c => c.courseId === courseId);
    
    if (!config) {
      return {
        title: 'Course Locked',
        message: 'Upgrade your membership to access this course',
        upgradeRequired: true
      };
    }

    switch (config.category) {
      case 'start-here':
        if (currentRole === 'free') {
          return {
            title: 'Start Your Journey',
            message: 'Begin with our $1 trial to access the Start Here courses and see what we\'re all about.',
            upgradeRequired: true
          };
        }
        return {
          title: 'Unlock All Courses',
          message: 'Upgrade to Monthly or Annual membership to access all courses beyond Start Here.',
          upgradeRequired: true
        };
      
      case 'all-access':
        return {
          title: 'Premium Content',
          message: 'This course is part of our premium collection. Upgrade to Monthly ($99) or Annual ($799) to unlock all courses.',
          upgradeRequired: true
        };
      
      case 'masterclass':
        return {
          title: 'Premium Masterclass',
          message: 'This masterclass requires a separate purchase. Each masterclass is an intensive deep-dive session.',
          upgradeRequired: false // Different purchase flow
        };
      
      default:
        return {
          title: 'Course Locked',
          message: 'Upgrade your membership to access this course',
          upgradeRequired: true
        };
    }
  };

  const updateCourseAccess = (courseId: string, update: Partial<CourseAccessConfig>) => {
    setCourseConfigs(prev => {
      const updated = prev.map(config => 
        config.courseId === courseId ? { ...config, ...update } : config
      );
      
      // Save admin overrides to localStorage
      const overrides = updated
        .filter(config => config.adminOverride?.isOverridden)
        .map(config => ({ courseId: config.courseId, adminOverride: config.adminOverride }));
      
      localStorage.setItem('courseAccessOverrides', JSON.stringify(overrides));
      
      return updated;
    });
  };

  const getAccessibleCourses = (): string[] => {
    return courseConfigs
      .filter(config => canAccessCourse(config.courseId))
      .map(config => config.courseId);
  };

  return (
    <CourseAccessContext.Provider
      value={{
        courseConfigs,
        canAccessCourse,
        getCourseUpgradeMessage,
        updateCourseAccess,
        getAccessibleCourses,
        getRestrictedMessage,
      }}
    >
      {children}
    </CourseAccessContext.Provider>
  );
}

export function useCourseAccess() {
  const context = useContext(CourseAccessContext);
  if (context === undefined) {
    throw new Error('useCourseAccess must be used within a CourseAccessProvider');
  }
  return context;
}