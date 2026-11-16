import type { ReactNode } from 'react';
import GlassCard from '../ui/GlassCard';
import Reveal from '../ui/Reveal';

/**
 * One bento tile: a mockup stage on top (clipped, soft fade into the card at its bottom edge), the title and text below.
 * `className` goes on the grid cell (column span); the card fills the cell so tiles in a row are equally tall.
 */
export default function FeatureTile({
  title,
  children,
  art,
  artClassName = '',
  fade = true,
  delay = 0,
  className = '',
}: {
  title: string;
  /** The tile's text (paragraph(s)). */
  children: ReactNode;
  /** The mockup. Decorative mockups bring their own aria-hidden. */
  art: ReactNode;
  /** Height and extra classes of the stage. */
  artClassName?: string;
  /** Fade the stage's bottom edge into the card (off when the art has its own fade). */
  fade?: boolean;
  delay?: number;
  className?: string;
}) {
  const mask = 'linear-gradient(to bottom, #000 70%, transparent 100%)';
  return (
    <Reveal delay={delay} className={className}>
      <GlassCard as="article" className="group flex h-full flex-col overflow-hidden">
        <div className={`relative overflow-hidden ${artClassName}`}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(70% 60% at 50% 35%, rgba(217,123,59,0.13), transparent 75%)' }}
          />
          <div
            className="relative h-full w-full"
            style={fade ? { WebkitMaskImage: mask, maskImage: mask } : undefined}
          >
            {art}
          </div>
        </div>
        <div className="px-6 pb-7 pt-1 sm:px-7">
          <h3 className="text-xl font-bold tracking-tight text-white sm:text-[1.375rem]">{title}</h3>
          <div className="mt-2 max-w-xl space-y-2 text-[15px] leading-relaxed text-white/60">{children}</div>
        </div>
      </GlassCard>
    </Reveal>
  );
}
