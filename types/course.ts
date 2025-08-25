export type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  heroUrl: string;
  description: string;
  durationLabel: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  type: 'course' | 'masterclass' | 'replay';
  isNew?: boolean;
  progressPct?: number;
};