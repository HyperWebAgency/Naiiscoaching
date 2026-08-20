"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Services", href: "#services", inPage: true },
  { label: "Contact", href: "/contact", inPage: false },
  { label: "Qui je suis", href: "#qui-je-suis", inPage: true },
];

const wordmarkClass =
  // The words sit *below* the pill in the stack so they can slide out from
  // behind it. At rest they only overlap it by a pixel or two.
  "relative select-none font-extrabold uppercase leading-none tracking-[-0.01em] " +
  "text-[0.95rem] sm:text-[1.6rem] md:text-[2.2rem] lg:text-[2.9rem]";

// How long a lull in scroll events has to be before it counts as "stopped" —
// the word only comes back once a visitor has actually settled on a section.
const SCROLL_SETTLE_MS = 5000;

export function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const [onDark, setOnDark] = useState(false);
  // Starts hidden — tucked behind the pill — and slides out once on mount,
  // then tucks back in during active scroll and re-emerges once a section
  // settles. Reduced-motion visitors just get it shown throughout.
  const [wordmarkVisible, setWordmarkVisible] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === "/";

  // Entrance: reveal shortly after mount, once. The layout never remounts
  // across navigation, so this never replays on a route change.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setWordmarkVisible(true);
      return;
    }
    const t = setTimeout(() => setWordmarkVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Any section marked `data-dark-section` flips the wordmark, so future dark
  // sections need no extra wiring here.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      const band = header.getBoundingClientRect();
      const probe = band.top + band.height / 2;
      const darkSections = document.querySelectorAll<HTMLElement>("[data-dark-section]");
      let over = false;
      for (const el of darkSections) {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) {
          over = true;
          break;
        }
      }
      setOnDark(over);
    };

    // Only the home page has enough sections for this to read as "arriving
    // somewhere" rather than flicker, and reduced-motion visitors skip it
    // entirely — the word just stays put.
    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      update();
      if (!onHome || reducedMotion) return;
      setWordmarkVisible(false);
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(() => setWordmarkVisible(true), SCROLL_SETTLE_MS);
    };

    if (!onHome) setWordmarkVisible(true);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (settleTimer) clearTimeout(settleTimer);
    };
    // The header lives in the layout, so it survives navigation and would
    // otherwise never re-check: a route change swaps the sections underneath it
    // without firing a scroll or a resize.
  }, [pathname, onHome]);

  // Over the beige page: beige letters, navy contour. Over a navy section the
  // pair swaps, so the wordmark reads as an outline instead of disappearing.
  // The same transition also carries the show/hide slide, so it has to live
  // here rather than in a class — an inline `transition` would otherwise
  // replace it outright instead of merging with it.
  const wordmarkStyle = {
    WebkitTextStroke: `0.075em ${onDark ? "#f5eee8" : "#2d2a49"}`,
    paintOrder: "stroke fill",
    transition:
      "-webkit-text-stroke-color 300ms ease, color 300ms ease, " +
      "transform 450ms cubic-bezier(0.16,1,0.3,1), opacity 450ms cubic-bezier(0.16,1,0.3,1)",
  } as const;

  // The slide alone isn't a reliable hide: the pill is a rounded-full shape,
  // so its footprint recedes from its own bounding box near the corners, and
  // at some breakpoints the word's line-box is taller than the pill besides.
  // Either way a sliver of "hidden" letter can still be geometrically inside
  // the pill's rectangle but outside its rounded fill. Fading opacity to 0
  // alongside the slide hides it regardless of that mismatch.
  const wordmarkHiddenStyle = (side: "left" | "right") =>
    wordmarkVisible
      ? { transform: "translateX(0)", opacity: 1 }
      : { transform: side === "left" ? "translateX(100%)" : "translateX(-100%)", opacity: 0 };

  const fillClass = onDark ? "text-[#2d2a49]" : "text-[#f5eee8]";

  // Shared by both link kinds so they stay identical. The current route is the
  // one item at full strength; the rest sit back at 70%.
  const linkClass = (current: boolean) =>
    `block cursor-inherit whitespace-nowrap rounded-full px-[8px] py-[5px] font-medium
    tracking-[0.02em] transition-colors duration-200
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
    sm:px-[10px] md:px-[12px] ${
      onDark
        ? `hover:bg-[#2d2a49]/10 hover:text-[#2d2a49] focus-visible:outline-[#2d2a49] ${
            current ? "text-[#2d2a49]" : "text-[#2d2a49]/70"
          }`
        : `hover:bg-[#f5eee8]/10 hover:text-[#f5eee8] focus-visible:outline-[#f5eee8] ${
            current ? "text-[#f5eee8]" : "text-[#f5eee8]/70"
          }`
    }`;

  return (
    <header
      ref={headerRef}
      // `pointer-events-none`: the header's box spans the full viewport width
      // (for `inset-x-0`) and, since the nav below is `w-full` too, so does
      // its grid — most of that band has nothing painted on it, but an
      // element still captures clicks wherever its box sits regardless of
      // what's visible. That silently ate clicks on anything underneath in
      // the same band, including the hero's social icons. Only the pill
      // (which holds the actual nav links) opts back in below.
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-5 md:pt-8"
    >
      {/* A three-column grid rather than a plain row: NAIIS and COACHING are
          different lengths, so equal-width outer columns are what keeps the
          pill genuinely centred instead of drifting toward the shorter word. */}
      <nav
        aria-label="Navigation principale"
        className="grid w-full grid-cols-[1fr_auto_1fr] items-center"
      >
        <span
          aria-hidden
          className={`${wordmarkClass} ${fillClass} justify-self-end`}
          style={{ ...wordmarkStyle, ...wordmarkHiddenStyle("left") }}
        >
          NAIIS
        </span>

        {/* The pill is tucked slightly under both words so the contour — not a
            gap — is what separates them, and the three read as one word.
            The beige ring disappears against the beige page but defines the
            pill once it scrolls over the navy section, where navy-on-navy
            would otherwise leave the links floating with no pill behind them. */}
        <ul
          className={`relative z-10 -mx-[0.12em] flex items-center rounded-full pointer-events-auto transition-colors duration-300
                     ${onDark ? "bg-[#f5eee8]" : "bg-[#2d2a49] ring-1 ring-[#f5eee8]/20"}
                     h-[27px] gap-[1px] px-[5px] text-[0.58rem]
                     sm:h-[32px] sm:gap-[3px] sm:px-[9px] sm:text-[0.66rem]
                     md:h-[38px] md:gap-[5px] md:px-[13px] md:text-[0.76rem]
                     lg:h-[43px] lg:px-[17px]`}
        >
          {NAV_LINKS.map((link) => {
            const current = !link.inPage && pathname === link.href;

            // A bare hash stays a plain anchor on the home page so Lenis
            // smooth-scrolls it. From any other route the same target has to be
            // reached through the home page first, which is a real navigation.
            return (
              <li key={link.href}>
                {link.inPage && onHome ? (
                  <a href={link.href} className={linkClass(false)}>
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.inPage ? `/${link.href}` : link.href}
                    aria-current={current ? "page" : undefined}
                    className={linkClass(current)}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <span
          aria-hidden
          className={`${wordmarkClass} ${fillClass} justify-self-start`}
          style={{ ...wordmarkStyle, ...wordmarkHiddenStyle("right") }}
        >
          COACHING
        </span>

        {/* The wordmark is decorative above; this carries the name to assistive tech. */}
        <span className="sr-only">Naiis Coaching</span>
      </nav>
    </header>
  );
}
