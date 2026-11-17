// Single source for the visible home FAQ (TestimonialsAndFAQ) and the FAQPage JSON-LD (Home.tsx).
export interface HomeFaqItem {
  q: string;
  a: string;
  link?: { to: string; text: string };
}

export const homeFaq: HomeFaqItem[] = [
  {
    q: 'What is FaithWall?',
    a: 'FaithWall is an iPhone app, free to download, that puts a Bible verse you choose on your lock screen as a wallpaper, or in a lock-screen widget that shows the verse you picked (an optional "Auto-rotate verses" setting, off by default, makes it show random verses instead). It installs on iOS 15.0 or later; the lock-screen widget needs iOS 16 or later.',
  },
  {
    q: 'How does FaithWall work?',
    a: 'You pick your own verse by book, chapter and verse or by search, in 24 translations. Then you choose how to show it: a full-screen lock-screen wallpaper applied with an Apple Shortcut, or a compact lock-screen widget that shows the verse you picked (an optional "Auto-rotate verses" setting (off by default) makes it show random verses instead, changing every hour, every 8 hours or once a day). FaithWall has a built-in Bible browser (all books and chapters) for finding your verse, but it is built for the lock screen, not for study.',
  },
  {
    q: 'Which iPhones does FaithWall work on?',
    a: 'FaithWall installs on iPhones running iOS 15.0 or later. The lock-screen widget needs iOS 16 or later, because Apple added lock-screen widgets in iOS 16.',
  },
  {
    q: 'Can I get a random Bible verse without downloading anything?',
    a: "Yes — try our random Bible verse generator for an instant verse with nothing to download. FaithWall is what you'd set up next if you want a verse you chose on your lock screen.",
    link: { to: '/random-bible-verse', text: 'Try the random Bible verse generator' },
  },
];
