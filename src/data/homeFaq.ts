// Single source for the visible home FAQ (TestimonialsAndFAQ) and the FAQPage JSON-LD (Home.tsx).
export interface HomeFaqItem {
  q: string;
  a: string;
  link?: { to: string; text: string };
}

export const homeFaq: HomeFaqItem[] = [
  {
    q: 'What is FaithWall?',
    a: 'FaithWall is an iPhone app, free to download, that puts a Bible verse you choose on your lock screen as a wallpaper, or in a lock-screen widget that shows the verse you picked (an optional "Auto-rotate verses" setting, off by default, makes it show random verses instead). Using it requires a FaithWall subscription. It installs on iOS 15.0 or later; the lock-screen widget needs iOS 16 or later.',
  },
  {
    q: 'How does FaithWall work?',
    a: 'You pick your own verse by book, chapter and verse or by search, in 24 translations. After subscribing you choose how to show it: a full-screen lock-screen wallpaper applied with an Apple Shortcut, or a compact lock-screen widget that shows the verse you picked (an optional "Auto-rotate verses" setting (off by default) makes it show random verses instead, changing every hour, every 8 hours or once a day). FaithWall has a built-in Bible browser (all books and chapters) for finding your verse, but it is built for the lock screen, not for study.',
  },
  {
    q: 'Is FaithWall free?',
    a: 'FaithWall is free to download, but using it requires a subscription. The price, billing period and any trial offer are shown in the App Store before you pay, in your local currency.',
  },
  {
    q: 'Which iPhones does FaithWall work on?',
    a: 'FaithWall installs on iPhones running iOS 15.0 or later. The lock-screen widget needs iOS 16 or later, because Apple added lock-screen widgets in iOS 16.',
  },
  {
    q: 'Is my data private?',
    a: 'Your subscription payment is handled by Apple through the App Store, so FaithWall never sees your card details.',
  },
  {
    q: 'Can I get a random Bible verse without downloading anything?',
    a: "Yes — try our free random Bible verse generator for an instant verse with nothing to download. FaithWall is what you'd set up next if you want a fresh verse to appear automatically.",
    link: { to: '/random-bible-verse', text: 'Try the random Bible verse generator' },
  },
];
