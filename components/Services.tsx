import Image from "next/image";
import Link from "next/link";

/**
 * French typography, written out rather than left to `toLocaleString`: the
 * thousands separator is a narrow no-break space and the one before the euro
 * sign is a full no-break space. `toLocaleString("fr-FR")` picks between those
 * two characters depending on the ICU build, which means the server and the
 * browser can disagree and React reports a hydration mismatch on a price.
 */
const NBSP = " ";
const NNBSP = " ";

const euro = (amount: number) =>
  `${String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP)}${NBSP}€`;

/** Yearly price paid in one go, shown as one quiet line under the monthly
 *  rate. This replaced the mensuel/annuel switch, and then a whole panel above
 *  the button: the switch changed every price at once, and the panel sat so
 *  close to the CTA that clicking read as committing to the annual. As a line
 *  grouped with the monthly price, both are just facts about the same offer,
 *  and the billing choice happens where it really happens — talking to Anaïs. */
type Annual = {
  /** Twelve months at the monthly rate, struck through. */
  was: number;
  now: number;
  savings: number;
  /** `now` divided over twelve months, rounded. Written out rather than
   *  computed so that changing a price forces both numbers to be looked at. */
  perMonth: number;
};

type Plan = {
  id: string;
  title: string;
  /** Only the posing formule has one: the federations it prepares for. */
  subtitle?: string;
  monthly: number;
  commitment: string;
  /** The paragraphs under "Cet accompagnement est fait pour toi si…". */
  intro: string[];
  features: string[];
  annual?: Annual;
  cta: string;
};

const COACHING: Plan[] = [
  {
    id: "training-diete-mindset",
    title: "Suivi training + diète & mindset",
    monthly: 175,
    commitment: `Engagement initial de 3 mois${NBSP}· puis reconduction tacite mensuelle`,
    intro: [
      "…tu souhaites ne rien laisser au hasard dans ta transformation. En me confiant à la fois ton entraînement, ta nutrition et l’accompagnement sur ton mindset, je garde une vision globale de ta progression et peux faire évoluer chaque paramètre en fonction des autres.",
      // Her sentence ran on through a dash; split in two, which is what the dash
      // was standing in for anyway.
      "Moins de charge mentale pour toi : je construis, j’analyse et j’ajuste la stratégie au fil de ton évolution. Tu sais quoi faire, comment le faire et pourquoi tu le fais. Ton rôle est de t’investir et de passer à l’action.",
    ],
    features: [
      "Analyse complète de ton point de départ et de tes habitudes",
      "Programme d’entraînement 100 % personnalisé et évolutif",
      "Stratégie nutritionnelle 100 % personnalisée et adaptée à ton quotidien",
      "Bilan complet chaque semaine : questionnaire, photos et mensurations",
      "Retour vidéo personnalisé chaque semaine avec analyse, ajustements et priorités pour la semaine à venir",
      "Ajustements réguliers des plans et de la stratégie selon tes résultats, ton ressenti, ton évolution et tes retours",
      "Analyse et correction vidéo de tes exercices",
      "Suivi de tes données quotidiennes via l’application",
      "Travail sur tes habitudes, ta discipline et ton mindset",
      "Accompagnement et échanges via WhatsApp tout au long du suivi",
      "Un accompagnement humain, bienveillant et honnête : comprendre tes difficultés, te dire aussi ce que tu as parfois besoin d’entendre pour avancer, sans jamais perdre de vue tes objectifs, et trouver ensemble les solutions adaptées.",
    ],
    annual: { was: 2100, now: 1900, savings: 200, perMonth: 158 },
    cta: "Commencer mon suivi",
  },
  {
    id: "diete-mindset",
    title: "Suivi diète & mindset",
    monthly: 135,
    commitment: `Engagement initial de 3 mois${NBSP}· puis reconduction tacite mensuelle`,
    intro: [
      "…tu souhaites atteindre tes objectifs physiques grâce à une stratégie nutritionnelle entièrement construite autour de toi, tout en travaillant sur tes habitudes, ta discipline et ton mindset.",
      "Tu sais déjà gérer ton entraînement ou ne souhaites simplement pas être accompagné·e sur cette partie, mais tu veux arrêter de te demander constamment quoi manger, en quelles quantités, quoi modifier lorsque les résultats stagnent ou comment adapter ton alimentation aux imprévus de ton quotidien.",
      "Je prends en charge ta stratégie nutritionnelle et son évolution, avec une alimentation adaptée à tes objectifs mais aussi à ta vraie vie, pour construire des changements capables de durer bien au-delà du coaching.",
    ],
    features: [
      "Analyse complète de ton point de départ et de tes habitudes",
      "Stratégie nutritionnelle 100 % personnalisée et adaptée à ton quotidien",
      "Bilan complet chaque semaine : questionnaire, photos et mensurations",
      "Retour vidéo personnalisé chaque semaine avec analyse, ajustements et priorités pour la semaine à venir",
      "Ajustements réguliers des plans et de la stratégie selon tes résultats, ton ressenti, ton évolution et tes retours",
      "Suivi de tes données quotidiennes via l’application",
      "Travail sur tes habitudes, ta discipline et ton mindset",
      "Accompagnement et échanges via WhatsApp tout au long du suivi",
      "Un accompagnement humain, bienveillant et honnête : comprendre tes difficultés, te dire aussi ce que tu as parfois besoin d’entendre pour avancer, sans jamais perdre de vue tes objectifs, et trouver ensemble les solutions adaptées.",
    ],
    annual: { was: 1620, now: 1450, savings: 170, perMonth: 121 },
    cta: "Commencer mon suivi",
  },
];

