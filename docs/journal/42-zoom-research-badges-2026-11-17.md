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

## Coordination with the original session (11-17, after the push)

- **Footer link.** The original session first objected to the footer badge-to-text-link on `/`, on the grounds that it changed an App Store CTA during the hold and that its stage C restructures `Footer.tsx`. It then withdrew the objection itself:
  - the URL and `ct=web-site` are unchanged;
  - the change applies on `/` only;
  - the home page already took template-level CTA changes during the hold today, with annotations.
  - The change stays live. Its rebase keeps the link when it restructures the footer.
- **Push order.** Its messages reached this session after the push. This session had announced the push and then pushed without waiting for a reply. From now on it waits for the reply.
- **lint-facts.** The original session is not editing `lint-facts.mjs`: the #11 lints went into link-graph 1.1.0 and a new `lint-originality.mjs`. Its stage A rewrites `SocialProof.tsx`, and its rebase keeps the two `facts.*` values from 9437b4b.
- **Cloudflare.** Karol's unblock decision is in its TODO-KAROL item 4 and in SEO-STRATEGY, on its branch (c7386df).
- **NoteWall.** NoteWall was told that its broken post covers (`/_next/image` 400s, from this audit) and item 5 of the original session's NoteWall CWV brief are one image-config fix, in one commit reported against both.

## No subscription or price mention on the site (Karol, 11-17 evening)

### Asked

- Karol, relayed by the original session: "I wouldn't mention neither of this until people actually click in the app or like in the app store… when we will warn them that a subscription is required, they will not click… So not mention it. in neither of the 3 apps." This covers blog posts too. Legal pages stay as they are.
- His second message set the "free" line: "free to download" or "download for free" is fine where people download the app, but "don't say explicitly that it is for free, because we don't want to lie to our customers."
- The original session agreed that "free" can stay on the web Wallpaper Maker, under three conditions:
  1. the sentence is clearly about the web tool;
  2. nothing slides from the tool's freeness to the app;
  3. the lint exemption covers only the tool's wording.

### Built: 81f4eac, one commit with 61 files

The first version was committed locally as 9abd4b8, then tightened and amended before the push, so 9abd4b8 never reached GitHub.

- **`facts.json`:** `installLine` is now "Free to download." and `subscriptionLine` is gone. Every blog end card prints `installLine`, and so does the held-page CTA card, which had no install line before. The CTA sections' own titles and descriptions no longer say it, so it appears once per card.
- **Home:** the meta description and the MobileApplication schema lost the subscription sentence. The Offer keeps price "0" with "Free to download.", which is the download price.
- **How it works:** step 1 lost its pricing sentence.
- **Home FAQ:**
  - "Is FaithWall free?" is deleted.
  - "Is my data private?" is deleted too, because its whole answer was about the subscription payment.
- **`llms.txt`:** the Pricing section and the subscription line are gone. `public/pricing.md` is deleted; nothing linked to it.
- **Posts (46 files over both passes), `blogPosts.json`, `pillars.json` and `comparisons.json`:**
  - Our subscription, price and trial lines are cut.
  - Table rows and columns that only compared price are removed for every app. Otherwise our blank cell next to competitor prices would read as "free".
  - Sentences saying or implying that FaithWall is free to use are removed, including counts of "free apps" that silently included it.
  - Price contrasts next to FaithWall are removed, such as "Hallow is a paid…" and "YouVersion is free, and FaithWall is free to download".
  - Competitor price facts stay.
- **Web maker:** "free" stays only where the sentence is clearly about the web maker: its title, its FAQ question, the "Free Tool" label, its quick answer, and one Christmas-post sentence ("The free web wallpaper maker on this site…"). For the wallpaper gallery and the random verse generator, "free" was removed rather than stretching the exception.
- **`lint-facts.mjs`:**
  - New `subscription-mention`, `free-use-claim` and `prose-download-line` rules, with the maker exemption scoped to the tool's wording.
  - 271 self-tests.
  - "Use FaithWall for free", "all features for free" and "FaithWall is a free app" fail. "Free to download.", "Download for free" and "Download FaithWall for free" pass.
  - Competitor sentences don't fire.
