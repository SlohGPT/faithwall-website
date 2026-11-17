import { useEffect, useState } from 'react';

/** Above this visualViewport.scale the page counts as pinch-zoomed (1.01 absorbs rounding noise). */
const PINCH_SCALE = 1.01;
/** Same breakpoint as the CSS rule that un-fixes the bars (Cmd+ zoom of 200% and up, phones in landscape). */
const SHORT_QUERY = '(max-height: 480px)';

/**
 * True while the visitor is pinch-zoomed (visualViewport.scale > 1.01). A fixed bar is magnified and
 * cropped by the zoom, so callers render it in the normal document flow instead.
 *
 * SSR-safe: false on the server and on the first client render (same markup as the prerender), then
 * the effect subscribes to visualViewport 'resize', which fires on every scale change.
 */
export function usePinchZoomed(): boolean {
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const sync = () => setZoomed(vv.scale > PINCH_SCALE);
    sync();
    vv.addEventListener('resize', sync);
    return () => vv.removeEventListener('resize', sync);
  }, []);
  return zoomed;
}

/**
 * True when fixed bars should not be fixed: pinch-zoomed, or a short viewport (max-height: 480px).
 * Pair it with a CSS `[@media(max-height:480px)]` rule so short viewports have no flash before hydration.
 */
export function useStaticBars(): boolean {
  const pinched = usePinchZoomed();
  const [short, setShort] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(SHORT_QUERY);
    const sync = () => setShort(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return pinched || short;
}
