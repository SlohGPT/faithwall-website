import { useEffect, useRef } from 'react';
import { useStaticBars } from '../lib/useVisualZoom';

/**
 * 2 px reading-progress bar at the top of the viewport, for long posts only (the caller decides).
 * scaleX() on a ref inside a rAF-throttled passive scroll listener: no React renders while scrolling.
 * Like the header it is not fixed while pinch-zoomed or on short viewports (it is not rendered then).
 */
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);
  const barStatic = useStaticBars();

  useEffect(() => {
    if (barStatic) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const target = document.getElementById(targetId);
      const el = bar.current;
      if (!target || !el) return;
      const top = target.getBoundingClientRect().top + window.scrollY;
      const span = target.offsetHeight - window.innerHeight * 0.5;
      const p = span > 0 ? (window.scrollY + window.innerHeight * 0.5 - top) / span : 0;
      el.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [barStatic, targetId]);

  if (barStatic) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 [@media(max-height:480px)]:hidden">
      <div ref={bar} className="h-full origin-left bg-brand" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}
