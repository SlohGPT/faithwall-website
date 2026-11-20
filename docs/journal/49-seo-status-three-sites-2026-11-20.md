# 49 — SEO status across the three sites, 2026-11-20

Karol asked: "how is the SEO going? If we're publishing blogs, if the traffic is increasing, the AI GEO progress", then "for all three of my apps websites". Read-only check; nothing on any site changed. Qualitative only (public repo); the numbers went to Karol in chat.

## Found (Search Console, 16 weekly buckets to 2026-11-17)

- **FaithWall:** growing. The last 28 days beat the 28 before on clicks and more than doubled impressions; the week to 11-17 is the best week on record. Average position holds around 7. Most clicks still come from `/random-bible-verse`, whose click-through is low for its rank, then the free Bible app post and `/daily-scripture-lock-screen`. Blog posts bring under a third of clicks.
- **NoteWall:** flat to slightly down since its late-September peak, impressions slowly up. Almost all clicks come from blog posts. The sticky-notes post has the most impressions but a weak click-through; the iPhone automation post brings the most clicks.
- **QuranWall:** the service account now sees `sc-domain:quranwall.com` (journal 01 of that repo had 403 on 11-16), but the property only has data from 11-15, and almost none. The sitemap reads 16 submitted, 0 indexed. Treat QuranWall as having no measurable Google traffic yet. Its weekly refresh can now read Search Console.

## Publishing

- FaithWall: two new posts this month (p67 on 11-17, p68 on 11-18), then paused by design: the new-URL hold and the core-update hold. Next eligible item p66 on 11-25; most items from 12-02.
- NoteWall: no new posts this month; every pending item is held to 12-01 or later.
- QuranWall: still the original 8 posts from June–July; its autopilot (since 11-16) works template and answer-first items, not new posts.

## GEO

All three sites let every AI search and user bot through (Cloudflare fix 11-17, geo-probe exit 0 on 11-18), `llms.txt` lists every page, schema parses. ChatGPT stays the biggest single App Store referrer for all three apps. Nothing measures AI citations directly yet; the ct tokens in App Store Connect are the only conversion read.

## Open

- 11-23 refresh: the deciding INDEX STATE line for the four October posts.
- QuranWall indexing: 0 indexed in the sitemap report is worth a URL Inspection pass in that repo's session.
- 12-02: cohort read-out and the end of the holds.

## Update, same session: indexing push on all three sites

Karol: "whatever you need to do on all of the free websites, then do it. If you need to do Bing Webmaster Tools or GSC". Then: "Are we publishing blogs though?"

**Correction.** URL Inspection on every sitemap URL (API, read-only) shows the Search Console sitemap column was wrong: QuranWall has most of its pages indexed, not none. FaithWall has all but three pages indexed. Those three are three of the four October posts: one is "discovered, not indexed", two are unknown to Google. That makes it still one of four indexed, so the §6 hold stays; the 11-23 refresh writes the INDEX STATE line as planned. NoteWall has a large share not indexed. Most of those were crawled and then left out ("Crawled - currently not indexed", many of them the June–July ADHD and productivity posts), which is a page-quality signal that a request cannot fix. The rest are unknown or only discovered.

**Done.**
- IndexNow (Bing, Yandex, Seznam, Naver): every not-indexed URL on all three sites, through each repo's own `submit-indexnow.mjs`, all accepted with 200. No repo files changed.
- Search Console, Request Indexing in Karol's Chrome: FaithWall's three October posts; QuranWall `/blog`, the dhikr post and the about page; NoteWall's four top product pages (best lock-screen notes apps, wallpaper maker with notes, add text to wallpaper, reminders without notifications). Two more NoteWall requests may have gone through before Google's daily quota message; the rest wait for another day.
- Sitemap resubmission through the API is not possible: the service account is a restricted user (403). Google and Bing read all three sitemaps within the last ten days anyway.

