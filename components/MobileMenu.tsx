"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties, type RefObject } from "react";

import { SOCIAL_ICONS } from "./SocialLinks";

export type NavLink = { label: string; href: string; inPage: boolean };

// The first item waits for the circle to have covered enough of the screen to
// land on; after that they arrive a beat apart, top to bottom, the way they are
// read. Same shape as the hero's entrance, just slower — there is more screen
// to fill here.
const ITEM_LEAD_IN = 190;
const ITEM_STEP = 70;

/**
 * The panel is revealed by growing a circle out of the button that opened it,
 * so the menu reads as coming *from* the tap rather than appearing over it.
 *
 * The circle's origin and radius are measured rather than guessed: the origin
 * is the button's centre, and the radius is the distance to whichever viewport
 * corner is furthest from it. Guessing with something like `150vmax` also
 * covers the screen, but it finishes the visible part of the growth early and
 * spends the rest of the duration expanding off-screen, which reads as the
 * animation stalling. Measuring means the circle touches the last corner on the
 * final frame.
 */
export function MobileMenu({
  open,
  onClose,
  links,
  onHome,
  pathname,
  originRef,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  onHome: boolean;
  pathname: string;
  originRef: RefObject<HTMLButtonElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Measured on every open, not once: the button moves between breakpoints, and
  // an origin cached from a previous viewport would start the circle somewhere
  // that is no longer under the visitor's finger.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const button = originRef.current;
    if (!panel || !button) return;

    const r = button.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    panel.style.setProperty("--menu-x", `${x}px`);
    panel.style.setProperty("--menu-y", `${y}px`);
    panel.style.setProperty("--menu-r", `${Math.ceil(radius)}px`);
  }, [open, originRef]);

  // Escape closes, focus moves into the panel on open and back to the button on
  // close, and the page behind stops scrolling — a full-screen overlay that
  // lets the page move underneath it feels broken on a phone.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Past the breakpoint the button does not exist, so an open panel would
    // have no way to be closed.
    const wide = window.matchMedia("(min-width: 768px)");
    const onWide = () => {
      if (wide.matches) onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);

    // After the reveal has started, so focus does not jump to something still
    // clipped out of sight.
    const t = setTimeout(() => firstLinkRef.current?.focus(), ITEM_LEAD_IN);

    const button = originRef.current;
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      document.body.style.overflow = previousOverflow;
      button?.focus();
    };
  }, [open, onClose, originRef]);

  return (
    <div
      ref={panelRef}
      id="menu-panel"
      data-open={open}
      // Clipped to nothing when closed, but clipping is a paint concern — it
      // does not take the links out of the tab order. `inert` does.
      inert={!open}
      aria-hidden={!open}
      className="menu-panel fixed inset-0 bg-[#2d2a49] text-[#f5eee8]"
    >
      {/* Padded clear of the wordmark, which stays painted on top of this
          panel rather than being covered by it — the brand holds still while
          the menu fills in behind it. */}
      <div className="flex h-full flex-col px-8 pb-10 pt-[104px]">
        {/* `flex-1` plus centring rather than `justify-between` on the parent:
            pinned to the top, the links left roughly two fifths of a phone
            screen empty between themselves and the social row. Centred in
            whatever space the wordmark and that row leave over, the block sits
            where the eye already is. */}
        <nav aria-label="Navigation mobile" className="flex flex-1 items-center">
          <ul className="flex w-full flex-col">
            {links.map((link, i) => {
              const current = !link.inPage && pathname === link.href;
              const inner = (
                <>
                  <span className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[#f5eee8]/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[2rem] font-extrabold uppercase leading-[1.05] tracking-[-0.02em]">
                    {link.label}
                  </span>
                </>
              );

              const itemClass =
                "menu-item flex flex-col gap-1 border-b border-[#f5eee8]/12 py-5 " +
                "transition-colors duration-200 focus-visible:outline focus-visible:outline-2 " +
                "focus-visible:outline-offset-4 focus-visible:outline-[#f5eee8] " +
                (current ? "text-[#f5eee8]" : "text-[#f5eee8]/85 hover:text-[#f5eee8]");

              // Each item carries its own delay as a custom property rather
              // than a class per position. The rule that starts the animation
              // is a descendant selector, so a plain `.menu-item-2` would lose
              // the specificity contest against its `animation` shorthand and
              // silently resolve to no delay at all.
              const style = { "--d": `${ITEM_LEAD_IN + i * ITEM_STEP}ms` } as CSSProperties;

              return (
                <li key={link.href}>
                  {link.inPage && onHome ? (
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      onClick={onClose}
                      className={itemClass}
                      style={style}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={link.inPage ? `/${link.href}` : link.href}
                      onClick={onClose}
                      aria-current={current ? "page" : undefined}
                      className={itemClass}
                      style={style}
                    >
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className="menu-item"
          style={{ "--d": `${ITEM_LEAD_IN + links.length * ITEM_STEP}ms` } as CSSProperties}
        >
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[#f5eee8]/35">
            Suivez-moi
          </p>
          <ul className="mt-4 flex items-center gap-3">
            {SOCIAL_ICONS.map((icon) => (
              <li key={icon.name}>
                <a
                  href={icon.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${icon.name} — Naiis Coaching`}
                  className="flex h-11 w-11 items-center justify-center rounded-full
                             bg-[#f5eee8]/10 text-[#f5eee8]/80 transition-colors duration-200
                             hover:bg-[#f5eee8]/20 hover:text-[#f5eee8]
                             focus-visible:outline focus-visible:outline-2
                             focus-visible:outline-offset-2 focus-visible:outline-[#f5eee8]"
                >
                  <svg viewBox="0 0 24 24" aria-hidden focusable="false" className="h-5 w-5 fill-current">
                    <path d={icon.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
