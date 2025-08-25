import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import { getAllCourses, CourseData, Course } from '../lib/api/courses';
import { Play, Clock, BookOpen, Trophy, Lock } from 'lucide-react';

// Mock user data - same as existing courses page
const mockUser = {
  id: 123,
  name: 'Ashley Kemp',
  avatarUrl: '/default-avatar.png'
};

interface CourseCardProps {
  course: Course | MasterclassCourse;
  section: 'start' | 'advanced' | 'masterclass';
  onClick: () => void;
}

interface MasterclassCourse {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  price: number;
  progress?: number;
  isCompleted?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, section, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getLevelBadgeColor = (sectionType: string) => {
    switch (sectionType) {
      case 'start':
        return 'theme-bg-secondary theme-text-primary theme-border';
      case 'advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'masterclass':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
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
    if (course.progress && course.progress > 0) return 'theme-progress-fill';
    return 'bg-gray-300';
  };

  const getSectionBadge = () => {
    if (section === 'start') return { text: 'Foundation', color: 'chip-foundation' };
    if (section === 'advanced') return { text: 'Advanced', color: 'chip-advanced' };
    if (section === 'masterclass') return { text: 'Premium', color: 'chip-masterclass' };
    return { text: 'Course', color: 'theme-badge-primary' };
  };

  const sectionBadge = getSectionBadge();

  return (
    <div 
      className={`
        theme-card rounded-xl overflow-hidden
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
          <span className={`${sectionBadge.color} px-3 py-1 rounded-full text-xs font-bold uppercase letter-spacing-wide`}>
            {sectionBadge.text}
          </span>
        </div>

        {/* Progress Badge */}
        {course.progress !== undefined && course.progress > 0 && (
          <div className="absolute top-3 right-3 z-10 flex items-center space-x-2">
            <span className="bg-white/90 backdrop-blur-sm theme-text-primary text-xs font-medium px-2 py-1 rounded-full">
              {course.progress}%
            </span>
          </div>
        )}

        {/* Course Icon/Visual */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-20 theme-text-muted">
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
            {section === 'start' ? 'Beginner' : section === 'advanced' ? 'Advanced' : 'Expert'}
          </span>
          <div className="flex items-center text-xs theme-text-muted">
            <Trophy className="w-3 h-3 mr-1" />
            +{course.lessonCount * (section === 'start' ? 15 : section === 'advanced' ? 20 : 25)} XP
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold theme-text-primary leading-tight transition-colors" style={{color: isHovered ? 'var(--color-primary)' : undefined}}>
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm theme-text-secondary leading-relaxed line-clamp-2">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-xs theme-text-muted">
          <div className="flex items-center">
            <BookOpen className="w-3 h-3 mr-1" />
            <span>{course.lessonCount} lessons</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{Math.round(course.lessonCount * (section === 'start' ? 0.17 : section === 'advanced' ? 0.2 : 0.5))}h</span>
          </div>
        </div>

        {/* Progress Bar */}
        {course.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="theme-text-secondary font-medium">Progress</span>
              <span className="theme-text-primary font-semibold">
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

        {/* Action Button - FIXED: Use theme colors instead of gray */}
        <button 
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
          style={{
            backgroundColor: section === 'masterclass' 
              ? '#FF5722' // Orange for masterclass
              : course.progress === 100 
              ? 'var(--color-success)' // Green for completed
              : 'var(--color-primary)', // Use theme primary color
            color: section === 'masterclass'
              ? '#FFFFFF'
              : course.progress === 100
              ? 'var(--text-on-success)'
              : 'var(--text-on-primary)', // Use proper text contrast
            fontWeight: '600'
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            if (section === 'masterclass') {
              target.style.backgroundColor = '#E64A19'; // Darker orange on hover
            } else if (course.progress === 100) {
              target.style.backgroundColor = 'var(--color-success-hover)';
            } else {
              target.style.backgroundColor = 'var(--color-primary-hover)';
            }
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            if (section === 'masterclass') {
              target.style.backgroundColor = '#FF5722';
            } else if (course.progress === 100) {
              target.style.backgroundColor = 'var(--color-success)';
            } else {
              target.style.backgroundColor = 'var(--color-primary)';
            }
          }}
        >
          <i className={`${section === 'masterclass' ? 'fas fa-shopping-cart' : getButtonIcon()} text-sm`}></i>
          <span>{section === 'masterclass' ? `Buy Masterclass - $${(course as MasterclassCourse).price}` : getButtonText()}</span>
        </button>
      </div>
    </div>
  );
};

export default function LibraryPage() {
  const router = useRouter();
  const [data, setData] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'foundation' | 'advanced' | 'masterclass'>('all');

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

  // Masterclass courses data (same as All Courses page)
  const masterclassCourses: MasterclassCourse[] = [
    {
      id: 'email-marketing-secrets',
      title: 'Email Marketing Secrets',
      description: 'Build profitable email sequences and automated funnels that convert',
      lessonCount: 16,
      price: 49,
      progress: 0,
      isCompleted: false
    },
    {
      id: 'advanced-copywriting-masterclass',
      title: 'Advanced Copywriting Masterclass',
      description: 'Master the art of persuasive writing that sells and converts at scale',
      lessonCount: 20,
      price: 97,
      progress: 0,
      isCompleted: false
    },
    {
      id: 'scaling-systems-masterclass',
      title: 'Scaling Systems Masterclass',
      description: 'Build automated systems and processes to scale your business to 7-figures',
      lessonCount: 24,
      price: 197,
      progress: 0,
      isCompleted: false
    }
  ];

  // Filter courses based on active filter
  const filteredCourses = useMemo(() => {
    if (!data) return { startHereCourses: [], socialMediaCourses: [], masterclassCourses: [] };
    
    const result = {
      startHereCourses: data.startHereCourses,
      socialMediaCourses: data.socialMediaCourses,
      masterclassCourses: masterclassCourses
    };

    if (activeFilter === 'foundation') {
      result.socialMediaCourses = [];
      result.masterclassCourses = [];
    } else if (activeFilter === 'advanced') {
      result.startHereCourses = [];
      result.masterclassCourses = [];
    } else if (activeFilter === 'masterclass') {
      result.startHereCourses = [];
      result.socialMediaCourses = [];
    }

    return result;
  }, [data, activeFilter]);

  const getTotalCourses = () => {
    if (!data) return 0;
    return data.startHereCourses.length + data.socialMediaCourses.length + masterclassCourses.length;
  };

  const getFilterCounts = () => {
    if (!data) return { all: 0, foundation: 0, advanced: 0, masterclass: 0 };
    return {
      all: data.startHereCourses.length + data.socialMediaCourses.length + masterclassCourses.length,
      foundation: data.startHereCourses.length,
      advanced: data.socialMediaCourses.length,
      masterclass: masterclassCourses.length
    };
  };

  const filterCounts = getFilterCounts();

  if (isLoading) {
    return (
      <AppLayout user={mockUser}>
        <div className="min-h-screen theme-bg">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Loading Header */}
            <div className="mb-8 animate-pulse">
              <div className="h-8 theme-card rounded w-64 mb-2"></div>
              <div className="h-4 theme-card rounded w-96"></div>
            </div>
            
            {/* Loading Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="theme-card rounded-xl overflow-hidden animate-pulse">
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

      <div className="min-h-screen theme-bg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold theme-text-primary mb-2">
              Explore the Library
            </h1>
            <p className="theme-text-secondary mb-2">
              Deep dives, step by step trainings, and replays
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
              Same courses as "All Courses" with new design • {getTotalCourses()} courses available
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 mb-8 theme-hover rounded-lg p-1 w-fit" style={{ backgroundColor: 'var(--color-hover)' }}>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-white theme-text-primary shadow-sm'
                  : 'theme-text-secondary hover:theme-text-primary'
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
                  ? 'bg-white theme-text-primary shadow-sm'
                  : 'theme-text-secondary hover:theme-text-primary'
              }`}
            >
              Foundation
              <span className="ml-2 theme-badge-primary px-2 py-0.5 rounded-full text-xs">
                {filterCounts.foundation}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('advanced')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'advanced'
                  ? 'bg-white theme-text-primary shadow-sm'
                  : 'theme-text-secondary hover:theme-text-primary'
              }`}
            >
              Advanced Training
              <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                {filterCounts.advanced}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('masterclass')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'masterclass'
                  ? 'bg-white theme-text-primary shadow-sm'
                  : 'theme-text-secondary hover:theme-text-primary'
              }`}
            >
              Masterclass Training
              <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                {filterCounts.masterclass}
              </span>
            </button>
          </div>

