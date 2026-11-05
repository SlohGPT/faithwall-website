/**
 * Stat block as a small data picture. The number and label stay real text;
 * the picture is decorative SVG next to them.
 *
 *  - whole-number count from 10 to 400 (also "66 days"): one dot per unit, so
 *    the picture is honest. Only use a count in a post when one dot per unit is true.
 *  - percentage: a ring filled to that share
 *  - anything else ("30+ hours", "700M+", "74.1 vs 60.4"): the plain number
 */

type Picture =
  | { kind: 'dots'; count: number }
  | { kind: 'ring'; percent: number }
  | { kind: 'none' };

const MIN_DOTS = 10;
const MAX_DOTS = 400;

function statPicture(value: string): Picture {
  const v = value.trim();
  const pct = v.match(/^(\d+(?:\.\d+)?)\s?%$/);
  if (pct) {
    const percent = parseFloat(pct[1]);
    return percent > 0 && percent <= 100 ? { kind: 'ring', percent } : { kind: 'none' };
  }
  const count = v.match(/^(\d+)(?:\s(?:days?|times))?$/i);
  if (count) {
    const n = parseInt(count[1], 10);
    if (n >= MIN_DOTS && n <= MAX_DOTS) return { kind: 'dots', count: n };
  }
  return { kind: 'none' };
}

/** Columns for the dot grid: a clean rectangle when one fits, else a near-square with a short last row. */
function dotColumns(n: number): number {
  const root = Math.sqrt(n);
  let best = 0;
  for (let c = Math.ceil(root * 0.8); c <= Math.floor(root * 1.6); c++) {
    if (n % c === 0 && (best === 0 || Math.abs(c - root * 1.1) < Math.abs(best - root * 1.1))) best = c;
  }
  return best || Math.ceil(root);
}

const PITCH = 10;

function DotField({ count }: { count: number }) {
  const cols = dotColumns(count);
  const rows = Math.ceil(count / cols);
  // One path, a zero-length round-capped segment per dot: renders as circles, stays small in the HTML.
  let d = '';
  for (let i = 0; i < count; i++) {
    d += `M${(i % cols) * PITCH + PITCH / 2} ${Math.floor(i / cols) * PITCH + PITCH / 2}h0`;
  }
  return (
    <svg
      viewBox={`0 0 ${cols * PITCH} ${rows * PITCH}`}
      aria-hidden="true"
      focusable="false"
      className="shrink-0 h-auto text-brand [--dot-pitch:11px] md:[--dot-pitch:13px]"
      style={{ width: `calc(${cols} * var(--dot-pitch))` }}
    >
      <path d={d} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function Ring({ percent }: { percent: number }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className="shrink-0 w-[5.5rem] h-[5.5rem] md:w-28 md:h-28 -rotate-90">
      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="9" />
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="#D97B3B"
        strokeWidth="9"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={`${percent} 100`}
      />
    </svg>
  );
}

export default function StatBlock({ value, label, description }: { value?: string; label?: string; description?: string }) {
  // A stat with no number has nothing to show (one post carries such an entry); draw nothing rather than an empty card.
  if (!value) return null;
  const pic = statPicture(value);
  return (
    <div className="my-8 py-6 border-y border-white/10 flex items-center justify-between gap-6 md:gap-10 md:max-w-[34rem]">
      <div className="min-w-0">
        <p className="text-4xl md:text-5xl font-black text-brand tracking-tight">{value}</p>
        <p className="text-white font-semibold mt-2">{label}</p>
        {description && <p className="text-white/60 text-sm mt-2 leading-relaxed max-w-[28rem]">{description}</p>}
      </div>
      {pic.kind === 'dots' && <DotField count={pic.count} />}
      {pic.kind === 'ring' && <Ring percent={pic.percent} />}
    </div>
  );
}
