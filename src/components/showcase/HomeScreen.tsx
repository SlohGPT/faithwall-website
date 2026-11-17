import type { CSSProperties, ReactNode } from 'react';
import {
  BookOpen,
  Calendar,
  Camera,
  Compass,
  Folder,
  Heart,
  Mail,
  MessageCircle,
  Music,
  Navigation,
  Phone,
  Search,
  Settings,
} from 'lucide-react';
import DeviceMockup from '../DeviceMockup';
import type { ShowcaseVerse } from '../../data/showcaseVerses';
import FaithWallWidget from './FaithWallWidget';
import Wallpaper, { type WallpaperVariant } from './Wallpaper';
import { SYSTEM_FONT } from './utils';

/**
 * A Home Screen: blurred, dimmed wallpaper, the medium FaithWall widget (with the app name under it, as iOS shows it),
 * a 4-column grid of app tiles in iOS colours (lucide glyphs and CSS only, no Apple artwork, no brand logos; one tile
 * is the real FaithWall icon), the iOS "Search" pill and a frosted dock. `HomeScreen` is the screen content;
 * `HomeScreenPhone` wraps it in a DeviceMockup with the status bar.
 */

type Tile = { label: string; background: string; glyph: ReactNode };

const GLYPH = '7.8cqw';
const g = (extra?: CSSProperties): CSSProperties => ({ width: GLYPH, height: GLYPH, ...extra });
const grad = (from: string, to: string) => `linear-gradient(180deg, ${from}, ${to})`;
const WHITE = '#fff';
const GREEN = grad('#65E06F', '#1DB532');

/** Photos: eight rounded petals, one colour each, multiplied over the white tile like the real flower. */
const PETALS = ['#FF9F0A', '#FFD60A', '#6CD94A', '#2FD1B7', '#2F8BFF', '#8E5CF0', '#FF5FA2', '#FF453A'];
function PhotosGlyph() {
  return (
    <svg viewBox="0 0 100 100" style={g({ width: '9.4cqw', height: '9.4cqw' })} aria-hidden="true">
      {PETALS.map((c, i) => (
        <ellipse
          key={c}
          cx="50"
          cy="29"
          rx="12"
          ry="20"
          fill={c}
          opacity="0.92"
          transform={`rotate(${i * 45} 50 50)`}
          style={{ mixBlendMode: 'multiply' }}
        />
      ))}
    </svg>
  );
}

/** Weather: a yellow sun peeking out behind a white cloud. */
function WeatherGlyph() {
  return (
    <svg viewBox="0 0 100 100" style={g({ width: '10cqw', height: '10cqw' })} aria-hidden="true">
      <circle cx="36" cy="38" r="17" fill="#FFD43B" />
      <path
        d="M30 78a15 15 0 0 1 1.5-29.9A21 21 0 0 1 72 52a13 13 0 0 1-1 26z"
        fill="#fff"
        stroke="#fff"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Clock: a white face with black ticks and hands. */
function ClockGlyph() {
  return (
    <svg viewBox="0 0 100 100" style={g({ width: '10.6cqw', height: '10.6cqw' })} aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="#fff" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="50" y1="8.5" x2="50" y2={i % 3 === 0 ? 15.5 : 13} stroke="#1c1c1e" strokeWidth={i % 3 === 0 ? 3 : 2} strokeLinecap="round" transform={`rotate(${i * 30} 50 50)`} />
      ))}
      <line x1="50" y1="50" x2="50" y2="26" stroke="#1c1c1e" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="50" x2="68" y2="58" stroke="#1c1c1e" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="56" x2="50" y2="18" stroke="#FF9F0A" strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="50" r="3" fill="#FF9F0A" />
    </svg>
  );
}

