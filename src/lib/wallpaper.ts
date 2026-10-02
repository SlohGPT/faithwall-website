/**
 * Pure helpers for the Bible verse wallpaper maker (/bible-verse-wallpaper-maker).
 *
 * Everything here is SSR-safe: nothing touches window/document at import time.
 * The only function that needs a canvas is drawWallpaper(), and it receives the
 * 2D context as an argument.
 */

export type SizeId = 'iphone' | 'iphone-pro-max' | 'android' | 'desktop-4k';
export type Position = 'middle' | 'lower';
export type StyleId =
  | 'black'
  | 'dark-gradient'
  | 'sunrise'
  | 'cream'
  | 'navy-gold'
  | 'minimal-white'
  | 'bold-sans';

export interface SizePreset {
  id: SizeId;
  label: string;
  width: number;
  height: number;
  /** Phone presets reserve the clock/widget zone at the top and the buttons at the bottom. */
  phone: boolean;
}

export const SIZE_PRESETS: SizePreset[] = [
  { id: 'iphone', label: 'iPhone', width: 1179, height: 2556, phone: true },
  { id: 'iphone-pro-max', label: 'iPhone Pro Max', width: 1290, height: 2796, phone: true },
  { id: 'android', label: 'Android', width: 1080, height: 2400, phone: true },
  { id: 'desktop-4k', label: 'Desktop / laptop 4K', width: 3840, height: 2160, phone: false },
];

/** Fraction of the screen height kept free at the top / bottom on phone sizes. */
export const PHONE_SAFE_TOP = 0.35;
export const PHONE_SAFE_BOTTOM = 0.12;

const SERIF = 'Georgia, "Times New Roman", Times, serif';
const SANS = '"DM Sans", system-ui, -apple-system, "Segoe UI", sans-serif';

export interface StylePreset {
  id: StyleId;
  label: string;
  /** Background stops, top to bottom. One stop means a flat colour. */
  background: string[];
  /** Optional radial highlight laid over the background (cream paper). */
  glow?: string;
  textColor: string;
  refColor: string;
  family: string;
  weight: 400 | 500 | 700;
  italic: boolean;
  align: 'center' | 'left';
  uppercaseRef: boolean;
  /** Small rule between verse and reference. */
  rule?: string;
  /** Soft shadow behind text for gradient backgrounds. */
  shadow?: string;
  /** Preview swatch (CSS background). */
  swatch: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'black',
    label: 'Pure black',
    background: ['#000000'],
    textColor: '#ffffff',
    refColor: 'rgba(255,255,255,0.62)',
    family: SERIF,
    weight: 400,
    italic: false,
    align: 'center',
    uppercaseRef: false,
    swatch: '#000000',
  },
  {
    id: 'dark-gradient',
    label: 'Dark gradient',
    background: ['#1c1b33', '#0f0e1d', '#050509'],
    textColor: '#f5f3ff',
    refColor: 'rgba(245,243,255,0.6)',
    family: SANS,
    weight: 500,
    italic: false,
    align: 'center',
    uppercaseRef: false,
    swatch: 'linear-gradient(160deg,#1c1b33,#050509)',
  },
  {
    id: 'sunrise',
    label: 'Sunrise',
    background: ['#1a1030', '#6b2c52', '#d2603c', '#f2a65a'],
    textColor: '#ffffff',
    refColor: 'rgba(255,255,255,0.88)',
    family: SERIF,
    weight: 400,
    italic: true,
    align: 'center',
    uppercaseRef: false,
    shadow: 'rgba(40,10,20,0.35)',
    swatch: 'linear-gradient(180deg,#1a1030,#6b2c52 40%,#d2603c 75%,#f2a65a)',
  },
  {
    id: 'cream',
    label: 'Cream paper',
    background: ['#f3ebd8'],
    glow: 'rgba(255,252,243,0.9)',
    textColor: '#2b2118',
    refColor: 'rgba(43,33,24,0.62)',
    family: SERIF,
    weight: 400,
    italic: false,
    align: 'center',
    uppercaseRef: false,
    swatch: '#f3ebd8',
  },
  {
    id: 'navy-gold',
    label: 'Navy and gold',
    background: ['#0c1f46', '#08142e', '#050c1d'],
    textColor: '#ecd48a',
    refColor: 'rgba(236,212,138,0.7)',
    family: SERIF,
    weight: 400,
    italic: false,
    align: 'center',
    uppercaseRef: true,
    rule: 'rgba(236,212,138,0.55)',
    swatch: 'linear-gradient(160deg,#0c1f46,#050c1d)',
  },
  {
    id: 'minimal-white',
    label: 'Minimal white',
    background: ['#ffffff'],
    textColor: '#111111',
    refColor: 'rgba(17,17,17,0.5)',
    family: SANS,
    weight: 500,
    italic: false,
    align: 'left',
    uppercaseRef: false,
    swatch: '#ffffff',
  },
  {
    id: 'bold-sans',
    label: 'Bold sans',
    background: ['#0a0a0f'],
    textColor: '#ffffff',
    refColor: '#d97b3b',
    family: SANS,
    weight: 700,
    italic: false,
    align: 'left',
    uppercaseRef: true,
    swatch: 'linear-gradient(135deg,#0a0a0f 60%,#d97b3b)',
  },
];

