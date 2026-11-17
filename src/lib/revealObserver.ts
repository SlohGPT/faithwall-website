/*
 * Shared "arrive early" machinery for scroll entrances (Reveal, the stat counters, the visual-pages Live wrapper).
 *
 * One module-level IntersectionObserver with rootMargin '0px 0px 15% 0px' and threshold 0 fires a block 15% of the
 * viewport BEFORE it enters, so it is already moving when it arrives. A scroll fallback covers fast flicks: on
 * scrollend (or 150 ms after the last scroll event, for browsers without scrollend) every armed block whose top is
 * above the viewport bottom fires at once, so a block can never stay blank on screen. Browser-only: call
 * armOnApproach from effects, never during render.
 */

type Fire = (instant: boolean) => void;

const armed = new Map<Element, Fire>();
let io: IntersectionObserver | null = null;
let scrollTimer: number | undefined;
let listening = false;
let restored = false; // a back/forward cache restore happened: nothing arms any more

function fire(el: Element, instant: boolean) {
  const cb = armed.get(el);
  if (!cb) return;
  armed.delete(el);
  io?.unobserve(el);
  cb(instant);
  if (armed.size === 0) stopListening();
}

function flush() {
  const vh = window.innerHeight;
  for (const el of Array.from(armed.keys())) {
    if (el.getBoundingClientRect().top < vh) fire(el, true);
  }
}

function onScroll() {
  window.clearTimeout(scrollTimer);
  scrollTimer = window.setTimeout(flush, 150);
}

function onPageShow(e: PageTransitionEvent) {
  if (!e.persisted) return;
  restored = true;
  for (const el of Array.from(armed.keys())) fire(el, true);
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scrollend', flush, { passive: true });
  window.addEventListener('pageshow', onPageShow);
}

function stopListening() {
  if (!listening) return;
  listening = false;
  window.clearTimeout(scrollTimer);
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('scrollend', flush);
  window.removeEventListener('pageshow', onPageShow);
}

function observer(): IntersectionObserver {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // Fully above the viewport counts too (a flick that jumped past it): it must never stay hidden.
          const above = !!e.rootBounds && e.boundingClientRect.top < e.rootBounds.top;
          if (e.isIntersecting || above) fire(e.target, e.boundingClientRect.top < window.innerHeight);
        }
      },
      { rootMargin: '0px 0px 15% 0px', threshold: 0 },
    );
  }
  return io;
}

/** True when content must never be hidden or reset: no observer, reduced motion, a #hash landing, a back/forward load. */
export function neverHide(): boolean {
  if (restored || typeof IntersectionObserver === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  if (window.location.hash) return true;
  const nav = performance.getEntriesByType?.('navigation')?.[0] as PerformanceNavigationTiming | undefined;
  return nav?.type === 'back_forward';
}

/** True when the element's top is at or below the viewport bottom (it is below the fold at this moment). */
export function belowTheFold(el: Element): boolean {
  return el.getBoundingClientRect().top >= window.innerHeight;
}

/**
 * Calls `cb` once, when `el` is within 15% of the viewport bottom, in the viewport, or above it (also on scrollend).
 * `instant` is true when the element is already inside the viewport at that moment (skip any stagger delay).
 * Returns a disarm function.
 */
export function armOnApproach(el: Element, cb: Fire): () => void {
  armed.set(el, cb);
  startListening();
  observer().observe(el);
  return () => {
    armed.delete(el);
    io?.unobserve(el);
    if (armed.size === 0) stopListening();
  };
}
