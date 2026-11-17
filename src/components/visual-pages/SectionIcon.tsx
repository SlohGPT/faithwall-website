import type { LucideIcon } from 'lucide-react';

/**
 * Small rounded tile with a line icon, put in front of a section heading. Decorative: the heading text says
 * everything, so the tile is hidden from assistive tech and adds no text to the DOM.
 */
export default function SectionIcon({ icon: Icon, size = 'md', className = '' }: { icon: LucideIcon; size?: 'sm' | 'md'; className?: string }) {
  const box = size === 'sm' ? 'h-8 w-8 rounded-lg' : 'h-9 w-9 rounded-xl';
  return (
    <span
      aria-hidden="true"
      className={`inline-flex ${box} shrink-0 items-center justify-center bg-brand/10 text-brand ring-1 ring-inset ring-brand/25 ${className}`}
    >
      <Icon className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={2} aria-hidden="true" focusable="false" />
    </span>
  );
}
