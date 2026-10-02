import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, Pencil } from 'lucide-react';
import gallery from '../data/wallpaperGallery.json';

const SITE = 'https://faithwall.app';
const PAGE_URL = `${SITE}/bible-verse-wallpaper-maker`;

type Item = (typeof gallery)[number];

const THEMES = Array.from(new Set(gallery.map((g) => g.theme)));
const label = (theme: string) => theme.charAt(0).toUpperCase() + theme.slice(1);

function customizeHref(item: Item) {
  const params = new URLSearchParams({
    text: item.text,
    ref: item.ref,
    tr: item.translation,
    style: item.style,
    size: item.device === 'iphone' ? 'iphone' : 'desktop-4k',
  });
  return `/bible-verse-wallpaper-maker?${params.toString()}`;
}

function Tile({ item }: { item: Item }) {
  return (
    <figure className="min-w-0 flex flex-col rounded-2xl bg-surface-card border border-white/10 overflow-hidden">
      <img
        src={item.thumb}
        alt={item.alt}
        width={item.thumbWidth}
        height={item.thumbHeight}
        loading="lazy"
        decoding="async"
        className="w-full h-auto block bg-surface-elevated"
      />
      <figcaption className="p-3">
        <p className="text-sm font-semibold text-white">
          {item.ref} <span className="text-white/50 font-normal">{item.translation}</span>
        </p>
        <p className="text-xs text-white/50 mb-3">{label(item.theme)}</p>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={item.file}
            download
            className="inline-flex items-center justify-center gap-1 rounded-full bg-brand px-2 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark transition-colors"
          >
            <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            Download
          </a>
          <a
            href={customizeHref(item)}
            rel="nofollow"
            className="inline-flex items-center justify-center gap-1 rounded-full bg-surface-elevated px-2 py-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors"
          >
            <Pencil className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            Customize
          </a>
        </div>
      </figcaption>
    </figure>
  );
}

export default function WallpaperGallery() {
  const [theme, setTheme] = useState<string>('all');

  const imageSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      '@id': `${PAGE_URL}#wallpaper-gallery`,
      name: 'Ready-made Bible verse wallpapers',
      url: PAGE_URL,
      mainEntityOfPage: PAGE_URL,
      image: gallery.map((g) => ({
        '@type': 'ImageObject',
        contentUrl: `${SITE}${g.file}`,
        thumbnailUrl: `${SITE}${g.thumb}`,
        url: `${SITE}${g.file}`,
        name: `${g.ref} ${g.translation} Bible verse wallpaper`,
        description: g.alt,
        caption: `${g.ref} ${g.translation}: ${g.text}`,
        encodingFormat: 'image/jpeg',
        width: g.width,
        height: g.height,
        inLanguage: 'en',
        creator: { '@type': 'Organization', name: 'FaithWall', url: SITE },
        creditText: 'FaithWall',
        copyrightNotice: 'Verse text is the King James Version, which is in the public domain.',
      })),
    }),
    []
  );

  const visible = gallery.filter((g) => theme === 'all' || g.theme === theme);
  const phones = visible.filter((g) => g.device === 'iphone');
  const desktops = visible.filter((g) => g.device !== 'iphone');

  const pill = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
      active ? 'bg-brand text-white' : 'bg-surface-elevated text-white/60 hover:text-white'
    }`;

  return (
    <section className="mt-14" id="wallpaper-gallery" aria-labelledby="wg-heading">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(imageSchema)}</script>
      </Helmet>
      <h2 id="wg-heading" className="text-2xl md:text-3xl font-black text-white mb-3">
        Ready-made Bible verse wallpapers
      </h2>
      <p className="max-w-3xl text-white/75 leading-relaxed mb-6">
        Free to download and use. Each one is a full-size image: iPhone wallpapers are 1179 by 2556
        and the desktop ones are 4K. To use one on an iPhone, save it to Photos (open the image,
        touch and hold, then choose Add to Photos), open it in Photos, tap Share, then Use as
        Wallpaper. The verse sits lower than the middle on purpose, because the lock screen draws
        the date, clock and widgets over the top third of the picture. Tap Customize to open the
        same verse and style in the maker above and change anything.
      </p>

      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter wallpapers by theme">
        <button type="button" className={pill(theme === 'all')} aria-pressed={theme === 'all'} onClick={() => setTheme('all')}>
          All
        </button>
        {THEMES.map((t) => (
          <button key={t} type="button" className={pill(theme === t)} aria-pressed={theme === t} onClick={() => setTheme(t)}>
            {label(t)}
          </button>
        ))}
      </div>

      {phones.length > 0 && (
        <>
          <h3 className="text-lg font-bold text-white mb-3">iPhone lock screen wallpapers</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
            {phones.map((g) => (
              <Tile key={g.slug} item={g} />
            ))}
          </div>
        </>
      )}
      {desktops.length > 0 && (
        <>
          <h3 className="text-lg font-bold text-white mb-3">4K desktop and laptop wallpapers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {desktops.map((g) => (
              <Tile key={g.slug} item={g} />
            ))}
          </div>
        </>
      )}
      <p className="mt-6 text-xs text-white/50">
        Verse text is the King James Version, which is in the public domain.
      </p>
    </section>
  );
}
