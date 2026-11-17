import { Check, Star } from 'lucide-react';
import AppStoreButton from './AppStoreButton';
import InstallHandoff from './InstallHandoff';
import { appStoreUrl } from '../lib/appStore';
import { useIsAndroid } from '../hooks/useIsAndroid';
import facts from '../data/facts.json';

interface AppNudgeProps {
  /** App Store campaign token for this placement (see src/lib/appStore.ts). */
  campaign: string;
  /**
   * 'card' = compact card with an App Store button; 'inline' = one small text line with a link;
   * 'install' = the InstallCard (icon, one-line pitch, price line, requirements, rating, badge, QR on desktop).
   */
  variant?: 'card' | 'inline' | 'install';
  /** InstallCard only: where the card sits, written to data-install-card. */
  placement?: 'mid' | 'end' | 'tool';
  /** Optional confirmation label shown above the card text, for example "Saved". */
  confirmation?: string;
  title?: string;
  /** Body text. Required for 'card' and 'inline'; on 'install' it replaces the default pitch line. */
  children?: React.ReactNode;
  className?: string;
}

/** "4.7 on the US App Store", only while facts.rating.show is on. Public App Store data, no structured data. */
export function RatingLine({ className = '' }: { className?: string }) {
  if (!facts.rating.show) return null;
  return (
    <p className={`flex items-center gap-1.5 ${className}`}>
      <Star className="h-4 w-4 shrink-0 fill-current text-amber-300" aria-hidden="true" />
      <span>{`${facts.rating.value} on the ${facts.rating.storefront.toUpperCase()} App Store`}</span>
    </p>
  );
}

/**
 * Install prompts for the content pages and the free tools. The server and the first client render
 * produce identical markup: the Android check runs in an effect (see useIsAndroid).
 */
export default function AppNudge({
  campaign,
  variant = 'card',
  placement = 'tool',
  confirmation,
  title,
  children,
  className = '',
}: AppNudgeProps) {
  const href = appStoreUrl(campaign);
  const isAndroid = useIsAndroid();

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

  if (variant === 'install') {
    // The tools are for people who can use the app; on Android there is nothing to offer.
    if (isAndroid && placement === 'tool') return null;
    return (
      <div
        role="group"
        aria-label="Get FaithWall on iPhone"
        data-install-card={placement}
        data-nosnippet=""
        className={`rounded-2xl border border-brand/30 bg-brand/10 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8 text-left ${className}`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <img
              src="/icon-app-180.png"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-[11px]"
              loading="lazy"
              decoding="async"
            />
            <div className="min-w-0 flex-1 space-y-1.5">
              {confirmation && (
                <p className="flex items-center gap-1.5 text-[15px] font-bold text-brand">
                  <Check className="h-4 w-4" aria-hidden="true" />
                  {confirmation}
                </p>
              )}
              {title && <p className="text-[17px] font-bold leading-snug text-white">{title}</p>}
              <p className="text-[17px] font-bold leading-snug text-white">
                {children ?? 'Pick a Bible verse and FaithWall puts it on your lock screen.'}
              </p>
              <p className="text-[15px] leading-snug text-white/75">{facts.installLine}</p>
              <p className="text-[15px] leading-snug text-white/65">{`iPhone · ${facts.minIOSText}`}</p>
              <RatingLine className="text-[15px] leading-snug text-white/65" />
              {isAndroid && <p className="text-[15px] leading-snug text-white/75">FaithWall is made for iPhone.</p>}
            </div>
          </div>
          {/* Apple's badge rules: clear space of at least a quarter of its height (11 px) on every side. */}
          <div className="mt-5">
            <AppStoreButton size="cta" href={href} theme="light" />
          </div>
        </div>
        <InstallHandoff />
      </div>
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
