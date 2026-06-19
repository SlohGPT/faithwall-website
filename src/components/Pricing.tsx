import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Monthly',
    cadence: 'Billed monthly',
    features: [
      'Unlimited wallpaper exports',
      'All premium features',
      'Cancel anytime',
    ],
    cta: 'See price in App Store',
    featured: false,
  },
  {
    name: 'Yearly',
    cadence: 'Billed yearly',
    badge: 'Best Value',
    features: [
      'Unlimited wallpaper exports',
      'All future updates included',
    ],
    cta: 'See price in App Store',
    featured: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-space bg-surface-elevated">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-brand font-medium mb-3 tracking-wide uppercase text-sm">Pricing</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Simple pricing.
            <br />
            <span className="text-white/40">Serious results.</span>
          </h2>
          <p className="text-white/60 text-lg mt-4 max-w-2xl mx-auto">
            Choose the plan that fits your spiritual journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative rounded-3xl p-8 transition-colors duration-300 ${plan.featured
                  ? 'bg-surface-card border-2 border-brand shadow-xl shadow-brand/10'
                  : 'bg-surface-card border border-white/5 hover:border-white/10'
                }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block px-4 py-1.5 bg-brand text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-black text-white">Shown in App Store</span>
                </div>
                <p className="text-white/60 text-sm font-medium mt-2">{plan.cadence} · your local currency</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center mt-0.5">
                      <Check size={14} className="text-brand" />
                    </div>
                    <span className="text-white/80 text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://apps.apple.com/us/app/lock-screen-bible-verse/id6756815070"
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-4 text-center font-bold rounded-xl transition-all duration-200 ${plan.featured
                    ? 'bg-brand text-white hover:bg-brand-light hover:scale-105'
                    : 'bg-surface-elevated text-white border border-white/10 hover:bg-surface hover:border-white/20'
                  }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-white/50 text-sm mt-10 max-w-2xl mx-auto leading-relaxed">
          FaithWall is free to download. Your exact price, billing period, and any free-trial offer are shown in the App Store at checkout, in your local currency — and may vary between users and change over time as we test and improve our pricing.
        </p>
      </div>
    </section>
  );
}
