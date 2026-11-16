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

/**
 * The verse block as the FaithWall app draws it on the wallpaper, for the homepage mockups.
 * Everything is in container-query units, so it must sit inside a DeviceMockup screen (or any
 * positioned box that is a size container). Measurements come from the app's renderer:
 * block top at 30% of the screen height, side margins 12%, bottom reserve 21%, Lora SemiBold (served as
 * "FW Verse Serif", see index.css)
 * (the serif the app bundles; its default, Apple's New York, cannot ship on the web), white,
 * centred, line spacing 0.15 x size, the reference on its own line.
 */
export const APP_VERSE_MAX = 5.6;
export const APP_VERSE_MIN = 2.0;

/** Verse size in cqw of the screen width: 5.6 (the app's 72 pt) for short verses, stepping down as the text grows, never below 2.0. */
export function appVerseSize(text: string): number {
  const n = text.length;
  if (n <= 80) return APP_VERSE_MAX;
  if (n <= 120) return 4.8;
  if (n <= 180) return 4.2;
  if (n <= 260) return 3.6;
  if (n <= 360) return 3.0;
  if (n <= 500) return 2.5;
  return APP_VERSE_MIN;
}

const APP_VERSE_FONT = "'FW Verse Serif', 'Gelasio', Georgia, serif";

export function AppLockVerse({
  text,
  reference,
  size,
  color = '#fff',
}: {
  text: string;
  reference: string;
  /** Override the fitted size (cqw). */
  size?: number;
  color?: string;
}) {
  const s = size ?? appVerseSize(text);
  return (
    <div
      className="absolute text-center"
      style={{
        top: '30%',
        left: '12%',
        right: '12%',
        bottom: '21%',
        color,
        fontFamily: APP_VERSE_FONT,
        fontWeight: 600,
        textShadow: `0 0.16cqw ${(0.12 * s).toFixed(3)}cqw rgba(0,0,0,0.8)`,
      }}
    >
      <p style={{ margin: 0, fontSize: `${s}cqw`, lineHeight: 1.3 }}>{text}</p>
      <p
        style={{
          margin: 0,
          marginTop: `${(0.3 * s).toFixed(3)}cqw`,
          fontSize: `${(0.78 * s).toFixed(3)}cqw`,
          lineHeight: 1.3,
          opacity: 0.78,
        }}
      >
        {`— ${reference}`}
      </p>
    </div>
  );
}
