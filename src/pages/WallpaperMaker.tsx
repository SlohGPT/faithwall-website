import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Shuffle, Download, Share2, Check } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import AppStoreButton from '../components/AppStoreButton';
import { appStoreUrl } from '../lib/appStore';
import AppNudge from '../components/AppNudge';
import AuthorBio from '../components/AuthorBio';
import WallpaperGallery from '../components/WallpaperGallery';
import verses from '../data/randomVerses.json';
import {
  DEFAULT_SIZE,
  DEFAULT_STYLE,
  MAX_REF,
  MAX_TEXT,
  MAX_TRANSLATION,
  SIZE_PRESETS,
  STYLE_PRESETS,
  drawWallpaper,
  fontLoadSpecs,
  parsePrefill,
  referenceLine,
  type Position,
  type SizeId,
  type StyleId,
} from '../lib/wallpaper';

const PAGE_URL = 'https://faithwall.app/bible-verse-wallpaper-maker';
const APP_STORE_URL = appStoreUrl('web-wallpaper-maker');
const TITLE = 'Bible Verse Wallpaper Maker — Free iPhone Lock Screen Generator';
const DESC =
  'Make a Bible verse wallpaper for your iPhone, Android or desktop in seconds. Pick a style, keep the verse clear of the lock-screen clock, and download the image.';

const DEFAULT_VERSE = verses[0];
const QUICK_PICKS = [
  'John 3:16',
  'Psalm 23:1',
  'Philippians 4:13',
  'Isaiah 41:10',
  'Jeremiah 29:11',
  'Joshua 1:9',
  'Psalm 46:1',
]
  .map((ref) => verses.find((v) => v.reference === ref))
  .filter((v): v is (typeof verses)[number] => Boolean(v));

const PREVIEW_LONG_EDGE = 1400;

const faqs = [
  {
    question: 'Is this Bible verse wallpaper maker free?',
    answer:
      'Yes. There is no account, no watermark and no limit on how many wallpapers you make. The image is drawn in your browser and nothing you type is uploaded.',
  },
  {
    question: 'Does the exported image include the clock guide?',
    answer:
      'No. The faint clock and button guide appears only in the on-screen preview so you can see where the iPhone lock screen will draw over the image. The file you save is just the background and the verse.',
  },
  {
    question: 'Which Bible translation can I use?',
    answer:
      'Type or paste any text and label it with any translation. The Random verse button and the quick picks use public-domain King James Version text. Many modern translations are copyrighted, so if you plan to post an image publicly, check the publisher’s quotation rules first.',
  },
  {
    question: 'Can I use my own photo as the background?',
    answer:
      'Not in this maker. Its backgrounds are generated colors and gradients, so every export is a clean, legible image. FaithWall, the iPhone app, can use your own photos, gradients, plain black or gray, or its 15 Faith Wallpapers behind a verse.',
  },
  {
    question: 'Why is the verse placed low on the iPhone wallpapers?',
    answer:
      'The iPhone lock screen draws the date, the clock and any widgets over roughly the top third of the image, and the flashlight and camera buttons sit at the bottom. On phone sizes the maker keeps the verse between those two zones. Use the Middle or Lower switch to nudge it within that space.',
  },
  {
    question: 'What is the difference between this maker and FaithWall?',
    answer:
      'This page makes one image that you set by hand. FaithWall is an iPhone app where you pick a verse (by reference or by search, in 24 translations) and it puts the verse on your lock screen as a wallpaper applied by an Apple Shortcut, or as a lock-screen widget that rotates your saved verses.',
  },
];

function pickRandom(excludeRef: string) {
  if (verses.length <= 1) return verses[0];
  let next = verses[Math.floor(Math.random() * verses.length)];
  while (next.reference === excludeRef) {
    next = verses[Math.floor(Math.random() * verses.length)];
  }
  return next;
}

