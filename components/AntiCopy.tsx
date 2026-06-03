"use client";

import { useEffect } from "react";

export default function AntiCopy() {
  useEffect(() => {
    const stop = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const onContextMenu = (e: MouseEvent) => stop(e);

    const onKeyDown = (e: KeyboardEvent) => {
      const key = typeof e.key === "string" ? e.key.toLowerCase() : "";
      const ctrl = e.ctrlKey || e.metaKey;

      if (e.key === "F11") return stop(e);
      if (ctrl && (key === "c" || key === "x" || key === "s" || key === "u" || key === "p" || key === "a"))
        return stop(e);
      if (e.ctrlKey && e.shiftKey && (key === "i" || key === "j" || key === "c")) return stop(e);
    };

    const onCopy = (e: ClipboardEvent) => stop(e);
    const onCut = (e: ClipboardEvent) => stop(e);
    const onSelectStart = (e: Event) => stop(e);
    const onDragStart = (e: DragEvent) => stop(e);

    document.addEventListener("contextmenu", onContextMenu, { capture: true });
    document.addEventListener("keydown", onKeyDown, { capture: true });
    document.addEventListener("copy", onCopy, { capture: true });
    document.addEventListener("cut", onCut, { capture: true });
    document.addEventListener("selectstart", onSelectStart, { capture: true });
    document.addEventListener("dragstart", onDragStart, { capture: true });

    return () => {
      document.removeEventListener("contextmenu", onContextMenu, true);
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("copy", onCopy, true);
      document.removeEventListener("cut", onCut, true);
      document.removeEventListener("selectstart", onSelectStart, true);
      document.removeEventListener("dragstart", onDragStart, true);
    };
  }, []);

  return null;
}