const POSING: Plan = {
  id: "posing-mensuel",
  title: "Suivi posing mensuel",
  subtitle: `Bikini & Fit Model${NBSP}· NPC`,
  monthly: 120,
  commitment: "Sans engagement",
  intro: [
    "…tu souhaites progresser de manière régulière et travailler ton posing semaine après semaine, où que tu sois, avec un regard extérieur pour identifier précisément tes axes de progression.",
  ],
  features: [
    "1 envoi par semaine comprenant une vidéo de ta routine + une vidéo de tes comparaisons",
    "1 feedback vidéo personnalisé par semaine",
    "Analyse de tes poses, transitions, fluidité et présentation générale",
    "Axes de travail précis pour la semaine suivante",
    "Suivi de ton évolution au fil des semaines",
  ],
  cta: "Commencer mon suivi",
};

/**
 * One-off posing work. Two blocks rather than one grid of four prices: a
 * 30-minute session and a six-session pack are different purchases, and the
 * pack's validity window has nowhere to go in a price tile.
 *
 * Each line's name and price are stacked rather than joined by a dash, which is
 * both the house rule and the only way the longer pack names fit a narrow
 * column without wrapping mid-title.
 */
const SESSION_BLOCKS = [
  {
    id: "cours-individuels",
    title: "Cours individuels",
    description:
      "Une séance individuelle en visio pour travailler ton posing à mes côtés : poses, transitions, fluidité, mise en valeur de ton physique et corrections adaptées à tes besoins.",
    items: [
      { name: "30 minutes", price: 50, detail: null },
      { name: "45 minutes", price: 70, detail: null },
    ],
    cta: "Réserver une séance",
  },
  {
    id: "packs-de-seances",
    title: "Packs de séances",
    description:
      "Pour construire ton posing sur plusieurs séances et progresser jusqu’à obtenir une routine maîtrisée, naturelle et adaptée à ton physique.",
    items: [
      {
        name: "Pack 3 séances",
        price: 135,
        detail: `3 × 30 min${NBSP}· Valable 6 semaines à compter de la date d’achat`,
      },
      {
        name: "Pack 6 séances",
        price: 240,
        detail: `6 × 30 min${NBSP}· Valable 12 semaines à compter de la date d’achat`,
      },
    ],
    cta: "Choisir mon pack",
  },
];

/**
 * The section shares the page's beige, so a card cannot be told apart by being
 * beige too. The palette has exactly two colours, so the card surface is the
 * navy laid over the page at a few percent — a slightly deeper beige rather
 * than a third colour — with a hairline of the same navy to draw the edge.
 */
const cardSurface = "bg-[#2d2a49]/[0.05] ring-1 ring-[#2d2a49]/10";

const cardClass = `flex flex-col rounded-2xl p-7 text-[#2d2a49] sm:p-8 ${cardSurface}`;

const groupLabelClass =
  "text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#2d2a49]/45";

const primaryButtonClass =
  "block w-full rounded-full bg-[#2d2a49] py-3 text-center text-[0.95rem] font-semibold " +
  "text-[#f5eee8] transition-colors duration-200 hover:bg-[#3b3760] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-[#2d2a49]";

const secondaryButtonClass =
  "block w-full rounded-full py-3 text-center text-[0.95rem] font-semibold text-[#2d2a49] " +
  "ring-1 ring-[#2d2a49]/30 transition-colors duration-200 hover:bg-[#2d2a49]/5 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-[#2d2a49]";

/** A tick rather than a bullet: these are things the formule includes, and the
 *  mark should say so. Decorative — the list already announces itself. */
