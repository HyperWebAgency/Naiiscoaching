"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Plan = {
  id: string;
  featured: boolean;
  title: string;
  description: string;
  monthly: number;
  /** Price of a year paid upfront. `null` means the offer has no annual mode
   *  and keeps its monthly price whatever the toggle says. */
  annual: number | null;
  /** What the annual price saves against twelve months at the monthly rate.
   *  Written as data rather than computed, so a price change forces both
   *  numbers to be looked at together. */
  savings: number | null;
  features: string[];
};

const PLANS: Plan[] = [
  {
    id: "training-diete-mindset",
    featured: true,
    title: "Training + Diète & Mindset",
    description:
      "La formule complète : l’entraînement, l’assiette et le mental, construits ensemble.",
    monthly: 175,
    annual: 1900,
    savings: 200,
    features: [
      "Programme d’entraînement complet",
      "Plan diète personnalisé",
      "Suivi mindset",
    ],
  },
  {
    id: "diete-mindset",
    featured: false,
    title: "Diète & Mindset",
    description: "L’alimentation et le mental, sans le programme d’entraînement.",
    monthly: 135,
    annual: 1450,
    savings: 170,
    features: ["Plan diète personnalisé", "Suivi mindset"],
  },
  {
    id: "posing",
    featured: false,
    title: "Suivi posing mensuel",
    description: "Pour préparer la scène : votre posing corrigé semaine après semaine.",
    monthly: 180,
    annual: null,
    savings: null,
    features: [
      "Une routine envoyée chaque semaine, avec comparatif",
      "Un retour vidéo personnalisé par semaine",
    ],
  },
];

/** One-off sessions. No subscription, so they live outside the toggle's grid —
 *  a monthly/annual switch has nothing to say about a single booked hour. */
const SESSIONS = [
  { label: "30 minutes", price: "50€" },
  { label: "45 minutes", price: "70€" },
  { label: "Pack 3 séances", price: "135€" },
  { label: "Pack 6 séances", price: "240€" },
];

/**
 * The two price states sit stacked in one grid cell and crossfade. The cell's
 * height is the taller of the pair, so nothing below them moves when the
 * toggle flips — the swap is paint only. Rise-plus-blur is the site's arrival
 * gesture (contact intro, mobile menu); reusing it keeps this from feeling
 * bought in.
 */
const SWAP_BASE =
  "col-start-1 row-start-1 transition-[opacity,translate,filter] duration-300 " +
  "ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

const SWAP_HIDDEN = "pointer-events-none opacity-0 translate-y-2 blur-[5px]";

const priceClass = "text-[2.6rem] font-extrabold leading-none tracking-[-0.02em]";

const periodClass = "mt-1.5 text-[0.82rem] font-medium text-[#2d2a49]/55";

const buttonClass = (featured: boolean) =>
  `block w-full rounded-full py-3 text-center text-[0.95rem] font-semibold
   transition-colors duration-200 focus-visible:outline focus-visible:outline-2
   focus-visible:outline-offset-2 focus-visible:outline-[#2d2a49] ${
     featured
       ? "bg-[#2d2a49] text-[#f5eee8] hover:bg-[#3b3760]"
       : "text-[#2d2a49] ring-1 ring-[#2d2a49]/30 hover:bg-[#2d2a49]/5"
   }`;

/**
 * The section shares the page's beige, so a card cannot be told apart by being
 * beige too. The palette has exactly two colours, so the card surface is the
 * navy laid over the page at a few percent — a slightly deeper beige rather
 * than a third colour — with a hairline of the same navy to draw the edge.
 */
const cardSurface = "bg-[#2d2a49]/[0.05] ring-1 ring-[#2d2a49]/10";

