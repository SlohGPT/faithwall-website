import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Camera, Flashlight } from 'lucide-react';
import { PHONE_SAFE_BOTTOM, PHONE_SAFE_TOP } from '../lib/wallpaper';

/**
 * Pure CSS/SVG device frames for the wallpaper maker preview. No images are used.
 *
 * The screen is sized from the wallpaper's own width/height, so the canvas drawn inside is
 * never cropped or stretched: what you see is the exported image, just framed. Everything is
 * sized in container-query units (cqw), so the whole device scales with its parent width.
 *
 * The fake lock-screen UI sits on top of the canvas (preview only, never exported) and keeps
 * to the same zones wallpaper.ts reserves: the date and clock inside the top PHONE_SAFE_TOP,
 * the flashlight and camera buttons inside the bottom PHONE_SAFE_BOTTOM.
 */

export type DeviceKind = 'iphone' | 'android' | 'desktop';
export type UiTone = 'light' | 'dark';
/** 'maker' = the wallpaper maker's preview (default). 'showcase' = the homepage mockups: no verse guide line, system clock font, full date, iOS status bar, round corners, polished frame. */
export type MockupVariant = 'maker' | 'showcase';
/** 'lock' = status icons, date, clock, flashlight, camera, home indicator (default). 'home' = status bar with the time, home indicator. */
export type MockupUi = 'lock' | 'home';

interface DeviceMockupProps {
  device: DeviceKind;
  /** Wallpaper pixel size; the screen takes exactly this aspect ratio. */
  width: number;
  height: number;
  showUi: boolean;
  uiTone: UiTone;
  /** e.g. "Friday, October 2". Empty until the client knows the visitor's date. */
  dateLabel: string;
  /** Canvas (and prerender placeholder). Must fill the screen. */
  children: ReactNode;
  /** Extra props for the screen element (pointer handlers, className, aria). */
  screenProps?: HTMLAttributes<HTMLDivElement> & { 'data-testid'?: string };
  /** Applied to the screen element, e.g. cursor and touch-action while dragging a photo. */
  screenStyle?: CSSProperties;
  /** Optional, default 'maker' (today's markup). */
  variant?: MockupVariant;
  /** Optional, default 'lock' (today's markup). iPhone and Android only. */
  ui?: MockupUi;
}

const ROUNDED_FONT = 'ui-rounded, "SF Pro Rounded", "DM Sans", system-ui, -apple-system, sans-serif';
export const SYSTEM_FONT = "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif";
// The wallpaper maker keeps its squircle corners (Chrome 139+; other browsers ignore it). The homepage mockups
// (variant 'showcase') use plain circular corners: Chrome's squircle is far squarer than an iPhone's.
const squircle = { cornerShape: 'squircle' } as CSSProperties;

const MAKER_FRAME_SHADOW =
  'inset 0 0 0 0.18cqw rgba(255,255,255,0.22), inset 0 0.3cqw 0.6cqw rgba(255,255,255,0.12), 0 3cqw 6cqw rgba(0,0,0,0.55), 0 0 10cqw rgba(217,123,59,0.1)';
// Showcase: a crisp light hairline on the outer edge (a thin dark line where the band meets the bezel comes from the
// bezel's own shadow), a soft long drop shadow and the faint warm glow.
const SHOWCASE_FRAME_SHADOW = [
  'inset 0 0 0 0.22cqw rgba(255,255,255,0.62)',
  'inset 0 0.3cqw 0.6cqw rgba(255,255,255,0.14)',
  '0 0 0 0.1cqw rgba(0,0,0,0.5)',
  '0 4cqw 8cqw rgba(0,0,0,0.38)',
  '0 12cqw 20cqw -4cqw rgba(0,0,0,0.5)',
  '0 0 10cqw rgba(217,123,59,0.1)',
].join(', ');

const TITANIUM =
  'linear-gradient(145deg, #6b6b71 0%, #3a3a3f 22%, #1d1d21 50%, #2c2c31 78%, #55555b 100%)';
const GRAPHITE = 'linear-gradient(145deg, #4a4a50 0%, #26262a 35%, #17171a 70%, #3a3a3f 100%)';

