import type { ReactNode } from 'react';
import type { BlogCluster } from '../../types/blog';
import { Bars, C, Glow, LockScreen, Phone, Spark, T, n } from '../illustrations/primitives';
import Live from './Live';
import { Box, delay, useUid } from './sceneKit';
import './pillar-visuals.css';

/**
 * Illustrated headers for the five pillar pages (visual redesign part C).
 * Same family as the blog spot scenes: flat shapes, 3px round strokes, one warm glow, the shared iPhone
 * (round corners + Dynamic Island). Decorative (aria-hidden), server-rendered in the end state and above the
 * fold: nothing starts invisible, the loops (pv-*, 6 s or slower, paused off-screen) only add to it.
 * Product truth: a verse you pick becomes the lock-screen wallpaper, and the optional widget starts with that
 * verse. Everything else is plain scenery (a candle, a notebook, a book, a desk) with no UI claims.
 * 640x240 each.
 */

const W = 640;
const H = 240;
const loop = (cls: string, s = 0, t = 7) => ({ className: `pv-loop ${cls}`, style: delay(s, t) });

function Ground({ x1 = 60, x2 = 580, y = 219 }: { x1?: number; x2?: number; y?: number }) {
  return <path d={`M${x1} ${y}H${x2}`} stroke={C.edge} />;
}

/** Three little verse cards: the middle one is the pick. */
function Picker() {
  const rows = [34, 97, 160];
  return (
    <g>
      {rows.map((y, i) => (
        <g key={y}>
          <rect x="36" y={y} width="170" height="46" rx="12" fill={C.card} stroke={i === 1 ? C.brand : C.edge} />
          <Bars cx={106} y={y + 12} ws={[i === 1 ? 124 : 112, i === 1 ? 84 : 92]} h={7} gap={8} fill={C.cream} o={i === 1 ? 0.8 : 0.4} />
        </g>
      ))}
      <circle cx="190" cy="97" r="10" fill={C.brand} />
      <path d="M185 97l4 4 7-8" stroke={C.ink} strokeWidth="2.6" />
    </g>
  );
}

/** Pillar 1: pick a verse, it becomes the wallpaper, and the widget starts with it. */
function DailyScripture() {
  const u = useUid();
  return (
    <Box w={W} h={H}>
      <g {...loop('pv-pulse', 0, 8)}>
        <Glow id={`${u}g`} cx={330} cy={120} rx={230} ry={120} o={0.42} />
      </g>
      <Picker />
      <path d="M216 120H256M248 112l8 8-8 8" stroke={C.light} />
      <circle cx="222" cy="120" r="4" fill={C.gold} {...loop('pv-travel', 0, 6)} style={{ ...delay(0, 6), ['--dx' as string]: '30px' }} />
      <g {...loop('pv-bob', 0, 7)}>
        <Phone id={`${u}p`} x={272} y={22} w={96} bg={T.ember.bg}>
          {(d) => <LockScreen d={d} t={T.ember} />}
        </Phone>
      </g>
      <path d="M384 120H414M406 112l8 8-8 8" stroke={C.light} />
      <g transform="translate(428 72)">
        <rect width="100" height="96" rx="22" fill={C.card} stroke={C.edge} />
        <rect x="16" y="18" width="30" height="6" rx="3" fill={C.brand} />
        <Bars cx={50} y={36} ws={[68, 74, 48]} h={7} gap={7} fill={C.cream} o={0.85} />
      </g>
      <g {...loop('pv-twinkle', 0, 6)}>
        <Spark x={580} y={52} r={9} />
      </g>
      <g {...loop('pv-twinkle', 2, 7)}>
        <Spark x={560} y={190} r={6} fill={C.gold} />
      </g>
    </Box>
  );
}

