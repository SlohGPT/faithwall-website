import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Seconds. */
  delay?: number;
  /** Start offset in px. */
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article';
}

type RevealState = 'visible' | 'hidden' | 'shown';

/**
 * One-time reveal. It renders VISIBLE on the server and on the first client render (so the prerendered HTML,
 * crawlers, no-JS and print all show the content). After mount, only if motion is allowed and the element is
 * below the fold, it is hidden and fades/slides in once when it scrolls into view. Content that is already in
 * view is never hidden.
 */
export default function Reveal({ children, delay = 0, y = 18, className, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<RevealState>('visible');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) return; // already in view (or above it): leave it alone
    setState('hidden');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('shown');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties | undefined =
    state === 'visible'
      ? undefined
      : {
          opacity: state === 'hidden' ? 0 : 1,
          transform: state === 'hidden' ? `translateY(${y}px)` : 'none',
          transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 600ms cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        };

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}
