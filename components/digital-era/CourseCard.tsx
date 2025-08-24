"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Play, Clock, CheckCircle } from 'lucide-react';
import { useTheme } from './ThemeContext';

export interface Course {
  id: number;
  title: string;
  duration: string;
  level: string;
  progress?: number | null;
  hasVideo: boolean;
  videoUrl?: string;
  description?: string;
  thumbnailUrl?: string;
}

interface CourseCardProps {
  course: Course;
  onStartCourse: (courseId: number) => void;
}

const levelColors: Record<string, string> = {
  'MC+': 'bg-purple-500',
  'DE+': 'bg-blue-500',
  'CR+': 'bg-green-500',
  'advanced': 'bg-orange-500',
  'intermediate': 'bg-yellow-500',
  'beginner': 'bg-green-400'
};

export function CourseCard({ course, onStartCourse }: CourseCardProps) {
  const { colors } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
    };

    const handleError = () => {
      console.error('Video failed to load:', course.videoUrl);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [course.videoUrl]);

  const handleMouseEnter = () => {
    // Small delay to prevent accidental triggers
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
      
      if (course.hasVideo && videoRef.current && isVideoLoaded) {
        videoRef.current.currentTime = 0; // Reset to beginning
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing video:', error);
          });
        }
      }
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    setIsHovered(false);
    
    if (course.hasVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset to beginning
    }
  };

  const getActionText = () => {
    if (course.progress === null || course.progress === undefined) {
      return 'Start Course';
    } else if (course.progress === 100) {
      return 'Replay Course';
    } else {
      return 'Continue Course';
    }
  };

  const handleCardClick = () => {
    onStartCourse(course.id);
  };

  return (
    <div
      className={`
        relative cursor-pointer rounded-2xl overflow-hidden
        ${colors.cardBg} ${colors.shadow}
        transition-all duration-500 ease-out
        ${isHovered ? 'scale-[1.02] shadow-2xl' : 'scale-100'}
        group
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`${getActionText()} ${course.title}`}
    >
      {/* Video/Image Area */}
      <div className="relative aspect-video overflow-hidden">
        {course.hasVideo && course.videoUrl ? (
          <>
            {/* Video Element */}
            <video
              ref={videoRef}
              className={`
                w-full h-full object-cover transition-transform duration-700 ease-out
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}
              muted
              loop
              playsInline
              preload="metadata"
              poster={course.thumbnailUrl}
            >
              <source src={course.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Video Overlay */}
            <div 
              className={`
                absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent
                transition-opacity duration-500
                ${isHovered ? 'opacity-30' : 'opacity-70'}
              `}
            />
          </>
        ) : (
          <>
            {/* Static Image/Gradient */}
            {course.thumbnailUrl ? (
              <img 
                src={course.thumbnailUrl} 
                alt={course.title}
                className={`
                  w-full h-full object-cover transition-transform duration-700 ease-out
                  ${isHovered ? 'scale-110' : 'scale-100'}
                `}
              />
            ) : (
              <div className={`
                w-full h-full bg-gradient-to-br from-slate-600 to-slate-800
                flex items-center justify-center text-4xl font-bold text-white/60
                transition-transform duration-700 ease-out
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}>
                {course.level}
              </div>
            )}
            
            {/* Static Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </>
        )}

        {/* Level Badge */}
        <div className="absolute top-4 left-4">
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white
            ${levelColors[course.level] || 'bg-gray-500'}
            shadow-lg
          `}>
            {course.level}
          </span>
        </div>

        {/* Progress Indicator */}
        {course.progress !== null && course.progress !== undefined && (
          <div className="absolute top-4 right-4">
            {course.progress === 100 ? (
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            ) : (
              <div className="relative w-10 h-10">
                {/* Background Circle */}
                <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={100.53}
                    strokeDashoffset={100.53 * (1 - course.progress / 100)}
                    className="transition-all duration-500"
                  />
                </svg>
                {/* Progress Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold bg-black/50 rounded-full px-1">
                    {course.progress}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Play Button - Fades out on hover */}
        <div 
          className={`
            absolute inset-0 flex items-center justify-center
            transition-all duration-500 ease-out
            ${isHovered ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
          `}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-2xl">
            <Play className="w-8 h-8 text-gray-900 fill-gray-900" />
          </div>
        </div>

        {/* Progress Bar */}
        {course.progress !== null && course.progress !== undefined && course.progress > 0 && course.progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className={`${colors.text} font-bold text-lg leading-tight mb-2 line-clamp-2`}>
          {course.title}
        </h3>

        {/* Course Info */}
        <div className={`flex items-center gap-2 text-sm ${colors.textSecondary} mb-3`}>
          <Clock className="w-4 h-4" />
          <span>{course.duration}</span>
          {course.progress !== null && course.progress !== undefined && course.progress > 0 && (
            <>
              <span>•</span>
              <span className="text-blue-400">
                {course.progress === 100 ? 'Completed' : `${course.progress}% complete`}
              </span>
            </>
          )}
        </div>

        {/* Hover Description - Slides up */}
        {isHovered && course.description && (
          <div className="animate-slideUp">
            <p className={`${colors.textSecondary} text-sm line-clamp-2 mb-3`}>
              {course.description}
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          className={`
            w-full ${colors.accent} ${colors.accentHover}
            text-white font-semibold py-2 px-4 rounded-lg
            transition-all duration-200
            flex items-center justify-center gap-2
          `}
          onClick={(e) => {
            e.stopPropagation();
            onStartCourse(course.id);
          }}
        >
          <Play className="w-4 h-4" />
          {getActionText()}
        </button>
      </div>
    </div>
  );
}