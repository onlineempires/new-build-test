import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '../../../../components/layout/AppLayout';
import { getCourseLessons, type Lesson } from '../../../../utils/courseRouting';
import { getLibraryItemBySlug } from '../../../../lib/api/library';
import { LibraryItem } from '../../../../types/library';
import { useLessonProgress } from '../../../../hooks/useLessonProgress';

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
}

export default function LessonPage({ course }: LessonPageProps) {
  const router = useRouter();
  const { courseSlug, lessonSlug } = router.query;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [courseItem, setCourseItem] = useState<LibraryItem | null>(null);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'resources' | 'transcript'>('resources');
  
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

  if (!currentLesson || !courseItem) {
    return (
      <AppLayout user={mockUser}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading lesson...</p>
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

      {/* Main Container - Match Existing Design */}
      <div className="bg-slate-900 min-h-screen">
        
        {/* Clean Header with Breadcrumbs Only */}
        <div className="bg-slate-800 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            
            {/* Breadcrumb Navigation - Exact Match */}
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <button 
                onClick={() => router.push('/dashboard')}
                className="hover:text-white transition-colors"
              >
                Dashboard
              </button>
              <i className="fas fa-chevron-right text-xs"></i>
              <button 
                onClick={() => router.push('/library')}
                className="hover:text-white transition-colors"
              >
                All Courses
              </button>
              <i className="fas fa-chevron-right text-xs"></i>
              <button 
                onClick={() => router.push(`/learn/${courseSlug}`)}
                className="hover:text-white transition-colors"
              >
                {courseTitle}
              </button>
              <i className="fas fa-chevron-right text-xs"></i>
              <span className="text-white">{currentLesson.title}</span>
            </div>
            
          </div>
        </div>

        {/* Main Content Layout - Match Existing Design */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Content - Video & Lesson Overview */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Video Player - Clean Design */}
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
              
              {/* Lesson Overview Section - Match Existing */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">Lesson Overview</h2>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Learn the essential concepts and practical applications for mastering this topic.
                </p>
                
                <h3 className="text-lg font-semibold text-white mb-4">Key Takeaways:</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check w-5 h-5 text-green-400 flex-shrink-0"></i>
                    <span className="text-slate-300">Understanding the core concepts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check w-5 h-5 text-green-400 flex-shrink-0"></i>
                    <span className="text-slate-300">Practical implementation strategies</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check w-5 h-5 text-green-400 flex-shrink-0"></i>
                    <span className="text-slate-300">Real-world examples and case studies</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-6 text-slate-400">
                  <i className="fas fa-clock w-4 h-4"></i>
                  <span className="text-sm">Estimated time: {formatDuration(currentLesson.duration)}</span>
                </div>
              </div>
              
            </div>
            
            {/* Right Sidebar - Match Existing Design */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                
                {/* Your Progress Section */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Your Progress</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Module Progress</span>
                      <span className="text-sm font-medium text-white">{getCurrentLessonIndex() + 1} of {lessons.length} lessons</span>
                    </div>
                    
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${((getCurrentLessonIndex() + 1) / lessons.length) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Course Progress</span>
                      <span className="text-sm font-medium text-white">0 of 35 lessons</span>
                    </div>
                    
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                      <span className="text-sm text-slate-300">XP Earned</span>
                      <span className="text-sm font-medium text-green-400">+25 XP</span>
                    </div>
                  </div>
                </div>
                
                {/* Lesson Materials Section */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Lesson Materials</h3>
                  
                  <div className="space-y-3">
                    <a href="#" className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors group">
                      <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-file-alt text-red-400 text-sm"></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white group-hover:text-red-300">
                          Lesson Workbook
                        </div>
                        <div className="text-xs text-slate-400">
                          PDF • 2.3 MB
                        </div>
                      </div>
                      <i className="fas fa-download text-slate-400 group-hover:text-white w-4 h-4"></i>
                    </a>
                    
                    <a href="#" className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors group">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-file-alt text-blue-400 text-sm"></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white group-hover:text-blue-300">
                          Additional Resources
                        </div>
                        <div className="text-xs text-slate-400">
                          DOCX • 856 KB
                        </div>
                      </div>
                      <i className="fas fa-download text-slate-400 group-hover:text-white w-4 h-4"></i>
                    </a>
                  </div>
                </div>
                
                {/* What's Next Section */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-2">What's Next?</h3>
                  <p className="text-sm text-slate-400 mb-4">
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
                        className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors ${
                          progress.completed || progress.watchedPct >= 80
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <i className="fas fa-play w-4 h-4"></i>
                        <span className="font-medium">Continue to Next Lesson</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => router.push('/library')}
                        className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors"
                      >
                        <i className="fas fa-check w-4 h-4"></i>
                        <span className="font-medium">Course Complete!</span>
                      </button>
                    )}
                    
                    <button 
                      onClick={() => router.push(`/learn/${courseSlug}`)}
                      className="w-full flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      <i className="fas fa-arrow-left w-4 h-4"></i>
                      <span>Back to Course</span>
                    </button>
                    
                    <button className="w-full flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg transition-colors text-sm">
                      <i className="fas fa-download w-4 h-4"></i>
                      <span>Download Resources</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="mark-complete"
                        checked={progress.completed}
                        onChange={(e) => handleMarkComplete(e.target.checked)}
                        disabled={progressLoading}
                        className="w-4 h-4 text-green-500 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                      />
                      <label htmlFor="mark-complete" className="text-sm text-slate-300 cursor-pointer">
                        Mark lesson as complete
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Upgrade Banner - Match Existing */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl p-6 text-white">
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
        </div>
        
      </div>


    </AppLayout>
  );
}



// This page doesn't need getStaticProps/getServerSideProps for the mock data
// In production, you would fetch course and lesson data here
export async function getServerSideProps() {
  return {
    props: {}
  };
}