export const DEFAULT_SIZE: SizeId = 'iphone';
export const DEFAULT_STYLE: StyleId = 'black';

/* ------------------------------------------------------------------ */
/* Query-param sanitising                                              */
/* ------------------------------------------------------------------ */

export const MAX_TEXT = 500;
export const MAX_REF = 60;
export const MAX_TRANSLATION = 16;

/**
 * Treat any incoming string as plain text: drop control characters and HTML
 * angle brackets, collapse whitespace, trim and cap the length. The result is
 * only ever rendered as a React text node or drawn with fillText.
 */
export function sanitizeText(input: string | null | undefined, max: number): string {
  if (!input) return '';
  return (
    input
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁦-⁩]/g, ' ')
      .replace(/<[^>]*>/g, '')
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, max)
      .trim()
  );
}

export interface PrefillParams {
  text: string;
  ref: string;
  tr: string;
  hasText: boolean;
  hasTr: boolean;
  /** From ?style=, only when it is a known preset id. */
  style: StyleId | null;
  /** From ?size=, only when it is a known size preset id. */
  size: SizeId | null;
}

/** Parse ?text=&ref=&tr=&style=&size= (all optional). Accepts a query string with or without the leading "?". */
export function parsePrefill(search: string): PrefillParams {
  const params = new URLSearchParams(search);
  const text = sanitizeText(params.get('text'), MAX_TEXT);
  const ref = sanitizeText(params.get('ref'), MAX_REF);
  const tr = sanitizeText(params.get('tr'), MAX_TRANSLATION);
  const styleParam = params.get('style');
  const sizeParam = params.get('size');
  const style = STYLE_PRESETS.find((p) => p.id === styleParam)?.id ?? null;
  const size = SIZE_PRESETS.find((p) => p.id === sizeParam)?.id ?? null;
  return { text, ref, tr, hasText: text.length > 0, hasTr: tr.length > 0, style, size };
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

/** Returns the rendered width in px of `str` at `fontPx` (and the style's face). */
export type MeasureFn = (fontPx: number, str: string) => number;

/**
 * Greedy word wrap. Honours explicit newlines and hard-breaks a single word
 * that is wider than the line (so nothing ever overflows the box).
 */
export function wrapLines(text: string, maxWidth: number, fontPx: number, measure: MeasureFn): string[] {
  const out: string[] = [];
  const paragraphs = text.split(/\r?\n/);
  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      continue;
    }
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (measure(fontPx, candidate) <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line) {
        out.push(line);
        line = '';
      }
      if (measure(fontPx, word) <= maxWidth) {
        line = word;
      } else {
        // Single word wider than the box: break it by characters.
        let chunk = '';
        for (const ch of Array.from(word)) {
          if (chunk && measure(fontPx, chunk + ch) > maxWidth) {
            out.push(chunk);
            chunk = ch;
          } else {
            chunk += ch;
          }
        }
        line = chunk;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

export interface FitInput {
  text: string;
  reference: string;
  boxWidth: number;
  boxHeight: number;
  maxFont: number;
  minFont: number;
  /** Verse line height as a multiple of font size. */
  lineHeight?: number;
  measureVerse: MeasureFn;
  measureRef: MeasureFn;
}

export interface FitResult {
  fontSize: number;
  lines: string[];
  refSize: number;
  refLines: string[];
  lineHeightPx: number;
  /** Space between the last verse line and the reference. */
  gap: number;
  /** Total height of verse block + gap + reference. */
  blockHeight: number;
  /** True when even minFont overflowed the box (only for absurd input). */
  overflow: boolean;
}

function layoutAt(input: FitInput, fontSize: number) {
  const lh = input.lineHeight ?? 1.32;
  const lines = wrapLines(input.text, input.boxWidth, fontSize, input.measureVerse);
  const refSize = Math.max(10, Math.round(fontSize * 0.52));
  const refLines = input.reference
    ? wrapLines(input.reference, input.boxWidth, refSize, input.measureRef)
    : [];
  const lineHeightPx = fontSize * lh;
  const gap = refLines.length ? fontSize * 0.75 : 0;
  const refHeight = refLines.length * refSize * 1.3;
  const blockHeight = lines.length * lineHeightPx + gap + refHeight;
  return { fontSize, lines, refSize, refLines, lineHeightPx, gap, blockHeight };
}

function fits(input: FitInput, fontSize: number) {
  const l = layoutAt(input, fontSize);
  return { l, ok: l.blockHeight <= input.boxHeight };
}

/**
 * Largest integer font size in [minFont, maxFont] whose wrapped block fits the
 * safe box. Block height only grows as the font grows, so binary search is valid.
 * If even the smallest allowed size overflows, keep halving toward 8px so the
 * text still fits (and flag overflow if it never does).
 */
export function fitText(input: FitInput): FitResult {
  let lo = Math.max(8, Math.floor(input.minFont));
  let hi = Math.max(lo, Math.floor(input.maxFont));

  if (!fits(input, lo).ok) {
    let size = lo;
    while (size > 8) {
      size = Math.max(8, Math.floor(size * 0.9));
      const r = fits(input, size);
      if (r.ok) return { ...r.l, overflow: false };
    }
    return { ...fits(input, 8).l, overflow: true };
  }

  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (fits(input, mid).ok) lo = mid;
    else hi = mid - 1;
  }
  return { ...layoutAt(input, lo), overflow: false };
}

export interface SafeBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function safeBox(size: Pick<SizePreset, 'width' | 'height' | 'phone'>): SafeBox {
  const { width: w, height: h, phone } = size;
  if (phone) {
    const x = Math.round(w * 0.09);
    const y = Math.round(h * PHONE_SAFE_TOP);
    return { x, y, width: w - x * 2, height: Math.round(h * (1 - PHONE_SAFE_BOTTOM)) - y };
  }
  const x = Math.round(w * 0.12);
  const y = Math.round(h * 0.12);
  return { x, y, width: w - x * 2, height: h - y * 2 };
}

/** Top y of the text block inside the safe box for the chosen position. */
export function blockTop(box: SafeBox, blockHeight: number, position: Position): number {
  if (position === 'lower') return box.y + box.height - blockHeight;
  return box.y + (box.height - blockHeight) / 2;
}

/* ------------------------------------------------------------------ */
/* Drawing (browser only: receives a 2D context)                       */
/* ------------------------------------------------------------------ */

export interface WallpaperSpec {
  text: string;
  reference: string;
  size: SizePreset;
  style: StylePreset;
  position: Position;
  /** Optional visitor photo used instead of the style's generated background. Additive: omit it for the classic render. */
  photo?: PhotoBackground;
}

export function fontString(style: StylePreset, px: number): string {
  return `${style.italic ? 'italic ' : ''}${style.weight} ${px}px ${style.family}`;
}

/** Reference line shown under the verse, e.g. "John 3:16 · KJV". */
export function referenceLine(ref: string, translation: string): string {
  return [ref.trim(), translation.trim()].filter(Boolean).join(' · ');
}

export function drawWallpaper(ctx: CanvasRenderingContext2D, spec: WallpaperSpec): FitResult {
  const { size } = spec;
  // With a photo, keep the chosen typography but swap in readable text colours and a shadow.
  const style = spec.photo ? photoTextStyle(spec.style, spec.photo.textTone ?? 'light') : spec.style;
  const w = size.width;
  const h = size.height;

  // Background
  if (spec.photo) {
    drawPhotoBackground(ctx, spec.photo, w, h);
  } else if (style.background.length === 1) {
    ctx.fillStyle = style.background[0];
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    style.background.forEach((c, i) => g.addColorStop(i / (style.background.length - 1), c));
    ctx.fillStyle = g;
  }
  if (!spec.photo) ctx.fillRect(0, 0, w, h);
  if (style.glow && !spec.photo) {
    const r = ctx.createRadialGradient(w / 2, h * 0.5, 0, w / 2, h * 0.5, Math.max(w, h) * 0.7);
    r.addColorStop(0, style.glow);
    r.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = r;
    ctx.fillRect(0, 0, w, h);
  }

  const box = safeBox(size);
  const refText = style.uppercaseRef ? spec.reference.toUpperCase() : spec.reference;
  const verseText = spec.text.trim();

  ctx.textBaseline = 'alphabetic';
  const measureVerse: MeasureFn = (px, s) => {
    ctx.font = fontString(style, px);
    return ctx.measureText(s).width;
  };
  const measureRef: MeasureFn = (px, s) => {
    ctx.font = refFont(style, px);
    return ctx.measureText(s).width + (style.uppercaseRef ? px * 0.12 * s.length : 0);
  };

  const maxFont = size.phone ? Math.round(w * 0.07) : Math.round(h * 0.07);
  const minFont = size.phone ? Math.round(w * 0.03) : Math.round(h * 0.03);

  const fit = fitText({
    text: verseText,
    reference: refText,
    boxWidth: box.width,
    boxHeight: box.height,
    maxFont,
    minFont,
    measureVerse,
    measureRef,
  });

  const top = blockTop(box, fit.blockHeight, spec.position);
  const left = style.align === 'left';
  const x = left ? box.x : w / 2;
  ctx.textAlign = left ? 'left' : 'center';

  if (style.shadow) {
    ctx.shadowColor = style.shadow;
    ctx.shadowBlur = fit.fontSize * 0.25;
    ctx.shadowOffsetY = fit.fontSize * 0.05;
  }

  ctx.fillStyle = style.textColor;
  ctx.font = fontString(style, fit.fontSize);
  let y = top;
  for (const line of fit.lines) {
    // Centre the glyphs (cap-height midpoint) inside each line box.
    ctx.fillText(line, x, y + fit.lineHeightPx / 2 + fit.fontSize * 0.32);
    y += fit.lineHeightPx;
  }

  // Photo wallpapers keep the soft shadow under the reference line too.
  if (!spec.photo) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }

  if (fit.refLines.length) {
    const ruleY = y + fit.gap * 0.5;
    if (style.rule) {
      const ruleW = fit.fontSize * 1.6;
      ctx.strokeStyle = style.rule;
      ctx.lineWidth = Math.max(2, fit.fontSize * 0.04);
      ctx.beginPath();
      const rx = left ? box.x : w / 2 - ruleW / 2;
      ctx.moveTo(rx, ruleY);
      ctx.lineTo(rx + ruleW, ruleY);
      ctx.stroke();
    }
    ctx.fillStyle = style.refColor;
    ctx.font = refFont(style, fit.refSize);
    setLetterSpacing(ctx, style.uppercaseRef ? `${(fit.refSize * 0.12).toFixed(2)}px` : '0px');
    let ry = y + fit.gap + (fit.refSize * 1.3) / 2 + fit.refSize * 0.32;
    for (const line of fit.refLines) {
      ctx.fillText(line, x, ry);
      ry += fit.refSize * 1.3;
    }
    setLetterSpacing(ctx, '0px');
  }

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  return fit;
}

