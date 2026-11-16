import { ComponentProps } from 'react';

interface AppStoreButtonProps extends Omit<ComponentProps<'a'>, 'children'> {
    theme?: 'dark' | 'light';
}

// Apple's official "Download on the App Store" badge (US-UK, SVG), served unmodified from /public/badges.
// The files' viewBox is 119.66407 x 40; scaled to 44 px tall that is 131.63 px wide (132 here), so the box is
// reserved up front (no layout shift). Apple's rules: never alter or recolor the artwork, keep it at least 40 px
// tall, leave clear space of at least a quarter of its height around it, one badge per card or section.
const BADGE_HEIGHT = 44;
const BADGE_WIDTH = Math.round((119.66407 / 40) * BADGE_HEIGHT); // 132

export default function AppStoreButton({ theme = 'light', className = '', ...props }: AppStoreButtonProps) {
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
                width={BADGE_WIDTH}
                height={BADGE_HEIGHT}
                className="block"
                decoding="async"
            />
        </a>
    );
}
