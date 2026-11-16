import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowRight, Check, ChevronDown, ChevronLeft, X } from 'lucide-react';
import DeviceMockup from '../DeviceMockup';
import { SHOWCASE_VERSES } from '../../data/showcaseVerses';
import { HomeScreen } from '../showcase/HomeScreen';
import AppLockScreen from '../showcase/AppLockScreen';
import { SYSTEM_FONT, usePageVisible, usePrefersReducedMotion } from '../showcase/utils';

/*
 * The three How it works screens, drawn in HTML/CSS after the real app (SwiftUI sources: Choose Your Verse in
 * VerseSelectionComponents, the review sheet in WallpaperVerseReviewView, the progress and success cards in
 * WallpaperUpdateLoadingView). Everything is sized in container-query units of the phone screen: 1 pt on the app's
 * 390 pt wide screen = 100/390 cqw. Decoration only: the cards around them carry the text, so each phone is aria-hidden.
 */

const pt = (n: number) => `${((n * 100) / 390).toFixed(3)}cqw`;

const ACCENT = '#F26633'; // the app's orange accent (0.95, 0.40, 0.20)
const SHEET_BG = '#FCF1EA'; // the warm sheet background the app shows in light mode
const INK = '#1c1c1e';
const ROUNDED = 'ui-rounded, "SF Pro Rounded", "DM Sans", system-ui, -apple-system, sans-serif';
const VERSE = SHOWCASE_VERSES[0];

function Phone({ children, tone = 'dark' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <DeviceMockup device="iphone" width={1290} height={2796} showUi uiTone={tone} dateLabel="" variant="showcase" ui="home">
      {children}
    </DeviceMockup>
  );
}

function Sheet({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: SHEET_BG, color: INK, fontFamily: SYSTEM_FONT }}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- 01 Download */

// The FaithWall tile is the 6th tile of HomeScreen's 4-column grid (row 2, column 2). Centre of that tile, in cqw.
const ICON_CX = 39.1;
const ICON_CY = 107.8;

export function DownloadScreen() {
  return (
    <Phone tone="light">
      <HomeScreen verse={VERSE} wallpaper="dawn" />
      <span
        aria-hidden="true"
        className="absolute rounded-[26%]"
        style={{
          left: `${ICON_CX - 10.6}cqw`,
          top: `${ICON_CY - 10.6}cqw`,
          width: '21.2cqw',
          height: '21.2cqw',
          boxShadow: '0 0 0 0.7cqw rgba(255,255,255,0.85), 0 0 0 1.6cqw rgba(217,123,59,0.35), 0 0 7cqw 2cqw rgba(217,123,59,0.55)',
        }}
      />
    </Phone>
  );
}

/* ---------------------------------------------------------------- 02 Choose your verse */

function Segment({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className="grid flex-1 place-items-center"
      style={{
        height: pt(28),
        borderRadius: pt(7),
        fontSize: pt(13),
        fontWeight: active ? 600 : 500,
        background: active ? '#fff' : 'transparent',
        boxShadow: active ? '0 0.3cqw 1cqw rgba(0,0,0,0.14), 0 0 0 0.1cqw rgba(0,0,0,0.04)' : undefined,
      }}
    >
      {label}
    </span>
  );
}

function Bar({ w }: { w: string }) {
  return <span className="block" style={{ width: w, height: pt(10), borderRadius: pt(5), background: 'rgba(60,40,30,0.12)' }} />;
}

