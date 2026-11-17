import { useEffect, useState, type CSSProperties } from 'react';
import { SHOWCASE_VERSES, type ShowcaseVerse } from '../../data/showcaseVerses';
import DeviceMockup from '../DeviceMockup';
import AppLockScreen from '../showcase/AppLockScreen';
import FaithWallWidget from '../showcase/FaithWallWidget';
import { AppTile, Dock, SearchPill, TILES } from '../showcase/HomeScreen';
import Wallpaper, { type WallpaperVariant } from '../showcase/Wallpaper';
import { SYSTEM_FONT, useLockDate, usePageVisible, usePrefersReducedMotion } from '../showcase/utils';
import { useInView } from './useInView';

/* T1: three app-look Lock Screens, each on one of the app's gradient presets, cropped by the tile's bottom edge. */
const LOCKS: { wallpaper: WallpaperVariant; verse: number; className: string }[] = [
  { wallpaper: 'midnight-blue', verse: 1, className: 'z-0 mt-10 sm:mt-12' },
  { wallpaper: 'faithwall', verse: 2, className: 'relative z-10 -mx-[3%] mt-4 sm:mx-0' },
  { wallpaper: 'forest-green', verse: 3, className: 'z-0 mt-10 sm:mt-12' },
];

export function LockScreensArt() {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex items-start justify-center px-[2%] sm:gap-[3%]">
      {LOCKS.map((l) => (
        <div key={l.wallpaper} className={`w-[35%] max-w-[240px] sm:w-[30%] ${l.className}`}>
          <AppLockScreen verse={SHOWCASE_VERSES[l.verse]} wallpaper={l.wallpaper} />
        </div>
      ))}
    </div>
  );
}

/* T2: the small Home Screen widget and the Lock Screen rectangular widget, each on a real framed phone cropped by the
   tile's bottom edge. Starts with the user's verse (0), then the next verses, only while the tile is on screen, the tab
   is visible and motion is allowed. */
const WIDGET_LOOP_MS = 4500;

/** A Home Screen with the small widget (2 x 2 cells) and its neighbouring app tiles. Fills a DeviceMockup screen. */
function SmallWidgetHome({ verse }: { verse: ShowcaseVerse }) {
  return (
    <div className="absolute inset-0 overflow-hidden text-white" style={{ fontFamily: SYSTEM_FONT, borderRadius: 'inherit' }}>
      <div className="absolute" style={{ inset: '-6cqw', filter: 'blur(1.4cqw) saturate(1.05)' }}>
        <Wallpaper variant="dawn" />
      </div>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
      <div
        className="absolute grid grid-cols-4"
        style={{ top: '19cqw', left: '6.5cqw', right: '6.5cqw', rowGap: '5.2cqw', justifyItems: 'center' }}
      >
        <div className="flex flex-col items-center" style={{ gridColumn: '1 / span 2', gridRow: '1 / span 2', alignSelf: 'start' }}>
          <FaithWallWidget size="small" verse={verse} />
          <span style={{ marginTop: '1.8cqw', fontSize: '2.9cqw', lineHeight: 1, color: '#fff', textShadow: '0 0.2cqw 0.9cqw rgba(0,0,0,0.55)' }}>
            FaithWall
          </span>
        </div>
        {TILES.slice(0, 8).map((t) => (
          <AppTile key={t.label} tile={t} />
        ))}
      </div>
      <SearchPill />
      <Dock />
    </div>
  );
}

