import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: ReactNode;
  rootSelector?: string;
}

export function ModalPortal({ children, rootSelector = "#content-portal-root" }: ModalPortalProps) {
  if (typeof window === 'undefined') return null;
  const root = document.querySelector(rootSelector);
  // Fallback to body if the root is missing (should not happen after this patch)
  return createPortal(children, root ?? document.body);
}