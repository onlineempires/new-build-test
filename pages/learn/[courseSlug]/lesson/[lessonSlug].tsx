import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '../../../../components/layout/AppLayout';
import { getCourseLessons, type Lesson } from '../../../../utils/courseRouting';
import { getLibraryItemBySlug } from '../../../../lib/api/library';
import { LibraryItem } from '../../../../types/library';

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
  const [isLessonComplete, setIsLessonComplete] = useState(false);

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
    setIsLessonComplete(completed);
    
    // Update the lesson data directly to reflect in sidebar
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
    
    // Persist completion status to localStorage
    if (typeof window !== 'undefined' && courseSlug && currentLesson) {
      const completionKey = `lesson_complete_${courseSlug}_${currentLesson.id}`;
      if (completed) {
        localStorage.setItem(completionKey, 'true');
      } else {
        localStorage.removeItem(completionKey);
      }

      // Emit lesson completion event
      window.dispatchEvent(new CustomEvent('learn_lesson_completed', {
        detail: {
          courseSlug: courseSlug as string,
          lessonSlug: currentLesson.id,
          completed,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  // Load completion status for all lessons when they are first loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && courseSlug && lessons.length > 0) {
      // Check if lessons already have completion status loaded
      const hasCompletionData = lessons.some(lesson => lesson.hasOwnProperty('isCompleted'));
      
      if (!hasCompletionData || lessons.some(lesson => lesson.isCompleted === undefined)) {
        // Load completion status for all lessons from localStorage
        const updatedLessons = lessons.map(lesson => {
          const completionKey = `lesson_complete_${courseSlug}_${lesson.id}`;
          const isCompleted = localStorage.getItem(completionKey) === 'true';
          return { ...lesson, isCompleted };
        });
        setLessons(updatedLessons);
      }
    }
  }, [courseSlug, lessons.length]);

  // Update checkbox state when current lesson changes
  useEffect(() => {
    if (currentLesson && typeof window !== 'undefined' && courseSlug) {
      // Always check localStorage for the current lesson's completion status
      const completionKey = `lesson_complete_${courseSlug}_${currentLesson.id}`;
      const isCompleted = localStorage.getItem(completionKey) === 'true';
      
      // Update current lesson with completion status if needed
      if (currentLesson.isCompleted !== isCompleted) {
        const updatedCurrentLesson = { ...currentLesson, isCompleted };
        setCurrentLesson(updatedCurrentLesson);
        
        // Also update in the lessons array
        setLessons(prevLessons => 
          prevLessons.map(lesson => 
            lesson.id === currentLesson.id 
              ? { ...lesson, isCompleted }
              : lesson
          )
        );
      }
      
      setIsLessonComplete(isCompleted);
    }
  }, [currentLesson?.id, courseSlug]);

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

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Course Banner */}
        <div 
          className="relative w-full bg-slate-800 overflow-hidden rounded-2xl mb-6 h-[160px] sm:h-[180px] lg:h-[200px] xl:h-[220px]"
          style={{
            backgroundImage: `url(${courseItem.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
          
          {/* Content */}
          <div className="relative h-full flex items-end p-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-sm font-bold rounded-lg">
                  {courseItem.type === 'course' ? 'Course' : 
                   courseItem.type === 'masterclass' ? 'Masterclass' : 'Call Replay'}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold capitalize ${
                  courseItem.level === 'beginner' ? 'text-green-400 bg-green-400/10' :
                  courseItem.level === 'intermediate' ? 'text-yellow-400 bg-yellow-400/10' :
                  'text-red-400 bg-red-400/10'
                }`}>
                  {courseItem.level}
                </span>
                {courseItem.progressPct !== undefined && courseItem.progressPct > 0 && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-lg">
                    <i className="fas fa-chart-line mr-2"></i>
                    {courseItem.progressPct}% complete
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                {courseTitle}
              </h1>
            </div>
            
            {/* Mobile playlist toggle */}
            <button
              onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
              className="lg:hidden bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <i className="fas fa-list mr-2"></i>
              Lessons
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9">
            {/* Video Player */}
            <div id="video-player" className="bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-700/50 mb-6">
              <div className="aspect-video">
                <video
                  key={currentLesson.id}
                  controls
                  className="w-full h-full"
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
                >
                  <source src={demoVideoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Lesson Meta */}
            <section className="mt-6 rounded-2xl border border-white/10 bg-[#0b1220] text-white/90">
              <header className="px-6 pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-white/95">{currentLesson.title}</h2>
                    <p className="mt-1 text-sm text-white/60">
                      {formatDuration(currentLesson.duration)} • Lesson {getCurrentLessonIndex() + 1} of {lessons.length}
                    </p>
                  </div>
                  
                  {/* Mark as Complete Checkbox */}
                  <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-600/50">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isLessonComplete}
                        onChange={(e) => handleMarkComplete(e.target.checked)}
                        className="w-5 h-5 rounded border-2 border-slate-500 bg-slate-700 text-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
                      />
                      <span className={`text-sm font-medium transition-colors ${
                        isLessonComplete 
                          ? 'text-green-400' 
                          : 'text-white/70 hover:text-white/90'
                      }`}>
                        {isLessonComplete ? (
                          <span className="flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-400"></i>
                            Completed
                          </span>
                        ) : (
                          'Mark as Complete'
                        )}
                      </span>
                    </label>
                  </div>
                </div>
              </header>

              <nav className="mt-4 px-6 border-t border-white/10">
                <div className="flex space-x-8 text-white/80">
                  <button
                    onClick={() => setActiveTab('resources')}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'resources'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-white/60 hover:text-white/80'
                    }`}
                  >
                    Resources
                  </button>
                  <button
                    onClick={() => setActiveTab('transcript')}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'transcript'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-white/60 hover:text-white/80'
                    }`}
                  >
                    Transcript
                  </button>
                </div>
              </nav>

              <div className="px-6 pb-6">
                {activeTab === 'resources' ? (
                  <div className="text-white/86">
                    <p className="mb-4">Resources and additional materials for this lesson will appear here.</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-blue-400 hover:text-blue-300 cursor-pointer">
                        <i className="fas fa-file-pdf mr-2"></i>
                        <span>Lesson Notes (PDF)</span>
                      </div>
                      <div className="flex items-center text-blue-400 hover:text-blue-300 cursor-pointer">
                        <i className="fas fa-download mr-2"></i>
                        <span>Exercise Worksheet</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-white/86">
                    <p>Lesson transcript will be available here.</p>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  {getPrevLesson() && (
                    <button
                      onClick={() => handleLessonSelect(getPrevLesson()!)}
                      className="flex items-center justify-center px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                    >
                      <i className="fas fa-chevron-left mr-2"></i>
                      Previous Lesson
                    </button>
                  )}
                  
                  {getNextLesson() && (
                    <button
                      onClick={() => {
                        const nextLesson = getNextLesson()!;
                        handleLessonSelect(nextLesson);
                        // Emit next clicked event
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('learn_next_clicked', {
                            detail: {
                              fromLesson: currentLesson.id,
                              toLesson: nextLesson.id,
                              courseSlug: courseSlug as string,
                              timestamp: new Date().toISOString()
                            }
                          }));
                        }
                      }}
                      className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors sm:ml-auto"
                    >
                      Next Lesson
                      <i className="fas fa-chevron-right ml-2"></i>
                    </button>
                  )}
                </div>

                {/* Keyboard Hints */}
                <div className="pt-6 border-t border-white/10">
                  <p className="text-white/60 text-xs mb-2">Keyboard shortcuts:</p>
                  <div className="flex flex-wrap gap-4 text-white/60 text-xs">
                    <span><kbd className="bg-white/10 px-1 rounded text-white/80">K</kbd> Play/Pause</span>
                    <span><kbd className="bg-white/10 px-1 rounded text-white/80">J</kbd> Seek back</span>
                    <span><kbd className="bg-white/10 px-1 rounded text-white/80">L</kbd> Seek forward</span>
                    <span><kbd className="bg-white/10 px-1 rounded text-white/80">Shift+N</kbd> Next lesson</span>
                    <span><kbd className="bg-white/10 px-1 rounded text-white/80">Shift+P</kbd> Previous lesson</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Desktop Sidebar Playlist */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-height,64px)+16px)]">
              <PlaylistPanel 
                lessons={lessons}
                currentLesson={currentLesson}
                onLessonSelect={handleLessonSelect}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Playlist Drawer */}
      {isPlaylistOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsPlaylistOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-[#0b1220] border-t border-white/10 rounded-t-2xl max-h-[70vh] overflow-hidden pb-[calc(env(safe-area-inset-bottom)+16px)]">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white/95 font-semibold">Course Lessons</h3>
                <button
                  onClick={() => setIsPlaylistOpen(false)}
                  className="text-white/60 hover:text-white/90 w-10 h-10 flex items-center justify-center"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="overflow-y-auto">
              <PlaylistPanel 
                lessons={lessons}
                currentLesson={currentLesson}
                onLessonSelect={handleLessonSelect}
                isMobile
              />
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

// Playlist Panel Component
interface PlaylistPanelProps {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  onLessonSelect: (lesson: Lesson) => void;
  isMobile?: boolean;
}

function PlaylistPanel({ lessons, currentLesson, onLessonSelect, isMobile = false }: PlaylistPanelProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`rounded-2xl border border-white/10 bg-[#0b1220] text-white/90 ${isMobile ? '' : ''}`}>
      <h3 className="px-4 py-3 text-sm font-semibold text-white/90 border-b border-white/10">
        Course Content
      </h3>
      
      <div className={`${isMobile ? 'max-h-none' : 'max-h-96'} overflow-y-auto`}>
        {lessons.map((lesson, index) => {
          const isActive = currentLesson?.id === lesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => onLessonSelect(lesson)}
              disabled={lesson.isLocked}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
                isActive
                  ? 'bg-blue-600/10 border-l-2 border-blue-500/60 text-white'
                  : lesson.isLocked
                  ? 'opacity-50 cursor-not-allowed text-white/38'
                  : 'text-white/80 hover:bg-white/5'
              } ${isMobile ? 'min-h-[44px]' : ''}`}
            >
              <span className={`h-6 w-6 inline-flex items-center justify-center rounded-full text-xs ${
                lesson.isCompleted
                  ? 'bg-green-500 text-white'
                  : isActive
                  ? 'bg-blue-600/90 text-white'
                  : lesson.isLocked
                  ? 'bg-white/10 text-white/38'
                  : 'bg-white/10 text-white/70'
              }`}>
                {lesson.isCompleted ? (
                  <i className="fas fa-check"></i>
                ) : lesson.isLocked ? (
                  <i className="fas fa-lock"></i>
                ) : (
                  index + 1
                )}
              </span>
              <span className="flex-1 truncate font-medium text-sm">{lesson.title}</span>
              <span className="text-xs text-white/60">{formatDuration(lesson.duration)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// This page doesn't need getStaticProps/getServerSideProps for the mock data
// In production, you would fetch course and lesson data here
export async function getServerSideProps() {
  return {
    props: {}
  };
}