/** Pillar 2: a quiet table, a candle, a notebook, the phone on its lock-screen verse. */
function PrayerLife() {
  const u = useUid();
  return (
    <Box w={W} h={H}>
      <Glow id={`${u}g`} cx={190} cy={120} rx={200} ry={120} c={C.mist} o={0.3} />
      <g {...loop('pv-pulse', 0, 7)}>
        <Glow id={`${u}c`} cx={392} cy={142} rx={96} ry={96} c={C.peach} o={0.45} />
      </g>
      <Ground x1={70} x2={570} />
      <Phone id={`${u}p`} x={142} y={22} w={96} bg={T.indigo.bg}>
        {(d) => <LockScreen d={d} t={T.indigo} />}
      </Phone>
      {/* candle */}
      <rect x="378" y="156" width="28" height="63" rx="6" fill={C.cream} />
      <rect x="378" y="156" width="28" height="9" rx="4.5" fill={C.gold} opacity=".7" />
      <path d="M392 156v-8" stroke={C.dark} />
      <path d="M392 112q15 20 0 36q-15-16 0-36Z" fill={C.peach} {...loop('pv-flicker', 0, 6)} />
      <path d="M392 128q6 9 0 18q-6-9 0-18Z" fill={C.gold} />
      {/* notebook and pencil */}
      <g transform="translate(436 163)">
        <path d="M0 56V8Q0 2 6 2H66V56Z" fill={C.card} stroke={C.edge} />
        <path d="M132 56V8Q132 2 126 2H66V56Z" fill={C.card} stroke={C.edge} />
        <g fill={C.cream} opacity=".5">
          <rect x="12" y="14" width="44" height="5" rx="2.5" />
          <rect x="12" y="26" width="32" height="5" rx="2.5" />
          <rect x="78" y="14" width="40" height="5" rx="2.5" />
          <rect x="78" y="26" width="46" height="5" rx="2.5" />
          <rect x="78" y="38" width="28" height="5" rx="2.5" />
        </g>
        <path d="M104 -18l26 38" stroke={C.brand} strokeWidth="6" />
      </g>
      <g {...loop('pv-twinkle', 0, 6)}>
        <Spark x={310} y={50} r={8} fill={C.mist} />
      </g>
      <g {...loop('pv-twinkle', 2.4, 7)}>
        <Spark x={530} y={70} r={6} fill={C.gold} />
      </g>
    </Box>
  );
}

