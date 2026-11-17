import { coverSources } from '../lib/covers';

interface Props {
  /** The cover jpg (the fallback, og:image and schema image). Variants are found by naming convention. */
  src: string;
  alt: string;
  /** Variant widths to offer, for example HERO_WIDTHS. */
  widths: number[];
  sizes: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  /** fetchpriority=high: the post hero only. */
  priority?: boolean;
}

/** Real pixel size of every generated cover (1600 x 1067); CSS aspect-ratio sets the displayed crop. */
export const COVER_W = 1600;
export const COVER_H = 1067;

export default function CoverPicture({ src, alt, widths, sizes, className, loading = 'lazy', priority = false }: Props) {
  const s = coverSources(src, widths);
  return (
    <picture>
      {s && <source type="image/avif" srcSet={s.avifSrcSet} sizes={sizes} />}
      {s && <source type="image/webp" srcSet={s.webpSrcSet} sizes={sizes} />}
      <img
        src={src}
        alt={alt}
        width={COVER_W}
        height={COVER_H}
        className={className}
        loading={loading}
        decoding="async"
        // React 18 only knows the lowercase attribute (same workaround as the Hero image).
        {...(priority ? { fetchpriority: 'high' } : {})}
      />
    </picture>
  );
}
