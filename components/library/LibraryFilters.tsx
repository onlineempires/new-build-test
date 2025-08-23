import React, { useState, useRef, useEffect } from 'react';
import { LibraryLevel, LibrarySort } from '../../types/library';
import { LIBRARY_TAGS, DURATION_OPTIONS, LEVEL_OPTIONS, SORT_OPTIONS } from '../../lib/api/library';

interface LibraryFiltersProps {
  tags: string[];
  duration: string;
  level: LibraryLevel | '';
  sort: LibrarySort;
  onFiltersChange: (filters: {
    tags?: string[];
    duration?: string;
    level?: LibraryLevel | '';
    sort?: LibrarySort;
  }) => void;
  onResetFilters: () => void;
}

export default function LibraryFilters({
  tags,
  duration,
  level,
  sort,
  onFiltersChange,
  onResetFilters,
}: LibraryFiltersProps) {
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const tagsRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside - debounced to prevent flicker
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleClickOutside = (event: MouseEvent) => {
      // Debounce to prevent immediate re-opening
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const target = event.target as Node;
        
        if (tagsRef.current && !tagsRef.current.contains(target)) {
          setIsTagsOpen(false);
        }
        if (durationRef.current && !durationRef.current.contains(target)) {
          setIsDurationOpen(false);
        }
        if (levelRef.current && !levelRef.current.contains(target)) {
          setIsLevelOpen(false);
        }
        if (sortRef.current && !sortRef.current.contains(target)) {
          setIsSortOpen(false);
        }
      }, 10); // Small delay to prevent flicker
    };

    // Use capture phase to handle before any other handlers
    document.addEventListener('mousedown', handleClickOutside, { capture: true });
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside, { capture: true });
    };
  }, []);

  const hasActiveFilters = tags.length > 0 || duration !== '' || level !== '';

  const toggleTag = (tag: string) => {
    const newTags = tags.includes(tag)
      ? tags.filter(t => t !== tag)
      : [...tags, tag];
    onFiltersChange({ tags: newTags });
  };

  const getSelectedTagsDisplay = () => {
    if (tags.length === 0) return 'All Tags';
    if (tags.length === 1) return tags[0];
    return `${tags.length} tags selected`;
  };

  const getDurationDisplay = () => {
    const option = DURATION_OPTIONS.find(opt => opt.value === duration);
    return option ? option.label : 'Any Duration';
  };

  const getLevelDisplay = () => {
    const option = LEVEL_OPTIONS.find(opt => opt.value === level);
    return option ? option.label : 'Any Level';
  };

  const getSortDisplay = () => {
    const option = SORT_OPTIONS.find(opt => opt.value === sort);
    return option ? option.label : 'Most Recent';
  };

  const FilterDropdown = React.forwardRef<HTMLDivElement, { 
    isOpen: boolean; 
    onToggle: () => void; 
    displayText: string; 
    children: React.ReactNode;
  }>(({ isOpen, onToggle, displayText, children }, ref) => {
    
    const handleButtonClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggle();
    };

    const handleMenuClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    return (
      <div className="relative" ref={ref}>
        <button
          onClick={handleButtonClick}
          className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          type="button"
          aria-expanded={isOpen}
        >
          <span className="truncate">{displayText}</span>
          <i className={`fas fa-chevron-down ml-2 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
        </button>
        
        {isOpen && (
          <div 
            className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-[60] max-h-64 overflow-y-auto"
            onClick={handleMenuClick}
          >
            {children}
          </div>
        )}
      </div>
    );
  });
  
  FilterDropdown.displayName = 'FilterDropdown';

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:flex items-center space-x-4 py-4 border-b border-slate-700">
        {/* Tags Multi-Select */}
        <FilterDropdown
          isOpen={isTagsOpen}
          onToggle={() => setIsTagsOpen(!isTagsOpen)}
          displayText={getSelectedTagsDisplay()}
          ref={tagsRef}
        >
          <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
            {LIBRARY_TAGS.map((tag) => (
              <label
                key={tag}
                className="flex items-center space-x-2 p-2 hover:bg-slate-700 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={tags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                  className="rounded border-slate-600 text-blue-600 focus:ring-blue-500 bg-slate-700"
                />
                <span className="text-white text-sm">{tag}</span>
              </label>
            ))}
          </div>
        </FilterDropdown>

        {/* Duration Dropdown */}
        <FilterDropdown
          isOpen={isDurationOpen}
          onToggle={() => setIsDurationOpen(!isDurationOpen)}
          displayText={getDurationDisplay()}
          ref={durationRef}
        >
          <div className="p-1">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onFiltersChange({ duration: option.value });
                  setIsDurationOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-white text-sm hover:bg-slate-700 rounded"
              >
                {option.label}
              </button>
            ))}
          </div>
        </FilterDropdown>

        {/* Level Dropdown */}
        <FilterDropdown
          isOpen={isLevelOpen}
          onToggle={() => setIsLevelOpen(!isLevelOpen)}
          displayText={getLevelDisplay()}
          ref={levelRef}
        >
          <div className="p-1">
            {LEVEL_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onFiltersChange({ level: option.value as LibraryLevel | '' });
                  setIsLevelOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-white text-sm hover:bg-slate-700 rounded"
              >
                {option.label}
              </button>
            ))}
          </div>
        </FilterDropdown>

        {/* Sort Dropdown */}
        <FilterDropdown
          isOpen={isSortOpen}
          onToggle={() => setIsSortOpen(!isSortOpen)}
          displayText={getSortDisplay()}
          ref={sortRef}
        >
          <div className="p-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onFiltersChange({ sort: option.value as LibrarySort });
                  setIsSortOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-white text-sm hover:bg-slate-700 rounded"
              >
                {option.label}
              </button>
            ))}
          </div>
        </FilterDropdown>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2.5 text-sm text-blue-400 hover:text-white border border-blue-400 hover:bg-blue-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Mobile Filters Button */}
      <div className="lg:hidden border-b border-slate-700">
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="flex items-center justify-between w-full px-4 py-4 text-white text-sm hover:bg-slate-800/30 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <i className="fas fa-filter text-slate-400"></i>
            <span>Filters</span>
            {hasActiveFilters && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
          <i className={`fas fa-chevron-down transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`}></i>
        </button>

        {/* Mobile Filters Panel */}
        {isMobileFiltersOpen && (
          <div className="p-4 bg-slate-800/30 border-t border-slate-700 space-y-4">
            {/* Mobile filter controls would go here - simplified for now */}
            <div className="text-center">
              <button
                onClick={onResetFilters}
                className="px-4 py-2 text-sm text-blue-400 hover:text-white border border-blue-400 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}