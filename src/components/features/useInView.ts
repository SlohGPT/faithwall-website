import { useEffect, useRef, useState } from 'react';

/** True while the element is on screen (or within 15% of the viewport bottom, so loops start just before it arrives). False on the server and on the first client render. */
export function useInView<T extends Element>(rootMargin = '0px 0px 15% 0px') {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      const last = entries[entries.length - 1];
      if (last) setInView(last.isIntersecting);
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return { ref, inView };
}
