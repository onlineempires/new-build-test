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
            <div className="bg-slate-900/30 rounded-2xl p-6 mb-6 border border-slate-800/50">
              <h2 className="text-2xl font-bold text-white mb-3">
                {currentLesson.title}
              </h2>
              
              <div className="flex items-center text-slate-400 text-sm mb-6">
                <span className="flex items-center mr-6">
                  <i className="fas fa-clock mr-2"></i>
                  {formatDuration(currentLesson.duration)}
                </span>
                <span className="flex items-center">
                  <i className="fas fa-list mr-2"></i>
                  Lesson {getCurrentLessonIndex() + 1} of {lessons.length}
                </span>
              </div>

              {/* Tabs */}
              <div className="border-b border-slate-800 mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('resources')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'resources'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    Resources
                  </button>
                  <button
                    onClick={() => setActiveTab('transcript')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'transcript'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    Transcript
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="mb-6">
                {activeTab === 'resources' ? (
                  <div className="text-slate-300">
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
                  <div className="text-slate-300">
                    <p>Lesson transcript will be available here.</p>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {getPrevLesson() && (
                  <button
                    onClick={() => handleLessonSelect(getPrevLesson()!)}
                    className="flex items-center justify-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
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
              <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-slate-500 text-xs mb-2">Keyboard shortcuts:</p>
                <div className="flex flex-wrap gap-4 text-slate-500 text-xs">
                  <span><kbd className="bg-slate-800 px-1 rounded">K</kbd> Play/Pause</span>
                  <span><kbd className="bg-slate-800 px-1 rounded">J</kbd> Seek back</span>
                  <span><kbd className="bg-slate-800 px-1 rounded">L</kbd> Seek forward</span>
                  <span><kbd className="bg-slate-800 px-1 rounded">Shift+N</kbd> Next lesson</span>
                  <span><kbd className="bg-slate-800 px-1 rounded">Shift+P</kbd> Previous lesson</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Sidebar Playlist */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24">
              <PlaylistPanel 
                lessons={lessons}
                currentLesson={currentLesson}
                onLessonSelect={handleLessonSelect}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Playlist Drawer */}
      {isPlaylistOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsPlaylistOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-slate-900 rounded-t-2xl max-h-[70vh] overflow-hidden pb-[calc(env(safe-area-inset-bottom)+16px)]">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Course Lessons</h3>
                <button
                  onClick={() => setIsPlaylistOpen(false)}
                  className="text-slate-400 hover:text-white w-10 h-10 flex items-center justify-center"
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
    <div className={`bg-slate-900/50 rounded-2xl overflow-hidden ${isMobile ? '' : 'border border-slate-800/50'}`}>
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-white font-semibold">Course Content</h3>
        <p className="text-slate-400 text-sm">
          {lessons.filter(l => l.isCompleted).length} of {lessons.length} lessons completed
        </p>
      </div>
      
      <div className={`${isMobile ? 'max-h-none' : 'max-h-96'} overflow-y-auto`}>
        {lessons.map((lesson, index) => (
          <button
            key={lesson.id}
            onClick={() => onLessonSelect(lesson)}
            disabled={lesson.isLocked}
            className={`w-full text-left p-4 border-b border-slate-800/50 transition-colors ${
              currentLesson?.id === lesson.id
                ? 'bg-blue-600/20 border-l-4 border-l-blue-500'
                : lesson.isLocked
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-slate-800/50'
            } ${isMobile ? 'min-h-[44px] py-3' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                  lesson.isCompleted
                    ? 'bg-green-500 text-white'
                    : currentLesson?.id === lesson.id
                    ? 'bg-blue-500 text-white'
                    : lesson.isLocked
                    ? 'bg-slate-700 text-slate-400'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {lesson.isCompleted ? (
                    <i className="fas fa-check"></i>
                  ) : lesson.isLocked ? (
                    <i className="fas fa-lock"></i>
                  ) : (
                    index + 1
                  )}
                </div>
                
                <div className="min-w-0 flex-1">
                  <h4 className={`font-medium text-sm ${
                    currentLesson?.id === lesson.id ? 'text-blue-400' : 'text-white'
                  } ${isMobile ? 'text-base' : ''} truncate`}>
                    {lesson.title}
                  </h4>
                  <p className={`text-slate-400 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                    {formatDuration(lesson.duration)}
                  </p>
                </div>
              </div>
              
              {currentLesson?.id === lesson.id && (
                <div className="text-blue-400 flex-shrink-0">
                  <i className="fas fa-play text-xs"></i>
                </div>
              )}
            </div>
          </button>
        ))}
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