function SideButton({
  side,
  top,
  height,
  width = 0.9,
  tone = 'titanium',
}: {
  side: 'left' | 'right';
  top: number;
  height: number;
  width?: number;
  tone?: 'titanium' | 'graphite';
}) {
  return (
    <span
      aria-hidden="true"
      className="absolute"
      style={{
        top: `${top}%`,
        height: `${height}%`,
        width: `${width}cqw`,
        [side]: `-${width * 0.75}cqw`,
        borderRadius: side === 'left' ? '0.5cqw 0 0 0.5cqw' : '0 0.5cqw 0.5cqw 0',
        background:
          side === 'left'
            ? `linear-gradient(90deg, #2a2a2e, ${tone === 'titanium' ? '#5a5a60' : '#4a4a50'})`
            : `linear-gradient(90deg, ${tone === 'titanium' ? '#5a5a60' : '#4a4a50'}, #2a2a2e)`,
        boxShadow: 'inset 0 0 0 0.12cqw rgba(255,255,255,0.12)',
      }}
    />
  );
}

// Dynamic Island geometry, in cqw of the screen width (see the island markup below).
const ISLAND_W = 31;
const ISLAND_TOP = 2.9;
const ISLAND_H = 9.2;
const ISLAND_CY = ISLAND_TOP + ISLAND_H / 2;
const ISLAND_SIDE = (100 - ISLAND_W) / 2; // the space between the screen edge and the island

/** Cellular bars, Wi-Fi (three arcs over a dot) and battery: the iOS status icons, in that order. */
function StatusIcons() {
  return (
    <>
      <svg viewBox="0 0 18 12" style={{ width: '4.6cqw', height: '3cqw', display: 'block' }} fill="currentColor">
        <rect x="0" y="8" width="3" height="4" rx="0.8" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
        <rect x="10" y="3" width="3" height="9" rx="0.8" />
        <rect x="15" y="0" width="3" height="12" rx="0.8" />
      </svg>
      <svg viewBox="0 0 17 12" style={{ width: '4.4cqw', height: '3.1cqw', display: 'block' }} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M5.89 7.5A3.9 3.9 0 0 1 11.11 7.5" />
        <path d="M4.15 5.57A6.5 6.5 0 0 1 12.85 5.57" />
        <path d="M2.41 3.64A9.1 9.1 0 0 1 14.59 3.64" />
        <circle cx="8.5" cy="10.4" r="1.15" fill="currentColor" stroke="none" />
      </svg>
      <svg viewBox="0 0 26 12" style={{ width: '7cqw', height: '3.2cqw', display: 'block' }} fill="none">
        <rect x="0.5" y="0.5" width="21" height="11" rx="3.4" stroke="currentColor" opacity="0.5" />
        <rect x="2" y="2" width="15" height="8" rx="2.2" fill="currentColor" />
        <path d="M23.2 4.2v3.6c0.9-0.3 1.5-1.1 1.5-1.8s-0.6-1.5-1.5-1.8z" fill="currentColor" opacity="0.5" />
      </svg>
    </>
  );
}

/**
 * The iOS status bar (showcase variant). Both groups sit on the Dynamic Island's centre line and are centred in the
 * space between the screen edge and the island, like iOS: the icons on the right, the time on the left (home UI only).
 */
