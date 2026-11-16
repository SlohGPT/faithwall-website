import type { ReactNode } from 'react';
import Reveal from './Reveal';

interface SectionHeadingProps {
  eyebrow: string;
  /** First line of the headline, white. */
  title: ReactNode;
  /** Second line of the headline, text-white/40 (like the hero and today's sections). */
  muted?: ReactNode;
  /** Optional supporting paragraph under the headline. */
  children?: ReactNode;
  align?: 'left' | 'center';
  /** Heading element: 2 for homepage sections (default), 1 or 3 where the outline needs it. */
  level?: 1 | 2 | 3;
  id?: string;
  className?: string;
  /** Fade in once on scroll (see Reveal). */
  reveal?: boolean;
}

/**
 * One heading for every homepage section: brand-orange tracked eyebrow, bold headline with a white first line and a
 * muted second line, optional paragraph. Keeps the rhythm identical from section to section.
 */
export default function SectionHeading({
  eyebrow,
  title,
  muted,
  children,
  align = 'left',
  level = 2,
  id,
  className = '',
  reveal = true,
}: SectionHeadingProps) {
  const center = align === 'center';
  const H = `h${level}` as 'h1' | 'h2' | 'h3';
  const body = (
    <>
      <p
        className={`mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand sm:text-[13px] ${
          center ? 'justify-center' : ''
        }`}
      >
        <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-brand/60" />
        {eyebrow}
        {center && <span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-brand/60" />}
      </p>
      <H id={id} className="text-[2rem] font-bold leading-[1.08] tracking-tight text-white [text-wrap:balance] min-[400px]:text-4xl sm:text-5xl">
        {title}
        {muted && (
          <>
            <br />
            <span className="text-white/40">{muted}</span>
          </>
        )}
      </H>
      {children && (
        <p className={`mt-5 text-base leading-relaxed text-white/60 sm:text-lg ${center ? 'mx-auto max-w-2xl' : 'max-w-xl'}`}>
          {children}
        </p>
      )}
    </>
  );
  const cls = `${center ? 'mx-auto text-center' : 'text-left'} ${className}`;
  return reveal ? <Reveal className={cls}>{body}</Reveal> : <div className={cls}>{body}</div>;
}
