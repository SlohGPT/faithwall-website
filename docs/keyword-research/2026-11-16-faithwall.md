# Keyword research run, 2026-11-16 (FaithWall)

The first run of the keyword engine. Search Console covered the 90 days to 2026-11-13. Autocomplete covered the configured US seeds within the daily allowance; three seeds wait for the next run: bible verse for sleep, short bible verses and lock screen bible verse. The curated result is `src/data/keyword-clusters.json`.

## What the data says

- **The random verse generator family is by far the largest.** The tool page shows for almost all of it but gets few of the clicks, which is what p70 (title and description) addresses after 2026-12-02. A steady sub-intent asks for a whole chapter, a book or a passage. That becomes a mode on the same tool page after p70, not a new URL.
- **Comparison queries come second:** the free Bible app hub, the Christian app comparisons page and the prayer roundup. The plain "free bible app" phrasings sit far down the results. "Free" is recorded as demand only.
- **Lock screen queries split cleanly by intent.** App-shaped ones ("app that puts bible verses on lock screen") land on the lock screen app roundup. How-to ones land on the pillar. The pillar, not the post, shows for "short bible verses for lock screen": the p63 case.
- **Mood queries barely reach the site,** while autocomplete shows wide demand for anxiety, strength and "when you feel" phrasings. Large Bible sites own the head terms. The lock screen angle is ours.
- **AI search seems to use some of our pages already.** Short follow-ups such as "are these free", "for iphone" and "yes please" reach the hub, the random verse tool and the homepage. They look typed inside AI Mode conversations. The prayer roundup also shows near the top for long "alternatives to [app]" questions of the same kind.
- **A few queries are shared by two of our pages.** Hallow vs Abide (the post and the FaithWall vs Hallow page) and Christian news apps (the comparison page and a blog roundup) look like the same intent on two kinds of page: questions for the overlap audit after the read-out (link the pair, or merge it if one page answers both). The wallpaper pairs match a blog post with the maker tool, which serve different intents, so they stay apart and link to each other.

## What was decided

- **No new URL and no page change from this run.** Held pages stay held until the 2026-12-02 read-out.
- **Candidates recorded in the cluster map,** each for after the read-out:
  - a chapter, book and passage mode on the random verse tool, after p70;
  - a depth pass on the anxiety post for the overthinking, panic and worry phrasings, KJV text only;
  - a verse-by-feeling picker as a possible free tool. It needs the same demand in a later run, the §5 product-fit line and Karol's copy review;
  - style presets (black, aesthetic) and a short how-to on the wallpaper maker;
  - a CTR fix on the prayer roundup for the daily prayer on iPhone phrasing.
- **p68 (Christian lock screen for men)** gets its autocomplete phrasings through its cluster.
- **App-shaped daily verse phrasings** go to the App Store keyword work.
- **Out of scope:** Android, Mac, laptop, Windows, Notion and Apple Watch phrasings, and other faiths' prayer apps.

## Engine notes

The draft's suggested decisions needed curation in three places, now fixed in the engine:
- brand queries and AI follow-ups are monitored, never turned into posts or CTR fixes;
- pages of different kinds that share a query (a post next to a tool page, a landing page or the homepage) are linked, not merged;
- the clusters are ordered by size before the draft keeps the largest.