function ShowcaseStatusBar({ ink, time }: { ink: string; time: boolean }) {
  const group = {
    position: 'absolute',
    top: `${ISLAND_CY}cqw`,
    width: `${ISLAND_SIDE}cqw`,
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: ink,
  } as const;
  return (
    <>
      {time && (
        <span
          style={{
            ...group,
            left: 0,
            fontFamily: SYSTEM_FONT,
            fontSize: '4.3cqw',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.01em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          9:41
        </span>
      )}
      <span style={{ ...group, right: 0, gap: '1.3cqw' }}>
        <StatusIcons />
      </span>
    </>
  );
}

/** iPhone 16 Pro Camera Control: flush with the right edge, below the side button, darker and sapphire-like. */
function CameraControl() {
  return (
    <span
      aria-hidden="true"
      className="absolute"
      style={{
        top: '58%',
        height: '7%',
        width: '0.7cqw',
        right: '-0.45cqw',
        borderRadius: '0 0.4cqw 0.4cqw 0',
        background: 'linear-gradient(90deg, #14161d, #2b3446 45%, #0c0e14)',
        boxShadow: 'inset 0 0 0 0.1cqw rgba(150,175,220,0.32), 0 0 0 0.08cqw rgba(0,0,0,0.5)',
      }}
    />
  );
}

/** Time, date, flashlight, camera and home indicator, placed in the wallpaper's safe zones. */
function PhoneLockUi({
  kind,
  tone,
  dateLabel,
  variant,
}: {
  kind: 'iphone' | 'android';
  tone: UiTone;
  dateLabel: string;
  variant: MockupVariant;
}) {
  const showcase = variant === 'showcase';
  const ink = tone === 'light' ? '#ffffff' : '#101010';
  const soft = tone === 'light' ? 'rgba(255,255,255,0.88)' : 'rgba(16,16,16,0.82)';
  const glassBg = tone === 'light' ? 'rgba(40,40,44,0.5)' : 'rgba(255,255,255,0.55)';
  const shadow = tone === 'light' ? '0 0.2cqw 1.6cqw rgba(0,0,0,0.25)' : '0 0.2cqw 1.6cqw rgba(255,255,255,0.3)';
  const android = kind === 'android';

  return (
    <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
      {/* Status icons next to the camera cut-out */}
      {showcase ? (
        <ShowcaseStatusBar ink={ink} time={false} />
      ) : (
        <div
          className="absolute flex items-center"
          style={{ top: android ? '3.1cqw' : '4.6cqw', right: '8cqw', gap: '1.4cqw', color: ink }}
        >
          <svg viewBox="0 0 18 12" style={{ width: '4.6cqw', height: '3cqw' }} fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx="0.8" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
            <rect x="10" y="3" width="3" height="9" rx="0.8" />
            <rect x="15" y="0" width="3" height="12" rx="0.8" />
          </svg>
          <svg viewBox="0 0 26 12" style={{ width: '7cqw', height: '3.2cqw' }} fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.4" stroke="currentColor" opacity="0.5" />
            <rect x="2" y="2" width="15" height="8" rx="2.2" fill="currentColor" />
            <rect x="23" y="4" width="2" height="4" rx="1" fill="currentColor" opacity="0.5" />
          </svg>
        </div>
      )}

      {/* Date and clock */}
      <div
        className="absolute inset-x-0 text-center"
        style={{
          top: android ? '9%' : `${(PHONE_SAFE_TOP * 100 * 0.3).toFixed(2)}%`,
          color: soft,
          textShadow: shadow,
          fontFamily: showcase ? SYSTEM_FONT : ROUNDED_FONT,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '4.5cqw',
            fontWeight: 600,
            lineHeight: 1.2,
            minHeight: '5.4cqw',
            ...(showcase ? { whiteSpace: 'nowrap' as const } : null),
          }}
        >
          {dateLabel}
        </p>
        <p
          style={{
            margin: 0,
            marginTop: '-0.6cqw',
            fontSize: '25cqw',
            fontWeight: android ? 300 : 700,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: ink,
            opacity: android ? 0.95 : 0.9,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          9:41
        </p>
      </div>

      {/* Where the verse starts (the maker's guide, not part of the homepage mockups) */}
      {!showcase && (
        <div
          className="absolute inset-x-0"
          style={{
            top: `${PHONE_SAFE_TOP * 100}%`,
            borderTop: `0.35cqw dashed ${tone === 'light' ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.25)'}`,
          }}
        />
      )}

      {/* Flashlight and camera */}
      {[
        { side: 'left', Icon: Flashlight },
        { side: 'right', Icon: Camera },
      ].map(({ side, Icon }) => (
        <span
          key={side}
          className="absolute flex items-center justify-center rounded-full"
          style={{
            bottom: `${(PHONE_SAFE_BOTTOM * 100 * 0.38).toFixed(2)}%`,
            [side]: '10.5cqw',
            width: '12.8cqw',
            height: '12.8cqw',
            background: glassBg,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: ink,
          }}
        >
          <Icon style={{ width: '5.6cqw', height: '5.6cqw' }} strokeWidth={2} />
        </span>
      ))}

      {/* Home indicator */}
      <span
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          bottom: '1.9cqw',
          width: '34cqw',
          height: '1.3cqw',
          background: ink,
          opacity: 0.85,
        }}
      />
    </div>
  );
}

/** Home Screen chrome: the 9:41 time on the left of the Dynamic Island, signal and battery on the right, home indicator. */
function PhoneHomeUi({ tone, variant }: { tone: UiTone; variant: MockupVariant }) {
  const ink = tone === 'light' ? '#ffffff' : '#101010';
  return (
    <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
      {variant === 'showcase' ? (
        <ShowcaseStatusBar ink={ink} time />
      ) : (
      <div
        className="absolute flex items-center justify-between"
        style={{ top: '3.4cqw', height: '8.2cqw', left: '9cqw', right: '8cqw', color: ink, fontFamily: SYSTEM_FONT }}
      >
        <span style={{ fontSize: '4.3cqw', fontWeight: 600, lineHeight: 1, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>
          9:41
        </span>
        <span className="flex items-center" style={{ gap: '1.4cqw' }}>
          <svg viewBox="0 0 18 12" style={{ width: '4.6cqw', height: '3cqw' }} fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx="0.8" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
            <rect x="10" y="3" width="3" height="9" rx="0.8" />
            <rect x="15" y="0" width="3" height="12" rx="0.8" />
          </svg>
          <svg viewBox="0 0 26 12" style={{ width: '7cqw', height: '3.2cqw' }} fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.4" stroke="currentColor" opacity="0.5" />
            <rect x="2" y="2" width="15" height="8" rx="2.2" fill="currentColor" />
            <rect x="23" y="4" width="2" height="4" rx="1" fill="currentColor" opacity="0.5" />
          </svg>
        </span>
      </div>
      )}
      <span
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{ bottom: '1.9cqw', width: '34cqw', height: '1.3cqw', background: ink, opacity: 0.85 }}
      />
    </div>
  );
}

function DesktopUi({ tone }: { tone: UiTone }) {
  const bar = tone === 'light' ? 'rgba(20,20,24,0.45)' : 'rgba(255,255,255,0.55)';
  const dot = tone === 'light' ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.6)';
  const dock = tone === 'light' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.45)';
  return (
    <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-between"
        style={{ height: '2.2cqw', padding: '0 1.4cqw', background: bar }}
      >
        <span className="flex items-center" style={{ gap: '1.2cqw' }}>
          <span style={{ width: '0.9cqw', height: '0.9cqw', borderRadius: '50%', background: dot }} />
          <span style={{ width: '4cqw', height: '0.5cqw', borderRadius: '1cqw', background: dot, opacity: 0.8 }} />
          <span style={{ width: '3cqw', height: '0.5cqw', borderRadius: '1cqw', background: dot, opacity: 0.5 }} />
        </span>
        <span className="flex items-center" style={{ gap: '1cqw' }}>
          <span style={{ width: '1.4cqw', height: '0.7cqw', borderRadius: '0.2cqw', background: dot, opacity: 0.7 }} />
          <span style={{ width: '5cqw', height: '0.5cqw', borderRadius: '1cqw', background: dot }} />
        </span>
      </div>
      <div
        className="absolute left-1/2 flex items-center -translate-x-1/2"
        style={{
          bottom: '1.2cqw',
          gap: '0.9cqw',
          padding: '0.7cqw 1cqw',
          borderRadius: '1.6cqw',
          background: dock,
          border: '0.12cqw solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        {['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#14b8a6', '#64748b'].map((c) => (
          <span key={c} style={{ width: '2.4cqw', height: '2.4cqw', borderRadius: '0.6cqw', background: c, opacity: 0.85 }} />
        ))}
      </div>
    </div>
  );
}

