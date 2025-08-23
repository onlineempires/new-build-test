import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getCourseLessons, type Lesson } from '../../../../utils/courseRouting';

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
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  // Mock video URL - replace with actual video URL from lesson data
  const demoVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  useEffect(() => {
    if (courseSlug && typeof courseSlug === 'string') {
      const courseLessons = getCourseLessons(courseSlug);
      setLessons(courseLessons);

      // Find current lesson
      if (lessonSlug && typeof lessonSlug === 'string') {
        const lesson = courseLessons.find(l => l.id === lessonSlug);
        setCurrentLesson(lesson || courseLessons[0]);
      } else {
        setCurrentLesson(courseLessons[0]);
      }
    }
  }, [courseSlug, lessonSlug]);

  const handleLessonSelect = (lesson: Lesson) => {
    if (lesson.isLocked) return;
    
    setCurrentLesson(lesson);
    router.push(`/learn/${courseSlug}/lesson/${lesson.id}`, undefined, { shallow: true });
    setIsPlaylistOpen(false);

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

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-[#0b1220] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading lesson...</p>
        </div>
      </div>
    );
  }

  // Mock course title - in production would come from course data
  const courseTitle = courseSlug === 'trust-cycles' ? 'Trust Cycles Mastery' :
                     courseSlug === 'content-marketing-mastery' ? 'Content Marketing Excellence' :
                     courseSlug === 'philosophy-of-offers' ? 'The Philosophy of Offers' :
                     courseSlug === 'social-optics' ? 'Social Optics & Symbolism' :
                     courseSlug === 'creating-opportunities' ? 'Creating and Spotting Opportunities' :
                     courseSlug === 'productivity-systems' ? 'Productivity Systems' :
                     courseSlug === 'limiting-beliefs' ? 'Limiting Beliefs' :
                     courseSlug === 'leadership-fundamentals' ? 'Leadership Fundamentals' :
                     'Course Title';

  return (
    <>
      <Head>
        <title>{currentLesson.title} - {courseTitle}</title>
        <meta name="description" content={`Learn ${currentLesson.title} in this comprehensive lesson.`} />
      </Head>

      <div className="min-h-screen bg-[#0b1220]">
        {/* Header */}
        <div className="border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/library">
                  <a className="text-slate-400 hover:text-white transition-colors">
                    <i className="fas fa-arrow-left mr-2"></i>
                    Back to Library
                  </a>
                </Link>
                <div className="hidden sm:block text-slate-600">|</div>
                <h1 className="text-white font-semibold text-lg sm:text-xl truncate">
                  {courseTitle}
                </h1>
              </div>
              
              {/* Mobile playlist toggle */}
              <button
                onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                className="sm:hidden bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <i className="fas fa-list mr-2"></i>
                Lessons
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Video Player */}
              <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-6">
                <div className="aspect-video">
                  <video
                    key={currentLesson.id}
                    controls
                    className="w-full h-full"
                    poster={`https://picsum.photos/seed/${currentLesson.id}/1280/720`}
                  >
                    <source src={demoVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Lesson Info */}
              <div className="bg-slate-900/50 rounded-2xl p-6 mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  {currentLesson.title}
                </h2>
                
                <div className="flex items-center text-slate-400 text-sm mb-4">
                  <span className="flex items-center mr-6">
                    <i className="fas fa-clock mr-2"></i>
                    {formatDuration(currentLesson.duration)}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-list mr-2"></i>
                    Lesson {getCurrentLessonIndex() + 1} of {lessons.length}
                  </span>
                </div>

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {getPrevLesson() && (
                    <button
                      onClick={() => handleLessonSelect(getPrevLesson()!)}
                      className="flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                    >
                      <i className="fas fa-chevron-left mr-2"></i>
                      Previous Lesson
                    </button>
                  )}
                  
                  {getNextLesson() && (
                    <button
                      onClick={() => handleLessonSelect(getNextLesson()!)}
                      className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ml-auto"
                    >
                      Next Lesson
                      <i className="fas fa-chevron-right ml-2"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Sidebar Playlist */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-6">
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
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900 rounded-t-2xl max-h-[70vh] overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Course Lessons</h3>
                  <button
                    onClick={() => setIsPlaylistOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto pb-safe">
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
      </div>
    </>
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
    <div className={`bg-slate-900/50 rounded-2xl overflow-hidden ${isMobile ? '' : 'border border-slate-800'}`}>
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-white font-semibold">Course Content</h3>
        <p className="text-slate-400 text-sm">
          {lessons.filter(l => l.isCompleted).length} of {lessons.length} lessons completed
        </p>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
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
            } ${isMobile ? 'min-h-[44px]' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
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
                
                <div>
                  <h4 className={`font-medium text-sm ${
                    currentLesson?.id === lesson.id ? 'text-blue-400' : 'text-white'
                  }`}>
                    {lesson.title}
                  </h4>
                  <p className="text-slate-400 text-xs">
                    {formatDuration(lesson.duration)}
                  </p>
                </div>
              </div>
              
              {currentLesson?.id === lesson.id && (
                <div className="text-blue-400">
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