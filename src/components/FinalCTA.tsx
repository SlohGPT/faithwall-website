const avatars = [
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
];

export default function FinalCTA() {
  return (
    <section className="section-space bg-surface">
      <div className="container-main">
        <div className="relative rounded-[2rem] overflow-hidden border-2 border-brand/30">
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/1064162/pexels-photo-1064162.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface/95 via-surface/80 to-surface/60" />
          </div>

          <div className="relative px-8 py-20 sm:px-12 sm:py-28 lg:px-20">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                Start every day
                <br />
                <span className="text-white/40">with purpose</span>
              </h2>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                Transform your phone into a tool for spiritual growth. Join thousands of believers who begin each day with inspiration.
              </p>

              <a
                href="https://apps.apple.com/app/faithwall"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-surface font-semibold px-6 py-4 rounded-2xl hover:bg-white/90 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none opacity-60 uppercase tracking-wider">Download on the</div>
                  <div className="text-base font-semibold leading-tight">App Store</div>
                </div>
              </a>

              <div className="flex items-center gap-4 mt-8">
                <div className="flex -space-x-2">
                  {avatars.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-9 h-9 rounded-full border-2 border-surface object-cover"
                    />
                  ))}
                </div>
                <p className="text-white/60 text-sm">
                  Join <span className="text-white font-semibold">10,000+</span> believers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
