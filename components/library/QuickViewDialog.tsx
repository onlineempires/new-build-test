"use client";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { X, Play, Clock, TrendingUp, Calendar } from "lucide-react";
import { useRouter } from "next/router";
import { LibraryItem } from "../../types/library";
import { getResumeForCourse } from "../../lib/libraryProgress";

interface QuickViewDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  course: LibraryItem | null;
}

export function QuickViewDialog({ open, onOpenChange, course }: QuickViewDialogProps) {
  const router = useRouter();
  
  if (!course) return null;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  // Convert LibraryItem to LibraryCourse format
  const courseData = {
    slug: course.slug,
    title: course.title,
    summary: course.shortDescription,
    durationLabel: formatDuration(course.durationMin),
    imageUrl: course.heroImage,
    isNew: course.updatedAt && new Date(course.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lessons: [{ slug: 'lesson-1' }] // Fallback - would be populated with real lesson data
  };
  
  const resume = typeof window !== 'undefined' ? getResumeForCourse('mock-user', courseData) : { 
    href: `/learn/${course.slug}/lesson/lesson-1`, 
    started: false, 
    label: "Watch now" 
  };
  const primaryLabel = resume.label;

  function goPrimary() {
    router.push(resume.href.toLowerCase());
    onOpenChange(false);
  }

  function goDetails() {
    router.push(`/courses/${course.slug}`.toLowerCase());
    onOpenChange(false);
  }

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[clamp(720px,62vw,920px)] max-w-[92vw] max-h-[70vh] md:max-h-[70vh]
          grid grid-rows-[auto_1fr_auto] gap-0 p-0 overflow-hidden
          rounded-xl border border-white/10 bg-[var(--lib-panel)] text-[var(--lib-text)]
        "
        containerClassName="items-center justify-center"
      >
        {/* Header row - no hero banner */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-sm font-bold rounded-lg">
                {getTypeDisplayName(course.type)}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold capitalize ${getLevelColor(course.level)}`}>
                {course.level}
              </span>
              {course.progressPct !== undefined && course.progressPct > 0 && !course.isLocked && (
                <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-lg">
                  {course.progressPct}%
                </span>
              )}
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-semibold leading-tight">
              {course.title}
            </DialogTitle>
            <p className="text-white/70 line-clamp-2">
              {course.shortDescription}
            </p>
          </div>
          <button 
            className="ml-4 rounded-full p-2 hover:bg-white/5 transition-colors" 
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body - compact meta row */}
        <div className="px-6 pb-2">
          <div className="flex items-center gap-6 text-sm text-white/60">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatDuration(course.durationMin)}
            </span>
            <span className="inline-flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {course.level}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(course.updatedAt).toLocaleDateString()}
            </span>
          </div>
          
          {/* Topics chips */}
          {course.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {course.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-white/5 text-white/80 text-xs font-medium rounded-lg border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer pinned - large CTAs */}
        <div className="border-t border-white/10 bg-[var(--lib-panel)] px-6 py-5">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button 
              size="lg" 
              className="min-w-[220px] bg-[var(--lib-accent)] hover:brightness-110 text-white font-semibold focus-visible:ring-2 focus-visible:ring-white/30" 
              onClick={goPrimary}
            >
              <span className="inline-flex items-center gap-2">
                <Play className="h-4 w-4" /> 
                {primaryLabel}
              </span>
            </Button>
            <Button 
              size="lg" 
              variant="ghost" 
              className="min-w-[140px] border border-white/20 hover:border-white/30 hover:bg-white/10 text-white"
              onClick={goDetails}
            >
              View details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}