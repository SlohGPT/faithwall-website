import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import AppStoreButton from './AppStoreButton';
import { appStoreUrl } from '../lib/appStore';
import { COMPARE_LINKS, GUIDE_LINKS, POPULAR_POSTS, TOOL_LINKS, type SiteLink } from '../lib/siteLinks';

const footerLinks = {
  about: [
    { name: 'Features', href: '/#features' },
    { name: 'Download', href: appStoreUrl('web-site') },
    { name: 'FAQ', href: '/#faq' },
  ],
  company: [
    { name: 'About Karol', href: '/about/karol-billik' },
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

const FOOTER_LINK = 'inline-block py-1 text-white/65 hover:text-white transition-colors text-sm';
const FOOTER_TITLE = 'font-semibold text-white mb-3';

function FooterColumn({ title, links }: { title: string; links: SiteLink[] }) {
  return (
    <nav aria-label={`Footer: ${title}`}>
      <p className={FOOTER_TITLE}>{title}</p>
      <ul className="space-y-1.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link to={link.href} className={FOOTER_LINK}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Mount/unmount with a CSS transition (replaces framer-motion's AnimatePresence): `mounted` keeps the modal in the
// tree while it fades out, `entered` drives the transition classes.
function useModalTransition(open: boolean, exitMs = 200) {
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
      return () => cancelAnimationFrame(raf);
    }
    setEntered(false);
    const t = setTimeout(() => setMounted(false), exitMs);
    return () => clearTimeout(t);
  }, [open, exitMs]);
  return { mounted, entered };
}

export default function Footer() {
  const [showModal, setShowModal] = useState(false);
  // Apple allows one App Store badge per layout. On the home page FinalCTA already
  // shows it, so the footer falls back to a text link there.
  const { pathname } = useLocation();
  const isHome = (pathname.replace(/\/+$/, '') || '/') === '/';
  const { mounted: modalMounted, entered: modalEntered } = useModalTransition(showModal);

  return (
    <footer data-site-footer className="bg-surface border-t border-surface-border relative">
      <div className="container-main py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-[1.1fr_1fr_1fr_1fr_1.35fr] lg:gap-x-10 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/icon-app-80.webp"
                alt=""
                width={80}
                height={80}
                className="w-10 h-10 rounded-xl bg-surface-card"
                loading="lazy"
                decoding="async"
              />
              <span className="text-xl font-semibold text-white tracking-tight">
                FaithWall
              </span>
            </div>
            <p className="text-white/65 text-sm leading-relaxed max-w-xs">
              Daily scripture and inspiration on your lock screen.
            </p>

            <div className="mt-6">
              {isHome ? (
                <a
                  href={appStoreUrl('web-site')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors text-sm underline underline-offset-4"
                >
                  Download FaithWall on the App Store
                </a>
              ) : (
                <AppStoreButton href={appStoreUrl('web-site')} />
              )}
            </div>
          </div>

          <div className="space-y-8">
            <nav aria-label="Footer: About">
              <p className={FOOTER_TITLE}>About</p>
              <ul className="space-y-1.5">
                {footerLinks.about.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} className={FOOTER_LINK}>
                        {link.name}
                      </Link>
                    ) : (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className={FOOTER_LINK}>
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div role="group" aria-label="Footer: Socials">
              <p className={FOOTER_TITLE}>Socials</p>
              <ul className="space-y-1.5">
                {footerLinks.socials.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => setShowModal(true)}
                      className={`${FOOTER_LINK} text-left`}
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <FooterColumn title="Guides" links={GUIDE_LINKS} />
            <FooterColumn title="Tools" links={TOOL_LINKS} />
          </div>

          <div className="space-y-8">
            <FooterColumn title="Compare" links={COMPARE_LINKS} />
            <nav aria-label="Footer: Company">
              <p className={FOOTER_TITLE}>Company</p>
              <ul className="space-y-1.5">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} className={FOOTER_LINK}>
                        {link.name}
                      </Link>
                    ) : (
                      <a href={link.href} className={FOOTER_LINK}>
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <FooterColumn title="Popular posts" links={POPULAR_POSTS} />
            <p className="mt-1.5">
              <Link to="/blog" className={`${FOOTER_LINK} font-semibold`}>
                All posts
              </Link>
            </p>
          </div>
        </div>

        <div className="w-full overflow-hidden flex items-center justify-center">
          <div className="text-[14vw] sm:text-[12vw] lg:text-[10vw] font-black text-white leading-none tracking-[-0.08em] select-none whitespace-nowrap text-center" style={{ letterSpacing: '-0.04em' }}>
            FAITHWALL
          </div>
        </div>

        <p className="mt-8 text-center md:text-left text-white/65 text-xs leading-relaxed">
          Apple, the Apple logo, iPhone and App Store are trademarks of Apple Inc., registered in the U.S. and other countries and regions.
        </p>

        <div className="pt-6 border-t border-surface-border mt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <p className="text-white/65 text-sm text-center md:text-left">
            &copy; 2026 FaithWall. Made with love for the Lord.
          </p>
          <div className="flex items-center justify-center md:justify-end gap-1.5">
            <span className="text-white/65 text-[15px] tracking-wide">Built by</span>
            <a
              href="https://www.karchi.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/65 hover:text-white transition-colors duration-300 text-[20px] font-black tracking-tight leading-none"
              aria-label="karchi. digital agency"
            >
              karchi.
            </a>
          </div>
        </div>
      </div>

      {modalMounted && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div
              onClick={() => setShowModal(false)}
              className={`absolute inset-0 bg-black/70 md:bg-black/60 md:backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none ${modalEntered ? 'opacity-100' : 'opacity-0'}`}
            />

            <div
              className={`relative w-full max-w-sm bg-surface-card border border-white/10 p-8 rounded-3xl shadow-2xl text-center transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${modalEntered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-5'}`}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 text-white/65 hover:text-white transition-colors"
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
            </div>
          </div>
      )}
    </footer>
  );
}