/* ------------------------------------------------------------------ */
/* Optional photo background (additive; the gallery script never uses it) */
/* ------------------------------------------------------------------ */

export type TextTone = 'light' | 'dark';

/** Anything drawImage accepts that also knows its pixel size (canvas, ImageBitmap, HTMLImageElement, @napi-rs/canvas Image). */
export interface PhotoImage {
  width: number;
  height: number;
}

export interface PhotoBackground {
  image: PhotoImage;
  /** 1 = cover-fit, up to PHOTO_MAX_ZOOM. */
  zoom?: number;
  /** Which part of the photo stays in view when it is larger than the screen: 0 = left/top edge, 1 = right/bottom edge. */
  focusX?: number;
  focusY?: number;
  /** Readability overlay strength, 0 to PHOTO_MAX_DIM. */
  dim?: number;
  /** Background blur, 0 to 1 (1 is about 2.5% of the image width). */
  blur?: number;
  /** 'light' = white text on a darkened photo (default); 'dark' = near-black text on a lightened photo. */
  textTone?: TextTone;
}

export const PHOTO_MAX_ZOOM = 3;
export const PHOTO_MAX_DIM = 0.8;
export const PHOTO_DEFAULTS = { zoom: 1, focusX: 0.5, focusY: 0.5, dim: 0.4, blur: 0, textTone: 'light' as TextTone };

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Number.isFinite(n) ? n : lo));

