# 22 — Manual session, 2026-11-04: NUL fix, outreach wording, homepage stats, lock-screen covers, install bar

Session type: manual, from Karol's karchi workspace. It started as a read-only App Store rank check (recorded in the app repo, `FAITHWALL/docs/journal/04`). The repo is public, so this entry describes everything qualitatively.

## What was asked

- "hows the seo in fatihwall tho?" That was a read of Search Console, the site and the autopilot's state.
- Then: "Everything's up to you, boss." And: "If you need to change something design-wise to make it more readable, if you need to make the format of the blogs better or something, or the thumbnails better, or the content better … whatever you need to do … is up to you."

## What was found

- **Search is growing, but on pages that don't sell the app.** The hub and the generator page drive the growth. The money page has been sliding since early October, with another step down on 10-29 (entries 01 and 20). Web-referrer installs in App Store Connect have drifted down over the same weeks. The four newest posts are still not indexed (p58 is queued for that).
- **The homepage stats band showed "0+" and "0%" in the prerendered HTML.** Google, link previews and no-JS readers saw zeros, because the counters started at 0 and only counted up in the browser. One of the three stats was a survey percentage with no source.
- **Blog covers were generic sepia stock photos.** They didn't show the product, and they looked alike in the grid. Every card carried an Unsplash credit.
- **The NUL-byte bug from entry 20 was still live** on three posts.
- **On a phone, the App Store button sits only at the middle or the end of a long page.** Article tables were wider than the column and got clipped. List items, steps and callouts were smaller and tighter than the paragraphs, and a `space-y` rule cancelled the space above h2s.
- **Two of the three Advent wording points from entry 19 were still open:** the unconfirmed Abide mention, and "pick a set of verses", which reads as if the app supplies an Advent set. Two more wording problems were found: "the Bible verses you choose" in the drafts, and the directory entry's widget line. Both imply the user picks every verse, but the lock-screen widget rotates verses on its own.
- **The "App Store rename" was not a rename.** The US listing title "Lock Screen Bible Verse" has been in place since at least May 2026 (app repo, journal 03). Entries 07, 08 and the 11-02 refresh dated it to 10-18.
- **The minimum iOS:** the live listing and the Xcode deployment target both say iOS 15.0. The site says 16.0 in five places.

## What was decided

- Fix the build bug, the outreach wording and the homepage stats directly. They are small and verifiable, and none of them touches the measured hub or money page.
- Replace the stock covers with generated lock-screen covers, one verse per post, rendered from the KJV text the site already ships. This is a visual change only: post text, titles and URLs are unchanged. The hub (`/blog/best-free-bible-app-iphone`) keeps its cover, because it is the leading click source and under measurement.
- Settle the two open TODO decisions instead of leaving them with Karol. The store name is permanent, so name it where visitors click through. The minimum is "installs on iOS 15.0 or later; the lock-screen widget needs iOS 16". Both go into one sitewide queue item, **p60** (`not_before` 2026-11-10), because the money page has a FaithWall row and is under measurement until the 11-09 refresh. Rejected: editing the homepage and vs-pages now and leaving the money page row for later. That would split one fact across two dates, which p55 rightly avoided.
- Add a mobile-only install bar to the content pages: posts, pillars, comparisons and the two tools. It is not on the homepage. It renders client-side only, so the prerendered HTML Google reads gets no new text. It appears after one screen of scrolling and can be dismissed for the session. Each page type has its own campaign token (`web-sticky-blog`, `-pillar`, `-compare`, `-tool`), so App Store Connect can attribute installs.
- Run a readability pass on article text at phone width only; desktop is unchanged. The one server-HTML change is a scroll wrapper around tables in the six posts that have them. It adds markup and no text. It's accepted even inside the measurement window, because those tables were cut off on phones.
- Leave the untracked local `.agents` copy of the blog skill alone. Codex is the only tool that reads it, and it's flagged to Karol.

## What was built

- `aad1613`: `scripts/prerender.mjs` strips NUL bytes from the final HTML.
- `3c8e84a`: Advent drafts and `outreach/directories.md` reworded. The Abide mention is cut. The text now says "a Bible verse you choose" as the wallpaper, and the widget "rotates verses on its own".
- `3de9d7a`: `SocialProof.tsx` server-renders the final values (1,000+ installs, 24 translations, 4.7 App Store rating). Counters below the fold reset to 0 after hydration and count up on scroll. The unsourced survey stat is gone.
- `e678ce4` (built by a subagent in a worktree and reviewed here): `scripts/build-blog-thumbnails.mjs` renders 1600×1067 covers through headless Chrome over CDP, with no new dependencies. Each cover is a phone lock screen showing one KJV verse and its reference, next to the FaithWall icon and wordmark, in one of ten brand palettes. `src/data/blogCovers.json` maps each post to its verse. The covers cover 44 posts, and each one has a descriptive file name and alt text ("iPhone lock screen showing Psalm 23:1 (KJV)"). The Unsplash credits were removed, and the blog skill now adds a cover entry for every new post.
- `cdd7d08` (subagent, reviewed): `StickyInstallBar.tsx`, mounted after the footer on the content pages, with an in-flow spacer so the footer is never covered. A CSS rule lifts the wallpaper maker's floating preview above the bar.
- `e000533` (subagent, reviewed): mobile article text. Lists and callouts go from 16 to 17px, line-height is 1.7, paragraph and list gaps are larger, h2s get real space above them, and body links switch to the lighter brand colour for higher contrast. Tables scroll inside their own container.
- Queue item p60, the TODO-KAROL section for this session, and this entry. The `SocialProof.tsx` comment no longer carries a raw RevenueCat figure (public repo).

## How it was verified

- NUL fix: after the deploy, the three affected pages had zero NUL bytes live (checked twice).
- Homepage stats: the SSR HTML shows the real values. In the browser the counters count up and the console is clean.
- Covers: build "57 succeeded, 0 failed", typecheck at the 7-error baseline, no NUL bytes in `dist`, every new cover file exists and is referenced, `og:image` points to the new jpg, and a 12-cover contact sheet was checked by eye.
- Combined main (covers + bar + readability), built once: 57 pages, 0 failed, typecheck at 7, zero NUL bytes in all 57 HTML files. The install bar's text and campaign links are absent from the prerendered HTML. The subagent's diff against the baseline showed identical visible text and `<head>` on all 57 pages; the other differences are class attributes plus the six table wrappers. At 390px in headless Chrome (CDP device emulation), the bar is hidden at the top of the page, appears after one screen, stays dismissed across pages, and never shows at 1024px.

## What is still open

- Karol: send the Tier-1 pitches, then the Advent follow-ups by 11-16.
- p60 runs from 11-10.
- The Cloudflare AI-crawler block is unchanged and still flagged.
