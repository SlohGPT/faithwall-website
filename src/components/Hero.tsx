import IPhoneMockup from './IPhoneMockup';

const avatars = [
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
];

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-surface overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[100px]" />
      </div>

      <div className="container-main relative pt-32 md:pt-40 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-surface-card border border-surface-border mb-8">
              <div className="flex -space-x-2">
                {avatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-7 h-7 rounded-full border-2 border-surface-card object-cover"
                  />
                ))}
              </div>
              <span className="text-sm text-white/70">Trusted by 10,000+ believers</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Daily Scripture
              <br />
              <span className="text-white/40">On Your Lock Screen</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/60 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              Meet FaithWall, the app that transforms your iPhone lock screen into a daily moment with God.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="https://apps.apple.com/app/faithwall"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-surface-elevated font-semibold px-6 py-4 rounded-2xl hover:bg-white/90 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none opacity-60 uppercase tracking-wider">Download on the</div>
                  <div className="text-base font-semibold leading-tight">App Store</div>
                </div>
              </a>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-12 bg-gradient-to-br from-brand/20 via-brand/5 to-transparent rounded-full blur-3xl" />
              <IPhoneMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
