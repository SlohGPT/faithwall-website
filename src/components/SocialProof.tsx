const stats = [
  { value: '97%', label: 'Report feeling more centered' },
  { value: '10,000+', label: 'Active daily users' },
  { value: '4.9', label: 'App Store rating' },
];

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
                <div key={stat.label} className="text-center">
                  <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-3">
                    {stat.value}
                  </p>
                  <p className="text-white/60 text-sm sm:text-base">
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
