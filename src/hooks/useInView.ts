import { useState, useEffect, useRef, RefObject } from 'react';

interface UseInViewOptions {
  threshold?: number;
  triggerOnce?: boolean;
  /** Default fires 15% of the viewport before the element enters (same early margin as Reveal). */
  rootMargin?: string;
}

interface UseInViewReturn {
  ref: RefObject<HTMLDivElement>;
  inView: boolean;
}

export function useInView({ threshold = 0, triggerOnce = true, rootMargin = '0px 0px 15% 0px' }: UseInViewOptions = {}): UseInViewReturn {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, triggerOnce, rootMargin]);

  return { ref, inView };
}