- **Product-facts lines:**
  - the blog skill;
  - SEO-STRATEGY;
  - the six local routine prompts (autopilot, refresh and merge-bot, two of each);
  - the notes of pending queue items p68, p69 and p71, which had told future posts to write "a subscription unlocks it".
- **Not changed:** titles, slugs and `dateModified`. One annotations row is written for the sitewide change, which comes from Karol's order.

### Tightened before the push (the original session, 11-17 late evening)

The original session withdrew the brief's allowance for a post's own closing "free to download" sentence. Its rules:

- Post, pillar and compare prose never says "free" about FaithWall, "free to download" included.
- The wording stays only at real download points: the end and install cards the renderer draws, App Store buttons, the homepage hero and final CTA, and the compare pages' CTA box.
- On the four free-topic posts, FaithWall must not read as one of the free picks.
- The pages stay as they are, with no redirect or noindex.

**What changed:**

- About 50 body occurrences were cut from paragraphs, lists, tables, quick answers and verdicts, and the rest of each sentence was kept.
- The download phrase was cut from every post CTA title and description, because the card now adds it.
  - "Free to download, 60-second setup." became "60-second setup.", moved to the end of the description.
  - "Get FaithWall — free to download, 60 seconds" became "Get FaithWall — set up in 60 seconds".
- Two leftovers were cut:
  - "Both are free to download" (YouVersion and Olive Tree, next to FaithWall copy);
  - the wallpaper gallery's "free to download" in `daily-scripture-wallpaper-iphone`.
- CTA lines touched in this pass that implied default widget rotation now name the optional Auto-rotate verses setting:
  - in `bible-verse-widget-iphone` and `best-bible-study-app-iphone-2026`;
  - the `scripture-wallpaper-for-iphone-free` CTA title, now "let FaithWall hold your verse";
  - that post's meta description, now "a widget with optional Auto-rotate verses".
- **Free-topic posts, reworded sentences:**
  - **`best-free-bible-app-iphone`:**
    - #1 description: "Free to download. It has a built-in Bible browser…" → "The companion to pair with the reading apps below. It has a built-in Bible browser…"
    - 2026 list: "FaithWall — free to download, and still the gap every other 2026 pick leaves open" → "FaithWall — still the gap every other 2026 pick leaves open"
    - Its description: "No 2026 change needed: free to download." → "No 2026 change needed: the companion to pair with the reading apps below."
  - **`free-christian-apps-iphone-comparison`:**
    - Quick answer: "a four-app stack: YouVersion…, Lectio 365…, Bible Recap…, and FaithWall for the lock-screen Scripture layer" → "a three-app free stack: YouVersion…, Lectio 365… and Bible Recap…, paired with FaithWall as the lock-screen Scripture layer"
    - "FaithWall adds the lock-screen layer… the four-app combo" → "FaithWall is the lock-screen layer you pair with them… the combo"
    - Heading: "The four-app stack, set up" → "The free stack plus the lock-screen layer, set up"
    - "used these four for at least two months" → "used these for at least two months"
    - Highlight: "a four-app Christian iPhone stack — YouVersion, Lectio 365, Bible Recap (in YouVersion), and FaithWall (free to download)" → "a Christian iPhone stack of three free apps — YouVersion, Lectio 365 and Bible Recap (in YouVersion) — with FaithWall as the lock-screen layer"
    - "The four-app stack here covers…" → "The three free apps plus the lock-screen layer here cover…"
    - "The honest stack is short — four apps, four jobs." → "The honest stack is short — three free apps for three jobs, plus FaithWall as the lock-screen layer."
  - **`best-prayer-app-for-iphone` and `scripture-wallpaper-for-iphone-free`:** their bodies already framed FaithWall as the daily trigger. Only the download phrase and the rotation line above changed.
