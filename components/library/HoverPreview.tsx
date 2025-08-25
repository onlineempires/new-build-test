"use client";
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Play, Clock } from 'lucide-react';
import { useRouter } from 'next/router';
import { getResumeForCourse } from '../../lib/libraryProgress';
import { PreviewData } from './PreviewProvider';

interface HoverPreviewProps {
  data: PreviewData;
  onClose: () => void;
}

export function HoverPreview({ data, onClose }: HoverPreviewProps) {
  const router = useRouter();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [, setIsHovering] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  const { course, rect } = data;

  // Convert LibraryItem to LibraryCourse format for getResumeForCourse
  const courseData = {
    slug: course.slug,
    title: course.title,
    summary: course.shortDescription,
    durationLabel: formatDuration(course.durationMin),
    imageUrl: course.heroImage,
    isNew: course.updatedAt && new Date(course.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // New if updated in last 7 days
    lessons: [{ slug: 'lesson-1' }] // Fallback - would be populated with real lesson data
  };

  const resume = typeof window !== 'undefined' ? getResumeForCourse('mock-user', courseData) : { 
    href: `/learn/${course.slug}/lesson/lesson-1`, 
    started: false, 
    label: "Watch now" 
  };

  function formatDuration(minutes: number) {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  // Calculate position relative to card
  useEffect(() => {
    const PANEL_WIDTH = 380;
    const PANEL_HEIGHT = 400; // Approximate height
    const GUTTER = 16;

    let x = rect.right + GUTTER;
    let y = rect.top;

    // Flip to left if near right edge
    if (x + PANEL_WIDTH > window.innerWidth - GUTTER) {
      x = rect.left - PANEL_WIDTH - GUTTER;
    }

    // Shift up if near bottom
    if (y + PANEL_HEIGHT > window.innerHeight - GUTTER) {
      y = window.innerHeight - PANEL_HEIGHT - GUTTER;
    }

    // Ensure minimum gutters
    x = Math.max(GUTTER, Math.min(x, window.innerWidth - PANEL_WIDTH - GUTTER));
    y = Math.max(GUTTER, y);

    setPosition({ x, y });
  }, [rect]);

  // Handle hover state for keeping panel open
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    closeTimer.current = window.setTimeout(() => {
      onClose();
    }, 120);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle primary button click
  const handlePrimaryClick = () => {
    router.push(resume.href);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={previewRef}
        className="fixed z-[100] pointer-events-auto"
        style={{
          left: position.x,
          top: position.y,
        }}
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.98 }}
        transition={{ 
          duration: 0.16, 
          ease: [0.16, 1, 0.3, 1] // easeOut
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="group"
        aria-label="Course preview"
      >
        <div className="
          max-w-[420px] w-[380px] rounded-2xl border border-white/10 
          bg-[var(--lib-panel)] text-[var(--lib-text)] 
          shadow-[0_20px_50px_-12px_rgba(0,0,0,.55)]
          overflow-hidden
        ">
          {/* Top image 16:9 */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={courseData.imageUrl}
              alt={courseData.title}
              className="w-full h-full object-cover"
            />
            
            {/* Subtle bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* New Added badge */}
            {courseData.isNew && (
              <div className="absolute left-2 top-2">
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                  New Added
                </span>
              </div>
            )}
          </div>

          {/* Content block */}
          <div className="p-5">
            {/* Title */}
            <h3 className="text-lg font-semibold tracking-tight truncate mb-3">
              {courseData.title}
            </h3>

            {/* Primary button */}
            <Button
              className="bg-[var(--lib-accent)] hover:brightness-110 w-full mt-3"
              size="lg"
              onClick={handlePrimaryClick}
              aria-label={resume.label}
            >
              <span className="inline-flex items-center gap-2">
                <Play className="h-4 w-4" />
                {resume.label}
              </span>
            </Button>

            {/* Description */}
            <p className="mt-2 text-sm text-white/70 line-clamp-3">
              {courseData.summary}
            </p>

            {/* Duration chip */}
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 text-xs bg-white/5 border border-white/10 rounded-full px-2 py-1">
                <Clock className="h-3 w-3" />
                {courseData.durationLabel}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}