import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: React.ReactNode;
}

export function ModalPortal({ children }: ModalPortalProps) {
  if (typeof window === "undefined") return null;
  const root = document.querySelector("#content-portal-root") ?? document.body;
  return createPortal(children, root);
}