- **Lint, `prose-download-line`:**
  - It FAILs "free to download", "download it/FaithWall for free" and "free download" in the body text of `posts/*.json`, `pillars.json`, `comparisons.json` and `blogPosts.json` when the sentence is about FaithWall.
  - It skips `cta` sections and the compare `ctaTitle` and `ctaDescription`.
  - It checks the FaithWall column of compare rows.
  - A sentence naming only a competitor passes. A mixed sentence fails, so split it.

### How it was done and verified

- Workflows:
  - **Subscription and price wording:** 4 implementers, a gate, 3 reviewers and a fixer.
  - **The "free" line:** 3 implementers, a gate, 2 reviewers and a fixer.
  - **A fresh-eyes check:** a gate runner, a content skeptic, and a dist scan of text, JSON-LD and meta. It found no must-fix items, and its 15 price-contrast points were fixed by hand.
  - **The tightening:** 4 implementers on disjoint files, a gate with a DOM-classified dist audit, a content skeptic, a rules skeptic and a fixer. It had 16 findings: 3 must-fix (all fixed), and the rest fixed or noted below.
- **Final tree (81f4eac):**
  - typecheck: 6 errors (baseline).
  - build: 58/58.
  - `lint-facts`: `--self-test` 271/0. `--all` 0 FAIL with 21 WARN (main has 29, all widget-rotation on untouched lines). `--diff`, `--dist` and `--prompts` (all 8 files) 0.
  - `keyword-research check`: clean.
  - No NUL bytes.
  - `link-graph --dist`: exit 0.
- **Dist audit of "free to download":** 93 hits in 50 pages, every one at an allowed place:
  - 35 mid install cards and 35 end cards;
  - 15 held CTA cards (blog and pillar);
  - 2 compare CTA boxes;
  - the PrayerMate competitor sentence;
  - the homepage (meta, og and twitter descriptions, FAQ and its JSON-LD, app schema, the Offer, How it works step 1).
  - No card prints it twice, and no FaithWall prose carries it.
- **The dist grep for subscription, trial or price** still matches 18 files, and none is about FaithWall:
  - competitor facts on post and compare pages, for example ESV's and YouVersion's optional subscriptions;
  - the JS bundles carrying the same text;
  - the legal pages' text inside the main bundle;
  - a framer-motion identifier.

### After deploy (81f4eac, 11-17)

- **Live crawl:** all 58 sitemap URLs return 200. There are 93 "free to download" hits outside the legal pages: 82 in install, end and held cards, 2 in compare CTA boxes, 8 on the homepage and 1 in the PrayerMate sentence. None is in FaithWall prose.
- **Price words:** subscription, trial and price words in a sentence that names FaithWall come up on 3 pages. All three are competitor facts beside a FaithWall sentence: Amen.'s subscription, Hallow's, and YouVersion's optional Bible Plus.
- IndexNow `--all` returned 200.
- `link-graph --live` exits 0: 58 pages, max depth 2, median 6 contextual links in, 0 orphans. It also warns about 25 titles over 65 characters (held, unchanged).

### Decided (the original session, 11-17)

- The four free-topic pages stay, with no redirect or noindex, now that FaithWall reads as the companion there.
- The privacy FAQ gap and the Offer price "0" stay as left; the original session tells Karol about the FAQ.
- **Homepage keeps "free to download" in three places,** decided by the original session after its live check. Karol's prose rule was about the blogs, and the homepage is the download page, where he wants the phrase to drive installs. The three places:
  - the FAQ answer "FaithWall is an iPhone app, free to download, that puts…";
  - the matching meta and og description;
  - How it works step 1, "(free to download)".
- **The original session's live check:** 81f4eac and b2eb7fc are on origin/main, and `/pricing.md` returns 404. On the four free-topic posts and the homepage, the subscription and trial hits are all competitor facts (Dwell, ESV, YouVersion, PrayerMate), and "Free to download." appears only on the cards.

