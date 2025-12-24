import { Apple } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export default function FinalCTA() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1064162/pexels-photo-1064162.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Sunrise over mountains"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/70 to-dark/50" />
      </div>

      <div className="container-custom relative section-padding">
        <div
          ref={ref}
          className={`max-w-2xl ${inView ? 'animate-in' : 'opacity-0'}`}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Start Every Day with{' '}
            <span className="text-gold">Purpose</span>
          </h2>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Transform your phone into a tool for spiritual growth. Join thousands of believers who begin each day with inspiration.
          </p>

          <a
            href="https://apps.apple.com/app/faithwall"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-dark font-semibold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300"
          >
            <Apple className="w-6 h-6" />
            <div className="text-left">
              <div className="text-xs opacity-70">Download on the</div>
              <div className="text-lg">App Store</div>
            </div>
          </a>

          <div className="flex items-center gap-4 mt-8">
            <div className="flex -space-x-3">
              {['SM', 'RK', 'DL', 'MT'].map((initials, i) => (
                <div
                  key={initials}
                  className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-lg"
                  style={{ zIndex: 4 - i }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-white/80 text-sm">
              Join <span className="text-gold font-semibold">10,000+</span> believers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
