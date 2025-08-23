import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LibraryItem } from '../../types/library';
import { getCTAText, trackCourseAction, getFirstLessonHref, getNextLessonHref, hasUserStartedCourse } from '../../utils/courseRouting';

interface QuickViewModalProps {
  item: LibraryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUnlockAccess?: (item: LibraryItem) => void;
}

export default function QuickViewModal({
  item,
  isOpen,
  onClose,
  onUnlockAccess,
}: QuickViewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key, click outside, focus trap, and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Simple focus trap - cycle through focusable elements
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Lock page scroll and prevent background interaction
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
      
      // Focus the modal when it opens
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore page scroll
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, onClose]);

  // Check screen size for responsive sizing
  const isSmallLaptop = typeof window !== 'undefined' && window.innerHeight < 820;

  if (!isOpen || !item) return null;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'course': return 'Course';
      case 'masterclass': return 'Masterclass';
      case 'replay': return 'Call Replay';
      default: return 'Content';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-400 bg-green-400/10';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10';
      case 'advanced': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  // Get the correct routing URLs
  const getPrimaryHref = () => {
    if (item?.isLocked) {
      return item.purchaseHref || '/upgrade';
    }
    
    const hasStarted = hasUserStartedCourse(item?.slug || '');
    return hasStarted ? getNextLessonHref(item?.slug || '') : getFirstLessonHref(item?.slug || '');
  };

  const getLegacyHref = () => {
    return item?.href || `/courses/${item?.slug}`;
  };

  const getPrimaryActionText = () => {
    return getCTAText(item);
  };

  const handlePrimaryClick = (e: React.MouseEvent) => {
    if (!item) return;
    
    // Don't prevent default for Link navigation
    if (item.isLocked) {
      e.preventDefault();
      if (onUnlockAccess) {
        onUnlockAccess(item);
      }
    } else {
      const targetRoute = getPrimaryHref();
      const isStarting = !hasUserStartedCourse(item.slug);
      
      // Track the action
      trackCourseAction(isStarting ? 'start' : 'continue', item, targetRoute);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-[2px] animate-in fade-in duration-180" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-6">
        <div
          ref={modalRef}
          className={`w-full max-w-[980px] xl:max-w-[1080px] max-h-[88vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] shadow-2xl animate-in zoom-in-95 fade-in duration-180
            md:w-full md:h-auto 
            max-md:w-full max-md:h-[92vh] max-md:max-w-none max-md:rounded-xl`}
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          aria-modal="true"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 group"
            aria-label="Close modal"
          >
            <i className="fas fa-times text-sm group-hover:scale-110 transition-transform"></i>
          </button>

          {/* Hero Image - Responsive sizing */}
          <div className={`relative aspect-video w-full bg-slate-800 overflow-hidden
            ${isSmallLaptop ? 'max-h-[320px]' : 'max-h-[420px]'}
            max-md:h-[32vh] max-md:max-h-none`}>
            <img
              src={item.heroImage}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {/* Improved gradient for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent"></div>
            
            {/* Lock Overlay for Gated Content */}
            {item.isLocked && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-lock text-white text-xl"></i>
                  </div>
                  <p className="text-white text-sm">Premium Content</p>
                </div>
              </div>
            )}
          </div>

          {/* Content - Responsive Layout */}
          <div className={`overflow-y-auto 
            ${isSmallLaptop ? 'max-h-[calc(88vh-320px)]' : 'max-h-[calc(88vh-420px)]'}
            max-md:h-[60vh] max-md:max-h-none`}>
            <div className={`space-y-6 md:space-y-8 
              ${isSmallLaptop ? 'p-6' : 'p-6 md:p-8'}
              max-md:pb-[calc(env(safe-area-inset-bottom)+16px)]`}>
              {/* Header Section */}
              <div className="space-y-6">
                {/* Badges Row */}
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1.5 bg-blue-600/90 backdrop-blur-sm text-white text-sm font-bold rounded-lg">
                    {getTypeDisplayName(item.type)}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold capitalize ${getLevelColor(item.level)}`}>
                    {item.level}
                  </span>
                  {item.progressPct !== undefined && item.progressPct > 0 && !item.isLocked && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-green-500/20 text-green-400 text-sm font-semibold rounded-lg">
                      <i className="fas fa-chart-line mr-2"></i>
                      {item.progressPct}% complete
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 id="modal-title" className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {item.title}
                </h2>

                {/* Description */}
                <p id="modal-description" className="text-xl text-slate-300 leading-relaxed max-w-4xl">
                  {item.shortDescription}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-slate-700/50">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-10 h-10 bg-slate-800/50 rounded-xl flex items-center justify-center">
                    <i className="fas fa-clock text-blue-400"></i>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Duration</div>
                    <div className="font-semibold">{formatDuration(item.durationMin)}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-10 h-10 bg-slate-800/50 rounded-xl flex items-center justify-center">
                    <i className="fas fa-signal text-purple-400"></i>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Level</div>
                    <div className="font-semibold capitalize">{item.level}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-10 h-10 bg-slate-800/50 rounded-xl flex items-center justify-center">
                    <i className="fas fa-calendar text-green-400"></i>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Updated</div>
                    <div className="font-semibold">{new Date(item.updatedAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              {item.tags.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Topics Covered</h3>
                  <div className="flex flex-wrap gap-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-4 py-2 bg-slate-800/70 hover:bg-slate-700/70 text-slate-200 text-sm font-medium rounded-xl border border-slate-600/50 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                {/* Primary CTA */}
                {item.isLocked ? (
                  <button
                    onClick={handlePrimaryClick}
                    className="flex-1 sm:flex-none flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-105 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white focus:ring-orange-500 shadow-lg shadow-orange-500/25"
                  >
                    <i className="fas fa-unlock mr-3"></i>
                    {getPrimaryActionText()}
                  </button>
                ) : (
                  <Link href={getPrimaryHref()}>
                    <a
                      onClick={handlePrimaryClick}
                      className="flex-1 sm:flex-none flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white focus:ring-blue-500 shadow-lg shadow-blue-500/25"
                    >
                      <i className="fas fa-play mr-3"></i>
                      {getPrimaryActionText()}
                    </a>
                  </Link>
                )}

                {/* Secondary Action */}
                <Link href={getLegacyHref()}>
                  <a className="flex-1 sm:flex-none flex items-center justify-center px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 text-white border border-slate-600/50 hover:border-slate-500/50 rounded-2xl font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 backdrop-blur-sm">
                    <i className="fas fa-info-circle mr-3"></i>
                    View Details
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}