### Open

- **Frozen title:** `free-christian-apps-iphone-comparison` keeps the title "The Honest Four-App Stack". The body now has three free apps plus FaithWall, still four apps, so it holds. Rewording the title would need a title exception.
- **Leftover CTA mismatch:** the `daily-scripture-wallpaper-iphone` CTA description opens "The piece every Bible study stack is missing", copied from another post. It was left because it is outside the free rule.
- **Lint gaps:**
  - `prose-download-line` runs on source only. `--dist` can't tell prose from a held or compare CTA card, because those carry no marker, so the dist audit above is the check.
  - Bare "free", "(free)" or "free app" about FaithWall falls to `free-use-claim`, not this rule.
  - A pronoun-only sentence of its own ("It's free.") is not caught.
- **Cloud routine:** RemoteTrigger lists none from this account, so no cloud prompt was checked.

### NoteWall audit fixes verified (11-17)

- The NoteWall session reported merge 68eb3e0 (covers and image config 241d850, og and share cards 2d124b5) and journal 35 (2fea8af).
- A read-only check confirmed that every commit is on NoteWall's origin/main. It covered the repo review, a live crawl and a skeptic:
  - all 112 pages and all 1,823 optimizer URLs return 200, and no notewall.info absolute URL goes to the optimizer;
  - the og image is byte-identical to the repo's;
  - the "free" build guard works both ways;
  - og:url matches the canonical everywhere.
- Sent back to that session, its call:
  - BlogCard bypasses `localImagePath` (safe today);
  - the App Store badge is also preloaded on every post;
  - 20 heroless posts, not 18;
  - 6 pillars plus /blog, not 7;
  - the CWV figures aren't in its journal;
  - the retina cap at 1,200 px;
  - the terms page's share text repeats "subscriptions". That is a legal page, so it is optional.

### QuranWall CWV and no-price pass verified (11-17)

- QuranWall reported 8ce9cc1 live, covering the blog/CWV pass (99b0f6e) and the no-price commit, with journal 05 at 4e0aba6.
- A read-only check confirmed:
  - all three commits are on origin/main;
  - /pricing and /pricing.md return 404, and the qw-web-pricing token is gone; the other ct tokens are intact;
  - llms.txt is clean;
  - lint self-test 255/255 and `--all` 0 FAIL;
  - the 8 posts are clean, with only the Athan competitor called free;
  - `link-graph --live` exits 0.
- The check covered an export of origin/main, a live crawl, an independent Lighthouse 12.8.2 run (3 mobile runs per page) and a skeptic.
- Lighthouse agrees with the reported "after" numbers: mobile 98–99 with LCP 1.8–2.0 s, desktop 100, accessibility 100 and CLS 0 on all runs.
- Sent back to that session:
  - **must-fix:** live /support still says "billing" in its card text and in its meta, og and twitter descriptions, and the lint only catches "monthly/weekly billing";
  - **should-fix, annotations:** no annotations file or rows exist for its two commits;
  - **should-fix, lint holes:** "Download it free", "Free forever", "Cancel anytime", "Subscribe" and similar pass;
  - **should-fix, competitor false positives:** "Athan is free to download" FAILs;
  - **wording:** installLine is unused, so no page shows "Free to download.";
  - **wording:** the cover photo and the TOC come before the Quick Answer, which the answer-first rule says should sit right under the H1;
  - the Vercel WARN it quoted belongs to the billik team, not to QuranWall.
