"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { CALENDLY_URL, CONTACT_EMAIL } from "@/lib/site";

// The arc: doubt first, then the work that answers it, then readiness.
const WORDS = [
  "DOUTE",
  "DISCIPLINE",
  "EFFORT",
  "SUEUR",
  "RIGUEUR",
  "PATIENCE",
  "CONSTANCE",
  "VOLONTÉ",
  "DÉPASSEMENT",
];
// Written inclusively, like the title it hands over to and like Anaïs's own
// copy: her clientèle is mostly women, and a masculine-only landing word would
// address the wrong person at the sequence's most emphatic moment.
const FINAL_WORD = "PRÊT·E.";

// Once the form opens, the single word gives way to the question the form
// answers, and the line under it that lowers the barrier to starting.
const FORM_TITLE = "Prêt·e à commencer ?";
const FORM_SUBTITLE = "Quelques informations suffisent pour faire le premier pas.";

// And once it is sent, the title is answered in the same spot rather than the
// confirmation opening somewhere further down the page. It opens on the
// visitor's name, so the answer reads as being addressed to them.
const sentHeadline = (firstName: string) =>
  firstName
    ? `${firstName}, je te recontacte très vite pour échanger sur ton projet.`
    : "Je te recontacte très vite pour échanger sur ton projet.";

/**
 * The four answers to "quel accompagnement t’intéresse ?", in her order. The
 * last one is the escape hatch, which is what lets the field be required: there
 * is always a true answer available, so nobody is forced to guess a formule to
 * get past it.
 */
const FORMULES = [
  "Suivi training + diète & mindset",
  "Suivi diète & mindset",
  "Suivi posing mensuel",
  "Je ne sais pas encore, j’aimerais en discuter",
];

/** The name now opens the sentence, so a lowercased entry must not start it. */
function capitalise(word: string) {
  return word ? word[0].toUpperCase() + word.slice(1) : "";
}

// On the navy page the accent is the site's cream — no third colour.
const CREAM = "#f5eee8";

const STEP_FAST = 85; // ms on the first word
const STEP_SLOW = 480; // ms on the last word before the landing
const FINAL_HOLD = 1100;
// A beat of empty navy first. Without it the opening word is scheduled for the
// same tick as the mount and React renders the two together, so DOUTE — the
// word the whole sequence answers — never gets a frame of its own.
const LEAD_IN = 140;
// One even, unhurried pace when motion is reduced. The hazard in the normal
// run is not the words — it is the ~12Hz flicker at the fast end, and the blur
// and scale each word arrives on. This drops both and keeps the sequence.
const STEP_CALM = 340;

/** Quadratic ramp: quick flicker at the start, deliberate beats at the end. */
function stepDuration(index: number, total: number) {
  const t = total <= 1 ? 1 : index / (total - 1);
  return STEP_FAST + (STEP_SLOW - STEP_FAST) * t * t;
}

/**
 * A water-droplet "plink": a sine whose pitch falls quickly into its base note,
 * low-passed so it reads as soft rather than clicky, with a fast attack and an
 * exponential tail. The falling pitch is what makes it sound wet instead of
 * percussive.
 */
function playDroplet(ctx: AudioContext, baseFreq: number, isFinal = false) {
  const now = ctx.currentTime;
  const decay = isFinal ? 1.1 : 0.32;

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(baseFreq * (isFinal ? 1.7 : 2.5), now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq, now + (isFinal ? 0.2 : 0.09));

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(3400, now);
  lowpass.Q.value = 0.6;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(isFinal ? 0.3 : 0.2, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

  osc.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + decay + 0.05);

  if (isFinal) {
    // An octave below, so the landing resolves instead of just stopping.
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(baseFreq * 0.5, now);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.exponentialRampToValueAtTime(0.16, now + 0.03);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 1.5);
  }
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

const SEEN_KEY = "naiis:contact-intro-seen";

/**
 * Read once per page load and then frozen, which is what makes this safe to
 * read during render: marking the intro as seen part-way through must not flip
 * the answer and cut the sequence off mid-run. A reload gets a fresh module and
 * so a fresh read.
 *
 * Session storage rather than local: the intro is worth seeing once per visit,
 * but a visitor coming back next week should get it again rather than never
 * seeing it a second time.
 */
