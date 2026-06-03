"use client";

import { useEffect } from "react";

export default function ClientGuards() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key?.toLowerCase?.() || "";
      const ctrl = e.ctrlKey || e.metaKey;

      if (e.key === "F11") e.preventDefault();
      if (ctrl && (k === "u" || k === "s" || k === "p")) e.preventDefault();
      if (ctrl && e.shiftKey && (k === "i" || k === "j" || k === "c")) e.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu, { passive: false });
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