// iOS-style tiles (glyph colours and gradients as the brief), brand-free.
const TILES: Tile[] = [
  { label: 'Calendar', background: WHITE, glyph: <Calendar style={g()} color="#FF3B30" strokeWidth={1.9} aria-hidden="true" /> },
  { label: 'Photos', background: WHITE, glyph: <PhotosGlyph /> },
  { label: 'Weather', background: grad('#1F8BFF', '#69BCFF'), glyph: <WeatherGlyph /> },
  {
    label: 'Notes',
    background: `linear-gradient(180deg, #FFD60A 0, #FFD60A 27%, #fff 27%, #fff 100%)`,
    glyph: null,
  },
  { label: 'Clock', background: '#000', glyph: <ClockGlyph /> },
  { label: 'FaithWall', background: '#000', glyph: null }, // replaced by the real app icon
  { label: 'Maps', background: grad('#C2F2B0', '#8CDB82'), glyph: <Navigation style={g()} color="#0A84FF" fill="#0A84FF" strokeWidth={1.6} aria-hidden="true" /> },
  { label: 'Camera', background: grad('#E5E5EA', '#AEAEB2'), glyph: <Camera style={g()} color="#2c2c2e" strokeWidth={1.8} aria-hidden="true" /> },
  { label: 'Books', background: grad('#FFB340', '#FF9500'), glyph: <BookOpen style={g()} color="#fff" strokeWidth={1.9} aria-hidden="true" /> },
  { label: 'Music', background: grad('#FF5E7A', '#FA233B'), glyph: <Music style={g()} color="#fff" strokeWidth={2} aria-hidden="true" /> },
  { label: 'Files', background: WHITE, glyph: <Folder style={g()} color="#1E88F5" fill="#1E88F5" strokeWidth={1.6} aria-hidden="true" /> },
  { label: 'Mail', background: grad('#5AC8FA', '#1E7CF2'), glyph: <Mail style={g()} color="#fff" strokeWidth={1.9} aria-hidden="true" /> },
  { label: 'Health', background: WHITE, glyph: <Heart style={g()} color="#FF2D55" fill="#FF2D55" strokeWidth={1.6} aria-hidden="true" /> },
  { label: 'Settings', background: grad('#B4B4B9', '#6E6E73'), glyph: <Settings style={g()} color="#2c2c2e" strokeWidth={1.9} aria-hidden="true" /> },
  { label: 'Messages', background: GREEN, glyph: <MessageCircle style={g()} color="#fff" fill="#fff" strokeWidth={1.6} aria-hidden="true" /> },
  { label: 'Compass', background: '#000', glyph: <Compass style={g()} color="#fff" strokeWidth={1.8} aria-hidden="true" /> },
];

const DOCK: Tile[] = [
  { label: 'Phone', background: GREEN, glyph: <Phone style={g()} color="#fff" fill="#fff" strokeWidth={1.6} aria-hidden="true" /> },
  { label: 'Browser', background: WHITE, glyph: <Compass style={g()} color="#0A84FF" strokeWidth={1.9} aria-hidden="true" /> },
  { label: 'Messages', background: GREEN, glyph: <MessageCircle style={g()} color="#fff" fill="#fff" strokeWidth={1.6} aria-hidden="true" /> },
  { label: 'Music', background: grad('#FF5E7A', '#FA233B'), glyph: <Music style={g()} color="#fff" strokeWidth={2} aria-hidden="true" /> },
];

const TILE = '15.4cqw'; // 60 pt on a 390 pt screen
const TILE_RADIUS = '22.5%';
const LABEL_STYLE: CSSProperties = { fontSize: '2.9cqw', lineHeight: 1, color: '#fff', textShadow: '0 0.2cqw 0.9cqw rgba(0,0,0,0.55)', whiteSpace: 'nowrap' };

