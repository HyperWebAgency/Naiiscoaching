"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";

type BlobButtonSize = "sm" | "md" | "lg";

const SIZE_PRESETS: Record<
  BlobButtonSize,
  { button: string; mainClass: string; trailClass: string; main: number; trail: number }
> = {
  sm: {
    button: "px-[28px] py-[14px] text-[14px]",
    mainClass: "w-[56px] h-[56px]",
    trailClass: "w-[36px] h-[36px]",
    main: 56,
    trail: 36,
  },
  md: {
    button: "px-[40px] py-[19px] text-[16px]",
    mainClass: "w-[72px] h-[72px]",
    trailClass: "w-[48px] h-[48px]",
    main: 72,
    trail: 48,
  },
  lg: {
    button: "px-[52px] py-[24px] text-[18px]",
    mainClass: "w-[92px] h-[92px]",
    trailClass: "w-[60px] h-[60px]",
    main: 92,
    trail: 60,
  },
};

interface Spring {
  k: number;
  c: number;
  m: number;
  pos: number;
  vel: number;
  target: number;
}

function makeSpring(stiffness: number, damping: number, mass: number, initial: number): Spring {
  return { k: stiffness, c: damping, m: mass, pos: initial, vel: 0, target: initial };
}

function stepSpring(s: Spring, dt: number) {
  const force = -s.k * (s.pos - s.target) - s.c * s.vel;
  s.vel += (force / s.m) * dt;
  s.pos += s.vel * dt;
}

function isSettled(s: Spring) {
  return Math.abs(s.pos - s.target) < 0.05 && Math.abs(s.vel) < 0.05;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

interface ParticleSpec {
  id: number;
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  duration: number;
}

function makeParticle(
  id: number,
  x: number,
  y: number,
  opts: { minSize: number; maxSize: number; minDist: number; maxDist: number; minDur: number; maxDur: number }
): ParticleSpec {
  const size = rand(opts.minSize, opts.maxSize);
  const angle = Math.random() * Math.PI * 2;
  const dist = rand(opts.minDist, opts.maxDist);
  return {
    id,
    x,
    y,
    size,
    dx: Math.cos(angle) * dist,
    dy: Math.sin(angle) * dist,
    duration: rand(opts.minDur, opts.maxDur),
  };
}

function Particle({ spec, onDone }: { spec: ParticleSpec; onDone: (id: number) => void }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const anim = el.animate(
      [
        { transform: "translate(0px, 0px) scale(0)", offset: 0 },
        { transform: "translate(0px, 0px) scale(1)", offset: 0.16 },
        { transform: `translate(${spec.dx * 0.55}px, ${spec.dy * 0.55}px) scale(1)`, offset: 0.55 },
        { transform: `translate(${spec.dx}px, ${spec.dy}px) scale(0)`, offset: 1 },
      ],
      { duration: spec.duration, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)", fill: "forwards" }
    );
    anim.onfinish = () => onDone(spec.id);
    return () => anim.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span
      ref={ref}
      className="absolute top-0 left-0 rounded-full bg-[#f5eee8] pointer-events-none"
      style={{
        width: spec.size,
        height: spec.size,
        left: spec.x - spec.size / 2,
        top: spec.y - spec.size / 2,
      }}
    />
  );
}

export interface BlobButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  size?: BlobButtonSize;
  children: ReactNode;
}

