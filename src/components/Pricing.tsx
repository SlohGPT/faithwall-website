import { Check, Crown, Lock, Heart } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Everything you need to get started',
    features: [
      'Up to 5 personal notes',
      '3 beautiful wallpaper presets',
      'Lock screen inspiration',
      'Basic widget',
      'No ads, ever',
    ],
    cta: 'Download Free',
    featured: false,
  },
  {
    name: 'FaithWall Pro',
    price: '$2.99',
    period: '/month',
    yearlyPrice: '$19.99/year',
    yearlySaving: 'Save 44%',
    description: 'For the devoted believer',
    features: [
      'Unlimited notes & prayers',
      'All premium wallpapers',
      'Custom photo backgrounds',
      'Advanced widgets',
      'Priority support',
      'Support app development',
    ],
    cta: 'Start Free Trial',
    trialNote: '7 days free',
    featured: true,
  },
];

export default function Pricing() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section id="pricing" className="section-padding bg-gradient-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_#D97B3B_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_#D97B3B_0%,_transparent_50%)]" />
      </div>

      <div className="container-custom relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple,{' '}
            <span className="text-orange">Fair Pricing</span>
          </h2>
          <p className="text-lg text-white/70">
            Start free. Upgrade when you're ready.
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-6 lg:p-8 ${
                plan.featured
                  ? 'bg-white border-4 border-orange shadow-2xl shadow-orange/20'
                  : 'bg-white/10 backdrop-blur-sm border border-white/20'
              } ${inView ? 'animate-in' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-orange text-white text-sm font-medium shadow-lg">
                  <Crown className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${plan.featured ? 'text-text-primary' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.featured ? 'text-text-primary' : 'text-white'}`}>
                    {plan.price}
                  </span>
                  <span className={plan.featured ? 'text-text-secondary' : 'text-white/70'}>
                    {plan.period}
                  </span>
                </div>
                {plan.yearlyPrice && (
                  <p className="text-sm text-orange mt-1">
                    or {plan.yearlyPrice} <span className="font-medium">({plan.yearlySaving})</span>
                  </p>
                )}
                <p className={`text-sm mt-2 ${plan.featured ? 'text-text-secondary' : 'text-white/70'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.featured ? 'bg-orange/20' : 'bg-white/20'}`}>
                      <Check className={`w-3 h-3 ${plan.featured ? 'text-orange' : 'text-white'}`} />
                    </div>
                    <span className={plan.featured ? 'text-text-primary' : 'text-white'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="https://apps.apple.com/app/faithwall"
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full text-center py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                  plan.featured
                    ? 'bg-gradient-orange text-white shadow-lg shadow-orange/25 hover:shadow-xl hover:scale-[1.02]'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {plan.cta}
                {plan.trialNote && (
                  <span className="block text-xs font-normal mt-0.5 opacity-80">
                    {plan.trialNote}
                  </span>
                )}
              </a>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 text-white/70 text-sm">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-orange" />
            Cancel anytime. No questions asked.
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-orange" />
            Your support keeps FaithWall ad-free
          </div>
        </div>
      </div>
    </section>
  );
}
