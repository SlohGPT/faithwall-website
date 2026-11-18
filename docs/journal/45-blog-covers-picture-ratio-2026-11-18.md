# 45 — Blog covers, picture ratio and a cleaner blog on all three sites, 2026-11-18

Karol's asks, in the order they came (evening of 11-18, one long session, no agents: "Please don't launch any agents"):

- A covers skill in each repo that makes "really killer thumbnails" people want to click, on brand, wired into each
  blog skill and each site's scheduled autopilot.
- The topic chip bar must not stay fixed on scroll; a better desktop post layout; in-body images that explain or
  continue the text ("I really love the images that we use on Faith Wall"; QuranWall and NoteWall "more contextual").
- Covers: "same style, but different positions, different ideas", and a bigger app logo.
- "please don't make the blog posts overwhelmed with the images. You must find a healthy ratio." QR codes doubted;
  the download button "centered or whatever, big".
- The QuranWall topic map on /blog: "I really fucking dislike this thing". Then: "I think we can remove these
  dividers" (the lines above and below the chip row).
- "verify everything, please yourself on all three websites without any workflow agents, and then push, commit,
  deploy, whatever. Write down."
- The sticky mobile install bar: "why not use like App Store logo there? ... make it seem like it would be native App
  Store logo pop-up". I first answered it in chat only; Karol: "Did you even hear me when I said this? ... Do it, then
  show me how it looks so I can improve, validate". Built (Mobile install card, below).

## What was built

Branch `claude/blog-design-1118` in each repo (worktrees), fast-forwarded to main and pushed the same evening:
FaithWall `7904849` + `42778b5`, QuranWall `6ff366e` + `b79c308`, NoteWall `b521169` + `f78d160`.

**Cover engine 1.1.0** (`scripts/cover-engine.mjs`, the same file on all three sites). One 1600x1067 jpg per post: a
2-6 word hook with one accent word, a topic pill (lucide icon, tag, optional badge), the app mark (icon 84 px, was
smaller) and a real-looking iPhone. Six layouts so neighbours differ: `right`, `left`, `fan` (three phones),
`duo` (comparisons), `closeup` (how-to), `number` (big numeral). Optional float card (a generic iOS alarm, Focus,
timer or event). The build scripts fail when a cover repeats its grid neighbour's layout.

| Site | Covers | Layouts | What the phone shows |
|---|---|---|---|
| FaithWall | 46 | right 13, left 10, closeup 8, fan 7, duo 5, number 3 | the post's KJV verse (read from `public/bible/kjv`) |
| QuranWall | 8 | right 2, left 2, fan 2, closeup 2 | the post's ayah in English, word for word, no Arabic on covers |
| NoteWall | 108 | right 27, left 26, closeup 25, fan 22, duo 7, number 1 | 2-4 notes a reader of the post would write |

FaithWall files are now `<ref>-bible-verse-iphone-wallpaper.jpg` (were `-lock-screen.jpg`), QuranWall and NoteWall
`<slug>-cover.jpg`. The old files are deleted; every old post image URL redirects permanently to its new cover
(`vercel.json` `permanent: true`, which Vercel answers with 308, not 301 as the commit messages say: FW 46, QW 6,
NW 81 redirects), so Google Images and old shares land on the new file. No price, free or trial words on any
cover.

**Skills.** New `faithwall-covers`, `quranwall-covers`, `notewall-covers` (entry fields, banned words, layout table,
float rules, render and check commands, cloud fallback, the in-post picture rule). `faithwall-blog`,
`quranwall-blog`, `make-blog-notewall` and the older `make-blog` now point their image step at the covers skill
(QuranWall and NoteWall dropped Unsplash; no stock photos, no paid generators). QW and NW `SEO-STRATEGY.md` image
rule rewritten to match.

**Autopilots.** The image line of all six local autopilot prompts (FW x2 line 48, QW line 72, NW x3 line 44) now
says: follow the site's covers skill, cover text follows that skill's banned-words list, add no image blocks to the
body, never ship without a cover. `lint-facts --prompts`: FW 0 FAIL, NW 0 FAIL, QW 1 FAIL that is not from today
(the lint matches its own rule text in `quranwall-merge-bot` line 48, unchanged since 11-17 16:00).

**Picture ratio** (`src/lib/visualRhythm.ts`, same file on all three). Images, the spot illustration and the mid
install card are always drawn. Verse/quote/highlight blocks (first) and stat blocks (second) are drawn big only
when at least 650 characters (about 110 words) of text come since the last big picture (the cover counts) and before
the next fixed one, and the post has budget left: one big picture per 1,500 characters (about 250 words), fixed ones
first. The rest render quiet: a serif quote with an accent rule, or a plain number. FaithWall simulation: median
pictures per post 4 to 3, words per picture 308 to 394.

**Contextual in-body figures.** FaithWall keeps its lock-screen verse figures. QuranWall verse blocks that win a
place become the homepage Lock Screen mockup carrying that ayah (and replace the spot scene in that post). NoteWall
posts show their own cover notes on a Lock Screen (a different wallpaper from the cover) at the second H2.

**Blog index.** Chip row static (not sticky), and its divider lines and background strip removed (QW `border-y`,
FW `border-b`; NW had none). The topic/cluster map is gone from all three: QuranWall `/blog` (`ClusterMap.tsx`),
FaithWall pillar pages (`PillarClusterMap.tsx`), NoteWall pillar pages (`hub-visuals/ClusterMap.tsx`). The post lists
under them keep every internal link.

