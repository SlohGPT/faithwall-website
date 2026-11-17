# 40 — Homepage redesign on a branch (QuranWall v2 look, FaithWall facts), 2026-11-16

Session type: side session started from the main FaithWall session on Karol's behalf. All work is on branch `claude/laughing-lamport-805274` in its own worktree. Nothing is merged, pushed or deployed: Karol decides that. The repo is public, so this entry is qualitative only.

## What was asked

Karol asked for the same homepage upgrade on faithwall.app that QuranWall got on `design/homepage-v2` (QuranWall website journal 02):

- a coded phone in the hero with FaithWall's real Lock Screen;
- a hero that fits one viewport on every device;
- a daily-verse highlight that is true to the product;
- a features bento of live mini-mockups;
- How it works with coded app screens;
- a pass over every section.

The rules were: FaithWall's facts and lint rules win over the QuranWall brief, KJV only, the conversion layer v3.1 stays (fixed `web-*` tokens, install cards, rating rule), and Karol must be asked before the pricing line is removed. He wants to see it on localhost first.

## What was found

- **The old homepage.** The hero was a screenshot slideshow. Features, How it works and the final CTA hotlinked Pexels photos. The How it works "Preview" carousel quoted verses in non-KJV wording (Proverbs 3:5 and John 14:27 in NIV-style text), and one line attributed to Romans 12:21 is not Scripture at all. Its heading, "Set up in under 2 minutes", is a setup-time claim.
- **The app's real look (iOS source, read-only).** The Lock Screen verse uses Apple's New York semibold, white with a soft shadow, centred, starting at 30% of the screen height with 12% side margins. The size fits the text up to 72 pt on a 1290 px canvas, and the reference sits on its own line under the verse. The wallpaper offers 12 gradient presets plus solid colours. The widget is an orange gradient with a cross glyph in four families (small, medium, Lock Screen rectangular and inline). Widget rotation is off by default. When on, it starts with the picked verse and then shows random verses hourly, every 8 hours or daily. The daily reminders are short nudges ("Quick moment of peace 🕊️ / Your daily verse is ready. Breathe and read."). The display name on the phone is FaithWall.
- **Real flow labels:** "Choose Your Verse", "Explore / Search / Write", "Continue", "Set as Wallpaper", "Updating wallpaper...", "Wallpaper Updated!". Setting the wallpaper goes through an Apple Shortcut.

## What was decided, and why

- **Truth in the hero.** The front phone's Lock Screen verse never changes: the wallpaper is one verse the user picks. Only the Home Screen widget on the back phone cycles: day 1 shows the picked verse, then fresh verses. The labels say so: "Lock Screen · the verse you pick" and "Widget · a fresh verse every day". This follows the widget-rotation rule from 11-05.
- **Font.** New York can't ship on the web. Lora 600 is bundled with the app under the OFL, so the site serves a static Latin subset of it. Lora's licence reserves the name "Lora" for the original, so the subset ships under its own name, "FW Verse Serif", with the glyphs unchanged and the copyright and licence records kept. The clock uses the system font stack.
- **Wallpapers.** The app's own gradient presets plus original SVG scenes. No app photos (their rights are unclear), and no Pexels.
- **Verses.** One data file (`src/data/showcaseVerses.ts`) picks six KJV verses by reference from `randomVerses.json` and fails the build if one is missing.
- **Tokens.** The hero uses `web-home-hero`. The final CTA keeps `web-site`, and its new gold button uses the same token. The bento's customiser tile links to the wallpaper maker inside the site; the maker page's own CTA keeps `web-maker`. A homepage link with `web-maker` would credit homepage installs to the maker. No new tokens.
- **Measurement hold.** Shared components (DeviceMockup, LockScreenVerse) get only new optional props or named exports, so every other page renders exactly as before. Each build is compared with a baseline build of `main`.
- **Pricing.** The "free to download / a subscription unlocks it" lines stay until Karol says otherwise.

## What was built

Built in two waves by implementer agents from written briefs; each wave's diff, gates and captures were reviewed before the next wave started.

