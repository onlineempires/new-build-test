import { useUser } from '../contexts/UserContext';

// Section definitions matching the specification
export interface CourseSection {
  id: number;
  name: string;
  description: string;
  audience: string;
  accessRule: string;
}

export const COURSE_SECTIONS: CourseSection[] = [
  {
    id: 1,
    name: 'Start Here - Foundation Training',
    description: 'Essential courses to build your online business foundation',
    audience: 'Free and $1 users only',
    accessRule: 'Users must watch lessons in order'
  },
  {
    id: 2,
    name: 'Advanced Training',
    description: 'Specialized courses for scaling your business',
    audience: '$99 per month and $799 per year members',
    accessRule: 'Premium members get all Section 2 courses plus all of Section 1 unlocked'
  },
  {
    id: 3,
    name: 'Masterclass Training',
    description: 'Premium courses for advanced business growth',
    audience: 'A la carte purchase by anyone',
    accessRule: 'Everyone can see these cards. Individual purchase required.'
  }
];

// Course mapping to sections
export const COURSE_SECTION_MAPPING: Record<string, number> = {
  // Section 1 - Start Here Foundation
  'business-blueprint': 1,
  'discovery-process': 1,
  'next-steps': 1,
  
  // Section 2 - Advanced Training  
  'tiktok-mastery': 2,
  'facebook-advertising': 2,
  'instagram-marketing': 2,
  'sales-funnel-mastery': 2,
  'email-marketing-secrets': 2,
  
  // Section 3 - Masterclass Training
  'advanced-copywriting-masterclass': 3,
  'scaling-systems-masterclass': 3,
};

export interface SectionGatingResult {
  isLocked: boolean;
  lockedReason: string;
  lockTitle: string;
  lockSubtext: string;
  showUpgradeCTA: boolean;
  upgradeText: string;
  upgradeAction: 'premium' | 'masterclass' | null;
}

