# Keyword research

The site's keyword system. The same script runs on FaithWall, QuranWall and NoteWall, and each site keeps its own seeds and cluster map. Started 2026-11-16 (engine 1.0.0).

## Why we built our own

No free tool gives real, market-wide search volume. The open-source "keyword researchers" either scrape Google, which breaks Google's terms, or resell Keyword Planner data. So the system rests on demand evidence we can trust, and it never states a volume:

- **Search Console:** the queries people already find us for. This is the best source, and it stays private.
- **Google autocomplete:** the phrasings people type. It proves a phrase is searched. It never gives a volume.
- **Forum questions read by hand:** a question that keeps coming back.
- **Bing Webmaster Tools (later, once Karol creates a key):** Bing impressions and related keywords, plus Bing's AI citation report. These are evidence, not a volume.

A volume appears only as a coarse band from Google's Keyword Planner API or DataForSEO, with its source and date. Neither is set up, and a paid source needs Karol's OK.

## The tool

`scripts/keyword-research.mjs` has no dependencies and runs locally only: in the weekly refresh or a manual session, never in the cloud run. The site's settings live in `src/data/kw-config.json`.

| Command | What it does |
|---|---|
| `npm run kw -- doctor` | Checks the config, credentials (present or not, never shown), today's autocomplete allowance and the cache. Add `--online` to confirm Search Console access. |
| `npm run kw -- gsc` | Pulls our Search Console queries into a private folder outside the repo, then groups them. Output: queries grouped by the page they land on; near-miss queries; queries where we barely show; queries where two of our pages compete; possible AI Mode follow-up phrasings; regex families; a draft cluster file safe to curate into the public map. |
| `npm run kw -- expand "<seed>"` | Asks Google autocomplete about a seed (or `--from-config` for the configured seeds) and marks which suggestions are new to us. The daily allowance per site is enforced here and only here. Each result keeps the date it was first fetched. `--plan` shows what would run, without any request. |
| `npm run kw:check` | Lints the public keyword files: no Search Console numbers, positions, percentages, money or secrets, and a strict schema for the cluster map. `--staged` checks what is about to be committed. `--self-test` runs the built-in tests. |
| `npm run kw -- geo-probe` | Reads the live robots.txt rules for each AI search bot and training bot, and sends one request per bot user agent. This is rules-only proof: a spoofed user agent is not the real bot. The real check is the Cloudflare dashboard. |
| `bing`, `volumes`, `serp` | Placeholders that do nothing until a credential exists. |

Rules the tool enforces:
- **Autocomplete is a small daily allowance per site,** spaced out, and it stops at the first error or block. Every lookup goes through `expand`, including any agent's ad hoc check.
- **Raw data stays in the private folder** named by `private_dir`: Search Console pulls, the autocomplete cache, the allowance counter and the full reports. The repo gets qualitative records only.
- **Minimum data:** with fewer than four weeks of Search Console data, draw no "no page ranks" or "no demand" conclusion.

## The cluster map

`src/data/keyword-clusters.json` holds one record per cluster. Each record has:
- the head keyword and its member phrasings;
- the intent and content type;
- the page that owns it;
- a decision;
- dated evidence by type: `gsc`, `autocomplete`, `forum`, `bing`, `bing-grounding`, `ads` or `dataforseo`.

It carries no numbers, scores or positions. New queue items name their `cluster_id`.

Clustering rules:
1. **Normalise:** lowercase, strip punctuation, singular and plural together.
2. **Label intent by rule:**
   - question words → question;
   - generator, maker, picker, wheel → tool;
   - app, widget, lock screen → app install;
   - vs, alternative, best → compare;
   - "for anxiety", "when I feel" → mood content.
   - Bible versions (KJV, NIV and others) are modifiers inside a cluster, not clusters of their own.
   The engine's label is a suggestion. The curator may change it, as the first map did for how-to and wallpaper phrasings.
3. **Group by the page that already gets the query.** When two of our pages share a query, the details stay in the private report; the map records only the decision.
4. **One page per cluster.** Another page for the same searches needs a different intent (read, use a tool, install).
5. **"Free" queries are recorded as demand, never copied into our copy.** "Free to download" is the only allowed phrase about FaithWall. NIV, ESV and NLT text is linked to, never embedded.
6. **Out of scope:** phrasings for other platforms (Android, Mac, laptop, Windows, Notion, Apple Watch) and for other faiths' prayer apps. They are left out of the map.

Decision for each cluster (first match wins; the agent decides, the tool only suggests):
1. **Brand queries, and short follow-ups typed inside AI conversations** ("are these free", "for iphone", "yes please", "how can i change it"): monitor. Never a new page. The engine catches the common shapes; any other short phrase that names no topic or product is a monitor too.
2. **Its page is in a hold:** hold, and nothing is proposed.
3. **Two of our pages of the same kind share it** (two posts, two tool pages, or two comparison or landing pages): prune-merge. Pages of different kinds (a post next to a tool page, a landing page or the homepage) serve different intents: link them, don't merge.
4. **A long question typed in AI Mode** (nine words or more): if our page already shows near the top, monitor it (those rarely click); otherwise an FAQ answer on that page, if the page lacks one.
5. **One page of ours owns it:** CTR fix, refresh or depth pass.
6. **App-install intent with no page of ours showing:** hand it to the App Store keyword work.
7. **A short question next to an existing page:** an FAQ answer on that page.
8. **Generator, maker or picker:** a tool page, only with demand seen in more than one run, a licence that allows it, and Karol's copy review.
9. **Vs, alternatives or best:** a compare roundup.
10. **A broad topic with several sub-clusters:** a pillar.
11. **Otherwise, a clear how-to with demand and a gap:** a blog post, after the SEO-STRATEGY §5 demand test.

When the private report flags a cluster's pages as shared (two of our pages each get a real part of it) and the suggestion is a new post or a new tool, link those two pages instead of adding a third.

## Run log

Dated, qualitative notes on each run: `YYYY-MM-DD-<site>.md` in this folder. The weekly refresh writes one per run.
