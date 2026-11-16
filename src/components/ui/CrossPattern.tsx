import { useId } from 'react';

/**
 * Faint pattern of small Latin crosses and plus marks (about 5% white), faded out toward the edges by a radial mask.
 * Decoration only: aria-hidden, pointer-events off. Fills its positioned parent; tune `opacity` (default 0.05) and
 * `focus` (where the pattern is strongest, as CSS "x% y%").
 */
export default function CrossPattern({
  className = '',
  opacity = 0.05,
  focus = '50% 40%',
  size = 64,
}: {
  className?: string;
  opacity?: number;
  focus?: string;
  /** Tile size in px. */
  size?: number;
}) {
  const id = useId().replace(/:/g, '');
  const mask = `radial-gradient(ellipse 70% 65% at ${focus}, #000 0%, rgba(0,0,0,0.5) 45%, transparent 100%)`;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity, WebkitMaskImage: mask, maskImage: mask }}
    >
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <g fill="#fff">
            {/* a small Latin cross */}
            <rect x="15" y="9" width="2" height="14" rx="0.5" />
            <rect x="11" y="13" width="10" height="2" rx="0.5" />
            {/* a plus mark, offset */}
            <rect x="46" y="39" width="1.6" height="8" rx="0.5" />
            <rect x="42.8" y="42.2" width="8" height="1.6" rx="0.5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
