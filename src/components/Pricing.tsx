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
    name: 'Pro',
    price: '$2.99',
    period: '/month',
    yearlyPrice: '$19.99/year',
    description: 'For the devoted believer',
    features: [
      'Unlimited notes & prayers',
      'All premium wallpapers',
      'Custom photo backgrounds',
      'Advanced widgets',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    trialNote: '7 days free',
    featured: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-space bg-surface-elevated">
      <div className="container-main">
        <div className="text-center mb-16">
          <p className="text-brand font-medium mb-3 tracking-wide uppercase text-sm">Pricing</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Simple, fair pricing
          </h2>
          <p className="text-white/60 mt-4 text-lg">Start free. Upgrade when you're ready.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-6 lg:p-8 border-2 ${
                plan.featured
                  ? 'bg-white border-brand/40'
                  : 'bg-gradient-to-br from-surface-card to-surface-elevated border-brand/20'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-brand text-white text-xs font-medium border-2 border-brand-light">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-2 ${plan.featured ? 'text-surface' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.featured ? 'text-surface' : 'text-white'}`}>
                    {plan.price}
                  </span>
                  <span className={plan.featured ? 'text-surface/60' : 'text-white/60'}>
                    {plan.period}
                  </span>
                </div>
                {plan.yearlyPrice && (
                  <p className="text-sm text-brand mt-1 font-medium">
                    or {plan.yearlyPrice}
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.featured ? 'text-brand' : 'text-brand'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={plan.featured ? 'text-surface/80' : 'text-white/80'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="https://apps.apple.com/app/faithwall"
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full text-center py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  plan.featured
                    ? 'bg-surface text-white hover:bg-surface-elevated'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {plan.cta}
                {plan.trialNote && (
                  <span className="block text-xs font-normal mt-0.5 opacity-70">
                    {plan.trialNote}
                  </span>
                )}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-white/50 text-sm mt-8">
          Cancel anytime. No questions asked.
        </p>
      </div>
    </section>
  );
}
