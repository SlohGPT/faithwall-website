import { useRef, useEffect, useState, type RefObject } from 'react';
import facts from '../data/facts.json';
import GlassCard from './ui/GlassCard';
import Reveal from './ui/Reveal';

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

function formatCount(n: number, decimals: number, suffix: string) {
  if (decimals === 0 && n >= 1000) {
    return Math.floor(n).toLocaleString('en-US') + suffix;
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

// True once the element has been at least half visible (one-time).
function useInViewOnce(ref: RefObject<Element>): boolean {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen]);
  return seen;
}

function Counter({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInViewOnce(ref);
  // SSR renders the FINAL value, so crawlers, link previews and no-JS readers
  // see real numbers (it used to ship "0+" and "0%"). After hydration, a counter
  // that is still below the fold resets to 0 and counts up when scrolled to.
  const [display, setDisplay] = useState(() => formatCount(value, decimals, suffix));
  const armed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (el && el.getBoundingClientRect().top > window.innerHeight) {
      armed.current = true;
      setDisplay(formatCount(0, decimals, suffix));
    }
  }, [decimals, suffix]);

  useEffect(() => {
    if (!isInView || !armed.current) return;
    const DURATION = 1600;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / DURATION);
      setDisplay(formatCount(t >= 1 ? value : value * easeOut(t), decimals, suffix));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value, decimals, suffix]);

  return <span ref={ref}>{display}</span>;
}

export default function SocialProof() {
  return (
    <section className="relative bg-surface py-16 sm:py-20">
      <div className="container-main">
        <div className={`grid gap-4 sm:gap-5 ${stats.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} y={14}>
              <GlassCard className="relative h-full overflow-hidden px-6 py-9 text-center sm:py-12">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl"
                />
                <div className="relative text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                  <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                    <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                  </span>
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
