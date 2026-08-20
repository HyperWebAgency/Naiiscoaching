"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * The one thing to change when a new vlog goes up. Everything else — the
 * thumbnail, the watch link — is derived from the id, so pasting a new one is
 * the whole update.
 *
 * Deliberately hardcoded rather than fetched: no API key to rotate, no quota,
 * and the site stays fully static. The trade is that it does not follow the
 * channel by itself — it shows this video until someone changes it.
 */
const VLOG = {
  id: "sMHtrA3SmmM",
  title: "ROAD TO STAGE #6 | Jusqu’où iriez-vous pour réaliser un rêve ?",
};

const WATCH_URL = `https://www.youtube.com/watch?v=${VLOG.id}`;

/**
 * 1280×720 and genuinely 16:9. `hqdefault` would be the safe universal choice
 * except that it is 4:3 with the frame letterboxed into black bars, which looks
 * broken in a panel this size. `maxresdefault` is not generated for every
 * upload, so a missing one falls back to `mqdefault` — smaller, but 16:9 and
 * always present.
 */
const THUMB = `https://i.ytimg.com/vi/${VLOG.id}/maxresdefault.jpg`;
const THUMB_FALLBACK = `https://i.ytimg.com/vi/${VLOG.id}/mqdefault.jpg`;

// The panel's own width. The closed state translates the whole assembly by
// exactly this, which parks the panel off-screen and leaves only the tab.
const PANEL_W = "min(78vw,300px)";

export function LatestVlog() {
  const [open, setOpen] = useState(false);
  const [thumb, setThumb] = useState(THUMB);
  const rootRef = useRef<HTMLDivElement>(null);

  // Escape closes, and so does a click anywhere else — a panel pinned over the
  // page needs a way out that is not "find the small tab again".
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      // Below the navbar's z-50 so it can never cover the navigation.
      className="fixed right-0 top-1/2 z-40 flex items-stretch transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      style={{
        // Both axes in one declaration: the vertical centring and the slide
        // share the `translate` property, so setting them separately would
        // mean the second silently replaced the first.
        translate: open ? "0 -50%" : `${PANEL_W} -50%`,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="latest-vlog-panel"
        className="vlog-surface vlog-tab flex items-center self-center rounded-l-xl px-2 py-4
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {/* Vertical so the tab stays narrow. `vertical-rl` alone reads
            top-to-bottom with the letters turned on their side; the half-turn
            puts it bottom-to-top, which is the convention for an edge tab. */}
        <span className="rotate-180 text-[0.7rem] font-semibold uppercase tracking-[0.12em] [writing-mode:vertical-rl]">
          {open ? "Fermer" : "Dernier vlog"}
        </span>
      </button>

      <div
        id="latest-vlog-panel"
        // Off-screen when closed, so it must also be out of the tab order —
        // otherwise Tab lands on a link nobody can see.
        inert={!open}
        aria-hidden={!open}
        className="vlog-surface w-[min(78vw,300px)] shrink-0 p-3"
      >
        <a
          href={WATCH_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="vlog-link group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="block overflow-hidden rounded-lg">
            <Image
              src={thumb}
              onError={() => setThumb(THUMB_FALLBACK)}
              alt=""
              width={1280}
              height={720}
              sizes="300px"
              className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </span>

          <span className="mt-3 block text-[0.68rem] font-medium uppercase tracking-[0.12em] opacity-60">
            Dernière vidéo
          </span>
          {/* The title carries the link's accessible name, so the thumbnail
              above it is decorative and takes an empty alt rather than saying
              the same thing twice. */}
          <span className="mt-1 block text-[0.9rem] font-semibold leading-[1.35]">
            {VLOG.title}
          </span>
        </a>
      </div>
    </div>
  );
}
