import { useId } from 'react';
import { BookOpen, HelpCircle, ListOrdered, Shuffle, Smartphone, SlidersHorizontal, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { C, Glow, Phone, Spark, T, n } from '../illustrations/primitives';
import Live from './Live';
import SectionIcon from './SectionIcon';
import StepDiagram, { type DiagramStep } from './StepDiagram';

/**
 * Part B (Karol approved the captures 11-17): visuals for the homepage FAQ. Everything here is decorative and aria-hidden; the
 * questions and answers stay real text in the DOM (TestimonialsAndFAQ hides them with CSS only). Motion comes
 * from the generic classes in visual-pages.css.
 */

const ICONS: LucideIcon[] = [BookOpen, ListOrdered, Smartphone, Shuffle];

/** One icon per question (by position; anything added later falls back to a question mark). */
export function FaqIcon({ index }: { index: number }) {
  return <SectionIcon icon={ICONS[index] ?? HelpCircle} size="sm" />;
}

/** The "how does it work" answer is the setup answer: it gets the step diagram. */
export const isSetupQuestion = (q: string) => /how does .* work/i.test(q);

const sp = { className: 'h-6 w-6', strokeWidth: 1.9, 'aria-hidden': true, focusable: false } as const;

/** Two iPhones side by side: a full-screen wallpaper and a lock-screen widget. 56x56, fixed. */
function WallpaperOrWidget() {
  return (
    <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true" focusable="false" fill="none" className="h-9 w-9">
      <g>
        <rect x="6" y="6" width="19" height="44" rx="6" fill={C.body} stroke="currentColor" strokeWidth="2" />
        <rect x="8.5" y="8.5" width="14" height="39" rx="4" fill={C.ember} />
        <rect x="13" y="10" width="5" height="2.4" rx="1.2" fill="#000" />
        <g fill="#fff" opacity=".9">
          <rect x="10.5" y="30" width="10" height="2" rx="1" />
          <rect x="10.5" y="35" width="8" height="2" rx="1" />
          <rect x="10.5" y="40" width="9" height="2" rx="1" opacity=".6" />
        </g>
      </g>
      <g>
        <rect x="31" y="6" width="19" height="44" rx="6" fill={C.body} stroke="currentColor" strokeWidth="2" />
        <rect x="33.5" y="8.5" width="14" height="39" rx="4" fill="#121A2E" />
        <rect x="38" y="10" width="5" height="2.4" rx="1.2" fill="#000" />
        <rect x="35" y="16" width="10" height="2.4" rx="1.2" fill="#C9D0E6" opacity=".6" />
        <rect x="35" y="22" width="10" height="9" rx="2.5" fill={C.brand} opacity=".85" />
        <rect x="36.5" y="25" width="7" height="1.8" rx=".9" fill="#fff" />
        <rect x="36.5" y="28" width="5" height="1.8" rx=".9" fill="#fff" opacity=".7" />
      </g>
    </svg>
  );
}

// Labels come from the answer: "You pick your own verse ... Then you choose how to show it: a ... wallpaper ... or a ... widget".
const SETUP: DiagramStep[] = [
  { label: 'Pick your verse', icon: <Search {...sp} /> },
  { label: 'Choose how to show it', icon: <SlidersHorizontal {...sp} /> },
  { label: 'Wallpaper or widget', icon: <WallpaperOrWidget /> },
];

export function HomeFaqSetupDiagram() {
  return (
    <div className="px-5 pb-6">
      <StepDiagram steps={SETUP} className="!my-0" />
    </div>
  );
}

/** Small header visual: a lock screen and a question bubble with an answer bubble. 240x150, fixed box. */
function FaqScene() {
  const u = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg
      viewBox="0 0 240 150"
      width="240"
      height="150"
      aria-hidden="true"
      focusable="false"
      fill="none"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', width: '100%', height: 'auto' }}
    >
      <Glow id={`${u}g`} cx={84} cy={78} rx={90} ry={70} o={0.4} />
      <Phone id={`${u}p`} x={52} y={8} w={64} bg={T.ember.bg} lite>
        {(d) => (
          <g>
            <rect x={n(d.sw * 0.33)} y={n(d.sw * 0.23)} width={n(d.sw * 0.34)} height={n(d.sw * 0.04)} rx={n(d.sw * 0.02)} fill="#fff" opacity=".5" />
            <rect x={n(d.sw * 0.2)} y={n(d.sw * 0.38)} width={n(d.sw * 0.6)} height={n(d.sw * 0.18)} rx={n(d.sw * 0.05)} fill="#fff" opacity=".85" />
            <g fill="#fff">
              <rect x={n(d.sw * 0.1)} y={n(d.sw * 0.95)} width={n(d.sw * 0.8)} height="4" rx="2" opacity=".9" />
              <rect x={n(d.sw * 0.1)} y={n(d.sw * 0.95 + 9)} width={n(d.sw * 0.7)} height="4" rx="2" opacity=".9" />
              <rect x={n(d.sw * 0.1)} y={n(d.sw * 0.95 + 18)} width={n(d.sw * 0.45)} height="4" rx="2" opacity=".9" />
            </g>
          </g>
        )}
      </Phone>
      <g className="vp-loop vp-bob" style={{ ['--d' as string]: '0s', ['--t' as string]: '6s' }}>
        <path d="M130 26h64a12 12 0 0 1 12 12v26a12 12 0 0 1-12 12h-44l-14 14v-14a12 12 0 0 1-6-10V38a12 12 0 0 1 12-12Z" fill={C.card} stroke={C.edge} />
        <path d="M156 46a8 8 0 1 1 11 7.4c-2.2 1-3 2-3 4.2M164 66v.5" stroke={C.light} strokeWidth="3.5" />
      </g>
      <g className="vp-loop vp-bob" style={{ ['--d' as string]: '2.5s', ['--t' as string]: '7s' }}>
        <path d="M118 96h74a10 10 0 0 1 10 10v10a10 10 0 0 1-10 10h-10l-10 10v-10h-54a10 10 0 0 1-10-10v-10a10 10 0 0 1 10-10Z" fill={C.brand} opacity=".9" />
        <g fill={C.cream}>
          <rect x="128" y="104" width="52" height="5" rx="2.5" />
          <rect x="128" y="114" width="34" height="5" rx="2.5" opacity=".7" />
        </g>
      </g>
      <g className="vp-loop vp-twinkle" style={{ ['--d' as string]: '0s', ['--t' as string]: '5s' }}>
        <Spark x={36} y={30} r={8} />
      </g>
      <g className="vp-loop vp-twinkle" style={{ ['--d' as string]: '2s', ['--t' as string]: '6s' }}>
        <Spark x={214} y={92} r={6} fill={C.gold} />
      </g>
    </svg>
  );
}

export function FaqHeaderVisual() {
  return (
    <Live className="mx-auto mb-4 w-44">
      <FaqScene />
    </Live>
  );
}
