# Keyword research run, 2026-11-23 (FaithWall)

The second weekly run of the keyword engine (1.2.0). Search Console covered the 90 days to 2026-11-20. The `gsc` step reuses a pull younger than seven days, so this run needed `--fresh` to get a new window; a weekly refresh should always pass it. Autocomplete covered the configured US seeds within the daily allowance, including the three that waited last week (bible verse for sleep, short bible verses, lock screen bible verse) and two seasonal seeds added this run (christmas bible verse wallpaper, new year bible verses). The curated result is `src/data/keyword-clusters.json` (29 clusters).

The window ends inside Google's November 2026 core update, which is still rolling, and it includes a FaithWall-only sitewide dip on 11-19 and 11-20 that came back on 11-21. Treat position changes from this run as provisional.

## What changed in the cluster map

| Cluster | Decision | Evidence type |
| --- | --- | --- |
| christmas-bible-verse-wallpaper (new) | monitor: p67's post is live and indexed | autocomplete (11-23), Search Console |
| new-year-bible-verses (new) | new post: p69, from 12-01 | autocomplete (11-23) |
| psalm-91-wallpaper (new) | new post: p80, from 11-23 | autocomplete |
| bible-verses-for-sleep (new, mood) | new post: p81, from 11-26 | autocomplete (11-23) |
| jeremiah-29-11-wallpaper (new) | new post: p82, from 12-03 | autocomplete |
| isaiah-41-10-wallpaper (new) | new post: p83, from 12-07 | autocomplete |
| christian-lock-screen-for-men | new post → monitor: p68's post is live and indexed | Search Console, URL Inspection |
| short-bible-verses-for-lock-screen | unchanged; the post is indexed now, the pillar still gets the phrase | URL Inspection, Search Console |
| christian-wallpaper-app | five "christian wallpaper for phone / iphone" phrasings merged in from the draft | Search Console |
| prayer-app-alternatives | one "best alternatives to prayerbuilt" question merged in from the draft | Search Console |
| best-bible-app-for-iphone (hub) | hold reason re-dated: p66 swaps the NLT row from 12-08, not 11-25 | queue |

The four 11-20 queue items (p80 to p83) now have their own clusters, so their demand evidence sits next to the queue.

## What was decided

- **No new queue item from this run.** The v3 supply already covers about two posts a week to 12-07 (p80, p81, p69, p82, p83), the core update is still rolling, and the first v3 posts are too young to read.
- **No CTR item.** The high-impression, low-click pages are the generator (p70, after 12-02), held pages, or the money page (stop rule).
- **Out of scope again:** 4K, PC and desktop wallpaper phrasings, Android, other languages' phrasings (Amharic, Telugu, Tamil, Hindi on the new-year seed) and medical phrasings (sleep paralysis on the sleep seed).
- **Seasonal seeds come out after 2027-01-15.** Both were added to `src/data/kw-config.json` for this season only.

## Engine notes

- `gsc` needs `--fresh` on a weekly cadence, because its reuse window is seven days.
- The schema check rejects any digit in a `gsc` evidence note (it guards against raw counts in a public repo). That also catches dates and verse numbers, so `gsc` notes say "the day it was published", not a date.
- The draft clusters keep proposing the 4K, desktop and Android phrasings from the image surface; they stay out by hand.
