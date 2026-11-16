import { useEffect, useState, type CSSProperties } from 'react';
import { SHOWCASE_VERSES } from '../../data/showcaseVerses';
import { AppLockVerse } from '../LockScreenVerse';
import AppLockScreen from '../showcase/AppLockScreen';
import FaithWallWidget from '../showcase/FaithWallWidget';
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

/* T2: the small Home Screen widget and the Lock Screen rectangular widget. Starts with the user's verse (0), then the
   next verses, only while the tile is on screen, the tab is visible and motion is allowed. */
const WIDGET_LOOP_MS = 4500;

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
  const caption = { fontSize: '3cqw', color: 'rgba(255,255,255,0.62)', textShadow: '0 0.2cqw 0.8cqw rgba(0,0,0,0.5)' } as const;

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 flex justify-center px-4 pt-6 sm:px-6">
      <div
        className="relative h-full w-full max-w-[380px] overflow-hidden rounded-t-[7cqw] border border-b-0 border-white/10 text-white"
        style={{ containerType: 'inline-size', fontFamily: SYSTEM_FONT }}
      >
        <div className="absolute" style={{ inset: '-6cqw', filter: 'blur(1.4cqw) saturate(1.05)' }}>
          <Wallpaper variant="dawn" />
        </div>
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
        <div className="absolute inset-x-0 flex items-stretch justify-center" style={{ top: '6cqw', gap: '5cqw', paddingInline: '3.4cqw' }}>
          {/* Home Screen: small widget, app name under it */}
          <div className="flex flex-col items-center" style={{ marginTop: '9cqw' }}>
            <FaithWallWidget size="small" verse={verse} />
            <span style={{ marginTop: '1.8cqw', fontSize: '2.9cqw', lineHeight: 1, color: 'rgba(255,255,255,0.9)', textShadow: '0 0.2cqw 0.8cqw rgba(0,0,0,0.5)' }}>
              FaithWall
            </span>
            <span style={{ ...caption, marginTop: 'auto', paddingTop: '4cqw' }}>Home Screen</span>
          </div>
          {/* Lock Screen: a tiny clock, the accessory-rectangular widget under it */}
          <div className="flex flex-col items-center">
            <span style={{ fontSize: '3cqw', fontWeight: 600, opacity: 0.85 }}>{date}</span>
            <span style={{ fontSize: '15cqw', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', opacity: 0.9, fontVariantNumeric: 'tabular-nums' }}>
              9:41
            </span>
            <div style={{ marginTop: '4cqw' }}>
              <FaithWallWidget size="rectangular" verse={verse} />
            </div>
            <span style={{ ...caption, marginTop: 'auto', paddingTop: '4cqw' }}>Lock Screen</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* T3: one notification banner over a dimmed, blurred wallpaper. The title and body are the app's own reminder copy. */
export function ReminderArt() {
  const date = useLockDate();
  return (
    <div aria-hidden="true" className="absolute inset-0 flex justify-center px-4 pt-6 sm:px-6">
      <div
        className="relative h-full w-full max-w-[380px] overflow-hidden rounded-t-[7cqw] border border-b-0 border-white/10 text-white"
        style={{ containerType: 'inline-size', fontFamily: SYSTEM_FONT }}
      >
        <div className="absolute" style={{ inset: '-6cqw', filter: 'blur(1.6cqw) saturate(1.05)' }}>
          <Wallpaper variant="hills" />
        </div>
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.42)' }} />
        <div className="absolute inset-x-0 text-center" style={{ top: '7cqw' }}>
          <p style={{ margin: 0, fontSize: '3.4cqw', fontWeight: 600, opacity: 0.8 }}>{date}</p>
          <p style={{ margin: 0, fontSize: '17cqw', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', opacity: 0.92, fontVariantNumeric: 'tabular-nums' }}>
            9:41
          </p>
        </div>
        <div
          className="absolute flex"
          style={{
            left: '4cqw',
            right: '4cqw',
            top: '34cqw',
            gap: '3.4cqw',
            padding: '3.4cqw',
            borderRadius: '6cqw',
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
      </div>
    </div>
  );
}

/* T4: a fan of three phone-shaped cards on the original SVG scenes, each with a small time and a short verse block. */
const FAN: { scene: WallpaperVariant; verse: number; style: CSSProperties }[] = [
  { scene: 'hills', verse: 3, style: { left: '6%', top: '16%', transform: 'rotate(-9deg)', zIndex: 1 } },
  { scene: 'night', verse: 4, style: { right: '6%', top: '16%', transform: 'rotate(9deg)', zIndex: 1 } },
  { scene: 'dawn', verse: 0, style: { left: '50%', top: '7%', transform: 'translateX(-50%)', zIndex: 2 } },
];

export function WallpapersArt() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      {FAN.map((c) => {
        const v = SHOWCASE_VERSES[c.verse];
        return (
          <div
            key={c.scene}
            className="absolute w-[34%] max-w-[150px] overflow-hidden rounded-[1.6rem] border border-white/15 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]"
            style={{ aspectRatio: '9 / 19', containerType: 'inline-size', fontFamily: SYSTEM_FONT, ...c.style }}
          >
            <Wallpaper variant={c.scene} />
            <p
              className="absolute inset-x-0 m-0 text-center text-white"
              style={{ top: '9cqw', fontSize: '26cqw', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', opacity: 0.9, textShadow: '0 0.3cqw 2cqw rgba(0,0,0,0.35)' }}
            >
              9:41
            </p>
            <AppLockVerse text={v.text} reference={v.reference} size={7.2} />
          </div>
        );
      })}
    </div>
  );
}
