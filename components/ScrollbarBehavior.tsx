"use client";

import { useEffect } from "react";

export default function ScrollbarBehavior() {
  useEffect(() => {
    let timer: number | null = null;

    const show = () => document.documentElement.classList.add("sb-show");
    const hide = () => document.documentElement.classList.remove("sb-show");

    // Show on scroll, hide after user stops scrolling
    const onScroll = () => {
      show();
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => hide(), 900);
    };

    // Show when mouse is on page
    const onEnter = () => show();

    // Hide only if user is not currently in the "scroll timeout" window
    const onLeave = () => {
      if (timer) return;
      hide();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return null;
}
