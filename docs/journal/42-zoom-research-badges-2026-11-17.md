# 42: Zoom fix, SEO/GEO/CRO research, badge rules and the users floor (2026-11-17)

This session worked on all three sites from the FaithWall checkout. QuranWall (QW) and NoteWall (NW) changes went through their own sessions; this session never edited their repos. Entries 39 and 40 cover the morning (homepage v2, link pass), and entry 41 is the merge gate.

## Asked

1. Karol asked to research and then implement anything that still raises SEO, GEO, CTR or installs on all three apps: "what free tools, what blogs, what content, how to actually write really great blogs, how to design them better so it will get actually great CTR, how to make people download the app … everything's up to you".
2. "When I try to zoom in all of the websites … the top bar also gets there zoomed in … make it really nice and not so weird behavior." He also asked for the three avatars in QuranWall's "Trusted by 1,000+ believers" line to use the images from the Quran app folder.

## Built

- **902577b site: header and bars stop being fixed under pinch zoom and short viewports.**
  - `src/lib/useVisualZoom.ts` provides `usePinchZoomed()` (visualViewport scale > 1.01) and `useStaticBars()` (pinch, or `max-height: 480px`, which also covers browser zoom of 200% and more on a laptop).
  - While either is true, the nav scrolls with the page instead of staying pinned, and it shows no glass pill. The phone install bar and the maker's Preview pill are hidden.
  - At 150% browser zoom the header stays fixed, as before.
  - The same fix shipped on QW (4ad6d67) and NW (fd1804e) through their sessions, and was checked live on all three.
- **QW avatars (4ad6d67, QW session).** The three avatars now use the images from the app's own asset folder. Checked against the app images.
- **012b66a site: App Store badge rules.**
  - The hero CTA row changes from `gap-3` to `gap-x-4 gap-y-3`, so the badge has 16 px of clear space next to "Get FaithWall". Apple asks for a quarter of the badge height, which is 14 px at 56 px.
  - On `/` only, the footer badge becomes a text link to the same `ct=web-site` URL. FinalCTA already shows a badge directly above it, and Apple allows one badge per layout. Every other page keeps the footer badge.
  - One annotations row.
- **9437b4b facts: users floor.**
  - `facts.json` gains `userFloor` (1000), `userFloorText` ("1,000+") and `userFloorSource`. Karol confirmed the claim on 11-17; it comes from RevenueCat new customers, and the repo stores only the floor.
  - Hero, FinalCTA and SocialProof read the floor from the facts file. SocialProof also reads `translationCount`.
  - `lint-facts` gains a `users` count rule: "<N>+ people, users, believers, downloads…" or "over <N> …" in a FaithWall sentence must equal the floor.
  - Rendered HTML is byte-identical on all 59 pages, so there is no annotations row.

## Research (summary)