**Wave 1: foundation and hero.**
- `src/data/showcaseVerses.ts`: six KJV verses looked up by reference (Psalm 23:1, Philippians 4:13, Psalm 46:1, Psalm 119:105, 2 Corinthians 5:7, Matthew 11:28).
- Lora 600 Latin subset, `public/fonts/lora-semibold-latin.woff2` (about 18 KB), served as "FW Verse Serif". `scripts/fonts/build-verse-serif.py` builds it from the app's variable font in `scripts/fonts/`, where its OFL licence sits too. The homepage preloads it.
- `DeviceMockup` gained optional `variant="showcase"` (no guide line, system clock font, short date) and `ui="home"` (Home Screen status bar). `LockScreenVerse` gained the named exports `AppLockVerse` and `appVerseSize`. Both defaults render exactly as before.
- `src/components/showcase/`: `Wallpaper` (12 app presets, solids, text colours, SVG scenes dawn / hills / night), `FaithWallWidget` (small, medium, rectangular, inline), `HomeScreen`, `AppLockScreen`, `CrossFade` and `utils` (SSR-safe media-query, page-visibility and reduced-motion hooks).
- `src/components/ui/`: `SectionHeading`, `GlassCard`, `CrossPattern` and `Reveal` (visible in the prerendered HTML; hides and fades in only content below the fold, once, and only when motion is allowed).
- `Hero.tsx` rewritten. It keeps the pill, H1, sub, App Store badge, rating line and the "Listed on the App Store as …" line, and adds a gold "Get FaithWall" button at the badge's 44 px height (both use `web-home-hero`). The front phone shows the Lock Screen. From 768 px a tilted back phone shows the Home Screen with the medium widget, cycling every 4 s with a "Day N" counter. The loop pauses on hover, when the tab is hidden, and under reduced motion. The layout is CSS-only, in two modes: wide (from 1024 px and aspect 1.1) fits one `svh` viewport with the whole phone visible; stacked lets the phone's top peek in under the CTA. The old screenshot slideshow is gone. Its images stay in `public/`, because the homepage schema references them.

**Wave 2: features, How it works and a pass over every section.** Two implementer agents worked in parallel on separate files from written briefs. Shared rules: verses only from the data file, the app's exact labels, no new claims, no new tokens, and `Reveal` instead of framer-motion in the sections they touched.
- `Features.tsx`: a bento of five tiles, each a live coded mini-mockup over a title and one or two sentences. Three columns from 1024 px (the first tile spans two), two on tablets, one on phones. New files in `src/components/features/`.
  - "The Verse You Need, on Your Lock Screen": three app-look Lock Screens on the app's own gradient presets. The copy is the old card's.
  - "A Widget That Starts With Your Verse": the small Home Screen widget and the Lock Screen rectangular widget. While the tile is on screen it cross-fades from the picked verse to fresh ones; it stays still under reduced motion.
  - "Daily Verse Reminders": one notification with the app's own reminder text.
  - "Faith Wallpapers": three of the original SVG scenes in a fan. No app photos.
  - "Preview It Live": a small working customiser (six app gradients, three text colours, keyboard accessible) and a plain link to the wallpaper maker inside the site.
- `HowItWorksAndPreview.tsx`: the heading "Set your verse once. / See it every time you look." and three cards, each with a coded app screen that uses the app's exact labels.
  - 01 Download: the Home Screen with the app icon. The pricing sentence is kept word for word.
  - 02 Choose your verse: "Choose Your Verse", Explore / Search / Write, "Continue".
  - 03 Preview and set it: "Set as Wallpaper", then "Updating wallpaper..." and "Wallpaper Updated!" while the card is on screen.
  - The "Set up in under 2 minutes" heading and the Pexels carousel with its non-KJV quotes are gone. New files in `src/components/howitworks/`.
- Section pass:
  - SocialProof: the stats sit in glass cards with the same values, labels and rating rule.
  - FAQ: a glass accordion with every word unchanged (it also feeds the FAQ schema). The first answer is open, as before.
  - Final CTA: the Pexels photo is replaced by an app-look Lock Screen on the night scene with 2 Corinthians 5:7. The copy, the `web-site` badge and the install handoff stay, and a gold button on the same token sits beside the badge.
  - `Home.tsx`: soft hairline seams between sections. Head tags and schema are untouched.
- Review fixes, made in this session: the mini Lock Screens showed a fixed date ("Mon Nov 16") and now show the visitor's date after load, like the hero. Section headings wrap in balanced lines and are one size smaller on phones, so no single word hangs on its own line. The font subset still called itself Lora, which the OFL forbids for a modified copy of a font with a reserved name; it was rebuilt as "FW Verse Serif" by a script, and a table-by-table comparison shows the same glyphs, metrics, kerning and character map.

Commits: 3c9975a on `claude/laughing-lamport-805274` (site), then this entry and the hub. Nothing is pushed, so there is no Vercel preview.

## How it was verified

