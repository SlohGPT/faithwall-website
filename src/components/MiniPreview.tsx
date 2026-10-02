import { useEffect, useRef, useState, type RefObject } from 'react';

interface MiniPreviewProps {
  /** The live preview canvas; its pixels are mirrored here. */
  sourceRef: RefObject<HTMLCanvasElement | null>;
  /** Changes every time the source canvas is redrawn. */
  renderTick: number;
  /** Wallpaper aspect ratio. */
  width: number;
  height: number;
  /** The full preview. The mini one only shows while this is off-screen. */
  previewRef: RefObject<HTMLElement | null>;
  /** The whole maker area. The mini one hides once the visitor scrolls past it. */
  areaRef: RefObject<HTMLElement | null>;
  /** The download section. The mini one hides while it is on-screen so it never covers the button. */
  downloadRef: RefObject<HTMLElement | null>;
}

/**
 * Small fixed thumbnail (below the lg breakpoint only) that mirrors the live wallpaper while
 * the full preview is scrolled out of view. Tapping it scrolls back to the preview.
 */
export default function MiniPreview({
  sourceRef,
  renderTick,
  width,
  height,
  previewRef,
  areaRef,
  downloadRef,
}: MiniPreviewProps) {
  const miniRef = useRef<HTMLCanvasElement | null>(null);
  const [previewInView, setPreviewInView] = useState(true);
  const [areaInView, setAreaInView] = useState(false);
  const [downloadInView, setDownloadInView] = useState(false);

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
  const phone = height > width;
  const cssWidth = phone ? 84 : 120;
  const pxWidth = cssWidth * 2;
  const pxHeight = Math.round((pxWidth * height) / width);

  // Mirror the main canvas after each render (and when the thumbnail appears).
  useEffect(() => {
    const src = sourceRef.current;
    const mini = miniRef.current;
    if (!show || !src || !mini || !src.width || !src.height) return;
    mini.width = pxWidth;
    mini.height = pxHeight;
    const ctx = mini.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, pxWidth, pxHeight);
  }, [show, renderTick, pxWidth, pxHeight, sourceRef]);

  function scrollBack() {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    previewRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }

  return (
    <button
      type="button"
      aria-label="Show preview"
      onClick={scrollBack}
      tabIndex={show ? 0 : -1}
      aria-hidden={show ? undefined : true}
      className={`fixed right-3 z-40 lg:hidden overflow-hidden border-2 border-white/25 bg-black shadow-xl shadow-black/60 transition duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
        phone ? 'rounded-2xl' : 'rounded-lg'
      } ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0 motion-reduce:translate-y-0'}`}
      style={{ width: cssWidth, bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)', aspectRatio: `${width} / ${height}` }}
    >
      <canvas ref={miniRef} aria-hidden="true" className="block h-full w-full" />
    </button>
  );
}
