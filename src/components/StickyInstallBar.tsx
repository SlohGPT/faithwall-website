import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { appStoreUrl } from '../lib/appStore';
import { useIsAndroid } from '../hooks/useIsAndroid';
import { useStaticBars } from '../lib/useVisualZoom';

export type InstallBarKind = 'blog' | 'pillar' | 'compare' | 'maker' | 'random';

/** One App Store campaign token per page type, so installs can be attributed in App Store Connect. */
const CAMPAIGN: Record<InstallBarKind, string> = {
  blog: 'web-blog-sticky',
  pillar: 'web-pillar',
  compare: 'web-cmp',
  maker: 'web-maker',
  random: 'web-random',
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
 * It slides out of the way while an install card ([data-install-card]), any other install CTA marked
 * [data-hides-sticky] (held-page closing CTA, compare CTA) or the site footer (footer[data-site-footer]; not
 * the citation <footer> inside a blockquote) is on screen,
 * so the page never shows two install prompts at once, and it is not shown on Android.
 * The link is a plain "Get the app" button, not a shrunken App Store badge (Apple's badge rules).
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
  const [covered, setCovered] = useState(false);
  const isAndroid = useIsAndroid();
  // Pinch-zoomed or short viewport: a fixed bar would be magnified or eat the screen, so it is not shown (spacer included).
  const barStatic = useStaticBars();

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

  const enabled = mounted && isMobile && !dismissed && !isAndroid;

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

  // Hide (slide out, spacer stays) while an install card, a [data-hides-sticky] CTA or the site footer intersects the viewport.
  // Cards can appear later (after an export or a draw), so new ones are picked up through a MutationObserver.
  useEffect(() => {
    if (!active || typeof IntersectionObserver === 'undefined') return;
    const visible = new Set<Element>();
    const watched = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.target.isConnected) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setCovered(visible.size > 0);
    });
    const scan = () => {
      document.querySelectorAll('[data-install-card], [data-hides-sticky], footer[data-site-footer]').forEach((el) => {
        if (!watched.has(el)) {
          watched.add(el);
          io.observe(el);
        }
      });
      watched.forEach((el) => {
        if (!el.isConnected) {
          watched.delete(el);
          io.unobserve(el);
          visible.delete(el);
        }
      });
      setCovered(visible.size > 0);
    };
    scan();
    let raf = 0;
    const mo = new MutationObserver(() => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.cancelAnimationFrame(raf);
      mo.disconnect();
      io.disconnect();
      setCovered(false);
    };
  }, [active]);

  const shown = active && !covered && !barStatic;

  useEffect(() => {
    if (!active) {
      setEntered(false);
      return;
    }
    const raf = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(raf);
  }, [active]);

  // Other fixed UI (the wallpaper maker's preview pill) clears the bar only while the bar is on screen.
  useEffect(() => {
    if (!shown) return;
    const root = document.documentElement;
    root.style.setProperty('--install-bar-h', BAR_HEIGHT);
    root.classList.add('install-bar-on');
    return () => {
      root.style.removeProperty('--install-bar-h');
      root.classList.remove('install-bar-on');
    };
  }, [shown]);

  if (!active || barStatic) return null;

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
        aria-hidden={covered ? true : undefined}
        className={`fixed inset-x-0 bottom-0 z-30 md:hidden border-t border-white/10 bg-surface-elevated/95 backdrop-blur-md shadow-[0_-8px_24px_rgba(0,0,0,0.45)] transition-[transform,visibility] duration-300 ease-out ${
          entered && !covered ? 'visible translate-y-0' : 'invisible translate-y-full'
        }`}
        style={{ height: BAR_HEIGHT, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex h-[68px] items-center gap-2 pl-3 pr-1">
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
          <a
            href={appStoreUrl(CAMPAIGN[kind])}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-brand px-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Get the app
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss install banner"
            className="flex h-11 w-11 shrink-0 items-center justify-center text-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
}
