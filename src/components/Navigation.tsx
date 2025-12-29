import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      setScrollProgress(progress);
      setHasScrolled(scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showIndicator = hasScrolled && scrollProgress > 0.01;

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 8px 2px rgba(251, 191, 36, 0.8),
                        0 0 16px 4px rgba(245, 158, 11, 0.5),
                        0 0 32px 8px rgba(234, 88, 12, 0.3);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 12px 4px rgba(251, 191, 36, 1),
                        0 0 24px 8px rgba(245, 158, 11, 0.7),
                        0 0 48px 12px rgba(234, 88, 12, 0.4);
            transform: scale(1.1);
          }
        }
        @keyframes energy-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-5 md:px-6 md:pt-6">
        <div className="relative mx-auto max-w-6xl">
          <div
            className="absolute inset-0 rounded-[40px] overflow-hidden"
            style={{
              background: hasScrolled ? 'rgba(0, 0, 0, 0.25)' : 'transparent',
              backdropFilter: hasScrolled ? 'blur(24px)' : 'none',
              WebkitBackdropFilter: hasScrolled ? 'blur(24px)' : 'none',
              border: hasScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
              boxShadow: hasScrolled
                ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset'
                : 'none',
              transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <div
              className="absolute inset-x-0 bottom-0 h-[60px] pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 60% 100% at ${scrollProgress * 100}% 100%, rgba(245, 158, 11, 0.15) 0%, transparent 70%)`,
                opacity: showIndicator ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            />

            <div
              className="absolute bottom-0 left-0 h-[2px] overflow-hidden"
              style={{
                width: `${scrollProgress * 100}%`,
                opacity: showIndicator ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, rgba(234, 88, 12, 0.3) 0%, rgba(245, 158, 11, 0.6) 50%, rgba(251, 191, 36, 0.9) 100%)',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  animation: 'shimmer 2s infinite linear',
                }}
              />
            </div>

            <div
              className="absolute bottom-[-3px] w-[8px] h-[8px] rounded-full pointer-events-none"
              style={{
                left: `calc(${scrollProgress * 100}% - 4px)`,
                background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(251, 191, 36, 1) 40%, rgba(245, 158, 11, 0.8) 70%, transparent 100%)',
                animation: showIndicator ? 'pulse-glow 1.5s ease-in-out infinite' : 'none',
                opacity: showIndicator ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />

            <div
              className="absolute bottom-[-2px] h-[6px] pointer-events-none"
              style={{
                left: `calc(${scrollProgress * 100}% - 40px)`,
                width: '40px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.6) 100%)',
                filter: 'blur(2px)',
                opacity: showIndicator ? 0.8 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between pl-5 pr-2 py-1.5 md:pl-7 md:pr-3 md:py-2">
              <a href="#" className="flex items-center gap-2.5 group pl-1.5">
                <img
                  src="/icon-app-1024.png"
                  alt="FaithWall"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
                <span className="text-lg md:text-xl font-black text-white tracking-tight">
                  FaithWall
                </span>
              </a>

              <div className="flex items-center gap-6 ml-auto">
                <div className="hidden lg:flex items-center gap-2">
                  <a
                    href="#blog"
                    className="text-lg font-semibold text-white hover:text-white/70 transition-colors duration-300 px-4 py-3"
                  >
                    Blog
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-lg font-semibold text-white hover:text-white/70 transition-colors duration-300 px-4 py-3"
                  >
                    How it works
                  </a>
                  <a
                    href="#support"
                    className="text-lg font-semibold text-white hover:text-white/70 transition-colors duration-300 px-4 py-3"
                  >
                    Support
                  </a>
                </div>

                <a
                  href="https://apps.apple.com/app/faithwall"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:inline-flex items-center justify-center px-7 py-3 bg-white text-surface text-xl font-semibold rounded-full hover:bg-white/90 transition-all duration-300"
                >
                  Try for free
                </a>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-white hover:text-white/70 transition-colors duration-300"
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