export default function DeviceMockup({
  device,
  width,
  height,
  showUi,
  uiTone,
  dateLabel,
  children,
  screenProps,
  screenStyle,
  variant = 'maker',
  ui = 'lock',
}: DeviceMockupProps) {
  const { className: screenClass = '', style: extraStyle, ...restScreen } = screenProps ?? {};
  const aspect = `${width} / ${height}`;

  if (device === 'desktop') {
    return (
      <div style={{ containerType: 'inline-size' }} className="w-full">
        <div
          className="relative"
          style={{
            padding: '1cqw 1cqw 3cqw',
            borderRadius: '1.8cqw',
            background: 'linear-gradient(160deg, #54545a, #26262a 30%, #151518 70%, #3a3a3f)',
            boxShadow:
              'inset 0 0 0 0.15cqw rgba(255,255,255,0.14), 0 3cqw 6cqw rgba(0,0,0,0.55), 0 0 8cqw rgba(217,123,59,0.08)',
          }}
        >
          <div style={{ borderRadius: '0.9cqw', background: '#000', padding: '0.35cqw' }}>
            <div
              {...restScreen}
              className={`relative overflow-hidden bg-black ${screenClass}`}
              style={{
                aspectRatio: aspect,
                borderRadius: '0.6cqw',
                containerType: 'inline-size',
                ...screenStyle,
                ...extraStyle,
              }}
            >
              {children}
              {showUi && <DesktopUi tone={uiTone} />}
            </div>
          </div>
          <span
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{ top: '0.45cqw', width: '0.5cqw', height: '0.5cqw', background: '#0a0a0c', boxShadow: '0 0 0 0.1cqw #333' }}
          />
        </div>
        {/* Stand */}
        <div aria-hidden="true" className="mx-auto" style={{ width: '13cqw', height: '6cqw', background: 'linear-gradient(90deg,#2a2a2e,#6a6a70 45%,#2a2a2e)', clipPath: 'polygon(14% 0, 86% 0, 100% 100%, 0 100%)' }} />
        <div
          aria-hidden="true"
          className="mx-auto"
          style={{
            width: '30cqw',
            height: '1.1cqw',
            borderRadius: '0.5cqw 0.5cqw 1cqw 1cqw',
            background: 'linear-gradient(180deg,#8a8a90,#3a3a3f)',
            boxShadow: '0 1.5cqw 2.5cqw rgba(0,0,0,0.5)',
          }}
        />
      </div>
    );
  }

  const iphone = device === 'iphone';
  const showcase = variant === 'showcase';
  // Maker: squircle corners. Showcase: none (plain circular border-radius).
  const corner = showcase ? undefined : squircle;
  // Frame, black bezel, screen radius (all in cqw of the whole device width).
  const frameGap = iphone ? 1.1 : 0.9;
  const bezel = iphone ? 2.3 : 1.7;
  const screenRadius = iphone ? 13.2 : 8.4;
  const bezelRadius = screenRadius + bezel;
  const frameRadius = bezelRadius + frameGap;

  return (
    <div style={{ containerType: 'inline-size' }} className="w-full">
      <div className="relative">
        {iphone ? (
          <>
            <SideButton side="left" top={14.8} height={3.2} />
            <SideButton side="left" top={21.5} height={6.4} />
            <SideButton side="left" top={29.5} height={6.4} />
            <SideButton side="right" top={26} height={10} width={1} />
            {showcase && <CameraControl />}
          </>
        ) : (
          <>
            <SideButton side="right" top={22} height={7} tone="graphite" />
            <SideButton side="right" top={31} height={11} tone="graphite" />
          </>
        )}
        <div
          style={{
            padding: `${frameGap}cqw`,
            borderRadius: `${frameRadius}cqw`,
            background: iphone ? TITANIUM : GRAPHITE,
            boxShadow: showcase ? SHOWCASE_FRAME_SHADOW : MAKER_FRAME_SHADOW,
            ...corner,
          }}
        >
          <div
            style={{
              padding: `${bezel}cqw`,
              borderRadius: `${bezelRadius}cqw`,
              background: '#050507',
              boxShadow: showcase
                ? '0 0 0 0.2cqw rgba(0,0,0,0.9), inset 0 0 0 0.2cqw rgba(255,255,255,0.05)'
                : 'inset 0 0 0 0.2cqw rgba(255,255,255,0.05)',
              ...corner,
            }}
          >
            <div
              {...restScreen}
              className={`relative overflow-hidden bg-black ${screenClass}`}
              style={{
                aspectRatio: aspect,
                borderRadius: `${screenRadius}cqw`,
                containerType: 'inline-size',
                ...corner,
                ...screenStyle,
                ...extraStyle,
              }}
            >
              {children}
              {showUi && ui === 'home' && <PhoneHomeUi tone={uiTone} variant={variant} />}
              {showUi && ui !== 'home' && (
                <PhoneLockUi kind={iphone ? 'iphone' : 'android'} tone={uiTone} dateLabel={dateLabel} variant={variant} />
              )}
              {/* Dynamic Island / punch-hole camera (always visible, like the real hardware) */}
              {iphone ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full bg-black"
                  style={{ top: '2.9cqw', width: '31cqw', height: '9.2cqw', boxShadow: '0 0 0 0.15cqw rgba(255,255,255,0.04)' }}
                >
                  <span
                    className="absolute rounded-full"
                    style={{
                      right: '2.6cqw',
                      top: '50%',
                      width: '3.6cqw',
                      height: '3.6cqw',
                      transform: 'translateY(-50%)',
                      background: 'radial-gradient(circle at 35% 35%, #1b2236 0%, #090a10 60%)',
                    }}
                  />
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full bg-black"
                  style={{ top: '2.8cqw', width: '3.8cqw', height: '3.8cqw', boxShadow: '0 0 0 0.3cqw rgba(0,0,0,0.9)' }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