**Download card.** Centered, one big official App Store badge, QR only behind a desktop "On a computer? Scan a
code with your iPhone" disclosure. QuranWall's facts row under it is now a three-item list so "Free to download" stays a standalone line
(the dist lint failed 16 times when it was joined into "iPhone · iOS 15.0 or later · Free to download").

**Mobile install card** (`src/components/StickyInstallBar.tsx`, all three). The thin bottom bar is now a floating
dark card in the iOS style: dismiss ×, the app icon (48 px), the app name, one short line, and Apple's official white
"Download on the App Store" badge (`/badges/app-store-white.svg`) at 40 px tall, Apple's minimum, with 13-16 px clear
space (the rule asks a quarter of its height, 10 px). Lines: FaithWall "A Bible verse on your Lock Screen",
QuranWall "A Quran ayah on your Lock Screen", NoteWall "Your notes on the Lock Screen" (the longer "Notes and
reminders on your Lock Screen" was cut off at 375 px). It still shows on posts and pillars only (FW also on its
compare, maker and random pages), never on the homepage, slides in after the first screen, hides while an in-post
install card or the footer is on screen, and × keeps it closed. Same hrefs and ct tokens. It is not a fake iOS
system pop-up (the real Smart App Banner already runs on all three sites). It touches CTA markup on held pages: Karol
asked for it now, so it is in all three `annotations.csv` files; it lands on held and control posts alike.

**Hydration fix.** `splitLead` (`src/lib/postIcons.ts`, NW `post-icons.ts`) renders a bold lead label without its
`**`; a label like "1. ..." became an `<ol>` inside a `<p>`, React error #418 on NoteWall
`/blog/best-lock-screen-notes-apps-iphone`. A leading list, heading or quote marker is now escaped, on all three.

Same URLs and ct tokens everywhere; no CTA token changed on held pages.

## Verification

All done in this session with headless Chrome scripts and curl, no agents.

- **Builds** exit 0: FaithWall 59 routes, QuranWall 16, NoteWall SSG. `lint-facts` on the fresh builds: FW 0 FAIL 0 WARN
  (60 html files, 15 held pages checked), QW 0 FAIL 2 WARN (the EULA lines, as before), NW 0 FAIL 0 WARN. Typecheck: QW
  and NW 0; FW shows only the 5 known `entry-server.tsx` errors (this checkout's node_modules lacks `@types/node`).
- **Local audit before the deploy** (390 px on a throttled phone profile, and 1280 px). LCP in ms, mobile: FW `/` 580,
  `/blog` 416, post 1052; QW `/` 556, `/blog` 408, posts 1592 and 416; NW `/` 1012, `/blog` 728, posts 1056 and 1072.
  Desktop LCP under 120 ms. CLS at most 0.0028, horizontal overflow 0, broken images 0, long tasks while scrolling 0.
- **Install card** captured at 390 and 375 px with iPhone emulation on one post per site (local, then live): shown after
  the first screen, badge 120x40, clear space 13-16 px, no overflow, no console errors. The capture sheet went to
  Karol in chat for review.
- **#418** gone: no console errors on the NoteWall post, local and live.
- **Deploy.** Pushed `42778b5`, `b79c308`, `f78d160`; all three served the new og:image within 60 s.
- **Live audit after the deploy** (same pages, mobile throttled / desktop, LCP ms):

  | Page | Mobile LCP | Desktop LCP | CLS max |
  |---|---|---|---|
  | faithwall.app `/` · `/blog` · post | 884 · 472 · 1408 | 268 · 204 · 300 | 0.0028 |
  | quranwall.com `/` · `/blog` · post | 936 · 468 · 1356 | 476 · 220 · 248 | 0.0018 |
  | notewall.info `/` · `/blog` · post | 1608 · 1240 · 1380 | 164 · 168 · 396 | 0 |

  All under 2.5 s; 0 errors, 0 broken images, 0 overflow on every page.
- **Old image URLs.** 133/133 redirect permanently to a cover that answers 200 `image/jpeg`. On FaithWall 42 of the 46
  first still returned the old jpg: Cloudflare had them cached (HIT, age about 2 days, `immutable`, one-year max-age)
  while Vercel already answered 308. Purged the 46 URLs in Cloudflare (faithwall.app → Caching → Configuration →
  Custom Purge → URL, two batches of 23, the dialog takes 30), then 46/46. No setting changed.
- **link-graph `--live`** exits 0 on all three, 0 orphans; NoteWall `og:image under 1200 px` went from 100 pages to 0.
  The remaining title WARNs (FW 25 long, NW 89 long) are post titles, untouched today.

## Open

- Install card: Karol saw the capture sheet and approved it ("Looks good", 11-18 evening). Later changes to the card
  go through `StickyInstallBar.tsx` on all three.
- Renaming a FaithWall cover later leaves the old URL in Cloudflare's cache for up to a year: add its redirect and purge
  the old URL (the covers skill does not say so yet).
- Dead `.hub-map*` CSS in NoteWall `globals.css` (about lines 1020-1403) can go in a later cleanup.
- QW lint self-match in `quranwall-merge-bot` line 48 (above).
