import { useRef, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';

const stats = [
  { value: 92, label: 'Early users feel closer to God', suffix: '%' },
  { value: 500, label: 'Believers using FaithWall', suffix: '+' },
  { value: 4.7, label: 'App Store rating', decimals: 1 },
];

function Counter({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const node = ref.current;
    node.textContent = (0).toFixed(decimals) + suffix;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        if (decimals === 0 && latest >= 1000) {
          node.textContent = Math.floor(latest).toLocaleString('en-US') + suffix;
        } else {
          node.textContent = latest.toFixed(decimals) + suffix;
        }
      },
    });
    return () => controls.stop();
  }, [isInView, value, decimals, suffix]);

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
                    viewport={{ once: true, margin: "-50px" }}
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