On a production build served locally (`vite preview`), re-run after the last change:
- Typecheck: 6 errors, all pre-existing (an unused import in `Navigation.tsx`, missing Node types in `entry-server.tsx`). main has 7; the old `Features.tsx` took its error with it.
- Build: 57 prerendered routes, none failed. The sitemap is untouched.
- `lint-facts --all`, `--dist` and `--diff main --worktree`: 0 FAIL, 0 WARN. The built site has one app schema node, on `/` only.
- No NUL bytes in the built HTML.
- All 57 other pages are identical to a baseline build of main (hashed asset names normalised), so the measurement hold is intact.
- Hero at 12 sizes (laptops up to 1920 px, iPad and iPad mini both ways, three iPhones), with motion and with reduced motion: no sideways scroll, the H1 clears the nav, both buttons sit in the first screen, the whole front phone shows on wide screens and its top peeks in on stacked ones.
- Full page at 11 sizes: no sideways scroll, no console errors, no hydration warnings.
- The prerendered `/` holds every section's text and no Pexels URL, "Romans 12:21" or "2 minutes".
- Checked by eye in Karol's Chrome at `localhost:4173`.

## Where each claim comes from

US listing lines: L1 "Your chosen verse on your lock screen and wallpaper", L2 "Faith Wallpapers: cinematic, Scripture-inspired backgrounds", L3 "Preview any wallpaper live before you set it", L4 "Home-screen and lock-screen widgets with a fresh verse every day", L5 "Daily verse reminders that call you back to Him".

| On the page | Source |
|---|---|
| Hero H1, sub, "Used by 1,000+ people" | the old homepage's copy |
| Rating line | `facts.rating` (shown because `show` is true) |
| "Listed on the App Store as Lock Screen Bible Verse" | `facts.storeName` |
| "Lock Screen · the verse you pick", the still front phone | L1; the app sets one picked verse as the wallpaper |
| "Widget · a fresh verse every day", the Day counter | L4; the app's widget starts with the picked verse, then shows random verses |
| Lock Screen tile | the old card's copy (24 translations) |
| Widget tile | `facts.widgetMinIOS` (16.0), L4, the app's rotation choices (hourly, every 8 hours, daily) |
| Reminders tile | L5; the notification text is the app's own |
| Wallpapers tile | L2; "use your own photos" is the old card's copy, and the app has a photo picker |
| Preview tile | L3 |
| How it works 01 | the old pricing sentence, unchanged |
| How it works 02 | the old step copy |
| How it works 03 | L3; the homepage FAQ's Apple Shortcut answer; the old "stays until you choose another" |
| App screen labels | the app's source |
| Final CTA | the old copy; `web-site` token and install handoff unchanged |

Listing claims the page leaves out because the site can't back them yet: "set in one tap", "the full Bible", "rated 4.9" (the facts file says 4.7), and verses chosen for what you're walking through.

## Still open (Karol)

1. **Pricing.** QuranWall's redesign dropped its pricing lines. This branch keeps FaithWall's: the step 01 sentence and the two FAQ answers that mention the subscription (they also feed the FAQ schema). They come out only on Karol's word.
2. **When to merge.** The conversion layer's read-out runs to 12-02. Merging after it keeps that read-out clean. Merging earlier needs a row in `annotations.csv` and a journal note on the day it goes live.
3. **Dead file.** `src/components/AppShowcase.tsx` is imported nowhere (on main too) but still holds Pexels URLs and a non-KJV quote. Delete it in a follow-up.
4. **No testimonials.** The homepage has none; the component's name is older than its content. Adding any needs real ones.
5. **A layout option.** In the final CTA the desktop QR handoff sits in the button row; it could move under it.
6. **Numbering.** If main gets its own entry 40 before this merges, this entry takes the next free number at merge, and the hub's status bullet may need a hand merge.

## Later the same day: the phones now look like iPhones

**Asked.** Karol looked at the branch in his Chrome and rejected the phone mockups: they "must actually look like an iPhone, nicely and smoothly", not like an Android.

**Found.** The device frame used CSS `corner-shape: squircle`. Chrome (since 139) draws it as a near-square superellipse, so the large corner radius looked like a Samsung. Safari ignores the property, which is why it never showed on an iPhone. The frames also missed the details that say "iPhone" at a glance: no status bar icons, a short date ("Mon Nov 16"), flat app icons with a labelled dock, and phone-shaped cards instead of phones in some tiles.

**Built** (homepage only, the `showcase` variant of `DeviceMockup`):
- Plain round corners, a polished metal edge and shadow, the Dynamic Island, the iOS status bar (signal, Wi-Fi and battery beside the island; 9:41 on the Home Screen), the side buttons and the Camera Control.
- The Lock Screen date in iOS form, "Monday, November 16". It is still the visitor's own date, filled in after load.
- Home Screen: iOS-coloured icons with iOS corner rounding, the Search pill instead of page dots, a frosted dock without labels. The FaithWall icon and widget are unchanged.
- Features: the wallpapers tile fans out three real Lock Screen phones, the reminder tile is a framed phone with the notification, and the widget tile shows a Home Screen phone and a Lock Screen phone with their captions above. How it works step 03's live preview is a real Lock Screen phone.
- The default `maker` variant is untouched: the wallpaper maker and the blog's Lock Screen figures render as on main.

