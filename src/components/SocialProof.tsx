import { useRef, useEffect, useState } from 'react';
import { armOnApproach, belowTheFold, neverHide } from '../lib/revealObserver';
import facts from '../data/facts.json';
import GlassCard from './ui/GlassCard';
import Reveal from './ui/Reveal';
import GlowDisc from './ui/GlowDisc';

// Every stat here must be verifiable and comes from facts.json: userFloor is the
// 1,000+ users floor the hero and FinalCTA also show (RevenueCat new customers,
// confirmed by Karol 2026-11-17; this repo is public, so no raw figures here),
// translationCount = translations in the verse picker, and the rating is the US
// App Store value, shown only while facts.rating.show is true
// (scripts/check-facts.mjs keeps it current). No survey percentages without a source.
const stats: { value: number; label: string; suffix?: string; decimals?: number }[] = [
  { value: facts.userFloor, label: 'People have installed FaithWall', suffix: '+' },
  { value: facts.translationCount, label: 'Bible translations to pick from' },
  ...(facts.rating.show ? [{ value: Number(facts.rating.value), label: 'US App Store rating', decimals: 1 }] : []),
];

const DURATION_MS = 1000;

function formatCount(n: number, decimals: number, suffix: string) {
  if (decimals === 0) {
    return Math.floor(n).toLocaleString('en-US') + suffix; // floor, so a count in progress never rounds up past the final value
  }
  return n.toFixed(decimals) + suffix;
}

// cubic-bezier(0.22, 1, 0.36, 1), the same ease the old framer-motion tween used.
function easeOut(t: number): number {
  const x1 = 0.22, y1 = 1, x2 = 0.36, y2 = 1;
  const at = (a: number, b: number, u: number) => 3 * a * (1 - u) * (1 - u) * u + 3 * b * (1 - u) * u * u + u * u * u;
  let lo = 0, hi = 1, u = t;
  for (let i = 0; i < 20; i++) {
    u = (lo + hi) / 2;
    if (at(x1, x2, u) < t) lo = u;
    else hi = u;
  }
  return at(y1, y2, u);
}

function Counter({ value, suffix = '', decimals = 0, className = '' }: { value: number; suffix?: string; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = formatCount(value, decimals, suffix);
  // SSR renders the FINAL value, so crawlers, link previews and no-JS readers see real numbers (it used to ship
  // "0+" and "0%"). After hydration only a counter that is still below the fold resets to 0; it then counts up as it
  // nears the viewport (15% early, see lib/revealObserver). A counter already visible at hydration, or any counter
  // with reduced motion, a #hash or a back/forward load, keeps its final value: no flash to 0.
  const [display, setDisplay] = useState(final);

  useEffect(() => {
    const el = ref.current;
    if (!el || neverHide() || !belowTheFold(el)) return;
    let raf = 0;
    setDisplay(formatCount(0, decimals, suffix));
    const disarm = armOnApproach(el, () => {
      let start = 0;
      const tick = (now: number) => {
        if (!start) start = now;
        const t = Math.min(1, (now - start) / DURATION_MS);
        setDisplay(formatCount(t >= 1 ? value : value * easeOut(t), decimals, suffix));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    return () => {
      disarm();
      cancelAnimationFrame(raf);
      setDisplay(final);
    };
  }, [value, suffix, decimals, final]);

  // fw-count: tabular figures, and the final value reserved as width (::after from data-final), so the line never jitters.
  return (
    <span ref={ref} className={`fw-count ${className}`} data-final={final}>
      {display}
    </span>
  );
}

export default function SocialProof() {
  return (
    <section className="relative bg-surface py-16 sm:py-20">
      <div className="container-main">
        <div className={`grid gap-4 sm:gap-5 ${stats.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06} y={14}>
              <GlassCard className="relative h-full overflow-hidden px-6 py-9 text-center sm:py-12">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"
                />
                <GlowDisc className="-top-16 left-1/2 h-32 w-48 -translate-x-1/2" rx={96} ry={64} sigma={64} alpha={0.1} />
                <div className="relative text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent"
                  />
                </div>
                <p className="relative mt-3 text-sm font-medium text-white/60 sm:text-base">{stat.label}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