- **Its next step,** the visual redesign, got a go after the /support fix and the lint fixes, following the brief. The renderer, FAQ and pillar parts ship after the top session reviews the captures. The homepage waits for Karol.
- **Its parked instruction edits** (CLAUDE.md, SEO-STRATEGY, skill) wait for Karol's OK.
- **QuranWall follow-up, 08778e8 (code ff1a0b0), verified:**
  - Live /support has no "billing" anymore, and the whole live site is clean of price wording outside the legal pages.
  - Lint self-test 292/292; every phrase we listed now FAILs, and competitor sentences and Quran references pass.
  - Its annotations rows had gone into the FaithWall file by mistake. They now live in their own QuranWall file, and the FaithWall file checked intact: 19 rows ending 81f4eac.
  - Sent back as small items for its first redesign push:
    - 13 more evasion phrases pass, such as bare "trial", "one-time purchase" and "lifetime";
    - no recorded IndexNow ping for /support.
- **Karol approved QuranWall's parked instruction edits on 11-17** ("Approve them"). They cover its CLAUDE.md, SEO-STRATEGY (the stale L240/36/16 included) and blog skill. The approval went to the QuranWall session. Its scheduled-task prompts are not covered: they are already stricter than the rule.
- **Correction to the line above:** one sentence in QuranWall's scheduled-task prompts is stale. It still names `public/pricing.md`, and it says `llms.txt` keeps an install line, which is no longer true. QuranWall asked Karol before it edits them. 251df06 holds the approved edits (docs and instructions only, `lint-facts --prompts` 0 FAIL).

### QuranWall redesign push 1 reviewed (11-17)

- **What was reviewed:** QuranWall's local, unpushed branch `claude/qw-no-price`. It has four commits on top of origin/main:
  - 6507fbd: post block visuals and nine arch-framed inline SVG scenes;
  - 88b8681: the /blog cluster map and the /support visuals;
  - 59879f8: the verse-card comma fix;
  - 251df06: the no-price instruction wording.
- **How:** 20 captures, a read-only diff, and a workflow of four reviewers (posts on mobile, posts on desktop, /blog and /support, code) plus an adversarial skeptic. I also looked at the verse card myself.
- **The hard rules hold:**
  - no post-data or homepage change;
  - no squircle;
  - no price or "free" wording about QuranWall;
  - the FAQ answers and the FAQPage JSON-LD are still in the DOM;
  - reduced motion is covered;
  - every cluster-map node is a real link;
  - the scenes come after the answer and are never the LCP;
  - the CLS fix reserves the map box;
  - the /support four-step flow matches the "How does QuranWall work?" answer.
- **Verdict sent: OK to push after three fixes.**
  1. **The verse card breaks Karol's iPhone rule.** It is content-height, so a short verse gives a landscape box with the Dynamic Island on the long edge. The fix is a portrait lock-screen ratio and a re-capture.
  2. **The stat figure SVG is announced twice** by screen readers. The fix is to mark it aria-hidden.
  3. **The cluster map needs captures at 1024 and 1100 px,** because the nodes have only about 8 px of gap there.
- **Checks to run live after the push:**
  - the comma is gone;
  - the lazy images load (they were blank in the full-page captures);
  - a capture with the FAQ flow open;
  - a fresh CLS measurement on /blog;
  - `link-graph --live`;
  - IndexNow;
  - a row in QuranWall's own annotations file.
- **Left for push 2:**
  - the scene stack on the best-app post;
  - table semantics on phones;
  - the stat regex, the ring transform and the stagger time;
  - the SVG ids, the duplicate useInView name, and the FAQ region roles;
  - a distinct subject for each scene;
  - the stale lines in QuranWall's TODO-KAROL.md.
