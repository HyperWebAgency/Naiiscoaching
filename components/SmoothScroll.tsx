"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        // Lenis drives the real window scroll, so window.scrollY and native
        // scroll events stay accurate — the scroll-linked figures and the
        // navbar's dark-section detection keep working untouched.
        lerp: 0.09,
        smoothWheel: !reduced,
        // Leave touch devices on native momentum; hijacking it fights the OS.
        syncTouch: false,
        // Smooth-scroll in-page #hash links instead of jumping.
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
