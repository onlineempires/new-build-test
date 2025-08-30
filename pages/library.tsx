import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import { getAllCourses, CourseData, Course } from '../lib/api/courses';
import { Play, Clock, BookOpen, Trophy, Lock } from 'lucide-react';
import { useThemeCanvasV1, useThemeCanvasClass } from '../contexts/ThemeContext';

// Mock user data - same as existing courses page
const mockUser = {
  id: 123,
  name: 'Ashley Kemp',
  avatarUrl: '/default-avatar.png'
};

interface CourseCardProps {
  course: Course;
  section: 'start' | 'advanced';
  onClick: () => void;
  canvasEnabled?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, section, onClick, canvasEnabled = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getLevelBadgeColor = (sectionType: string) => {
    switch (sectionType) {
      case 'start':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getButtonText = () => {
    if (course.progress === 100) return 'Replay Course';
    if (course.progress && course.progress > 0) return 'Continue Course';
    return 'Start Course';
  };

  const getButtonIcon = () => {
    if (course.progress === 100) return 'fas fa-redo';
    if (course.progress && course.progress > 0) return 'fas fa-play';
    return 'fas fa-rocket';
  };

  const getProgressColor = () => {
    if (course.progress === 100) return 'bg-green-500';
    if (course.progress && course.progress > 0) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  const getSectionBadge = () => {
    if (section === 'start') return { text: 'Foundation', color: 'bg-blue-500' };
    if (section === 'advanced') return { text: 'Advanced', color: 'bg-purple-500' };
    return { text: 'Course', color: 'bg-gray-500' };
  };

  const sectionBadge = getSectionBadge();

  return (
    <div 
      className={canvasEnabled ? `
        card-item hover-overlay overflow-hidden cursor-pointer group
        ${isHovered ? 'shadow-lg' : ''}
      ` : `
        bg-white border border-gray-200 rounded-xl overflow-hidden
        transition-all duration-300 ease-out cursor-pointer group
        hover:shadow-lg hover:border-gray-300 hover:-translate-y-1
        ${isHovered ? 'shadow-lg' : 'shadow-sm'}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Course Video/Image Area */}
      <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
        
        {/* Section Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`${sectionBadge.color} text-white px-2 py-1 rounded-full text-xs font-medium`}>
            {sectionBadge.text}
          </span>
        </div>

        {/* Progress Badge */}
        {course.progress !== undefined && course.progress > 0 && (
          <div className="absolute top-3 right-3 z-10 flex items-center space-x-2">
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
              {course.progress}%
            </span>
          </div>
        )}

        {/* Course Icon/Visual */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-20 text-gray-400">
            {course.id === 'business-blueprint' ? '🏢' : 
             course.id === 'discovery-process' ? '🔍' : 
             course.id === 'next-steps' ? '📈' : 
             course.id === 'tiktok-mastery' ? '🎵' : 
             course.id === 'facebook-advertising' ? '📱' : 
             course.id === 'instagram-marketing' ? '📸' : 
             course.id === 'sales-funnel-mastery' ? '🧠' : 
             '📚'}
          </div>
        </div>

        {/* Play Button Overlay */}
        <div className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-300
          ${isHovered ? 'bg-black/30' : 'bg-transparent'}
        `}>
          <div className={`
            bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg
            transition-all duration-300
            ${isHovered ? 'scale-110 shadow-xl' : 'scale-100'}
          `}>
            <Play className="w-6 h-6 text-gray-700" fill="currentColor" />
          </div>
        </div>
        
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        
        {/* Level Badge */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelBadgeColor(section)}`}>
            {section === 'start' ? 'Beginner' : 'Advanced'}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <Trophy className="w-3 h-3 mr-1" />
            +{course.lessonCount * (section === 'start' ? 15 : 20)} XP
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <BookOpen className="w-3 h-3 mr-1" />
            <span>{course.lessonCount} lessons</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{Math.round(course.lessonCount * (section === 'start' ? 0.17 : 0.2))}h</span>
          </div>
        </div>

        {/* Progress Bar */}
        {course.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 font-medium">Progress</span>
              <span className="text-gray-900 font-semibold">
                {course.progress === 100 ? 'Completed!' : `${course.progress}%`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor()}`}
                style={{ width: `${course.progress || 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button 
          className={`
            w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg 
            font-medium text-sm transition-all duration-200
            ${course.progress === 100 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : course.progress && course.progress > 0
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
            }
          `}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <i className={`${getButtonIcon()} text-sm`}></i>
          <span>{getButtonText()}</span>
        </button>
      </div>
    </div>
  );
};

export default function LibraryPage() {
  const router = useRouter();
  const [data, setData] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'foundation' | 'advanced'>('all');

  // Theme canvas integration
  const canvasEnabled = useThemeCanvasV1();
  const pageCanvasClass = useThemeCanvasClass('page-canvas', 'min-h-screen bg-gray-50');

  // Load course data - same as All Courses page
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const coursesData = await getAllCourses();
        setData(coursesData);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Navigate to existing course pages - SAME as All Courses page
  const goToCourse = (course: Course) => {
    console.log('Navigating to existing course:', course.title);
    // Use the SAME navigation as All Courses page
    router.push(`/courses/${course.id}`);
  };

  // Filter courses based on active filter
  const filteredCourses = useMemo(() => {
    if (!data) return { startHereCourses: [], socialMediaCourses: [] };
    
    const result = {
      startHereCourses: data.startHereCourses,
      socialMediaCourses: data.socialMediaCourses
    };

    if (activeFilter === 'foundation') {
      result.socialMediaCourses = [];
    } else if (activeFilter === 'advanced') {
      result.startHereCourses = [];
    }

    return result;
  }, [data, activeFilter]);

  const getTotalCourses = () => {
    if (!data) return 0;
    return data.startHereCourses.length + data.socialMediaCourses.length;
  };

  const getFilterCounts = () => {
    if (!data) return { all: 0, foundation: 0, advanced: 0 };
    return {
      all: data.startHereCourses.length + data.socialMediaCourses.length,
      foundation: data.startHereCourses.length,
      advanced: data.socialMediaCourses.length
    };
  };

  const filterCounts = getFilterCounts();

  if (isLoading) {
    return (
      <AppLayout user={mockUser}>
        <div className={pageCanvasClass}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Loading Header */}
            <div className="mb-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>
            
            {/* Loading Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={mockUser}>
      <Head>
        <title>Library - Digital Era</title>
        <meta name="description" content="Explore our course library with the same courses as All Courses, featuring our new sleek design" />
      </Head>

      <div className={pageCanvasClass}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Explore the Library
            </h1>
            <p className="text-gray-600 mb-2">
              Deep dives, step by step trainings, and replays
            </p>
            <p className="text-sm text-blue-600 font-medium">
              Same courses as "All Courses" with new design • {getTotalCourses()} courses available
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 mb-8 bg-gray-100 rounded-lg p-1 w-fit">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Courses
              <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {filterCounts.all}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('foundation')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'foundation'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Foundation
              <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                {filterCounts.foundation}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('advanced')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'advanced'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Advanced Training
              <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                {filterCounts.advanced}
              </span>
            </button>
          </div>

          {/* Course Grid with New Design */}
          <div className="space-y-12">
            
            {/* Foundation Courses */}
            {filteredCourses.startHereCourses.length > 0 && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-play text-sm"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Foundation Training</h2>
                    <p className="text-sm text-gray-600">Essential courses to build your online business foundation</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCourses.startHereCourses.map((course) => (
                    <CourseCard 
                      key={course.id}
                      course={course}
                      section="start"
                      onClick={() => goToCourse(course)}
                      canvasEnabled={canvasEnabled}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Advanced Courses */}
            {filteredCourses.socialMediaCourses.length > 0 && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-graduation-cap text-sm"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Advanced Training</h2>
                    <p className="text-sm text-gray-600">Specialized courses for scaling your business</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCourses.socialMediaCourses.map((course) => (
                    <CourseCard 
                      key={course.id}
                      course={course}
                      section="advanced"
                      onClick={() => goToCourse(course)}
                      canvasEnabled={canvasEnabled}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Empty State */}
          {!isLoading && filteredCourses.startHereCourses.length === 0 && filteredCourses.socialMediaCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filter to see more courses.
              </p>
              <button
                onClick={() => setActiveFilter('all')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                View All Courses
              </button>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}

// Use server-side props for consistency with All Courses page
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};