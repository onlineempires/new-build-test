"use client";
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { LibraryItem } from '../../types/library';
import { CourseSummary } from '../../types/course';

export type PreviewState = {
  visible: boolean;
  course: CourseSummary | null;
  anchorRect: DOMRect | null;
};

export type HoverPreviewContextValue = {
  state: PreviewState;
  showPreview: (course: CourseSummary, anchorRect: DOMRect) => void;
  hidePreview: () => void;
  isVisible: boolean;
};

const HoverPreviewContext = createContext<HoverPreviewContextValue | null>(null);

export function useHoverPreview(): HoverPreviewContextValue {
  const context = useContext(HoverPreviewContext);
  if (!context) {
    throw new Error('useHoverPreview must be used within a HoverPreviewProvider');
  }
  return context;
}

export function HoverPreviewProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, setState] = useState<PreviewState>({
    visible: false,
    course: null,
    anchorRect: null,
  });

  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const showPreview = useCallback((course: CourseSummary, anchorRect: DOMRect) => {
    // Clear any pending close
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    // Clear any pending open
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }

    // Add hover intent delay
    openTimer.current = window.setTimeout(() => {
      setState({ visible: true, course, anchorRect });
      openTimer.current = null;
    }, 120);
  }, []);

  const hidePreview = useCallback(() => {
    // Clear any pending open
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }

    // Add grace period for mouse movement (100ms as specified)
    closeTimer.current = window.setTimeout(() => {
      setState(s => ({ ...s, visible: false }));
      closeTimer.current = null;
    }, 100);
  }, []);

  const contextValue: HoverPreviewContextValue = {
    state,
    showPreview,
    hidePreview,
    isVisible: state.visible,
  };

  return (
    <HoverPreviewContext.Provider value={contextValue}>
      {children}
    </HoverPreviewContext.Provider>
  );
}

// Helper to convert LibraryItem to CourseSummary
export function toCourseSummary(item: LibraryItem): CourseSummary {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    heroUrl: item.heroImage,
    description: item.shortDescription,
    durationLabel: `${item.durationMin}m`,
    level: item.level,
    type: item.type,
    isNew: item.updatedAt && new Date(item.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    progressPct: item.progressPct,
  };
}