let seenCache: boolean | null = null;

function getIntroSeen() {
  if (seenCache === null) {
    try {
      seenCache = window.sessionStorage.getItem(SEEN_KEY) !== null;
    } catch {
      // Storage can throw outright when cookies are blocked; treat that as a
      // first visit rather than breaking the page.
      seenCache = false;
    }
  }
  return seenCache;
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Nothing to do — the intro simply plays again next time.
  }
}

/** Nothing external changes this within a page load, so there is nothing to subscribe to. */
function subscribeIntroSeen() {
  return () => {};
}

/** The server has no session storage, so it always renders the first visit. */
function getServerIntroSeen() {
  return false;
}

const EMPTY = { nom: "", telephone: "", formule: "", message: "", email: "" };

// A French mobile is ten digits. Reaching the tenth means the number is
// complete, which is the moment to ask for one more thing rather than showing
// an extra empty box up front.
const PHONE_REVEAL_DIGITS = 10;

/** Groups digits by pairs as they're typed — "0612345678" becomes "06 12 34 56 78". */
function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 15);
  return digits.match(/.{1,2}/g)?.join(" ") ?? "";
}

// The ring is drawn by animating its dash offset from full circumference down
// to zero. Radius and circumference have to move together — deriving the
// second from the first is what keeps that true if the radius ever changes.
const SUCCESS_RING_RADIUS = 60;
const SUCCESS_RING_CIRCUMFERENCE = 2 * Math.PI * SUCCESS_RING_RADIUS;

// Three timers, one sequence: the ring starts closing almost immediately, the
// check pops the moment it finishes, and the way back out trails in after it.
// The confirmation wording itself is up in the headline, not on a timer.
const RING_DRAW_DELAY = 100;
const CHECKMARK_DELAY = 1200;
const RETURN_LINK_DELAY = 1500;

