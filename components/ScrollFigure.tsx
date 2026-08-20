"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Mode = "exitRight" | "enterLeft";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// Ease so the travel starts and ends softly instead of tracking scroll linearly.
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

interface ScrollFigureProps {
  mode: Mode;
  /** Travel distance as a fraction of the element's own width. */
  distance?: number;
  className?: string;
  children: ReactNode;
}

export function ScrollFigure({
  mode,
  distance = 0.75,
  className,
  children,
}: ScrollFigureProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "none";
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      let offset: number;

      if (mode === "exitRight") {
        // Leaves right as the first viewport scrolls away.
        const p = easeInOut(clamp(window.scrollY / vh, 0, 1));
        offset = p * distance * 100;
      } else {
        // Arrives from the left as the section rises into view, and is fully
        // settled by the time it reaches the upper part of the viewport.
        const p = easeInOut(clamp((vh - rect.top) / (vh * 0.8), 0, 1));
        offset = (1 - p) * -distance * 100;
      }

      el.style.transform = `translate3d(${offset.toFixed(2)}%, 0, 0)`;
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
    };
  }, [mode, distance]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
