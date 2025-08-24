import { useState, useRef, useEffect } from 'react';
import { Play, Clock, BookOpen, Star, Plus, ChevronDown } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    lessons: number;
    rating: number;
    category: string;
    isNew?: boolean;
    progress?: number;
  };
  onPlay: () => void;
  onAddToList?: () => void;
}

export default function NetflixCourseCard({ course, onPlay, onAddToList }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isHovered && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      // Calculate if card needs to shift left or right
      let xPos = 0;
      if (rect.left < 100) {
        xPos = 50; // Shift right if too close to left edge
      } else if (rect.right > viewportWidth - 100) {
        xPos = -50; // Shift left if too close to right edge
      }
      
      setPosition({ x: xPos, y: -50 });
    }
  }, [isHovered]);

  const handleMouseEnter = () => {
    if (isMobile) return;
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 300); // Small delay before expanding
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(false);
  };

  const handleMobileClick = () => {
    if (isMobile) {
      setIsHovered(!isHovered);
    }
  };

  // Interaction handlers based on device type
  const interactionProps = isMobile ? {
    onClick: handleMobileClick,
  } : {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  return (
    <div className="relative" style={{ zIndex: isHovered ? 50 : 1 }}>
      <div
        ref={cardRef}
        className={`
          relative cursor-pointer transition-all duration-300 ease-out
          ${isHovered ? 'transform scale-150' : 'transform scale-100'}
        `}
        style={{
          transformOrigin: 'center center',
          transform: isHovered 
            ? `scale(1.5) translate(${position.x}px, ${position.y}px)` 
            : 'scale(1)'
        }}
        {...interactionProps}
      >
        {/* Base Card - Always Visible */}
        <div className="relative rounded-md overflow-hidden bg-gray-800 shadow-lg">
          {/* Thumbnail */}
          <div className="relative aspect-video">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to a gradient background if image fails
                e.currentTarget.style.display = 'none';
              }}
            />
            
            {/* Fallback gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
              <span className="text-white text-sm font-semibold opacity-60">
                {course.category}
              </span>
            </div>
            
            {/* New Badge */}
            {course.isNew && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                NEW
              </div>
            )}
            
            {/* Progress Bar */}
            {course.progress !== undefined && course.progress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                <div 
                  className="h-full bg-red-600 transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            )}

            {/* Play Button Overlay - Shows on Hover */}
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay();
                  }}
                  className="bg-white rounded-full p-3 hover:scale-110 transition-transform"
                >
                  <Play className="w-6 h-6 text-black fill-black" />
                </button>
              </div>
            )}
          </div>

          {/* Expanded Details - Shows on Hover */}
          {isHovered && (
            <div className="p-4 bg-gray-800 animate-fadeIn">
              {/* Title and Actions */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-bold text-sm flex-1 line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex gap-1 ml-2">
                  {onAddToList && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToList();
                      }}
                      className="bg-gray-700 hover:bg-gray-600 rounded-full p-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  )}
                  <button className="bg-gray-700 hover:bg-gray-600 rounded-full p-1.5 transition-colors">
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Match Score and Category */}
              <div className="flex items-center gap-3 mb-2 text-xs">
                <span className="text-green-500 font-bold">98% Match</span>
                <span className="text-gray-400">{course.category}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-gray-300">{course.rating}</span>
                </div>
              </div>

              {/* Course Info */}
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {course.lessons} lessons
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-300 line-clamp-2">
                {course.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}