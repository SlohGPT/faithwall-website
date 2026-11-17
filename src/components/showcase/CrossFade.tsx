import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useLayers } from './utils';

function FadeLayer({
  first,
  active,
  duration,
  className,
  style,
  children,
}: {
  first: boolean;
  active: boolean;
  duration: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  // Layer 0 is visible from the first render (SSR + hydration); later layers start hidden and fade in on the next frame.
  const [entered, setEntered] = useState(first);
  useEffect(() => {
    if (first) return;
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [first]);
  return (
    <div
      className={`absolute inset-0 ${className ?? ''}`}
      style={{
        opacity: active && entered ? 1 : 0,
        transition: `opacity ${duration}ms ease-in-out`,
        ...style,
      }}
      aria-hidden={active ? undefined : true}
    >
      {children}
    </div>
  );
}

/**
 * Crossfades between renders of `value`: the old render fades out while the new one fades in, all in the same box.
 * The parent must be positioned and sized (the layers are absolute inset-0). First render shows `value` immediately.
 */
export default function CrossFade<T>({
  value,
  duration = 800,
  className,
  style,
  children,
}: {
  value: T;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  children: (value: T) => ReactNode;
}) {
  const layers = useLayers(value, duration + 300);
  return (
    <>
      {layers.map((l, i) => (
        <FadeLayer
          key={l.id}
          first={l.id === 0}
          active={i === layers.length - 1}
          duration={duration}
          className={className}
          style={style}
        >
          {children(l.value)}
        </FadeLayer>
      ))}
    </>
  );
}
