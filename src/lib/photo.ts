/**
 * Browser-only helper for the "Your photo" background on /bible-verse-wallpaper-maker.
 *
 * The photo is decoded locally from a File (object URL, revoked straight after decoding)
 * and copied onto a canvas capped at MAX_PHOTO_EDGE. Nothing is uploaded or fetched.
 */

/** Longest edge kept in memory. 4096 covers every export size (4K desktop is 3840 wide). */
export const MAX_PHOTO_EDGE = 4096;
/** Refuse absurd files up front instead of freezing the tab. */
export const MAX_PHOTO_BYTES = 60 * 1024 * 1024;

export const PHOTO_DECODE_ERROR =
  'We could not open that photo. HEIC and some very large files are not supported in every browser. Try saving it as a JPG or PNG and choose it again.';

export interface LoadedPhoto {
  /** Decoded pixels, already downscaled when the original was huge. */
  image: HTMLCanvasElement;
  width: number;
  height: number;
  name: string;
  downscaled: boolean;
}

function looksLikeImage(file: File): boolean {
  return file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|avif|heic|heif|bmp)$/i.test(file.name);
}

function decode(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('decode'));
    img.src = url;
  });
}

export async function loadPhotoFile(file: File): Promise<LoadedPhoto> {
  if (!looksLikeImage(file)) {
    throw new Error('That file is not an image. Choose a JPG or PNG photo.');
  }
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error('That photo is very large (over 60 MB). Try a smaller JPG or PNG.');
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await decode(url);
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih) throw new Error('decode');
    const scale = Math.min(1, MAX_PHOTO_EDGE / Math.max(iw, ih));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(iw * scale));
    canvas.height = Math.max(1, Math.round(ih * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('decode');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return { image: canvas, width: canvas.width, height: canvas.height, name: file.name, downscaled: scale < 1 };
  } catch (err) {
    if (err instanceof Error && err.message !== 'decode') throw err;
    throw new Error(PHOTO_DECODE_ERROR);
  } finally {
    URL.revokeObjectURL(url);
  }
}
