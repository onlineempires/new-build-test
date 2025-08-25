import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import AppLayout from '../../../../components/layout/AppLayout';
import { getCourseLessons, type Lesson } from '../../../../utils/courseRouting';
import { getLibraryItemBySlug } from '../../../../lib/api/library';
import { LibraryItem } from '../../../../types/library';
import { useLessonProgress } from '../../../../hooks/useLessonProgress';
import { findLibraryCourseByLesson, LibraryCourse } from '../../../../lib/courseMapping';
import { checkAdvancedTrainingAccess, User, AccessResult } from '../../../../utils/accessControl';

// Mock user data - in production this would come from authentication
const mockUser = {
  id: 1,
  name: 'Ashley Kemp',
  avatarUrl: '/images/avatar.jpg'
};

interface LessonPageProps {
  course?: {
    id: string;
    title: string;
    description: string;
  };
  libraryCourse?: LibraryCourse;
  libraryCourseId?: string;
  accessVerified?: boolean;
}

export default function LessonPage({ course, libraryCourse: propLibraryCourse, libraryCourseId: propLibraryCourseId, accessVerified }: LessonPageProps) {
  const router = useRouter();
  const { courseSlug, lessonSlug, from, courseId } = router.query;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [courseItem, setCourseItem] = useState<LibraryItem | null>(null);
  const [libraryCourse, setLibraryCourse] = useState<LibraryCourse | null>(propLibraryCourse || null);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'resources' | 'transcript'>('resources');
  const [accessResult, setAccessResult] = useState<AccessResult | null>(null);
  const [isAccessLoading, setIsAccessLoading] = useState(true);
  
  // Check if this lesson was accessed from the library
  const isFromLibrary = from === 'library';
  const libraryCourseId = courseId as string;
  
  // Mock user for access control
  const user: User = {
    id: 1,
    name: 'Ashley Kemp',
    email: 'ashley@example.com',
    membershipLevel: 'monthly',
    subscriptionStatus: 'active'
  };
  
  // Use the new lesson progress hook
  const { progress, loading: progressLoading, toggleCompleted, setWatchedPct } = useLessonProgress(
    courseSlug as string || '',
    lessonSlug as string || ''
  );

  // Mock video URL - replace with actual video URL from lesson data
  const demoVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  useEffect(() => {
    if (courseSlug && typeof courseSlug === 'string') {
      const courseLessons = getCourseLessons(courseSlug);
      setLessons(courseLessons);

      // Get course info from library
      getLibraryItemBySlug(courseSlug).then(item => {
        setCourseItem(item);
      });
      
      // If accessed from library, get the mapped course info and check access
      if (isFromLibrary && lessonSlug && typeof lessonSlug === 'string') {
        // If we already have server-verified access, use that
        if (accessVerified && propLibraryCourse) {
          setLibraryCourse(propLibraryCourse);
          setAccessResult({ hasAccess: true });
        } else {
          // Client-side fallback for courses not caught by server-side check
          const mappedCourse = findLibraryCourseByLesson(courseSlug, lessonSlug);
          if (mappedCourse) {
            setLibraryCourse(mappedCourse.course);
            
            // Check access for this specific course
            const access = checkAdvancedTrainingAccess(user, mappedCourse.course.accessLevel);
            setAccessResult(access);
            
            if (!access.hasAccess) {
              // If no access, redirect to upgrade page after a brief delay
              setTimeout(() => {
                router.push(access.upgradeUrl || '/upgrade');
              }, 2000);
            }
          }
        }
      }
      
      setIsAccessLoading(false);

      // Find current lesson
      if (lessonSlug && typeof lessonSlug === 'string') {
        const lesson = courseLessons.find(l => l.id === lessonSlug);
        setCurrentLesson(lesson || courseLessons[0]);
      } else {
        setCurrentLesson(courseLessons[0]);
      }
    }
  }, [courseSlug, lessonSlug]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const video = document.querySelector('video') as HTMLVideoElement;
      
      switch (e.key.toLowerCase()) {
        case 'k':
          e.preventDefault();
          if (video) {
            if (video.paused) {
              video.play();
            } else {
              video.pause();
            }
          }
          break;
        case 'j':
          e.preventDefault();
          if (video) {
            video.currentTime = Math.max(0, video.currentTime - 10);
          }
          break;
        case 'l':
          e.preventDefault();
          if (video) {
            video.currentTime = Math.min(video.duration, video.currentTime + 10);
          }
          break;
        case 'n':
          if (e.shiftKey) {
            e.preventDefault();
            const nextLesson = getNextLesson();
            if (nextLesson) {
              handleLessonSelect(nextLesson);
            }
          }
          break;
        case 'p':
          if (e.shiftKey) {
            e.preventDefault();
            const prevLesson = getPrevLesson();
            if (prevLesson) {
              handleLessonSelect(prevLesson);
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [lessons, currentLesson]);

  const handleLessonSelect = (lesson: Lesson) => {
    if (lesson.isLocked) return;
    
    setCurrentLesson(lesson);
    router.push(`/learn/${courseSlug}/lesson/${lesson.id}`, undefined, { shallow: true });
    setIsPlaylistOpen(false);

    // Scroll to player with header offset
    setTimeout(() => {
      const playerElement = document.querySelector('#video-player');
      if (playerElement) {
        const headerHeight = 80; // Approximate header height
        const elementPosition = playerElement.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - headerHeight,
          behavior: 'smooth'
        });
      }
    }, 100);

    // Track lesson opened event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('learn_lesson_opened', {
        detail: {
          courseSlug: courseSlug as string,
          lessonSlug: lesson.id,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCurrentLessonIndex = () => {
    return lessons.findIndex(l => l.id === currentLesson?.id);
  };

  const getNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  };

  const getPrevLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex > 0 ? lessons[currentIndex - 1] : null;
  };

  const handleMarkComplete = (completed: boolean) => {
    // Use the hook's toggleCompleted function for proper persistence
    toggleCompleted(completed);
    
    // Update the lessons array to reflect in sidebar immediately
    if (currentLesson) {
      const updatedLessons = lessons.map(lesson => 
        lesson.id === currentLesson.id 
          ? { ...lesson, isCompleted: completed }
          : lesson
      );
      setLessons(updatedLessons);

      // Also update current lesson
      setCurrentLesson({ ...currentLesson, isCompleted: completed });
    }
  };

  // Load completion status for all lessons from localStorage when they are first loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && courseSlug && lessons.length > 0) {
      // Check if lessons already have completion status loaded
      const hasCompletionData = lessons.some(lesson => lesson.hasOwnProperty('isCompleted'));
      
      if (!hasCompletionData || lessons.some(lesson => lesson.isCompleted === undefined)) {
        // Load completion status for all lessons from localStorage with new key format
        const updatedLessons = lessons.map(lesson => {
          const key = `prog:mock-user:${courseSlug}:${lesson.id}`;
          try {
            const cached = localStorage.getItem(key);
            const isCompleted = cached ? JSON.parse(cached).completed || false : false;
            return { ...lesson, isCompleted };
          } catch (e) {
            return { ...lesson, isCompleted: false };
          }
        });
        setLessons(updatedLessons);
      }
    }
  }, [courseSlug, lessons.length]);

  // Update current lesson completion status when progress changes
  useEffect(() => {
    if (currentLesson && progress.completed !== currentLesson.isCompleted) {
      const updatedCurrentLesson = { ...currentLesson, isCompleted: progress.completed };
      setCurrentLesson(updatedCurrentLesson);
      
      // Also update in the lessons array
      setLessons(prevLessons => 
        prevLessons.map(lesson => 
          lesson.id === currentLesson.id 
            ? { ...lesson, isCompleted: progress.completed }
            : lesson
        )
      );
    }
  }, [progress.completed, currentLesson?.id]);

  // Show loading state
  if (!currentLesson || !courseItem || isAccessLoading) {
    return (
      <AppLayout user={mockUser}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-700 text-lg">Loading lesson...</p>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  // Show access denied state for library courses (client-side fallback)
  if (isFromLibrary && accessResult && !accessResult.hasAccess && !accessVerified) {
    return (
      <AppLayout user={mockUser}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-lock text-red-600 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Restricted
            </h2>
            <p className="text-gray-600 mb-6">
              {accessResult.reason}
            </p>
            {libraryCourse && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>{libraryCourse.title}</strong> requires {accessResult.requiredPlan} membership to access.
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => router.push('/library')}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Back to Library
              </button>
              <button 
                onClick={() => router.push(accessResult.upgradeUrl || '/upgrade')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Upgrade Now
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Redirecting to upgrade page in a few seconds...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const courseTitle = courseItem.title;

  return (
    <AppLayout user={mockUser}>
      <Head>
        <title>{currentLesson.title} - {courseTitle}</title>
        <meta name="description" content={`Learn ${currentLesson.title} in this comprehensive lesson.`} />
      </Head>

      {/* Light Theme Main Container */}
      <div className="min-h-screen bg-gray-50">
        
        {/* Light Theme Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            
            {/* Enhanced Breadcrumb Navigation with Library Context */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <button 
                onClick={() => router.push('/dashboard')}
                className="hover:text-gray-700 transition-colors"
              >
                Dashboard
              </button>
              <i className="fas fa-chevron-right text-xs"></i>
              
              {isFromLibrary ? (
                // Breadcrumb when accessed from library
                <>
                  <button 
                    onClick={() => router.push('/library')}
                    className="hover:text-gray-700 transition-colors flex items-center space-x-1"
                  >
                    <i className="fas fa-book text-xs"></i>
                    <span>Library</span>
                  </button>
                  <i className="fas fa-chevron-right text-xs"></i>
                  {libraryCourse && (
                    <>
                      <span className="text-gray-700 font-medium">{libraryCourse.title}</span>
                      <i className="fas fa-chevron-right text-xs"></i>
                    </>
                  )}
                  <span className="text-gray-900 font-medium">{currentLesson.title}</span>
                </>
              ) : (
                // Standard breadcrumb for Advanced Training
                <>
                  <button 
                    onClick={() => router.push('/library')}
                    className="hover:text-gray-700 transition-colors"
                  >
                    Advanced Training
                  </button>
                  <i className="fas fa-chevron-right text-xs"></i>
                  <button 
                    onClick={() => router.push(`/learn/${courseSlug}`)}
                    className="hover:text-gray-700 transition-colors"
                  >
                    {courseTitle}
                  </button>
                  <i className="fas fa-chevron-right text-xs"></i>
                  <span className="text-gray-900 font-medium">{currentLesson.title}</span>
                </>
              )}
            </div>
            
            {/* Library Context Indicator */}
            {isFromLibrary && libraryCourse && (
              <div className="flex items-center space-x-3 mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-book text-blue-600 text-sm"></i>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900">
                    Accessed from Library: {libraryCourse.title}
                  </p>
                  <p className="text-xs text-blue-700">
                    {libraryCourse.level} • {libraryCourse.duration} • {libraryCourse.category}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button 
                    onClick={() => router.push('/library')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    ← Back to Library
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Main Content Layout - Match Existing Design */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Content - Video & Lesson Overview */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Video Player - Keep Dark for Video */}
              <div id="video-player" className="bg-black rounded-xl overflow-hidden shadow-lg">
                <video
                  key={currentLesson.id}
                  controls
                  className="w-full aspect-video"
                  poster={`https://picsum.photos/seed/${currentLesson.id}/1280/720`}
                  onLoadedData={() => {
                    // Emit lesson opened event
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('learn_lesson_opened', {
                        detail: {
                          courseSlug: courseSlug as string,
                          lessonSlug: currentLesson.id,
                          timestamp: new Date().toISOString()
                        }
                      }));
                    }
                  }}
                  onTimeUpdate={(e) => {
                    const video = e.target as HTMLVideoElement;
                    if (video.duration && video.duration > 0) {
                      const watchedPct = Math.round((video.currentTime / video.duration) * 100);
                      // Only update if it's a meaningful change (every 5% or so)
                      if (watchedPct % 5 === 0 && watchedPct !== progress.watchedPct) {
                        setWatchedPct(watchedPct);
                      }
                    }
                  }}
                >
                  <source src={demoVideoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                {getPrevLesson() ? (
                  <button 
                    onClick={() => handleLessonSelect(getPrevLesson()!)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-gray-300"
                  >
                    <i className="fas fa-step-backward text-sm"></i>
                    <span className="hidden sm:inline">Previous Lesson</span>
                    <span className="sm:hidden">Previous</span>
                  </button>
                ) : (
                  <div></div>
                )}
                
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleMarkComplete(!progress.completed)}
                    disabled={progressLoading}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                      progress.completed
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-300'
                    }`}
                  >
                    <i className="fas fa-check text-sm"></i>
                    <span>{progress.completed ? 'Completed' : 'Mark Complete'}</span>
                  </button>
                </div>
                
                {getNextLesson() ? (
                  <button 
                    onClick={() => {
                      const nextLesson = getNextLesson()!;
                      router.push(`/learn/${courseSlug}/lesson/${nextLesson.id}`);
                    }}
                    disabled={!progress.completed && progress.watchedPct < 80}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                      progress.completed || progress.watchedPct >= 80
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span className="hidden sm:inline">Next Lesson</span>
                    <span className="sm:hidden">Next</span>
                    <i className="fas fa-step-forward text-sm"></i>
                    {!progress.completed && progress.watchedPct < 80 && (
                      <i className="fas fa-lock text-xs ml-1"></i>
                    )}
                  </button>
                ) : (
                  <button 
                    onClick={() => router.push('/library')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                  >
                    <i className="fas fa-check text-sm"></i>
                    <span>Course Complete!</span>
                  </button>
                )}
              </div>
              
              {/* Light Theme Lesson Overview */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lesson Overview</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Learn the essential concepts and practical applications for mastering this topic.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Takeaways:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-check w-3 h-3 text-green-600"></i>
                    </div>
                    <span className="text-gray-700">Understanding core distribution channels</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-check w-3 h-3 text-green-600"></i>
                    </div>
                    <span className="text-gray-700">Platform-specific optimization strategies</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-check w-3 h-3 text-green-600"></i>
                    </div>
                    <span className="text-gray-700">Measuring distribution effectiveness</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-6 text-gray-500">
                  <i className="fas fa-clock w-4 h-4"></i>
                  <span className="text-sm">Estimated time: {formatDuration(currentLesson.duration)}</span>
                </div>
              </div>
              
            </div>
            
            {/* Right Sidebar - Match Existing Design */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                
                {/* Light Theme Your Progress */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Module Progress</span>
                      <span className="text-sm font-medium text-gray-900">{getCurrentLessonIndex() + 1} of {lessons.length} lessons</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${((getCurrentLessonIndex() + 1) / lessons.length) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Course Progress</span>
                      <span className="text-sm font-medium text-gray-900">0 of 35 lessons</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-sm text-gray-600">XP Earned</span>
                      <span className="text-sm font-medium text-green-600">+25 XP</span>
                    </div>
                  </div>
                </div>
                
                {/* Light Theme Lesson Materials */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Materials</h3>
                  
                  <div className="space-y-3">
                    <a href="#" className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group border border-gray-200">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-file-alt text-red-600 text-sm"></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-red-700">
                          Lesson Workbook
                        </div>
                        <div className="text-xs text-gray-500">
                          PDF • 2.3 MB
                        </div>
                      </div>
                      <i className="fas fa-download text-gray-400 group-hover:text-gray-600 w-4 h-4"></i>
                    </a>
                    
                    <a href="#" className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group border border-gray-200">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-file-alt text-blue-600 text-sm"></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                          Additional Resources
                        </div>
                        <div className="text-xs text-gray-500">
                          DOCX • 856 KB
                        </div>
                      </div>
                      <i className="fas fa-download text-gray-400 group-hover:text-gray-600 w-4 h-4"></i>
                    </a>
                  </div>
                </div>
                
                {/* Light Theme What's Next */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What's Next?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Choose how you want to continue
                  </p>
                  
                  <div className="space-y-3">
                    {getNextLesson() ? (
                      <button 
                        onClick={() => {
                          const nextLesson = getNextLesson()!;
                          router.push(`/learn/${courseSlug}/lesson/${nextLesson.id}`);
                        }}
                        disabled={!progress.completed && progress.watchedPct < 80}
                        className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors font-medium ${
                          progress.completed || progress.watchedPct >= 80
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <i className="fas fa-play w-4 h-4"></i>
                        <span>Continue to Next Lesson</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => router.push('/library')}
                        className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                      >
                        <i className="fas fa-check w-4 h-4"></i>
                        <span>Course Complete!</span>
                      </button>
                    )}
                    
                    <button 
                      onClick={() => router.push(`/learn/${courseSlug}`)}
                      className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm border border-gray-300"
                    >
                      <i className="fas fa-arrow-left w-4 h-4"></i>
                      <span>Back to Course</span>
                    </button>
                    
                    <button className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm border border-gray-300">
                      <i className="fas fa-download w-4 h-4"></i>
                      <span>Download Resources</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="mark-complete-sidebar"
                        checked={progress.completed}
                        onChange={(e) => handleMarkComplete(e.target.checked)}
                        disabled={progressLoading}
                        className="w-4 h-4 text-green-500 bg-white border-gray-300 rounded focus:ring-green-500"
                      />
                      <label htmlFor="mark-complete-sidebar" className="text-sm text-gray-700 cursor-pointer">
                        Mark lesson as complete
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Light Theme Upgrade Banner */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl p-6 text-white shadow-lg">
                  <div className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded mb-3">
                    LIMITED TIME
                  </div>
                  <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
                  <p className="text-purple-100 text-sm mb-4">
                    Get unlimited access to all courses
                  </p>
                  <div className="text-2xl font-bold mb-4">
                    $799<span className="text-lg font-normal">/year</span>
                  </div>
                  <button className="w-full bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors">
                    Upgrade Now
                  </button>
                </div>
                
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </AppLayout>
  );
}



// Server-side access verification for library courses
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { courseSlug, lessonSlug, from, courseId } = context.query;
  
  // If accessed from library, verify access on server-side
  if (from === 'library' && courseSlug && lessonSlug) {
    try {
      // Find the mapped course
      const mappedCourse = findLibraryCourseByLesson(
        courseSlug as string, 
        lessonSlug as string
      );
      
      if (mappedCourse) {
        // Mock user data (in production, get from session/auth)
        const user: User = {
          id: 1,
          name: 'Ashley Kemp',
          email: 'ashley@example.com',
          membershipLevel: 'monthly',
          subscriptionStatus: 'active'
        };
        
        // Check access
        const accessResult = checkAdvancedTrainingAccess(user, mappedCourse.course.accessLevel);
        
        if (!accessResult.hasAccess) {
          // Redirect to upgrade page if no access
          return {
            redirect: {
              destination: accessResult.upgradeUrl || '/upgrade',
              permanent: false,
            },
          };
        }
        
        // Pass course info as props
        return {
          props: {
            libraryCourse: mappedCourse.course,
            libraryCourseId: mappedCourse.id,
            accessVerified: true,
          },
        };
      }
    } catch (error) {
      console.error('Server-side access check failed:', error);
      // Continue to regular lesson page if mapping check fails
    }
  }
  
  return {
    props: {},
  };
};