export function useSectionGating() {
  const { user, roleFlags, sectionAccess, canAccessCourse, hasPurchasedMasterclass } = useUser();

  const getSectionForCourse = (courseId: string): number => {
    return COURSE_SECTION_MAPPING[courseId] || 1;
  };

  const getCourseGatingStatus = (courseId: string): SectionGatingResult => {
    const section = getSectionForCourse(courseId);
    
    switch (section) {
      case 1: // Section 1 - Start Here Foundation
        return getSection1GatingStatus(courseId);
      
      case 2: // Section 2 - Advanced Training
        return getSection2GatingStatus(courseId);
      
      case 3: // Section 3 - Masterclass Training  
        return getSection3GatingStatus(courseId);
      
      default:
        return {
          isLocked: true,
          lockedReason: 'Unknown section',
          lockTitle: 'Course Locked',
          lockSubtext: 'Contact support',
          showUpgradeCTA: false,
          upgradeText: '',
          upgradeAction: null
        };
    }
  };

  const getSection1GatingStatus = (courseId: string): SectionGatingResult => {
    // Section 1 logic: progression-based unlocking
    if (courseId === 'business-blueprint') {
      // Always accessible
      return {
        isLocked: false,
        lockedReason: '',
        lockTitle: '',
        lockSubtext: '',
        showUpgradeCTA: false,
        upgradeText: '',
        upgradeAction: null
      };
    }

    if (courseId === 'discovery-process' || courseId === 'next-steps') {
      const isUnlocked = user.completedCourses.includes('business-blueprint') || user.pressedNotReadyInBLB;
      
      if (isUnlocked) {
        return {
          isLocked: false,
          lockedReason: '',
          lockTitle: '',
          lockSubtext: '',
          showUpgradeCTA: false,
          upgradeText: '',
          upgradeAction: null
        };
      }

      return {
        isLocked: true,
        lockedReason: 'sequence',
        lockTitle: 'Course Locked',
        lockSubtext: 'Complete Blueprint or choose "Continue Learning" to unlock after previous module.',
        showUpgradeCTA: false,
        upgradeText: '',
        upgradeAction: null
      };
    }

    // Default for unknown Section 1 courses
    return {
      isLocked: false,
      lockedReason: '',
      lockTitle: '',
      lockSubtext: '',
      showUpgradeCTA: false,
      upgradeText: '',
      upgradeAction: null
    };
  };

  const getSection2GatingStatus = (courseId: string): SectionGatingResult => {
    // Section 2 logic: Premium membership required
    if (roleFlags.isPremium) {
      return {
        isLocked: false,
        lockedReason: '',
        lockTitle: '',
        lockSubtext: '',
        showUpgradeCTA: false,
        upgradeText: '',
        upgradeAction: null
      };
    }

    if (roleFlags.roleTrial) {
      return {
        isLocked: true,
        lockedReason: 'premium_required',
        lockTitle: 'Course Locked',
        lockSubtext: 'Upgrade to unlock all included courses.',
        showUpgradeCTA: true,
        upgradeText: 'Upgrade to Unlock',
        upgradeAction: 'premium'
      };
    }

    return {
      isLocked: true,
      lockedReason: 'premium_required',
      lockTitle: 'Course Locked',
      lockSubtext: 'Premium membership required for advanced training.',
      showUpgradeCTA: true,
      upgradeText: 'Upgrade to Unlock',
      upgradeAction: 'premium'
    };
  };

  const getSection3GatingStatus = (courseId: string): SectionGatingResult => {
    // Section 3 logic: Individual masterclass purchase
    if (hasPurchasedMasterclass(courseId)) {
      return {
        isLocked: false,
        lockedReason: '',
        lockTitle: '',
        lockSubtext: '',
        showUpgradeCTA: false,
        upgradeText: '',
        upgradeAction: null
      };
    }

    return {
      isLocked: true,
      lockedReason: 'masterclass_purchase',
      lockTitle: 'Course Locked',
      lockSubtext: 'Purchase this masterclass to unlock.',
      showUpgradeCTA: true,
      upgradeText: 'Buy Masterclass',
      upgradeAction: 'masterclass'
    };
  };

  const getLessonGatingStatus = (lessonId: string, courseId: string): SectionGatingResult => {
    // For now, simplified lesson gating - if course is accessible, lessons are too
    // Full implementation would handle lesson-by-lesson progression
    const courseGating = getCourseGatingStatus(courseId);
    
    if (!courseGating.isLocked) {
      return {
        isLocked: false,
        lockedReason: '',
        lockTitle: '',
        lockSubtext: '',
        showUpgradeCTA: false,
        upgradeText: '',
        upgradeAction: null
      };
    }

    return {
      isLocked: true,
      lockedReason: 'lesson_sequence',
      lockTitle: 'Lesson Locked',
      lockSubtext: 'Complete the previous lesson to continue.',
      showUpgradeCTA: false,
      upgradeText: '',
      upgradeAction: null
    };
  };

  const getUpgradeButtonText = (courseId: string): string => {
    const section = getSectionForCourse(courseId);
    const gating = getCourseGatingStatus(courseId);

    if (!gating.showUpgradeCTA) return '';

    switch (gating.upgradeAction) {
      case 'premium':
        return 'Upgrade to Unlock';
      case 'masterclass':
        return 'Buy Masterclass';
      default:
        return 'Upgrade to Unlock';
    }
  };

  const getSectionAccess = (sectionId: number): boolean => {
    switch (sectionId) {
      case 1:
        return sectionAccess.section1;
      case 2:
        return sectionAccess.section2;
      case 3:
        return sectionAccess.section3;
      default:
        return false;
    }
  };

  return {
    // Core gating functions
    getCourseGatingStatus,
    getLessonGatingStatus,
    getSectionForCourse,
    getSectionAccess,
    getUpgradeButtonText,
    
    // User state
    user,
    roleFlags,
    sectionAccess,
    
    // Section definitions
    COURSE_SECTIONS,
    COURSE_SECTION_MAPPING,
  };
}