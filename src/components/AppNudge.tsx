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
   * 'install' = the InstallCard (icon, one-line pitch, install line, requirements, rating, badge, QR on desktop).
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
        className={`relative isolate overflow-hidden rounded-3xl border border-brand/25 bg-gradient-to-b from-brand/[0.16] to-brand/[0.04] px-6 py-8 text-center sm:px-10 sm:py-10 ${className}`}
      >
        {/* soft glow behind the icon; decorative */}
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 -z-10 h-44 w-[30rem] max-w-full -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand/25 blur-3xl" />
        <img
          src="/icon-app-180.png"
          alt=""
          width={72}
          height={72}
          className="mx-auto h-[72px] w-[72px] rounded-[18px] shadow-[0_14px_34px_-10px_rgba(0,0,0,0.7)] ring-1 ring-white/10"
          loading="lazy"
          decoding="async"
        />
              {confirmation && (
                <p className="mt-4 flex items-center justify-center gap-1.5 text-[15px] font-bold text-brand">
                  <Check className="h-4 w-4" aria-hidden="true" />
                  {confirmation}
                </p>
              )}
              {title && <p className="mt-4 text-[17px] font-bold leading-snug text-white/90">{title}</p>}
        <p className="mx-auto mt-5 max-w-[28rem] text-[20px] font-bold leading-snug text-white [text-wrap:balance] sm:text-[22px]">
          {children ?? 'Pick a Bible verse and FaithWall puts it on your lock screen.'}
        </p>
              <p className="mt-2 text-[15px] leading-snug text-white/60 [text-wrap:balance]">{`iPhone · ${facts.minIOSText} · ${facts.installLine.replace(/\.$/, '')}`}</p>
              <RatingLine className="mt-1 justify-center text-[15px] leading-snug text-white/60" />
              {isAndroid && <p className="mt-1 text-[15px] leading-snug text-white/75">FaithWall is made for iPhone.</p>}
        {/* Apple's badge rules: clear space of at least a quarter of its height (14-16 px) on every side. */}
        <div className="mt-7 flex justify-center">
          <AppStoreButton size="xl" theme="light" href={href} />
        </div>
        <InstallHandoff collapsed className="mt-6" />
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
