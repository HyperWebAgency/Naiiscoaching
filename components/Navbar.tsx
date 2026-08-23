"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { MobileMenu } from "./MobileMenu";

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

// Far enough that the header does not twitch on the small bounce a phone gives
// at the top of a page, close enough that it has moved by the time the hero's
// headline is under it.
const COMPACT_AFTER = 40;

/**
 * Below `md` is where the hamburger lives, and so is the only place the compact
 * header applies. Read through `useSyncExternalStore` rather than an effect:
 * subscribing to a media query is exactly what it exists for, and it avoids the
 * extra render — plus the setState-in-effect this file already trips twice.
 */
const MOBILE_QUERY = "(max-width: 767px)";

function subscribeMobile(onChange: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getMobile() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

/** No viewport on the server, so it renders the full-width header. */
function getServerMobile() {
  return false;
}

export function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [onDark, setOnDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  // Starts hidden — tucked behind the pill — and slides out once on mount,
  // then tucks back in during active scroll and re-emerges once a section
  // settles. Reduced-motion visitors just get it shown throughout.
  const [wordmarkVisible, setWordmarkVisible] = useState(false);
  // Past the threshold the header goes compact: the button slides to the right
  // edge and the wordmark clears out of its way.
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobile, getServerMobile);
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
      setScrolled(window.scrollY > COMPACT_AFTER);
    };

    // Only the home page has enough sections for this to read as "arriving
    // somewhere" rather than flicker, and reduced-motion visitors skip it
    // entirely — the word just stays put.
    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      update();
      // On a phone the wordmark's visibility is decided by scroll *position*
      // (see `compact` below), not by this settle timer. Leaving the timer
      // running there would fight it: scroll back to the top and the word would
      // stay hidden for another five seconds despite being at rest.
      // Read live rather than closed over, so a rotation is picked up without
      // resubscribing the listener.
      if (!onHome || reducedMotion || window.matchMedia(MOBILE_QUERY).matches) return;
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

  // Navigating away from an open menu has to close it: the header lives in the
  // layout and survives the route change, so the panel would otherwise still be
  // sitting over the page that was just navigated to. Tapping a menu link
  // already closes it; this covers the back button, which changes the route
  // without going through one.
  //
  // Adjusted during render rather than in an effect. React re-runs this
  // component immediately with the corrected state and never commits the stale
  // frame, where an effect would paint the open menu over the new page first
  // and only then close it.
  const [routeAtRender, setRouteAtRender] = useState(pathname);
  if (routeAtRender !== pathname) {
    setRouteAtRender(pathname);
    setMenuOpen(false);
  }

  // The open menu paints a navy panel behind the wordmark, which is the same
  // situation as scrolling over a navy section — so it takes the same branch
  // rather than needing its own colour handling.
  const dark = onDark || menuOpen;

  // Mobile only. On desktop the pill carries the links and the three-part
  // wordmark is the header, so there is nothing to compact.
  const compact = isMobile && scrolled;

  // The wordmark answers to whichever rule is in charge: scroll position on a
  // phone, the settle timer everywhere else. The mount reveal still gates both,
  // so the entrance plays once before either takes over.
  const showWordmark = wordmarkVisible && !compact;

  // Over the beige page: beige letters, navy contour. Over a navy section the
  // pair swaps, so the wordmark reads as an outline instead of disappearing.
  // The same transition also carries the show/hide slide, so it has to live
  // here rather than in a class — an inline `transition` would otherwise
  // replace it outright instead of merging with it.
  const wordmarkStyle = {
    WebkitTextStroke: `0.075em ${dark ? "#f5eee8" : "#2d2a49"}`,
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
    showWordmark
      ? { transform: "translateX(0)", opacity: 1 }
      : { transform: side === "left" ? "translateX(100%)" : "translateX(-100%)", opacity: 0 };

  const fillClass = dark ? "text-[#2d2a49]" : "text-[#f5eee8]";

  // Shared by both link kinds so they stay identical. The current route is the
  // one item at full strength; the rest sit back at 70%.
  const linkClass = (current: boolean) =>
    `block cursor-inherit whitespace-nowrap rounded-full px-[8px] py-[5px] font-medium
    tracking-[0.02em] transition-colors duration-200
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
    sm:px-[10px] md:px-[12px] ${
      dark
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
      {/* Painted before the nav, and the nav is positioned above it, so the
          wordmark stays legible on top of the panel instead of being covered by
          it — the brand holds still while the menu fills in behind. */}
      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        links={NAV_LINKS}
        onHome={onHome}
        pathname={pathname}
        originRef={burgerRef}
      />

      {/* A three-column grid rather than a plain row: NAIIS and COACHING are
          different lengths, so equal-width outer columns are what keeps the
          pill genuinely centred instead of drifting toward the shorter word. */}
      <nav
        aria-label="Navigation principale"
        // `relative z-10` is load-bearing: the panel above is `fixed`, and an
        // unpositioned nav would paint underneath it.
        //
        // Collapsing the trailing column to `0fr` is what walks the button over
        // to the right edge: the middle track is `auto`, so the leading `1fr`
        // takes every pixel the trailing one gives up and pushes the button
        // ahead of it. Cheaper and steadier than translating by a measured
        // distance — grid track sizes interpolate, so the slide comes free and
        // stays correct through a rotation without re-measuring anything.
        //
        // `minmax(0,…)` on the outer tracks rather than a bare `1fr`: a plain
        // `fr` track is `minmax(auto, …)`, so it never shrinks past the
        // min-content width of what is in it. Measured, that floored the
        // collapsing column at 84px — the width of COACHING — and the button
        // stopped short of the edge. A zero minimum lets the track actually
        // reach nothing.
        className={`relative z-10 grid w-full items-center transition-[grid-template-columns] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          compact
            ? "grid-cols-[minmax(0,1fr)_auto_minmax(0,0fr)]"
            : "grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
        }`}
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
        {/* Both centre-column occupants share one wrapper so the grid stays
            three columns wide at every breakpoint. The three-link pill needed
            most of a phone's width and ran straight through the wordmark —
            measured at 390px it covered NAIIS and COACHING almost entirely.
            The button takes a third of that, which is what finally lets the
            whole name read on a phone. */}
        <div className="relative z-10 -mx-[0.12em] flex items-center justify-center">
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="menu-panel"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className={`pointer-events-auto flex h-[38px] w-[38px] items-center justify-center
                       rounded-full transition-colors duration-300 md:hidden
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                       ${
                         dark
                           ? "bg-[#f5eee8] text-[#2d2a49] focus-visible:outline-[#f5eee8]"
                           : "bg-[#2d2a49] text-[#f5eee8] ring-1 ring-[#f5eee8]/20 focus-visible:outline-[#2d2a49]"
                       }`}
          >
            {/* Tailwind v4 emits `translate`, `rotate` and `scale` as their own
                CSS properties rather than folding them into `transform`, so the
                inline values below compose with each other instead of the last
                one winning — and each can be transitioned by name. */}
            <span aria-hidden className="flex flex-col items-center gap-[5px]">
              <span
                className="block h-[2px] w-[18px] rounded-full bg-current transition-[translate,rotate,opacity,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={menuOpen ? { translate: "0 7px", rotate: "45deg" } : undefined}
              />
              <span
                className="block h-[2px] w-[18px] rounded-full bg-current transition-[translate,rotate,opacity,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={menuOpen ? { opacity: 0, scale: "0 1" } : undefined}
              />
              <span
                className="block h-[2px] w-[18px] rounded-full bg-current transition-[translate,rotate,opacity,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={menuOpen ? { translate: "0 -7px", rotate: "-45deg" } : undefined}
              />
            </span>
          </button>

          <ul
            className={`hidden items-center rounded-full pointer-events-auto transition-colors duration-300 md:flex
                     ${dark ? "bg-[#f5eee8]" : "bg-[#2d2a49] ring-1 ring-[#f5eee8]/20"}
                     md:h-[38px] md:gap-[5px] md:px-[13px] md:text-[0.76rem]
                     lg:h-[43px] lg:px-[17px]`}
          >
            {NAV_LINKS.map((link) => {
              const current = !link.inPage && pathname === link.href;

              // A bare hash stays a plain anchor on the home page so Lenis
              // smooth-scrolls it. From any other route the same target has to
              // be reached through the home page first, which is a real
              // navigation.
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
        </div>

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