export function ChooseVerseScreen() {
  const side = pt(24);
  return (
    <Phone>
      <Sheet>
        {/* header */}
        <div className="absolute flex items-start justify-between" style={{ top: pt(66), left: side, right: side }}>
          <span style={{ fontFamily: ROUNDED, fontSize: pt(24), fontWeight: 700, lineHeight: 1.15 }}>Choose Your Verse</span>
          <span className="grid place-items-center" style={{ width: pt(32), height: pt(32), borderRadius: '50%', background: 'rgba(0,0,0,0.06)', color: 'rgba(28,28,30,0.6)' }}>
            <X style={{ width: pt(15), height: pt(15) }} strokeWidth={2.6} aria-hidden="true" />
          </span>
        </div>

        {/* Explore | Search | Write */}
        <div
          className="absolute flex"
          style={{ top: pt(118), left: side, right: side, padding: pt(2), borderRadius: pt(9), background: 'rgba(118,118,128,0.12)' }}
        >
          <Segment label="Explore" active />
          <Segment label="Search" />
          <Segment label="Write" />
        </div>

        {/* chapter header: back chevron, book, version */}
        <div className="absolute flex items-center justify-between" style={{ top: pt(166), left: side, right: side, height: pt(32) }}>
          <span className="flex items-center" style={{ gap: pt(4), color: ACCENT, fontSize: pt(16) }}>
            <ChevronLeft style={{ width: pt(18), height: pt(18) }} strokeWidth={2.4} aria-hidden="true" />
            <span style={{ color: INK, fontSize: pt(17), fontWeight: 600 }}>Psalm 23</span>
          </span>
          <span
            className="flex items-center"
            style={{ gap: pt(4), padding: `${pt(6)} ${pt(10)}`, borderRadius: 999, background: 'rgba(242,102,51,0.12)', color: ACCENT, fontSize: pt(13), fontWeight: 600, lineHeight: 1 }}
          >
            KJV
            <ChevronDown style={{ width: pt(11), height: pt(11) }} strokeWidth={3} aria-hidden="true" />
          </span>
        </div>

        {/* verse list: the chosen verse, then the rest of the chapter */}
        <div className="absolute" style={{ top: pt(210), left: side, right: side }}>
          <div
            className="flex items-start"
            style={{
              gap: pt(12),
              padding: `${pt(12)} ${pt(10)}`,
              borderRadius: pt(14),
              background: 'rgba(242,102,51,0.1)',
              boxShadow: `inset 0 0 0 ${pt(1.5)} rgba(242,102,51,0.45)`,
            }}
          >
            <span style={{ width: pt(24), textAlign: 'right', color: '#2f6fe4', fontSize: pt(12), fontWeight: 700, lineHeight: pt(22), flexShrink: 0 }}>1</span>
            <span style={{ fontSize: pt(17), lineHeight: pt(22), flex: 1 }}>{VERSE.text}</span>
            <span className="grid place-items-center" style={{ width: pt(22), height: pt(22), borderRadius: '50%', background: ACCENT, color: '#fff', flexShrink: 0 }}>
              <Check style={{ width: pt(13), height: pt(13) }} strokeWidth={3.4} aria-hidden="true" />
            </span>
          </div>

          <div
            style={{
              WebkitMaskImage: 'linear-gradient(#000 55%, transparent)',
              maskImage: 'linear-gradient(#000 55%, transparent)',
            }}
          >
            {[2, 3, 4].map((n, i) => (
              <div key={n} className="flex items-start" style={{ gap: pt(12), padding: `${pt(14)} ${pt(10)}` }}>
                <span style={{ width: pt(24), textAlign: 'right', color: '#2f6fe4', fontSize: pt(12), fontWeight: 700, lineHeight: pt(12), flexShrink: 0 }}>{n}</span>
                <span className="flex flex-1 flex-col" style={{ gap: pt(7) }}>
                  <Bar w="100%" />
                  <Bar w={i === 1 ? '46%' : '72%'} />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Continue */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: pt(494),
            left: side,
            right: side,
            height: pt(58),
            gap: pt(8),
            borderRadius: pt(16),
            background: ACCENT,
            color: '#fff',
            fontSize: pt(18),
            fontWeight: 700,
            boxShadow: `0 ${pt(5)} ${pt(10)} rgba(242,102,51,0.3)`,
          }}
        >
          Continue
          <ArrowRight style={{ width: pt(18), height: pt(18) }} strokeWidth={2.6} aria-hidden="true" />
        </div>
      </Sheet>
    </Phone>
  );
}

/* ---------------------------------------------------------------- 03 Preview and set it */

type Phase = 'review' | 'updating' | 'updated';
const PHASE_MS: Record<Phase, number> = { review: 4200, updating: 2600, updated: 2400 };
const NEXT: Record<Phase, Phase> = { review: 'updating', updating: 'updated', updated: 'review' };

const RING_CSS = `
@keyframes hiw-ring{from{stroke-dashoffset:207}to{stroke-dashoffset:18}}
@keyframes hiw-pop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.12);opacity:1}100%{transform:scale(1);opacity:1}}
@media (prefers-reduced-motion:reduce){.hiw-anim{animation:none!important}}
`;

/** The review sheet's live Lock Screen preview, as a real framed iPhone. */
function MiniLock() {
  return (
    <div className="absolute" style={{ top: pt(206), left: '50%', width: pt(129), transform: 'translateX(-50%)' }}>
      <AppLockScreen verse={VERSE} wallpaper="dawn" />
    </div>
  );
}

function ProgressCard() {
  return (
    <div
      className="flex flex-col items-center"
      style={{ padding: `${pt(38)} ${pt(46)}`, gap: pt(20), borderRadius: pt(28), background: '#fff', boxShadow: '0 4cqw 9cqw rgba(0,0,0,0.3)' }}
    >
      <span className="relative grid place-items-center" style={{ width: pt(88), height: pt(88) }}>
        <span className="absolute inset-0 rounded-full" style={{ background: 'rgba(242,102,51,0.08)' }} />
        <svg viewBox="0 0 76 76" style={{ width: pt(76), height: pt(76), transform: 'rotate(-90deg)' }} aria-hidden="true">
          <circle cx="38" cy="38" r="33" fill="none" stroke="rgba(242,102,51,0.15)" strokeWidth="5" />
          <circle
            className="hiw-anim"
            cx="38"
            cy="38"
            r="33"
            fill="none"
            stroke={ACCENT}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="207.3"
            strokeDashoffset="207.3"
            style={{ animation: `hiw-ring ${PHASE_MS.updating}ms linear forwards` }}
          />
        </svg>
      </span>
      <span style={{ fontSize: pt(15), fontWeight: 500, color: 'rgba(60,60,67,0.6)', whiteSpace: 'nowrap' }}>Updating wallpaper...</span>
    </div>
  );
}

function SuccessCard() {
  return (
    <div
      className="flex flex-col items-center"
      style={{ padding: `${pt(36)} ${pt(40)}`, gap: pt(16), borderRadius: pt(24), background: '#fff', boxShadow: '0 3.4cqw 8cqw rgba(0,0,0,0.26)' }}
    >
      <span
        className="hiw-anim grid place-items-center"
        style={{
          width: pt(64),
          height: pt(64),
          borderRadius: '50%',
          background: ACCENT,
          color: '#fff',
          boxShadow: `0 ${pt(6)} ${pt(12)} rgba(242,102,51,0.35)`,
          animation: 'hiw-pop 520ms cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        <Check style={{ width: pt(30), height: pt(30) }} strokeWidth={3} aria-hidden="true" />
      </span>
      <span style={{ fontFamily: ROUNDED, fontSize: pt(19), fontWeight: 700, whiteSpace: 'nowrap' }}>Wallpaper Updated!</span>
    </div>
  );
}

/**
 * The review sheet with the live Lock Screen preview. While `active` (card on screen, tab visible, motion allowed) it
 * cycles review -> "Updating wallpaper..." -> "Wallpaper Updated!" -> review. Otherwise, and on the server and the first
 * client render, it is the static review screen.
 */
export function ReviewScreen({ active }: { active: boolean }) {
  const reduced = usePrefersReducedMotion();
  const visible = usePageVisible();
  const [phase, setPhase] = useState<Phase>('review');
  const run = active && visible && !reduced;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setPhase(NEXT[phaseRef.current]), PHASE_MS[phase]);
    return () => clearTimeout(t);
  }, [run, phase]);

  useEffect(() => {
    if (!run && phaseRef.current !== 'review') setPhase('review');
  }, [run]);

  const side = pt(24);
  const overlayStyle = (on: boolean): CSSProperties => ({
    opacity: on ? 1 : 0,
    transform: on ? 'scale(1)' : 'scale(0.94)',
    transition: 'opacity 320ms ease, transform 320ms cubic-bezier(0.22,1,0.36,1)',
  });

  return (
    <Phone>
      <style dangerouslySetInnerHTML={{ __html: RING_CSS }} />
      <Sheet>
        <span className="absolute" style={{ top: pt(62), left: side, fontSize: pt(28), fontWeight: 700, color: ACCENT, lineHeight: 1.15 }}>
          {VERSE.reference}
        </span>

        <div
          className="absolute"
          style={{ top: pt(108), left: side, right: side, minHeight: pt(84), padding: pt(16), borderRadius: pt(16), background: 'rgba(0,0,0,0.045)', fontSize: pt(17), lineHeight: pt(23) }}
        >
          {VERSE.text}
        </div>

        <MiniLock />

        <div className="absolute inset-x-0" style={{ top: pt(500), height: pt(1), background: 'rgba(60,40,30,0.14)' }} />
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: pt(517),
            left: side,
            right: side,
            height: pt(58),
            gap: pt(8),
            borderRadius: pt(16),
            background: ACCENT,
            color: '#fff',
            fontSize: pt(18),
            fontWeight: 700,
            boxShadow: `0 ${pt(5)} ${pt(10)} rgba(242,102,51,0.3)`,
          }}
        >
          Set as Wallpaper
          <span className="grid place-items-center" style={{ width: pt(22), height: pt(22), borderRadius: '50%', background: '#fff', color: ACCENT }}>
            <ArrowRight style={{ width: pt(14), height: pt(14) }} strokeWidth={3} aria-hidden="true" />
          </span>
        </div>

        {/* the loading overlay the app shows while the Shortcut applies the wallpaper */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.34)', opacity: phase === 'review' ? 0 : 1, transition: 'opacity 320ms ease', pointerEvents: 'none' }}
        />
        <div className="absolute inset-x-0 flex justify-center" style={{ top: pt(250), pointerEvents: 'none', ...overlayStyle(phase === 'updating') }}>
          {phase === 'updating' && <ProgressCard />}
        </div>
        <div className="absolute inset-x-0 flex justify-center" style={{ top: pt(260), pointerEvents: 'none', ...overlayStyle(phase === 'updated') }}>
          {phase === 'updated' && <SuccessCard />}
        </div>
      </Sheet>
    </Phone>
  );
}
