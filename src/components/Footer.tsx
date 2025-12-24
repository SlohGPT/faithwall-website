import { Cross, Twitter, Instagram, Facebook, Mail } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Download', href: 'https://apps.apple.com/app/faithwall' },
    { name: "What's New", href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Contact', href: 'mailto:hello@faithwall.app' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Setup Guide', href: '#how-it-works' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Mail, href: 'mailto:hello@faithwall.app', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container-custom section-padding !pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-lg">
                <Cross className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">
                Faith<span className="text-gold">Wall</span>
              </span>
            </a>
            <p className="text-white/60 text-sm mb-6 max-w-xs">
              Faith on your lock screen. Daily scripture and inspiration for your spiritual journey.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gold/20 hover:text-gold transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-gold transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-gold transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-gold transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>2024 FaithWall. Made with love and prayer.</p>
            <p>Not affiliated with any church or denomination. For all believers.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
