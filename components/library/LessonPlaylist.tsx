import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCourseLessons, type Lesson } from '../../utils/courseRouting';

interface LessonPlaylistProps {
  courseSlug: string;
  currentLessonId?: string;
  isMobile?: boolean;
  onLessonChange?: (lessonId: string) => void;
}

export default function LessonPlaylist({ 
  courseSlug, 
  currentLessonId, 
  isMobile = false,
  onLessonChange 
}: LessonPlaylistProps) {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  useEffect(() => {
    const courseLessons = getCourseLessons(courseSlug);
    setLessons(courseLessons);
  }, [courseSlug]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.isLocked) return;
    
    const lessonRoute = `/courses/${courseSlug}/lesson/${lesson.id}`;
    
    if (onLessonChange) {
      onLessonChange(lesson.id);
    }
    
    router.push(lessonRoute);
  };

  const handleKeyDown = (e: React.KeyboardEvent, lesson: Lesson) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLessonClick(lesson);
    }
    
    // Arrow key navigation
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const currentIndex = lessons.findIndex(l => l.id === lesson.id);
      const nextIndex = e.key === 'ArrowDown' 
        ? Math.min(currentIndex + 1, lessons.length - 1)
        : Math.max(currentIndex - 1, 0);
      
      const nextLesson = lessons[nextIndex];
      if (nextLesson && !nextLesson.isLocked) {
        const nextElement = document.querySelector(`[data-lesson-id="${nextLesson.id}"]`) as HTMLElement;
        nextElement?.focus();
      }
    }
  };

  const completedCount = lessons.filter(lesson => lesson.isCompleted).length;
  const totalCount = lessons.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 text-white hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-list text-sm"></i>
            </div>
            <div className="text-left">
              <div className="font-semibold">Course Lessons</div>
              <div className="text-sm text-slate-400">{completedCount}/{totalCount} completed</div>
            </div>
          </div>
          <i className={`fas fa-chevron-up transition-transform ${isExpanded ? 'rotate-180' : ''}`}></i>
        </button>
        
        {isExpanded && (
          <div className="max-h-80 overflow-y-auto bg-slate-900">
            <div className="p-4 space-y-2">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  data-lesson-id={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  onKeyDown={(e) => handleKeyDown(e, lesson)}
                  disabled={lesson.isLocked}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    currentLessonId === lesson.id
                      ? 'bg-blue-600 text-white'
                      : lesson.isLocked
                      ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-800/30 text-white hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center">
                    {lesson.isCompleted ? (
                      <i className="fas fa-check text-green-400"></i>
                    ) : lesson.isLocked ? (
                      <i className="fas fa-lock text-slate-500"></i>
                    ) : currentLessonId === lesson.id ? (
                      <i className="fas fa-play text-blue-200"></i>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{lesson.title}</div>
                    <div className="text-sm opacity-75">{formatDuration(lesson.duration)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop sidebar
  return (
    <div className="w-80 bg-slate-900/50 backdrop-blur-xl border-l border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h3 className="text-xl font-bold text-white mb-2">Course Lessons</h3>
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{completedCount}/{totalCount} completed</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Lesson List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              data-lesson-id={lesson.id}
              onClick={() => handleLessonClick(lesson)}
              onKeyDown={(e) => handleKeyDown(e, lesson)}
              disabled={lesson.isLocked}
              className={`w-full flex items-center space-x-4 p-4 rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 group ${
                currentLessonId === lesson.id
                  ? 'bg-blue-600/20 border border-blue-500/50 text-white'
                  : lesson.isLocked
                  ? 'bg-slate-800/30 text-slate-500 cursor-not-allowed opacity-60'
                  : 'bg-slate-800/30 text-white hover:bg-slate-700/50 hover:scale-[1.02]'
              }`}
            >
              {/* Lesson Number/Status */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                currentLessonId === lesson.id
                  ? 'bg-blue-600 text-white'
                  : lesson.isCompleted
                  ? 'bg-green-600 text-white'
                  : lesson.isLocked
                  ? 'bg-slate-700 text-slate-500'
                  : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'
              }`}>
                {lesson.isCompleted ? (
                  <i className="fas fa-check text-sm"></i>
                ) : lesson.isLocked ? (
                  <i className="fas fa-lock text-sm"></i>
                ) : currentLessonId === lesson.id ? (
                  <i className="fas fa-play text-sm"></i>
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>

              {/* Lesson Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold mb-1 line-clamp-1">{lesson.title}</div>
                <div className="flex items-center space-x-3 text-sm opacity-75">
                  <span className="flex items-center">
                    <i className="fas fa-clock mr-1"></i>
                    {formatDuration(lesson.duration)}
                  </span>
                  {lesson.isCompleted && (
                    <span className="flex items-center text-green-400">
                      <i className="fas fa-check-circle mr-1"></i>
                      Completed
                    </span>
                  )}
                </div>
              </div>

              {/* Play indicator */}
              {currentLessonId === lesson.id && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}