/**
 * AUTHORITATIVE COURSE MAPPING - Single Source of Truth
 * 
 * Maps each course slug/id to its section and position for consistent gating
 * across Dashboard, All Courses, Course pages, and Lesson pages.
 */

export type SectionId = 's1' | 's2' | 's3';

export interface CourseMapping {
  sectionId: SectionId;
  courseIndex?: 1 | 2 | 3; // Only for Section 1 (sequential gating)
}

/**
 * Course mapping to sections and positions
 * Section 1: Start Here (sequential for trials) - Blueprint → Discovery → Next Steps  
 * Section 2: Premium courses (premium access required)
 * Section 3: Masterclasses (individual purchase required)
 */
export const COURSE_MAP: Record<string, CourseMapping> = {
  // Section 1 - Start Here (must be sequential for trials)
  'business-launch-blueprint': { sectionId: 's1', courseIndex: 1 },
  'business-blueprint': { sectionId: 's1', courseIndex: 1 }, // Alternative slug
  'discovery-process': { sectionId: 's1', courseIndex: 2 },
  'next-steps': { sectionId: 's1', courseIndex: 3 },

  // Section 2 - Premium courses (Advanced Training - no courseIndex needed - premium access)
  'tiktok-mastery': { sectionId: 's2' },
  'facebook-ads': { sectionId: 's2' },
  'facebook-advertising': { sectionId: 's2' }, // Alternative slug
  'instagram-growth': { sectionId: 's2' },
  'instagram-marketing': { sectionId: 's2' }, // Alternative slug  
  'sales-funnel-mastery': { sectionId: 's2' },
  'email-marketing': { sectionId: 's2' },
  'email-marketing-secrets': { sectionId: 's2' }, // Alternative slug
  'content-creation': { sectionId: 's2' },
  'lead-generation': { sectionId: 's2' },
  'automation-systems': { sectionId: 's2' },
  'advanced-funnel-mastery': { sectionId: 's2' }, // Additional Advanced Training course

  // Section 3 - Masterclasses (individual purchase required)
  'copywriting-masterclass': { sectionId: 's3' },
  'email-masterclass': { sectionId: 's3' },
  'sales-masterclass': { sectionId: 's3' },
  'funnel-masterclass': { sectionId: 's3' },
  'traffic-masterclass': { sectionId: 's3' },
  'conversion-masterclass': { sectionId: 's3' },
  'scaling-masterclass': { sectionId: 's3' },
  'advanced-strategies': { sectionId: 's3' }
};

/**
 * Get course mapping by slug/id
 */
export function getCourseMapping(courseSlug: string): CourseMapping | null {
  return COURSE_MAP[courseSlug] || null;
}

/**
 * Get all courses in a specific section
 */
export function getCoursesBySection(sectionId: SectionId): string[] {
  return Object.entries(COURSE_MAP)
    .filter(([_, mapping]) => mapping.sectionId === sectionId)
    .map(([slug, _]) => slug);
}

/**
 * Check if a course exists in the mapping
 */
export function isValidCourse(courseSlug: string): boolean {
  return courseSlug in COURSE_MAP;
}

/**
 * Get section display names
 */
export const SECTION_NAMES: Record<SectionId, string> = {
  's1': 'Start Here',
  's2': 'Premium Courses', 
  's3': 'Masterclasses'
};

/**
 * Get section descriptions
 */
export const SECTION_DESCRIPTIONS: Record<SectionId, string> = {
  's1': 'Foundation courses to get you started',
  's2': 'Advanced courses for premium members',
  's3': 'Individual masterclasses for specialized training'
};