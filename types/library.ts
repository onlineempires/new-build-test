export type LibraryItemType = 'course' | 'masterclass' | 'replay';
export type LibraryLevel = 'beginner' | 'intermediate' | 'advanced';
export type LibrarySort = 'recent' | 'a-z' | 'most-watched';

export interface LibraryItem {
  id: string;
  slug: string;
  title: string;
  type: LibraryItemType;
  durationMin: number;
  level: LibraryLevel;
  tags: string[];
  heroImage: string;
  shortDescription: string;
  isLocked: boolean;
  progressPct?: number; // 0 to 100
  updatedAt: string;
  href?: string; // fallback details route
  purchaseHref?: string;
}

export interface LibraryFilters {
  search: string;
  tags: string[];
  duration: string; // '<30', '30-60', '60-120', '120+'
  level: LibraryLevel | '';
  sort: LibrarySort;
}

export interface LibraryTabCounts {
  courses: number;
  masterclasses: number;
  replays: number;
}

export interface LibraryContextType {
  items: LibraryItem[];
  filteredItems: LibraryItem[];
  activeTab: LibraryItemType | 'all';
  filters: LibraryFilters;
  tabCounts: LibraryTabCounts;
  isLoading: boolean;
  setActiveTab: (tab: LibraryItemType | 'all') => void;
  updateFilters: (filters: Partial<LibraryFilters>) => void;
  resetFilters: () => void;
}