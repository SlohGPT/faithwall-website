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

## Update, 2026-11-16 night: other languages and the sister sites

### What was asked

Two follow-ups from Karol arrived while the conversion layer was shipping:
- "research if actually publish blogs in different languages, like and target the other countries, for all of my free apps";
- "for all of my apps, since for example Quran Wall, like you should know where we get our customers the most or where it would help basically".

The sister sites' part-1 and part-2 work was also due for a check.

### How it was done

- **Languages:**
  - A research workflow covered six areas:
    - revenue by country (RevenueCat);
    - App Store downloads and listings by storefront;
    - Search Console by country;
    - search results and autocomplete;
    - scripture and translation rights;
    - implementation cost.
  - A critic and two verifiers then checked the result.
  - The ASO session supplied its own revenue audit per language: ASO repo, `docs/journal/04-audit-record/07-country-value-for-web-languages.md`. That audit's decision rule settled the question.
  - The figures live in the private notes (`~/.claude/faithwall-gsc/research-2026-11-16/i18n/`), not here.
- **Sister sites:** a verification workflow ran three independent checkers per site:
  - the code against the briefs;
  - the live site, with the QR codes decoded;
  - leaks and the scheduled prompts.
  Every finding then got an adversarial re-check.

### What was found

- **Where the customers come from:**
  - **FaithWall:** the US brings most of the money. Brazil brings many installs but little money per install.
  - **QuranWall:** Turkey is the biggest market, by installs and by number of payers. The US has few payers, but each is worth more. The rest is spread thin over Egypt, Indonesia, Pakistan, the Gulf and Malaysia.
  - **NoteWall:** English-speaking countries bring most of the money.
- **The money rule (ASO audit):** a translated post pays only if its clicks beat a US-audience English post's by more than the value ratio times the effort ratio.
  - On today's numbers, Portuguese and Turkish posts need many times the clicks, and Arabic needs more.
  - Fewer of those clicks come from iPhones, which raises the bar again.
- **This site and Brazil:** Google barely shows faithwall.app in Brazil. The App Store reaches Brazil through the live Portuguese listing.
  - Correction to the evening update: "the listing is English" was wrong for Brazil, France and Italy, where FaithWall's listing is localized.
- **The research synthesis said "go now" for a 3-page Portuguese pilot.** The critic and the money rule overruled it, for four reasons:
  - the synthesis's own success bar came to roughly one install a month;
  - the build would change the English pages' asset hashes during the control-group window;
  - keyword demand was never pulled;
  - the native reviewer had no cost or availability.
- **Rights:**
  - FaithWall's app ships Bíblia Livre (CC BY) with no user-facing credit found. It also ships two texts labelled non-commercial: Schlachter 1951 and Uwspółcześniona Biblia Gdańska.
  - QuranWall's bundled translations match Tanzil-distributed editions, whose terms say non-commercial only.
  - Both apps' items go to Karol. QuranWall's are in its own TODO-KAROL.md.
- **Vercel:** the three app sites don't appear in the shared client team's usage report, so which account hosts them is unconfirmed. The question goes to Karol.
- **QuranWall:** 15 candidate findings, 10 confirmed. The main ones:
  - a banned "60 seconds to set up" stat is live on the home page, and the lint can't see it;
  - "thousands of believers";
  - two FAQs name a "Premium" plan. The listing's in-app purchases are called "QuranWall+" or just Weekly and Yearly;
  - the lint's rescue list lets "the only app with…" claims through;
  - a local path sits in a public script.
- **NoteWall:** 16 candidates, 7 confirmed, none of them a live banned claim:
  - the "free" rule misses "Download NoteWall Free";
  - nothing re-bans the on-device privacy claims removed today;
  - two static files carry tokens outside the fixed list;
  - some product facts are typed by hand.

### What was decided and why

