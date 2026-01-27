import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const strokeWidth = 2;
  const { width, height } = containerSize;

  const inset = strokeWidth / 2;
  const innerWidth = width - strokeWidth;
  const innerHeight = height - strokeWidth;
  const r = borderRadius - inset;

  const getPerimeter = () => {
    if (innerWidth <= 0 || innerHeight <= 0) return 0;
    const straightWidth = innerWidth - 2 * r;
    const straightHeight = innerHeight - 2 * r;
    const cornerCircumference = 2 * Math.PI * r;
    return 2 * straightWidth + 2 * straightHeight + cornerCircumference;
  };

  const perimeter = getPerimeter();


  return (
    <>
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
                className="absolute pointer-events-none"
                style={{
                  top: 0,
                  left: 0,
                  width: width,
                  height: height,
                  overflow: 'visible',
                  opacity: showIndicator ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                }}
                viewBox={`0 0 ${width} ${height}`}
              >
                <defs>
                  <linearGradient id="borderGradient" gradientUnits="userSpaceOnUse" x1="0" y1={height} x2={width} y2="0">
                    <stop offset="0%" stopColor="rgba(234, 88, 12, 0.15)" />
                    <stop offset="30%" stopColor="rgba(245, 158, 11, 0.6)" />
                    <stop offset="70%" stopColor="rgba(251, 191, 36, 0.9)" />
                    <stop offset="100%" stopColor="rgba(251, 191, 36, 1)" />
                  </linearGradient>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <rect
                  x={inset}
                  y={inset}
                  width={innerWidth}
                  height={innerHeight}
                  rx={r}
                  ry={r}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth={strokeWidth}
                  shapeRendering="geometricPrecision"
                />

                <rect
                  x={inset}
                  y={inset}
                  width={innerWidth}
                  height={innerHeight}
                  rx={r}
                  ry={r}
                  fill="none"
                  stroke="url(#borderGradient)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  filter="url(#glow)"
                  shapeRendering="geometricPrecision"
                  style={{
                    strokeDasharray: perimeter,
                    strokeDashoffset: perimeter * (1 - scrollProgress),
                  }}
                />
              </svg>
            )}
          </div>

          <div className="relative">
            <div className="flex items-center justify-between pl-5 pr-2 py-1.5 md:pl-7 md:pr-3 md:py-2">
              <Link to="/" className="flex items-center gap-2.5 group pl-1.5">
                <img
                  src="/icon-app-1024.png"
                  alt="FaithWall"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="text-lg md:text-xl font-black text-white tracking-tight">
                  FaithWall
                </span>
              </Link>

              <div className="flex items-center gap-6 ml-auto">
                <div className="hidden lg:flex items-center gap-2">
                  <a
                    href="/#blog"
                    className="text-lg font-semibold text-white hover:text-white/70 transition-colors duration-300 px-4 py-3"
                  >
                    Blog
                  </a>
                  <a
                    href="/#how-it-works"
                    className="text-lg font-semibold text-white hover:text-white/70 transition-colors duration-300 px-4 py-3"
                  >
                    How it works
                  </a>
                  <a
                    href="/#support"
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
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-20 left-4 right-4 bg-surface-elevated/95 backdrop-blur-2xl rounded-[28px] transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
        >
          <div className="flex flex-col p-3 gap-2">
            <a
              href="/#blog"
              className="px-6 py-5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all text-xl font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </a>
            <a
              href="/#how-it-works"
              className="px-6 py-5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all text-xl font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How it works
            </a>
            <a
              href="/#support"
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
