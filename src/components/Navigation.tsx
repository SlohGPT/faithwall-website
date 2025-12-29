import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 400;
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isVisible = scrollProgress > 0.05;
  const glowIntensity = Math.min(scrollProgress * 1.5, 1);
  const sweepPosition = scrollProgress * 100;

  return (
    <>
      <style>{`
        .nav-container {
          --sweep-pos: ${sweepPosition}%;
          --glow-intensity: ${glowIntensity};
        }

        .nav-glow-border {
          position: relative;
          overflow: hidden;
        }

        .nav-glow-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 40px;
          padding: 1.5px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(251, 191, 36, calc(0.3 * var(--glow-intensity))) calc(var(--sweep-pos) - 20%),
            rgba(245, 158, 11, calc(0.9 * var(--glow-intensity))) calc(var(--sweep-pos) - 5%),
            rgba(234, 88, 12, var(--glow-intensity)) var(--sweep-pos),
            rgba(245, 158, 11, calc(0.9 * var(--glow-intensity))) calc(var(--sweep-pos) + 5%),
            rgba(251, 191, 36, calc(0.3 * var(--glow-intensity))) calc(var(--sweep-pos) + 20%),
            transparent 100%
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }

        .nav-glow-border::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 40px;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: -1;
        }

        .nav-ambient-glow {
          position: absolute;
          inset: -2px;
          border-radius: 42px;
          background: radial-gradient(
            ellipse 60% 40% at calc(100% - var(--sweep-pos)) 50%,
            rgba(245, 158, 11, calc(0.4 * var(--glow-intensity))),
            transparent 70%
          );
          filter: blur(12px);
          pointer-events: none;
        }

        .nav-fill-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: calc(var(--sweep-pos) * 1%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(251, 191, 36, calc(0.5 * var(--glow-intensity))),
            rgba(245, 158, 11, calc(0.8 * var(--glow-intensity))),
            rgba(234, 88, 12, var(--glow-intensity))
          );
          border-radius: 0 40px 40px 0;
          opacity: var(--glow-intensity);
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-5 md:px-6 md:pt-6">
        <div className="relative mx-auto max-w-6xl nav-container">
          <div
            className={`absolute inset-0 rounded-[40px] transition-opacity duration-300 ease-out nav-glow-border ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="nav-ambient-glow" />
            <div className="nav-fill-bar" />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between pl-5 pr-2 py-1.5 md:pl-7 md:pr-3 md:py-2">
              <a href="#" className="flex items-center gap-2.5 group pl-1.5">
                <img
                  src="/icon-app-1024.png"
                  alt="FaithWall"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl group-hover:scale-105 transition-transform"
                />
                <span className="text-lg md:text-xl font-black text-white tracking-tight">
                  FaithWall
                </span>
              </a>

              <div className="flex items-center gap-6 ml-auto">
                <div className="hidden lg:flex items-center gap-2">
                  <a
                    href="#blog"
                    className="text-lg font-semibold text-white hover:text-white/70 transition-colors px-4 py-3"
                  >
                    Blog
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-lg font-semibold text-white hover:text-white/70 transition-colors px-4 py-3"
                  >
                    How it works
                  </a>
                  <a
                    href="#support"
                    className="text-lg font-semibold text-white hover:text-white/70 transition-colors px-4 py-3"
                  >
                    Support
                  </a>
                </div>

                <a
                  href="https://apps.apple.com/app/faithwall"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:inline-flex items-center justify-center px-7 py-3 bg-white text-surface text-xl font-semibold rounded-full hover:bg-white/90 transition-colors"
                >
                  Try for free
                </a>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-white hover:text-white transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-20 left-4 right-4 bg-surface-elevated/95 backdrop-blur-2xl rounded-[28px] transition-all duration-300 ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col p-3 gap-2">
            <a
              href="#blog"
              className="px-6 py-5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all text-xl font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </a>
            <a
              href="#how-it-works"
              className="px-6 py-5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all text-xl font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How it works
            </a>
            <a
              href="#support"
              className="px-6 py-5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all text-xl font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Support
            </a>
            <div className="pt-2 mt-2 border-t border-surface-border">
              <a
                href="https://apps.apple.com/app/faithwall"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full px-8 py-3.5 bg-white text-surface text-xl font-semibold rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Try for free
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
