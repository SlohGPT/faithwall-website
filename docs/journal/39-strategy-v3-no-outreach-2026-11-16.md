# 39 — Strategy v3: no outreach, demand-tested new posts, 2026-11-16

Session type: manual session with Karol. The repo is public, so this entry is qualitative only. Numbers were shared with Karol in chat, not here.

## What was asked

Karol asked how SEO is going "simply written in the chat": are we publishing new blogs and thumbnails, modernizing, optimizing for keywords and clusters, and getting traffic? After the status answer he ruled out the off-site layer: "we will not get other websites to link us. No backlinks." He then asked why new posts had stopped, "is it based on your strategy or what?", and handed the call over: "you need to do the whole strategy here yourself, so it's up to you." Mid-session he pointed at the SEO knowledge in the `medix-takeover` repo.

## What was found

- **Traffic.** Clicks and impressions are up against the previous 28-day window, impressions much faster. Since the first data pull in early August clicks have roughly tripled. The generator is the largest source. The hub and the pillar follow. The money page is still flat after its 09-30 drop (entry 26). Same picture as entry 37.
- **Why posts stopped.** It was the strategy, in two steps. v2 (08-22) capped new posts at two a week and moved daily runs to depth, refreshes and outreach. Then the 10-19 hold stopped new URLs altogether, because the money page dropped inside a spam update and the October posts weren't being indexed (entry 01). From 11-09 the hold lifts once two of the four October posts are indexed. One is.
- **Why the October posts aren't indexed: the demand question.** Three of the four target topics show no demand in our data (entry 26). The fourth, `/blog/short-bible-verses-for-lock-screen`, did have demand, but the pillar `/daily-scripture-lock-screen` already ranks for its phrase. So "has demand" isn't enough: a new post also needs a phrase that no page of ours already holds.
- **Visible demand outside the generator and hub families is thin** in Search Console. Nearly every legible query already has its page. The few gaps (memorization app phrasings, "best christian app") belong to existing posts that rank deep, so they call for depth passes, not new posts.
- **Google autocomplete shows demand we don't serve:** Christmas Bible verse wallpapers for iPhone (short, KJV and aesthetic variants), Christian lock screens and Bible verse wallpapers for men (including black and aesthetic variants), and New Year Bible verses (KJV and image variants). No page of ours ranks for any of them.
- **The generator's title and meta have never been tested.** p29, p40 and p41 were body depth passes, and p4 was the homepage. The page has the most impressions on the site, and its click rate is low for its position.
- **Blog covers.** The local autopilot prompt still told new posts to reuse an existing cover with Unsplash credit. Since 11-04 the faithwall-blog skill generates lock-screen covers with `scripts/build-blog-thumbnails.mjs`. The untracked `.agents/skills/faithwall-blog` copy is the older Unsplash version. The autopilot reads `.claude/skills/faithwall-blog`, which is current.
- **medix-takeover SEO system** (a scout compared it with this strategy). It reached the same answer on tools: no paid keyword tools. Its topics come from Search Console plus autocomplete, with volume as a tiebreaker at most (its journal 273). Three of its practices fit a no-backlinks site and were missing here: an information-gain line written before drafting, a polite autocomplete harvest that stops at the first block, and a day-14/day-42 gate for new pages. Also worth a look later: its fixed AI prompt panel and its CTR band trigger.
- The marketing skills in `~/.claude/skills` (content-strategy and others) are generic. One idea was taken from them: forum questions count as demand evidence, and topics are scored on product fit.

## What was decided, and why

