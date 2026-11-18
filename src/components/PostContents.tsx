import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface ContentsItem {
  id: string;
  text: string;
}

/** Same breakpoints as the post layout: rail from 1180 px, open details from 768 px. */
const RAIL_QUERY = '(min-width: 1180px)';
const OPEN_QUERY = '(min-width: 768px)';

/**
 * "On this page": ONE server-rendered list of anchors, positioned by CSS.
 * - Under 1180 px it is a native details (closed on phones, open from 768 px), after the hero.
 * - From 1180 px it is the sticky right rail of the post layout (.post-toc, beside the text from the first line to the end of the post) and the active section is highlighted.
 * `variant="inline"` is the same details without the rail (pillar pages). The open state is set in an effect, so the
 * prerendered markup is always closed and every link is in the HTML either way.
 */
export default function PostContents({ items, variant = 'rail' }: { items: ContentsItem[]; variant?: 'rail' | 'inline' }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const rail = variant === 'rail';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const railMq = window.matchMedia(RAIL_QUERY);
    const openMq = window.matchMedia(OPEN_QUERY);
    const sync = () => {
      // Rail and tablet start open, phones closed. Only a change of breakpoint resets what the reader did.
      el.open = openMq.matches;
    };
    sync();
    railMq.addEventListener('change', sync);
    openMq.addEventListener('change', sync);
    // In the rail the list is always visible: a keyboard toggle on the (inert) summary opens it again.
    const onToggle = () => {
      if (rail && railMq.matches && !el.open) el.open = true;
    };
    el.addEventListener('toggle', onToggle);
    return () => {
      railMq.removeEventListener('change', sync);
      openMq.removeEventListener('change', sync);
      el.removeEventListener('toggle', onToggle);
    };
  }, [rail]);

  // Active section: the first heading inside the band between 96 px from the top and 30% down the viewport.
  useEffect(() => {
    if (!rail || typeof IntersectionObserver === 'undefined') return;
    const mq = window.matchMedia(RAIL_QUERY);
    let io: IntersectionObserver | null = null;
    const start = () => {
      io?.disconnect();
      io = null;
      if (!mq.matches) return;
      const seen = new Set<string>();
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) seen.add(e.target.id);
            else seen.delete(e.target.id);
          }
          const first = items.find((it) => seen.has(it.id));
          if (first) setActive(first.id);
          else {
            // Above the first section (top of the page): nothing is current yet.
            const top = document.getElementById(items[0]?.id ?? '')?.getBoundingClientRect().top;
            if (top !== undefined && top > window.innerHeight * 0.3) setActive(null);
          }
        },
        { rootMargin: '-96px 0px -70% 0px' },
      );
      for (const it of items) {
        const h = document.getElementById(it.id);
        if (h) io.observe(h);
      }
    };
    start();
    mq.addEventListener('change', start);
    // Back at the very top nothing is current, even if the observer has not reported the last exit yet.
    const onScroll = () => {
      if (window.scrollY < 40) setActive(null);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      mq.removeEventListener('change', start);
      window.removeEventListener('scroll', onScroll);
      io?.disconnect();
    };
  }, [items, rail]);

  return (
    <details ref={ref} className={`post-contents group ${rail ? 'post-contents--rail' : ''}`}>
      <summary className="post-contents-summary">
        <span className="post-contents-title">On this page ({items.length})</span>
        <ChevronDown className="post-contents-chev h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <ul className="post-contents-list">
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className="post-contents-link" aria-current={active === it.id ? 'location' : undefined}>
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
