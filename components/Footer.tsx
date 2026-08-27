"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CONTACT_EMAIL, SOCIAL } from "@/lib/site";

/**
 * Resolved when the page is built, not when it is viewed. A statically rendered
 * page has no request to read a clock from, so this freezes until the next
 * deploy — which for a copyright line is the usual trade.
 */
const YEAR = new Date().getFullYear();

/**
 * In-page targets, all three on the home page only.
 *
 * "Mes accompagnements" is her name for the Services section. Only the footer's
 * label changed — the section's own heading and the navbar still say Services,
 * and renaming those is its own item in her document.
 */
const NAV = [
  { label: "Qui je suis", hash: "#qui-je-suis" },
  { label: "Mes accompagnements", hash: "#services" },
  { label: "Témoignages", hash: "#temoignages" },
];

/**
 * Instagram and YouTube only. WhatsApp is a contact channel rather than a
 * réseau, and her list for this column names these two.
 */
const SOCIALS = [
  { label: "Instagram", href: SOCIAL.instagram },
  { label: "YouTube", href: SOCIAL.youtube },
];

const labelClass =
  "text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[#f5eee8]/45";

const linkClass =
  "inline-block text-[0.95rem] text-[#f5eee8]/65 transition-colors duration-200 " +
  "hover:text-[#f5eee8] focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-[#f5eee8]";

/**
 * `data-dark-section` is the flag the rest of the site already watches: the
 * navbar wordmark flips its fill and contour over it, and the scrollbar and the
 * vlog tab invert with it. Marking the footer means all three keep working down
 * here without a line of extra wiring.
 *
 * A client component for one reason: the two in-page links have to know whether
 * they are already on the home page. From /mentions-legales a bare `#qui-je-suis`
 * points at an element that is not in the document, so it does nothing at all.
 */
export function Footer() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  return (
    <footer
      data-dark-section
      // `overflow-hidden` for the wordmark below: it is sized in vw, and on the
      // widest screens it is meant to run right up to the edges. Without the
      // clip, any overshoot would put the whole page into horizontal scroll.
      className="relative overflow-hidden bg-[#2d2a49] px-6 pt-20 pb-6 lg:px-12 lg:pt-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] lg:gap-6">
          <div>
            {/* Solid here rather than the navbar's stroked pair. Up there the
                contour is what separates the two words from the pill sitting
                between them; there is no pill down here, so the outline would
                be decoration imitating a mechanism that is not present. */}
            <p className="font-extrabold uppercase leading-none tracking-[-0.01em] text-[1.35rem] text-[#f5eee8]">
              Naiis Coaching
            </p>

            {/* Her two lines, in her order: what this is, then what it does
                for you. The first is held brighter so it reads as the
                positioning line under the name rather than as the opening of
                the paragraph below it. */}
            <p className="mt-4 text-[0.95rem] leading-[1.6] text-[#f5eee8]/75">
              Coaching sportif en ligne, nutrition &amp; mindset.
            </p>

            <p className="mt-2 max-w-[34ch] text-[0.95rem] leading-[1.6] text-[#f5eee8]/55">
              Un accompagnement personnalisé pour transformer ton physique, tes
              habitudes et ta façon d’aborder tes objectifs.
            </p>

            {/* The year is read from the clock, which runs at build time on the
                server and at render time in the browser. Those disagree for one
                day a year; this tells React that is expected rather than a bug. */}
            <p
              suppressHydrationWarning
              className="mt-6 text-[0.82rem] text-[#f5eee8]/40"
            >
              © {YEAR} Naiis Coaching. Tous droits réservés.
            </p>
          </div>

          {/* A real `nav` landmark, labelled by its own heading, so this is
              reachable as "Navigation" rather than as a stray list of links. */}
          <nav aria-labelledby="footer-nav">
            <p id="footer-nav" className={labelClass}>
              Navigation
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {NAV.map((item) => (
                <li key={item.hash}>
                  {/* On the home page a bare hash stays a plain anchor, which is
                      what lets Lenis smooth-scroll it. From anywhere else the
                      same target has to be reached through the home page first,
                      and that is a real navigation. */}
                  {onHome ? (
                    <a href={item.hash} className={linkClass}>
                      {item.label}
                    </a>
                  ) : (
                    <Link href={`/${item.hash}`} className={linkClass}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <Link href="/contact" className={linkClass}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p id="footer-social" className={labelClass}>
              Réseaux
            </p>
            <ul className="mt-4 flex flex-col gap-3" aria-labelledby="footer-social">
              {SOCIALS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={labelClass}>Contact</p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link href="/contact" className={linkClass}>
                  Prendre rendez-vous
                </Link>
              </li>
              <li>
                {/* The address is the link's destination rather than its text.
                    Printing it in full would put a live mailto and a plain-text
                    copy of the same address on every page of the site, which is
                    what address harvesters read; the label says what the link
                    does, and a long address does not have to be wrapped into a
                    narrow column. */}
                <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                  Me contacter
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className={labelClass}>Légal</p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link href="/mentions-legales" className={linkClass}>
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-de-confidentialite" className={linkClass}>
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* The brand mark as page furniture — the sign-off at the bottom of the
            page rather than a thing to read. Hidden from assistive tech for
            that reason: the name is already announced by the wordmark above,
            and a screen reader has no way to convey "this is a watermark".

            `.brandmark-fog` fades it out toward the baseline. The base opacity
            is set a little above where it would sit unmasked, because the mask
            only ever subtracts: 11% at the top averages out to roughly the
            weight 8% had across the whole word.

            The font's own ascent-plus-descent measures 1.3em; the leading is a
            shade over that on purpose. It has to clear it, because the mask
            clips to this box and a shorter line would slice the tops off the
            letters — and at exactly 1.3 the sub-pixel rounding put some
            breakpoints a pixel from that edge. The band of empty space this
            leaves under the baseline is taken back by the negative bottom
            margin, in `em` so it tracks the clamped size, which is what keeps
            the word sitting low on the page rather than floating. */}
        <p
          aria-hidden
          className="brandmark-fog mt-6 mb-[-0.24em] select-none whitespace-nowrap text-center
                     font-extrabold uppercase leading-[1.34] tracking-[-0.04em]
                     text-[clamp(2.5rem,15vw,13rem)] text-[#f5eee8]/[0.11] lg:mt-10"
        >
          One More
        </p>
      </div>
    </footer>
  );
}