export function ContactExperience() {
  // The sequence is an arrival, so it belongs to the first arrival only —
  // whether the visitor comes back by reloading or by navigating in again.
  const introSeen = useSyncExternalStore(
    subscribeIntroSeen,
    getIntroSeen,
    getServerIntroSeen
  );

  // -1 until the first word lands: the page paints navy for a beat before the
  // sequence starts, rather than flashing a word during hydration.
  const [index, setIndex] = useState(-1);
  const [done, setDone] = useState(false);
  const [values, setValues] = useState(EMPTY);
  // Sticky: once the field is out, it stays out. Backspacing a digit to fix a
  // typo would otherwise collapse a box the visitor may have already filled.
  const [emailRevealed, setEmailRevealed] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof EMPTY>>({});
  const [sent, setSent] = useState(false);
  // The success ring, checkmark and return link each arrive on their own beat
  // once `sent` flips, driven by the timers in `handleSubmit`.
  const [ringOffset, setRingOffset] = useState(SUCCESS_RING_CIRCUMFERENCE);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showReturnLink, setShowReturnLink] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const headlineRef = useRef<HTMLSpanElement>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // The intro effect below only cleans up `timersRef` while it is still
  // wired up, which stops being true once the intro has already played —
  // exactly the state a visitor is in when the success timers get scheduled.
  // This is the cleanup that actually reaches them if the page is left mid-animation.
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const openForm = useCallback(() => {
    clearTimers();
    setDone(true);
  }, [clearTimers]);

  // The sequence is the page's entrance, so it runs on mount rather than
  // waiting for a trigger the way the old overlay did.
  useEffect(() => {
    if (introSeen) return;

    // Marked at the start, not at the end: reloading half way through is still
    // a visitor who has seen it and does not want it again.
    markIntroSeen();

    // Reduced motion gets the sequence at a calmer pace rather than no sequence
    // at all. Phones report this preference far more often than desktops do —
    // Android battery saver and iOS Low Power Mode both switch it on — so
    // skipping outright meant the intro silently never played for a large share
    // of the people it was built for.
    const calm = window.matchMedia(REDUCED_QUERY).matches;

    // Audio is decoration. Safari caps how many AudioContexts a page may hold
    // and throws once past it, and a throw here used to abort the effect before
    // a single word was scheduled — taking the whole sequence down with it.
    let ctx: AudioContext | null = null;
    try {
      const Ctor =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctor) {
        ctx = new Ctor();
        void ctx.resume();
      }
    } catch {
      ctx = null;
    }

    // Arriving from the Contact link is a client-side navigation, so the
    // document is already user-activated and the context starts running. On a
    // cold load of /contact there has been no gesture yet: the sequence plays
    // silently, and the first interaction turns the sound on for what follows.
    let wake: (() => void) | null = null;
    if (ctx && ctx.state !== "running") {
      const audio = ctx;
      wake = () => {
        try {
          void audio.resume();
        } catch {
          // Nothing to recover: the sequence simply stays silent.
        }
      };
      window.addEventListener("pointerdown", wake, { once: true });
      window.addEventListener("keydown", wake, { once: true });
    }

    const total = WORDS.length + 1;
    let elapsed = LEAD_IN;

    for (let i = 0; i < total; i += 1) {
      const isFinal = i === WORDS.length;
      const at = elapsed;
      const t = setTimeout(() => {
        // The word first, always. Whatever the audio does after this line, the
        // sequence has already advanced.
        setIndex(i);
        if (ctx && ctx.state === "running") {
          try {
            // Pitch climbs through the sequence so the run feels like it's building.
            const base = 420 + (i / total) * 300;
            playDroplet(ctx, isFinal ? 300 : base, isFinal);
          } catch {
            // A dead audio node must not stop the words.
          }
        }
      }, at);
      timersRef.current.push(t);
      elapsed += isFinal ? FINAL_HOLD : calm ? STEP_CALM : stepDuration(i, total);
    }

    const toForm = setTimeout(() => setDone(true), elapsed);
    timersRef.current.push(toForm);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      if (wake) {
        window.removeEventListener("pointerdown", wake);
        window.removeEventListener("keydown", wake);
      }
      try {
        void ctx?.close();
      } catch {
        // Already closed, or never opened.
      }
    };
  }, [introSeen]);

  // Escape skips the rest of the sequence rather than leaving the page.
  useEffect(() => {
    if (done) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") openForm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, openForm]);

  // Move focus into the form when it opens, so keyboard users land in it.
  const showForm = introSeen || done;
  useEffect(() => {
    if (showForm && !sent) firstFieldRef.current?.focus();
  }, [showForm, sent]);

  // The confirmation replaces the headline, which is not somewhere focus would
  // travel on its own. `preventScroll` because the column re-centres as the
  // form collapses — letting the browser chase the element mid-transition
  // fights that movement.
  useEffect(() => {
    if (sent) headlineRef.current?.focus({ preventScroll: true });
  }, [sent]);

  const update =
    (field: keyof typeof EMPTY) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const updatePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValues((v) => ({ ...v, telephone: formatted }));
    setErrors((prev) => ({ ...prev, telephone: undefined }));
    if (formatted.replace(/\D/g, "").length >= PHONE_REVEAL_DIGITS) {
      setEmailRevealed(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Tutoiement throughout, to match the labels she wrote for this page.
    const next: Partial<typeof EMPTY> = {};
    if (!values.nom.trim()) next.nom = "Indique ton nom et prénom.";
    if (!values.telephone.trim()) next.telephone = "Indique ton numéro.";
    else if (values.telephone.replace(/\D/g, "").length < 8)
      next.telephone = "Ce numéro semble incomplet.";
    if (!values.formule) next.formule = "Choisis l’accompagnement qui t’intéresse.";
    if (!values.message.trim()) next.message = "Dis-moi où tu en es.";
    if (emailRevealed) {
      if (!values.email.trim()) next.email = "Indique ton e-mail.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
        next.email = "Cet e-mail semble incorrect.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // No backend yet: hand the message to the visitor's mail client so it
    // genuinely reaches someone. Formspree is the endpoint this is waiting on —
    // every field already carries the `name` Formspree posts under, so wiring it
    // is a `fetch` to the form's action in place of the two lines below.
    const subject = encodeURIComponent(`Demande de coaching : ${values.nom}`);
    const body = encodeURIComponent(
      `Nom et prénom : ${values.nom}\nTéléphone : ${values.telephone}` +
        (values.email.trim() ? `\nE-mail : ${values.email.trim()}` : "") +
        `\nAccompagnement : ${values.formule}` +
        `\n\n${values.message}\n`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);

    if (window.matchMedia(REDUCED_QUERY).matches) {
      // No draw, no pop, no stagger — just the finished state, at once.
      setRingOffset(0);
      setShowCheckmark(true);
      setShowReturnLink(true);
    } else {
      timersRef.current.push(setTimeout(() => setRingOffset(0), RING_DRAW_DELAY));
      timersRef.current.push(setTimeout(() => setShowCheckmark(true), CHECKMARK_DELAY));
      timersRef.current.push(setTimeout(() => setShowReturnLink(true), RETURN_LINK_DELAY));
    }
  };

  const started = index >= 0;
  const isFinal = index >= WORDS.length;
  // Read once here rather than in the JSX: the confirmation is the only place
  // the name is used, and it opens the sentence.
  const firstName = capitalise(values.nom.trim().split(/\s+/)[0] ?? "");
  // PRÊT·E is the sequence's landing; opening the form turns it into the title.
  // The non-breaking space holds the line's height through the opening beat.
  const headline = sent
    ? sentHeadline(firstName)
    : showForm
      ? FORM_TITLE
      : started
        ? isFinal
          ? FINAL_WORD
          : WORDS[index]
        : " ";

  const fieldClass =
    "w-full rounded-2xl border bg-transparent px-4 py-3 text-[0.95rem] text-[#f5eee8] " +
    "placeholder:text-[#f5eee8]/35 outline-none transition-colors duration-200";

  const cornerClass =
    "absolute bottom-8 right-6 rounded-full px-4 py-2 text-[0.72rem] font-medium uppercase " +
    "tracking-[0.08em] text-[#f5eee8]/50 transition-colors hover:text-[#f5eee8] " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5eee8]";

  return (
    // No `overflow-hidden` here: the form is taller than a short window, and
    // clipping at this level would put it out of reach instead of scrolling.
    <section data-dark-section className="relative min-h-svh bg-[#2d2a49]">
      {/* The vertical padding is doing two jobs. Centred content is fine while
          it fits, but the moment it is taller than the viewport this padding
          becomes the floor the content rests on — and at `py-16` that floor was
          64px, while the fixed navbar's bottom edge is at 78px. So on any short
          window the headline sat *under* the navigation, and opening the email
          field pushed more sizes into that state. Raised clear of the navbar
          (47px on phones, 78px from md up) with room to spare, and kept
          symmetric so the resting composition stays visually centred. */}
      <div className="flex min-h-svh flex-col items-center justify-center px-6 py-24 md:py-32">
        {/* Sits in the band between the fixed navbar and the headline rather
            than beside the wordmark: NAIIS reaches leftward from the centre, and
            measured across widths the space to its left falls to 23px at 360,
            which will not hold this label. The gap under the navbar is 45-283px
            everywhere, so it always fits there.

            Absolute rather than fixed, so on a short window it scrolls away with
            the page instead of hovering over the form. */}
        {showForm && (
          <Link
            href="/"
            className="group absolute left-6 top-[62px] z-20 inline-flex items-center gap-2
                       text-[0.72rem] font-medium uppercase tracking-[0.08em] text-[#f5eee8]/50
                       transition-colors duration-200 hover:text-[#f5eee8]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-[#f5eee8] md:top-[96px]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              focusable="false"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[14px] w-[14px] shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Retour à l’accueil
          </Link>
        )}
        {/* Everything sits in one centred column, so when the form opens below
            the word the column grows and re-centres — and the word rising is
            that growth rather than a separate animation chasing it. */}
        <div className="flex w-full flex-col items-center">
          <span
            // Remounting on the swap is what replays the blur-in, so the
            // confirmation arrives the same way every other line here does
            // rather than the text simply changing underneath.
            key={sent ? "sent" : showForm ? "headline" : index}
            ref={headlineRef}
            id={showForm ? "contact-headline" : undefined}
            // Submitting makes the form `inert`, which drops focus to the body.
            // Focus moves here instead, so the confirmation is what a screen
            // reader lands on rather than nothing at all.
            tabIndex={sent ? -1 : undefined}
            // A decorative flash during the sequence; real content once it
            // becomes the line above the form.
            aria-hidden={showForm ? undefined : true}
            className={
              showForm
                ? // Two states, two sizes: the title reads as a heading, the
                  // confirmation as a sentence.
                  `intro-word intro-word-final px-6 text-center tracking-[-0.01em] text-[#f5eee8] ${
                    sent
                      ? "max-w-[24ch] text-[1.15rem] font-semibold leading-[1.45] sm:text-[1.4rem]"
                      : "text-[1.5rem] font-bold leading-[1.25] sm:text-[1.9rem]"
                  }`
                : `intro-word ${isFinal ? "intro-word-final" : ""} select-none px-6 text-center font-extrabold uppercase leading-none tracking-[-0.02em] text-[#f5eee8] text-[2.5rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7rem]`
            }
          >
            {headline}
          </span>

          {/* Her line under the title. It opens on the same collapsing row the
              form uses rather than mounting and unmounting, so sending the form
              closes it in step with everything else instead of snapping it out
              from under the confirmation. The padding rather than a margin
              because a margin would escape the clip while the row is closed. */}
          <div
            className="intro-form-row grid w-full transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ gridTemplateRows: showForm && !sent ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <p
                aria-hidden={!showForm || sent}
                className="mx-auto max-w-[36ch] px-6 pt-3 text-center text-[0.95rem] leading-[1.55] text-[#f5eee8]/60 sm:text-[1.05rem]"
              >
                {FORM_SUBTITLE}
              </p>
            </div>
          </div>

          {isFinal && !showForm && (
            <span
              aria-hidden
              className="intro-rule mt-8 h-[2px] w-[120px] sm:w-[180px]"
              style={{ backgroundColor: CREAM }}
            />
          )}
        </div>

        {/* A 0fr → 1fr grid row: the one way to transition to a height the
            content decides for itself. The column above re-centres as it opens,
            which is what carries the word upward. */}
        <div
          className="intro-form-row grid w-full max-w-[440px] transition-[grid-template-rows] duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ gridTemplateRows: showForm ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            {showForm && (
              <div className="intro-form w-full pt-10">
                {/* The confirmation lives up in the headline now, so this box
                    no longer has to hold whichever of the two states is taller:
                    the form's row collapses to nothing as the success row
                    opens, and the height morphs between them rather than
                    jumping. Same 0fr/1fr row the form and the e-mail field
                    already open with. */}
                <div>
                  <div
                    className="intro-form-row grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ gridTemplateRows: sent ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      {/* `pb-3` is the return link's landing room, not spacing.
                          It rises the last 8px into place, and the clip this
                          row needs to collapse cuts at the padding edge — with
                          the link flush to the bottom, that sliced the bottom
                          off a cream pill mid-entrance and read as it sliding
                          out from under something. */}
                      <div
                        inert={!sent}
                        className={`flex flex-col items-center gap-6 pb-3 text-center transition-all duration-700 motion-reduce:transition-none ${
                          sent
                            ? "scale-100 opacity-100"
                            : "pointer-events-none scale-105 opacity-0"
                        }`}
                      >
                        <div className="relative h-32 w-32 text-[#f5eee8]">
                          {/* -rotate-90 makes the stroke start at 12 o’clock
                              instead of the 3 o’clock an SVG circle draws
                              from by default. */}
                          <svg
                            viewBox="0 0 128 128"
                            aria-hidden
                            focusable="false"
                            className="h-32 w-32 -rotate-90"
                          >
                            {/* Faint static track, so the ring on top reads as
                                tracing itself rather than as having simply
                                always been there. */}
                            <circle
                              cx="64"
                              cy="64"
                              r={SUCCESS_RING_RADIUS}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeOpacity="0.15"
                            />
                            <circle
                              cx="64"
                              cy="64"
                              r={SUCCESS_RING_RADIUS}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              className="transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none"
                              style={{
                                strokeDasharray: SUCCESS_RING_CIRCUMFERENCE,
                                strokeDashoffset: ringOffset,
                              }}
                            />
                          </svg>

                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden
                            focusable="false"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className={`absolute inset-0 m-auto h-16 w-16 transition-all duration-500 motion-reduce:transition-none ${
                              showCheckmark ? "scale-100 opacity-100" : "scale-0 opacity-0"
                            }`}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>

                        <Link
                          href="/"
                          className={`rounded-full bg-[#f5eee8] px-5 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-[#2d2a49] transition-all duration-500 motion-reduce:transition-none ${
                            showReturnLink
                              ? "translate-y-0 opacity-100"
                              : "translate-y-2 opacity-0"
                          }`}
                        >
                          Retour à l’accueil
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div
                    className="intro-form-row grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ gridTemplateRows: sent ? "0fr" : "1fr" }}
                  >
                    <div className="overflow-hidden">
                      <div
                        inert={sent}
                        className={`transition-all duration-700 motion-reduce:transition-none ${
                          sent
                            ? "pointer-events-none scale-95 opacity-0"
                            : "scale-100 opacity-100"
                        }`}
                      >
                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="contact-nom"
                        className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[#f5eee8]/60"
                      >
                        Nom &amp; prénom
                      </label>
                      <input
                        id="contact-nom"
                        ref={firstFieldRef}
                        type="text"
                        name="nom"
                        autoComplete="name"
                        value={values.nom}
                        onChange={update("nom")}
                        aria-invalid={!!errors.nom}
                        className={fieldClass}
                        style={{
                          borderColor: errors.nom ? "#e08b7a" : "rgba(245,238,232,0.22)",
                        }}
                      />
                      {errors.nom && (
                        <span className="text-[0.78rem] text-[#e08b7a]">{errors.nom}</span>
                      )}
                    </div>

                    {/* Phone and the field it summons, grouped with no gap of
                        their own: the spacing lives inside the collapsing row,
                        so a closed row takes up nothing at all rather than
                        leaving a double gap behind it. */}
                    <div className="flex flex-col">
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="contact-tel"
                          className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[#f5eee8]/60"
                        >
                          Téléphone
                        </label>
                        <input
                          id="contact-tel"
                          type="tel"
                          name="telephone"
                          inputMode="tel"
                          autoComplete="tel"
                          value={values.telephone}
                          onChange={updatePhone}
                          aria-invalid={!!errors.telephone}
                          className={fieldClass}
                          style={{
                            borderColor: errors.telephone
                              ? "#e08b7a"
                              : "rgba(245,238,232,0.22)",
                          }}
                        />
                        {errors.telephone && (
                          <span className="text-[0.78rem] text-[#e08b7a]">
                            {errors.telephone}
                          </span>
                        )}
                      </div>

                      {/* Same 0fr -> 1fr row the form itself opens with, so the
                          height is the content's own and the two reveals feel
                          like one idea. */}
                      <div
                        className="intro-form-row grid transition-[grid-template-rows] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{ gridTemplateRows: emailRevealed ? "1fr" : "0fr" }}
                      >
                        <div className="overflow-hidden">
                          <div className="flex flex-col gap-1.5 pt-4">
                            <label
                              htmlFor="contact-email"
                              className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[#f5eee8]/60"
                            >
                              E-mail
                            </label>
                            <input
                              id="contact-email"
                              type="email"
                              name="email"
                              inputMode="email"
                              autoComplete="email"
                              // Off-screen while closed, so it must be out of
                              // the tab order too — otherwise Tab stops on a
                              // box nobody can see.
                              tabIndex={emailRevealed ? undefined : -1}
                              aria-hidden={!emailRevealed}
                              value={values.email}
                              onChange={update("email")}
                              aria-invalid={!!errors.email}
                              className={fieldClass}
                              style={{
                                borderColor: errors.email
                                  ? "#e08b7a"
                                  : "rgba(245,238,232,0.22)",
                              }}
                            />
                            {errors.email && (
                              <span className="text-[0.78rem] text-[#e08b7a]">
                                {errors.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="contact-formule"
                        className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[#f5eee8]/60"
                      >
                        Quel accompagnement t’intéresse&nbsp;?
                      </label>
                      {/* `relative` for the chevron, which is drawn here because
                          `appearance-none` removes the browser's own — and
                          without it the box reads as a text field that refuses
                          to take typing. */}
                      <div className="relative">
                        <select
                          id="contact-formule"
                          name="accompagnement"
                          value={values.formule}
                          onChange={update("formule")}
                          aria-invalid={!!errors.formule}
                          // `color-scheme: dark` is what makes the native option
                          // list paint dark. Without it the popup is drawn from
                          // the control's own background, which is transparent
                          // here, and lands as cream text on white.
                          className={`${fieldClass} cursor-pointer appearance-none pr-11 [color-scheme:dark]`}
                          style={{
                            borderColor: errors.formule
                              ? "#e08b7a"
                              : "rgba(245,238,232,0.22)",
                            // Inline rather than a utility: `fieldClass` already
                            // sets a text colour, and two utilities of equal
                            // specificity would be decided by stylesheet order
                            // rather than by which one is meant to win.
                            color: values.formule ? CREAM : "rgba(245,238,232,0.35)",
                          }}
                        >
                          {/* Disabled rather than a real value, so an untouched
                              form cannot arrive reading as the first formule —
                              which would be a lead about the wrong offer. */}
                          <option value="" disabled>
                            Choisis ton accompagnement
                          </option>
                          {FORMULES.map((formule) => (
                            <option
                              key={formule}
                              value={formule}
                              style={{ backgroundColor: "#2d2a49", color: CREAM }}
                            >
                              {formule}
                            </option>
                          ))}
                        </select>

                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden
                          focusable="false"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#f5eee8]/45"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                      {errors.formule && (
                        <span className="text-[0.78rem] text-[#e08b7a]">
                          {errors.formule}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="contact-msg"
                        className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[#f5eee8]/60"
                      >
                        Parle-moi de toi et de ton objectif
                      </label>
                      <textarea
                        id="contact-msg"
                        name="message"
                        rows={4}
                        value={values.message}
                        onChange={update("message")}
                        aria-invalid={!!errors.message}
                        placeholder="Quelques mots sur toi, ton objectif et ce qui t’amène jusqu’ici suffisent"
                        className={`${fieldClass} resize-none`}
                        style={{
                          borderColor: errors.message
                            ? "#e08b7a"
                            : "rgba(245,238,232,0.22)",
                        }}
                      />
                      {errors.message && (
                        <span className="text-[0.78rem] text-[#e08b7a]">
                          {errors.message}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="mt-1 rounded-full bg-[#f5eee8] px-6 py-3 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-[#2d2a49] transition-opacity duration-200 hover:opacity-90"
                    >
                      Envoyer
                    </button>

                    <div className="flex items-center gap-3" aria-hidden>
                      <span className="h-px flex-1 bg-[#f5eee8]/15" />
                      <span className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[#f5eee8]/45">
                        ou
                      </span>
                      <span className="h-px flex-1 bg-[#f5eee8]/15" />
                    </div>

                    <a
                      href={CALENDLY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[#f5eee8]/35 px-6 py-3 text-center text-[0.82rem] font-bold uppercase tracking-[0.1em] text-[#f5eee8] transition-colors duration-200 hover:border-[#f5eee8]"
                    >
                      Choisir un créneau d’appel
                    </a>
                  </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Only the skip now. Getting back to the site is the breadcrumb's job,
            and a breadcrumb belongs at the top of the page, not in a corner. */}
        {!showForm && (
          <button type="button" onClick={openForm} className={cornerClass}>
            Passer
          </button>
        )}
      </div>
    </section>
  );
}
