import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import AppStoreButton from './AppStoreButton';
import { appStoreUrl } from '../lib/appStore';

export type InstallBarKind = 'blog' | 'tool' | 'pillar' | 'compare';

/** One App Store campaign token per page type, so installs can be attributed in App Store Connect. */
const CAMPAIGN: Record<InstallBarKind, string> = {
  blog: 'web-sticky-blog',
  tool: 'web-sticky-tool',
  pillar: 'web-sticky-pillar',
  compare: 'web-sticky-compare',
};

const DISMISS_KEY = 'fw-install-bar-dismissed';
const MOBILE_QUERY = '(max-width: 767px)';

/** Bar height (one row) plus the iOS home-indicator inset. Shared with the in-flow spacer and --install-bar-h. */
const BAR_HEIGHT = 'calc(68px + env(safe-area-inset-bottom, 0px))';

/**
 * Mobile-only sticky install bar for the content pages.
 *
 * Client-only on purpose: the first render returns null (same as the server), and every
 * decision (viewport, sessionStorage, scroll position) happens in effects after hydration.
 * The prerendered HTML Google reads is therefore unchanged. It is a slim bottom banner that
 * appears after the first screen of scrolling, not an interstitial, and the reader can dismiss it.
 *
 * Place it once per page, after the footer. It renders an in-flow spacer of the same height so
 * it never covers the last content, and publishes --install-bar-h and an `install-bar-on` class on <html> so other fixed UI can clear it.
 */
export default function StickyInstallBar({ kind }: { kind: InstallBarKind }) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY) === '1') setDismissed(true);
    } catch {
      /* storage blocked (private mode, cookies off): the bar just shows again next page */
    }
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const enabled = mounted && isMobile && !dismissed;

  useEffect(() => {
    if (!enabled) return;
    const check = () => {
      if (window.scrollY >= window.innerHeight) setScrolled(true);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [enabled]);

  const active = enabled && scrolled;

  useEffect(() => {
    if (!active) {
      setEntered(false);
      return;
    }
    const raf = window.requestAnimationFrame(() => setEntered(true));
    const root = document.documentElement;
    root.style.setProperty('--install-bar-h', BAR_HEIGHT);
    root.classList.add('install-bar-on');
    return () => {
      window.cancelAnimationFrame(raf);
      root.style.removeProperty('--install-bar-h');
      root.classList.remove('install-bar-on');
    };
  }, [active]);

  if (!active) return null;

  function dismiss() {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      {/* In-flow spacer: keeps the last content (footer) clear of the fixed bar. */}
      <div aria-hidden="true" style={{ height: BAR_HEIGHT }} />
      <div
        role="complementary"
        aria-label="Install FaithWall"
        className={`fixed inset-x-0 bottom-0 z-30 md:hidden border-t border-white/10 bg-surface-elevated/95 backdrop-blur-md shadow-[0_-8px_24px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out ${
          entered ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: BAR_HEIGHT, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex h-[68px] items-center gap-2.5 pl-3 pr-1">
          <img
            src="/icon-app-180.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-[10px]"
            decoding="async"
          />
          <p className="min-w-0 flex-1 text-[13px] font-medium leading-snug text-white/85">
            Your verse on your lock screen
          </p>
          <AppStoreButton
            href={appStoreUrl(CAMPAIGN[kind])}
            theme="light"
            className="shrink-0 !px-3 !py-1.5 [&_span:last-child]:!text-[16px]"
          />
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss install banner"
            className="flex h-11 w-9 shrink-0 items-center justify-center text-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
}
