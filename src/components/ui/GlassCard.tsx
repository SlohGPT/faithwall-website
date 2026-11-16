import type { ReactNode } from 'react';

// Glass on the site's dark surface: faint white fill, hairline border, inset top highlight. `interactive` adds the hover
// state (border toward the brand orange, 2px lift; transform only, off for reduced motion).
export const glassCardClass =
  'relative rounded-[28px] border border-white/[0.08] bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]';
export const glassCardHoverClass =
  'transition duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:bg-white/[0.05] motion-reduce:transition-none motion-reduce:hover:translate-y-0';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: 'div' | 'article' | 'figure' | 'li';
}

export default function GlassCard({ children, className = '', interactive = false, as: Tag = 'div' }: GlassCardProps) {
  return <Tag className={`${glassCardClass} ${interactive ? glassCardHoverClass : ''} ${className}`}>{children}</Tag>;
}
