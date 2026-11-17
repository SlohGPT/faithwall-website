import { Fragment, type ReactNode } from 'react';
import Live from './Live';

export interface DiagramStep {
  /** Words that already appear in the page text next to the diagram (shortened is fine). */
  label: string;
  icon: ReactNode;
}

/** Arrow between two steps, with a small dot that travels along it while the diagram is on screen. */
function Connector({ delay }: { delay: number }) {
  return (
    <svg
      className="mt-[1.375rem] h-3 w-5 shrink-0 text-brand/60 sm:w-8"
      viewBox="0 0 32 12"
      width="32"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <g className="vp-e vp-grow" style={{ ['--d' as string]: `${delay}s` }}>
        <path d="M2 6H28M23 1.5 28 6l-5 4.5" />
      </g>
      <circle className="vp-loop vp-travel" style={{ ['--dx' as string]: '18px', ['--t' as string]: '6s', ['--d' as string]: `${delay + 0.8}s` }} cx="4" cy="6" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * A small left-to-right step diagram: icon tile + label per step, arrows between. Decorative (aria-hidden): it
 * restates a list or paragraph that is already in the page, so a screen reader gets the text once.
 * Fixed row height (tile 3.5rem + two label lines), so nothing shifts when it hydrates.
 */
export default function StepDiagram({ steps, className = '' }: { steps: DiagramStep[]; className?: string }) {
  return (
    <Live className={`my-5 ${className}`}>
      <div
        aria-hidden="true"
        className="flex items-start justify-between gap-1 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 sm:justify-center sm:gap-2 sm:px-6"
      >
        {steps.map((s, i) => (
          <Fragment key={s.label}>
            {i > 0 && <Connector delay={0.12 + i * 0.16} />}
            <div className="vp-e flex w-[4.75rem] flex-col items-center text-center sm:w-24" style={{ ['--d' as string]: `${i * 0.16}s` }}>
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-inset ring-brand/30">
                {s.icon}
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-bold leading-none text-[#14141C]">
                  {i + 1}
                </span>
              </span>
              <span className="mt-2 block min-h-[2rem] text-xs font-medium leading-4 text-white/80">{s.label}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </Live>
  );
}