/** Where the photo lands on a w x h canvas: cover-fit, then zoomed and shifted by the focus point. */
export function photoCoverRect(
  imgW: number,
  imgH: number,
  w: number,
  h: number,
  zoom = 1,
  focusX = 0.5,
  focusY = 0.5
): SafeBox {
  const scale = Math.max(w / imgW, h / imgH) * clamp(zoom, 1, PHOTO_MAX_ZOOM);
  const width = imgW * scale;
  const height = imgH * scale;
  return {
    x: (w - width) * clamp(focusX, 0, 1),
    y: (h - height) * clamp(focusY, 0, 1),
    width,
    height,
  };
}

/** Same typography as `style`, but with colours chosen for text over a photo. */
export function photoTextStyle(style: StylePreset, tone: TextTone): StylePreset {
  const light = tone === 'light';
  return {
    ...style,
    textColor: light ? '#ffffff' : '#141414',
    refColor: light ? 'rgba(255,255,255,0.86)' : 'rgba(20,20,20,0.78)',
    rule: style.rule ? (light ? 'rgba(255,255,255,0.65)' : 'rgba(20,20,20,0.55)') : undefined,
    shadow: light ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.55)',
    glow: undefined,
  };
}

type Scratch = HTMLCanvasElement | OffscreenCanvas;

