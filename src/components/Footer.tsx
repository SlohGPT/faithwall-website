const footerLinks = {
  about: [
    { name: 'Features', href: '#features' },
    { name: 'Download', href: 'https://apps.apple.com/app/faithwall' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ],
  company: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Contact', href: 'mailto:hello@faithwall.app' },
  ],
  socials: [
    { name: 'Instagram', href: '#' },
    { name: 'TikTok', href: '#' },
    { name: 'X', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-surface-border">
      <div className="container-main py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/icon-app-1024.png"
                alt="FaithWall"
                className="w-10 h-10 rounded-xl"
              />
              <span className="text-xl font-semibold text-white tracking-tight">
                FaithWall
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Daily scripture and inspiration on your lock screen.
            </p>

            <a
              href="https://apps.apple.com/app/faithwall"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 bg-white text-surface text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-white/90 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              App Store
            </a>
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
            <h4 className="font-semibold text-white mb-4">Socials</h4>
            <ul className="space-y-3">
              {footerLinks.socials.map((link) => (
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
        </div>

        <div className="w-11/12">
          <div className="text-[22vw] sm:text-[20vw] lg:text-[16vw] font-black text-white leading-none tracking-[-0.08em] select-none" style={{ letterSpacing: '-0.04em' }}>
            FAITHWALL
          </div>
        </div>

        <div className="pt-8 border-t border-surface-border mt-8">
          <p className="text-center text-white/40 text-sm">
            2024 FaithWall. Made with love.
          </p>
        </div>
      </div>
    </footer>
  );
}