No new claims: the text on the phones is the same verses, labels and notification copy as before.

Commit: 34a6acd (site). Not pushed.

**Verified** on a fresh production build:
- Typecheck: the same 6 pre-existing errors (`Navigation.tsx` 1, `entry-server.tsx` 5).
- Build: 57 of 57 routes. The sitemap is untouched.
- `lint-facts --all`, `--dist` and `--diff main --worktree`: 0 FAIL, 0 WARN. One app node, on `/` only.
- 0 NUL bytes. All 57 other pages are identical to the main baseline.
- Hero check at 12 sizes, with and without motion: all pass. The features section at 11 sizes: no sideways scroll, console clean.
- Checked by eye in Karol's Chrome at desktop size: hero, all five tiles, How it works and the final CTA. Phone size checked on headless captures.

**Still open, added:**
7. **The live squircle frames.** The wallpaper maker page and the blog's Lock Screen figures (`LockScreenVerse` through `BlogRenderer`) still use the squircle frame, so they look boxy in Chrome on the live site. The fix is the same corner change for the `maker` variant, but it changes live pages: do it after the 12-02 read-out, or with an `annotations.csv` row.

**Approved.** Karol looked at the new phones and approved them: "Looks right". The pricing lines and the merge timing (items 1 and 2) are still his to decide.

## 2026-11-17 update: merged with main, finished for shipping

**What Karol asked (17 Nov):** finish the homepage so it is ready to ship. Bring the stock photos back in the social-proof pill. Make the App Store badge and the "Get FaithWall" button the same height (on his 14-inch MacBook the badge looked too small and did not match the button). Move the hero copy closer to QuranWall's hero: a concrete sub line and small floating chips around the phones.

**What changed:**
- **Merge.** `main` (d942c07) merged into the branch. The only conflict was the hub (`docs/README.md`), merged by hand with both sides kept. Journal 40 keeps its number.
- **Lint.** The old PhoneStage `aria-label` ("a widget that shows a fresh verse every day") now says the widget shows your verse and can rotate if you turn on Auto-rotate verses. The widget label on the phones had the same claim ("a fresh verse every day"); it now reads "Auto-rotate verses on", and the counter says "next verse". `lint-facts` passes on the merged tree.
- **Pill.** `avatar-1..3.jpg` restored from `b73c084^` (only those three). The hero pill has an overlapping stack of three 36 px round photos (`alt=""`, width and height set, lazy) before "Used by 1,000+ people", which is unchanged.
- **CTA sizing.** `AppStoreButton` has a `size="cta"` option: 48 px tall on phones, 58 px from lg up, scaled by height with the aspect ratio kept (the default 44 px size is unchanged, used by the footer). `CTA_BUTTON_CLASS` gives "Get FaithWall" the same heights, with larger text and padding. Used in the hero and the final CTA. `size="cta"` is also set where the badge stands alone in a CTA block: end-of-post and compare CTAs, the wallpaper maker CTA and the install card. The footer badge and the compact inline nudge keep 44 px. The final CTA card now puts the QR block under the buttons until 2xl, so the larger pair does not wrap.
- **Hero copy.** The headline stays "Daily Scripture / On Your Lock Screen". The sub is now "Pick any verse in 24 translations, and FaithWall sets it as your iPhone Lock Screen wallpaper. Change it whenever you like." (24 comes from `facts.json`). Four chips float around the phones from tablet width up, hidden on phones: "1 Pick a verse", "24 translations", "10 app languages" (both counts from `facts.json`) and "Lock Screen or widget". The brief's "Lock Screen + widget" became "or" because the two setups are alternatives (rule `wallpaper-widget-combo`). "6 fonts & custom colors" was not used: no source for the number in `facts.json` or the repo.

**Gates (fresh build):** typecheck 6 errors (main: 7); build exit 0, 57 of 57 routes; `lint-facts` `--all` 0 FAIL (29 WARN, as before), `--dist` 0, `--self-test` 204 checks 0 failed, `--diff main --worktree` 0; 0 NUL bytes in dist; keyword-research `check --staged` 0 FAIL. Against a main build, every page except the homepage differs only by the larger badge markup (50 pages that render the cta-size badge); the other 57 pages are otherwise byte-identical.

**Measured (rendered):** at 1512 x 982 the badge is 58 x 174 px and the button 58 x 203 px; at iPhone 390 x 844 both are 48 px tall (badge 144 wide, button 159). 375 wide: same, no sideways overflow.

**Decision note:** the homepage and 50 other pages' badge size changed before the 12-02 read-out, so the control-group hold no longer covers the homepage. An `annotations.csv` row (2026-11-17, "homepage v2 hero redesign") records it. Still not pushed or merged: Karol decides the merge timing.