function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-[0.28em] h-[0.85em] w-[0.85em] shrink-0 text-[#2d2a49]/55"
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article className={cardClass}>
      <h4 className="text-[1.2rem] font-bold leading-[1.25] tracking-[-0.01em] sm:text-[1.3rem]">
        {plan.title}
      </h4>

      {plan.subtitle && (
        <p className="mt-1.5 text-[0.82rem] font-medium text-[#2d2a49]/55">
          {plan.subtitle}
        </p>
      )}

      <p className="mt-6 flex items-baseline gap-1.5">
        <span className="text-[2.5rem] font-extrabold leading-none tracking-[-0.02em]">
          {euro(plan.monthly)}
        </span>
        <span className="text-[0.95rem] font-medium text-[#2d2a49]/55">/ mois</span>
      </p>

      <p className="mt-2.5 text-[0.8rem] leading-[1.5] text-[#2d2a49]/55">
        {plan.commitment}
      </p>

      {plan.annual && (
        <>
          {/* What assistive tech reads instead of the struck-through pair
              below, which would otherwise be announced as two prices with no
              indication that the first one no longer applies. */}
          <p className="sr-only">
            {`Ou ${euro(plan.annual.now)} par an au lieu de ${euro(
              plan.annual.was
            )}, soit ${plan.annual.savings} euros économisés. Paiement unique, environ ${
              plan.annual.perMonth
            } euros par mois.`}
          </p>

          <div aria-hidden className="mt-4">
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[0.95rem]">
              <span className="text-[#2d2a49]/55">ou</span>
              <span className="font-medium text-[#2d2a49]/40 line-through">
                {euro(plan.annual.was)}
              </span>
              <span className="font-bold">{euro(plan.annual.now)} / an</span>
              <span className="inline-flex items-center self-center rounded-full bg-[#3a9e63]/15 px-2.5 py-0.5 text-[0.72rem] font-semibold text-[#2e7d4f]">
                Économise {euro(plan.annual.savings)}
              </span>
            </p>
            <p className="mt-1.5 text-[0.8rem] leading-[1.5] text-[#2d2a49]/55">
              Paiement unique{NBSP}· soit environ {euro(plan.annual.perMonth)} / mois
            </p>
          </div>
        </>
      )}

      <p className="mt-7 text-[0.95rem] font-semibold leading-[1.5]">
        Cet accompagnement est fait pour toi si…
      </p>

      {/* The first paragraph completes the heading's "…si", so it has to stay
          in sight — folded away, the heading would end on nothing. Only the
          paragraphs after it collapse. */}
      <p className="mt-3 text-[0.92rem] leading-[1.65] text-[#2d2a49]/70">
        {plan.intro[0]}
      </p>

      {plan.intro.length > 1 && (
        // Native disclosure rather than React state, which is what lets this
        // whole section stay a server component: the browser owns the
        // open/closed bit and no JavaScript ships for it.
        <details className="group mt-3">
          <summary
            className="flex cursor-pointer list-none items-center gap-1.5 text-[0.85rem]
                       font-semibold text-[#2d2a49]/70 transition-colors duration-200
                       hover:text-[#2d2a49] focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-[#2d2a49]
                       [&::-webkit-details-marker]:hidden"
          >
            {/* The label flips with the state, in CSS: both spans are always
                in the markup and `group-open` picks which one shows. */}
            <span className="group-open:hidden">Lire la suite</span>
            <span className="hidden group-open:inline">Réduire</span>
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              focusable="false"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 transition-transform duration-200 group-open:rotate-180"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <div className="mt-3 flex flex-col gap-3">
            {plan.intro.slice(1).map((paragraph) => (
              <p
                key={paragraph}
                className="text-[0.92rem] leading-[1.65] text-[#2d2a49]/70"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </details>
      )}

      <ul className="mt-7 flex flex-col gap-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex gap-2.5 text-[0.92rem] leading-[1.55] text-[#2d2a49]/80"
          >
            <Check />
            {feature}
          </li>
        ))}
      </ul>

      {/* `mt-auto` is what lines the buttons up: whatever the content above
          did, the button sinks to the card's floor, and grid items stretching
          to the row's height put every card's floor on the same line. */}
      <div className="mt-auto pt-8">
        <Link
          href="/contact"
          aria-label={`${plan.cta} : ${plan.title}`}
          className={primaryButtonClass}
        >
          {plan.cta}
        </Link>
      </div>
    </article>
  );
}

function SessionBlock({ block }: { block: (typeof SESSION_BLOCKS)[number] }) {
  return (
    <article className={cardClass}>
      <h4 className="text-[1.2rem] font-bold leading-[1.25] tracking-[-0.01em] sm:text-[1.3rem]">
        {block.title}
      </h4>

      <p className="mt-3 text-[0.92rem] leading-[1.65] text-[#2d2a49]/70">
        {block.description}
      </p>

      <ul className="mt-6 flex flex-col gap-2.5">
        {block.items.map((item) => (
          <li
            key={item.name}
            className="rounded-xl bg-[#2d2a49]/[0.06] px-4 py-3.5 ring-1 ring-[#2d2a49]/10"
          >
            {/* Name and price on one line, held apart by `justify-between`
                rather than joined by punctuation, and the price never wraps
                away from it. */}
            <p className="flex items-baseline justify-between gap-3">
              <span className="text-[0.92rem] font-semibold">{item.name}</span>
              <span className="whitespace-nowrap text-[1.15rem] font-extrabold leading-none">
                {euro(item.price)}
              </span>
            </p>
            {item.detail && (
              <p className="mt-1.5 text-[0.78rem] leading-[1.5] text-[#2d2a49]/55">
                {item.detail}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        <Link
          href="/contact"
          aria-label={`${block.cta} : ${block.title}`}
          className={secondaryButtonClass}
        >
          {block.cta}
        </Link>
      </div>
    </article>
  );
}

/**
 * No `data-dark-section`: the purple belongs to the presentation section alone.
 * That flag is also what the navbar, the scrollbar and the vlog tab watch to
 * invert themselves, so leaving it off is what keeps the navy pill and wordmark
 * — the readable pair over beige — while this section passes under them.
 *
 * A server component: with the billing switch gone there is no state left here,
 * so none of this needs to ship as JavaScript.
 */
export function Services() {
  return (
    <section
      id="services"
      className="scroll-mt-24 overflow-hidden bg-[#f5eee8] px-6 py-20 sm:py-24 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1120px]">
        <h2 className="text-center font-extrabold uppercase leading-[0.95] tracking-[-0.035em] text-[clamp(2rem,7vw,4rem)] text-[#2d2a49]">
          Mes accompagnements
        </h2>

        <p className="mx-auto mt-5 max-w-[46ch] text-center text-[1rem] leading-[1.6] text-[#2d2a49]/60 sm:text-[1.1rem]">
          Un accompagnement adapté à ton objectif, ton niveau et ton parcours.
        </p>

        {/* ── Naiis Coaching ─────────────────────────────────────────────── */}
        <div className="mt-16 lg:mt-20">
          <div className="text-center">
            <p className={groupLabelClass}>Naiis Coaching</p>
            <h3 className="mx-auto mt-3 max-w-[34ch] text-[1.3rem] font-bold leading-[1.3] tracking-[-0.01em] text-[#2d2a49] sm:text-[1.5rem]">
              Transforme ton physique, tes habitudes et ta façon d’aborder tes
              objectifs.
            </h3>
          </div>

          {/* `items-stretch` is the default, and it is what makes both cards
              take the row's height — which is what lets `mt-auto` on the
              buttons put them on the same line despite one card carrying two
              more features than the other. */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 lg:mt-12 lg:grid-cols-2 lg:gap-7">
            {COACHING.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>

        {/* ── Naiis Posing ───────────────────────────────────────────────── */}
        <div className="mt-20 lg:mt-28">
          <div className="text-center">
            <p className={groupLabelClass}>Naiis Posing</p>
            <h3 className="mx-auto mt-3 max-w-[42ch] text-[1.3rem] font-bold leading-[1.3] tracking-[-0.01em] text-[#2d2a49] sm:text-[1.5rem]">
              Apprends à mettre ton physique en valeur et construis un posing
              naturel, fluide et confiant pour révéler pleinement ton potentiel
              sur scène.
            </h3>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 lg:mt-12 lg:grid-cols-2 lg:gap-7">
            <PlanCard plan={POSING} />

            {/* TODO: swap for a competition photo when Anaïs has them — this
                block is the posing section's image and should look like posing,
                not like the coaching portrait reused. Decorative, so it is
                hidden from assistive tech. */}
            <div
              aria-hidden
              className={`relative aspect-[4/5] overflow-hidden rounded-2xl lg:aspect-auto ${cardSurface}`}
            >
              <Image
                src="/anais.png"
                alt=""
                fill
                sizes="(max-width: 1024px) 92vw, 536px"
                className="object-cover object-top"
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:gap-6 lg:mt-7 lg:grid-cols-2 lg:gap-7">
            {SESSION_BLOCKS.map((block) => (
              <SessionBlock key={block.id} block={block} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
