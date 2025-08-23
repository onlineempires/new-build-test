import { LibraryItem } from '../../types/library';
import { generateThumbnail, preGenerateThumbnails, getThumbnailUrl } from './thumbnails';

// Seed data for library items
export const LIBRARY_SEED: LibraryItem[] = [
  {
    id: '1',
    slug: 'philosophy-of-offers',
    title: 'The Philosophy of Offers',
    type: 'masterclass',
    durationMin: 62,
    level: 'advanced',
    tags: ['Marketing', 'Offers'],
    heroImage: '/library/thumbnails/offers.svg',
    shortDescription: 'Build irresistible offers with first-principle thinking',
    isLocked: false,
    progressPct: 0,
    updatedAt: '2025-08-01',
  },
  {
    id: '2',
    slug: 'trust-cycles',
    title: 'Relationship and Trust Cycles',
    type: 'course',
    durationMin: 48,
    level: 'intermediate',
    tags: ['Sales', 'Psychology'],
    heroImage: '/library/thumbnails/trust-cycles.svg',
    shortDescription: 'Increase conversions with trust sequencing',
    isLocked: false,
    progressPct: 27,
    updatedAt: '2025-07-15',
  },
  {
    id: '3',
    slug: 'biz-ops',
    title: 'Call of Duty Biz-Ops',
    type: 'replay',
    durationMin: 95,
    level: 'intermediate',
    tags: ['Operations'],
    heroImage: '/library/thumbnails/biz-ops.svg',
    shortDescription: 'Systems, metrics, and ops cadence',
    isLocked: true,
    purchaseHref: '/checkout/biz-ops',
    updatedAt: '2025-06-11',
  },
  {
    id: '4',
    slug: 'social-optics',
    title: 'Social Optics & Symbolism',
    type: 'masterclass',
    durationMin: 73,
    level: 'advanced',
    tags: ['Psychology', 'Branding'],
    heroImage: '/library/thumbnails/optics.svg',
    shortDescription: 'Master perception and symbolic communication',
    isLocked: false,
    progressPct: 0,
    updatedAt: '2025-07-28',
  },
  {
    id: '5',
    slug: 'theory-call',
    title: 'Theory Call',
    type: 'replay',
    durationMin: 87,
    level: 'beginner',
    tags: ['Mindset'],
    heroImage: '/library/thumbnails/theory.svg',
    shortDescription: 'Foundational thinking frameworks',
    isLocked: false,
    progressPct: 100,
    updatedAt: '2025-06-20',
  },
  {
    id: '6',
    slug: 'creating-opportunities',
    title: 'Creating and Spotting Opportunities',
    type: 'course',
    durationMin: 52,
    level: 'intermediate',
    tags: ['Business', 'Strategy'],
    heroImage: '/library/thumbnails/opportunities.svg',
    shortDescription: 'Develop an opportunity mindset for growth',
    isLocked: false,
    progressPct: 15,
    updatedAt: '2025-07-02',
  },
  {
    id: '7',
    slug: 'limiting-beliefs',
    title: 'Limiting Beliefs',
    type: 'masterclass',
    durationMin: 44,
    level: 'beginner',
    tags: ['Mindset', 'Psychology'],
    heroImage: '/library/thumbnails/beliefs.svg',
    shortDescription: 'Break through mental barriers holding you back',
    isLocked: false,
    progressPct: 0,
    updatedAt: '2025-06-05',
  },
  {
    id: '8',
    slug: 'next-5-years',
    title: 'The Next 5 Years',
    type: 'replay',
    durationMin: 112,
    level: 'advanced',
    tags: ['Strategy', 'Future'],
    heroImage: '/library/thumbnails/next-5-years.svg',
    shortDescription: 'Strategic planning for long-term success',
    isLocked: true,
    purchaseHref: '/checkout/next-5-years',
    updatedAt: '2025-05-18',
  },
  // Additional items for better demo
  {
    id: '9',
    slug: 'content-marketing-mastery',
    title: 'Content Marketing Mastery',
    type: 'course',
    durationMin: 38,
    level: 'intermediate',
    tags: ['Marketing', 'Content'],
    heroImage: '/library/thumbnails/content-marketing.svg',
    shortDescription: 'Create compelling content that converts',
    isLocked: false,
    progressPct: 65,
    updatedAt: '2025-07-10',
  },
  {
    id: '10',
    slug: 'leadership-fundamentals',
    title: 'Leadership Fundamentals',
    type: 'masterclass',
    durationMin: 89,
    level: 'advanced',
    tags: ['Leadership', 'Management'],
    heroImage: '/library/thumbnails/leadership.svg',
    shortDescription: 'Essential skills for effective leadership',
    isLocked: false,
    progressPct: 0,
    updatedAt: '2025-06-25',
  },
  {
    id: '11',
    slug: 'sales-psychology-deep-dive',
    title: 'Sales Psychology Deep Dive',
    type: 'replay',
    durationMin: 126,
    level: 'advanced',
    tags: ['Sales', 'Psychology'],
    heroImage: '/library/thumbnails/sales-psychology.svg',
    shortDescription: 'Advanced psychological sales techniques',
    isLocked: true,
    purchaseHref: '/checkout/sales-psychology',
    updatedAt: '2025-05-30',
  },
  {
    id: '12',
    slug: 'productivity-systems',
    title: 'Productivity Systems',
    type: 'course',
    durationMin: 29,
    level: 'beginner',
    tags: ['Productivity', 'Systems'],
    heroImage: '/library/thumbnails/productivity.svg',
    shortDescription: 'Build systems that maximize your output',
    isLocked: false,
    progressPct: 80,
    updatedAt: '2025-07-08',
  },
];

// Available filter options
export const LIBRARY_TAGS = [
  'Marketing',
  'Sales', 
  'Mindset',
  'Tech',
  'Operations',
  'Psychology',
  'Business',
  'Strategy',
  'Leadership',
  'Content',
  'Productivity',
  'Systems',
  'Branding',
  'Management',
  'Future',
  'Offers',
];

export const DURATION_OPTIONS = [
  { value: '', label: 'Any Duration' },
  { value: '<30', label: 'Under 30 min' },
  { value: '30-60', label: '30 to 60 min' },
  { value: '60-120', label: '1 to 2 hours' },
  { value: '120+', label: '2+ hours' },
];

export const LEVEL_OPTIONS = [
  { value: '', label: 'Any Level' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'a-z', label: 'A to Z' },
  { value: 'most-watched', label: 'Most Watched' },
];

// Cache for pre-generated thumbnails
let thumbnailCache: Map<string, string> | null = null;

// Helper function to get realistic thumbnail for an item
export const getLibraryItemImage = async (item: LibraryItem): Promise<string> => {
  return getThumbnailUrl(item, thumbnailCache);
};

// Initialize thumbnail cache
export const initializeThumbnailCache = async (): Promise<void> => {
  if (!thumbnailCache) {
    thumbnailCache = await preGenerateThumbnails(LIBRARY_SEED);
  }
};

// API-like functions for fetching library data
export const getLibraryItems = async (): Promise<LibraryItem[]> => {
  // In production, this would be an actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(LIBRARY_SEED);
    }, 300); // Simulate API delay
  });
};

export const getLibraryItemById = async (id: string): Promise<LibraryItem | null> => {
  const items = await getLibraryItems();
  return items.find(item => item.id === id) || null;
};

export const getLibraryItemBySlug = async (slug: string): Promise<LibraryItem | null> => {
  const items = await getLibraryItems();
  return items.find(item => item.slug === slug) || null;
};