/** Pillar 3: a desk with the phone, a plain to-do list, a mug and a plant. */
function Productivity() {
  const u = useUid();
  return (
    <Box w={W} h={H}>
      <Glow id={`${u}g`} cx={190} cy={118} rx={210} ry={116} o={0.34} />
      <Ground x1={50} x2={590} />
      <g {...loop('pv-bob', 0, 8)}>
        <Phone id={`${u}p`} x={116} y={22} w={96} bg={T.sunrise.bg}>
          {(d) => <LockScreen d={d} t={T.sunrise} />}
        </Phone>
      </g>
      {/* to-do list: plain paper, no app UI */}
      <g transform="translate(262 40)">
        <rect width="150" height="179" rx="14" fill={C.card} stroke={C.edge} />
        <rect x="18" y="18" width="62" height="7" rx="3.5" fill={C.brand} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(0 ${46 + i * 31})`}>
            <rect x="18" y="0" width="16" height="16" rx="5" fill={i < 2 ? C.brand : 'none'} stroke={i < 2 ? C.brand : C.edge} />
            {i < 2 && <path d="M22 8l3 3 6-7" stroke={C.ink} strokeWidth="2.4" />}
            <rect x="44" y="5" width={[78, 64, 84, 52][i]} height="6" rx="3" fill={C.cream} opacity={i < 2 ? 0.35 : 0.6} />
          </g>
        ))}
      </g>
      {/* mug */}
      <g transform="translate(446 163)">
        <rect width="48" height="56" rx="11" fill={C.dark} />
        <path d="M48 12h5a9 9 0 0 1 0 24h-5" stroke={C.dark} strokeWidth="6" />
        <rect x="8" y="8" width="32" height="7" rx="3.5" fill={C.light} opacity=".5" />
      </g>
      {/* plant */}
      <g transform="translate(524 0)">
        <rect x="0" y="180" width="44" height="39" rx="8" fill={C.edge} />
        <g {...loop('pv-sway', 0, 8)}>
          <path d="M22 180V138" stroke={C.mist} />
          <path d="M22 160q-26-4-22-32q24 2 22 32Z" fill={C.mist} opacity=".85" />
          <path d="M22 148q24-2 24-30q-24 4-24 30Z" fill={C.light} opacity=".85" />
        </g>
      </g>
      <g {...loop('pv-twinkle', 1, 7)}>
        <Spark x={462} y={60} r={8} fill={C.gold} />
      </g>
    </Box>
  );
}

/** Pillar 4: the phone beside an open book with a highlighted line and a ribbon. */
function BibleStudy() {
  const u = useUid();
  return (
    <Box w={W} h={H}>
      <Glow id={`${u}g`} cx={340} cy={118} rx={240} ry={118} c={C.mist} o={0.28} />
      <Ground x1={60} x2={590} />
      <Phone id={`${u}p`} x={120} y={22} w={96} bg={T.navy.bg}>
        {(d) => <LockScreen d={d} t={T.navy} />}
      </Phone>
      {/* open book */}
      <g transform="translate(256 84)">
        <path d="M0 135V10Q0 4 6 4H138V135Z" fill={C.card} stroke={C.edge} />
        <path d="M276 135V10Q276 4 270 4H138V135Z" fill={C.card} stroke={C.edge} />
        <g fill={C.cream} opacity=".5">
          {[24, 40, 56, 72, 88].map((y, i) => (
            <g key={y}>
              <rect x="20" y={y} width={[96, 88, 98, 80, 92][i]} height="6" rx="3" />
              <rect x="158" y={y} width={[88, 92, 76, 90, 82][i]} height="6" rx="3" />
            </g>
          ))}
        </g>
        <g {...loop('pv-pulse', 0, 7)}>
          <rect x="14" y="36" width="108" height="14" rx="5" fill={C.gold} opacity=".4" />
        </g>
        <path d="M252 4v144l9-8 9 8V4" fill={C.rose} stroke="none" />
      </g>
      <g {...loop('pv-twinkle', 0, 6)}>
        <Spark x={254} y={50} r={8} />
      </g>
      <g {...loop('pv-twinkle', 2, 7)}>
        <Spark x={580} y={70} r={6} fill={C.gold} />
      </g>
    </Box>
  );
}

/** A generic app screen: stands for "another app", no logo, no name. */
function App({ sw, tiles }: { sw: number; tiles?: boolean }) {
  return (
    <>
      <Bars cx={sw * 0.36} y={n(sw * 0.3)} ws={[n(sw * 0.44)]} h={n(sw * 0.07)} fill="#C9D0E6" o={0.7} />
      {tiles
        ? [0, 1, 2, 3].map((i) => (
            <rect key={i} x={n(sw * (0.09 + (i % 2) * 0.43))} y={n(sw * (0.5 + Math.floor(i / 2) * 0.5))} width={n(sw * 0.39)} height={n(sw * 0.42)} rx={n(sw * 0.08)} fill="#FFFFFF" fillOpacity=".09" />
          ))
        : [0, 1, 2].map((i) => {
            const y = n(sw * 0.5 + i * sw * 0.46);
            return (
              <g key={i}>
                <rect x={n(sw * 0.09)} y={y} width={n(sw * 0.82)} height={n(sw * 0.36)} rx={n(sw * 0.08)} fill="#FFFFFF" fillOpacity=".09" />
                <circle cx={n(sw * 0.22)} cy={n(y + sw * 0.18)} r={n(sw * 0.075)} fill="#8A8FB8" />
                <rect x={n(sw * 0.36)} y={n(y + sw * 0.1)} width={n(sw * 0.42)} height={n(sw * 0.05)} rx={n(sw * 0.025)} fill="#C9D0E6" opacity=".6" />
              </g>
            );
          })}
    </>
  );
}

/** Pillar 5: three phones side by side, the FaithWall lock screen in the middle. */
function Comparisons() {
  const u = useUid();
  return (
    <Box w={W} h={H}>
      <g {...loop('pv-pulse', 0, 8)}>
        <Glow id={`${u}g`} cx={320} cy={120} rx={200} ry={120} o={0.45} />
      </g>
      <Ground x1={70} x2={570} />
      <Phone id={`${u}a`} x={134} y={44} w={88} bg={T.dusk.bg} lite>
        {(d) => <App sw={d.sw} />}
      </Phone>
      <g {...loop('pv-bob', 0, 8)}>
        <Phone id={`${u}b`} x={268} y={22} w={104} bg={T.ember.bg}>
          {(d) => <LockScreen d={d} t={T.ember} />}
        </Phone>
      </g>
      <Phone id={`${u}c`} x={418} y={44} w={88} bg={T.dusk.bg} lite>
        {(d) => <App sw={d.sw} tiles />}
      </Phone>
      <g {...loop('pv-twinkle', 0, 6)}>
        <Spark x={246} y={40} r={8} />
      </g>
      <g {...loop('pv-twinkle', 2, 7)}>
        <Spark x={398} y={34} r={6} fill={C.gold} />
      </g>
    </Box>
  );
}

const SCENES: Record<BlogCluster, () => ReactNode> = {
  'daily-scripture-lock-screen': DailyScripture,
  'prayer-life-iphone': PrayerLife,
  'faith-based-productivity': Productivity,
  'bible-study-tools-ios': BibleStudy,
  'christian-app-comparisons': Comparisons,
};

export default function PillarHeaderVisual({ cluster }: { cluster: BlogCluster }) {
  const Scene = SCENES[cluster];
  if (!Scene) return null;
  return (
    <Live className="pv-head">
      <Scene />
    </Live>
  );
}
