import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';
import './visual-pages.css';

/**
 * Wrapper for one visual. It uses the site's shared useInView hook (no second observer) and sets classes that
 * visual-pages.css reacts to:
 *   vp-live   while the visual is on screen (loops run, they pause off-screen)
 *   vp-armed  below the fold, after mount, when motion is allowed: entrance elements start hidden
 *   vp-go     the first time it scrolls into view: entrance elements play once
 * Server render, no-JS, print, reduced motion and anything already on screen at load get none of the hidden
 * states, so the visual is always in its end state unless it is about to animate in below the fold.
 */
export default function Live({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });
  const [armed, setArmed] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // on screen already: never hide it
    setArmed(true);
  }, [ref]);

  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);

  const state = armed ? (seen ? 'vp-go' : 'vp-armed') : '';
  return (
    <div ref={ref} className={`vp ${state} ${inView ? 'vp-live' : ''} ${className}`.replace(/\s+/g, ' ').trim()} style={style}>
      {children}
    </div>
  );
}