          {/* Course Grid with New Design */}
          <div className="space-y-12">
            
            {/* Foundation Courses */}
            {filteredCourses.startHereCourses.length > 0 && (
              <div>
                <div className="foundation-header">
                  <div className="icon-container">
                    <i className="fas fa-play text-sm"></i>
                  </div>
                  <div>
                    <h2 className="foundation-title">Foundation Training</h2>
                    <p className="foundation-description">Essential courses to build your online business foundation</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCourses.startHereCourses.map((course) => (
                    <CourseCard 
                      key={course.id}
                      course={course}
                      section="start"
                      onClick={() => goToCourse(course)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Advanced Courses */}
            {filteredCourses.socialMediaCourses.length > 0 && (
              <div>
                <div className="foundation-header">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--color-secondary)' }}>
                    <i className="fas fa-graduation-cap text-lg" style={{ color: 'var(--text-on-secondary)' }}></i>
                  </div>
                  <div>
                    <h2 className="section-header">Advanced Training</h2>
                    <p className="section-description">Specialized courses for scaling your business</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCourses.socialMediaCourses.map((course) => (
                    <CourseCard 
                      key={course.id}
                      course={course}
                      section="advanced"
                      onClick={() => goToCourse(course)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Masterclass Courses */}
            {filteredCourses.masterclassCourses.length > 0 && (
              <div>
                <div className="foundation-header">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl flex items-center justify-center mr-4">
                    <i className="fas fa-crown text-lg"></i>
                  </div>
                  <div>
                    <h2 className="section-header">Masterclass Training</h2>
                    <p className="section-description">Premium courses for advanced business growth</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCourses.masterclassCourses.map((course) => (
                    <CourseCard 
                      key={course.id}
                      course={course}
                      section="masterclass"
                      onClick={() => {
                        console.log('Masterclass purchase clicked:', course.title);
                        // Handle masterclass purchase logic here
                        alert(`Purchasing ${course.title} for $${course.price}`);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Empty State */}
          {!isLoading && filteredCourses.startHereCourses.length === 0 && filteredCourses.socialMediaCourses.length === 0 && filteredCourses.masterclassCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold theme-text-primary mb-2">
                No courses found
              </h3>
              <p className="theme-text-secondary mb-4">
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