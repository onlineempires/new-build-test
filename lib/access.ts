/**
 * CENTRALIZED ACCESS CONTROL - Single Source of Truth
 * 
 * BUSINESS RULES MATRIX:
 * ┌─────────────┬─────────────────┬─────────────────┬─────────────────┐
 * │    Role     │   Section 1     │   Section 2     │   Section 3     │
 * ├─────────────┼─────────────────┼─────────────────┼─────────────────┤
 * │ Free/Trial  │ C1: Full Access │ Upgrade CTA     │ Purchase CTA    │
 * │             │ C2: L1 if ready │                 │                 │
 * │             │ C3: Locked      │                 │                 │
 * ├─────────────┼─────────────────┼─────────────────┼─────────────────┤
 * │ Monthly/    │ Full Access     │ Full Access     │ Purchase CTA    │
 * │ Annual      │                 │                 │                 │
 * └─────────────┴─────────────────┴─────────────────┴─────────────────┘
 * 
 * SEQUENTIAL UNLOCK RULES:
 * - Section 1, Course 1: All lessons unlock sequentially
 * - Section 1, Course 2: L1 unlocks if blueprintDone OR pressedNotReady
 * - Section 1, Course 3: Locked for trial users
 * - Section 2: Premium only, all lessons available
 * - Section 3: Individual purchase required
 */

export type Role = 'free' | 'trial' | 'monthly' | 'annual' | 'downsell' | 'admin';

export interface UserFlags {
  role: Role;
  pressedNotReady?: boolean;    // "Not Ready Yet" unlocked Discovery L1
  blueprintDone?: boolean;      // Completed Course 1 (Business Blueprint)
  purchasedMasterclasses?: string[]; // Array of purchased masterclass IDs
}

export type SectionId = 's1' | 's2' | 's3';
export type CourseIndex = 1 | 2 | 3;
export type LockState = 'unlocked' | 'locked-upgrade' | 'locked-progress' | 'locked-purchase';

// Core role helpers
export const isTrialLike = (role: Role): boolean => role === 'free' || role === 'trial' || role === 'downsell';
export const isPremium = (role: Role): boolean => role === 'monthly' || role === 'annual' || role === 'admin';

/**
 * Check if user can see a section at all
 */
export function canSeeSection(sectionId: SectionId, user: UserFlags): boolean {
  switch (sectionId) {
    case 's1': 
      return true; // Everyone can see Section 1
    case 's2': 
      return true; // Everyone can see Section 2 (but may need upgrade)
    case 's3': 
      return true; // Everyone can see Section 3 (but may need purchase)
    default:
      return false;
  }
}

/**
 * Check if user can start a course (access without upgrade/purchase prompt)
 */
export function canStartCourse(sectionId: SectionId, courseIndex: CourseIndex, user: UserFlags): boolean {
  switch (sectionId) {
    case 's1':
      if (isPremium(user.role)) return true;
      if (courseIndex === 1) return true; // Course 1 always available to trials
      if (courseIndex === 2) return user.blueprintDone || user.pressedNotReady || false;
      if (courseIndex === 3) return false; // Course 3 locked for trials
      return false;
    
    case 's2':
      return isPremium(user.role); // Only premium can access Section 2
    
    case 's3':
      return false; // Masterclasses always require individual purchase
    
    default:
      return false;
  }
}

/**
 * Check if a specific lesson is unlocked
 */
export function isLessonUnlocked(
  sectionId: SectionId, 
  courseIndex: CourseIndex, 
  lessonIndex: number, 
  user: UserFlags, 
  priorLessonsCompleted: number = 0
): boolean {
  // If user can't start the course, no lessons are unlocked
  if (!canStartCourse(sectionId, courseIndex, user)) {
    return false;
  }

  switch (sectionId) {
    case 's1':
      if (isPremium(user.role)) return true; // Premium gets all lessons
      
      if (courseIndex === 1) {
        // Course 1: Sequential unlock based on completion
        return lessonIndex <= priorLessonsCompleted + 1;
      }
      
      if (courseIndex === 2) {
        // Course 2: Only L1 unlocked initially via "Not Ready Yet" or completion
        if (user.blueprintDone) {
          return lessonIndex <= priorLessonsCompleted + 1; // Sequential after blueprint
        }
        if (user.pressedNotReady) {
          return lessonIndex === 1; // Only first lesson via "Not Ready Yet"
        }
        return false;
      }
      
      return false;
    
    case 's2':
      return isPremium(user.role); // Premium gets all lessons
    
    case 's3':
      return false; // Handled by purchase check
    
    default:
      return false;
  }
}

/**
 * Check if course should show upgrade CTA instead of content
 */
export function requiresUpgradeCTA(sectionId: SectionId, courseIndex: CourseIndex, user: UserFlags): boolean {
  switch (sectionId) {
    case 's1':
      if (isPremium(user.role)) return false; // Premium never needs upgrade
      if (courseIndex === 3) return true; // Course 3 requires upgrade for trials
      return false;
    
    case 's2':
      return isTrialLike(user.role); // Section 2 requires upgrade for trials
    
    case 's3':
      return false; // Section 3 uses purchase CTA, not upgrade CTA
    
    default:
      return false;
  }
}

/**
 * Check if masterclass requires purchase CTA
 */
export function requiresPurchaseMasterclass(courseId: string, user: UserFlags): boolean {
  return !user.purchasedMasterclasses?.includes(courseId);
}

/**
 * Get the lock state for a course (for consistent UI display)
 */
export function courseLockState(sectionId: SectionId, courseIndex: CourseIndex, user: UserFlags): LockState {
  if (sectionId === 's3') {
    return 'locked-purchase'; // Masterclasses always show purchase requirement
  }
  
  if (requiresUpgradeCTA(sectionId, courseIndex, user)) {
    return 'locked-upgrade';
  }
  
  if (!canStartCourse(sectionId, courseIndex, user)) {
    return 'locked-progress'; // Locked due to progression requirements
  }
  
  return 'unlocked';
}

/**
 * Get appropriate lock message for UI display
 */
export function getLockMessage(lockState: LockState, user: UserFlags): string {
  switch (lockState) {
    case 'locked-upgrade':
      if (isTrialLike(user.role)) {
        return "Upgrade to Premium to unlock all courses instantly";
      }
      return "Premium membership required";
    
    case 'locked-progress':
      return "Complete previous course or choose 'Not Ready Yet' to unlock";
    
    case 'locked-purchase':
      return "Individual purchase required";
    
    case 'unlocked':
    default:
      return "";
  }
}

/**
 * Get upgrade CTA text based on user role
 */
export function getUpgradeCTAText(user: UserFlags): string {
  if (isTrialLike(user.role)) {
    return "Upgrade to Premium";
  }
  return "Upgrade Required";
}