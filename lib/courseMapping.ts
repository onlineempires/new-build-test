export interface LibraryCourse {
  courseSlug: string;
  lessonSlug: string;
  title: string;
  level: 'MC+' | 'DE+' | 'CR+' | 'advanced';
  duration: string;
  description: string;
  accessLevel: 'monthly' | 'yearly';
  progress?: number;
  hasVideo?: boolean;
  category: 'course' | 'masterclass' | 'training';
}

export const libraryToAdvancedTrainingsMap: Record<string, LibraryCourse> = {
  'philosophy-of-offers': {
    courseSlug: 'relationship-and-trust-cycles',
    lessonSlug: 'building-rapport-quickly',
    title: 'The Philosophy of Offers',
    level: 'MC+',
    duration: '1h 2m',
    description: 'Master the psychological principles behind irresistible offers that convert prospects into customers.',
    accessLevel: 'monthly',
    category: 'masterclass',
    hasVideo: true,
  },
  'social-optics-symbolism': {
    courseSlug: 'content-marketing-mastery',
    lessonSlug: 'symbolic-communication',
    title: 'Social Optics & Symbolism',
    level: 'MC+',
    duration: '1h 13m',
    description: 'Understand how perception shapes reality and leverage social symbols to build authority.',
    accessLevel: 'monthly',
    category: 'masterclass',
    hasVideo: true,
  },
  'relationship-trust-cycles': {
    courseSlug: 'relationship-and-trust-cycles',
    lessonSlug: 'trust-building-fundamentals',
    title: 'Relationship and Trust Cycles',
    level: 'DE+',
    duration: '48 min',
    description: 'Build deeper connections through understanding trust cycles and relationship psychology.',
    progress: 25,
    accessLevel: 'monthly',
    category: 'course',
    hasVideo: true,
  },
  'content-marketing-mastery': {
    courseSlug: 'content-marketing-mastery',
    lessonSlug: 'content-distribution-strategies',
    title: 'Content Marketing Mastery',
    level: 'DE+',
    duration: '38 min',
    description: 'Create compelling content that attracts, engages, and converts your ideal audience.',
    progress: 58,
    accessLevel: 'monthly',
    category: 'course',
    hasVideo: true,
  },
  'advanced-sales-psychology': {
    courseSlug: 'sales-psychology-mastery',
    lessonSlug: 'psychological-triggers',
    title: 'Advanced Sales Psychology',
    level: 'DE+',
    duration: '2h 15m',
    description: 'Deep dive into the psychological triggers that drive purchasing decisions.',
    progress: 80,
    accessLevel: 'yearly',
    category: 'course',
    hasVideo: true,
  },
  'building-digital-authority': {
    courseSlug: 'digital-authority-building',
    lessonSlug: 'authority-positioning',
    title: 'Building Digital Authority',
    level: 'DE+',
    duration: '1h 45m',
    description: 'Establish yourself as the go-to expert through strategic digital positioning.',
    progress: 20,
    accessLevel: 'yearly',
    category: 'course',
    hasVideo: true,
  },
  'conversion-optimization': {
    courseSlug: 'conversion-mastery',
    lessonSlug: 'optimization-fundamentals',
    title: 'Conversion Optimization',
    level: 'MC+',
    duration: '52 min',
    description: 'Systematically improve your conversion rates through data-driven testing.',
    accessLevel: 'monthly',
    category: 'masterclass',
    hasVideo: true,
  },
  'email-marketing-systems': {
    courseSlug: 'email-marketing-mastery',
    lessonSlug: 'automated-sequences',
    title: 'Email Marketing Systems',
    level: 'CR+',
    duration: '1h 28m',
    description: 'Build automated email sequences that nurture leads and drive consistent revenue.',
    progress: 100,
    accessLevel: 'yearly',
    category: 'training',
    hasVideo: true,
  },
  'facebook-advertising': {
    courseSlug: 'facebook-advertising',
    lessonSlug: 'lesson-1-1',
    title: 'Facebook Advertising Mastery',
    level: 'DE+',
    duration: '2h 30m',
    description: 'Master Facebook advertising from beginner to advanced with proven strategies.',
    progress: 0,
    accessLevel: 'monthly',
    category: 'course',
    hasVideo: true,
  },
  'mindset-mastery': {
    courseSlug: 'mindset-mastery',
    lessonSlug: 'breakthrough-mindset',
    title: 'Mindset Mastery',
    level: 'MC+',
    duration: '1h 15m',
    description: 'Transform your mindset to unlock unprecedented levels of success and fulfillment.',
    accessLevel: 'yearly',
    category: 'masterclass',
    hasVideo: true,
  },
  'scaling-systems': {
    courseSlug: 'business-scaling',
    lessonSlug: 'systems-automation',
    title: 'Scaling Systems',
    level: 'CR+',
    duration: '1h 55m',
    description: 'Build scalable systems that grow your business without increasing your workload.',
    progress: 45,
    accessLevel: 'yearly',
    category: 'training',
    hasVideo: true,
  },
  'leadership-influence': {
    courseSlug: 'leadership-mastery',
    lessonSlug: 'influence-strategies',
    title: 'Leadership & Influence',
    level: 'MC+',
    duration: '1h 35m',
    description: 'Develop powerful leadership skills and learn to influence others ethically.',
    accessLevel: 'monthly',
    category: 'masterclass',
    hasVideo: true,
  }
};

export const getLibraryCourse = (courseId: string): LibraryCourse | undefined => {
  return libraryToAdvancedTrainingsMap[courseId];
};

export const getAllLibraryCourses = () => {
  return Object.entries(libraryToAdvancedTrainingsMap).map(([id, data]) => ({
    id,
    ...data
  }));
};

export const getLibraryCoursesByCategory = (category: 'course' | 'masterclass' | 'training') => {
  return getAllLibraryCourses().filter(course => course.category === category);
};

export const findLibraryCourseByLesson = (courseSlug: string, lessonSlug: string): { id: string; course: LibraryCourse } | null => {
  for (const [id, course] of Object.entries(libraryToAdvancedTrainingsMap)) {
    if (course.courseSlug === courseSlug && course.lessonSlug === lessonSlug) {
      return { id, course };
    }
  }
  return null;
};