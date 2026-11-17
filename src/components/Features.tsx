import { Link } from 'react-router-dom';
import SectionHeading from './ui/SectionHeading';
import FeatureTile from './features/FeatureTile';
import Customiser from './features/Customiser';
import { LockScreensArt, ReminderArt, WallpapersArt, WidgetsArt } from './features/arts';

// Bento: >= 1024px [T1 T1 T2] / [T3 T4 T5]; 768-1023px [T1 T1] [T2 T3] [T4 T5]; phones one column.
const ROW1_ART = 'h-[260px] sm:h-[340px]';
// T1 is the wide tile: at lg its stage soaks up the height the longer widget text gives the row.
const T1_ART = `${ROW1_ART} lg:h-auto lg:min-h-[340px] lg:flex-1`;
const ROW2_ART = 'h-[270px] sm:h-[290px]';

export default function Features() {
  return (
    <section id="features" className="section-space bg-surface">
      <div className="container-main">
        <SectionHeading
          align="center"
          eyebrow="Features"
          title="Everything you need for"
          muted="daily spiritual growth"
          className="mb-12 sm:mb-16"
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <FeatureTile
            className="md:col-span-2"
            title="The Verse You Need, on Your Lock Screen"
            art={<LockScreensArt />}
            artClassName={T1_ART}
          >
            <p>
              Pick a verse by book, chapter and verse, or search for it, in 24 translations. FaithWall sets it as your
              wallpaper, and it stays there until you choose another.
            </p>
          </FeatureTile>

          <FeatureTile
            title="A Widget That Starts With Your Verse"
            art={<WidgetsArt />}
            artClassName={ROW1_ART}
            delay={0.06}
          >
            <p>
              On iOS 16 or later, add a Home Screen or Lock Screen widget. Turn on rotation and it starts with your verse,
              then shows a fresh verse every hour, 8 hours or day.
            </p>
          </FeatureTile>

          <FeatureTile title="Daily Verse Reminders" art={<ReminderArt />} artClassName={ROW2_ART}>
            <p>Daily verse reminders that call you back to Him.</p>
          </FeatureTile>

          <FeatureTile title="Faith Wallpapers" art={<WallpapersArt />} artClassName={ROW2_ART} delay={0.06}>
            <p>Cinematic, Scripture-inspired backgrounds. Choose from curated wallpapers or use your own photos.</p>
          </FeatureTile>

          <FeatureTile
            title="Preview It Live"
            art={<Customiser />}
            artClassName={ROW2_ART}
            fade={false}
            delay={0.12}
          >
            <p>Preview any wallpaper live before you set it.</p>
            <p>
              <Link
                to="/bible-verse-wallpaper-maker"
                className="font-semibold text-brand transition-colors hover:text-brand-light focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Try the wallpaper maker →
              </Link>
            </p>
          </FeatureTile>
        </div>
      </div>
    </section>
  );
}