- **How it was done.** One workflow ran six web researchers and one synthesizer, then two skeptics who rated every action keep, weaken or drop. A second, independent run by the morning session agreed on everything both runs covered. The full notes, with sources, are outside the repo in the session notes.
- **The 15 ranked actions, and who owns each:**
  - **Karol:** crawler access for the AI search bots (Cloudflare). Lining up the App Store listing and the homepage on one sentence, after an ASO review. Custom product pages and the first three screenshots. Bing Webmaster Tools AI Performance as a free read-out. The Clarity decision.
  - **The original FaithWall session:** a "be the cited source, then win the remaining click" writing rule for posts. An audit of dateModified and bylines. An originality gate for the autopilot (one thing per post a template can't make). Title and H1 snippet lints.
  - **After 12-02:** a desktop QR handoff on the maker and generator, and `app-argument`/ppid on the Smart App Banner.
  - **Sister sessions, each after a demand test:** a QW ayah wallpaper maker and an NW notes wallpaper maker.
  - **This session:** the prerender audit, the social-proof check and the badge audit, all done in this entry.
- **Myths to skip:**
  - llms.txt raising citations: Ahrefs found most llms.txt files get no requests, and Google says no AI text file is needed. Keep the file and spend no more time on it.
  - Special schema for AI Overviews.
  - FAQ and HowTo rich results, which are limited or retired since 2023.
  - A self-hosted aggregateRating.
  - Mass dateModified bumps, which are a manipulation signal.
  - Word-count targets.
  - One CTR-loss percentage for every page type.
  - "Best apps" self-ranking listicles as a tactic.
  - Page-per-verse or page-per-ayah generation, which is scaled content.
- **Corrections to what was in place:**
  - The control-group window overlaps the November core update. The 12-02 read-out should compare treated and control pages, not before against after, and note the rollout dates.
  - The 403s that cost ChatGPT citations would be OAI-SearchBot and ChatGPT-User; GPTBot and ClaudeBot are training crawlers. Both of the first pair get 200.
  - The Smart App Banner was already live on all three sites (`ct=web-smart-banner`, `qw-web-smart-banner`, `nw-web-smart-banner`). An earlier note in this session missed that.

## Audit of all three sites (prerender, crawlers, 404s, canonicals, badges)

- Each live site was audited by one agent and re-checked by an independent skeptic.
- **All three:** a real 404 for unknown URLs, and canonicals are fine.
- **FaithWall:**
  - The home page had three badges, with two together at the bottom, and the hero clear space was 12 px. Both are fixed by 012b66a.
  - The og-image letterbox and the pillar's Article image went to the original session.
- **NoteWall:** broken covers, a "Free" pill, og:url, a relative Article image, and the About page's og image. Sent to the NW session.
- **QuranWall:** hero clear space, og image sizes, missing thumbnails, footer placeholders, and the social-proof question. Sent to the QW session.
- **AI crawlers, 11-17 midday:**
  - faithwall.app returns 403 to GPTBot, ClaudeBot and now also PerplexityBot. The managed robots.txt also disallows GPTBot, ClaudeBot, Google-Extended, Applebot-Extended and about 25 more.
  - OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Bingbot and Googlebot get 200.
  - QW and NW return 200 to every bot.

## Decided (Karol, 11-17)

- **faithwall.app AI crawlers:** "Unblock all three (Recommended)", meaning GPTBot, ClaudeBot and PerplexityBot. It is a Cloudflare dashboard change on the faithwall.app zone, so it is his click. The steps:
  1. AI Crawl Control: allow the crawlers.
  2. Security → Bots: turn off "Block AI bots".
  3. Turn off the managed robots.txt.
  - Done means `npm run kw -- geo-probe` exits 0 and each bot's user-agent gets 200.
- **"Used by 1,000+ people" on FaithWall:** "Yes, it's true". It is now the facts-file floor (9437b4b).
- **QuranWall:** the waitlist testimonials and the 92% stat "are real, keep them", and "Trusted by 1,000+ believers" stays. Relayed to the QW session so it records the confirmation and its facts file allows that wording.

## Verified

- **012b66a:**
  - The implementer and an independent verifier each ran it against their own preview server.
  - hero-cap passes at 1512×982, 390×844, 375×667, 1280×720 and 820×1180, with the CTA inside the fold at every size.
  - The badge-to-button gap measures 16 px, on one row, at all five sizes.
  - In dist, `/` has no footer badge and one text link, and `/blog` keeps the footer badge.
- **Both commits:**
  - typecheck: 6 errors (the baseline).
  - build: 58/58, since the new Christmas post adds a route.
  - `lint-facts --all`, `--diff origin/main` and `--dist`: 0 FAIL.
  - `link-graph --dist dist --base https://faithwall.app`: exit 0.
  - No NUL bytes in dist.
  - `keyword-research check --staged`: clean.
- **The users rule:**
  - "10,000+ people" and "over 5,000 believers" FAIL, and "1,000+ people" passes.
  - The autopilot prompts lint clean.
  - The only other user count in the repo is about another app (Prayer Notebook) and is correctly ignored.
- **Live:** see the after-deploy note at the end.

## Open

- **Karol:**
  - The Cloudflare unblock above.
  - Listing and site sentence alignment, CPPs and the first three screenshots, Bing WMT AI Performance, and the Clarity decision.
  - The back-phone caption choice from entry 40.
- **The original session:** the writing rule, the dateModified and byline audit, the originality gate, title/H1 lints, the og-image letterbox and the pillar Article image.
- **The sister sessions:** verify the QW (items 1–4) and NW (items 1–5) audit-fix commits when they report, and confirm that QW recorded Karol's social-proof decision.
- **After 12-02:** the desktop QR handoff, Smart App Banner `app-argument`/ppid, and the homepage sentence alignment.

## After deploy (11-17)

- 9437b4b was live about 45 s after the push.
- **`/`:** two badge images (hero and FinalCTA), the footer text link once, the hero row with `gap-x-4 gap-y-3`, and "Used by 1,000+ people" unchanged.
- **`/blog`:** keeps its footer badge.
- **`link-graph --live https://faithwall.app`:** exit 0.
- **IndexNow:** submitted only `/`, because that is the only page whose HTML changed; 200 OK.
