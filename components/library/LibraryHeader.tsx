import { useState, useEffect } from 'react';

interface LibraryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function LibraryHeader({ searchQuery, onSearchChange }: LibraryHeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(localSearch);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [localSearch, onSearchChange]);

  // Sync with external changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  return (
    <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
      {/* Title Section */}
      <div className="flex-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Explore the Library
        </h1>
        <p className="text-slate-300 text-sm lg:text-base">
          Deep dives, step by step trainings, and replays
        </p>
      </div>

      {/* Search Section */}
      <div className="w-full lg:w-auto lg:min-w-[320px]">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-slate-400 text-sm"></i>
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
            placeholder="Search by title or keyword"
            aria-label="Search library"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <i className="fas fa-times text-sm"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}