const steps = [
  {
    number: '01',
    title: 'Download',
    description: 'Get FaithWall free from the App Store. No sign-up or account needed.',
  },
  {
    number: '02',
    title: 'Personalize',
    description: 'Add your favorite verses, prayers, or daily affirmations.',
  },
  {
    number: '03',
    title: 'Transform',
    description: 'Your lock screen becomes a daily source of faith and peace.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-space bg-surface-elevated">
      <div className="container-main">
        <div className="text-center mb-16">
          <p className="text-brand font-medium mb-3 tracking-wide uppercase text-sm">How It Works</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Set up in under
            <br />
            <span className="text-white/40">2 minutes</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-card border border-surface-border mb-6">
                <span className="text-2xl font-bold text-brand">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-white/60 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
