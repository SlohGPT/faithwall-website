/** Site-wide link groups shared by the header Guides menu and the footer. Plain data: every entry renders as a server-rendered <a href>. */
export interface SiteLink {
  name: string;
  href: string;
}

export const GUIDE_LINKS: SiteLink[] = [
  { name: 'Daily Scripture Guide', href: '/daily-scripture-lock-screen' },
  { name: 'Prayer Life Guide', href: '/prayer-life-iphone' },
  { name: 'Bible Study Tools', href: '/bible-study-tools-ios' },
  { name: 'Faith-Based Productivity', href: '/faith-based-productivity' },
  { name: 'App Comparisons', href: '/christian-app-comparisons' },
];

export const COMPARE_LINKS: SiteLink[] = [
  { name: 'FaithWall vs YouVersion', href: '/faithwall-vs-youversion' },
  { name: 'FaithWall vs Hallow', href: '/faithwall-vs-hallow' },
  { name: 'Best Lock-Screen Apps', href: '/best-bible-verse-lock-screen-apps' },
];

export const TOOL_LINKS: SiteLink[] = [
  { name: 'Wallpaper maker', href: '/bible-verse-wallpaper-maker' },
  { name: 'Random Bible verse', href: '/random-bible-verse' },
];

/** Footer "Popular posts": the existing posts with the most inbound links in the link-graph report (the held hub is left out). */
export const POPULAR_POSTS: SiteLink[] = [
  { name: 'Best prayer apps for iPhone', href: '/blog/best-prayer-app-for-iphone' },
  { name: 'Prayer reminders on iPhone', href: '/blog/prayer-reminders-on-iphone' },
  { name: 'Bible verse lock screen setup', href: '/blog/bible-verse-lock-screen-iphone' },
  { name: 'Verse of the day lock screen', href: '/blog/verse-of-the-day-lock-screen-iphone' },
  { name: 'Lock screen verses for anxiety', href: '/blog/lock-screen-verses-for-anxiety' },
];