export function Services() {
  const [annual, setAnnual] = useState(false);

  const renderPlan = (plan: Plan) => (
    <article
      key={plan.id}
      // Weight without resizing — a scaled card in a grid drags its whole row
      // along. The best seller keeps the same surface as the others and is
      // marked by a firmer edge instead, plus the badge and the only filled
      // button in the grid.
      className={`relative flex flex-col rounded-2xl p-7 text-[#2d2a49] sm:p-8 ${
        plan.featured
          ? "bg-[#2d2a49]/[0.05] ring-2 ring-[#2d2a49]/25"
          : cardSurface
      }`}
    >
      {plan.featured && (
        // Straddles the card's top edge, so it sits over both the card and the
        // page behind it. Solid navy reads against either — the two surfaces
        // are only a few percent apart, so a ring separating them would have
        // nothing to separate.
        <p className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#2d2a49] px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#f5eee8]">
          Le plus choisi
        </p>
      )}

      <h3 className="text-[1.25rem] font-bold leading-[1.25] tracking-[-0.01em] sm:text-[1.35rem]">
        {plan.title}
      </h3>

      <p className="mt-2 text-[0.9rem] leading-[1.6] text-[#2d2a49]/65">
        {plan.description}
      </p>

      <div className="mt-6">
        {plan.annual !== null ? (
          <div aria-hidden className="grid">
            <span className={`${SWAP_BASE} flex flex-col ${annual ? SWAP_HIDDEN : ""}`}>
              <span className={priceClass}>{plan.monthly}€</span>
              <span className={periodClass}>par mois</span>
            </span>
            <span className={`${SWAP_BASE} flex flex-col ${annual ? "" : SWAP_HIDDEN}`}>
              <span className={priceClass}>{plan.annual}€</span>
              <span className={periodClass}>par an</span>
            </span>
          </div>
        ) : (
          <div aria-hidden className="flex flex-col">
            <span className={priceClass}>{plan.monthly}€</span>
            <span className={periodClass}>par mois</span>
          </div>
        )}

        {/* What assistive tech reads instead of the stacked pair above. */}
        <p className="sr-only">
          {plan.annual !== null && annual
            ? `${plan.annual}€ par an`
            : `${plan.monthly}€ par mois`}
        </p>

        {/* A fixed-height slot under every price, so the savings chip and the
            monthly-only note fade in without pushing the list below them. */}
        <div className="mt-3 flex h-7 items-center">
          {plan.savings !== null && (
            <span
              className={`inline-flex items-center rounded-full bg-[#3a9e63]/15 px-3 py-1 text-[0.75rem] font-semibold text-[#2e7d4f] transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                annual ? "" : "pointer-events-none opacity-0 translate-y-1"
              }`}
              aria-hidden={!annual}
            >
              Économisez {plan.savings}€
            </span>
          )}
          {plan.annual === null && (
            <span
              className={`text-[0.78rem] text-[#2d2a49]/55 transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                annual ? "" : "pointer-events-none opacity-0 translate-y-1"
              }`}
              aria-hidden={!annual}
            >
              Facturation mensuelle uniquement
            </span>
          )}
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex gap-3 text-[0.92rem] leading-[1.55] text-[#2d2a49]/80"
          >
            <span
              aria-hidden
              className="mt-[0.55em] h-[5px] w-[5px] shrink-0 rounded-full bg-[#2d2a49]/50"
            />
            {feature}
          </li>
        ))}
      </ul>

      {/* `mt-auto` is what lines the buttons up: whatever the list above did,
          the button sinks to the card's floor, and the equalised rows put
          every card's floor on the same line. */}
      <div className="mt-auto pt-8">
        <Link
          href="/contact"
          aria-label={`Commencer : ${plan.title}`}
          className={buttonClass(plan.featured)}
        >
          Commencer
        </Link>
      </div>
    </article>
  );

  return (
    // No `data-dark-section`: the purple belongs to the presentation section
    // alone. That flag is also what the navbar, the scrollbar and the vlog tab
    // watch to invert themselves, so leaving it off is what keeps the navy pill
    // and wordmark — the readable pair over beige — while this section passes
    // under them.
    <section
      id="services"
      className="scroll-mt-24 overflow-hidden bg-[#f5eee8] px-6 py-20 sm:py-24 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1120px]">
        <h2 className="text-center font-extrabold uppercase leading-[0.95] tracking-[-0.035em] text-[clamp(2.2rem,8vw,4.5rem)] text-[#2d2a49]">
          Services
        </h2>

        <p className="mx-auto mt-4 max-w-[46ch] text-center text-[0.95rem] leading-[1.6] text-[#2d2a49]/60 sm:text-[1rem]">
          Choisissez la formule qui correspond à votre objectif.
        </p>

        {/* Two buttons over a sliding thumb. The thumb is width-of-one-option
            and translates by exactly its own width, so it lands under either
            label without ever being measured. */}
        <div className="mt-8 flex justify-center">
          <div
            role="group"
            aria-label="Période de facturation"
            className="relative grid grid-cols-2 rounded-full bg-[#2d2a49]/[0.07] p-1 ring-1 ring-[#2d2a49]/15"
          >
            <span
              aria-hidden
              className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-[#2d2a49] transition-[translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{ translate: annual ? "100% 0" : "0 0" }}
            />
            {[
              { label: "Mensuel", value: false },
              { label: "Annuel", value: true },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setAnnual(option.value)}
                aria-pressed={annual === option.value}
                className={`relative z-10 rounded-full px-6 py-2 text-[0.85rem] font-semibold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d2a49] sm:px-8 ${
                  annual === option.value
                    ? "text-[#f5eee8]"
                    : "text-[#2d2a49]/60 hover:text-[#2d2a49]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {annual ? "Tarifs annuels affichés." : "Tarifs mensuels affichés."}
        </p>

        {/* `1fr 1fr` rows rather than auto: each fr row is at least its
            content and the two are then equalised, which is what makes the
            four cards genuinely the same size instead of merely per-row. */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:gap-6 lg:mt-16 lg:grid-cols-2 lg:grid-rows-[1fr_1fr] lg:gap-7">
          {renderPlan(PLANS[0])}
          {renderPlan(PLANS[1])}

          {/* Not an offer — Anaïs herself, with the current billing mode set
              over her. Decorative, so it is hidden from assistive tech and
              ordered last on a phone, where a picture between two price cards
              would read as an interruption. */}
          <div
            aria-hidden
            className={`relative order-last aspect-[4/5] overflow-hidden rounded-2xl lg:order-none lg:aspect-auto ${cardSurface}`}
          >
            <Image
              src="/anais.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 92vw, 546px"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {/* The frosted pill is the "soft blur behind the text": it blurs
                  whatever of the photo sits behind it, so the word stays
                  readable over her without dimming the whole card. Carried at
                  55% rather than the 25% that sufficed over the purple —
                  the photo is a cut-out, so the pill now crosses both her and
                  the pale card surface showing through beside her, and the
                  beige lettering has to hold against the lighter of the two. */}
              <span className="rounded-full bg-[#2d2a49]/55 px-7 py-3 backdrop-blur-md">
                <span className="grid text-[1.6rem] font-extrabold uppercase tracking-[0.08em] text-[#f5eee8]">
                  <span className={`${SWAP_BASE} text-center ${annual ? SWAP_HIDDEN : ""}`}>
                    Mensuel
                  </span>
                  <span className={`${SWAP_BASE} text-center ${annual ? "" : SWAP_HIDDEN}`}>
                    Annuel
                  </span>
                </span>
              </span>
            </div>
          </div>

          {renderPlan(PLANS[2])}
        </div>

        {/* One-off sessions. Deliberately outside the toggle's reach: these are
            single purchases, and pretending a billing period applies to them
            would make the switch above look broken. */}
        <div className="mt-16 lg:mt-20">
          <div className="text-center">
            <h3 className="text-[1.15rem] font-bold text-[#2d2a49] sm:text-[1.25rem]">
              Cours individuels
            </h3>
            <p className="mt-2 text-[0.9rem] text-[#2d2a49]/55">
              Des séances à l’unité, sans abonnement.
            </p>
          </div>

          <ul className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {SESSIONS.map((session) => (
              <li
                key={session.label}
                className={`rounded-xl px-4 py-6 text-center ${cardSurface}`}
              >
                <span className="block text-[0.78rem] font-medium uppercase tracking-[0.1em] text-[#2d2a49]/55">
                  {session.label}
                </span>
                <span className="mt-2 block text-[1.7rem] font-extrabold text-[#2d2a49]">
                  {session.price}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
