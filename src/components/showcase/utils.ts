import { useEffect, useRef, useState } from 'react';

/** Container-query width unit helper: cq(5) -> "5cqw". Every mockup sizes itself from its own screen width. */
export const cq = (n: number) => `${Math.round(n * 1000) / 1000}cqw`;

/** The system font stack the real lock screen and home screen use (the page never ships SF). */
export { SYSTEM_FONT } from '../DeviceMockup';

/**
 * SSR-safe media query: false on the server and on the first client render, the real value after mount.
 * Keeps the prerendered markup and the first hydrated render identical.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return matches;
}

/** SSR-safe prefers-reduced-motion (false on the server and on the first client render). */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** True while the tab is visible. Timers pause when it is hidden. */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const on = () => setVisible(!document.hidden);
    on();
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);
  return visible;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Mon Nov 16": the Lock Screen date line (weekday short, month short, day). */
export function formatLockDate(d: Date): string {
  return `${WEEKDAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** Visitor's date for the Lock Screen. Empty on the server and the first client render, filled in after mount. */
export function useLockDate(): string {
  const [label, setLabel] = useState('');
  useEffect(() => {
    setLabel(formatLockDate(new Date()));
  }, []);
  return label;
}

export type Layer<T> = { id: number; value: T };

/**
 * Keeps the previous value mounted for a moment so a change can crossfade.
 * Layer 0 is the first (deterministic) render; later layers are appended on change
 * and the older ones are dropped once the fade has settled.
 */
export function useLayers<T>(value: T, settleMs = 1100): Layer<T>[] {
  const [layers, setLayers] = useState<Layer<T>[]>([{ id: 0, value }]);
  const counter = useRef(0);

  useEffect(() => {
    setLayers((prev) => {
      if (Object.is(prev[prev.length - 1].value, value)) return prev;
      counter.current += 1;
      return [...prev, { id: counter.current, value }];
    });
  }, [value]);

  useEffect(() => {
    if (layers.length <= 1) return;
    const t = setTimeout(() => setLayers((p) => p.slice(-1)), settleMs);
    return () => clearTimeout(t);
  }, [layers, settleMs]);

  return layers;
}
