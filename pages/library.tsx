import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import AppLayout from '../components/layout/AppLayout';
import LibraryHeader from '../components/library/LibraryHeader';
import LibraryTabs from '../components/library/LibraryTabs';
import LibraryFilters from '../components/library/LibraryFilters';
import LibraryGrid from '../components/library/LibraryGrid';
import QuickViewModal from '../components/library/QuickViewModal';
import { LibraryItem, LibraryItemType, LibraryFilters as ILibraryFilters, LibraryLevel, LibrarySort, LibraryTabCounts } from '../types/library';
import { getLibraryItems } from '../lib/api/library';
import { getCourseRoute, trackCourseAction } from '../utils/courseRouting';

const ITEMS_PER_PAGE = 12;

export default function LibraryPage() {
  const router = useRouter();
  
  // State
  const [allItems, setAllItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayedItems, setDisplayedItems] = useState<LibraryItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // URL-based state
  const [activeTab, setActiveTab] = useState<LibraryItemType | 'all'>('all');
  const [filters, setFilters] = useState<ILibraryFilters>({
    search: '',
    tags: [],
    duration: '',
    level: '' as LibraryLevel | '',
    sort: 'recent' as LibrarySort,
  });

  // Initialize state from URL on load
  useEffect(() => {
    if (router.isReady) {
      const { tab, q, tags, duration, level, sort } = router.query;
      
      setActiveTab((tab as LibraryItemType) || 'all');
      setFilters({
        search: (q as string) || '',
        tags: tags ? (tags as string).split(',') : [],
        duration: (duration as string) || '',
        level: (level as LibraryLevel) || '',
        sort: (sort as LibrarySort) || 'recent',
      });
    }
  }, [router.isReady, router.query]);

  // Update URL when state changes
  const updateURL = useCallback((newTab: LibraryItemType | 'all', newFilters: ILibraryFilters) => {
    const query: any = {};
    
    if (newTab !== 'all') query.tab = newTab;
    if (newFilters.search) query.q = newFilters.search;
    if (newFilters.tags.length > 0) query.tags = newFilters.tags.join(',');
    if (newFilters.duration) query.duration = newFilters.duration;
    if (newFilters.level) query.level = newFilters.level;
    if (newFilters.sort !== 'recent') query.sort = newFilters.sort;

    router.replace({ pathname: '/library', query }, undefined, { shallow: true });
  }, [router]);

  // Load library items
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      try {
        const items = await getLibraryItems();
        setAllItems(items);
      } catch (error) {
        console.error('Failed to load library items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  // Save last selected tab to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && activeTab) {
      localStorage.setItem('library-last-tab', activeTab);
    }
  }, [activeTab]);

  // Load last selected tab from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !router.query.tab) {
      const lastTab = localStorage.getItem('library-last-tab') as LibraryItemType | 'all';
      if (lastTab && lastTab !== activeTab) {
        setActiveTab(lastTab);
      }
    }
  }, []);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = [...allItems];

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.type === activeTab);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.shortDescription.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter(item =>
        filters.tags.some(tag => item.tags.includes(tag))
      );
    }

    // Filter by duration
    if (filters.duration) {
      filtered = filtered.filter(item => {
        const duration = item.durationMin;
        switch (filters.duration) {
          case '<30': return duration < 30;
          case '30-60': return duration >= 30 && duration <= 60;
          case '60-120': return duration > 60 && duration <= 120;
          case '120+': return duration > 120;
          default: return true;
        }
      });
    }

    // Filter by level
    if (filters.level) {
      filtered = filtered.filter(item => item.level === filters.level);
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'a-z':
          return a.title.localeCompare(b.title);
        case 'most-watched':
          // Sort by progress (completed first, then by progress percentage)
          const aProgress = a.progressPct || 0;
          const bProgress = b.progressPct || 0;
          return bProgress - aProgress;
        case 'recent':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return filtered;
  }, [allItems, activeTab, filters]);

  // Update displayed items for pagination
  useEffect(() => {
    const itemsToShow = filteredItems.slice(0, ITEMS_PER_PAGE);
    setDisplayedItems(itemsToShow);
    setHasMore(filteredItems.length > ITEMS_PER_PAGE);
  }, [filteredItems]);

  // Calculate tab counts
  const tabCounts: LibraryTabCounts = useMemo(() => {
    return {
      courses: allItems.filter(item => item.type === 'course').length,
      masterclasses: allItems.filter(item => item.type === 'masterclass').length,
      replays: allItems.filter(item => item.type === 'replay').length,
    };
  }, [allItems]);

  // Event handlers
  const handleTabChange = (tab: LibraryItemType | 'all') => {
    setActiveTab(tab);
    updateURL(tab, filters);
  };

  const handleFiltersChange = (newFilters: Partial<ILibraryFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    updateURL(activeTab, updatedFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: ILibraryFilters = {
      search: '',
      tags: [],
      duration: '',
      level: '',
      sort: 'recent',
    };
    setFilters(resetFilters);
    updateURL(activeTab, resetFilters);
  };

  const handleItemClick = (item: LibraryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleStartCourse = (item: LibraryItem) => {
    const targetRoute = getCourseRoute(item);
    const isStarting = item.progressPct === 0 || !item.progressPct;
    
    // Track the action
    trackCourseAction(isStarting ? 'start' : 'continue', item, targetRoute);
    
    // Navigate to the appropriate lesson
    router.push(targetRoute);
    handleCloseModal();
  };

  const handleUnlockAccess = (item: LibraryItem) => {
    console.log('Unlocking access for:', item.title);
    // In production, this would navigate to the paywall/purchase page
    if (item.purchaseHref) {
      router.push(item.purchaseHref);
    } else {
      // Fallback to general upgrade page
      router.push('/upgrade');
    }
    handleCloseModal();
  };

  const handleViewDetails = (item: LibraryItem) => {
    console.log('Viewing details for:', item.title);
    // Navigate to detailed course page if available
    if (item.href) {
      router.push(item.href);
    } else {
      router.push(`/courses/${item.slug}`);
    }
    handleCloseModal();
  };

  const handleLoadMore = async () => {
    const currentLength = displayedItems.length;
    const nextItems = filteredItems.slice(currentLength, currentLength + ITEMS_PER_PAGE);
    setDisplayedItems(prev => [...prev, ...nextItems]);
    setHasMore(filteredItems.length > currentLength + ITEMS_PER_PAGE);
  };

  // Listen for reset filters event from empty state
  useEffect(() => {
    const handleResetEvent = () => handleResetFilters();
    window.addEventListener('reset-library-filters', handleResetEvent);
    return () => window.removeEventListener('reset-library-filters', handleResetEvent);
  }, []);

  return (
    <AppLayout 
      user={{ id: 123, name: "Ashley Kemp", avatarUrl: "/default-avatar.png" }}
      onLogout={() => router.push('/logout')}
    >
      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <LibraryHeader
            searchQuery={filters.search}
            onSearchChange={(search) => handleFiltersChange({ search })}
          />

          {/* Tabs */}
          <div className="mt-8">
            <LibraryTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              tabCounts={tabCounts}
            />
          </div>

          {/* Filters */}
          <LibraryFilters
            tags={filters.tags}
            duration={filters.duration}
            level={filters.level}
            sort={filters.sort}
            onFiltersChange={handleFiltersChange}
            onResetFilters={handleResetFilters}
          />

          {/* Grid */}
          <LibraryGrid
            items={displayedItems}
            isLoading={isLoading}
            onItemClick={handleItemClick}
            onLoadMore={hasMore ? handleLoadMore : undefined}
            hasMore={hasMore}
          />
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStartCourse={handleStartCourse}
        onUnlockAccess={handleUnlockAccess}
        onViewDetails={handleViewDetails}
      />
    </AppLayout>
  );
}

// Opt out of SSG for this page since it uses dynamic router query
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};