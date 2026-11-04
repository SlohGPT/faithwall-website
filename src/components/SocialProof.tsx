import { useRef, useEffect, useState } from 'react';
import { useInView, animate } from 'framer-motion';

// Every stat here must be verifiable: 1,000+ matches the hero's "Trusted by
// 1,000+ believers" (RevenueCat: 698 new customers in 28 days to 11-04 alone), 24 = translations in the verse
// picker, 4.7 = global App Store rating. No survey percentages without a source.
const stats = [
  { value: 1000, label: 'Believers have installed FaithWall', suffix: '+' },
  { value: 24, label: 'Bible translations to pick from' },
  { value: 4.7, label: 'App Store rating', decimals: 1 },
];

function formatCount(n: number, decimals: number, suffix: string) {
  if (decimals === 0 && n >= 1000) {
    return Math.floor(n).toLocaleString('en-US') + suffix;
  }
  return n.toFixed(decimals) + suffix;
}

function Counter({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
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
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        setDisplay(formatCount(latest, decimals, suffix));
      },
    });
    return () => controls.stop();
  }, [isInView, value, decimals, suffix]);

  return <span ref={ref}>{display}</span>;
}

export default function SocialProof() {
  return (
    <section className="py-20 bg-surface">
      <div className="container-main">
        <div className="relative rounded-[2rem] overflow-hidden border-2 border-brand/20">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-surface-card to-surface-elevated" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(217,123,59,0.15)_0%,_transparent_60%)]" />

          <div className="relative px-8 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24">
            <div className="grid sm:grid-cols-3 gap-12 sm:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-3">
                    <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                      <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                    </span>
                  </div>
                  <p className="text-white/60 text-sm sm:text-base font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
