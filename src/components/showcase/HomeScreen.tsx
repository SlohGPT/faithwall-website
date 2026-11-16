import {
  BookOpen,
  Calendar,
  Camera,
  Clock,
  Cloud,
  Compass,
  Folder,
  Heart,
  Mail,
  Map as MapIcon,
  MessageCircle,
  Music,
  Phone,
  Settings,
  StickyNote,
  Image as ImageIcon,
  type LucideIcon,
} from 'lucide-react';
import DeviceMockup from '../DeviceMockup';
import type { ShowcaseVerse } from '../../data/showcaseVerses';
import FaithWallWidget from './FaithWallWidget';
import Wallpaper, { type WallpaperVariant } from './Wallpaper';
import { SYSTEM_FONT } from './utils';

/**
 * A Home Screen: blurred, dimmed wallpaper, the medium FaithWall widget (with the app name under it, as iOS shows it),
 * a 4-column grid of generic app tiles (muted colours, simple glyphs, no brand logos; one tile is the real FaithWall
 * icon) and a dock. `HomeScreen` is the screen content; `HomeScreenPhone` wraps it in a DeviceMockup with the status bar.
 */

type Tile = { label: string; Icon: LucideIcon; from: string; to: string };

// Muted, brand-free tiles.
const TILES: Tile[] = [
  { label: 'Calendar', Icon: Calendar, from: '#8a93a8', to: '#5d667c' },
  { label: 'Photos', Icon: ImageIcon, from: '#a58f9c', to: '#7a6472' },
  { label: 'Weather', Icon: Cloud, from: '#7e9bb3', to: '#56738c' },
  { label: 'Notes', Icon: StickyNote, from: '#b3a37c', to: '#867755' },
  { label: 'Clock', Icon: Clock, from: '#7d7d86', to: '#55555e' },
  { label: 'FaithWall', Icon: Heart, from: '#000', to: '#000' }, // replaced by the real app icon
  { label: 'Maps', Icon: MapIcon, from: '#82a08a', to: '#58765f' },
  { label: 'Camera', Icon: Camera, from: '#8f8f98', to: '#62626b' },
  { label: 'Books', Icon: BookOpen, from: '#b08e74', to: '#845f48' },
  { label: 'Music', Icon: Music, from: '#a47f8e', to: '#794f5f' },
  { label: 'Files', Icon: Folder, from: '#7f93b3', to: '#566a8a' },
  { label: 'Mail', Icon: Mail, from: '#7a96ad', to: '#527089' },
  { label: 'Health', Icon: Heart, from: '#b0848a', to: '#835a61' },
  { label: 'Settings', Icon: Settings, from: '#8b8f96', to: '#5f636a' },
  { label: 'Messages', Icon: MessageCircle, from: '#86a38a', to: '#5b7a60' },
  { label: 'Compass', Icon: Compass, from: '#a09680', to: '#756c56' },
];

const DOCK: Tile[] = [
  { label: 'Phone', Icon: Phone, from: '#86a38a', to: '#5b7a60' },
  { label: 'Browser', Icon: Compass, from: '#7e9bb3', to: '#56738c' },
  { label: 'Messages', Icon: MessageCircle, from: '#8b8f96', to: '#5f636a' },
  { label: 'Music', Icon: Music, from: '#a47f8e', to: '#794f5f' },
];

const TILE = '15.4cqw'; // 60 pt on a 390 pt screen
const TILE_RADIUS = '3.6cqw';

function AppTile({ tile, label = true }: { tile: Tile; label?: boolean }) {
  const real = tile.label === 'FaithWall';
  return (
    <div className="flex flex-col items-center" style={{ gap: '1.5cqw' }}>
      <span
        className="relative grid place-items-center overflow-hidden"
        style={{
          width: TILE,
          height: TILE,
          borderRadius: TILE_RADIUS,
          background: real ? '#000' : `linear-gradient(150deg, ${tile.from}, ${tile.to})`,
          boxShadow: 'inset 0 0.3cqw 0 rgba(255,255,255,0.2), 0 1cqw 2cqw -0.6cqw rgba(0,0,0,0.4)',
        }}
      >
        {real ? (
          <img src="/icon-app-180.png" alt="" width={180} height={180} className="block h-full w-full" decoding="async" />
        ) : (
          <tile.Icon style={{ width: '7.4cqw', height: '7.4cqw', color: 'rgba(255,255,255,0.92)' }} strokeWidth={1.8} aria-hidden="true" />
        )}
      </span>
      {label && (
        <span style={{ fontSize: '2.9cqw', lineHeight: 1, color: 'rgba(255,255,255,0.9)', textShadow: '0 0.2cqw 0.8cqw rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
          {tile.label}
        </span>
      )}
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
    <div className="absolute inset-0 overflow-hidden text-white" style={{ fontFamily: SYSTEM_FONT }}>
      {/* the wallpaper, blurred and dimmed like a Home Screen */}
      <div className="absolute" style={{ inset: '-6cqw', filter: 'blur(1.6cqw) saturate(1.05)' }}>
        <Wallpaper variant={wallpaper} />
      </div>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.34)' }} aria-hidden="true" />

      {/* medium widget, app name under it */}
      <div className="absolute flex flex-col items-center" style={{ top: '18cqw', left: 0, right: 0 }}>
        <FaithWallWidget size="medium" verse={verse} />
        <span style={{ marginTop: '1.8cqw', fontSize: '2.9cqw', lineHeight: 1, color: 'rgba(255,255,255,0.9)', textShadow: '0 0.2cqw 0.8cqw rgba(0,0,0,0.5)' }}>
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

      {/* page dots */}
      <div className="absolute inset-x-0 flex justify-center" style={{ bottom: '31cqw', gap: '1.8cqw' }} aria-hidden="true">
        {[1, 0.4, 0.4].map((o, i) => (
          <span key={i} style={{ width: '1.7cqw', height: '1.7cqw', borderRadius: '50%', background: `rgba(255,255,255,${o})` }} />
        ))}
      </div>

      {/* dock */}
      <div
        className="absolute flex items-center justify-around"
        style={{
          left: '4cqw',
          right: '4cqw',
          bottom: '4.4cqw',
          height: '23.5cqw',
          borderRadius: '8cqw',
          background: 'rgba(255,255,255,0.16)',
          boxShadow: 'inset 0 0 0 0.25cqw rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
        aria-hidden="true"
      >
        {DOCK.map((t) => (
          <AppTile key={t.label} tile={t} label={false} />
        ))}
      </div>
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
