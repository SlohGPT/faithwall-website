import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-5 md:px-6 md:pt-6">
        <div
          className={`mx-auto max-w-6xl rounded-[40px] transition-all duration-500 ${
            isScrolled
              ? 'bg-black/50 backdrop-blur-xl border border-white/10'
              : 'bg-transparent'
          }`}
        >
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
