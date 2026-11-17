import { useEffect, useState, type RefObject } from 'react';
import { Eye } from 'lucide-react';
import { useStaticBars } from '../lib/useVisualZoom';

interface MiniPreviewProps {
  /** The full preview. The pill only shows while this is off-screen. */
  previewRef: RefObject<HTMLElement | null>;
  /** The whole maker area. The pill hides once the visitor scrolls past it. */
  areaRef: RefObject<HTMLElement | null>;
  /** The download section. The pill hides while it is on-screen so it never covers the button. */
  downloadRef: RefObject<HTMLElement | null>;
}

/**
 * Compact "Preview" pill (below the lg breakpoint only) at the bottom right, shown while the full
 * preview is scrolled out of view. Tapping it scrolls back to the preview. It is a small pill rather
 * than a thumbnail so it never hides the grid of backgrounds on phones. While the sticky install bar
 * is on screen it sits above it (StickyInstallBar publishes --install-bar-h).
 */
export default function MiniPreview({ previewRef, areaRef, downloadRef }: MiniPreviewProps) {
  const [previewInView, setPreviewInView] = useState(true);
  const [areaInView, setAreaInView] = useState(false);
  const [downloadInView, setDownloadInView] = useState(false);
  // Pinch-zoomed or short viewport: a fixed pill would be magnified or eat the screen, so it is not shown.
  const barStatic = useStaticBars();

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const watch = (el: HTMLElement | null, set: (v: boolean) => void) => {
      if (!el) return null;
      const io = new IntersectionObserver(([entry]) => set(entry.isIntersecting));
      io.observe(el);
      return io;
    };
    const observers = [
      watch(previewRef.current, setPreviewInView),
      watch(areaRef.current, setAreaInView),
      watch(downloadRef.current, setDownloadInView),
    ];
    return () => observers.forEach((o) => o?.disconnect());
  }, [previewRef, areaRef, downloadRef]);

  const show = areaInView && !previewInView && !downloadInView;

  function scrollBack() {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    previewRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }

  if (barStatic) return null;

  return (
    <button
      type="button"
      aria-label="Show preview"
      onClick={scrollBack}
      tabIndex={show ? 0 : -1}
      aria-hidden={show ? undefined : true}
      className={`fixed right-3 z-40 lg:hidden inline-flex h-11 items-center gap-1.5 rounded-full border border-white/25 bg-surface-elevated/95 px-4 text-sm font-semibold text-white shadow-xl shadow-black/60 backdrop-blur-md transition duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0 motion-reduce:translate-y-0'
      }`}
      style={{ bottom: 'calc(var(--install-bar-h, env(safe-area-inset-bottom, 0px)) + 12px)' }}
    >
      <Eye className="h-4 w-4" aria-hidden="true" />
      Preview
    </button>
  );
}