export function WidgetsArt() {
  const reduced = usePrefersReducedMotion();
  const visible = usePageVisible();
  const { ref, inView } = useInView<HTMLDivElement>();
  const [index, setIndex] = useState(0);
  const running = inView && visible && !reduced;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SHOWCASE_VERSES.length), WIDGET_LOOP_MS);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (reduced) setIndex(0);
  }, [reduced]);

  const verse = SHOWCASE_VERSES[index];
  const date = useLockDate();
  const caption = 'mb-2 block text-center text-[11px] leading-none text-white/60 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]';

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 flex items-start justify-center px-3 pt-4 sm:px-4">
      <div className="flex w-full max-w-[420px] items-start justify-center gap-[3%]">
        {/* Home Screen: small widget, app name under it */}
        <div className="w-[48%]">
          <span className={caption}>Home Screen</span>
          <DeviceMockup device="iphone" width={1290} height={2796} showUi uiTone="light" dateLabel="" variant="showcase" ui="home">
            <SmallWidgetHome verse={verse} />
          </DeviceMockup>
        </div>
        {/* Lock Screen: the clock, the accessory-rectangular widget under it */}
        <div className="w-[48%]">
          <span className={caption}>Lock Screen</span>
          <DeviceMockup device="iphone" width={1290} height={2796} showUi uiTone="light" dateLabel={date} variant="showcase">
            <Wallpaper variant="dawn" />
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.14)' }} />
            <div className="absolute inset-x-0 flex justify-center text-white" style={{ top: '57cqw', fontFamily: SYSTEM_FONT }}>
              <FaithWallWidget size="rectangular" verse={verse} />
            </div>
          </DeviceMockup>
        </div>
      </div>
    </div>
  );
}

/* T3: a real framed iPhone Lock Screen with one notification under the clock, cropped by the tile's bottom edge.
   The title and body are the app's own reminder copy. */
export function ReminderArt() {
  const date = useLockDate();
  return (
    <div aria-hidden="true" className="absolute inset-0 flex justify-center px-4 pt-4 sm:px-6">
      <div className="w-[66%] max-w-[250px]">
        <DeviceMockup device="iphone" width={1290} height={2796} showUi uiTone="light" dateLabel={date} variant="showcase">
          <Wallpaper variant="hills" />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
          <div
            className="fw-bdf absolute flex text-white"
            style={{
              left: '4cqw',
              right: '4cqw',
              top: '54cqw',
              gap: '3.4cqw',
              padding: '3.4cqw',
              borderRadius: '6cqw',
              fontFamily: SYSTEM_FONT,
              background: 'rgba(70,70,76,0.62)',
              boxShadow: '0 2cqw 6cqw -1cqw rgba(0,0,0,0.5), inset 0 0.25cqw 0 rgba(255,255,255,0.12)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
            }}
          >
            <img
              src="/icon-app-180.png"
              alt=""
              width={180}
              height={180}
              loading="lazy"
              decoding="async"
              style={{ width: '11cqw', height: '11cqw', borderRadius: '2.6cqw', flex: 'none' }}
            />
            <div className="min-w-0 flex-1" style={{ lineHeight: 1.25 }}>
              <div className="flex items-baseline justify-between" style={{ gap: '2cqw', fontSize: '3.2cqw', color: 'rgba(255,255,255,0.6)' }}>
                <span style={{ fontWeight: 600 }}>FaithWall</span>
                <span>now</span>
              </div>
              <p style={{ margin: 0, marginTop: '0.6cqw', fontSize: '4cqw', fontWeight: 600 }}>Quick moment of peace 🕊️</p>
              <p style={{ margin: 0, fontSize: '4cqw', color: 'rgba(255,255,255,0.88)' }}>Your daily verse is ready. Breathe and read.</p>
            </div>
          </div>
        </DeviceMockup>
      </div>
    </div>
  );
}

/* T4: a fan of three real framed phones (AppLockScreen) on the original SVG scenes, cropped by the tile's bottom edge. */
const FAN: { scene: WallpaperVariant; verse: number; style: CSSProperties }[] = [
  { scene: 'hills', verse: 3, style: { left: '6%', top: '16%', transform: 'rotate(-9deg)', zIndex: 1 } },
  { scene: 'night', verse: 4, style: { right: '6%', top: '16%', transform: 'rotate(9deg)', zIndex: 1 } },
  { scene: 'dawn', verse: 0, style: { left: '50%', top: '7%', transform: 'translateX(-50%)', zIndex: 2 } },
];

export function WallpapersArt() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      {FAN.map((c) => (
        <div key={c.scene} className="absolute w-[34%] max-w-[150px]" style={c.style}>
          <AppLockScreen verse={SHOWCASE_VERSES[c.verse]} wallpaper={c.scene} />
        </div>
      ))}
    </div>
  );
}
