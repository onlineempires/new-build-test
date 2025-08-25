"use client";
import React, { useLayoutEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useHoverPreview } from './HoverPreviewProvider';
import { CourseSummary } from '../../types/course';
import { getResumeForCourse } from '../../lib/libraryProgress';
import { cn } from '../../lib/utils';

type Position = {
  left: number;
  top: number;
  width: number;
  height: number;
  isBottomVariant: boolean;
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

function computePosition(anchor: DOMRect): Position {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  
  // Same width as the card (top extension)
  const width = anchor.width;
  
  // Content-driven height with bounds
  const MIN_H = 240;
  const MAX_H = 360;
  const height = clamp(320, MIN_H, MAX_H); // Default content height
  
  // Attachment overlap for seamless look
  const ATTACH_OVERLAP = 12;
  const SAFE_TOP = 72 + 12; // Header height + margin
  
  // Horizontal positioning - same as card
  const left = clamp(anchor.left, 16, vw - width - 16);
  
  // Vertical positioning - prefer top extension
  let top = anchor.top - height + ATTACH_OVERLAP;
  let isBottomVariant = false;
  
  // Check if there's enough space above
  if (top < SAFE_TOP) {
    // Not enough space above; place as bottom extension instead
    top = anchor.bottom - ATTACH_OVERLAP;
    isBottomVariant = true;
  }
  
  return { left, top, width, height, isBottomVariant };
}

function WatchNowButton({ course }: { course: CourseSummary }) {
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

  return (
    <Link href={href}>
      <button className="h-12 rounded-xl font-semibold flex items-center justify-center gap-2 bg-blue-600 text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all w-full">
        <Play className="h-4 w-4 fill-current" />
        {label}
      </button>
    </Link>
  );
}



function getLevelColor(level: string) {
  switch (level) {
    case 'beginner': return 'text-green-400 bg-green-400/10';
    case 'intermediate': return 'text-yellow-400 bg-yellow-400/10';
    case 'advanced': return 'text-red-400 bg-red-400/10';
    default: return 'text-slate-400 bg-slate-400/10';
  }
}

export function HoverPreviewCard() {
  const { state, hidePreview } = useHoverPreview();
  const [position, setPosition] = useState<Position | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  // Handle client-side mounting
  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  // Compute position when state changes
  useLayoutEffect(() => {
    if (state.visible && state.anchorRect) {
      setPosition(computePosition(state.anchorRect));
      setIsEntering(true);
    }
  }, [state.visible, state.anchorRect]);

  // Handle escape key
  useLayoutEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hidePreview();
      }
    };

    if (state.visible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [state.visible, hidePreview]);

  // Handle click outside
  useLayoutEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (previewRef.current && !previewRef.current.contains(e.target as Node)) {
        hidePreview();
      }
    };

    if (state.visible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [state.visible, hidePreview]);

  // Hover handoff - keep open when moving from card to preview
  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    // 100ms grace period
    closeTimerRef.current = window.setTimeout(() => {
      hidePreview();
    }, 100);
  };

  if (!isMounted || !state.visible || !state.course || !position) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={previewRef}
        role="dialog"
        aria-labelledby="preview-title"
        aria-describedby="preview-description"
        className={cn(
          "fixed z-[70] rounded-2xl shadow-2xl ring-1 ring-white/10 dark:ring-black/20 overflow-hidden",
          "bg-slate-900/95 backdrop-blur",
          "transition-transform transition-opacity duration-150"
        )}
        style={{ 
          top: position.top, 
          left: position.left, 
          width: position.width, 
          height: position.height,
          pointerEvents: "auto"
        }}
        initial={{ opacity: 0, y: position.isBottomVariant ? 8 : -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: position.isBottomVariant ? 8 : -8 }}
        transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Hero area - ~40% of height */}
        <div className="relative h-[40%] overflow-hidden">
          <img 
            src={state.course.heroUrl} 
            alt="" 
            className="h-full w-full object-cover" 
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
          
          {/* New Badge */}
          {state.course.isNew && (
            <span className="absolute left-3 top-3 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
              NEW
            </span>
          )}
        </div>

        {/* Content area - ~60% of height */}
        <div className="h-[60%] p-4 flex flex-col">
          {/* Title */}
          <h3 id="preview-title" className="text-lg font-bold text-white mb-2 leading-tight line-clamp-2">
            {state.course.title}
          </h3>

          {/* Description */}
          <p id="preview-description" className="text-sm text-gray-300 line-clamp-3 mb-3 leading-relaxed flex-1">
            {state.course.description}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-4 mb-3 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {state.course.durationLabel}
            </div>
            <div className={cn("px-2 py-1 rounded text-xs font-medium", getLevelColor(state.course.level))}>
              {state.course.level}
            </div>
          </div>

          {/* Primary CTA - full width */}
          <WatchNowButton course={state.course} />
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}