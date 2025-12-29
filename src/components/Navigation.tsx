import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'FAQ', href: '#faq' },
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
          className={`mx-auto max-w-6xl rounded-2xl border border-white/10 bg-dark/80 backdrop-blur-xl transition-all duration-300 ${
            isScrolled ? 'shadow-2xl shadow-black/20' : 'shadow-lg shadow-black/10'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <img
                src="/icon-app-1024.png"
                alt="FaithWall"
                className="w-9 h-9 md:w-10 md:h-10 rounded-xl shadow-lg shadow-orange/20 group-hover:scale-105 transition-transform"
              />
              <span className="text-lg md:text-xl font-semibold text-white">
                Faith<span className="text-orange">Wall</span>
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
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
                className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-orange hover:bg-orange-dark text-white text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02]"
              >
                Try for free
              </a>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-20 left-4 right-4 bg-dark/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl transition-all duration-300 ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col p-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base text-white/80 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="mt-3 pt-3 border-t border-white/10">
              <a
                href="https://apps.apple.com/app/faithwall"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full px-5 py-3 bg-orange hover:bg-orange-dark text-white font-medium rounded-xl transition-all duration-200"
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
