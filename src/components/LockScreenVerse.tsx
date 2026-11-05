import type { CSSProperties } from 'react';
import { pickLockPalette, lockVerseSize } from '../lib/lockScreenPalettes';

/**
 * A verse block drawn as the top of an iPhone lock screen, in the same look as
 * the blog covers (see scripts/build-blog-thumbnails.mjs). Only the clock and
 * the verse show; the lower edge fades into the page. The date and the 9:41
 * clock are CSS-generated decoration, so the only real text is the verse, the
 * reference and the caption. Geometry lives in src/index.css (.lockfig-*).
 */
export default function LockScreenVerse({ text, reference }: { text: string; reference: string }) {
  const pal = pickLockPalette(reference);
  const size = lockVerseSize(text);

  const screenStyle: CSSProperties = { background: pal.bg, color: pal.time };
  const verseStyle: CSSProperties = {
    color: pal.text,
    fontSize: `calc(var(--u) * ${size})`,
    fontFamily: pal.serif ? "'Gelasio', Georgia, serif" : "'DM Sans', system-ui, sans-serif",
    fontWeight: pal.weight,
    fontStyle: pal.italic ? 'italic' : 'normal',
    textShadow: pal.shadow ? `0 2px 18px ${pal.shadow}` : undefined,
  };
  const refStyle: CSSProperties = {
    color: pal.ref,
    letterSpacing: pal.upper ? 'calc(var(--u) * 4)' : 'calc(var(--u) * 1)',
    textTransform: pal.upper ? 'uppercase' : undefined,
  };

  return (
    <figure className="lockfig">
      <div className="lockfig-phone">
        <div className="lockfig-screen" style={screenStyle}>
          <span className="lockfig-island" aria-hidden="true" />
          <span className="lockfig-date" aria-hidden="true" />
          <span className="lockfig-time" aria-hidden="true" />
          <blockquote className="lockfig-verse">
            <p style={verseStyle}>{text}</p>
          </blockquote>
          <cite className="lockfig-ref" style={refStyle}>{reference}</cite>
        </div>
      </div>
      <figcaption className="lockfig-caption">{reference} as a lock screen</figcaption>
    </figure>
  );
}
