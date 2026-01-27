// ModalPortal.tsx
import { createPortal } from "react-dom";
import { ReactNode } from "react";

interface ModalPortalProps {
  children: ReactNode;
}

export const ModalPortal = ({ children }: ModalPortalProps) => {
  if (typeof window === "undefined") return null;
  return createPortal(children, document.body);
};
