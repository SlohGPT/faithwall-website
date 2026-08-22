# FaithWall SEO Strategy — v2 (2026-08-22)

**Who reads this:** the autonomous daily content agent and Karol. This file sets direction; `src/data/seo-priorities.json` sets the day-to-day work order. This repo is public — describe search performance qualitatively and never paste raw Search Console clicks, impressions, or CTR numbers into this file, commit messages, or post content.

**What changed in v2 (2026-08-22):** the on-page/AEO program from v1 executed well and is near its ceiling — the money pages hold upper page 1 and further on-page work there has visibly diminishing returns. The binding constraint is now **site-level authority and brand recognition**, which v1 had no lever for. v2 adds an off-site/brand layer the agent can execute (research, drafting, monitoring — never sending), shifts content work from proliferation to depth and consolidation, and adds an explicit scaled-content risk posture. Grounded in an August 2026 sweep of practitioner positions (Ray, Solis, Shepard, Gübür, King, Indig, Fishkin, Hudgens, Allsopp, Diggity) and primary-source landscape research; the load-bearing findings are cited inline where they change a rule.

---

## 1. Positioning & Moat

FaithWall is the only iOS app purpose-built to put a daily Bible verse on the iPhone lock screen, and the site's search moat is exactly that intersection. faithwall.app holds the leading editorial position across the "bible verse lock screen app" query family, including first-place rankings on many long-tail permutations.

Why we win, structurally:

- **Perfect query-product fit.** For any permutation of {bible verse, scripture} × {lock screen, wallpaper, widget} × {iphone, app}, FaithWall is the literal answer, not an adjacent one.
- **Only differentiated editorial in the SERP.** These results pages are App Store listings plus content-farm listicles. A real indie developer writing honest, tested, screenshot-backed pages wins on trust.
- **Freshness advantage.** Incumbent editorial on the big "best Bible app" queries predates iOS 16 lock screens entirely. Freshness also drives AI citations directly: roughly four-fifths of lists cited by ChatGPT were updated within the past year, a quarter within two months (Allsopp/Ahrefs, Dec 2025).
- **AI answer engines already cite us.** Quotable, self-contained claims near the top of every page are an asset class. But two 2026 findings bound this play: AI systems decouple *citation* from *recommendation* — self-promotional roundups get cited while the authoring brand is excluded from the actual recommendation most of the time (Ray, Jun 2026) — and even large brands report AI citations producing under 1–2% of traffic (detailed.com tracker). So the AI surface is a **brand-visibility channel, not a near-term traffic channel**, and the recommendation itself is won by third-party validation, not by our own pages. That is what §8 exists for.

Structural ceilings to respect:

1. App Store product listings permanently occupy several top slots on the money SERPs. Target everywhere: **top editorial result** (effectively top-3 visible).
2. The overwhelming majority of our impressions carry no identifiable query (AI surfaces + anonymized long-tail). Pages are judged per §5 on the demand type they actually face: legible transactional pages on clicks, anonymized surfaces on quotability and topical support.
3. **The position-5-to-3 gap is an authority gap, not a content gap.** The March 2026 core update rewarded specialist sites with demonstrated authority and punished aggregator/comparison patterns; a domain-level authority score consistent with the leaked `siteAuthority` field plausibly caps how far strong pages rise on a weak domain. More on-page polish does not cross this gap. Mentions, citations, reviews, and branded demand do.

Strategy in one sentence: **hold the lock-screen moat, win the "best Bible app" hub with depth plus authority, and build the brand/off-site layer that v1 was missing — because brand is now the input that everything else (rankings, AI recommendations, clicks) keys off.**

## 2. Content Pillars, Ranked by Strategic Value

