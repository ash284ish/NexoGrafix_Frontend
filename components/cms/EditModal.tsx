"use client";

import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

type EditModalProps = {
  open: boolean;
  title: React.ReactNode;
  onClose: () => void;

  children: React.ReactNode;

  footer?: React.ReactNode;

  maxWidthClassName?: string; 
};

export default function EditModal({
  open,
  title,
  onClose,
  children,
  footer,
  maxWidthClassName = "max-w-3xl",
}: EditModalProps) {
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={`w-full ${maxWidthClassName} mx-4 my-8 max-h-[85vh] overflow-y-auto rounded-md bg-white p-6`}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between sticky top-0 bg-white z-10 pb-3 border-b">
          <div className="text-lg font-bold flex items-center gap-2">
            {title}
          </div>
          <button onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <div>{children}</div>

        {footer ? (
          <div className="mt-6 sticky bottom-0 bg-white pt-3 border-t">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
