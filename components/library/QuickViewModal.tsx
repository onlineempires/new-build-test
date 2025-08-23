import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Play, ChevronRight, Lock } from 'lucide-react';
import { LibraryItem } from '../../types/library';
import { getCTAText, trackCourseAction, getFirstLessonHref, getNextLessonHref, hasUserStartedCourse } from '../../utils/courseRouting';
import { ModalPortal } from '../ui/ModalPortal';

interface QuickViewModalProps {
  item: LibraryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUnlockAccess?: (item: LibraryItem) => void;
}

// Button Component
interface ButtonProps {
  asChild?: boolean;
  variant?: 'default' | 'ghost';
  size?: 'default' | 'lg';
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

function Button({ asChild, variant = 'default', size = 'default', className = '', children, disabled = false, onClick }: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
  
  const variantClasses = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg',
    ghost: 'bg-transparent hover:bg-white/10 text-white border border-white/20 hover:border-white/30 focus:ring-white/30'
  };
  
  const sizeClasses = {
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;
  
  if (asChild) {
    return <div className={classes}>{children}</div>;
  }
  
  return (
    <button className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export default function QuickViewModal({
  item,
  isOpen,
  onClose,
  onUnlockAccess,
}: QuickViewModalProps) {
  const modalRef = useRef<HTMLElement>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Handle escape key, focus trap, and body scroll lock
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

  // Get the correct routing URLs using exact specification logic
  const isLocked = item.isLocked;
  const inProgress = (item.progressPct ?? 0) > 0 && !isLocked;

  const primaryLabel = isLocked
    ? "Unlock access"
    : inProgress
    ? "Continue course"
    : "Start course";

  const primaryHref = isLocked
    ? item.purchaseHref ?? "/pricing"
    : inProgress
    ? getNextLessonHref(item.slug)
    : getFirstLessonHref(item.slug);

  const secondaryHref = item.href ?? `/courses/${item.slug}`;

  const handlePrimaryClick = () => {
    if (!isNavigating) {
      setIsNavigating(true);
      
      // Emit tracking events as specified
      if (isLocked) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('library_unlock_clicked', {
            detail: { slug: item.slug, href: primaryHref }
          }));
        }
        onUnlockAccess?.(item);
      } else {
        if (typeof window !== 'undefined') {
          const eventName = inProgress ? 'library_continue_clicked' : 'library_start_clicked';
          window.dispatchEvent(new CustomEvent(eventName, {
            detail: { slug: item.slug, href: primaryHref }
          }));
        }
        trackCourseAction(inProgress ? 'continue' : 'start', item, primaryHref);
      }
      
      // Re-enable after short delay to prevent double clicks
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };

  const handleSecondaryClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('library_view_details_clicked', {
        detail: { slug: item.slug, href: secondaryHref }
      }));
    }
  };

  // Optimize modal and hero sizing for button visibility
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const isSmallScreen = viewportHeight < 820;
  
  // Much more aggressive height constraints to ensure buttons are visible
  const heroClampClass = isSmallScreen 
    ? 'h-[clamp(100px,15vh,160px)]'  // Even smaller on small screens
    : 'h-[clamp(120px,18vh,200px)]';  // Reduced from 24vh to 18vh
  
  // Modal height should be much more conservative
  const modalMaxHeight = isSmallScreen ? 'max-h-[75vh]' : 'max-h-[80vh]';

  return (
    <ModalPortal>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-[9999] bg-black/55 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Centering Shell */}
      <div className="fixed inset-0 z-[10000] grid place-items-center p-4 md:p-6 pointer-events-none">
        <article
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          className="pointer-events-auto w-full max-w-[min(96vw,1080px)] max-h-[88vh] grid grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] shadow-2xl animate-in zoom-in-95 fade-in duration-180"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Row 1 - Compact Hero */}
          <header className="relative">
            <div className={`${heroClampClass} overflow-hidden bg-slate-800`}>
              <img
                src={item.heroImage}
                alt={item.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
              
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

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full bg-black/55 p-2 text-white hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition-colors"
            >
              <i className="fas fa-times text-sm"></i>
            </button>
          </header>

          {/* Row 2 - Content with Tight Spacing and Constrained Height */}
          <section className="overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4 min-h-0">
            {/* Badges Row */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-sm font-bold rounded-lg">
                {getTypeDisplayName(item.type)}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold capitalize ${getLevelColor(item.level)}`}>
                {item.level}
              </span>
              {item.progressPct !== undefined && item.progressPct > 0 && !item.isLocked && (
                <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-lg">
                  <i className="fas fa-chart-line mr-2"></i>
                  {item.progressPct}%
                </span>
              )}
            </div>

            {/* Title */}
            <h1 id="modal-title" className="text-xl lg:text-2xl font-bold text-white leading-tight">
              {item.title}
            </h1>

            {/* Description */}
            <p id="modal-description" className="text-slate-300 leading-relaxed text-sm md:text-base">
              {item.shortDescription}
            </p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-700/50">
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center">
                  <i className="fas fa-clock text-blue-400"></i>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Duration</div>
                  <div className="font-semibold">{formatDuration(item.durationMin)}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center">
                  <i className="fas fa-signal text-purple-400"></i>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Level</div>
                  <div className="font-semibold capitalize">{item.level}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center">
                  <i className="fas fa-calendar text-green-400"></i>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Updated</div>
                  <div className="font-semibold">{new Date(item.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            {item.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.slice(0, 6).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-slate-800/70 text-slate-200 text-sm font-medium rounded-lg border border-slate-600/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Row 3 - Pinned Footer with Clear Dual CTAs */}
          <footer className="border-t border-white/10 p-6 md:p-8 bg-[#0b1220]/95 backdrop-blur pb-[calc(env(safe-area-inset-bottom)+16px)] sm:pb-6">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-end">

              {/* Primary */}
              {isLocked ? (
                <Button 
                  size="lg" 
                  className="min-w-[220px]"
                  disabled={isNavigating}
                  onClick={handlePrimaryClick}
                >
                  <span className="inline-flex items-center">
                    <Lock className="mr-2 h-4 w-4" />
                    {primaryLabel}
                    <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </span>
                </Button>
              ) : (
                <Button asChild size="lg" className="min-w-[220px]">
                  <Link href={primaryHref} onClick={handlePrimaryClick}>
                    <span className="inline-flex items-center">
                      <Play className="mr-2 h-4 w-4" />
                      {primaryLabel}
                      <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                </Button>
              )}

              {/* Secondary */}
              <Button asChild variant="ghost" size="lg" className="min-w-[160px]">
                <Link href={secondaryHref} onClick={handleSecondaryClick}>
                  View details
                </Link>
              </Button>
            </div>
          </footer>
        </article>
      </div>
    </ModalPortal>
  );
}