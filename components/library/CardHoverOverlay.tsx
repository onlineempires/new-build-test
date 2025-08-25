"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Play, Clock } from 'lucide-react';
import { useRouter } from 'next/router';
import { LibraryItem } from '../../types/library';
import { getResumeForCourse } from '../../lib/libraryProgress';

interface CardHoverOverlayProps {
  course: LibraryItem;
  open: boolean;
  userId: string;
}

export function CardHoverOverlay({ course, open, userId }: CardHoverOverlayProps) {
  const router = useRouter();

  // Convert LibraryItem to LibraryCourse format for getResumeForCourse
  const courseData = {
    slug: course.slug,
    title: course.title,
    summary: course.shortDescription,
    durationLabel: `${course.durationMin}m`,
    imageUrl: course.heroImage,
    isNew: course.updatedAt && new Date(course.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lessons: [{ slug: 'lesson-1' }] // Fallback - would be populated with real lesson data
  };

  const { href, started, label } = getResumeForCourse(userId, courseData);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(href);
  };

  if (!open) return null;

  return (
    <motion.div
      role="group"
      aria-label="Course preview"
      className="
        absolute inset-0 z-50 pointer-events-auto
        rounded-2xl overflow-hidden
        border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,.55)]
        bg-[var(--lib-panel)]
      "
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }} // easeOut
    >
      {/* Top thumb */}
      <div className="relative h-40">
        <img 
          src={courseData.imageUrl} 
          alt="" 
          className="h-full w-full object-cover" 
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
        {courseData.isNew && (
          <span className="absolute left-2 top-2 text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-medium">
            New Added
          </span>
        )}
      </div>

      {/* Red header block like Netflix */}
      <div className="bg-gradient-to-b from-rose-700 to-rose-600 text-white px-4 py-3">
        <div className="text-sm font-semibold truncate">{courseData.title}</div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <Button
          size="lg"
          className="w-full bg-[var(--lib-accent)] hover:brightness-110 text-white font-semibold"
          onClick={handleButtonClick}
          aria-label={label}
        >
          <Play className="mr-2 h-4 w-4" />
          {label}
        </Button>

        <p className="mt-2 text-sm text-white/70 line-clamp-3">
          {courseData.summary}
        </p>
        
        <div className="mt-2 text-xs text-white/60 flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" />
          {courseData.durationLabel}
        </div>
      </div>
    </motion.div>
  );
}