function makeScratch(w: number, h: number): Scratch | null {
  const cw = Math.max(1, Math.round(w));
  const ch = Math.max(1, Math.round(h));
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(cw, ch);
  if (typeof document !== 'undefined') {
    const c = document.createElement('canvas');
    c.width = cw;
    c.height = ch;
    return c;
  }
  return null;
}

/** Blur through ctx.filter when the browser really supports it (Safari ignores it). */
function tryFilterBlur(ctx: CanvasRenderingContext2D, px: number): boolean {
  const c = ctx as CanvasRenderingContext2D & { filter?: string };
  if (!('filter' in c)) return false;
  const value = `blur(${px.toFixed(2)}px)`;
  c.filter = value;
  return c.filter === value;
}

/**
 * Draws the photo (cover-fit + zoom + focus), optional blur and the readability overlay.
 * Works in device pixels (the context's current scale is read once), so the blur looks
 * identical in the reduced-size preview and the full-size export.
 */
export function drawPhotoBackground(ctx: CanvasRenderingContext2D, photo: PhotoBackground, w: number, h: number): void {
  const m = ctx.getTransform();
  const sc = Math.hypot(m.a, m.b) || 1;
  const W = w * sc;
  const H = h * sc;
  const zoom = photo.zoom ?? PHOTO_DEFAULTS.zoom;
  const fx = photo.focusX ?? PHOTO_DEFAULTS.focusX;
  const fy = photo.focusY ?? PHOTO_DEFAULTS.focusY;
  const dim = clamp(photo.dim ?? PHOTO_DEFAULTS.dim, 0, PHOTO_MAX_DIM);
  const blur = clamp(photo.blur ?? PHOTO_DEFAULTS.blur, 0, 1);
  const tone = photo.textTone ?? PHOTO_DEFAULTS.textTone;
  const img = photo.image as unknown as CanvasImageSource;

  const blurPx = blur * w * 0.025 * sc;
  const blurred = blurPx >= 0.5;

  let r = photoCoverRect(photo.image.width, photo.image.height, W, H, zoom, fx, fy);
  if (blurred) {
    // Grow the photo a little so the blurred edge never fades into the backdrop.
    const margin = blurPx * 2;
    const grow = Math.max(1, (W + margin * 2) / r.width, (H + margin * 2) / r.height);
    if (grow > 1) {
      const width = r.width * grow;
      const height = r.height * grow;
      r = {
        x: clamp(W / 2 - (W / 2 - r.x) * grow, W + margin - width, -margin),
        y: clamp(H / 2 - (H / 2 - r.y) * grow, H + margin - height, -margin),
        width,
        height,
      };
    }
  }

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, m.e, m.f);
  ctx.beginPath();
  ctx.rect(0, 0, W, H);
  ctx.clip();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (blurred && tryFilterBlur(ctx, blurPx)) {
    ctx.drawImage(img, r.x, r.y, r.width, r.height);
    (ctx as CanvasRenderingContext2D & { filter: string }).filter = 'none';
  } else if (blurred) {
    // No ctx.filter (Safari): halve the picture a few times, then double it back up. Each
    // step is a smooth bilinear resample, which gives a soft, cheap blur.
    const levels = Math.max(1, Math.min(6, Math.round(Math.log2(Math.max(2, blurPx * 0.9)))));
    const canvases: Scratch[] = [];
    let ok = true;
    for (let i = 1; i <= levels && ok; i++) {
      const c = makeScratch(W / 2 ** i, H / 2 ** i);
      const cctx = c?.getContext('2d') as CanvasRenderingContext2D | null;
      if (!c || !cctx) {
        ok = false;
        break;
      }
      cctx.imageSmoothingEnabled = true;
      cctx.imageSmoothingQuality = 'high';
      if (i === 1) cctx.drawImage(img, r.x / 2, r.y / 2, r.width / 2, r.height / 2);
      else cctx.drawImage(canvases[i - 2] as CanvasImageSource, 0, 0, c.width, c.height);
      canvases.push(c);
    }
    if (ok) {
      for (let i = levels - 2; i >= 0; i--) {
        const c = canvases[i];
        const cctx = c.getContext('2d') as CanvasRenderingContext2D;
        cctx.drawImage(canvases[i + 1] as CanvasImageSource, 0, 0, c.width, c.height);
      }
      ctx.drawImage(canvases[0] as CanvasImageSource, 0, 0, W, H);
    } else {
      ctx.drawImage(img, r.x, r.y, r.width, r.height);
    }
  } else {
    ctx.drawImage(img, r.x, r.y, r.width, r.height);
  }

  if (dim > 0) {
    ctx.fillStyle = tone === 'light' ? `rgba(0,0,0,${dim.toFixed(3)})` : `rgba(255,255,255,${dim.toFixed(3)})`;
    ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();
}

/** The reference uses the same face but never italic, and a slightly lighter weight. */
function refFont(style: StylePreset, px: number): string {
  const weight = style.weight === 700 ? 700 : 500;
  return `${weight} ${px}px ${style.family}`;
}

function setLetterSpacing(ctx: CanvasRenderingContext2D, value: string) {
  // letterSpacing is not in every browser's CanvasRenderingContext2D yet.
  (ctx as unknown as { letterSpacing?: string }).letterSpacing = value;
}

/** Fonts the canvas needs before drawing, in `document.fonts.load` form. */
export function fontLoadSpecs(style: StylePreset, sampleText: string): Array<[string, string]> {
  const sample = sampleText || 'Abc';
  return [
    [fontString(style, 40), sample],
    [refFont(style, 20), sample],
  ];
}
