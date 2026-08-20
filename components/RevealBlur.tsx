"use client";

import { useEffect, useRef } from "react";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const MAX_BLUR = 9; // px at the very bottom edge
const BAND_HEIGHT = "24vh";

/**
 * A soft blur band pinned to the bottom of the viewport. It fades in while the
 * next section is rising into view and back out once it has arrived, so the
 * incoming content reads as surfacing through a veil rather than just sliding up.
 */
export function RevealBlur({ targetId }: { targetId: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const top = target.getBoundingClientRect().top;

      // 0 while the section is still below the fold, 1 once it reaches the top.
      const p = clamp((vh - top) / vh, 0, 1);
      // Bell curve: nothing at either end, strongest mid-transition.
      const intensity = Math.sin(p * Math.PI);

      const blur = intensity * MAX_BLUR;
      el.style.opacity = intensity.toFixed(3);
      el.style.backdropFilter = `blur(${blur.toFixed(2)}px)`;
      el.style.setProperty("-webkit-backdrop-filter", `blur(${blur.toFixed(2)}px)`);
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
  }, [targetId]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40"
      style={{
        height: BAND_HEIGHT,
        opacity: 0,
        // Feather the band so the blur is strongest at the very bottom edge and
        // dissolves upward — a hard edge would read as a visible seam.
        maskImage: "linear-gradient(to top, #000 0%, rgba(0,0,0,0.55) 45%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to top, #000 0%, rgba(0,0,0,0.55) 45%, transparent 100%)",
      }}
    />
  );
}
