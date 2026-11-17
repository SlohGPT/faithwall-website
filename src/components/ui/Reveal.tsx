import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type TransitionEvent } from 'react';
import { armOnApproach, belowTheFold, neverHide } from '../../lib/revealObserver';

interface RevealProps {
  children: ReactNode;
  /** Seconds. Clamped to 0.18 s; callers stagger by at most 0.06 s per item. */
  delay?: number;
  /** Start offset in px. Clamped to 12 to 16. */
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article';
}

type RevealState = 'visible' | 'hidden' | 'shown';

const DURATION_MS = 500;
const EASE = 'cubic-bezier(0.22,1,0.36,1)';
const MAX_DELAY_S = 0.18;

/**
 * One-time reveal. It renders VISIBLE on the server and on the first client render (so the prerendered HTML,
 * crawlers, no-JS and print all show the content). After mount, only if motion is allowed and the element is
 * below the fold, it is hidden and fades/rises in once as it nears the viewport (shared observer, 15% early, plus a
 * scrollend fallback: see lib/revealObserver). Content that is already in view or above it is never hidden, nor is
 * anything on a #hash, back/forward or reduced-motion load. Transform and opacity only.
 */
export default function Reveal({ children, delay = 0, y = 14, className, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<RevealState>('visible');
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || neverHide() || !belowTheFold(el)) return; // in view (or above it) already: leave it alone
    setState('hidden');
    return armOnApproach(el, (now) => {
      setInstant(now);
      setState('shown');
    });
  }, []);

  const rise = Math.min(16, Math.max(12, y));
  const wait = instant ? 0 : Math.min(MAX_DELAY_S, Math.max(0, delay));

  const style: CSSProperties | undefined =
    state === 'visible'
      ? undefined
      : state === 'hidden'
        ? { opacity: 0, transform: `translateY(${rise}px)` }
        : {
            opacity: 1,
            transform: 'none',
            transition: `opacity ${DURATION_MS}ms ${EASE} ${wait}s, transform ${DURATION_MS}ms ${EASE} ${wait}s`,
          };

  // Once the fade has finished, drop the inline styles so no composited layer is left behind (WebKit leaks them).
  const onEnd =
    state === 'shown'
      ? (e: TransitionEvent) => {
          if (e.target === e.currentTarget && e.propertyName === 'opacity') setState('visible');
        }
      : undefined;

  return (
    <Tag ref={ref as never} className={className} style={style} onTransitionEnd={onEnd}>
      {children}
    </Tag>
  );
}
