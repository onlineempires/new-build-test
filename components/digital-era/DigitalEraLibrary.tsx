"use client";
import React, { useState, useMemo } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { FilterSystem, FilterTab } from './FilterSystem';
import { CourseCard, Course } from './CourseCard';

// Sample course data
const sampleCourses: Course[] = [
  {
    id: 1,
    title: "The Philosophy of Offers",
    duration: "1h 2m",
    level: "MC+",
    progress: null,
    hasVideo: false,
    description: "Master the art of creating irresistible offers that customers can't refuse",
    thumbnailUrl: "/api/placeholder/400/225"
  },
  {
    id: 2,
    title: "Social Optics & Symbolism",
    duration: "1h 13m",
    level: "advanced",
    progress: null,
    hasVideo: true,
    videoUrl: "/api/placeholder/video/400/225",
    description: "Master perception and symbolic communication in business and personal interactions",
    thumbnailUrl: "/api/placeholder/400/225"
  },
  {
    id: 3,
    title: "Relationship and Trust Cycles",
    duration: "48 min",
    level: "DE+",
    progress: 25,
    hasVideo: false,
    description: "Build lasting relationships and trust with customers through proven methodologies",
    thumbnailUrl: "/api/placeholder/400/225"
  },
  {
    id: 4,
    title: "Content Marketing Mastery",
    duration: "38 min",
    level: "DE+",
    progress: 58,
    hasVideo: true,
    videoUrl: "/api/placeholder/video/400/225",
    description: "Create compelling content that converts prospects into loyal customers",
    thumbnailUrl: "/api/placeholder/400/225"
  },
  {
    id: 5,
    title: "Advanced Sales Psychology",
    duration: "2h 15m",
    level: "advanced",
    progress: 100,
    hasVideo: true,
    videoUrl: "/api/placeholder/video/400/225",
    description: "Deep dive into the psychological triggers that drive purchasing decisions",
    thumbnailUrl: "/api/placeholder/400/225"
  },
  {
    id: 6,
    title: "Leadership Fundamentals",
    duration: "1h 29m",
    level: "intermediate",
    progress: null,
    hasVideo: false,
    description: "Essential leadership skills for managing teams and driving results",
    thumbnailUrl: "/api/placeholder/400/225"
  },
  {
    id: 7,
    title: "Digital Marketing Strategy",
    duration: "52 min",
    level: "beginner",
    progress: 15,
    hasVideo: true,
    videoUrl: "/api/placeholder/video/400/225",
    description: "Comprehensive guide to creating effective digital marketing campaigns",
    thumbnailUrl: "/api/placeholder/400/225"
  },
  {
    id: 8,
    title: "Productivity Systems",
    duration: "29 min",
    level: "DE+",
    progress: 80,
    hasVideo: false,
    description: "Build systems that maximize your productivity and minimize wasted time",
    thumbnailUrl: "/api/placeholder/400/225"
  }
];

function LibraryContent() {
  const { colors } = useTheme();
  const [activeNavItem, setActiveNavItem] = useState('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [selectedTags, setSelectedTags] = useState('All Tags');
  const [selectedDuration, setSelectedDuration] = useState('Any Duration');
  const [selectedLevel, setSelectedLevel] = useState('Any Level');
  const [selectedSort, setSelectedSort] = useState('Most Recent');

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    let filtered = [...sampleCourses];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query)
      );
    }

    // Tab filter
    if (activeTab !== 'All') {
      // Map tab names to course properties (simplified for demo)
      filtered = filtered.filter(course => {
        if (activeTab === 'Courses') return course.level.includes('+') || course.level === 'beginner' || course.level === 'intermediate' || course.level === 'advanced';
        if (activeTab === 'Masterclasses') return course.level === 'MC+';
        if (activeTab === 'Call Replays') return course.level === 'CR+';
        return true;
      });
    }

    // Level filter
    if (selectedLevel !== 'Any Level') {
      filtered = filtered.filter(course => 
        course.level.toLowerCase() === selectedLevel.toLowerCase()
      );
    }

    // Duration filter
    if (selectedDuration !== 'Any Duration') {
      filtered = filtered.filter(course => {
        const duration = course.duration;
        if (selectedDuration === '< 30 min') return duration.includes('min') && parseInt(duration) < 30;
        if (selectedDuration === '30-60 min') return duration.includes('min') && parseInt(duration) >= 30 && parseInt(duration) <= 60;
        if (selectedDuration === '1-2 hours') return duration.includes('h') && parseInt(duration) >= 1 && parseInt(duration) <= 2;
        if (selectedDuration === '2+ hours') return duration.includes('h') && parseInt(duration) > 2;
        return true;
      });
    }

    // Sort
    if (selectedSort === 'Alphabetical') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === 'Duration') {
      filtered.sort((a, b) => {
        const getDurationMinutes = (duration: string) => {
          if (duration.includes('h')) {
            const hours = parseInt(duration);
            const mins = duration.includes('min') ? parseInt(duration.split('h')[1]) : 0;
            return hours * 60 + mins;
          }
          return parseInt(duration);
        };
        return getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
      });
    }

    return filtered;
  }, [searchQuery, activeTab, selectedLevel, selectedDuration, selectedSort]);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    return {
      'All': sampleCourses.length,
      'Courses': sampleCourses.filter(c => c.level.includes('+') || ['beginner', 'intermediate', 'advanced'].includes(c.level)).length,
      'Masterclasses': sampleCourses.filter(c => c.level === 'MC+').length,
      'Call Replays': sampleCourses.filter(c => c.level === 'CR+').length
    };
  }, []);

  const handleStartCourse = (courseId: number) => {
    console.log('Starting course:', courseId);
    // In a real app, navigate to the course page
    alert(`Starting course ${courseId}`);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activeItem={activeNavItem} onItemChange={setActiveNavItem} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className={`${colors.text} text-3xl font-bold mb-2`}>
                Explore the Library
              </h1>
              <p className={`${colors.textSecondary} text-lg`}>
                Deep dives, step by step trainings, and replays
              </p>
            </div>

            {/* Filter System */}
            <div className="mb-8">
              <FilterSystem
                activeTab={activeTab}
                onTabChange={setActiveTab}
                filterCounts={filterCounts}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                selectedDuration={selectedDuration}
                onDurationChange={setSelectedDuration}
                selectedLevel={selectedLevel}
                onLevelChange={setSelectedLevel}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
              />
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onStartCourse={handleStartCourse}
                />
              ))}
            </div>

            {/* No Results */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <p className={`${colors.textSecondary} text-lg`}>
                  No courses found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTab('All');
                    setSelectedTags('All Tags');
                    setSelectedDuration('Any Duration');
                    setSelectedLevel('Any Level');
                    setSelectedSort('Most Recent');
                  }}
                  className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export function DigitalEraLibrary() {
  return (
    <ThemeProvider>
      <LibraryContent />
    </ThemeProvider>
  );
}