import { useId } from 'react';

/**
 * Wallpapers for the homepage mockups. Original CSS/SVG only, never the app's photo images.
 *  - APP_PRESETS: the app's own gradient presets (vertical, top to bottom) plus its solids.
 *  - Three cinematic SVG scenes: 'dawn', 'hills', 'night'. Each is light (a few paths, no filters) and keeps its
 *    upper-middle calm and dark enough for white Lock Screen text.
 */

export interface AppPreset {
  id: string;
  name: string;
  from: string;
  to: string;
}

export const APP_PRESETS: AppPreset[] = [
  { id: 'ocean-blue', name: 'Ocean Blue', from: '#2E8CFF', to: '#00C2FF' },
  { id: 'sunset-orange', name: 'Sunset Orange', from: '#FF7D45', to: '#FF3D78' },
  { id: 'forest-green', name: 'Forest Green', from: '#2EBF70', to: '#1A7A61' },
  { id: 'lavender-purple', name: 'Lavender Purple', from: '#A67AFF', to: '#6B4AD9' },
  { id: 'rose-gold', name: 'Rose Gold', from: '#F7A8A1', to: '#E8B57D' },
  { id: 'midnight-blue', name: 'Midnight Blue', from: '#3B4FA1', to: '#121742' },
  { id: 'peach-cream', name: 'Peach Cream', from: '#FFC2A1', to: '#FFE8C7' },
  { id: 'mint-green', name: 'Mint Green', from: '#63E6BF', to: '#2EC7C2' },
  { id: 'coral-pink', name: 'Coral Pink', from: '#FF6B6B', to: '#FF9473' },
  { id: 'sky-blue', name: 'Sky Blue', from: '#6EC2FF', to: '#8AA3FF' },
  { id: 'warm-autumn', name: 'Warm Autumn', from: '#F0A14A', to: '#C74A2E' },
  { id: 'faithwall', name: 'FaithWall', from: '#E8662E', to: '#FFC95C' },
];

export const APP_SOLIDS: { id: string; name: string; color: string }[] = [
  { id: 'black', name: 'Default Black', color: '#000000' },
  { id: 'white', name: 'White', color: '#FFFFFF' },
  { id: 'gray', name: 'Gray', color: '#282828' },
];

/** The app's text colours (the verse colour picker). */
export const APP_TEXT_COLORS: { id: string; name: string; color: string }[] = [
  { id: 'white', name: 'White', color: '#FFFFFF' },
  { id: 'black', name: 'Black', color: '#1A1A1A' },
  { id: 'gold', name: 'Gold', color: '#FFD600' },
  { id: 'sky', name: 'Sky', color: '#66B3FF' },
  { id: 'rose', name: 'Rose', color: '#FF99B3' },
];

export const WALLPAPER_SCENES = ['dawn', 'hills', 'night'] as const;
export type WallpaperScene = (typeof WALLPAPER_SCENES)[number];
/** A scene name, an APP_PRESETS id or an APP_SOLIDS id. */
export type WallpaperVariant = WallpaperScene | (string & {});

// Deterministic star field (same on server and client, so hydration matches).
function makeStars(seed: number, count: number, maxY: number) {
  let s = seed;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    x: Math.round(rand() * 3900) / 10,
    y: Math.round(rand() * maxY * 10) / 10,
    r: Math.round((0.35 + rand() * 0.8) * 100) / 100,
    o: Math.round((0.25 + rand() * 0.6) * 100) / 100,
  }));
}

const NIGHT_STARS = makeStars(41, 46, 560);

const SVG_PROPS = {
  viewBox: '0 0 390 844',
  preserveAspectRatio: 'xMidYMid slice',
  className: 'absolute inset-0 h-full w-full',
  'aria-hidden': true,
  focusable: false,
} as const;

/** Purple-to-orange sky over a calm sea, sun glow on the horizon. Upper-middle stays deep violet. */
function Dawn({ id }: { id: string }) {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#140d38" />
          <stop offset="0.3" stopColor="#2a1a5c" />
          <stop offset="0.5" stopColor="#52287e" />
          <stop offset="0.6" stopColor="#8e3c84" />
          <stop offset="0.67" stopColor="#d4606a" />
          <stop offset="0.71" stopColor="#ff9a58" />
          <stop offset="0.74" stopColor="#ffc27a" />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx="195" cy="618" r="260" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffd08a" stopOpacity="0.85" />
          <stop offset="0.35" stopColor="#ff9a58" stopOpacity="0.38" />
          <stop offset="1" stopColor="#ff9a58" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8606e" />
          <stop offset="0.12" stopColor="#7a3a82" />
          <stop offset="0.45" stopColor="#2c1e5e" />
          <stop offset="1" stopColor="#120d33" />
        </linearGradient>
        <linearGradient id={`${id}refl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd08a" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffd08a" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}clip`}>
          <rect x="0" y="0" width="390" height="624" />
        </clipPath>
      </defs>
      <rect width="390" height="844" fill={`url(#${id}sky)`} />
      <rect width="390" height="844" fill={`url(#${id}glow)`} />
      <g clipPath={`url(#${id}clip)`}>
        <circle cx="195" cy="624" r="30" fill="#ffe2a8" opacity="0.95" />
      </g>
      {/* thin cloud streaks */}
      <g fill="#ffb27a" opacity="0.28">
        <rect x="40" y="566" width="120" height="3" rx="1.5" />
        <rect x="236" y="548" width="96" height="3" rx="1.5" />
        <rect x="92" y="586" width="70" height="2.5" rx="1.25" />
      </g>
      <rect x="0" y="624" width="390" height="220" fill={`url(#${id}sea)`} />
      <path d="M195 624 L150 844 L240 844 Z" fill={`url(#${id}refl)`} opacity="0.55" />
      <g fill="#ffd9a0">
        <rect x="170" y="636" width="50" height="2" rx="1" opacity="0.7" />
        <rect x="158" y="654" width="74" height="2" rx="1" opacity="0.5" />
        <rect x="178" y="674" width="36" height="2" rx="1" opacity="0.45" />
        <rect x="150" y="698" width="92" height="2" rx="1" opacity="0.32" />
        <rect x="172" y="728" width="50" height="2" rx="1" opacity="0.25" />
      </g>
    </svg>
  );
}

