import type { CSSProperties } from 'react';
import type { ShowcaseVerse } from '../../data/showcaseVerses';
import CrossFade from './CrossFade';
import { SYSTEM_FONT } from './utils';

/**
 * The FaithWall widgets, drawn from the app's WidgetKit code. Sizes are cqw of the SCREEN width (a 390 pt screen:
 * 1 pt = 0.2564 cqw), so every widget scales with the phone it sits in. Place it inside a DeviceMockup screen.
 *  - small:       170 x 170 pt, orange gradient, cross top-left, verse 12 pt (6 lines max), reference 10 pt.
 *  - medium:      364 x 170 pt, cross + "FaithWall" in the left column, verse 14 pt (5 lines max), reference 12 pt.
 *  - rectangular: Lock Screen accessory, plain white text, 11 pt, 4 lines max, no background.
 *  - inline:      Lock Screen accessory, small cross and one line.
 * The widget shows the verse the user picked; with rotation turned on it then shows random verses. When `verse`
 * changes, the text crossfades inside the widget (the gradient stays put).
 */

export type WidgetSize = 'small' | 'medium' | 'rectangular' | 'inline';

const PT = 100 / 390; // one iOS point in cqw of a 390 pt wide screen
const pt = (n: number) => `${(n * PT).toFixed(3)}cqw`;

const GRADIENT = 'linear-gradient(135deg, #F29A4D 0%, #E68033 100%)';

/** The Latin cross glyph the app draws (taller than wide: 12 x 16). */
export function CrossGlyph({
  width,
  color = '#fff',
  className,
  style,
}: {
  width: string;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 12 16"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ width, height: 'auto', aspectRatio: '12 / 16', display: 'block', flex: 'none', ...style }}
      fill={color}
    >
      <rect x="4.5" y="0" width="3" height="16" rx="0.7" />
      <rect x="0" y="4.4" width="12" height="3" rx="0.7" />
    </svg>
  );
}

const clamp = (lines: number): CSSProperties => ({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: lines,
  overflow: 'hidden',
});

/** Only the verse text crossfades; the cross, the app name and the gradient stay put. */
function VerseLayer({ size, verse }: { size: WidgetSize; verse: ShowcaseVerse }) {
  if (size === 'small') {
    return (
      <div className="absolute flex flex-col justify-end" style={{ inset: pt(16) }}>
        <p style={{ margin: 0, fontSize: pt(12), fontWeight: 500, lineHeight: 1.22, ...clamp(6) }}>{verse.text}</p>
        <p style={{ margin: 0, marginTop: pt(4), fontSize: pt(10), fontWeight: 600, opacity: 0.8 }}>{verse.reference}</p>
      </div>
    );
  }
  if (size === 'medium') {
    return (
      <div
        className="absolute flex flex-col justify-center"
        style={{ top: pt(16), bottom: pt(16), right: pt(16), left: pt(16 + 64 + 14) }}
      >
        <p style={{ margin: 0, fontSize: pt(14), fontWeight: 500, lineHeight: 1.22, ...clamp(5) }}>{verse.text}</p>
        <p style={{ margin: 0, marginTop: pt(6), fontSize: pt(12), fontWeight: 600, opacity: 0.8 }}>{verse.reference}</p>
      </div>
    );
  }
  if (size === 'rectangular') {
    return (
      <div className="absolute inset-0">
        <p style={{ margin: 0, fontSize: pt(11), fontWeight: 500, lineHeight: 1.22, ...clamp(4) }}>{verse.text}</p>
        <p style={{ margin: 0, marginTop: pt(2), fontSize: pt(11), fontWeight: 600 }}>{verse.reference}</p>
      </div>
    );
  }
  return (
    <div className="absolute flex items-center" style={{ top: 0, bottom: 0, right: 0, left: pt(13) }}>
      <span style={{ fontSize: pt(13), fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
        {verse.reference}
      </span>
    </div>
  );
}

const BOX: Record<WidgetSize, CSSProperties> = {
  small: { width: pt(170), height: pt(170), borderRadius: pt(22), background: GRADIENT },
  medium: { width: pt(364), height: pt(170), borderRadius: pt(22), background: GRADIENT },
  rectangular: { width: pt(172), height: pt(76) },
  inline: { width: pt(190), height: pt(18) },
};

export default function FaithWallWidget({
  size = 'medium',
  verse,
  duration = 800,
  className = '',
  style,
}: {
  size?: WidgetSize;
  verse: ShowcaseVerse;
  /** Crossfade time in ms when the verse changes. */
  duration?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const filled = size === 'small' || size === 'medium';
  return (
    <div
      className={`relative overflow-hidden text-white ${className}`}
      style={{
        fontFamily: SYSTEM_FONT,
        ...BOX[size],
        ...(filled
          ? { boxShadow: '0 1cqw 3cqw -0.8cqw rgba(0,0,0,0.45), inset 0 0.25cqw 0 rgba(255,255,255,0.18)' }
          : { textShadow: '0 0.15cqw 1cqw rgba(0,0,0,0.55)' }),
        ...style,
      }}
    >
      {size === 'small' && <CrossGlyph width={pt(12)} style={{ position: 'absolute', top: pt(16), left: pt(16) }} />}
      {size === 'medium' && (
        <div className="absolute flex flex-col items-start" style={{ top: pt(16), left: pt(16) }}>
          <CrossGlyph width={pt(24)} />
          <span style={{ marginTop: pt(6), fontSize: pt(10), fontWeight: 600, opacity: 0.9 }}>FaithWall</span>
        </div>
      )}
      {size === 'inline' && <CrossGlyph width={pt(8)} style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)' }} />}
      <CrossFade value={verse} duration={duration}>
        {(v) => <VerseLayer size={size} verse={v} />}
      </CrossFade>
    </div>
  );
}
