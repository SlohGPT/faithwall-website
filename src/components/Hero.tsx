import { Apple, Play, Star, Shield, Heart } from 'lucide-react';
import IPhoneMockup from './IPhoneMockup';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-10 w-32 h-32 text-orange">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 10v80M10 50h80" strokeWidth="8" />
          </svg>
        </div>
        <div className="absolute bottom-40 right-20 w-24 h-24 text-orange">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 10v80M10 50h80" strokeWidth="8" />
          </svg>
        </div>
      </div>

      <div className="container-custom section-padding pt-28 md:pt-32 lg:pt-40">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-8 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange/10 text-orange text-sm font-medium mb-6">
              <span className="text-lg">&#128591;</span>
              Your Daily Faith Companion
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6">
              Transform Your Lock Screen Into a{' '}
              <span className="text-gradient-orange">Daily Moment with God</span>
            </h1>

            <p className="text-lg sm:text-xl text-text-secondary leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Beautiful scripture, prayers, and inspiration appear every time you pick up your phone.
              Join 10,000+ believers starting their day with purpose.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <a
                href="https://apps.apple.com/app/faithwall"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-base"
              >
                <Apple className="w-5 h-5" />
                Download Free on App Store
              </a>
              <a href="#how-it-works" className="btn-secondary text-base">
                <Play className="w-5 h-5" />
                Watch How It Works
              </a>
            </div>

            <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-orange">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">4.9</span>
                </div>
                <span>Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange" />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-orange fill-current" />
                <span>Made for Christians</span>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-8 bg-orange/20 rounded-full blur-3xl" />
              <IPhoneMockup />

              <div className="absolute -left-16 top-20 hidden lg:block animate-float">
                <div className="glass rounded-2xl px-4 py-3 shadow-xl max-w-[180px]">
                  <p className="text-xs text-text-secondary font-display italic">
                    "The Lord is my shepherd; I shall not want."
                  </p>
                  <p className="text-[10px] text-orange mt-1">Psalm 23:1</p>
                </div>
              </div>

              <div className="absolute -right-12 bottom-32 hidden lg:block animate-float-delayed">
                <div className="glass rounded-2xl px-4 py-3 shadow-xl max-w-[160px]">
                  <p className="text-xs text-text-secondary font-display italic">
                    "Be still and know that I am God."
                  </p>
                  <p className="text-[10px] text-orange mt-1">Psalm 46:10</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
