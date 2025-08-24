"use client";
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { X, Play, Clock } from 'lucide-react';
import { useRouter } from 'next/router';
import { CourseSummary } from '../../types/course';
import { getResumeForCourse } from '../../lib/libraryProgress';

interface MobilePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: CourseSummary | null;
}

function getLevelColor(level: string) {
  switch (level) {
    case 'beginner': return 'text-green-400 bg-green-400/10';
    case 'intermediate': return 'text-yellow-400 bg-yellow-400/10';
    case 'advanced': return 'text-red-400 bg-red-400/10';
    default: return 'text-slate-400 bg-slate-400/10';
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case 'course': return 'Course';
    case 'masterclass': return 'Masterclass';
    case 'replay': return 'Call Replay';
    default: return 'Content';
  }
}

export function MobilePreviewModal({ open, onOpenChange, course }: MobilePreviewModalProps) {
  const router = useRouter();

  if (!course) return null;

  // Convert to LibraryCourse format for getResumeForCourse
  const courseData = {
    slug: course.slug,
    title: course.title,
    summary: course.description,
    durationLabel: course.durationLabel,
    imageUrl: course.heroUrl,
    isNew: course.isNew,
    lessons: [{ slug: 'lesson-1' }], // Fallback
  };

  const { href, started, label } = getResumeForCourse('mock-user', courseData);

  const handlePrimaryAction = () => {
    router.push(href);
    onOpenChange(false);
  };

  const handleViewDetails = () => {
    router.push(`/courses/${course.slug}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[clamp(320px,90vw,480px)] max-w-[95vw] max-h-[80vh]
          grid grid-rows-[auto_1fr_auto] gap-0 p-0 overflow-hidden
          rounded-xl border border-white/10 bg-[var(--lib-panel)] text-[var(--lib-text)]
        "
        containerClassName="items-center justify-center"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-4 pt-4 pb-2">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-sm font-bold rounded-lg">
                {getTypeLabel(course.type)}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold capitalize ${getLevelColor(course.level)}`}>
                {course.level}
              </span>
              {course.progressPct !== undefined && course.progressPct > 0 && (
                <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-lg">
                  {course.progressPct}%
                </span>
              )}
            </div>
            <DialogTitle className="text-xl font-semibold leading-tight">
              {course.title}
            </DialogTitle>
          </div>
          <button 
            className="ml-4 rounded-full p-2 hover:bg-white/5 transition-colors" 
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body - scrollable content */}
        <div className="px-4 pb-2 overflow-y-auto">
          {/* Hero Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
            <img
              src={course.heroUrl}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/0 to-black/60" />
            {course.isNew && (
              <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-medium text-white">
                New
              </span>
            )}
          </div>

          {/* Meta information */}
          <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {course.durationLabel}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-white/70 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Footer - pinned actions */}
        <div className="border-t border-white/10 bg-[var(--lib-panel)] px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button 
              size="lg" 
              className="min-w-[180px] bg-[var(--lib-accent)] hover:brightness-110 text-white font-semibold focus-visible:ring-2 focus-visible:ring-white/30" 
              onClick={handlePrimaryAction}
            >
              <span className="inline-flex items-center gap-2">
                <Play className="h-4 w-4" /> 
                {label}
              </span>
            </Button>
            <Button 
              size="lg" 
              variant="ghost" 
              className="min-w-[120px] border border-white/20 hover:border-white/30 hover:bg-white/10 text-white"
              onClick={handleViewDetails}
            >
              View details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}