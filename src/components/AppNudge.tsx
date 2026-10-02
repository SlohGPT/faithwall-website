import { Check } from 'lucide-react';
import AppStoreButton from './AppStoreButton';
import { appStoreUrl } from '../lib/appStore';

interface AppNudgeProps {
  /** App Store campaign token for this placement (see src/lib/appStore.ts). */
  campaign: string;
  /** 'card' = compact card with an App Store button; 'inline' = one small text line with a link. */
  variant?: 'card' | 'inline';
  /** Optional confirmation label shown above the card text, for example "Saved". */
  confirmation?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Small, static install prompt for the free tools. No browser APIs are used in render,
 * so server and client markup are identical.
 */
export default function AppNudge({
  campaign,
  variant = 'card',
  confirmation,
  title,
  children,
  className = '',
}: AppNudgeProps) {
  const href = appStoreUrl(campaign);

  if (variant === 'inline') {
    return (
      <p className={`text-sm text-white/60 ${className}`}>
        {children}{' '}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand hover:text-brand-light underline underline-offset-2"
        >
          Get FaithWall on the App Store
        </a>
      </p>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-brand/30 bg-brand/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 text-left ${className}`}
    >
      <div className="flex-1 min-w-0">
        {confirmation && (
          <p className="flex items-center gap-1.5 text-sm font-bold text-brand mb-0.5">
            <Check className="w-4 h-4" aria-hidden="true" />
            {confirmation}
          </p>
        )}
        {title && <p className="text-sm font-bold text-white">{title}</p>}
        <p className="text-sm text-white/75 leading-snug">{children}</p>
      </div>
      <AppStoreButton href={href} theme="light" className="self-start sm:self-auto shrink-0" />
    </div>
  );
}