- **Refuted:** the blank icons and thumbnails are lazy-load capture artifacts. Post 1 has no Quick Answer because its data has none, and the text must not change. The scene repetition is a taste call, not a blocker.
- **QuranWall push 1 is live as 96fd64a and verified (11-17).**
  - **What I checked:**
    - a code read of 251df06..origin/main: only AppNudge, ClusterMap and blocks.tsx changed, with no post-data or homepage change;
    - a live crawl of 16 sitemap URLs, all 200;
    - `link-graph --live`, exit 0;
    - the re-captures;
    - an independent Lighthouse 12.8.2 run, mobile, 3 runs per page;
    - a skeptic.
  - **Results:**
    - the verse card is now a 9:19.5 portrait iPhone and shows no stray comma;
    - the stat SVG is aria-hidden;
    - the map nodes are sized by a container query;
    - "Free to download." appears twice per post, in the mid and end cards only.
  - **Lighthouse medians:**
    - /blog: performance 99, LCP 1.83 s;
    - the dhikr post: 98, LCP 2.14 s;
    - the best-islamic post: 96, LCP 2.43 s;
    - /support: 99, LCP 1.83 s;
    - TBT 0, CLS 0 and accessibility 100 on all four.
  - **Optional follow-ups, sent back:**
    - `label-content-name-mismatch` on the posts (WCAG 2.5.3);
    - capture hygiene: one mis-stitched full-page shot, and re-captures taken just before the commit;
    - the Offer price "0" in JSON-LD stays, as on FaithWall.
  - **Process:** QuranWall's implementer once ran `pkill -f lighthouse`, which is against the kill-by-PID rule. I asked it to put that rule in every brief.

## FaithWall visual layer on compare, about and maker pages (11-17)

- **The ask:** the FaithWall peer session asked for it on 11-17, to save time while its blog branch lands. It is FaithWall's part of the visual-redesign brief (Karol: the pages are "too text heavy… no visuals"). The scope was the homepage FAQ, the compare pages, the about page and the maker page's text, each getting icons, small step diagrams and one illustrated header. The peer's files were off limits.
- **Built:** one implementer pass, in cfb0b3d, rebased onto the peer's a389105.
  - New components live in `src/components/visual-pages/`. They reuse the illustrations primitives, including the round-corner iPhone with a Dynamic Island, and the shared `useInView` hook. The CSS sits in its own file, because `index.css` belongs to the peer.
  - **Compare pages:** a header scene (FaithWall lock screen next to a plain app screen) and an icon on every H2. From md up the scene sits beside the H1. On phones it sits after the Quick Answer, which I changed after the review so the answer stays first.
  - **About page:** a desk scene and section icons. It also gets heading, paragraph and link styling, because the Typography plugin isn't installed and `prose` did nothing.
  - **Maker page:** the text part gets a header scene, 7 icons and two step diagrams (Verse → Style → Size → Save, and Photos → Share → Use as Wallpaper). The tool itself is untouched.
- **Rules held:**
  - motion is CSS only: entrances of 0.6 s or less play once, loops run 5–8 s and pause off-screen, reduced motion shows the end state, and nothing above the fold starts hidden;
  - every visual is aria-hidden, and every label comes from the page's own text;
  - no text, install card, CTA or ct token changed;
  - no price wording.
- **Budgets:** +5.6 to +9.6 KB gzip per page, against a 30 KB limit, and every SVG is under 5 KB.
- **Review:** a code reviewer and a visual reviewer found no must-fixes. Each file's diff stays off the peer's changed lines, and the rebase was clean.
- **Gates on the rebased tree:**
  - typecheck: 5 errors, all in `entry-server.tsx` (no Node types) and not from this change;
  - build: 58/58;
  - lint-facts: self-test 271/271; `--all`, `--diff`, `--dist` and `--prompts` all 0 FAIL;
  - kw check: 0 fail;
  - NUL: 0;
  - `link-graph --dist`: exit 0.
  - The two "ours-phrases" hits in dist are competitor sentences (the ESV and YouVersion subscriptions) in best-free-bible-app-iphone. They are allowed.
- **Annotations:** one row (template change during the hold).
- **Held, not pushed: the homepage FAQ visuals.** They are on local branch `claude/fw-home-faq-visuals` (2db13d1, based on the pre-rebase main). They add an icon per question, a 3-step setup diagram and a header scene. Brief §F says Karol approves homepage changes from captures before they go live, and the peer confirmed it has no OK from him. Captures: `visual-redesign/faithwall/home-faq-{m,d}.png`.
- **Open:**
  - after deploy: one live Lighthouse run per page and a fresh compare-page capture on phones;
  - Karol's yes or no on the homepage FAQ;
  - QuranWall push-2 items (journal entry above).
