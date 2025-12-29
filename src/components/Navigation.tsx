import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const showIndicator = hasScrolled && scrollProgress > 0.01;
  const borderRadius = 40;
  const { width, height } = containerSize;

  const getPerimeter = () => {
    if (width === 0 || height === 0) return 0;
    const straightWidth = width - 2 * borderRadius;
    const straightHeight = height - 2 * borderRadius;
    const cornerCircumference = 2 * Math.PI * borderRadius;
    return 2 * straightWidth + 2 * straightHeight + cornerCircumference;
  };

  const perimeter = getPerimeter();

  const getPointOnBorder = (progress: number) => {
    if (width === 0 || height === 0) return { x: 0, y: 0 };

    const totalPerimeter = perimeter;
    const distance = progress * totalPerimeter;

    const bottomWidth = width - 2 * borderRadius;
    const cornerLength = (Math.PI * borderRadius) / 2;
    const rightHeight = height - 2 * borderRadius;
    const topWidth = width - 2 * borderRadius;
    const leftHeight = height - 2 * borderRadius;

    let accumulated = 0;

    if (distance <= bottomWidth / 2) {
      return { x: width / 2 + distance, y: height };
    }
    accumulated += bottomWidth / 2;

    if (distance <= accumulated + cornerLength) {
      const angle = ((distance - accumulated) / cornerLength) * (Math.PI / 2);
      return {
        x: width - borderRadius + Math.sin(angle) * borderRadius,
        y: height - borderRadius + Math.cos(angle) * borderRadius
      };
    }
    accumulated += cornerLength;

    if (distance <= accumulated + rightHeight) {
      return { x: width, y: height - borderRadius - (distance - accumulated) };
    }
    accumulated += rightHeight;

    if (distance <= accumulated + cornerLength) {
      const angle = ((distance - accumulated) / cornerLength) * (Math.PI / 2);
      return {
        x: width - borderRadius + Math.cos(angle) * borderRadius,
        y: borderRadius - Math.sin(angle) * borderRadius
      };
    }
    accumulated += cornerLength;

    if (distance <= accumulated + topWidth) {
      return { x: width - borderRadius - (distance - accumulated), y: 0 };
    }
    accumulated += topWidth;

    if (distance <= accumulated + cornerLength) {
      const angle = ((distance - accumulated) / cornerLength) * (Math.PI / 2);
      return {
        x: borderRadius - Math.sin(angle) * borderRadius,
        y: borderRadius - Math.cos(angle) * borderRadius
      };
    }
    accumulated += cornerLength;

    if (distance <= accumulated + leftHeight) {
      return { x: 0, y: borderRadius + (distance - accumulated) };
    }
    accumulated += leftHeight;

    if (distance <= accumulated + cornerLength) {
      const angle = ((distance - accumulated) / cornerLength) * (Math.PI / 2);
      return {
        x: borderRadius - Math.cos(angle) * borderRadius,
        y: height - borderRadius + Math.sin(angle) * borderRadius
      };
    }
    accumulated += cornerLength;

    return { x: borderRadius + (distance - accumulated), y: height };
  };

  const orbPosition = getPointOnBorder(scrollProgress);

  const createBorderPath = () => {
    if (width === 0 || height === 0) return '';
    const r = borderRadius;
    return `
      M ${width / 2} ${height}
      L ${width - r} ${height}
      A ${r} ${r} 0 0 0 ${width} ${height - r}
      L ${width} ${r}
      A ${r} ${r} 0 0 0 ${width - r} 0
      L ${r} 0
      A ${r} ${r} 0 0 0 0 ${r}
      L 0 ${height - r}
      A ${r} ${r} 0 0 0 ${r} ${height}
      L ${width / 2} ${height}
    `;
  };

  return (
    <>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.9))
                   drop-shadow(0 0 12px rgba(245, 158, 11, 0.6))
                   drop-shadow(0 0 20px rgba(234, 88, 12, 0.4));
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            filter: drop-shadow(0 0 10px rgba(251, 191, 36, 1))
                   drop-shadow(0 0 20px rgba(245, 158, 11, 0.8))
                   drop-shadow(0 0 35px rgba(234, 88, 12, 0.5));
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
        @keyframes shimmer {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-5 md:px-6 md:pt-6">
        <div className="relative mx-auto max-w-6xl">
          <div
            ref={containerRef}
            className="absolute inset-0 rounded-[40px] overflow-visible"
            style={{
              background: hasScrolled ? 'rgba(0, 0, 0, 0.25)' : 'transparent',
              backdropFilter: hasScrolled ? 'blur(24px)' : 'none',
              WebkitBackdropFilter: hasScrolled ? 'blur(24px)' : 'none',
              boxShadow: hasScrolled
                ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset'
                : 'none',
              transition: 'background 0.6s cubic-bezier(0.22, 1, 0.36, 1), backdrop-filter 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {width > 0 && height > 0 && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  overflow: 'visible',
                  opacity: showIndicator ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                }}
              >
                <defs>
                  <linearGradient id="borderGradient" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="rgba(234, 88, 12, 0.1)" />
                    <stop offset="50%" stopColor="rgba(245, 158, 11, 0.6)" />
                    <stop offset="100%" stopColor="rgba(251, 191, 36, 1)" />
                  </linearGradient>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                <path
                  d={createBorderPath()}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                />

                <path
                  d={createBorderPath()}
                  fill="none"
                  stroke="url(#borderGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  filter="url(#glow)"
                  style={{
                    strokeDasharray: perimeter,
                    strokeDashoffset: perimeter - (scrollProgress * perimeter),
                    transition: 'stroke-dashoffset 0.1s ease-out',
                  }}
                />
              </svg>
            )}

            <div
              className="absolute w-3 h-3 rounded-full pointer-events-none"
              style={{
                left: orbPosition.x,
                top: orbPosition.y,
                background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(251, 191, 36, 1) 30%, rgba(245, 158, 11, 0.8) 60%, transparent 100%)',
                animation: showIndicator ? 'pulse-glow 1.5s ease-in-out infinite' : 'none',
                opacity: showIndicator ? 1 : 0,
                transition: 'opacity 0.3s ease',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}
            />

            <div
              className="absolute w-8 h-8 rounded-full pointer-events-none"
              style={{
                left: orbPosition.x,
                top: orbPosition.y,
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
                opacity: showIndicator ? 1 : 0,
                transition: 'opacity 0.3s ease',
                transform: 'translate(-50%, -50%)',
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