export function AppTile({ tile, label = true }: { tile: Tile; label?: boolean }) {
  const real = tile.label === 'FaithWall';
  return (
    <div className="flex flex-col items-center" style={{ gap: '1.5cqw' }}>
      <span
        className="relative grid place-items-center overflow-hidden"
        style={{
          width: TILE,
          height: TILE,
          borderRadius: TILE_RADIUS,
          background: tile.background,
          boxShadow: 'inset 0 0 0 0.12cqw rgba(0,0,0,0.07), 0 0.8cqw 1.8cqw -0.8cqw rgba(0,0,0,0.4)',
        }}
      >
        {real ? (
          <img src="/icon-app-180.png" alt="" width={180} height={180} className="block h-full w-full" decoding="async" />
        ) : (
          tile.glyph
        )}
      </span>
      {label && <span style={LABEL_STYLE}>{tile.label}</span>}
    </div>
  );
}

export { TILES };

/** The iOS 16+ "Search" pill that replaces the page dots, just above the dock. */
export function SearchPill({ bottom = '31.5cqw' }: { bottom?: string }) {
  return (
    <div className="absolute inset-x-0 flex justify-center" style={{ bottom }} aria-hidden="true">
      <span
        className="fw-bdf flex items-center"
        style={{
          gap: '1.2cqw',
          height: '6.8cqw',
          padding: '0 3.2cqw',
          borderRadius: '3.4cqw',
          background: 'rgba(255,255,255,0.22)',
          color: '#fff',
          fontSize: '3.3cqw',
          fontWeight: 500,
          lineHeight: 1,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <Search style={{ width: '3.3cqw', height: '3.3cqw' }} strokeWidth={2.4} aria-hidden="true" />
        Search
      </span>
    </div>
  );
}

/** The frosted-glass dock: 4 icons, no labels. */
export function Dock() {
  return (
    <div
      className="fw-bdf absolute flex items-center justify-around"
      style={{
        left: '4cqw',
        right: '4cqw',
        bottom: '4.4cqw',
        height: '23.5cqw',
        borderRadius: '8cqw',
        background: 'rgba(255,255,255,0.24)',
        boxShadow: 'inset 0 0 0 0.25cqw rgba(255,255,255,0.12)',
        backdropFilter: 'blur(18px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
      }}
      aria-hidden="true"
    >
      {DOCK.map((t) => (
        <AppTile key={t.label} tile={t} label={false} />
      ))}
    </div>
  );
}

export function HomeScreen({
  verse,
  wallpaper = 'dawn',
}: {
  verse: ShowcaseVerse;
  wallpaper?: WallpaperVariant;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden text-white" style={{ fontFamily: SYSTEM_FONT, borderRadius: 'inherit' }}>
      {/* the wallpaper, blurred and dimmed like a Home Screen */}
      <div className="absolute" style={{ inset: '-6cqw', filter: 'blur(1.6cqw) saturate(1.05)' }}>
        <Wallpaper variant={wallpaper} />
      </div>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.34)' }} aria-hidden="true" />

      {/* medium widget, app name under it */}
      <div className="absolute flex flex-col items-center" style={{ top: '18cqw', left: 0, right: 0 }}>
        <FaithWallWidget size="medium" verse={verse} />
        <span style={{ ...LABEL_STYLE, marginTop: '1.8cqw' }}>
          FaithWall
        </span>
      </div>

      {/* app grid: 4 columns, rows 3-6 (the widget takes rows 1-2) */}
      <div
        className="absolute grid grid-cols-4"
        style={{ top: '75cqw', left: '6.5cqw', right: '6.5cqw', rowGap: '5.2cqw', justifyItems: 'center' }}
        aria-hidden="true"
      >
        {TILES.map((t) => (
          <AppTile key={t.label} tile={t} />
        ))}
      </div>

      <SearchPill />

      <Dock />
    </div>
  );
}

/** Home Screen inside a phone: status bar with 9:41 and the home indicator come from DeviceMockup (ui="home"). */
export default function HomeScreenPhone({
  verse,
  wallpaper = 'dawn',
}: {
  verse: ShowcaseVerse;
  wallpaper?: WallpaperVariant;
}) {
  return (
    <DeviceMockup device="iphone" width={1290} height={2796} showUi uiTone="light" dateLabel="" variant="showcase" ui="home">
      <HomeScreen verse={verse} wallpaper={wallpaper} />
    </DeviceMockup>
  );
}
