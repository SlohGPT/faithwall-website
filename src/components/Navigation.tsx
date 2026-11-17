import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { appStoreUrl } from '../lib/appStore';
import { useStaticBars } from '../lib/useVisualZoom';
import { COMPARE_LINKS, GUIDE_LINKS, TOOL_LINKS, type SiteLink } from '../lib/siteLinks';

const NAV_LINK = 'text-lg font-semibold text-white hover:text-white/70 transition-colors duration-300 px-3 xl:px-4 py-3 rounded-lg';
const GROUP_LABEL = 'px-3 pt-2 pb-1 text-[13px] font-semibold uppercase tracking-wider text-white/65';
const PANEL_LINK = 'block rounded-lg px-3 py-2.5 text-base font-semibold text-white/85 hover:bg-white/5 hover:text-white transition-colors';
const MOBILE_ROW = 'flex min-h-[48px] items-center rounded-lg px-4 text-lg font-semibold text-white/85 hover:bg-white/5 hover:text-white transition-colors';
const MOBILE_TOP_ROW = 'flex min-h-[52px] items-center rounded-lg px-4 text-xl font-semibold text-white/85 hover:bg-white/5 hover:text-white transition-colors';

function LinkGroup({ label, links, onNavigate }: { label: string; links: SiteLink[]; onNavigate: () => void }) {
  return (
    <div>
      <p className={GROUP_LABEL}>{label}</p>
      <ul>
        {links.map((l) => (
          <li key={l.href}>
            <Link to={l.href} className={PANEL_LINK} onClick={onNavigate}>
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Desktop "Guides" disclosure: a button with aria-expanded / aria-controls. The panel is always in the DOM (and in the
 * prerendered HTML); closed it is only hidden with CSS (visibility), so its links are crawlable and never focusable.
 * Enter/Space toggle (native button), Escape closes and returns focus to the button, a click or focus outside closes.
 */
function GuidesMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onFocusIn = (e: FocusEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation();
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`${NAV_LINK} inline-flex items-center gap-1.5`}
        aria-expanded={open}
        aria-controls="guides-menu-panel"
        onClick={() => setOpen((v) => !v)}
      >
        Guides
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <div
        id="guides-menu-panel"
        className={`absolute left-0 top-full mt-3 w-[34rem] max-w-[calc(100vw-3rem)] rounded-2xl border border-surface-border bg-surface-elevated p-3 shadow-2xl transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="grid grid-cols-2 gap-x-4">
          <LinkGroup label="Guides" links={GUIDE_LINKS} onNavigate={() => setOpen(false)} />
          <div className="space-y-2">
            <LinkGroup label="Compare" links={COMPARE_LINKS} onNavigate={() => setOpen(false)} />
            <LinkGroup label="Free tools" links={TOOL_LINKS} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navigation() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isMobileView, setIsMobileView] = useState(false);
  // Pinch-zoomed or short viewport: the bar sits at the top of the document instead of floating over the page.
  const barStatic = useStaticBars();
  const containerRef = useRef<HTMLDivElement>(null);
  // Refs for direct DOM mutation of the SVG progress ring. Updating
  // strokeDashoffset via ref every animation frame is dramatically smoother
  // than re-rendering the whole Navigation component (with its SVG, gradient
  // defs, geometry calcs) on every scroll frame.
  const progressRectRef = useRef<SVGRectElement>(null);
  const perimeterRef = useRef(0);

  // iOS Chrome (and iOS 26 Safari Liquid Glass) overlay the URL bar on the
  // layout viewport instead of reserving layout space for it. env(safe-area-inset-top)
  // only covers the hardware notch — not the URL bar. Use the visualViewport API to
  // measure the live URL bar overlap and expose it as --browser-top-inset so fixed
  // top-anchored elements can clear it. On Safari iOS with reserved layout and on
  // desktop, the delta is 0 — the variable is a no-op everywhere except the broken
  // environments.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const sync = () => {
      // Pinch-zoom shrinks vv.height too; that is not a URL bar, so ignore it
      // (otherwise the nav slides down into the page while zoomed). A real URL
      // bar overlap is never taller than ~120px.
      const overlap = Math.abs(vv.scale - 1) > 0.01
        ? 0
        : Math.min(120, Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
      document.documentElement.style.setProperty('--browser-top-inset', `${overlap}px`);
    };
    sync();
    vv.addEventListener('resize', sync);
    vv.addEventListener('scroll', sync);
    return () => {
      vv.removeEventListener('resize', sync);
      vv.removeEventListener('scroll', sync);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    let lastHasScrolled = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollY / docHeight : 0;
        // Mutate the SVG ring directly — no React render, no allocation.
        const rect = progressRectRef.current;
        const perimeter = perimeterRef.current;
        if (rect && perimeter > 0) {
          rect.style.strokeDashoffset = String(perimeter * (1 - progress));
        }
        // hasScrolled only flips once (boolean) — cheap to keep in state.
        const next = scrollY > 20;
        if (next !== lastHasScrolled) {
          lastHasScrolled = next;
          setHasScrolled(next);
        }
        ticking = false;
      });
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
      setIsMobileView(window.innerWidth < 768);
    };
    updateSize();
    const onResize = () => requestAnimationFrame(updateSize);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeMobile = useCallback(() => setIsMobileMenuOpen(false), []);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  // Escape closes the mobile menu and returns focus to its toggle button.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  // No scrolled pill (glass, shadow, progress ring) while the bar is not fixed.
  const pill = hasScrolled && !barStatic;
  const showIndicator = pill;
  const borderRadius = isMobileView ? 16 : 40;
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

  // Keep perimeterRef in sync and snap the ring to the current scroll position
  // whenever the geometry changes (initial mount, window resize, mobile/desktop
  // breakpoint flip).
  useEffect(() => {
    perimeterRef.current = perimeter;
    const rect = progressRectRef.current;
    if (!rect || perimeter <= 0) return;
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollY / docHeight : 0;
    rect.style.strokeDasharray = String(perimeter);
    rect.style.strokeDashoffset = String(perimeter * (1 - progress));
  }, [perimeter]);

  return (
    <>
      <nav
        className={`${barStatic ? 'absolute' : 'fixed [@media(max-height:480px)]:absolute'} top-0 left-0 right-0 z-50 px-4 md:px-6 nav-safe-pt`}
        style={{ willChange: 'transform' }}
      >
        <div className="relative mx-auto max-w-6xl">
          <div
            ref={containerRef}
            className="absolute inset-0 rounded-2xl md:rounded-[40px] overflow-visible"
            style={{
              // Mobile Safari composites multiple backdrop-filter layers slowly.
              // Use a solid translucent background on mobile, keep the glass look on desktop.
              background: pill
                ? (isMobileView ? 'rgba(10, 10, 12, 0.92)' : 'rgba(0, 0, 0, 0.25)')
                : 'transparent',
              backdropFilter: pill && !isMobileView ? 'blur(24px)' : 'none',
              WebkitBackdropFilter: pill && !isMobileView ? 'blur(24px)' : 'none',
              boxShadow: pill
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
                  ref={progressRectRef}
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
                  // Skip the expensive Gaussian blur glow on mobile Safari.
                  // Keep the gradient stroke; lose only the soft halo.
                  {...(isMobileView ? {} : { filter: 'url(#glow)' })}
                  shapeRendering="geometricPrecision"
                  // strokeDasharray / strokeDashoffset are mutated imperatively
                  // by the scroll handler (and the perimeter effect for resize).
                  // Initial values: full perimeter dash, fully offset (ring empty).
                  style={{
                    strokeDasharray: perimeter,
                    strokeDashoffset: perimeter,
                  }}
                />
              </svg>
            )}
          </div>

          <div className="relative">
            <div className="flex items-center justify-between pl-5 pr-2 py-1.5 md:pl-7 md:pr-3 md:py-2">
              <Link to="/" className="flex items-center gap-2.5 group pl-1.5">
                <img
                  src="/icon-app-80.webp"
                  alt=""
                  width={80}
                  height={80}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl group-hover:scale-105 transition-transform duration-300"
                  loading="eager"
                />
                <span className="text-lg md:text-xl font-black text-white tracking-tight">
                  FaithWall
                </span>
              </Link>

              <div className="flex items-center gap-6 ml-auto">
                <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                  <GuidesMenu />
                  <Link to="/blog" className={NAV_LINK}>
                    Blog
                  </Link>
                  <Link to="/#features" className={NAV_LINK}>
                    Features
                  </Link>
                  <Link to="/#how-it-works" className={NAV_LINK}>
                    How it works
                  </Link>
                  <Link to="/#faq" className={NAV_LINK}>
                    FAQ
                  </Link>
                </div>

                <a
                  href={appStoreUrl('web-site')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:inline-flex items-center justify-center px-7 py-3 bg-white text-surface text-xl font-semibold rounded-full hover:bg-white/90 transition-all duration-300"
                >
                  Get the app
                </a>

                <button
                  ref={menuButtonRef}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-white hover:text-white/70 transition-colors duration-300"
                  aria-label="Toggle menu"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu-panel"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-200 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
      >
        <div
          className="absolute inset-0 bg-black/75"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          id="mobile-menu-panel"
          className={`absolute left-4 right-4 flex flex-col bg-surface-elevated rounded-2xl shadow-2xl transition-[transform,opacity] duration-200 ease-out ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
          style={{
            top: 'calc(5rem + env(safe-area-inset-top, 0px) + var(--browser-top-inset, 0px))',
            maxHeight: 'calc(100dvh - 6rem - env(safe-area-inset-top, 0px) - var(--browser-top-inset, 0px))',
          }}
        >
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 pb-1">
            <p className={GROUP_LABEL}>Guides</p>
            <ul>
              {GUIDE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className={MOBILE_ROW} onClick={closeMobile}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className={`${GROUP_LABEL} mt-2`}>Compare</p>
            <ul>
              {COMPARE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className={MOBILE_ROW} onClick={closeMobile}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className={`${GROUP_LABEL} mt-2`}>Free tools</p>
            <ul>
              {TOOL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className={MOBILE_ROW} onClick={closeMobile}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-2 pt-2 border-t border-surface-border">
              <li>
                <Link to="/blog" className={MOBILE_TOP_ROW} onClick={closeMobile}>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/#features" className={MOBILE_TOP_ROW} onClick={closeMobile}>
                  Features
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className={MOBILE_TOP_ROW} onClick={closeMobile}>
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/#faq" className={MOBILE_TOP_ROW} onClick={closeMobile}>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="shrink-0 p-3 pt-2 border-t border-surface-border">
            <a
              href={appStoreUrl('web-site')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full px-8 py-3.5 bg-white text-surface text-xl font-semibold rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get the app
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
