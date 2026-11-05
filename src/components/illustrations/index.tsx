import { SCENES, type SceneName } from './scenes';

/**
 * Spot illustrations for blog posts and pillar pages: inline SVG, server
 * rendered, no JS, no animation, fixed 720x300 viewBox. One renders per page,
 * before the article's second H2. Scene source: ./scenes.tsx, shared parts:
 * ./primitives.tsx. The contact sheet: scripts/render-illustrations.mjs.
 */
export type IllustrationName = SceneName;

/** Posts under ranking measurement get no new visual. */
const SKIP = new Set(['best-free-bible-app-iphone']);

/**
 * Keyword rules, first match wins. They run over "slug title" (lower case) and
 * go from the most specific topic to the general ones; the lock screen is the
 * fallback. Keep new rules narrow: a scene must fit the post, not just the app.
 */
const RULES: [RegExp, IllustrationName][] = [
  [/grief|anxiety|anxious|worry|comfort|\bloss\b|mourn|lament/, 'comfort'],
  [/(^|[\s-])vs([\s-]|$)|versus|comparison|\branked\b|best-christian-app|best christian apps/, 'compare'],
  [/audio|listen|podcast/, 'audio'],
  [/focus mode|focus-mode|do not disturb/, 'focus'],
  [/evening|bedtime|night|sleep|sabbath|wind down|wind-down/, 'evening'],
  [/morning|quiet-time|quiet time/, 'morning'],
  [/reminder|alarm|notification|best-prayer-app|5-minute|prayer-life/, 'reminders'],
  [/widget|rotating|rotate/, 'widget'],
  [/habit|plan|streak|calendar|one-year|psalms|memoriz|season/, 'plans'],
  [/study|notes|journal|highlight|mapping|commentar|sermon/, 'study'],
  [/wallpaper-for-iphone-free|christian-wallpaper|style|design|colou?r|font|productivity/, 'design'],
  [/group|together|share|church|small group|family/, 'shared'],
];

/** The few posts where keywords alone would pick the wrong scene. */
const OVERRIDES: Record<string, IllustrationName> = {
  'faith-based-productivity': 'focus',
  'bible-study-tools-ios': 'study',
  'prayer-life-iphone': 'reminders',
  'daily-scripture-lock-screen': 'lockscreen',
  'bible-study-group-iphone-tools': 'shared',
  'bible-reading-plan-widget-iphone': 'plans',
  'daily-prayer-widget-ios': 'widget',
  'scripture-based-prayer-prompts': 'lockscreen',
  'prayer-journal-app-iphone-2026': 'study',
  'best-bible-study-app-iphone-2026': 'study',
  'bible-memorization-apps-iphone': 'lockscreen',
  'daily-scripture-wallpaper-iphone': 'lockscreen',
  'psalm-23-wallpaper-iphone': 'lockscreen',
  'christian-focus-modes-iphone': 'focus',
  'sabbath-rest-iphone-shortcuts': 'evening',
};

export function pickIllustration(slug: string, title: string): IllustrationName | null {
  if (SKIP.has(slug)) return null;
  if (OVERRIDES[slug]) return OVERRIDES[slug];
  const hay = `${slug} ${title}`.toLowerCase();
  for (const [re, name] of RULES) if (re.test(hay)) return name;
  return 'lockscreen';
}

export default function PostIllustration({ slug, title }: { slug: string; title: string }): JSX.Element | null {
  const name = pickIllustration(slug, title);
  if (!name) return null;
  const Scene = SCENES[name];
  return (
    <div className="py-2 md:py-4" role="presentation">
      <Scene />
    </div>
  );
}
