import { useId, type ReactNode } from 'react';

/**
 * Illustrated headers for the compare pages, the author page and the wallpaper-maker text.
 * Same family as the blog spot scenes (src/components/illustrations): flat shapes on the dark surface, 3px round
 * strokes, one warm glow, the shared iPhone (round corners + Dynamic Island, never a squircle). Everything is
 * decorative (aria-hidden), drawn in its end state and server-rendered; motion (pulse, bob, steam, twinkle) only
 * adds, runs 5 s or slower and pauses off-screen (see Live and visual-pages.css).
 */

export function Box({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      aria-hidden="true"
      focusable="false"
      fill="none"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', width: '100%', height: 'auto' }}
    >
      {children}
    </svg>
  );
}

export const delay = (s: number, t = 6) => ({ ['--d' as string]: `${s}s`, ['--t' as string]: `${t}s` });

/** Ids must be unique per document, and a page can hold more than one scene. */
export function useUid() {
  return useId().replace(/[^a-zA-Z0-9]/g, '');
}

