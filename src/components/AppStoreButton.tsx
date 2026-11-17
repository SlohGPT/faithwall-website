import { ComponentProps } from 'react';

interface AppStoreButtonProps extends Omit<ComponentProps<'a'>, 'children'> {
    theme?: 'dark' | 'light';
    // 'md' = 44 px tall (compact spots: footer, inline nudge). 'cta' = 48 px on phones, 56 px from lg up: the size
    // for a CTA block, the same height as CTA_BUTTON_CLASS so a badge and a button side by side match.
    size?: 'md' | 'cta';
}

// The primary "Get FaithWall" button, sized to sit beside the cta badge: h-12 (48 px) on phones, 56 px from lg up.
export const CTA_BUTTON_CLASS =
    'inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-brand px-6 text-[1.0625rem] font-bold text-surface shadow-[0_10px_30px_-6px_rgba(217,123,59,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-light hover:shadow-[0_14px_36px_-6px_rgba(217,123,59,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:px-7 lg:h-14 lg:rounded-[14px] lg:px-9 lg:text-xl';

// Apple's official "Download on the App Store" badge (US-UK, SVG), served unmodified from /public/badges.
// The files' viewBox is 119.66407 x 40; scaled to 44 px tall that is 131.63 px wide (132 here), so the box is
// reserved up front (no layout shift). Apple's rules: never alter or recolor the artwork, keep it at least 40 px
// tall, leave clear space of at least a quarter of its height around it, one badge per card or section.
const BADGE_HEIGHT = 44;
const BADGE_WIDTH = Math.round((119.66407 / 40) * BADGE_HEIGHT); // 132
// The cta size is set by height in CSS (width:auto keeps the aspect ratio); the attributes reserve the 48 px box.
const CTA_BADGE_HEIGHT = 48;
const CTA_BADGE_WIDTH = Math.round((119.66407 / 40) * CTA_BADGE_HEIGHT); // 144

export default function AppStoreButton({ theme = 'light', size = 'md', className = '', ...props }: AppStoreButtonProps) {
    // theme 'light' = the white badge, theme 'dark' = the black badge.
    const src = theme === 'dark' ? '/badges/app-store-black.svg' : '/badges/app-store-white.svg';

    return (
        <a
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block shrink-0 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-[10px] ${className}`}
            {...props}
        >
            <img
                src={src}
                alt="Download on the App Store"
                width={size === 'cta' ? CTA_BADGE_WIDTH : BADGE_WIDTH}
                height={size === 'cta' ? CTA_BADGE_HEIGHT : BADGE_HEIGHT}
                className={size === 'cta' ? 'block h-12 w-auto lg:h-14' : 'block'}
                decoding="async"
            />
        </a>
    );
}