- **Off-site is retired (Karol's call).** Play 4 and §8 are gone, along with the `outreach-prep` and `citation-audit` item types and the "§8 monitoring pass" fallback. p64, p30 and p31 are retired. In three months no pitch was sent, so the layer produced nothing and kept costing daily runs. Authority is accepted as fixed. The brand KPI stays as measurement only.
- **New posts restart under a demand test (§5).** The test: (a) evidence people search the phrase, from Search Console, autocomplete or recurring forum questions; (b) no page of ours already ranks for it; (c) it fits the product, ending at a lock screen, wallpaper or widget; (d) an information-gain line written before drafting. Each new post also gets day-one in-body links from at least two indexed ranking pages (the grief post was indexed five days after p58's links). Seasonal posts publish 3-5 weeks ahead. The cap stays at two a week.
- **The new-URL hold is lifted.** It guarded against publishing into a penalty, and no penalty was found (the money-page drop is a results-page change). The demand test addresses the indexing problem directly. Two guards replace the hold. The indexing brake: if p67 and p68 are both unindexed 21 days after publishing, the weekly refresh pauses new-post items. The new-page gate: a post with no impressions 14 days after indexing, or fewer than ten by day 42, gets a queued fix.
- **The classic fallback post is retired.** It took unused keywords from `seo-keywords.json` with no demand evidence, which is how the October topics were chosen. A day with nothing eligible now does nothing.
- **Queue order**, with the reasons. p67 goes first because Advent starts 11-29 and new posts take time to index. p68 comes after p65, so the two posts land on different days inside this week's cap. The ctr-fix and the depth pass wait until 11-24, after the core update. New Year is dated 12-01.
- **The held post** `/blog/bible-study-group-iphone-tools` joins p63's audit. It is published only if it passes the demand test. Otherwise it stays unpublished and is flagged to Karol for deletion.
- **No paid keyword tool.** Autocomplete proves a phrase is searched but gives no volume. A pay-as-you-go volume API such as DataForSEO would need an account and money from Karol. US English volumes are reliable there, unlike medix's niche. It's an option for later, not a need.

## What was built

- `SEO-STRATEGY.md`: v3 header and "What changed in v3" paragraph; Play 4 and §8 replaced by RETIRED notes (full text in git history); §5 cadence rewritten as the demand test (a)-(d), with the autocomplete rule, day-one links and seasonal timing; §4 rule 8 widened; §6 rule 1 (hold lifted, fallback retired, indexing brake), retired type contracts, rules 7 and 8 (new-page gate); §7 v3 prohibitions; v3 notes where live instructions still pointed at §8 (§1, §2, Plays 1-3, §9 rules 1 and 6, §10 items 2 and 6).
- `src/data/seo-priorities.json`: p64, p30 and p31 retired to `done[]`; p63 note about the held post; new items p67 (Christmas Bible verse lock screens, now), p68 (Christian lock screens for men, now), p69 (New Year Bible verses, from 12-01), p70 (generator title/meta test, from 11-24, with the current title and meta quoted as the rollback baseline) and p71 (depth pass on the memorization-apps post, from 11-24). Pending order: p67, p65, p68, p63, p70, p66, p71, p69. `updated` bumped, note appended.
- `TODO-KAROL.md`: a v3 block at the top. The "send the pitches" item is removed, and the old hold line is marked superseded.
- Outside the repo, in both accounts' copies of the scheduled tasks (backups were made, then removed once the diffs were checked):
  - `faithwall-seo-autopilot-local`: the outreach and citation types are retired; the fallback is now "nothing to do today"; covers come from the generator script, not Unsplash reuse; new posts need day-one links; PAUSED items are skipped.
  - `faithwall-seo-refresh`: b3 (placement checks) is retired. Step c now supplies demand-tested new posts (Search Console, polite autocomplete, Reddit) and seasonal look-ahead. The indexing brake and the new-page gate are added.
  - The cloud routine's prompt was not edited. §6 rule 1 says it overrides the fallback step in routine prompts, the same way the hold did.
- This entry and `docs/README.md`.

## How it was verified

- The JSON round-trips byte-identically through Python `json.dumps(indent=2, ensure_ascii=True)` plus a newline, and parses after the edit. The pending order was checked by script.
- Every verse named in p67-p69 exists in `public/bible/kjv`, and the four day-one link candidates are published posts.
- Strategy grep: every live mention of §8, outreach, the monitoring pass or the hold is retired or carries a v3 note. Historical dated text was left alone.
- Both copies of each task prompt changed identically (diffed against the backups).
- Demand evidence: Google autocomplete (about 20 requests, topic seeds only) and today's Search Console dump.
- No build was needed: app code doesn't import the JSON, and no page changed.

## Still open

- 11-17: the autopilot should pick p67. The merge gate verifies it as a normal new-post branch.
- Karol: request indexing for the three unindexed October posts; the campaign review (does generator traffic become installs?); Cloudflare; the hub's first-person testing claim.
- 11-23 refresh: the first run of the new supply step and the INDEX STATE line for p63.
- Brake check around 12-08 to 12-10 for p67 and p68.
- Possible later: port medix's `topic-sources.mjs` idea (Search Console plus autocomplete gap list) into `scripts/`; a fixed AI prompt panel; DataForSEO volumes if Karol wants numbers.

## Update, 2026-11-16 evening: conversion and measurement layer (v3.1)

### What was asked

Karol asked for a review of the whole system "as an SEO expert": "different design, easier to read, better CTAs to download the app ... how we could actually improve the SEO and the conversions". He asked for the same system on the QuranWall and NoteWall sites ("communicate with the quranwall website and notewall website folders"), so all three sites push the three apps. He was unsure about other languages ("I don't know if we should push in other language than English"), asked about GEO and about pinging webmaster tools or Search Console after publishing, and asked for research that is "as complex as possible". "Everything's up to you."

### How it was done

Research ran as multi-agent workflows: audits of all three sites (design, readability, calls to action, technical SEO, AI answers, indexing), checks of Apple's and Google's rules against primary sources, Search Console reads, and adversarial verification of every finding. Then came a build wave, and an adversarial review of the finished diff. Its confirmed findings were fixed, and five refuted ones were skipped. The other two sites are never edited from here: they got written briefs, sent to their own sessions.

### What was found

- **The site asked for the install weakly.** Long posts had few App Store links, most of them far down the page. The badge was hand-drawn, not Apple's artwork. Campaign tokens were per page (`blog-<slug>`, `pillar-<slug>`), which splits installs too thin to ever pass Apple's reporting threshold (5 first-time downloads per campaign), and long slugs pushed tokens past Apple's 30-character limit for `ct`.
- **Product facts had drifted in places.** The homepage said "No accounts required" and promised a "new verse or prayer". A second, sitewide app schema still said iOS 16.0+. The EULA described NoteWall. A newsletter form submitted nowhere. Testimonials of unknown origin ran with stock avatars. A phone-checking stat and an app count in one post were out of date.
- **Unknown URLs answered 200.** The catch-all rewrite to `index.html` served the app shell for any path, which made every typo a soft 404.
- **The App Store listing and the site disagree in five places** (Bible reader, verse suggestions, the widget's daily verse, "rated 4.9", wallpaper packs). Karol decides each one (TODO-KAROL).
- **AI crawlers:** Cloudflare's managed block still answers GPTBot and ClaudeBot with a 403. OAI-SearchBot (ChatGPT search) and PerplexityBot get a 200.
- **Languages:** the large majority of FaithWall's clicks come from English-speaking countries. NoteWall's search traffic is English. QuranWall has no Search impressions yet.
- **Pinging:** Google has no ping. Its sitemap ping is retired, and its Indexing API covers only job postings and livestreams, so Google learns from the sitemap's `lastmod` and from a manual Request indexing. IndexNow reaches Bing (which feeds ChatGPT search and Copilot), Yandex, Seznam, Naver and Yep.

### What was decided, and why

- **Conversion comes before more content (v3.1).** Without backlinks, the visits we already earn are the main lever left.
- **12 fixed campaign tokens, each at most 30 characters.** They are readable in App Store Connect, and each can reach Apple's reporting threshold.
- **Apple's badge, unmodified.** The phone bar uses a brand "Get the app" button instead of a shrunken badge.
- **Install cards:**
  - At most one mid card per post, placed by rules that keep it away from images and other calls to action, and below at least 30% of the text.
  - An end card on every treated post.
  - `data-nosnippet` on cards only, so snippets and AI answers quote the article and never a CTA.
  - No headings inside the cards, so the article outline doesn't change.
- **Desktop and Android:** on desktop the cards add a QR code and Copy link, because a Mac can't install an iPhone app. Android gets the badge plus "FaithWall is made for iPhone." and no bar.
- **A control group, because the core update is still rolling.** The hub, six control posts, every pillar and every compare page keep today's CTA markup until p72 (not before 12-02, and only after a private read-out). If the cards cost Search visibility, it shows up as a gap against held pages; without a control group the core update would hide it.
- **Real 404s.** The catch-all rewrite is gone, and `404.html` is noindex.
- **One app schema, on the homepage only,** with no rating copied from the App Store.
- **Gates:**
  - the fact lint blocks merges;
  - `check-facts` runs weekly;
  - URL Inspection runs on Mondays;
  - `submit-indexnow --changed` runs after each deploy that changes pages;
  - the checklist is in SEO-STRATEGY §11.
- **English only for now.** A translated page that lands on an English listing converts poorly, and the demand isn't visible yet. Portuguese (Brazil) is the first candidate (p77 decides from 12-07), Spanish the second.
- **No cross-promotion between the three sites.** Each site links only to its own app: cross-linking would read as a network, blur each site's topic and muddy attribution, since the apps share one provider token.
- **Sister sites:** QuranWall builds the layer with no control group, because it has no impressions yet. NoteWall builds it with its own control group: its top post protected, ten paired control posts, and its pillars and compare pages.

### What was built

- **b73c084** (94 files):
  - `facts.json`;
  - `lint-facts.mjs`, `check-facts.mjs` and `inspect-urls.mjs`;
  - `submit-indexnow --changed/--dry-run`;
  - the official badge and Apple's credit line;
  - the token list and the Smart App Banner token;
  - `AppNudge` install cards with `InstallHandoff` (QR + Copy link) and `useIsAndroid`;
  - BlogRenderer placement, the hold set in `conversionHold.ts`, and the sticky bar;
  - `404.html` and the rewrite removal;
  - homepage copy matching the app, with the fake form, unused components and stock avatars removed;
  - fact fixes in 31 posts, the Hallow row (closes p65), og:image on /blog and the legal pages, and sitemap lastmod 11-16.
- **This docs commit:**
  - SEO-STRATEGY v3.1 note, the §10 measurement bullet and the new §11;
  - queue: p65 closed; p63, p70 and p71 re-dated to 12-02; a hold note on p66; new p72-p77;
  - the TODO-KAROL v3.1 block;
  - this update and the hub.
- **Outside the repo:**
  - All three scheduled-task prompts, in both accounts:
    - the merge gate runs the fact lint as a blocking check, submits with `--changed`, curls a 200 and a 404, and logs cohort annotations;
    - the refresh gains step 3e (check-facts, URL Inspection, the cohort read-out, the campaign read);
    - the autopilot gains rule 0b (facts, tokens, hold) and the lint in its verify step, and its queue round-trip note now names Python.
  - The private cohort file got its ship date and an annotations row.
  - Part-2 briefs went to the QuranWall and NoteWall sessions.

### How it was verified

- **Local build:**
  - the build passed: 57 routes plus the 404;
  - typecheck stayed at the 7-error baseline;
  - the fact lint showed 0 FAIL in diff, dist and all-files modes;
  - a dist check found mid and end cards on all 34 treated posts, one tool card, only listed tokens, and every sitemap URL built.
- **Headless phone, desktop and Android checks:**
  - no overflow and no console errors;
  - the bar appears after one screen and hides at held CTAs, and its dismiss target is 44x44;
  - two QR codes and two Copy link buttons, with unique fallback ids;
  - no bar on Android.
- **Live, after the deploy:**
  - all 57 sitemap URLs answer 200;
  - unknown URLs and the unpublished post answer 404 with noindex;
  - `/blog/faithwall-vs-hallow` 308s to `/faithwall-vs-hallow`;
  - the badges, QR code and favicon are served;
  - the Smart App Banner carries its token;
  - one app node on the homepage and none on posts;
  - a treated post has both cards, and a held post has none, with its CTA marked;
  - IndexNow accepted all 57 URLs once.
- **Prompts:** each pair differs only in its names, and `lint-facts --prompts` gives 0 FAIL.
- **Queue:** the JSON round-tripped byte-identically before the edit and parses after it.

### Still open

- QuranWall and NoteWall are building part 2. They reply to this session with commit hashes.
- Karol: the TODO-KAROL v3.1 items, first the campaign read around 12-15 and the iPhone check.
- 11-23: the first refresh with step 3e.
- From 12-02: p63, p70 and p71. The first refresh on or after 12-02 writes the cohort read-out, and then p72 releases the hold or the refresh extends it.
- 12-07: p77, the Portuguese go/no-go.
- Not done: trailing-slash and `/index.html` duplicates (p75; canonicals already point at the clean URL), cover image formats (p74), the post bundle (p76). Android-only elements shift only below the fold, which is accepted.
