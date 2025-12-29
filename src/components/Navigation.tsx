import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { name: 'Blog', href: '#blog' },
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Support', href: '#support' },
];

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
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 md:px-6 md:pt-5">
        <div
          className={`mx-auto max-w-5xl rounded-2xl border transition-all duration-300 ${
            isScrolled
              ? 'bg-surface-elevated/90 backdrop-blur-xl border-surface-border shadow-2xl'
              : 'bg-surface-card/60 backdrop-blur-xl border-surface-border'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            <a href="#" className="flex items-center gap-2.5 group">
              <img
                src="/icon-app-1024.png"
                alt="FaithWall"
                className="w-9 h-9 md:w-10 md:h-10 rounded-xl group-hover:scale-105 transition-transform"
              />
              <span className="text-lg md:text-xl font-black text-white tracking-tight">
                FaithWall
              </span>
            </a>

            <div className="flex items-center gap-0 lg:gap-2 ml-auto lg:ml-0">
              <div className="hidden lg:flex items-center gap-0">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="px-3 py-2 text-sm font-bold text-white hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-3">
              <a
                href="https://apps.apple.com/app/faithwall"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-white text-surface font-semibold text-sm rounded-xl hover:bg-white/90 transition-colors"
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
          className={`absolute top-20 left-4 right-4 bg-surface-elevated border border-surface-border rounded-2xl shadow-2xl transition-all duration-300 ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col p-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-bold text-white/80 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="mt-2 pt-2 border-t border-surface-border">
              <a
                href="https://apps.apple.com/app/faithwall"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full px-5 py-3 bg-white text-surface font-semibold rounded-xl transition-colors"
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
