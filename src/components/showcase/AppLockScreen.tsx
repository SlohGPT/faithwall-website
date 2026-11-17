import DeviceMockup from '../DeviceMockup';
import { AppLockVerse } from '../LockScreenVerse';
import type { ShowcaseVerse } from '../../data/showcaseVerses';
import CrossFade from './CrossFade';
import Wallpaper, { type WallpaperVariant } from './Wallpaper';
import { useLockDate } from './utils';

/**
 * An iPhone Lock Screen as the app sets it: wallpaper, the chosen verse in the app's look, and the lock UI
 * (date, 9:41, flashlight, camera, home indicator). Canvas 1290x2796 like the app's export. Fills its parent's width.
 * If `verse` or `wallpaper` change, the screen crossfades. The date is the visitor's, filled in after mount.
 */
export default function AppLockScreen({
  verse,
  wallpaper = 'dawn',
  dateLabel,
  textColor,
  fade = 800,
}: {
  verse: ShowcaseVerse;
  wallpaper?: WallpaperVariant;
  /** Override the date line; default is the visitor's date (client only). */
  dateLabel?: string;
  /** Verse colour (the app's text colours); default white. */
  textColor?: string;
  fade?: number;
}) {
  const today = useLockDate();
  return (
    <DeviceMockup
      device="iphone"
      width={1290}
      height={2796}
      showUi
      uiTone="light"
      dateLabel={dateLabel ?? today}
      variant="showcase"
    >
      <CrossFade value={wallpaper} duration={fade}>
        {(w) => <Wallpaper variant={w} />}
      </CrossFade>
      <CrossFade value={verse} duration={fade}>
        {(v) => <AppLockVerse text={v.text} reference={v.reference} color={textColor} />}
      </CrossFade>
    </DeviceMockup>
  );
}
