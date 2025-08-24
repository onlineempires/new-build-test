"use client";
import s from '../../../components/library/library-theme.module.css';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '../../../components/layout/AppLayout';
import LibraryHeader from '../../../components/library/LibraryHeader';
import LibraryTabs from '../../../components/library/LibraryTabs';
import LibraryFilters from '../../../components/library/LibraryFilters';
import LibraryGrid from '../../../components/library/LibraryGrid';
import { QuickViewDialog } from '../../../components/library/QuickViewDialog';
import { LibraryItem, LibraryItemType, LibraryFilters as ILibraryFilters, LibraryLevel, LibrarySort, LibraryTabCounts } from '../../../types/library';
import { getLibraryItems } from '../../../lib/api/library';


const ITEMS_PER_PAGE = 12;

// Mock user for demo
const mockUser = { id: 123, name: "Ashley Kemp", avatarUrl: "/default-avatar.png" };

export default function LibraryBetaPage() {
  const router = useRouter();
  
  // Theme state
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("library:theme");
      setTheme(saved || "dark");
    }
  }, []);
  
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
  };

  const handleFiltersChange = (newFilters: Partial<ILibraryFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
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
  };

  const handleItemClick = (item: LibraryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };



  const handleLoadMore = async () => {
    const currentLength = displayedItems.length;
    const nextItems = filteredItems.slice(currentLength, currentLength + ITEMS_PER_PAGE);
    setDisplayedItems(prev => [...prev, ...nextItems]);
    setHasMore(filteredItems.length > currentLength + ITEMS_PER_PAGE);
  };

  return (
    <AppLayout 
      user={mockUser}
    >
      {/* Add content portal root for modal and library theme root */}
      <div id="library-root" className={`${s.themeScope} relative min-h-screen bg-[var(--lib-bg)] transition-colors`} data-theme={theme}>
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

        {/* Quick View Dialog */}
        <QuickViewDialog
          course={selectedItem}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>
    </AppLayout>
  );
}