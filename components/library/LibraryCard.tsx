import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Play, Clock, CheckCircle, Star, Plus } from 'lucide-react';
import { LibraryItem } from '../../types/library';
import { generateThumbnail } from '../../lib/api/thumbnails';
import { getCourseRoute, getCTAText, getUserProgressPercentage, trackCourseAction } from '../../utils/courseRouting';
import { MobilePreviewModal } from './MobilePreviewModal';
import { toCourseSummary } from './HoverPreviewProvider';

interface LibraryCardProps {
  item: LibraryItem;
  onClick: (item: LibraryItem) => void;
}

export default function LibraryCard({ item, onClick }: LibraryCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(item.heroImage);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playButtonRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const expandedCardRef = useRef<HTMLDivElement>(null);

  // Convert LibraryItem to CourseSummary for components that need it
  const course = useMemo(() => toCourseSummary(item), [item]);

  // Get course progress and routing info
  const progressPercent = getUserProgressPercentage(item.slug);
  const ctaText = getCTAText(item);
  const courseRoute = getCourseRoute(item);
  
  // Detect device capabilities
  const isPointerDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: fine)').matches;
  }, []);

  const isLargeScreen = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(min-width: 1024px)').matches;
  }, []);

  const shouldUseHover = isPointerDevice && isLargeScreen;

  // Generate realistic thumbnail if needed
  useEffect(() => {
    const loadThumbnail = async () => {
      try {
        const url = await generateThumbnail(item);
        setThumbnailUrl(url);
      } catch (error) {
        console.error('Failed to generate thumbnail:', error);
        setThumbnailUrl(item.heroImage);
      }
    };

    loadThumbnail();
  }, [item]);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'course': return 'DE+';
      case 'masterclass': return 'MC+';
      case 'replay': return 'CR+';
      default: return 'DE+';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-blue-600';
      case 'masterclass': return 'bg-purple-600';
      case 'replay': return 'bg-green-600';
      default: return 'bg-blue-600';
    }
  };

  // Handle course navigation
  const handleWatchNow = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const action = progressPercent > 0 ? 'continue' : 'start';
    trackCourseAction(action, item, courseRoute);
    router.push(courseRoute);
  };

  // Optimized instant hover handlers for smooth performance
  const handleMouseEnter = useCallback(() => {
    if (!shouldUseHover) return;
    
    // Cancel any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Immediate visual feedback - no delays
    setIsHovered(true);
    
    // Instant DOM updates for smooth performance
    if (playButtonRef.current) {
      playButtonRef.current.style.transform = 'translateY(0) scale(1)';
      playButtonRef.current.style.opacity = '1';
    }
    
    if (overlayRef.current) {
      overlayRef.current.style.transform = 'translateY(0)';
      overlayRef.current.style.opacity = '1';
    }
    
    if (expandedCardRef.current) {
      expandedCardRef.current.style.transform = 'translateY(0) scale(1)';
      expandedCardRef.current.style.opacity = '1';
    }
    
    // Start video after minimal delay for better UX
    hoverTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && !imageError) {
        setShowVideoPreview(true);
        const video = videoRef.current;
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Video autoplay prevented:', error);
          });
        }
      }
    }, 200); // Much shorter delay for video
  }, [shouldUseHover, imageError]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Immediate visual feedback
    setIsHovered(false);
    setShowVideoPreview(false);
    
    // Instant DOM updates for smooth performance
    if (playButtonRef.current) {
      playButtonRef.current.style.transform = 'translateY(20px) scale(0.9)';
      playButtonRef.current.style.opacity = '0';
    }
    
    if (overlayRef.current) {
      overlayRef.current.style.transform = 'translateY(10px)';
      overlayRef.current.style.opacity = '0';
    }
    
    if (expandedCardRef.current) {
      expandedCardRef.current.style.transform = 'translateY(20px) scale(0.95)';
      expandedCardRef.current.style.opacity = '0';
    }
    
    // Clean up video
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  const handleFocus = useCallback(() => {
    if (shouldUseHover) {
      handleMouseEnter();
    }
  }, [shouldUseHover, handleMouseEnter]);

  const handleBlur = useCallback(() => {
    handleMouseLeave();
  }, [handleMouseLeave]);

  // Optimized click handlers with visual feedback
  const handleCardClick = useCallback(() => {
    if (!shouldUseHover) {
      // Mobile/touch - show modal
      setMobileModalOpen(true);
    } else {
      // Desktop - navigate directly
      handleWatchNow();
    }
  }, [shouldUseHover, handleWatchNow]);
  
  // Single-click navigation handler with proper event handling
  const handleVideoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`Navigating to course: ${item.slug}`);
    
    // Track action and navigate immediately
    const action = progressPercent > 0 ? 'continue' : 'start';
    trackCourseAction(action, item, courseRoute);
    
    // Immediate navigation
    router.push(courseRoute);
  }, [progressPercent, item, courseRoute, router]);

  // SIMPLE navigation function - no complex event handling
  const goToCourse = () => {
    console.log('=== SIMPLE CLICK DEBUG ===');
    console.log('Course Title:', item.title);
    console.log('Course Slug:', item.slug);
    console.log('Course Route:', courseRoute);
    console.log('Current URL:', window.location.href);
    console.log('Attempting navigation...');
    
    // Track action
    const action = progressPercent > 0 ? 'continue' : 'start';
    trackCourseAction(action, item, courseRoute);
    
    // Direct navigation - simplest method
    window.location.href = courseRoute;
    console.log('Navigation command sent');
  };

  const hidePreview = () => {
    setIsHovered(false);
    setShowVideoPreview(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!shouldUseHover) {
        setMobileModalOpen(true);
      }
      // On hover devices, focus already shows the preview
    } else if (e.key === 'Escape') {
      if (shouldUseHover) {
        hidePreview();
      }
    }
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`
          relative cursor-pointer transition-transform duration-200 ease-out rounded-2xl overflow-hidden
          ${isHovered ? 'scale-105 shadow-2xl z-50' : 'scale-100 shadow-lg z-10'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
          transform-gpu will-change-transform
        `}
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`${ctaText} ${item.title}`}
        style={{
          transformOrigin: 'center center',
          zIndex: isHovered ? 999 : 1,
          willChange: 'transform'
        }}
      >
        {/* Themed Card Container */}
        <div className="library-card rounded-xl overflow-hidden">
          {/* Simple Video Area - Direct Click */}
          <div 
            className="relative aspect-video bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden cursor-pointer"
            onClick={goToCourse}
          >
            {/* Loading State */}
            {!isImageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-700 animate-pulse">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Hero Image */}
            {!imageError && (
              <img
                src={thumbnailUrl}
                alt={item.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                } ${showVideoPreview ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            )}

            {/* Digital Era Video Preview */}
            {!imageError && shouldUseHover && (
              <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  showVideoPreview ? 'opacity-100' : 'opacity-0'
                }`}
                muted
                loop
                playsInline
                preload="none"
                onLoadedData={() => setVideoLoaded(true)}
                onError={() => console.log('Video preview failed to load')}
                style={{ pointerEvents: 'none' }}
              >
                <source src={`/api/placeholder/video/400/225`} type="video/mp4" />
                <source src={`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`} type="video/mp4" />
              </video>
            )}

            {/* Fallback Gradient */}
            {imageError && (
              <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                <span className="text-white text-sm font-semibold opacity-60">
                  {getTypeLabel(item.type)}
                </span>
              </div>
            )}

            {/* Type Badge */}
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold text-white ${getTypeColor(item.type)} shadow-lg`}>
                {getTypeLabel(item.type)}
              </span>
            </div>

            {/* Progress Badge */}
            {progressPercent > 0 && (
              <div className="absolute top-3 right-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold
                  ${progressPercent === 100 ? 'bg-green-500 text-white' : 'bg-white/20 backdrop-blur text-white'}
                `}>
                  {progressPercent === 100 ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    `${progressPercent}%`
                  )}
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {progressPercent > 0 && progressPercent < 100 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                <div 
                  className="h-full bg-red-600 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}

            {/* Enhanced Play Button Overlay with Digital Era styling */}
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-center">
                <div className="text-center space-y-4">
                  <button
                    onClick={goToCourse}
                    className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:scale-110 transition-all duration-300 shadow-xl border border-white/20"
                  >
                    <Play className="w-6 h-6 text-black fill-black" />
                  </button>
                  <div className="text-white text-sm font-medium opacity-90">
                    {ctaText}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Balanced Card Content with Optimal Spacing */}
          <div className="p-5 space-y-3">
            {/* Title - Clickable Navigation */}
            <h3 
              className="text-primary font-semibold text-xl leading-tight line-clamp-2 cursor-pointer hover:text-accent transition-colors duration-300"
              onClick={goToCourse}
            >
              {item.title}
            </h3>

            {/* Course Description - Engaging content */}
            {item.shortDescription && (
              <p className="text-secondary text-sm leading-relaxed line-clamp-2">
                {item.shortDescription}
              </p>
            )}

            {/* Clean Bottom Layout - No Overlap */}
            <div className="flex items-center justify-between pt-2 gap-4">
              {/* Duration - Prevented from shrinking */}
              <span className="text-muted text-sm flex items-center flex-shrink-0">
                <span className="w-1 h-1 bg-current rounded-full mr-2 opacity-50"></span>
                {formatDuration(item.durationMin)}
              </span>

              {/* Action Button - Prevent text wrapping */}
              <button 
                className="btn-primary px-4 py-2 rounded-lg transition-colors text-sm font-medium flex-shrink-0 whitespace-nowrap"
                onClick={goToCourse}
              >
                {ctaText}
              </button>
            </div>
          </div>

        </div>

        {/* Netflix-style Expanded Card - Always rendered for instant performance */}
        <div 
          ref={expandedCardRef}
          className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50 transition-all duration-200 ease-out"
          style={{
            transform: 'translateY(20px) scale(0.95)',
            opacity: 0,
            willChange: 'transform, opacity'
          }}
        >
            {/* Video Preview Area */}
            <div className="relative aspect-video bg-black overflow-hidden">
              {/* Video background */}
              {showVideoPreview && videoLoaded ? (
                <video
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                >
                  <source src={`/api/placeholder/video/400/225`} type="video/mp4" />
                  <source src={`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`} type="video/mp4" />
                </video>
              ) : (
                <img 
                  src={thumbnailUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
                <button
                  onClick={goToCourse}
                  className="bg-white rounded-full p-3 hover:scale-110 transition-transform shadow-lg"
                >
                  <Play className="w-5 h-5 text-black fill-black" />
                </button>
              </div>

              {/* Progress Bar at Bottom */}
              {progressPercent > 0 && progressPercent < 100 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                  <div 
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              )}
            </div>

            {/* Course Details Section */}
            <div className="p-4">
              {/* Title */}
              <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
              
              {/* Course Meta Info */}
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(item.durationMin)}</span>
                </div>
                {progressPercent > 0 && (
                  <span className="text-blue-400">{progressPercent}% complete</span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                {item.shortDescription}
              </p>

              {/* Action Button */}
              <button
                onClick={goToCourse}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                {ctaText}
              </button>
            </div>
          </div>

      </div>

      {/* Mobile Modal - Temporarily commented out for debugging */}
      {/* <MobilePreviewModal
        open={mobileModalOpen}
        onOpenChange={setMobileModalOpen}
        course={course}
      /> */}
    </>
  );
}