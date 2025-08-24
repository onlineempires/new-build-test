"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, CheckCircle } from "lucide-react";
import { CompleteToggle } from "../../../../../../components/library/CompleteToggle";
import { SidebarItem } from "../../../../../../components/library/SidebarItem";
import { useLessonProgress } from "../../../../../../components/library/useLessonProgress";
import { getCourseLessons, type Lesson } from "../../../../../../utils/courseRouting";
import { getLibraryItemBySlug } from "../../../../../../lib/api/library";
import { LibraryItem } from "../../../../../../types/library";
import type { LessonState } from "../../../../../../components/library/types";
import AppLayout from "../../../../../../components/layout/AppLayout";

// Mock user data - in production this would come from authentication
const mockUser = {
  id: 1,
  name: 'Ashley Kemp',
  avatarUrl: '/images/avatar.jpg'
};

export default function LibraryLessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.courseSlug as string;
  const lessonSlug = params.lessonSlug as string;
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [courseItem, setCourseItem] = useState<LibraryItem | null>(null);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'resources' | 'transcript'>('resources');
  
  // Use the Library lesson progress hook
  const { progress, setWatched, setCompleted } = useLessonProgress(
    'mock-user', // In production, get from auth context
    courseSlug,
    lessonSlug
  );

  // Demo video URL - replace with actual video URL from lesson data
  const demoVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  useEffect(() => {
    if (courseSlug) {
      const courseLessons = getCourseLessons(courseSlug);
      setLessons(courseLessons);

      // Get course info from library
      getLibraryItemBySlug(courseSlug).then(item => {
        setCourseItem(item);
      });

      // Find current lesson
      if (lessonSlug) {
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
    router.push(`/library/learn/${courseSlug}/lesson/${lesson.id}`);
    setIsPlaylistOpen(false);

    // Track lesson opened event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('library_lesson_opened', {
        detail: {
          courseSlug,
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

  const getLessonState = (lesson: Lesson): LessonState => {
    if (lesson.isCompleted) return "completed";
    if (lesson.isLocked) return "locked";
    return "ready";
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

  const nextLesson = getNextLesson();
  const nextHref = nextLesson ? `/library/learn/${courseSlug}/lesson/${nextLesson.id}` : '';

  return (
    <AppLayout user={mockUser}>
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
                {progress.completed && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-lg">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Completed
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                {courseItem.title}
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
                  onTimeUpdate={(e) => {
                    const video = e.target as HTMLVideoElement;
                    if (video.duration && video.duration > 0) {
                      const watchedPct = Math.round((video.currentTime / video.duration) * 100);
                      // Only update if it's a meaningful change (every 5% or so)
                      if (watchedPct % 5 === 0 && watchedPct !== progress.watchedPct) {
                        setWatched(watchedPct);
                      }
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
                      {progress.watchedPct > 0 && (
                        <span className="ml-2 text-blue-400">• {progress.watchedPct}% watched</span>
                      )}
                    </p>
                  </div>
                </div>
              </header>

              {/* Completion Toggle */}
              <div className="px-6 py-4">
                <CompleteToggle 
                  progress={progress} 
                  onToggle={(completed) => setCompleted(completed)} 
                />
              </div>

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
                  
                  {nextLesson && (
                    <button
                      disabled={!(progress.completed || progress.watchedPct >= 90)}
                      onClick={() => router.push(nextHref.toLowerCase())}
                      className={`flex items-center justify-center px-6 py-3 rounded-lg transition-colors sm:ml-auto ${
                        progress.completed || progress.watchedPct >= 90
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      }`}
                      title={!(progress.completed || progress.watchedPct >= 90) ? 'Complete lesson or watch 90% to unlock' : ''}
                    >
                      <span className="inline-flex items-center gap-2">
                        Next Lesson <ChevronRight className="h-4 w-4" />
                        {!(progress.completed || progress.watchedPct >= 90) && (
                          <i className="fas fa-lock text-xs"></i>
                        )}
                      </span>
                    </button>
                  )}
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
                courseSlug={courseSlug}
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
                courseSlug={courseSlug}
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
  courseSlug: string;
  onLessonSelect: (lesson: Lesson) => void;
  isMobile?: boolean;
}

function PlaylistPanel({ lessons, currentLesson, courseSlug, onLessonSelect, isMobile = false }: PlaylistPanelProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getLessonState = (lesson: Lesson): LessonState => {
    if (lesson.isCompleted) return "completed";
    if (lesson.isLocked) return "locked";
    return "ready";
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1220] text-white/90">
      <h3 className="px-4 py-3 text-sm font-semibold text-white/90 border-b border-white/10">
        Course Content
      </h3>
      
      <div className={`${isMobile ? 'max-h-none' : 'max-h-96'} overflow-y-auto`}>
        {lessons.map((lesson, index) => (
          <SidebarItem
            key={lesson.id}
            href={`/library/learn/${courseSlug}/lesson/${lesson.id}`}
            index={index + 1}
            title={lesson.title}
            duration={formatDuration(lesson.duration)}
            state={getLessonState(lesson)}
            isActive={currentLesson?.id === lesson.id}
          />
        ))}
      </div>
    </div>
  );
}