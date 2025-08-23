import { LibraryItemType, LibraryTabCounts } from '../../types/library';

interface LibraryTabsProps {
  activeTab: LibraryItemType | 'all';
  onTabChange: (tab: LibraryItemType | 'all') => void;
  tabCounts: LibraryTabCounts;
}

const tabs = [
  { id: 'all' as const, label: 'All', icon: 'fas fa-th-large' },
  { id: 'course' as const, label: 'Courses', icon: 'fas fa-book' },
  { id: 'masterclass' as const, label: 'Masterclasses', icon: 'fas fa-graduation-cap' },
  { id: 'replay' as const, label: 'Call Replays', icon: 'fas fa-play-circle' },
];

export default function LibraryTabs({ activeTab, onTabChange, tabCounts }: LibraryTabsProps) {
  const getTotalCount = () => {
    return tabCounts.courses + tabCounts.masterclasses + tabCounts.replays;
  };

  const getTabCount = (tabId: LibraryItemType | 'all') => {
    switch (tabId) {
      case 'all': return getTotalCount();
      case 'course': return tabCounts.courses;
      case 'masterclass': return tabCounts.masterclasses;
      case 'replay': return tabCounts.replays;
      default: return 0;
    }
  };

  return (
    <div className="border-b border-slate-700">
      <div className="flex space-x-0 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-0 min-w-max lg:min-w-0 lg:space-x-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = getTabCount(tab.id);

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group relative flex items-center space-x-2 px-4 lg:px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                  isActive
                    ? 'text-white bg-slate-800/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
                aria-label={`${tab.label} (${count} items)`}
              >
                {/* Icon */}
                <i className={`${tab.icon} text-base flex-shrink-0 ${
                  isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}></i>

                {/* Label */}
                <span className="font-semibold">{tab.label}</span>

                {/* Count Pill */}
                <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold rounded-full transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'
                }`}>
                  {count}
                </span>

                {/* Active Tab Indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}