- **FaithWall: English only, Portuguese included.**
  - A Portuguese page can't pass the money rule on today's numbers.
  - The App Store moves Brazil better: the Portuguese keyword refresh after the 12-14 hold (ASO repo, Karol's OK), plus a Brazil price and offer check.
  - p77 now re-checks two triggers from 2027-01-15:
    - a Brazilian customer worth at least about a quarter of a US one;
    - or Portuguese keyword demand that clears the break-even.
  - A go waits for p72 and for a scripture text that is cleared and credited.
  - Spanish, Italian, French, German, Korean, Russian and Polish: no.
- **QuranWall: a Turkish go/no-go from 12-15**, on three conditions:
  - at least half its English URLs indexed;
  - a Turkish reviewer who knows Islamic terminology;
  - a quote policy: Diyanet's written permission, or reference-only pages.
  - Other languages:
    - Arabic: no until 2027-04;
    - Indonesian: after Turkish;
    - Malay and Urdu: blocked until those listings exist;
    - French: no.
  - Its own repo records this.
- **NoteWall: English only.** English-speaking countries carry its revenue, and its English pages already reach non-English searchers. Japan's weak listing conversion is App Store work.
- **Sister sites:** every confirmed finding went back to its session, with the fix.

### What was built

- **This docs commit:**
  - SEO-STRATEGY §11 "Languages" rewritten;
  - p77 re-specified;
  - the TODO-KAROL night section: the agreement, languages, Brazil, Bible credits and Vercel;
  - this update and the hub.
- **Outside the repo:**
  - The cohort file's notes got the ASO read-out context.
  - Messages with the verified fixes and the language verdicts went to the QuranWall and NoteWall sessions.

### How it was verified

- **Language figures:**
  - Two verifiers re-derived the revenue and download tables from the primary data.
  - The ASO audit had its own verifier per app.
- **Sister sites:**
  - A second agent reproduced each confirmed finding.
  - Before the messages went out, the flagged strings were grepped again at both repos' latest commits.
  - The "Premium" finding was checked against the in-app purchase names on the live listing.
- **Queue:** the JSON round-tripped byte-identically through Python before the edit, and parses after it.

### Still open

- Karol: the agreement first, then the rest of the night section.
- QuranWall and NoteWall: fixes in progress. They reply with commit hashes.
- 12-15: QuranWall's Turkish go/no-go, and this site's first campaign read.
- 2027-01-15: p77.

## Update, 2026-11-16 late night: a free keyword research tool for all three sites

### What was asked

Karol: "anything else you want to research and build strategy on, let's say GEO or free tools or keywords? Maybe you can find some keyword researcher that will help you research the keywords for free … something open source like this or something free which we could actually use with MCP or API … so we can actually research the keywords and basically have the exact cluster to make content, either free tools or blogs or comparisons … then communicate with all of the sessions, so everything will be like the system will be the same on all of the apps Just unique with the keywords cluster and stuff."

The sister sites' fix rounds were also due for a check.

### How it was done

- **Research:** a workflow swept four areas:
  - free and open-source keyword tools;
  - official APIs;
  - MCP servers;
  - the evidence on GEO, meaning what gets a site cited by AI search.

  A critic and verifiers then checked the result against the vendors' own pages. The notes stay private, outside the repo.
- **Build:** a written spec went to a builder agent. Three reviewers then read the result, each through one lens: correctness, safety and portability to the sister repos. A fixer and a verifier followed. A second round fixed what the first real run showed, again with three verifiers, a fixer and a re-verifier.
- **Sister sites:** a checker per site and lens (content and live pages, then lint and gates). Two skeptics per site re-judged every finding.

### What was found

- **No free tool gives real search volume.**
  - The open-source "keyword researchers" either scrape Google, against its terms, or resell Keyword Planner data.
  - No MCP server offers keyword ideas. Google's official Ads MCP server has no keyword-ideas tool.
  - pytrends is archived, and scraping Trends breaks Google's terms.
- **What is free and allowed now:**
  - Search Console's API: our own queries, pages and query-by-page pairs, with regex filters.
  - Google autocomplete, used politely. It proves a phrasing is searched, never how often.
  - Forum questions read by hand.
- **Free once Karol sets it up:**
  - the Bing Webmaster Tools API (queries and related keywords: evidence, not volume);
  - Bing's AI Performance report: Copilot citations, interface only;
  - Search Console's AI report: impressions only, interface only;
  - the Trends API alpha, by application only.
- **Paid, later, only with Karol's OK:** DataForSEO pay-as-you-go, or the Google Ads Keyword Planner API, which is gated behind an approval. Keywords Everywhere is the small alternative.
- **GEO:**
  - No study shows llms.txt or schema raising AI citations. Schema stays for rich results and accuracy only.
  - What matters is that AI search crawlers can reach the pages, and that the pages say clearly what each app does.
  - The ASO session's private referrer data adds the stakes: ChatGPT's iPhone app is the biggest single referrer of App Store downloads for all three apps. For FaithWall and QuranWall it is ahead of all websites together. App Store search is still much bigger.
- **The ASO session's November brief (private data, direction only):**
  - US English pages are the most valuable site work.
  - The App Store's web referrer line moves with how ChatGPT routes people, so it can't show whether the site works. The campaign tokens can.
  - US metadata and the FaithWall and QuranWall builds are frozen until 12-14.
  - The two tokens it didn't recognise, `web-home-hero-mobile` and `web-nav-mobile`, are names from before b73c084 (2026-10-02 to 11-16). The site no longer emits them. §11 now maps every older token to today's name.
- **First cluster pass on this site** (run note `docs/keyword-research/2026-11-16-faithwall.md`, map `src/data/keyword-clusters.json`):
  - The random verse generator family is by far the largest. The tool page shows for almost all of it but gets few of the clicks: that is p70's title and description work after 12-02. A steady sub-intent wants a whole chapter, book or passage, which becomes a mode on the same tool, not a new URL.
  - Comparison queries come second. Lock screen queries split cleanly: app-shaped ones land on the lock screen app roundup, how-to ones on the pillar. The pillar, not the post, shows for "short bible verses for lock screen", which is the p63 case.
  - Autocomplete shows wide mood demand (anxiety, strength, "when you feel"), but it barely reaches the site. A verse-by-feeling picker is recorded as a candidate free tool, not a decision.
  - Short follow-ups typed inside AI Mode ("are these free", "for iphone", "yes please") already reach the hub, the random verse tool and the homepage. So do long "alternatives to [app]" questions on the prayer roundup. AI search seems to use some of our pages already.
  - Two shared-query pairs look like the same intent on two kinds of page (Hallow vs Abide; Christian news apps): questions for the overlap audit after the read-out. The wallpaper pairs match a post with the maker tool, different intents, so they stay apart and link to each other.
  - No page change and no queue item came from this pass. Everything waits for the 12-02 read-out; the 11-23 refresh turns the map's decisions into queue items with cluster_id.
- **Sister fix rounds** (findings both skeptics kept went back to each session tonight; each replies with a hash):
  - QuranWall (checked at 6c7f69c; its later 795957d and 473c711 change docs only): every claimed fix holds, with its self-test and gates. Sent back: download counts written with k or as installs, counts in words past ten, a few setup and plan-name phrasings, its docs' naming of one round, the legal pages' app name, and llms.txt wording. Also sent: the site, the listing and the EULA disagree on what the wallpaper shows (one ayah you chose, in Arabic or a translation, against "a new ayah every day" beside a translation). That is Karol's answer, through its six-question TODO item; the listing side goes to the ASO session. Its licence item gains the website's own translation quotes.
  - NoteWall (0c1916e): the claimed fixes are live. Sent back: a high-severity post claiming per-goal wallpapers that rotate through the day; "iPhone-only" wording where the listing also lists iPad; an unbacked "join thousands"; gamification and "seamless" leftovers; an unnamed phone-check study on many posts; a dateModified bump on a held page that its annotation doesn't record; and lint gaps (unsupported features, vague sources, ratios written without a percent sign).

### What was decided and why

- **Build our own, free tool:** one dependency-free script, the same file on all three sites, with each site's settings in its own config.
  - Search Console stays the best evidence.
  - Autocomplete goes only through the tool, which holds one allowance per site per day and stops at the first error.
  - Raw data lives only in a private folder outside the repo.
  - The public cluster map carries no numbers.
  - A volume can appear only as a band from Keyword Planner or DataForSEO, with its source and date.
- **Suggested decision order, a deliberate change from the research design.** The design put the App Store handoff first. The tool checks our own pages first, in this order: brand queries and AI follow-up fragments (monitor), hold, prune-merge (only between pages of the same kind), long AI Mode questions (monitor, or an FAQ answer), CTR fix or refresh, App Store handoff, FAQ answer, tool page, comparison, new post. The reason: this site's money pages already rank for app-shaped queries, so an app-install query goes to the App Store keyword work only when no page of ours shows for it.
- **Page kinds for prune-merge:** posts, tool pages, the homepage and other pages. Two pages of one kind may merge; pages of different kinds get linked. A private flag marks clusters where two pages each get a real part, so the read-out sees the overlap even on held pages.
- **A short head is a follow-up fragment unless it, or members holding at least half of its cluster, match a regex family.** My brief said any member would do. On the real data one stray member kept "free" and "app" out of monitor, so I kept the builder's share rule. A site with no regex families skips this test.
- **The config names the private folder,** as older files in this repo already do. Naming a folder leaks nothing in it. The engine exempts only that key and the credential path from its own path check.
- **The default credential is the shared indexing service account,** the same default as the three Search Console scripts, which now build the path from the home folder instead of a fixed user path. A sister config may set its own `key_path`. doctor names the source it used, never the path.
- **The engine runs locally only:** in the weekly refresh or a manual session. The cloud run has no private data folder and can't reach every API.
- **geo-probe joins the weekly refresh.** An AI search bot that is blocked or refused is now a regression for the TODO list, given the ChatGPT referrer finding. Training-bot blocks stay Karol's Cloudflare decision. Tonight's probe: the search and user bots are allowed; GPTBot and ClaudeBot are still refused, which is that open decision.
- **The App Store's web referrer line is no site KPI** (§11). The campaign read uses the tokens only.
- **The sister sites port the same file byte for byte, checked by its sha256.** A bug is fixed here and re-sent, never forked.

### What was built

- `scripts/keyword-research.mjs`: one dependency-free Node script (Node 18 or later) with `doctor`, `gsc`, `expand`, `check` and `geo-probe`, plus stubs for Bing, volumes and result-page checks that wait for keys. Private output goes to the private folder, which only Karol's account can read. The script holds the daily autocomplete allowance per site and refuses seeds that look personal. Its `check` fails a public file that carries a metric number, a position, a percentage, money, a private path, a key-shaped string or a schema error. `check --staged` runs before the weekly refresh commits. There, naming a private file is a warning; a home path, a secrets path or a key-shaped string is a failure.
- `src/data/kw-config.json`: this site's seeds, markets, intent rules, regex families, held pages and tool pages.
- `src/data/keyword-clusters.json`: the first curated map, one decision per cluster, qualitative evidence only.
- `docs/keyword-research/README.md` (how-to, clustering rules, decision rubric) and the first run note.
- `package.json`: `npm run kw` and `npm run kw:check`. `.gitignore`: key files and a private folder name.
- The three Search Console scripts (`gsc-dump`, `gsc-report`, `inspect-urls`) build the default credential path from the home folder. Those edits had sat uncommitted since earlier work.
- SEO-STRATEGY §5: autocomplete goes only through the engine, plus a paragraph on the engine and the cluster map. §11: the older-token map and the web referrer line.
- TODO-KAROL: the late-night section. The App Store agreement still comes first.
- Outside the repo:
  - the two weekly refresh prompts now run doctor, gsc and geo-probe, curate the map, write a run note and run the staged check before they commit;
  - the two local autopilot prompts read an item's cluster and never run the engine.

### How it was verified

- **Research:** a critic and verifiers checked each claim about tools, terms and APIs.
- **Engine round 1:** three reviewers (correctness, safety, portability) found 34 issues. A fixer closed them and a verifier re-checked.
- **Engine round 2:** this round brought the staged-check split, the decision order, tool pages and page kinds, private near-match hints in the expand output, and "searched" as a metric word. One builder, then three verifiers, then a fixer and a re-verifier for their 11 findings.
  - The final state: self-test 98/98, doctor with no warning, eslint clean, `kw:check` on the four public files with no failure or warning.
  - The staged cases were proved in a scratch git repo.
- **On the real data (decisions only):**
  - Brand queries and AI follow-ups come out monitor: iphone, free, yes, app, another, and "how can i change it".
  - Held pages stay hold.
  - The long AI Mode questions on the prayer roundup are monitor, or an FAQ answer where the page shows lower.
  - prune-merge fires only between posts.
- **During curation:** `kw:check` caught a position phrase in the README, and it was reworded.
- **Before the commit:** typecheck at its known baseline (all errors outside this change); the build and prerender green on every route; `lint:facts` with no failure or warning; no site file imports the two new data files, so no page changed; `kw -- check --staged` on the staged files passed.
- **Sister checks:** a checker per site and lens, then two skeptics per finding. A finding was sent as confirmed only when both kept it.

### Still open

- Karol: the late-night TODO-KAROL items. The Bing key and the analytics and CDN answer unblock the most.
- QuranWall and NoteWall: their fix rounds (sent tonight), then the engine port. They reply with a commit hash and the sha256 of their copy. Their configs start with their own seeds and families; with no families, the short-head test is skipped.
- 11-23: the first weekly refresh with the engine. It writes a run note and curates the draft clusters. Seasonal seeds for p67 and p69 go into the config before then.
- The cloud autopilot's prompt doesn't mention the cluster map yet. Only the local runs read it.

## Update, 2026-11-16, last of the night: what the app really does, engine 1.1.0, sister rounds

### What was asked

Karol's late-night request still stands: one keyword system on all three sites, each with its own clusters, with the sessions kept in step. The skeptic checks on the first engine port also turned up accuracy errors on this site and bugs in the engine. This update fixes both, re-sends the engine and checks NoteWall's fifth round.

### What was found

- **Against the iOS source** (read-only):
  - **FaithWall has a Bible browser.** `BibleExplorerView` and `VerseListView` open every book and chapter. Yet llms.txt, pricing.md, the home FAQ, the hub, the YouVersion compare page, the Olive Tree post and the random-verse page said it was "not a Bible reader".
  - **Widget rotation is opt-in.** `widgetRotationEnabled` is false by default. The setting is called "Auto-rotate verses" and offers every hour, every 8 hours or every day. The site described rotation as what the widget does by default: 45 sentences on 25 files.
  - **Counts:** 24 translations (8 bundled) and 10 interface languages. The lint had no number check, so a wrong count would have passed.
  - **Free exports:** the app's code gives new users 3 free wallpaper exports and the Terms say so, while the paywall has no close button and the site says there is no free tier. That is Karol's call.
  - **An orphan path:** `/blog/best-free-all-time` had links pointing at it but no page.
- **Engine, from both sister ports** (each finding kept by two skeptics):
  - companion slugs in a queue target ("(+ ...)") were not parsed, so those pages were not held;
  - the App Store handoff flag fired on every app-install cluster, not only where no page of ours ranks;
  - building a draft dropped a handoff the curator had set;
  - the README listed none of the words the check refuses;
  - the geo-probe text assumed Cloudflare, but two of the three sites are on Vercel.
- **The two local autopilot prompts** still carried the old product facts ("a rotating widget", "not a Bible reader"). The autopilot would have written exactly what the merge gate now fails. The cloud routine's prompt has no product facts.
- **NoteWall round 5:** the phone-check statistic fixes are live and correct. What both skeptics kept went back to their session: claims about users and how often people look at their phones, the post title that still says the wallpaper changes "automatically", and lint gaps.

### What was decided and why

- **The wording used wherever this was fixed:** "a widget that shows that verse (an optional setting, off by default, makes it show random verses instead)" and "a built-in Bible browser (all books and chapters) for finding your verse, but it is built for the lock screen, not for study". The YouVersion compare row keeps "no reading plans".
- **Held pages got fact fixes only,** as the hold allows: the hub and two compare entries.
- **The other 44 widget sentences wait for p78,** which runs after p72. A sweep across 20 posts shouldn't land inside the cohort read-out. Until then the merge gate fails any added line that repeats the claim, so a page the autopilot touches gets fixed on contact.
- **The legal pages are Karol's.** The Privacy Policy and the Terms say "a rotating lock-screen widget"; the suggested wording is in TODO-KAROL.
- **"No free tier" stays until Karol answers** the free-exports question.
- **The lint learns the facts:** a Bible-reader denial fails, and so does a translation or language count that differs from `facts.json`. A widget sentence with no opt-in warns in `--all` and fails on added lines. `--self-test` keeps the cases.
- **One engine for three sites.** The fixes go into the shared file as 1.1.0 rather than into per-site patches. The sisters port it and match the sha256.
- **The key-shaped-string rule** in `check --staged` also flags long mixed-case URL paths, such as an Unsplash photo URL. The hub's photo URL was shortened to the photo id, which redirects to the same page. The engine fix waits for 1.2.0.

### What was built

- `8e53929` site:
  - `public/llms.txt` and `public/pricing.md`;
  - the home FAQ, the hub and the Olive Tree post;
  - the YouVersion compare page and the lock-screen apps compare page;
  - the random-verse page and the blog skill's product facts;
  - `facts.json` (translation and interface-language counts);
  - a redirect from `/blog/best-free-all-time` to the hub;
  - three new lint rules and a self-test in `scripts/lint-facts.mjs`.
- `4c2e886` keyword engine 1.1.0:
  - companion slugs held, and "gated" queue items count as pending;
  - the handoff flag only within position twenty, and the curator's handoff kept;
  - a `bot_settings_hint` config key instead of the Cloudflare text, and a doctor warning for lookaround advice;
  - the README's "Words the lint refuses" section.
- `0b45c4f` queue: p78 (the widget sentences, after p72) and p71's note.
- Outside the repo: the product-facts line in both local autopilot prompts.

### How it was verified

- The method:
  - finders, then two skeptics per finding; only findings both kept were built;
  - per part, one builder, three reviewers, then a fixer.
- **Site gates on the release:**
  - `lint:facts` (diff and dist): no failure or warning;
  - `--all`: no failure, 44 warnings, all of them the widget sentences left for p78;
  - `--self-test` passes every case;
  - typecheck at its 7-error baseline;
  - build and prerender green on all 57 routes;
  - no NUL bytes in `dist/`.
- **Engine:**
  - self-test 103 of 103;
  - `kw:check` clean on all three sites;
  - holds on FaithWall and QuranWall unchanged; NoteWall gains its three companion pages until 12-01.
- The shortened photo URL returns a redirect to the original photo page.

### Still open

- **Karol:** the newest TODO-KAROL section (free exports, the legal pages, two phrases to confirm).
- **p78** after p72.
- **NoteWall:** the round-5 findings and the 1.1.0 port were sent.
- **QuranWall:** its session is closed. Its findings and the 1.1.0 port wait for a new QuranWall session.
- **Engine 1.2.0:** URL paths in the key-shaped-string rule.
- Still unanswered from the late-night update: the cluster-map line for the cloud autopilot prompt.

## Update, 2026-11-16, after the deploy: the parked homepage branch

### What was checked

The homepage redesign waits on the local branch `claude/laughing-lamport-805274` (head a9af949, with its own entry 40 on that branch). Karol approved its iPhone frames. After the deploy, the branch was test-merged onto afcc138 in a scratch clone, and `lint:facts` ran on the lines it adds. Nothing on the branch was changed: it belongs to the redesign session.

### Found

- **One merge conflict:** `docs/README.md`. Both sides changed the hub status, so it needs a hand merge. `homeFaq.ts`, changed on main in 8e53929, merges cleanly.
- **One fact failure:** the hero image's `aria-label` in `src/components/Hero.tsx` says the Home Screen widget "shows a fresh verse every day". In the app the widget shows the verse you picked; random verses come only with the optional "Auto-rotate verses" setting, which is off by default. The merge gate fails that line, so the branch can't merge until the label changes, for example to "a Home Screen widget that shows your verse (it can rotate fresh verses if you turn that on)".
- **"Home Screen" is right.** The app's verse widget comes in small and medium Home Screen sizes, and on iOS 16 and later also in two Lock Screen sizes (`FaithWallWidget.swift` in the app).

### Still open

- Before the branch merges: rebase onto main, fix that label, and re-run every gate (only the fact lint ran here). Karol still decides the pricing lines and the timing (after 12-02).

## Update, 2026-11-17, after midnight: how the wallpaper really updates, engine 1.2.0, NoteWall rounds 6 and 7

### What was asked

No new request from Karol: this update finishes the late-night work. NoteWall's session sent its round 6 on 11-16 with two asks: cover `ixid=` image links in engine 1.2.0, and "If FaithWall's app has a similar trigger, its facts line may need the same caveat". Its round 7 followed after midnight. This update answers both asks, checks both rounds, and fixes what the check found on this site.

### What was found

- **When FaithWall's wallpaper really changes** (iOS source, read-only):
  - The app runs the Apple Shortcut itself when the user picks or edits a verse (`ContentView.swift` ~814-821). The wallpaper keeps that verse until the user picks another.
  - Style changes (text, colour, background) need Settings > Update Wallpaper Now.
  - Nothing runs in the background or on a schedule, and the app can't change the wallpaper while it's closed. A Shortcuts automation only re-applies the last image, so it can't change the verse. Deleting the verse blanks the wallpaper.
  - In normal use there is no "Set Lock Screen" button (only in troubleshooting). Verse rows have no done control: `toggleCompletion` exists, but nothing calls it.
  - The wallpaper setup and the widget setup are alternatives, not one setup. Settings > Change Setup Mode switches between them and clears the saved verse. Auto-rotate verses exists only in the widget setup.
- **What the site said instead:** the verse changes "automatically" or "every day", "today's verse", "nothing to tap", "tap Set Lock Screen", and a wallpaper plus a rotating widget run together as one setup. That was about a hundred sentences in some forty files, held pages included.
- **NoteWall differs.** There, marking a note done or deleting one re-applies the wallpaper. My round-5 brief wrongly told NoteWall that only the button does, and they reverted that in round 6. The lesson: before stating when an app updates the lock screen, grep every caller of its update function, drop dead code, and never carry one app's trigger over to another.
- **Engine.** The key-shaped-string rule (B6) flagged image links with `ixid=` and long slug paths on all three sites, which were false positives. It also missed some real key formats.
- **NoteWall round 6 (dd32811)** was verified and answered.
- **NoteWall round 7 (aac0dac, merged in a1abb53).** Its gates and its notifications fact hold. The check found four problems:
  - reversed swipe directions on its FAQ and two posts;
  - one live page saying wallpaper changes can run on a schedule;
  - a homepage card promising reminders and habits the app doesn't have;
  - several lint gaps.
  They were sent back with fixes.
- **Where the facts live.** The cloud routine's prompt carries no product facts: it reads the blog skill, so fixing the skill fixes the routine. The two local autopilot prompts carry their own facts line.

### What was decided and why

- **What gets fixed now:** every sentence that is false with every setting on (an automatic or daily wallpaper change, "today's verse", "nothing to tap", "Set Lock Screen", a combined setup).
  - This includes held pages, as one-sentence fact fixes with dateModified unchanged.
  - Sentences that only lack the widget opt-in stay with p78 after 12-02, because those pages are the control group. p78's notes now list the lines the lint can't see, held ones included.
- **The lint now refuses the false forms** (`wallpaper-automatic` and `wallpaper-widget-combo` are hard failures), so new copy can't bring them back. The rules allow negated sentences and widget sentences that name the opt-in.
- **Engine 1.2.0.**
  - B6 skips only URL query values under an allow-list of plain parameter names, and slugs only when they are path-shaped.
  - It adds prefix rules for live keys (Stripe, GitHub, AWS, Google OAuth, npm, Slack, JWT).
  - Docs and journals give a 12-character sha256 prefix, never the full hash, because B6 flags 32+ hex characters.
- **Karol decides** the angle of five posts written around a daily-change premise (TODO-KAROL).

### What was built

Pushed to main in one push, on top of f57a34f:

- **Engine 1.2.0:** bb64fd0 (B6 skips URL parts, prefix rules for live keys), 4810908 (review fixes: allow-listed parameters, path-shaped slugs, nested parameters), a5f886d (AWS, Google OAuth, npm and Slack prefixes; no JWT literal in the source), 9702a2e (Slack tokens need a digit, ASIA note). The script's sha256 starts with `77ac7c15b5d1`.
- **Update-flow facts:** 55f43ad (the false sentences, lint rules, p78 list), 76bd968 (review fixes), af69e91 (CTA title, two lines, negation and timing patterns), df27e24 (round 8: the invented "contemplative style", brandless and subject-first lint rules), 5b1bd82 (the lint matches "on autopilot" only, so the routines' own names stop failing it).
- **Docs:** this update, the hub, TODO-KAROL and `docs/keyword-research/notewall-port-1.2.0.md`, the port brief for NoteWall.
- **Outside the repo:** the blog skill's facts went in with the site commits; both local autopilot prompts (line 42) and the private QuranWall brief were updated before the push.

### How it was verified

On the final tree, before the push:

- `npm run build`: exit 0, prerender 57 of 57 routes.
- `npm run lint:facts`: 0 FAIL, 0 WARN. `--all`: 0 FAIL, 29 WARN, all `widget-rotation-default`, which is p78's list after 12-02. `--dist`: 0 FAIL. `--self-test`: 204 checks, 0 failed.
- `--prompts` over the nine routine prompts and the blog skill: 0 update-flow FAILs. The 3 `price-or-trial` FAILs are the sale-price line in the us-rank-recovery-check routines, which is about the app sale, not product copy.
- `npm run typecheck`: 7 errors, the main baseline.
- No NUL bytes in dist text files. Keyword engine self-test 108/108.
- Two skeptic rounds checked the copy; their blocking findings were fixed in 76bd968, af69e91 and df27e24, and a recheck passed.
- The live site was checked after the deploy (below).

### Still open

- **p78 (from 12-02):** the widget sentences without the opt-in, and the lines listed in its notes.
- **Karol:** the five posts' angle, two app-side issues for the developer, the legal pages' widget line and the pillar's FAQ heading.
- **The parked homepage branch** must also pass the new hard rules before it merges (`Hero.tsx` and `Features.tsx`).
- **NoteWall:** the round-7 fixes and the 1.2.0 port, in one push. The round-7 results were sent to NoteWall's session before the cut. The port brief is `docs/keyword-research/notewall-port-1.2.0.md`; a new NoteWall session starts from it, because the old one ran on the other Claude account.
- **QuranWall:** its brief now carries the update-flow lesson and engine 1.2.0. It still waits for Karol's yes to a new session. It still names the old FaithWall session (on the other account) as the one to report back to; fix that line when the session starts.

### After the deploy (2026-11-17, morning)

- **The cut.** The session that did this work hit the weekly usage limit at 00:00:47, after its last checks and before the push. A new session on Karol's other Claude account resumed it from the transcript and the scratch clone. origin/main had not moved (f57a34f), so nothing was rebased. The resumed session filled in the commit and check lines above, re-ran every check on the final tree (same numbers) and pushed f57a34f..8bc870d as SlohGPT.
- **Port brief.** The NoteWall 1.2.0 brief went into the repo (`docs/keyword-research/notewall-port-1.2.0.md`) instead of a message, because NoteWall's earlier session ran on the other account. It gives NoteWall paths relative to its own checkout: `check --staged` fails B5 on absolute local paths and on the private archive path in a tracked doc.
- **Live.** The new CTA title on rotating-bible-verse-wallpaper-iphone was live about 40 s after the push. All 57 sitemap URLs return 200. A text sweep of every live page finds no "nothing to tap" and no "Set Lock Screen". The four remaining hits for "today's verse" or a daily change are true: a generic widget explainer, other apps' flaw, and the pillar FAQ whose answer names the widget opt-in (its heading is TODO-KAROL item 3).
- **Still open, added:** the private QuranWall brief names the old FaithWall session (other account) as its report-back target. Fix that line when Karol starts a QW session.