- **After deploy (cfb0b3d live by 14:05):**
  - All 5 pages return 200 and carry the new markup.
  - CTA and ct tokens look the same as before: one web-cmp or web-maker install card where there was one, 4 web-site and 1 web-smart-banner.
  - No price wording about FaithWall. On the maker page, "Free Tool" and "Is this … free? Yes" are about the web tool itself, which the earlier session decided to keep.
  - `link-graph --live` exit 0. Its WARNs are the old title/H1 mismatches and og-card.jpg shared by 16 pages, which is expected after the peer's og commit.
  - One live Lighthouse run per page, mobile:

    | Page | Performance | LCP | Notes |
    |---|---|---|---|
    | youversion compare | 98 | 2.1 s | |
    | hallow compare | 96 | 2.4 s | the first run gave 91 / 3.1 s on a loaded Mac |
    | best-apps | 97 | 2.2 s | |
    | about | 99 | 2.0 s | |
    | maker | 96 | 2.4 s | the first run gave 95 / 2.6 s |

    CLS was 0 and accessibility 100 on all of them. Every LCP element is text.
  - The live phone capture shows the compare scene after the Quick Answer.
  - Captures: `visual-redesign/faithwall/*-live.png`.
- **Typecheck baseline:** the code has 0 errors from a389105 on. The main checkout counts 5, all in `entry-server.tsx`, because its node_modules lacks `@types/node`; the peer's worktree has it. So 5 is the baseline here, and it comes from the environment, not the code.
- **The held homepage FAQ** is rebased onto aa1f284 as `claude/fw-home-faq-visuals` 21a5d49 and not pushed.
  - Build 58/58; lint-facts `--dist` and `--all` 0 FAIL.
  - Its FAQPage JSON-LD is identical to the live one.
  - Nothing overflows at 390 or 1440.
  - Its captures (`home-faq-m.png`, `home-faq-d.png`, `home-faq-m-closed.png`) go to Karol with "Ship?".
- **Carried for the peer in this push:** 8484607 (its 299b80d: the lock-screen figure ref colour #b4561f → #8f4416 on the cream and sand palettes, contrast 4.12/3.38 → 5.88/4.82; used only by LockScreenVerse, so the maker downloads don't change) and 005068c (its 439b863, journal 39 note).
- **Homepage FAQ visuals shipped (11-17, after Karol's "Ship it" on the captures):**
  - The branch `claude/fw-home-faq-visuals` was rebased onto 8536e5d and became b611a40 on main. The only change besides the commit message is a code comment ("held for approval" → approved).
  - What it adds:
    - a small icon on each FAQ question;
    - a header scene above the FAQ heading;
    - a 3-step diagram (Pick your verse, Choose how to show it, Wallpaper or widget) inside the "How does … work" answer.
  - Everything added is aria-hidden and its motion is CSS-only. The FAQ text and the FAQPage JSON-LD are unchanged: the JSON-LD from the local build matched live exactly, 4 questions.
  - Gates: build 58/58; lint-facts `--self-test`, `--all`, `--diff` and `--dist` 0 FAIL; prompts 0 FAIL; NUL 0; link-graph exit 0; ours-phrases 2 (the two known competitor sentences). Typecheck 5 is the main checkout's environment baseline.
  - Size: homepage HTML plus its JS and CSS is +7.4 KB gzip versus live (budget 30 KB). Only `Home.tsx` renders the component.
  - Adversarial review: 3 lenses (accessibility/SSR, facts/copy, layout/motion), 0 findings.
  - Annotations row added. This is a homepage change during the control-group hold; Karol approved it.
