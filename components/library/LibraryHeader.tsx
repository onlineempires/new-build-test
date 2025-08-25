import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { ThemeSwitch } from './ThemeSwitch';

interface LibraryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme?: ThemeName;
  onThemeChange?: (theme: ThemeName) => void;
}

type ThemeName = 'light' | 'dark' | 'pink' | 'blue';

const themes: { name: ThemeName; label: string; colors: string }[] = [
  { name: 'light', label: 'Light', colors: 'from-slate-100 to-white' },
  { name: 'dark', label: 'Dark', colors: 'from-gray-900 to-black' },
  { name: 'pink', label: 'Pink', colors: 'from-pink-900 to-rose-800' },
  { name: 'blue', label: 'Blue', colors: 'from-blue-900 to-indigo-800' },
];

export default function LibraryHeader({ searchQuery, onSearchChange, theme: parentTheme, onThemeChange }: LibraryHeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('dark');
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

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

  // Initialize theme from props or localStorage
  useEffect(() => {
    if (parentTheme) {
      setCurrentTheme(parentTheme);
    } else if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('library:theme') as ThemeName;
      if (saved && themes.find(t => t.name === saved)) {
        setCurrentTheme(saved);
      }
    }
  }, [parentTheme]);

  // Close theme dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (theme: ThemeName) => {
    setCurrentTheme(theme);
    localStorage.setItem('library:theme', theme);
    setIsThemeDropdownOpen(false);
    
    // Apply theme to the library root element
    const libraryRoot = document.getElementById('library-root');
    if (libraryRoot) {
      libraryRoot.setAttribute('data-theme', theme);
    }
    
    // Notify parent component if callback is provided
    if (onThemeChange) {
      onThemeChange(theme);
    }
  };

  return (
    <div className="library-header flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
      {/* Title Section */}
      <div className="flex-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
          Explore the Library
        </h1>
        <p className="text-secondary text-sm lg:text-base">
          Deep dives, step by step trainings, and replays
        </p>
      </div>

      {/* Search Section + Enhanced Theme Selector */}
      <div className="w-full lg:w-auto lg:min-w-[380px] flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        {/* Enhanced Theme Selector */}
        <div className="lg:order-2 relative" ref={themeDropdownRef}>
          <button
            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
            className="form-input flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 min-w-[100px]"
          >
            <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${themes.find(t => t.name === currentTheme)?.colors}`} />
            <span className="text-sm font-medium text-primary">{themes.find(t => t.name === currentTheme)?.label}</span>
            <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-200 ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isThemeDropdownOpen && (
            <div className="dropdown absolute top-full mt-2 right-0 rounded-lg z-50 min-w-[140px]">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleThemeChange(theme.name)}
                  className="dropdown-item w-full flex items-center gap-3 px-4 py-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${theme.colors}`} />
                  <span className="text-sm font-medium text-primary flex-1">{theme.label}</span>
                  {currentTheme === theme.name && (
                    <Check className="w-4 h-4 text-accent" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Search Input */}
        <div className="lg:order-1 flex-1 lg:min-w-[240px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-slate-400 text-sm"></i>
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="form-input w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
    </div>
  );
}