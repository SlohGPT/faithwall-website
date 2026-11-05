import type { ReactNode } from 'react';

/**
 * Shared building blocks for the spot illustrations: palette, the iPhone, the
 * lock screen, the soft glow, verse bars. Every scene is composed from these so
 * the set stays one family. Colours come from tailwind.config.js and from the
 * blog-cover palettes in scripts/build-blog-thumbnails.mjs.
 */

export const C = {
  card: '#1A1A24',
  body: '#14141C',
  edge: '#44445A',
  brand: '#D97B3B',
  light: '#E9A06A',
  dark: '#C06A2E',
  cream: '#F3EBD8',
  ink: '#2B2118',
  gold: '#ECD48A',
  navy: '#0C1F46',
  plum: '#3B1646',
  rose: '#8A3A55',
  dusk: '#1D2F52',
  ember: '#3A1B0C',
  indigo: '#1C1B33',
  sun: '#D2603C',
  peach: '#F2A65A',
  mist: '#8E92D8',
};

export type Theme = { bg: string; text: string; ref: string; clock: string };
const theme = (bg: string, text: string, ref: string, clock = text): Theme => ({ bg, text, ref, clock });
export const T = {
  ember: theme(C.ember, '#FFFFFF', C.light),
  sunrise: theme('#1A1030', '#FFFFFF', C.peach),
  dusk: theme('#121A2E', '#C9D0E6', '#8A8FB8'),
  plum: theme(C.plum, '#FFFFFF', C.light),
  navy: theme(C.navy, C.gold, '#B49F63'),
  black: theme('#000000', '#FFFFFF', C.light),
  cream: theme(C.cream, C.ink, '#B4561F'),
  indigo: theme(C.indigo, '#F5F3FF', C.mist),
};

export const n = (v: number) => Math.round(v * 10) / 10;

/** Root svg: fixed viewBox (no layout shift), one stroke weight, round joins. */
export function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 720 300"
      width="720"
      height="300"
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

/**
 * The one soft warm glow per scene: an elliptical radial gradient that fades to
 * nothing before it reaches the viewBox edge (no visible box). `clip` cuts it
 * at a ground line for scenes that stand on a table.
 */
export function Glow({ id, cx, cy, rx, ry, c = C.brand, o = 0.5, clip }: { id: string; cx: number; cy: number; rx: number; ry: number; c?: string; o?: number; clip?: number }) {
  return (
    <>
      <radialGradient id={id}>
        <stop offset="0" stopColor={c} stopOpacity={o} />
        <stop offset="1" stopColor={c} stopOpacity="0" />
      </radialGradient>
      {clip && (
        <clipPath id={`${id}c`}>
          <rect width="720" height={clip} />
        </clipPath>
      )}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id})`} clipPath={clip ? `url(#${id}c)` : undefined} />
    </>
  );
}

/** Four-point sparkle. */
export function Spark({ x, y, r, fill = C.light, o = 1 }: { x: number; y: number; r: number; fill?: string; o?: number }) {
  return (
    <path
      transform={`translate(${x} ${y})`}
      d={`M0 ${-r}Q0 0 ${r} 0Q0 0 0 ${r}Q0 0 ${-r} 0Q0 0 0 ${-r}Z`}
      fill={fill}
      opacity={o}
    />
  );
}

/** Rounded bars centred on cx, standing in for verse text. */
export function Bars({ cx, y, ws, h = 7, gap = 8, fill, o = 1 }: { cx: number; y: number; ws: number[]; h?: number; gap?: number; fill: string; o?: number }) {
  return (
    <g fill={fill} opacity={o}>
      {ws.map((w, i) => (
        <rect key={i} x={n(cx - w / 2)} y={n(y + i * (h + gap))} width={n(w)} height={h} rx={n(h / 2)} />
      ))}
    </g>
  );
}

export type Dims = ReturnType<typeof dims>;
export const dims = (w: number) => {
  const h = Math.round(w * 2.05);
  const b = 6;
  return { w, h, b, r: n(w * 0.18), sw: w - 2 * b, sh: h - 2 * b, sr: n(w * 0.18 - b) };
};

/**
 * iPhone: dark body with a thin edge, flat screen colour, Dynamic Island.
 * Children are drawn in screen coordinates (0,0 = top-left of the screen).
 * `id` must be unique within the scene (clip path).
 */