/** A path winding into hills at sunrise. Cool blue sky above, warm light low on the horizon. */
function Hills({ id }: { id: string }) {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#101c52" />
          <stop offset="0.3" stopColor="#1f3678" />
          <stop offset="0.48" stopColor="#4b4f9a" />
          <stop offset="0.58" stopColor="#9a6aa6" />
          <stop offset="0.66" stopColor="#e5898a" />
          <stop offset="0.72" stopColor="#ffbd7c" />
        </linearGradient>
        <radialGradient id={`${id}sun`} cx="262" cy="600" r="230" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff0c2" stopOpacity="0.9" />
          <stop offset="0.3" stopColor="#ffc27a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffc27a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}far`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a6aa0" />
          <stop offset="1" stopColor="#5a4a8a" />
        </linearGradient>
        <linearGradient id={`${id}mid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4e4a86" />
          <stop offset="1" stopColor="#2c2c63" />
        </linearGradient>
        <linearGradient id={`${id}near`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#25295c" />
          <stop offset="1" stopColor="#10123a" />
        </linearGradient>
        <linearGradient id={`${id}path`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f0a070" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect width="390" height="844" fill={`url(#${id}sky)`} />
      <rect width="390" height="844" fill={`url(#${id}sun)`} />
      <circle cx="262" cy="604" r="20" fill="#fff0c2" opacity="0.9" />
      {/* far, mid and near hills */}
      <path d="M0 628 C50 604 96 612 150 600 C206 588 250 616 300 604 C340 596 368 606 390 600 L390 844 L0 844 Z" fill={`url(#${id}far)`} />
      <path d="M0 668 C60 640 110 660 170 640 C230 620 300 660 390 636 L390 844 L0 844 Z" fill={`url(#${id}mid)`} />
      {/* winding path, narrowing into the distance */}
      <path
        d="M188 654 C196 664 204 676 176 696 C140 722 120 744 168 770 C230 802 250 824 262 844 L56 844 C84 818 104 796 80 774 C52 750 90 724 138 702 C170 686 178 670 182 654 Z"
        fill={`url(#${id}path)`}
        opacity="0.75"
      />
      <path d="M0 744 C70 720 130 744 200 732 C270 720 330 748 390 728 L390 844 L0 844 Z" fill={`url(#${id}near)`} opacity="0.55" />
      {/* a few fence posts */}
      <g fill="#10123a" opacity="0.85">
        <rect x="292" y="736" width="2.4" height="14" />
        <rect x="318" y="732" width="2.4" height="16" />
        <rect x="344" y="728" width="2.4" height="18" />
      </g>
    </svg>
  );
}

/** Deep navy with a few deterministic stars and a faint glow low on the horizon. */
function Night({ id }: { id: string }) {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050a22" />
          <stop offset="0.5" stopColor="#0b1840" />
          <stop offset="0.85" stopColor="#14295e" />
          <stop offset="1" stopColor="#1c3a78" />
        </linearGradient>
        <radialGradient id={`${id}hor`} cx="195" cy="800" r="320" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4d6fc0" stopOpacity="0.42" />
          <stop offset="1" stopColor="#4d6fc0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="390" height="844" fill={`url(#${id}sky)`} />
      <rect width="390" height="844" fill={`url(#${id}hor)`} />
      {NIGHT_STARS.map((st, i) => (
        <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#fff" opacity={st.o} />
      ))}
      <path d="M0 790 C60 770 110 786 170 772 C240 756 300 784 390 764 L390 844 L0 844 Z" fill="#050a22" opacity="0.9" />
    </svg>
  );
}

export interface WallpaperProps {
  variant?: WallpaperVariant;
  className?: string;
}

/** Fills its (positioned) parent. Scenes are SVG; presets and solids are CSS gradients/colours. */
export default function Wallpaper({ variant = 'dawn', className = '' }: WallpaperProps) {
  const id = useId().replace(/:/g, '');
  if (variant === 'dawn') return <div className={`absolute inset-0 ${className}`}><Dawn id={id} /></div>;
  if (variant === 'hills') return <div className={`absolute inset-0 ${className}`}><Hills id={id} /></div>;
  if (variant === 'night') return <div className={`absolute inset-0 ${className}`}><Night id={id} /></div>;

  const preset = APP_PRESETS.find((p) => p.id === variant);
  const solid = APP_SOLIDS.find((p) => p.id === variant);
  const background = preset
    ? `linear-gradient(180deg, ${preset.from}, ${preset.to})`
    : solid?.color ?? '#000';
  return <div aria-hidden="true" className={`absolute inset-0 ${className}`} style={{ background }} />;
}
