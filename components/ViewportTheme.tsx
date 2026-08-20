"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Marks `<html>` with `data-view="dark" | "light"` depending on which section
 * currently fills the middle of the viewport.
 *
 * The scrollbar belongs to the document rather than to any one section, so it
 * cannot be recoloured per-section in CSS alone — it needs a single flag at the
 * root that CSS can key off.
 */
export function ViewportTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;

    const update = () => {
      raf = 0;
      // Sample the viewport's midpoint: the most representative section when
      // two of them are on screen at once.
      const mid = window.innerHeight / 2;
      let dark = false;

      for (const el of document.querySelectorAll<HTMLElement>("[data-dark-section]")) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          dark = true;
          break;
        }
      }

      root.dataset.view = dark ? "dark" : "light";
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      delete root.dataset.view;
    };
    // Re-sampled per route: this lives in the layout, so a navigation replaces
    // the sections under it without firing a scroll or a resize.
  }, [pathname]);

  return null;
}