**Bing Webmaster Tools.** All three sites are verified and their sitemaps read without errors. Bing's search traffic is small next to Google's. Its new AI Performance report counts citations in Microsoft Copilot answers: FaithWall and NoteWall are cited and both rose each month over the last three, and NoteWall is cited more. QuranWall has no data yet (added 11-18). This is the first direct AI-citation measure for the sites; the weekly refresh can read it. Bing flags FaithWall for "limited crawl capacity" (its generic advice to raise the crawl rate). It was left at default because a 59-URL site whose sitemap was read two days ago is not crawl-limited. Old `sitemap.xml/` and `www.notewall.info` sitemap entries in Bing are stale but harmless.

**Blogs.** No new posts are being published right now, by design: FaithWall's next queue item is 11-25 and most items open 12-02 (new-URL hold plus core-update hold); NoteWall's queue is held to 12-01; QuranWall's autopilot does page work, not posts.

**Open.**
- NoteWall's crawled-not-indexed posts need consolidation or rewrites in a NoteWall session, after its 12-01 hold.
- Re-request the remaining NoteWall pages (unknown and discovered ones) on a later day; quota is about ten a day.
- Add a Bing AI Performance read to the weekly refreshes.

## Update 2: is it all on autopilot?

Karol asked whether he needs to do anything or whether it now runs by itself every day. Checked: all nine app-site scheduled tasks (three autopilots, three merge gates, three Monday refreshes) are enabled and ran on schedule today. The QuranWall refresh has never run because it had no Search Console access; it has access now, so 11-23 is its first real run. The tasks run on this Mac, so they need it awake with the Claude app open. New posts come only when a keyword passes the §5 demand test (strategy v3), not daily. Both requests for indexing p67 and p68 are already done: both URLs are indexed. Told Karol the short list of owner items still open in the three TODO-KAROL files: the Apple agreement, QuranWall's seven app questions and its CLAUDE.md line, FaithWall's five daily-change posts, and the monthly Google generative-AI export.

## Update 3: more posts, and a QuranWall app knowledge base

Karol: "I think we should publish more blogs, but it's up to you", and asked for a QuranWall knowledge base read from the local iOS app source, "so you will have better context".

**FaithWall posts (6f727e7).** Four new-post items queued after the §5 demand test (autocomplete on 11-20; Search Console where it had rows), each with an information-gain line and two day-one links from ranking posts: p80 Psalm 91 wallpaper (11-23), p81 Bible verses for sleep (11-26), p82 Jeremiah 29:11 wallpaper (12-03), p83 Isaiah 41:10 wallpaper (12-07). Dates keep the §5 cap of 2 a week: the week of 11-16 already had p67 and p68, so p80 moved from the proposed 11-21 to 11-23; p69 (12-01) shares its week with p82. Rejected: a separate Advent post (p67 already owns it; a Sunday-by-Sunday refresh of p67 is the better move), women's lock screen, Thanksgiving, exams, verse of the year, John 3:16 (third single-verse post; wait for p80 and p82 to index). Lent is deferred to about 01-09. lint-facts 0 FAIL, kw:check clean, JSON parses.

**Cadence by site.** FaithWall: up to 2 demand-tested posts a week from 11-23. NoteWall: no new posts until its crawled-not-indexed posts are consolidated after 12-01. QuranWall: new posts only on facts settled by the app knowledge base below.

**QuranWall knowledge base.** A workflow (six area readers, synthesis, an independent verify pass, a website audit) read the app source at `4e45bc1` (v1.2 build 28) and wrote `quranwall-website/docs/app-knowledge/` (11 files). The verify pass corrected one claim (the 3-save free limit is live for lapsed subscribers, not dormant). Product IDs that carry prices and promo-code details were left out of the public copy. Main findings: no free tier for new installs (hard paywall); one edition per ayah (Arabic or a translation); wallpaper changes only on in-app actions, the widget rotates only when turned on; read-along recitation exists (so QuranWall's CLAUDE.md "no audio recitation" was wrong); no Focus-mode install, packs, duas or dhikr widget; installs on iOS 15, wallpaper and Lock Screen widgets need iOS 16; Mixpanel and RevenueCat are present, so never "no tracking". The QuranWall site, rules and TODO are aligned in that repo (its journal 07). The app repo keeps a leftover third-party key in Config.swift; flagged to Karol.