async function ensureFonts(styleId: StyleId, sample: string) {
  if (typeof document === 'undefined' || !document.fonts) return;
  const style = STYLE_PRESETS.find((s) => s.id === styleId) ?? STYLE_PRESETS[0];
  try {
    await Promise.all(
      fontLoadSpecs(style, sample).map(([font, text]) => document.fonts.load(font, text))
    );
    await document.fonts.ready;
  } catch {
    // A failed font load falls back to the next family in the stack; drawing still works.
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

type ExportState = { url: string; filename: string; via: 'shared' | 'downloaded' } | null;

function FaithWallCta({ compact = false }: { compact?: boolean }) {
  return (
    <div className="my-10 p-8 rounded-3xl bg-gradient-to-br from-brand/20 to-brand-dark/10 border border-brand/30 text-center">
      <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
        {compact ? 'Skip the remake next time' : 'Put a verse on your lock screen without remaking it'}
      </h3>
      <p className="text-white/80 mb-4 max-w-2xl mx-auto">
        In FaithWall, an iPhone app, you pick the verse yourself, by book, chapter and verse or by
        search, in 24 translations. It then reaches your lock screen as a full-screen wallpaper
        applied by an Apple Shortcut, or as a lock-screen widget that rotates your saved verses
        hourly, every 8 hours, or daily.
      </p>
      {!compact && (
        <p className="text-white/70 mb-6 max-w-2xl mx-auto text-sm">
          Wallpaper backgrounds include 15 Faith Wallpapers, your own photos, gradients, and plain
          black or gray.
        </p>
      )}
      <div className="flex justify-center">
        <AppStoreButton href={APP_STORE_URL} theme="light" />
      </div>
    </div>
  );
}

export default function WallpaperMaker() {
  // Deterministic defaults so the server HTML and the first client render match.
  // Prefill from the URL and anything random happen only after mount or on click.
  const [text, setText] = useState(DEFAULT_VERSE.text);
  const [reference, setReference] = useState(DEFAULT_VERSE.reference);
  const [translation, setTranslation] = useState(DEFAULT_VERSE.translation);
  const [styleId, setStyleId] = useState<StyleId>(DEFAULT_STYLE);
  const [sizeId, setSizeId] = useState<SizeId>(DEFAULT_SIZE);
  const [position, setPosition] = useState<Position>('middle');
  const [showGuide, setShowGuide] = useState(true);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [exported, setExported] = useState<ExportState>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const exportUrlRef = useRef<string | null>(null);

  const size = SIZE_PRESETS.find((s) => s.id === sizeId) ?? SIZE_PRESETS[0];
  const style = STYLE_PRESETS.find((s) => s.id === styleId) ?? STYLE_PRESETS[0];
  const refText = referenceLine(reference, translation);
  const hasText = text.trim().length > 0;

  // Read ?text=&ref=&tr= once after mount. All three are optional plain text.
  useEffect(() => {
    const p = parsePrefill(window.location.search);
    if (p.style) setStyleId(p.style);
    if (p.size) setSizeId(p.size);
    if (p.hasText || p.ref) {
      setText(p.text);
      setReference(p.ref);
      // Never leave the default "KJV" label on a verse that arrived without one.
      setTranslation(p.hasTr ? p.tr : p.hasText ? '' : DEFAULT_VERSE.translation);
    } else if (p.hasTr) {
      setTranslation(p.tr);
    }
  }, []);

  // Live preview: draw at reduced resolution (same layout, scaled).
  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    (async () => {
      await ensureFonts(styleId, text + refText);
      if (cancelled) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const scale = Math.min(1, PREVIEW_LONG_EDGE / Math.max(size.width, size.height));
      canvas.width = Math.round(size.width * scale);
      canvas.height = Math.round(size.height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      drawWallpaper(ctx, { text, reference: refText, size, style, position });
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [text, refText, size, style, styleId, position]);

  // Release the last exported object URL when it is replaced or on unmount.
  useEffect(() => {
    return () => {
      if (exportUrlRef.current) revokeObjectUrl(exportUrlRef.current);
    };
  }, []);

  function applyVerse(v: { text: string; reference: string; translation: string }) {
    setText(v.text);
    setReference(v.reference);
    setTranslation(v.translation);
    setExported(null);
    setStatus('');
  }

  const renderFullSize = useCallback(async (): Promise<Blob | null> => {
    if (typeof document === 'undefined') return null;
    await ensureFonts(styleId, text + refText);
    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    drawWallpaper(ctx, { text, reference: refText, size, style, position });
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
  }, [styleId, text, refText, size, style, position]);

  function triggerDownload(url: string, filename: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function handleExport(mode: 'share' | 'download') {
    if (!hasText || busy) return;
    setBusy(true);
    setStatus('Rendering your wallpaper...');
    try {
      const blob = await renderFullSize();
      if (!blob) {
        setStatus('Your browser could not create the image. Try a different browser.');
        return;
      }
      const filename = `bible-verse-wallpaper-${slugify(reference) || 'verse'}-${size.id}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      if (exportUrlRef.current) revokeObjectUrl(exportUrlRef.current);
      const url = createObjectUrl(blob);
      exportUrlRef.current = url;

      let via: 'shared' | 'downloaded' = 'downloaded';
      const canShareFile =
        mode === 'share' &&
        typeof navigator !== 'undefined' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] });

      if (canShareFile) {
        try {
          await navigator.share({ files: [file], title: 'Bible verse wallpaper' });
          via = 'shared';
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') {
            setStatus('Share cancelled. Your image is still ready below.');
            setExported({ url, filename, via: 'downloaded' });
            return;
          }
          // Share sheet refused (for example the tap was too long ago): download instead.
          triggerDownload(url, filename);
        }
      } else {
        triggerDownload(url, filename);
      }

      setExported({ url, filename, via });
      setStatus(
        via === 'shared'
          ? 'Done. Choose Save Image in the share sheet to put it in Photos.'
          : 'Downloaded. Check your Downloads folder or Photos.'
      );
    } finally {
      setBusy(false);
    }
  }

  const breadcrumbSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://faithwall.app/' },
        { '@type': 'ListItem', position: 2, name: 'Bible Verse Wallpaper Maker', item: PAGE_URL },
      ],
    }),
    []
  );

  const appSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Bible Verse Wallpaper Maker',
      url: PAGE_URL,
      description: DESC,
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires a modern web browser with HTML5 canvas support',
      inLanguage: 'en',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: [
        'Wallpaper sizes for iPhone, iPhone Pro Max, Android and 4K desktop',
        'Seven generated styles, no stock photos',
        'Keeps text clear of the iPhone lock-screen clock and bottom buttons',
        'Runs in the browser; nothing is uploaded',
      ],
      author: {
        '@type': 'Person',
        name: 'Karol Billik',
        url: 'https://faithwall.app/about/karol-billik',
        jobTitle: 'Founder',
        worksFor: { '@type': 'Organization', name: 'FaithWall' },
      },
      publisher: {
        '@type': 'Organization',
        name: 'FaithWall',
        logo: { '@type': 'ImageObject', url: 'https://faithwall.app/icon-app-512.png' },
      },
    }),
    []
  );

  const pill = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
      active ? 'bg-brand text-white' : 'bg-surface-elevated text-white/60 hover:text-white'
    }`;

  const previewWidthClass = size.phone ? 'w-[250px] sm:w-[290px]' : 'w-full';

  return (
    <div className="min-h-screen bg-surface">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:image" content="https://faithwall.app/og-image.png" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://faithwall.app/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(appSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <Navigation />

      <main className="container-main pt-28 md:pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Breadcrumbs
              crumbs={[{ label: 'Home', to: '/' }, { label: 'Bible Verse Wallpaper Maker' }]}
            />
          </div>

          <header className="mb-10 max-w-3xl">
            <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Free Tool</p>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Bible Verse Wallpaper Maker
            </h1>
            <p className="mt-5 text-lg text-white/70 leading-relaxed">
              Type or pick a verse, choose a style and a screen size, and download a wallpaper for your
              iPhone lock screen, your Android phone or your desktop. On phone sizes the verse stays
              clear of the clock and the bottom buttons.
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Preview */}
            <div className="lg:sticky lg:top-28">
              <div className={`mx-auto ${previewWidthClass}`}>
                <div
                  className="relative rounded-[1.75rem] overflow-hidden border-2 border-brand/30 bg-black shadow-2xl"
                  style={{ aspectRatio: `${size.width} / ${size.height}` }}
                >
                  {/* Static placeholder: this is what the prerendered HTML shows until the canvas draws. */}
                  {!ready && (
                    <div
                      className="absolute inset-x-0 flex items-center justify-center px-[9%] text-center"
                      style={{ top: '35%', bottom: '12%' }}
                    >
                      <div>
                        <p className="text-white font-serif text-base sm:text-lg leading-snug">{text}</p>
                        <p className="mt-3 text-white/60 text-xs">{refText}</p>
                      </div>
                    </div>
                  )}
                  <canvas
                    ref={canvasRef}
                    role="img"
                    aria-label={`Wallpaper preview: ${text} ${refText}`}
                    className={`absolute inset-0 w-full h-full ${ready ? '' : 'opacity-0'}`}
                  />
                  {showGuide && size.phone && (
                    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                      <div
                        className="absolute inset-x-0 top-0 border-b border-dashed border-gray-400/60 bg-gray-500/15 text-center"
                        style={{ height: '35%' }}
                      >
                        <p className="mt-[14%] text-5xl font-light leading-none text-gray-400/90">9:41</p>
                        <p className="mt-3 text-[9px] uppercase tracking-widest text-gray-400/80">
                          Clock and widgets
                        </p>
                      </div>
                      <div
                        className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-dashed border-gray-400/60 bg-gray-500/15 px-[9%]"
                        style={{ height: '12%' }}
                      >
                        <span className="w-9 h-9 rounded-full bg-gray-500/30" />
                        <span className="w-9 h-9 rounded-full bg-gray-500/30" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-white/50">
                Preview at {size.width}×{size.height}px
                {showGuide && size.phone ? ', guide shown only here' : ''}
              </p>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div>
                <label htmlFor="wm-text" className="block text-sm font-semibold text-white mb-2">
                  Verse text
                </label>
                <textarea
                  id="wm-text"
                  value={text}
                  maxLength={MAX_TEXT}
                  rows={4}
                  onChange={(e) => {
                    setText(e.target.value);
                    setExported(null);
                  }}
                  className="w-full rounded-xl bg-surface-card border border-surface-border focus:border-brand/60 focus:outline-none px-4 py-3 text-white placeholder-white/30 leading-relaxed"
                  placeholder="Type or paste a verse"
                />
                <div className="mt-1 text-right text-xs text-white/40">
                  {text.length}/{MAX_TEXT}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label htmlFor="wm-ref" className="block text-sm font-semibold text-white mb-2">
                    Reference
                  </label>
                  <input
                    id="wm-ref"
                    type="text"
                    value={reference}
                    maxLength={MAX_REF}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full rounded-xl bg-surface-card border border-surface-border focus:border-brand/60 focus:outline-none px-4 py-2.5 text-white placeholder-white/30"
                    placeholder="John 3:16"
                  />
                </div>
                <div>
                  <label htmlFor="wm-tr" className="block text-sm font-semibold text-white mb-2">
                    Translation
                  </label>
                  <input
                    id="wm-tr"
                    type="text"
                    value={translation}
                    maxLength={MAX_TRANSLATION}
                    onChange={(e) => setTranslation(e.target.value)}
                    className="w-full rounded-xl bg-surface-card border border-surface-border focus:border-brand/60 focus:outline-none px-4 py-2.5 text-white placeholder-white/30"
                    placeholder="KJV"
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => applyVerse(pickRandom(reference))}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-elevated text-white font-semibold border border-surface-border hover:border-brand/50 transition-colors"
                  >
                    <Shuffle className="w-4 h-4" aria-hidden="true" />
                    Random verse
                  </button>
                  {QUICK_PICKS.map((v) => (
                    <button
                      key={v.reference}
                      type="button"
                      onClick={() => applyVerse(v)}
                      aria-pressed={reference === v.reference && text === v.text}
                      className={pill(reference === v.reference && text === v.text)}
                    >
                      {v.reference}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-white/40">
                  Random and quick picks use public-domain KJV text.
                </p>
              </div>

              <fieldset>
                <legend className="text-sm font-semibold text-white mb-2">Style</legend>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {STYLE_PRESETS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStyleId(s.id)}
                      aria-pressed={styleId === s.id}
                      aria-label={s.label}
                      className="group text-center"
                    >
                      <span
                        className={`block aspect-[3/4] rounded-lg border-2 transition-colors ${
                          styleId === s.id ? 'border-brand' : 'border-surface-border group-hover:border-white/30'
                        }`}
                        style={{ background: s.swatch }}
                      />
                      <span
                        className={`mt-1 block text-[10px] leading-tight ${
                          styleId === s.id ? 'text-white' : 'text-white/50'
                        }`}
                      >
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-semibold text-white mb-2">Size</legend>
                <div className="flex flex-wrap gap-2">
                  {SIZE_PRESETS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSizeId(s.id);
                        setExported(null);
                      }}
                      aria-pressed={sizeId === s.id}
                      className={pill(sizeId === s.id)}
                    >
                      {s.label}{' '}
                      <span className="opacity-70">
                        {s.width}×{s.height}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <fieldset>
                  <legend className="text-sm font-semibold text-white mb-2">Verse position</legend>
                  <div className="flex gap-2">
                    {(['middle', 'lower'] as Position[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPosition(p)}
                        aria-pressed={position === p}
                        className={`${pill(position === p)} capitalize`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </fieldset>
                {size.phone && (
                  <label className="inline-flex items-center gap-2 text-sm text-white/70 cursor-pointer mt-5">
                    <input
                      type="checkbox"
                      checked={showGuide}
                      onChange={(e) => setShowGuide(e.target.checked)}
                      className="accent-[#D97B3B] w-4 h-4"
                    />
                    Show clock guide (preview only)
                  </label>
                )}
              </div>

              <div className="pt-2">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleExport('share')}
                    disabled={!hasText || busy}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                    Save or share image
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport('download')}
                    disabled={!hasText || busy}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-elevated text-white font-semibold border border-surface-border hover:border-brand/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    Download PNG
                  </button>
                </div>
                <p className="mt-3 min-h-[1.25rem] text-sm text-white/60" role="status" aria-live="polite">
                  {status}
                </p>
                {exported && (
                  <AppNudge campaign="web-wallpaper-maker-saved" confirmation="Saved" className="mt-2">
                    Instead of remaking a wallpaper every time, FaithWall rotates the verses you pick on
                    your lock screen automatically.
                  </AppNudge>
                )}
                <AppNudge campaign="web-wallpaper-maker-inline" variant="inline" className="mt-2">
                  Want a verse on your lock screen without remaking it? FaithWall is an iPhone app that
                  rotates the verses you pick.
                </AppNudge>
              </div>
            </div>
          </div>

          {exported && (
            <section
              className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-surface-card to-surface-elevated border-2 border-brand/30"
              aria-labelledby="wm-next"
            >
              <h2 id="wm-next" className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
                <Check className="w-6 h-6 text-brand" aria-hidden="true" />
                Now set it as your wallpaper
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-white/75 leading-relaxed">
                <div>
                  <p className="font-bold text-white mb-2">iPhone</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Choose Save Image in the share sheet (or use Download PNG).</li>
                    <li>Open Photos, open the image, tap Share, then Use as Wallpaper.</li>
                    <li>Or go to Settings, Wallpaper, Add New Wallpaper, Photos and pick it.</li>
                    <li>Leave the preview as it is; the image already fits the screen.</li>
                  </ol>
                </div>
                <div>
                  <p className="font-bold text-white mb-2">Android</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Open the image in Photos or Gallery.</li>
                    <li>Tap the three-dot menu and choose Set as wallpaper.</li>
                    <li>Pick Lock screen, Home screen or both.</li>
                  </ol>
                </div>
                <div>
                  <p className="font-bold text-white mb-2">Desktop or laptop</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Windows: right-click the file and choose Set as desktop background.</li>
                    <li>Mac: System Settings, Wallpaper, Add Photo.</li>
                  </ol>
                </div>
              </div>
              <p className="mt-5 text-xs text-white/50">
                Need the file again?{' '}
                <a
                  href={exported.url}
                  download={exported.filename}
                  className="text-brand hover:text-brand-light underline underline-offset-2"
                >
                  Download {exported.filename}
                </a>
              </p>
              <FaithWallCta compact />
            </section>
          )}

          <p className="mt-10 max-w-3xl text-lg text-white/80 leading-relaxed">
            <strong className="text-white">Quick answer:</strong> this free Bible verse wallpaper maker
            turns any verse into a phone or desktop image in your browser, with a layout that keeps the
            text clear of the iPhone lock-screen clock and bottom buttons, and exports it as a PNG with
            nothing uploaded.
          </p>

          <WallpaperGallery />

          <div className="max-w-3xl mt-14 space-y-12">
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
                How do I make a Bible verse wallpaper for iPhone?
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Type or paste a verse, add the reference, pick a style and the iPhone size, then save the
                image. The maker above draws it on a canvas in your browser, keeps the words out of the
                clock area, and exports a PNG you can set as your lock screen from Photos in a few taps.
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-white/75 leading-relaxed">
                <li>
                  Enter the verse, or tap Random verse or a quick pick. The reference goes on its own line
                  under the text.
                </li>
                <li>Choose a style. Black, navy and gold, and cream paper are the easiest to read.</li>
                <li>
                  Leave the size on iPhone, and switch the verse between Middle and Lower if you want it
                  higher or lower on the screen.
                </li>
                <li>Tap Save or share image, then follow the steps that appear for your device.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
                What size should an iPhone lock screen wallpaper be?
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Use an image with the same shape as your screen. For recent standard iPhones that is
                1179×2556 pixels, and Pro Max and Plus models use 1290×2796. Newer iPhones differ by a few
                percent, and iOS scales a same-shaped image to fit, so the two iPhone presets here work
                across models.
              </p>
              <p className="text-white/75 leading-relaxed">
                Android phones commonly use 1080×2400, and a 4K desktop or laptop screen is 3840×2160. A
                larger image never hurts, but a different shape does: iOS and Android crop a wallpaper
                that does not match the screen's proportions, which is how verses end up cut off at the
                edges.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
                Where should I put the text so the clock doesn't cover it?
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Keep the verse out of the top third, where the lock-screen date, clock and widgets sit,
                and out of the bottom ten percent, where the flashlight and camera buttons are. On phone
                sizes this tool reserves the top 35% and bottom 12%, then centers or lowers the verse in
                the space between.
              </p>
              <p className="text-white/75 leading-relaxed">
                Long verses shrink to fit that space rather than running under the clock, so a short
                promise gets large type and a full psalm verse gets smaller type. If you want to see the
                zones, switch on the clock guide in the preview. It is never part of the exported image.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
                How do I set a Bible verse image as my lock screen?
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                On iPhone, save the image to Photos, open it, tap Share, then Use as Wallpaper. You can
                also go to Settings, Wallpaper, Add New Wallpaper, then Photos. On Android, open the image
                in your gallery, tap the menu, choose Set as wallpaper, and pick Lock screen.
              </p>
              <p className="text-white/75 leading-relaxed">
                iOS also lets you choose whether the same image appears on your Home Screen. A fuller
                walkthrough, including the free ways to find verse images, is in our guide to a{' '}
                <Link
                  to="/blog/scripture-wallpaper-for-iphone-free"
                  className="text-brand hover:text-brand-light underline underline-offset-2"
                >
                  scripture wallpaper for iPhone
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
                Can I make a Bible verse wallpaper for desktop, laptop or Android?
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Yes. Choose the Android preset (1080×2400) for most phones, or Desktop / laptop 4K
                (3840×2160) for a widescreen background. The clock-and-button spacing applies only to
                phone sizes, so a desktop verse is centered in a wide margin instead. Pure black and bold
                sans both work well for dark desktops.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
                How can I get a new Bible verse every day without remaking the wallpaper?
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                A wallpaper you make by hand stays the same until you rebuild it. FaithWall, an iPhone
                app, takes over that chore: you choose a verse in the app, and it reaches your lock screen
                as a full-screen wallpaper or a rotating widget, so you stop opening an editor every time
                you want a different verse.
              </p>
              <p className="text-white/75 leading-relaxed mb-4">
                You pick the verse yourself, by book, chapter and verse or by search, in 24 translations.
                From there it gets onto the lock screen one of two ways: as a full-screen wallpaper that an
                Apple Shortcut applies, or as a lock-screen widget that rotates your saved verses hourly,
                every 8 hours, or daily. Wallpaper backgrounds include 15 Faith Wallpapers, your own
                photos, gradients, and plain black or gray.
              </p>
              <p className="text-white/75 leading-relaxed">
                Want to compare options first? See the{' '}
                <Link
                  to="/best-bible-verse-lock-screen-apps"
                  className="text-brand hover:text-brand-light underline underline-offset-2"
                >
                  best Bible verse lock screen apps
                </Link>
                , the{' '}
                <Link
                  to="/daily-scripture-lock-screen"
                  className="text-brand hover:text-brand-light underline underline-offset-2"
                >
                  daily Scripture lock screen guide
                </Link>
                , or the{' '}
                <Link
                  to="/random-bible-verse"
                  className="text-brand hover:text-brand-light underline underline-offset-2"
                >
                  random Bible verse generator
                </Link>{' '}
                if you need a verse to start with.
              </p>
            </section>
          </div>

          <div className="max-w-3xl">
            <FaithWallCta />

            <section className="mt-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-5">
                Frequently asked questions
              </h2>
              <div className="space-y-4">
                {faqs.map((item) => (
                  <div
                    key={item.question}
                    className="p-5 rounded-xl bg-surface-card border border-surface-border"
                  >
                    <p className="font-bold text-white mb-2">{item.question}</p>
                    <p className="text-white/75 leading-relaxed text-sm">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <AuthorBio />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Object URLs only exist in the browser; these wrappers keep every call site SSR-safe.
function createObjectUrl(blob: Blob): string {
  return window.URL.createObjectURL(blob);
}
function revokeObjectUrl(url: string) {
  if (typeof window !== 'undefined') window.URL.revokeObjectURL(url);
}
