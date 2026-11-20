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
