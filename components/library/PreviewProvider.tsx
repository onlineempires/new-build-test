"use client";
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { LibraryItem } from '../../types/library';
import { HoverPreview } from './HoverPreview';

export type PreviewData = {
  rect: DOMRect;                 // card bounds for positioning
  course: LibraryItem;          // course data
};

export type PreviewContextValue = {
  open(d: PreviewData): void;
  close(): void;
  isOpen: boolean;
  currentSlug?: string;
};

const PreviewContext = createContext<PreviewContextValue | null>(null);

export function usePreview(): PreviewContextValue {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error('usePreview must be used within a PreviewProvider');
  }
  return context;
}

export function PreviewProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const open = useCallback((data: PreviewData) => {
    // Clear any pending close timer
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    // Clear any pending open timer
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }

    // Add hover intent delay
    openTimer.current = window.setTimeout(() => {
      setPreviewData(data);
      setIsOpen(true);
      openTimer.current = null;
    }, 140);
  }, []);

  const close = useCallback(() => {
    // Clear any pending open timer
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }

    // Add small delay to allow mouse movement to preview panel
    closeTimer.current = window.setTimeout(() => {
      setIsOpen(false);
      setPreviewData(null);
      closeTimer.current = null;
    }, 120);
  }, []);

  const contextValue: PreviewContextValue = {
    open,
    close,
    isOpen,
    currentSlug: previewData?.course.slug,
  };

  return (
    <PreviewContext.Provider value={contextValue}>
      {children}
      {isOpen && previewData && typeof window !== 'undefined' && (
        createPortal(
          <HoverPreview 
            data={previewData}
            onClose={() => {
              setIsOpen(false);
              setPreviewData(null);
            }}
          />,
          document.getElementById('library-root') || document.body
        )
      )}
    </PreviewContext.Provider>
  );
}