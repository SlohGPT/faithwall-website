import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import AppStoreButton from './AppStoreButton';

const footerLinks = {
  about: [
    { name: 'Features', href: '/#features' },
    { name: 'Download', href: 'https://apple.co/3NBwVwp' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'FAQ', href: '/#faq' },
  ],
  company: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Use', href: '/terms-of-use' },
    { name: 'EULA', href: '/eula' },
    { name: 'Contact', href: 'mailto:hello@faithwall.app' },
  ],
  socials: [
    { name: 'Instagram', href: '#' },
    { name: 'TikTok', href: '#' },
    { name: 'X', href: '#' },
  ],
};

export default function Footer() {
  const [showModal, setShowModal] = useState(false);

  return (
    <footer className="bg-surface border-t border-surface-border relative">
      <div className="container-main py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/icon-app-180.png"
                alt="FaithWall"
                className="w-10 h-10 rounded-xl"
                loading="lazy"
              />
              <span className="text-xl font-semibold text-white tracking-tight">
                FaithWall
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Daily scripture and inspiration on your lock screen.
            </p>

            <div className="mt-6">
              <AppStoreButton href="https://apple.co/3NBwVwp" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/50 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/') ? (
                    <Link
                      to={link.href}
                      className="text-white/50 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-white/50 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Socials</h4>
            <ul className="space-y-3">
              {footerLinks.socials.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-white/50 hover:text-white transition-colors text-sm text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full overflow-hidden flex items-center justify-center">
          <div className="text-[14vw] sm:text-[12vw] lg:text-[10vw] font-black text-white leading-none tracking-[-0.08em] select-none whitespace-nowrap text-center" style={{ letterSpacing: '-0.04em' }}>
            FAITHWALL
          </div>
        </div>

        <div className="pt-8 border-t border-surface-border mt-8">
          <p className="text-center text-white/40 text-sm">
            &copy; 2026 FaithWall. Made with love for the Lord.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-surface-card border border-white/10 p-8 rounded-3xl shadow-2xl text-center"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🌱</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                Growing Together
              </h3>
              <p className="text-white/70 leading-relaxed mb-6">
                We're a new app and haven't launched our social channels just yet. Check back soon!
              </p>

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-brand hover:bg-brand-light text-white font-bold rounded-xl transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
