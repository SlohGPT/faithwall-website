import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Shuffle,
  Download,
  Share2,
  Check,
  ImagePlus,
  Upload,
  Lock,
  RotateCcw,
  Trash2,
  Sun,
  Moon,
  Smartphone,
  Monitor,
} from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import AppStoreButton from '../components/AppStoreButton';
import { appStoreUrl } from '../lib/appStore';
import AppNudge from '../components/AppNudge';
import AuthorBio from '../components/AuthorBio';
import WallpaperGallery from '../components/WallpaperGallery';
import DeviceMockup, { type DeviceKind } from '../components/DeviceMockup';
import { loadPhotoFile, type LoadedPhoto } from '../lib/photo';
import verses from '../data/randomVerses.json';
import {
  DEFAULT_SIZE,
  DEFAULT_STYLE,
  MAX_REF,
  MAX_TEXT,
  MAX_TRANSLATION,
  PHOTO_DEFAULTS,
  PHOTO_MAX_DIM,
  PHOTO_MAX_ZOOM,
  SIZE_PRESETS,
  STYLE_PRESETS,
  drawWallpaper,
  fontLoadSpecs,
  parsePrefill,
  photoCoverRect,
  photoTextStyle,
  referenceLine,
  type PhotoBackground,
  type Position,
  type SizeId,
  type StyleId,
  type TextTone,
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

/** Typography choices offered when the background is the visitor's photo. */
const PHOTO_LETTERING: Array<{ id: StyleId; label: string }> = [
  { id: 'black', label: 'Serif' },
  { id: 'sunrise', label: 'Italic serif' },
  { id: 'dark-gradient', label: 'Sans' },
  { id: 'bold-sans', label: 'Bold' },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface';
const fieldClass = `w-full rounded-xl bg-surface-card border border-surface-border focus:border-brand/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 text-white placeholder-white/30`;
const groupCard = 'rounded-3xl border border-surface-border bg-surface-card/60 p-5 sm:p-6 space-y-4';

/** True for light backgrounds such as cream paper and white, so the lock-screen UI turns dark. */
function isLightBackground(color: string) {
  const m = /^#([0-9a-f]{6})$/i.exec(color);
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.62;
}

function GroupHeading({ n, id, title }: { n: number; id: string; title: string }) {
  return (
    <p id={id} className="flex items-center gap-3 text-lg font-bold text-white">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm font-black text-white"
      >
        {n}
      </span>
      {title}
    </p>
  );
}

function RangeField({
  id,
  label,
  min,
  max,
  step,
  value,
  display,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  disabled?: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <div className={disabled ? 'opacity-40' : ''}>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <label htmlFor={id} className="font-semibold text-white">
          {label}
        </label>
        <span className="text-xs tabular-nums text-white/50">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`h-2 w-full cursor-pointer rounded-full accent-[#D97B3B] disabled:cursor-not-allowed ${focusRing}`}
      />
    </div>
  );
}

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

  // "Your photo" background. The decoded photo lives only in this component's memory.
  const [bgMode, setBgMode] = useState<'style' | 'photo'>('style');
  const [photo, setPhoto] = useState<LoadedPhoto | null>(null);
  const [photoError, setPhotoError] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);
  const [zoom, setZoom] = useState<number>(PHOTO_DEFAULTS.zoom);
  const [focusX, setFocusX] = useState<number>(PHOTO_DEFAULTS.focusX);
  const [focusY, setFocusY] = useState<number>(PHOTO_DEFAULTS.focusY);
  const [dim, setDim] = useState<number>(PHOTO_DEFAULTS.dim);
  const [blur, setBlur] = useState<number>(PHOTO_DEFAULTS.blur);
  const [tone, setTone] = useState<TextTone>(PHOTO_DEFAULTS.textTone);
  const [photoTypeId, setPhotoTypeId] = useState<StyleId>('black');
  const [pickRequest, setPickRequest] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dateLabel, setDateLabel] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; fx: number; fy: number; id: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const exportUrlRef = useRef<string | null>(null);

  const size = SIZE_PRESETS.find((s) => s.id === sizeId) ?? SIZE_PRESETS[0];
  const photoMode = bgMode === 'photo';
  const activeStyleId = photoMode ? photoTypeId : styleId;
  const baseStyle = STYLE_PRESETS.find((s) => s.id === activeStyleId) ?? STYLE_PRESETS[0];
  // Photo mode before a photo is chosen: show the lettering on a neutral dark backdrop.
  const style = useMemo(
    () =>
      photoMode && !photo
        ? photoTextStyle({ ...baseStyle, background: ['#101016'] }, 'light')
        : baseStyle,
    [photoMode, photo, baseStyle]
  );
  const photoBg = useMemo<PhotoBackground | undefined>(
    () =>
      photoMode && photo
        ? { image: photo.image, zoom, focusX, focusY, dim, blur, textTone: tone }
        : undefined,
    [photoMode, photo, zoom, focusX, focusY, dim, blur, tone]
  );
  // Keeps sliders and dragging smooth: the canvas redraws a beat behind the controls.
  const deferredPhotoBg = useDeferredValue(photoBg);
  const deviceKind: DeviceKind = size.id === 'desktop-4k' ? 'desktop' : size.id === 'android' ? 'android' : 'iphone';
  const uiTone: 'light' | 'dark' = photoMode
    ? photoBg
      ? tone === 'dark'
        ? 'dark'
        : 'light'
      : 'light'
    : isLightBackground(style.background[0])
      ? 'dark'
      : 'light';
  const photoRect = photo
    ? photoCoverRect(photo.width, photo.height, size.width, size.height, zoom, focusX, focusY)
    : null;
  const canMoveX = !!photoRect && photoRect.width - size.width > 1;
  const canMoveY = !!photoRect && photoRect.height - size.height > 1;
  const canDrag = !!photoBg && (canMoveX || canMoveY);
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

  // The lock-screen mockup shows the visitor's own date. Client-only, so the prerendered HTML stays static.
  useEffect(() => {
    setDateLabel(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
  }, []);

  // Open the file chooser when the "Your photo" chip is picked with no photo yet.
  useEffect(() => {
    if (pickRequest > 0) fileInputRef.current?.click();
  }, [pickRequest]);

  // Live preview: draw at reduced resolution (same layout, scaled).
  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    (async () => {
      await ensureFonts(activeStyleId, text + refText);
      if (cancelled) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const scale = Math.min(1, PREVIEW_LONG_EDGE / Math.max(size.width, size.height));
      canvas.width = Math.round(size.width * scale);
      canvas.height = Math.round(size.height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      drawWallpaper(ctx, { text, reference: refText, size, style, position, photo: deferredPhotoBg });
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [text, refText, size, style, activeStyleId, position, deferredPhotoBg]);

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
    await ensureFonts(activeStyleId, text + refText);
    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    drawWallpaper(ctx, { text, reference: refText, size, style, position, photo: photoBg });
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
  }, [activeStyleId, text, refText, size, style, position, photoBg]);

  async function handlePhotoFile(file: File) {
    setPhotoError('');
    setPhotoLoading(true);
    try {
      const loaded = await loadPhotoFile(file);
      setPhoto(loaded);
      setBgMode('photo');
      resetPhotoAdjustments();
      setExported(null);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'We could not open that photo. Try a JPG or PNG.');
    } finally {
      setPhotoLoading(false);
    }
  }

  function resetPhotoAdjustments() {
    setZoom(PHOTO_DEFAULTS.zoom);
    setFocusX(PHOTO_DEFAULTS.focusX);
    setFocusY(PHOTO_DEFAULTS.focusY);
    setDim(PHOTO_DEFAULTS.dim);
    setBlur(PHOTO_DEFAULTS.blur);
    setTone(PHOTO_DEFAULTS.textTone);
  }

  function removePhoto() {
    setPhoto(null);
    setPhotoError('');
    setExported(null);
  }

  // Drag the preview to move the photo. Sliders do the same for keyboard and assistive tech users.
  function handleDragStart(e: React.PointerEvent<HTMLDivElement>) {
    if (!canDrag || e.button > 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, fx: focusX, fy: focusY, id: e.pointerId };
    setDragging(true);
  }
  function handleDragMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId || !photoRect) return;
    const box = e.currentTarget.getBoundingClientRect();
    const toCanvas = size.width / box.width;
    const slackX = size.width - photoRect.width; // zero or negative
    const slackY = size.height - photoRect.height;
    if (slackX < -1) setFocusX(Math.min(1, Math.max(0, d.fx + ((e.clientX - d.x) * toCanvas) / slackX)));
    if (slackY < -1) setFocusY(Math.min(1, Math.max(0, d.fy + ((e.clientY - d.y) * toCanvas) / slackY)));
  }
  function handleDragEnd(e: React.PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.id === e.pointerId) {
      dragRef.current = null;
      setDragging(false);
    }
  }

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
    `px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${focusRing} ${
      active ? 'bg-brand text-white' : 'bg-surface-elevated text-white/60 hover:text-white'
    }`;

  // Phones: as wide as the viewport height allows so the sticky preview never runs off-screen.
  const previewWidthClass = size.phone
    ? 'w-[min(17rem,78vw)] lg:w-[clamp(13rem,calc((100svh_-_11rem)/2.2),20rem)]'
    : 'w-full max-w-xl';

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

      <main className="container-main overflow-visible overflow-x-clip pt-28 md:pt-32 pb-20">
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

          <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-8 lg:gap-12 items-start">
            {/* Preview */}
            <div className="lg:sticky lg:top-24 self-start">
              <div className={`mx-auto ${previewWidthClass}`}>
                <DeviceMockup
                  device={deviceKind}
                  width={size.width}
                  height={size.height}
                  showUi={showGuide}
                  uiTone={uiTone}
                  dateLabel={dateLabel}
                  screenProps={{
                    onPointerDown: handleDragStart,
                    onPointerMove: handleDragMove,
                    onPointerUp: handleDragEnd,
                    onPointerCancel: handleDragEnd,
                  }}
                  screenStyle={
                    canDrag ? { cursor: dragging ? 'grabbing' : 'grab', touchAction: 'none' } : undefined
                  }
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
                </DeviceMockup>
              </div>
              <p className="mt-4 text-center text-xs text-white/50">
                Preview at {size.width}×{size.height}px, drawn exactly like the download
                {showGuide ? '. The frame and lock-screen UI are shown only here' : ''}
              </p>
              {canDrag && (
                <p className="mt-1 text-center text-xs text-brand-light">
                  Drag the preview to move your photo
                </p>
              )}
              <label className="mt-3 flex items-center justify-center gap-2 text-sm text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGuide}
                  onChange={(e) => setShowGuide(e.target.checked)}
                  className={`accent-[#D97B3B] w-4 h-4 rounded ${focusRing}`}
                />
                {size.phone ? 'Show clock guide (preview only)' : 'Show menu bar and dock (preview only)'}
              </label>
            </div>

            {/* Controls */}
            <div className="space-y-5 min-w-0">
              {/* 1. Verse */}
              <section aria-labelledby="wm-step-verse" className={groupCard}>
                <GroupHeading n={1} id="wm-step-verse" title="Verse" />
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
                    className={`${fieldClass} px-4 py-3 leading-relaxed`}
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
                      className={`${fieldClass} px-4 py-2.5`}
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
                      className={`${fieldClass} px-4 py-2.5`}
                      placeholder="KJV"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => applyVerse(pickRandom(reference))}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-elevated text-white text-sm font-semibold border border-surface-border hover:border-brand/50 transition-colors ${focusRing}`}
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
              </section>

              {/* 2. Background */}
              <section aria-labelledby="wm-step-bg" className={groupCard}>
                <GroupHeading n={2} id="wm-step-bg" title="Background" />
                <fieldset>
                  <legend className="sr-only">Background style</legend>
                  <div className="grid grid-cols-4 gap-2.5">
                    {STYLE_PRESETS.map((s) => {
                      const active = bgMode === 'style' && styleId === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setStyleId(s.id);
                            setBgMode('style');
                          }}
                          aria-pressed={active}
                          aria-label={s.label}
                          className={`group rounded-2xl p-1.5 text-center transition-colors ${focusRing} ${
                            active ? 'bg-brand/15 ring-2 ring-brand' : 'hover:bg-white/5'
                          }`}
                        >
                          <span
                            className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl border border-white/10"
                            style={{ background: s.swatch }}
                          >
                            <span
                              aria-hidden="true"
                              style={{
                                color: s.textColor,
                                fontFamily: s.family,
                                fontStyle: s.italic ? 'italic' : 'normal',
                                fontWeight: s.weight,
                                fontSize: '1.35rem',
                                textShadow: s.shadow ? `0 1px 6px ${s.shadow}` : undefined,
                              }}
                            >
                              Aa
                            </span>
                            {active && (
                              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
                                <Check className="h-3 w-3" aria-hidden="true" />
                              </span>
                            )}
                          </span>
                          <span
                            className={`mt-1.5 block text-[11px] leading-tight ${
                              active ? 'text-white font-semibold' : 'text-white/55'
                            }`}
                          >
                            {s.label}
                          </span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        setBgMode('photo');
                        if (!photo) setPickRequest((n) => n + 1);
                      }}
                      aria-pressed={bgMode === 'photo'}
                      aria-label="Your photo"
                      className={`group rounded-2xl p-1.5 text-center transition-colors ${focusRing} ${
                        bgMode === 'photo' ? 'bg-brand/15 ring-2 ring-brand' : 'hover:bg-white/5'
                      }`}
                    >
                      <span className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl border border-dashed border-brand/60 bg-gradient-to-br from-brand/25 via-surface-elevated to-surface-card text-brand-light">
                        <ImagePlus className="h-6 w-6" aria-hidden="true" />
                        {bgMode === 'photo' && (
                          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
                            <Check className="h-3 w-3" aria-hidden="true" />
                          </span>
                        )}
                      </span>
                      <span
                        className={`mt-1.5 block text-[11px] leading-tight ${
                          bgMode === 'photo' ? 'text-white font-semibold' : 'text-white/55'
                        }`}
                      >
                        Your photo
                      </span>
                    </button>
                  </div>
                </fieldset>

                {bgMode === 'photo' && (
                  <div className="space-y-4 rounded-2xl border border-surface-border bg-surface-elevated/60 p-4">
                    <div>
                      <input
                        ref={fileInputRef}
                        id="wm-photo"
                        type="file"
                        accept="image/*"
                        className="peer sr-only"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void handlePhotoFile(f);
                          e.target.value = '';
                        }}
                      />
                      <label
                        htmlFor="wm-photo"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const f = e.dataTransfer.files?.[0];
                          if (f) void handlePhotoFile(f);
                        }}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-brand/50 bg-brand/5 px-4 py-3 text-sm text-white transition-colors hover:bg-brand/10 peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface"
                      >
                        <Upload className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block font-semibold">
                            {photoLoading ? 'Opening photo...' : photo ? 'Choose a different photo' : 'Choose a photo'}
                          </span>
                          <span className="block truncate text-xs text-white/50">
                            {photo ? photo.name : 'JPG, PNG or WebP from your device'}
                          </span>
                        </span>
                      </label>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-white/60">
                        <Lock className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                        Your photo never leaves your device.
                      </p>
                      {photoError && (
                        <p role="alert" className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
                          {photoError}
                        </p>
                      )}
                    </div>

                    {photo && (
                      <>
                        <RangeField
                          id="wm-zoom"
                          label="Zoom"
                          min={1}
                          max={PHOTO_MAX_ZOOM}
                          step={0.01}
                          value={zoom}
                          display={`${Math.round(zoom * 100)}%`}
                          onChange={setZoom}
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <RangeField
                            id="wm-fx"
                            label="Left / right"
                            min={0}
                            max={1}
                            step={0.01}
                            value={focusX}
                            display={`${Math.round(focusX * 100)}%`}
                            disabled={!canMoveX}
                            onChange={setFocusX}
                          />
                          <RangeField
                            id="wm-fy"
                            label="Up / down"
                            min={0}
                            max={1}
                            step={0.01}
                            value={focusY}
                            display={`${Math.round(focusY * 100)}%`}
                            disabled={!canMoveY}
                            onChange={setFocusY}
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <RangeField
                            id="wm-dim"
                            label={tone === 'light' ? 'Darken for readability' : 'Lighten for readability'}
                            min={0}
                            max={PHOTO_MAX_DIM}
                            step={0.01}
                            value={dim}
                            display={`${Math.round((dim / PHOTO_MAX_DIM) * 100)}%`}
                            onChange={setDim}
                          />
                          <RangeField
                            id="wm-blur"
                            label="Blur"
                            min={0}
                            max={1}
                            step={0.01}
                            value={blur}
                            display={`${Math.round(blur * 100)}%`}
                            onChange={setBlur}
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                          <fieldset>
                            <legend className="text-sm font-semibold text-white mb-2">Text colour</legend>
                            <div className="flex gap-2">
                              {(
                                [
                                  ['light', 'White', Sun],
                                  ['dark', 'Dark', Moon],
                                ] as const
                              ).map(([id, label, Icon]) => (
                                <button
                                  key={id}
                                  type="button"
                                  onClick={() => setTone(id)}
                                  aria-pressed={tone === id}
                                  className={`${pill(tone === id)} inline-flex items-center gap-1.5`}
                                >
                                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                                  {label}
                                </button>
                              ))}
                            </div>
                          </fieldset>
                          <fieldset>
                            <legend className="text-sm font-semibold text-white mb-2">Lettering</legend>
                            <div className="flex flex-wrap gap-2">
                              {PHOTO_LETTERING.map((l) => (
                                <button
                                  key={l.id}
                                  type="button"
                                  onClick={() => setPhotoTypeId(l.id)}
                                  aria-pressed={photoTypeId === l.id}
                                  className={pill(photoTypeId === l.id)}
                                >
                                  {l.label}
                                </button>
                              ))}
                            </div>
                          </fieldset>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            type="button"
                            onClick={resetPhotoAdjustments}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-card text-xs font-semibold text-white/70 hover:text-white ${focusRing}`}
                          >
                            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                            Reset adjustments
                          </button>
                          <button
                            type="button"
                            onClick={removePhoto}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-card text-xs font-semibold text-white/70 hover:text-white ${focusRing}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            Remove photo
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </section>

              {/* 3. Size */}
              <section aria-labelledby="wm-step-size" className={groupCard}>
                <GroupHeading n={3} id="wm-step-size" title="Size and position" />
                <fieldset>
                  <legend className="sr-only">Screen size</legend>
                  <div className="grid grid-cols-2 gap-2.5">
                    {SIZE_PRESETS.map((s) => {
                      const active = sizeId === s.id;
                      const Icon = s.phone ? Smartphone : Monitor;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setSizeId(s.id);
                            setExported(null);
                          }}
                          aria-pressed={active}
                          className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-colors ${focusRing} ${
                            active
                              ? 'border-brand bg-brand/15 text-white'
                              : 'border-surface-border bg-surface-elevated text-white/70 hover:border-white/25 hover:text-white'
                          }`}
                        >
                          <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-brand' : 'text-white/40'}`} aria-hidden="true" />
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold leading-tight">{s.label}</span>
                            <span className="block text-xs opacity-60">
                              {s.width}×{s.height}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

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
              </section>

              {/* 4. Download */}
              <section
                aria-labelledby="wm-step-download"
                className={`${groupCard} border-brand/30 bg-gradient-to-br from-brand/10 to-surface-card/60`}
              >
                <GroupHeading n={4} id="wm-step-download" title="Download" />
                <button
                  type="button"
                  onClick={() => handleExport('download')}
                  disabled={!hasText || busy}
                  className={`inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-brand px-8 py-4 text-lg font-black text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
                >
                  <Download className="w-5 h-5" aria-hidden="true" />
                  {busy ? 'Rendering...' : 'Download PNG'}
                </button>
                <p className="-mt-1 text-center text-xs text-white/50">
                  {size.width}×{size.height}px, no watermark, nothing uploaded
                </p>
                <button
                  type="button"
                  onClick={() => handleExport('share')}
                  disabled={!hasText || busy}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-elevated px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-brand/50 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
                >
                  <Share2 className="w-4 h-4" aria-hidden="true" />
                  Save or share image
                </button>
                <p className="min-h-[1.25rem] text-sm text-white/60" role="status" aria-live="polite">
                  {status}
                </p>
                {exported && (
                  <AppNudge campaign="web-wallpaper-maker-saved" confirmation="Saved">
                    Instead of remaking a wallpaper every time, FaithWall rotates the verses you pick on
                    your lock screen automatically.
                  </AppNudge>
                )}
                <AppNudge campaign="web-wallpaper-maker-inline" variant="inline">
                  Want a verse on your lock screen without remaking it? FaithWall is an iPhone app that
                  rotates the verses you pick.
                </AppNudge>
              </section>
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
