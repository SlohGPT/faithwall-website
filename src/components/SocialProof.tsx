import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

const stats = [
  { value: 97, label: 'Report feeling closer to God', suffix: '%' },
  { value: 1000, label: 'Active daily users', suffix: '+' },
  { value: 4.7, label: 'App Store rating', decimals: 1 },
];

function Counter({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toFixed(decimals) + suffix;
        // Basic comma formatting for thousands if integers
        if (decimals === 0 && latest >= 1000) {
          const intPart = Math.floor(latest);
          ref.current.textContent = intPart.toLocaleString('en-US') + suffix;
        }
      }
    });
  }, [springValue, decimals, suffix]);

  return <span ref={ref} />;
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
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-3"
                  >
                    <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                      <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                    </span>
                  </motion.div>
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