1. **daily-scripture-lock-screen — the moat.** Own every permutation of lock-screen Scripture intent. Status: winning; defend with freshness and depth, not new URLs.
2. **christian-app-comparisons — the money layer.** /best-bible-verse-lock-screen-apps (site's strongest page), root FaithWall-vs-X pages, roundups. Status: holding upper page 1 with the site's best conversion; further click-chasing here is done — remaining upside is depth-for-citation and third-party validation.
3. **bible-study-tools-ios — the growth frontier.** The "best/free Bible app for iPhone" hub is the largest named-query demand pool we touch and the fastest riser for three consecutive cycles; still page 2. This is the #1 content priority — and the #1 beneficiary of any authority gain.
4. **prayer-life-iphone — adjacent flagship.** Head page in upper page 1. Consolidation, not expansion.
5. **faith-based-productivity — harvest only.** Three consecutive refreshes with no demand. No new posts; candidate for §5 prune-merge review.

## 3. The Strategic Plays

### Play 1 — Win the "best Bible app" hub (page 2 → page 1)

Unchanged goal, upgraded method. The hub (/blog/best-free-bible-app-iphone) keeps climbing on every query in the family but sits on page 2, where clicks are ~zero.

- **Depth to citation-magnet standard.** Long, genuinely comprehensive pages earn several times more AI citations than short ones, and passage-level completeness — each section answering one sub-query fully, entities named plainly — is what retrieval systems select for (King; SEL Apr 2026). The hub gets a `depth-pass` (queue) toward the definitive resource on its family: real download sizes, tested offline behavior, what "free" excludes, audio section (p21), translation coverage. Cap: depth means answering more real sub-queries, never padding.
- **Effort signals.** First-party facts and original media on the page — measured sizes, dated hands-on notes, real screenshots when Karol supplies them. "Content effort" — visible evidence of useful work — is both a ranking signal and the scaled-content defense (Shepard, Aug 2026; §9).
- **Authority feeds this play first.** Every §8 mention or link targets the hub and the money page before anything else.
- Standing sub-rules from v1 remain: one URL owns the whole family; the study page stays study-scoped; audio intent stays on the hub.

### Play 2 — Hold the moat; convert it to citation depth

/best-bible-verse-lock-screen-apps and the moat family sit at or near top of page 1 with several #1 variants. Click-chasing here is closed. Remaining work: monthly materially-true dated refresh (freshness is the strongest cheap AI-citation lever we have), a `depth-pass` toward comprehensive coverage of the lock-screen-app question, and copycat disambiguation maintenance. The vs-pages are judged as comparison-citation surfaces, not click engines.

### Play 3 — CTR: concluded, with one standing finding

The homepage title/meta and rich-results work shipped and the brand-query finding stands: the two-word "faith wall" query is structurally unconvertible from the web result (decor-ambiguous SERP); the one-word "faithwall" spelling ranks #1 and converts strongly. **No further homepage markup/title passes.** The fix for two-word brand loss is off-site disambiguation and growing one-word branded demand — i.e., Play 4. The anonymized test from v1 remains binding: no `ctr-fix` on pages whose demand carries no identifiable queries.

### Play 4 — Build the brand & authority layer (NEW — the missing input)

Every practitioner school surveyed lands on the same conclusion from different directions: branded search demand, third-party mentions, reviews, and citations are the composite that moves both classic rankings and AI recommendations (Indig's Brand Authority; Ray's brand/navigational winners; Koray's "SEO insurance"; Fishkin's 2x branded click rates; Diggity's brand-volume tactics; Hudgens' "mentions and co-citation"). Branded demand growth *precedes* AI-answer visibility by weeks to months — it is a leading indicator, and our KPI.

Execution is §8. The agent researches, drafts, and monitors; Karol sends and signs up. Directories as a category are dead (March 2026 core update losers) — the two exceptions are niche faith-tech directories with editorial selection, treated as citation surfaces, and they are already in the §8 target list.

## 4. Internal Linking Doctrine

**Money pages, in order:** 1. /best-bible-verse-lock-screen-apps · 2. /faithwall-vs-youversion and /faithwall-vs-hallow · 3. /blog/best-free-bible-app-iphone · 4. /blog/best-prayer-app-for-iphone · 5. /blog/best-christian-wallpaper-app-iphone

**Rules (all idempotent — "ensure exactly one", add only if absent):**
1. Every post keeps the SKILL.md baseline: 2–3 same-cluster sibling links + exactly 1 pillar link, in-body.
2. Every post in daily-scripture-lock-screen and christian-app-comparisons carries exactly one in-body link to /best-bible-verse-lock-screen-apps (never inside the CTA block). Anchor diversity mandatory: rotate at least four distinct anchors; no single anchor >40% of a page's incoming internal links.
3. Every bible-study-tools-ios post links /blog/best-free-bible-app-iphone once; every prayer-life-iphone post links /blog/best-prayer-app-for-iphone once.
4. Cap: at most 5 in-body links per post. At cap, replace the weakest generic link; never remove the pillar link or reduce siblings below 2.
5. Money pages are never dead ends: Compare template renders the Keep-reading block; footer lists all five pillars.
6. One canonical URL per query. Never link deprecated /blog/faithwall-vs-hallow.
7. How-to spokes place their pillar and money-page links in the first half of the body.

## 5. Content Standards

- **Depth doctrine (v2): consolidate before creating.** "Query Deserves a Page" (Gübür, Jul 2026): merging overlapping pages lifts rankings where adding pages does not; topical authority is hyperfocus, not page count (Indig). Before any new URL, ask whether an existing page should own the intent. A standing `prune-merge` queue type audits the post set for overlap clusters and consolidates them (301s via the p5 pattern).
- **Cadence (v2): the daily run produces work, not necessarily a URL.** New posts ship at most 2 per week and only when the queue holds nothing ranked higher. Most daily slots go to depth-passes, refreshes, §8 off-site work, and consolidation. A daily stream of listicle/comparison URLs is the enforcement-profile pattern (§9) — velocity of *improvement* is safe; velocity of *new thin pages* is not.
- **Formats that win, in order:** root-level Compare-template roundups; pillar landing pages; the "N verses for X" listicle hybrid (depth, not a traffic engine); how-to spokes. New roundups ship at root level on the Compare template.
- **Decision-page furniture** on every transactional page: dated ranked-list title, bolded Quick Answer naming FaithWall in sentence one, comparison table, visible FAQ block, visible updated date.
- **Bias disclosure:** every roundup where FaithWall appears carries one visible line near the Quick Answer: FaithWall is our app — the ranking reflects that, here is our honest case. Note the 2026 limit of this play: our own roundups can be *cited* by AI engines yet excluded from the *recommendation*; disclosure wins trust with humans and Google, but the AI recommendation is won by third parties saying it (§8). Both are needed; neither substitutes for the other.
- **Effort signals (v2, mandatory):** every new or refreshed page carries at least two things a scraper cannot fake — a measured first-party fact (download size, tested offline behavior, version-specific setting path, real app data), a dated hands-on observation, an original screenshot (when available), or a named-author judgment call with reasoning. The test: "would this be expensive for someone else to fake?" (Indig). Author identity: the full Person schema and AuthorBio stay on everything; the byline is a real person with a track record, never a house name.
- **Length:** standard posts 800–1,100 words. Comparison-intent spokes to ~1,400 when coverage requires. Money pages and the hub are exempt upward — their `depth-pass` target is genuine comprehensiveness (2,500+ words with tables, FAQ, per-app detail), because depth correlates directly with AI citation rates. Never pad: depth = more sub-questions fully answered.
- **Freshness:** money pages get a materially-true visible update monthly; other roundups quarterly; dated titles roll forward each January. Freshness is now also the cheapest AI-citation lever (Allsopp: cited lists skew heavily recently-updated).
- **AEO (passage-level, per King):** one quotable self-contained positioning sentence in the first two paragraphs; open each H2 with a direct answer in the first 40–60 words; keep key passages self-contained at ~130–170 words; name entities (apps, features, iOS versions) explicitly — retrieval is passage-level and rank-independent, so every section is its own citation candidate. Question-phrased H2/H3s where natural.
- **Comparisons:** FaithWall ranks first wherever it competes (house rule, with disclosure). Third-party head-to-heads answer honestly and position FaithWall as the free lock-screen layer to add to either.
- **Honesty:** only apps verified to exist; real prices, sizes, tested behavior; never fabricate. One real cited statistic with a named source per post.
- **Anti-template variety (mandatory):** never reuse a cited statistic from the last 10 posts; vary Quick Answer structure, H2 phrasing patterns, FaithWall's body-mention placement, and section-type mix between consecutive posts.
- **Schema:** posts emit Article (full Person author block) + Breadcrumb; listicles also ItemList; homepage SoftwareApplication/WebSite. FAQ rich results retired 2026-05-07 (confirmed) — existing FAQPage markup stays (harmless, plausibly still read by AI systems) but new FAQPage/HowTo markup buys nothing; visible FAQ content blocks remain mandatory. Schema is hygiene, not a citation lever — markup alone demonstrably does not buy AI citations for low-authority sites.

## 6. Execution Contracts & Queue Lifecycle

The daily agent works `src/data/seo-priorities.json` top-to-bottom. Contract:

1. **Pick** the first `"status": "pending"` item whose `not_before` (if present) is not in the future; skip-but-don't-close items still inside their `not_before` window. If none is eligible, fall back to a classic SKILL.md daily post ONLY if the §5 cadence cap (2 new posts this calendar week) is not hit; otherwise run a §8 monitoring pass and report.
2. **Execute by type:**
   - `new-post` — full SKILL.md flow + §5 effort signals. New keyword → add to seo-keywords.json in the same commit.
   - `refresh` — edit exactly the files named in notes. Bump visible updated date and dateModified. No slug changes.
   - `depth-pass` — expand the named page toward §5 citation-magnet standard: coverage of listed sub-queries, effort signals, passage-level AEO, updated tables/FAQ. Word-cap exempt. Bump dates; regenerate sitemap.
   - `ctr-fix` — title/meta/H1 per notes. Only on pages with legible query demand (§3 Play 3).
   - `internal-links` — idempotent link edits per §4.
   - `tool-page` — build the React route per the item's file list. Requires the item to name existing search demand evidence; the random-verse lesson is binding — no tool ships on premise alone.
   - `prune-merge` — audit-first: identify overlap clusters, propose the merge plan in the item close-out notes, execute only consolidations the notes pre-authorize (301 via the p5 pattern, links re-pointed, sitemap regenerated). Anything judgment-heavy → TODO-KAROL.md.
   - `outreach-prep` (NEW) — research and draft outreach per §8: verify the target is live, draft the pitch into `outreach/` (repo), append a one-line pointer to TODO-KAROL.md. **The agent never sends anything, never creates accounts, never posts to communities.** Drafts are honest, specific, and disclose that FaithWall is our app.
   - `citation-audit` (NEW) — web-research pass: for the core query set in the item, find which third-party pages currently rank/get cited, where FaithWall is absent, and what changed since last audit. Output: update `outreach/targets.json` + summary in close-out notes. Feeds future `outreach-prep` items. Qualitative only — this file is public.
   - `data-study` (NEW) — assemble a citable original asset from what we uniquely own (e.g., anonymized aggregate verse-popularity or usage patterns Karol exports; never private user data, never GSC numbers). Ships as a page section or standalone post with a "cite this" line. Requires Karol-supplied data in the item notes; otherwise the item stays blocked.
3. **Verify:** JSON parses; `npm run typecheck` adds no new errors vs main; `npm run build` succeeds; internal links resolve; no placeholder text; no 2024/2025 dates. Sitemap: regenerate whenever a URL is added or content changed; static-route lastmod dates are hardcoded in `scripts/generate-sitemap.mjs` — bump them there when editing static pages.
4. **Close out in the same commit:** `"status": "done"`, `"completed": "YYYY-MM-DD"`, one-line deviation note if any.
5. **Push and ping:** commit `seo: {item id} — {short description}` (or `blog: {title}`), push; IndexNow submission happens after the merge gate confirms deploy (three-tier pipeline).
6. **Images on cloud runs:** `$UNSPLASH_ACCESS_KEY` if set; else reuse an on-theme thumbnail + its attribution, noted in the commit body. Original screenshots from Karol always beat stock (§5 effort signals) — flag wants to TODO-KAROL.md.
7. **Flag channel:** anything needing a human (photography, ASO, sending outreach, account creation, ambiguous consolidation) → TODO-KAROL.md. Never silently skipped, never guessed.
8. **Weekly refresh (local task, has Search Console access):** pull fresh data; verify done-item effects; re-rank pending; **track the branded-demand KPI** (one-word "faithwall" query trend + branded/navigational share — qualitatively in this repo, numerically only in the local report); track referral pickups from §8 placements; append new data-backed items; update this file only when strategy-level facts change.

## 7. What NOT To Do

- **Never create a second page targeting a query an existing page targets or ranks top-10 for.** Check blogPosts.json AND root pages before every post. Weekly-refresh SERP-overlap spot-check for new keywords: 7+ shared top-10 URLs → extend the existing page; 4–6 → separate post is fine.
- **Blocked keywords** carry `"blocked": true` in seo-keywords.json and are never picked.
- **Cannibalization watch:** /blog/best-bible-study-app-iphone-2026 owns *study* intent only; generic year-variants belong to the hub. /blog/faithwall-vs-bible-app stays angled to the literal phrase "The Bible App".
- **No new faith-based-productivity posts** until demand appears.
- **No new URL for App-Store-phrase navigational queries.**
- **Any "best verse app / verse of the day app" roundup idea extends /best-bible-verse-lock-screen-apps** — never a new URL.
- **Do not retitle how-to spokes into listicles**; their zero-click pattern is intent-structural.
- **Do not paste raw Search Console metrics anywhere in this public repo.**
- **(v2) No general-directory submissions** — the category was a March 2026 core-update loser; only the §8 vetted niche list.
- **(v2) No new tool pages without named demand evidence** in the queue item (the /random-bible-verse lesson).
- **(v2) The agent never sends outreach, never creates accounts, never posts on communities, never submits forms requiring identity** — drafts and research only; the send belongs to Karol.
- **(v2) No llms.txt investment beyond what exists** — crawler-behavior studies show the file is ignored by major AI crawlers; robots.txt access for AI bots (already open, OAI-SearchBot included) is the lever that matters. Keep robots.txt welcoming; verify after any infra change.
- **(v2) No homepage markup/title passes for the two-word brand query** — structurally unconvertible; off-site is the only lever (§3 Play 3).

## 8. Off-Site & Brand Layer (NEW)

**Division of labor is absolute: the agent researches, drafts, and monitors. Karol sends, signs up, posts, and photographs.** Every draft lands in `outreach/` with a TODO-KAROL.md pointer.

**Why this order:** mentions on pages that AI engines and Google already trust for our queries are worth more than generic links (Hudgens: audit what gets cited, then target exactly those sources). The `citation-audit` type keeps the target list current; `outreach-prep` converts targets into ready-to-send drafts.

**Tier 1 — exact-niche editorial (highest value, drafted first):**
- Bibleversedaily.org — the one independent, active blog in our exact niche (links nofollow → value is citation + referral). Angle: free, no-subscription, solo-dev honesty.
- Warmpeach.com best-bible-apps roundup — rigorous install-and-test methodology; angle: offer to be tested on their terms; lock-screen habit category is uncovered.
- LearnOfChrist.com — publishes standalone app reviews; angle: a "FaithWall Review 2026" fits their format exactly.
- HealthySpirituality.org (prayer-apps piece) — angle: FaithWall as the passive/ambient counterpart to active prayer apps.
- BibleGeeks.fm — blog mention + podcast-guest optionality; angle: indie-founder story.

**Tier 2 — directories that survived (citation surfaces, nofollow is fine):** faith.tools (editorial selection, real submission flow), AlternativeTo (list under Hallow/Glorify/YouVersion alternatives — needs Karol's account), SaaSHub, MochiLaunch. Product Hunt / Indie Hackers are launch-moment plays for Karol when he wants the referral spike — not agent work.

**Tier 3 — seasonal pitch windows (items carry `not_before`):** Advent 2026 (first Sunday Nov 29; pitch window early-to-mid Nov), New Year 2027 resolution roundups (late Dec), Lent 2027 (Ash Wednesday Feb 10; pitch mid-to-late Jan). Roundup sites refresh their lists in these windows — that is when an add-one-app pitch converts best.

**Tier 4 — community (Karol-only, low priority):** Reddit currently ranks for nothing in our query space and its AI-citation share is in free fall (Aug 2026) — not a strategy pillar. If Karol participates it is as a genuine community member under his own name, after reading each subreddit's self-promo rules live.

**Standing brand plays:** grow one-word "faithwall" branded demand (the KPI): every placement above, App Store review velocity (in-app prompt timing is an app-side task — flagged to Karol), and YouTube/short-form presence if Karol ever wants it (Diggity's cheapest brand-volume channel; not agent work).

**Owned audience:** rented attention should land somewhere we keep (Fishkin, Indig, Schwartz all converge here). The site currently captures nothing. Decision flagged to Karol: an email capture ("verse pack of the month"?) or in-app community channel. Not something the agent bolts on unilaterally.

## 9. Scaled-Content Risk Posture (NEW)

We run an autonomous daily agent in the exact period Google is enforcing against scaled content. The policy test is *pattern and purpose*, not authorship — human review alone is no safe harbor, and first-party authorship does not exempt a site. Ray's 220-domain study: the penalized profile is rapid-scale template content — at-scale comparison pages, "best X" listicles, self-promotional roundups, per-competitor alternative pages — several of which describe our formats. Our defenses, all mandatory:

1. **Volume discipline:** §5 cadence — at most 2 new URLs/week; most agent-days improve existing pages or do §8 work. The queue enforces this by construction (new-post items rank last by default).
2. **Effort signals on every page** (§5): first-party facts, dated hands-on observations, original media, named-author judgment. The "expensive to fake" test.
3. **Real author identity everywhere:** Karol's Person schema, AuthorBio, and About page stay load-bearing; nothing publishes under a house name.
4. **Consolidation over proliferation:** prune-merge keeps the page set tight; fewer, deeper pages are simultaneously the topical-authority play and the enforcement-profile antidote.
5. **Honesty rules (§5) are also risk rules:** verified-real apps, real data, disclosure. The site must keep looking like what it is — one person's honest, tested editorial — because that is the winning profile of every 2026 update.
6. **Monitoring:** the weekly refresh watches for step-change visibility drops coinciding with confirmed Google updates and flags them to Karol immediately rather than continuing to publish into a penalty.