export function BlobButton({
  size = "md",
  children,
  className,
  style,
  type = "button",
  onClick,
  ...rest
}: BlobButtonProps) {
  const filterId = `blob-goo-${useId().replace(/:/g, "")}`;
  const preset = SIZE_PRESETS[size];

  const buttonRef = useRef<HTMLButtonElement>(null);
  const mainBlobRef = useRef<HTMLSpanElement>(null);
  const trailBlobRef = useRef<HTMLSpanElement>(null);
  const gooLayerRef = useRef<HTMLSpanElement>(null);

  const [particles, setParticles] = useState<ParticleSpec[]>([]);
  const particleIdRef = useRef(0);

  // All per-frame physics state lives in a ref so the animation loop never triggers re-renders.
  const physicsRef = useRef({
    mainX: makeSpring(340, 24, 1, 0),
    mainY: makeSpring(340, 24, 1, 0),
    trailX: makeSpring(110, 15, 1, 0),
    trailY: makeSpring(110, 15, 1, 0),
    scale: makeSpring(170, 13, 1, 1),
    hovering: false,
    dwellTimer: null as ReturnType<typeof setTimeout> | null,
    reformTimer: null as ReturnType<typeof setTimeout> | null,
    rafId: null as number | null,
    lastTime: null as number | null,
  });

  const render = useCallback(() => {
    const p = physicsRef.current;
    if (mainBlobRef.current) {
      mainBlobRef.current.style.transform = `translate(${p.mainX.pos - preset.main / 2}px, ${
        p.mainY.pos - preset.main / 2
      }px) scale(${p.scale.pos})`;
    }
    if (trailBlobRef.current) {
      trailBlobRef.current.style.transform = `translate(${p.trailX.pos - preset.trail / 2}px, ${
        p.trailY.pos - preset.trail / 2
      }px) scale(${p.scale.pos})`;
    }
  }, [preset.main, preset.trail]);

  const allSettled = useCallback(() => {
    const p = physicsRef.current;
    return (
      isSettled(p.mainX) &&
      isSettled(p.mainY) &&
      isSettled(p.trailX) &&
      isSettled(p.trailY) &&
      isSettled(p.scale)
    );
  }, []);

  // The loop re-schedules itself, so it lives in a ref rather than referencing
  // its own binding from inside its body.
  const tickRef = useRef<(now: number) => void>(() => {});

  useEffect(() => {
    tickRef.current = (now: number) => {
      const p = physicsRef.current;
      const dt = Math.min((now - (p.lastTime ?? now)) / 1000, 0.032);
      p.lastTime = now;

      stepSpring(p.mainX, dt);
      stepSpring(p.mainY, dt);
      stepSpring(p.trailX, dt);
      stepSpring(p.trailY, dt);
      stepSpring(p.scale, dt);

      render();

      p.rafId =
        p.hovering || !allSettled()
          ? requestAnimationFrame((t) => tickRef.current(t))
          : null;
    };
  }, [render, allSettled]);

  const ensureLoop = useCallback(() => {
    const p = physicsRef.current;
    if (p.rafId === null) {
      p.lastTime = null;
      p.rafId = requestAnimationFrame((t) => tickRef.current(t));
    }
  }, []);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const p = physicsRef.current;
    p.mainX.pos = p.mainX.target = rect.width / 2;
    p.mainY.pos = p.mainY.target = rect.height / 2;
    p.trailX.pos = p.trailX.target = rect.width / 2;
    p.trailY.pos = p.trailY.target = rect.height / 2;
    render();
  }, [render]);

  useEffect(() => {
    const p = physicsRef.current;
    return () => {
      if (p.rafId !== null) cancelAnimationFrame(p.rafId);
      if (p.dwellTimer) clearTimeout(p.dwellTimer);
      if (p.reformTimer) clearTimeout(p.reformTimer);
    };
  }, []);

  const localPoint = (evt: React.PointerEvent<HTMLButtonElement>) => {
    const r = evt.currentTarget.getBoundingClientRect();
    return { x: evt.clientX - r.left, y: evt.clientY - r.top };
  };

  const spawnParticles = (
    x: number,
    y: number,
    count: number,
    opts: Parameters<typeof makeParticle>[3]
  ) => {
    const specs: ParticleSpec[] = [];
    for (let i = 0; i < count; i++) {
      particleIdRef.current += 1;
      specs.push(makeParticle(particleIdRef.current, x, y, opts));
    }
    setParticles((prev) => [...prev, ...specs]);
  };

  const removeParticle = (id: number) => {
    setParticles((prev) => prev.filter((particle) => particle.id !== id));
  };

  const handlePointerEnter = (evt: React.PointerEvent<HTMLButtonElement>) => {
    const p = physicsRef.current;
    if (p.dwellTimer) clearTimeout(p.dwellTimer);
    if (p.reformTimer) clearTimeout(p.reformTimer);
    p.dwellTimer = null;
    p.reformTimer = null;

    // Snap synchronously so there's no flash at the resting position before the first frame.
    const { x, y } = localPoint(evt);
    p.mainX.pos = p.mainX.target = x;
    p.mainY.pos = p.mainY.target = y;
    p.mainX.vel = p.mainY.vel = 0;
    p.trailX.pos = p.trailX.target = x;
    p.trailY.pos = p.trailY.target = y;
    p.trailX.vel = p.trailY.vel = 0;
    render();

    if (gooLayerRef.current) gooLayerRef.current.style.opacity = "1";
    p.hovering = true;

    p.dwellTimer = setTimeout(() => {
      const live = physicsRef.current;
      spawnParticles(live.mainX.pos, live.mainY.pos, 1, {
        minSize: preset.main * 0.2,
        maxSize: preset.main * 0.3,
        minDist: preset.main * 0.25,
        maxDist: preset.main * 0.45,
        minDur: 900,
        maxDur: 1050,
      });
    }, 1000);

    ensureLoop();
  };

  const handlePointerMove = (evt: React.PointerEvent<HTMLButtonElement>) => {
    const p = physicsRef.current;
    if (!p.hovering) return;
    const { x, y } = localPoint(evt);
    p.mainX.target = x;
    p.mainY.target = y;
    p.trailX.target = x;
    p.trailY.target = y;
  };

  const handlePointerLeave = () => {
    const p = physicsRef.current;
    if (p.dwellTimer) clearTimeout(p.dwellTimer);
    if (p.reformTimer) clearTimeout(p.reformTimer);
    p.dwellTimer = null;
    p.reformTimer = null;

    p.hovering = false;
    p.scale.target = 1;
    if (gooLayerRef.current) gooLayerRef.current.style.opacity = "0";
    ensureLoop();
  };

  const handleClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    const p = physicsRef.current;
    const x = p.mainX.pos;
    const y = p.mainY.pos;

    if (p.reformTimer) clearTimeout(p.reformTimer);
    p.scale.target = 0;

    spawnParticles(x, y, Math.round(rand(6, 9)), {
      minSize: preset.main * 0.11,
      maxSize: preset.main * 0.3,
      minDist: preset.main * 0.4,
      maxDist: preset.main * 0.95,
      minDur: 700,
      maxDur: 1200,
    });

    p.reformTimer = setTimeout(() => {
      physicsRef.current.scale.target = 1;
      ensureLoop();
    }, 250);

    ensureLoop();
    onClick?.(evt);
  };

  const filterStdDeviation = Math.max(6, preset.main * 0.11);

  return (
    <button
      {...rest}
      ref={buttonRef}
      type={type}
      className={[
        "relative isolate overflow-hidden rounded-full bg-[#2d2a49] text-[#f5eee8] font-semibold tracking-[0.01em]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#f5eee8]",
        preset.button,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={filterStdDeviation} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <span
        ref={gooLayerRef}
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 ease-out"
        style={{ filter: `url(#${filterId})` } as CSSProperties}
      >
        <span
          ref={mainBlobRef}
          className={`absolute top-0 left-0 bg-[#f5eee8] blob-shape ${preset.mainClass}`}
        />
        <span
          ref={trailBlobRef}
          className={`absolute top-0 left-0 bg-[#f5eee8] blob-shape blob-shape-trail ${preset.trailClass}`}
        />
        {particles.map((spec) => (
          <Particle key={spec.id} spec={spec} onDone={removeParticle} />
        ))}
      </span>

      <span className="relative z-10 mix-blend-difference pointer-events-none">{children}</span>
    </button>
  );
}