export function Phone({ id, x, y, w, rot = 0, bg, children, o = 1, lite = false }: { id: string; x: number; y: number; w: number; rot?: number; bg: string; children?: (d: Dims) => ReactNode; o?: number; lite?: boolean }) {
  const d = dims(w);
  return (
    <g transform={`translate(${x} ${y})${rot ? ` rotate(${rot} ${n(w / 2)} ${n(d.h / 2)})` : ''}`} opacity={o === 1 ? undefined : o}>
      {!lite && (
      <g fill={C.edge}>
        <rect x="-3" y={n(d.h * 0.2)} width="4" height={n(d.h * 0.06)} rx="2" />
        <rect x="-3" y={n(d.h * 0.29)} width="4" height={n(d.h * 0.1)} rx="2" />
        <rect x={w - 1} y={n(d.h * 0.27)} width="4" height={n(d.h * 0.14)} rx="2" />
      </g>
      )}
      <rect x="1.5" y="1.5" width={w - 3} height={d.h - 3} rx={d.r} fill={C.body} stroke={C.edge} />
      <g transform={`translate(${d.b} ${d.b})`} clipPath={`url(#${id})`}>
        <clipPath id={id}>
          <rect width={d.sw} height={d.sh} rx={d.sr} />
        </clipPath>
        <rect width={d.sw} height={d.sh} fill={bg} />
        {children?.(d)}
        <rect x={n(d.sw * 0.33)} y={n(d.sw * 0.05)} width={n(d.sw * 0.34)} height={n(d.sw * 0.1)} rx={n(d.sw * 0.05)} fill="#000" />
      </g>
    </g>
  );
}

/** Lock-screen furniture: date bar, clock, flashlight and camera buttons. */
export function LockFrame({ d, t, clock = true, buttons = true }: { d: Dims; t: Theme; clock?: boolean; buttons?: boolean }) {
  const { sw, sh } = d;
  return (
    <>
      {clock && (
        <>
          <rect x={n(sw * 0.33)} y={n(sw * 0.23)} width={n(sw * 0.34)} height={n(sw * 0.04)} rx={n(sw * 0.02)} fill={t.clock} opacity=".55" />
          <text
            x={n(sw / 2)}
            y={n(sw * 0.6)}
            textAnchor="middle"
            fontFamily="'DM Sans',system-ui,sans-serif"
            fontWeight="700"
            fontSize={n(sw * 0.3)}
            letterSpacing={n(-sw * 0.012)}
            fill={t.clock}
          >
            9:41
          </text>
        </>
      )}
      {buttons && (
        <g fill={t.clock} opacity=".18">
          <circle cx={n(sw * 0.17)} cy={n(sh - sw * 0.17)} r={n(sw * 0.085)} />
          <circle cx={n(sw * 0.83)} cy={n(sh - sw * 0.17)} r={n(sw * 0.085)} />
        </g>
      )}
    </>
  );
}

/** Verse bars (3 lines + reference) positioned as on the covers. */
export function Verse({ d, t, y, lines = [0.84, 0.9, 0.6], ref = true, h, o = 1 }: { d: Dims; t: Theme; y?: number; lines?: number[]; ref?: boolean; h?: number; o?: number }) {
  const bh = h ?? Math.max(4, n(d.sw * 0.06));
  const gap = n(bh * 0.95);
  const y0 = y ?? n(d.sw * 0.86);
  return (
    <>
      <Bars cx={d.sw / 2} y={y0} ws={lines.map((l) => n(l * d.sw))} h={bh} gap={gap} fill={t.text} o={0.92 * o} />
      {ref && <Bars cx={d.sw / 2} y={n(y0 + lines.length * (bh + gap) + bh * 0.9)} ws={[n(d.sw * 0.36)]} h={bh} fill={t.ref} o={o} />}
    </>
  );
}

/** A complete lock screen: furniture + verse. */
export function LockScreen({ d, t, lines, y, o }: { d: Dims; t: Theme; lines?: number[]; y?: number; o?: number }) {
  return (
    <>
      <LockFrame d={d} t={t} />
      <Verse d={d} t={t} lines={lines} y={y} o={o} />
    </>
  );
}

/** Horizon / table line shared by the morning and evening scenes. */
export function Ground({ x1 = 70, x2 = 650, y = 271 }: { x1?: number; x2?: number; y?: number }) {
  return <path d={`M${x1} ${y}H${x2}`} stroke={C.edge} />;
}

/** Crescent moon path: outer circle minus an offset inner circle. */
export function crescent(cx: number, cy: number, R: number, dx: number, dy: number, r: number) {
  const dd = Math.hypot(dx, dy);
  const ux = dx / dd;
  const uy = dy / dd;
  const a = (R * R - r * r + dd * dd) / (2 * dd);
  const hh = Math.sqrt(R * R - a * a);
  const px = cx + a * ux;
  const py = cy + a * uy;
  const p1 = [px - uy * hh, py + ux * hh].map(n);
  const p2 = [px + uy * hh, py - ux * hh].map(n);
  return `M${p1[0]} ${p1[1]}A${R} ${R} 0 1 1 ${p2[0]} ${p2[1]}A${r} ${r} 0 1 0 ${p1[0]} ${p1[1]}Z`;
}
