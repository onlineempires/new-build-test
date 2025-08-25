"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from './ThemeContext';

export type FilterTab = 'All' | 'Courses' | 'Masterclasses' | 'Call Replays';

interface FilterCounts {
  All: number;
  Courses: number;
  Masterclasses: number;
  'Call Replays': number;
}

interface FilterSystemProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  filterCounts: FilterCounts;
  selectedTags: string;
  onTagsChange: (tags: string) => void;
  selectedDuration: string;
  onDurationChange: (duration: string) => void;
  selectedLevel: string;
  onLevelChange: (level: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

const filterTabs: FilterTab[] = ['All', 'Courses', 'Masterclasses', 'Call Replays'];

const tagOptions = ['All Tags', 'Business', 'Marketing', 'Psychology', 'Sales', 'Leadership'];
const durationOptions = ['Any Duration', '< 30 min', '30-60 min', '1-2 hours', '2+ hours'];
const levelOptions = ['Any Level', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = ['Most Recent', 'Alphabetical', 'Duration', 'Most Popular'];

interface DropdownProps {
  label: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  colors: any;
}

function Dropdown({ label, options, selected, onChange, colors }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between gap-2 px-4 py-2 rounded-lg border
          ${colors.cardBg} ${colors.text} ${colors.border}
          hover:bg-opacity-80 transition-all duration-200
          min-w-[140px]
        `}
      >
        <span className="text-sm font-medium">{selected}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className={`
            absolute top-full left-0 mt-2 w-full min-w-[180px] rounded-lg shadow-xl
            ${colors.cardBg} ${colors.border} border
            overflow-hidden z-50
          `}>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-2 text-sm
                  ${colors.text} hover:bg-blue-500 hover:text-white
                  transition-all duration-200
                  ${selected === option ? 'bg-blue-500 text-white' : ''}
                `}
              >
                {option}
              </button>
            ))}
          </div>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export function FilterSystem({
  activeTab,
  onTabChange,
  filterCounts,
  selectedTags,
  onTagsChange,
  selectedDuration,
  onDurationChange,
  selectedLevel,
  onLevelChange,
  selectedSort,
  onSortChange
}: FilterSystemProps) {
  const { colors } = useTheme();

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-1">
        {filterTabs.map((tab) => {
          const isActive = activeTab === tab;
          const count = filterCounts[tab];
          
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                transition-all duration-200
                ${isActive 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : `${colors.text} hover:bg-blue-500 hover:text-white ${colors.cardBg}`
                }
              `}
            >
              {tab}
              <span 
                className={`
                  text-xs px-2 py-0.5 rounded-full font-bold
                  ${isActive 
                    ? 'bg-white text-blue-500' 
                    : 'bg-blue-500 text-white'
                  }
                `}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-4">
        <Dropdown
          label="Tags"
          options={tagOptions}
          selected={selectedTags}
          onChange={onTagsChange}
          colors={colors}
        />
        <Dropdown
          label="Duration"
          options={durationOptions}
          selected={selectedDuration}
          onChange={onDurationChange}
          colors={colors}
        />
        <Dropdown
          label="Level"
          options={levelOptions}
          selected={selectedLevel}
          onChange={onLevelChange}
          colors={colors}
        />
        <Dropdown
          label="Sort"
          options={sortOptions}
          selected={selectedSort}
          onChange={onSortChange}
          colors={colors}
        />
      </div>
    </div>
  );
}