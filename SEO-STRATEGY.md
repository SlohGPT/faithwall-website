# FaithWall SEO Strategy

**Who reads this:** the autonomous daily content agent and Karol. This file sets direction; `src/data/seo-priorities.json` sets the day-to-day work order. This repo is public — describe search performance qualitatively and never paste raw Search Console clicks, impressions, or CTR numbers into this file, commit messages, or post content.

---

## 1. Positioning & Moat

FaithWall is the only iOS app purpose-built to put a daily Bible verse on the iPhone lock screen, and the site's search moat is exactly that intersection. faithwall.app holds the leading editorial position across the "bible verse lock screen app" query family, including first-place rankings on many long-tail permutations ("what app shows bible verses on lock screen", "bible verse on lock screen app", and word-order variants).

Why we win, structurally:

- **Perfect query-product fit.** For any permutation of {bible verse, scripture} × {lock screen, wallpaper, widget} × {iphone, app}, FaithWall is the literal answer, not an adjacent one. No large competitor can say that.
- **Only differentiated editorial in the SERP.** These results pages are App Store listings plus content-farm listicles — some ranking pages recommend apps that do not appear to exist. A real indie developer writing honest, tested, screenshot-backed pages wins on trust, and trust is the tiebreaker Google is visibly applying in this niche (forum/UGC results backfilling stale editorial).
- **Freshness advantage.** The incumbent editorial on the big "best Bible app" queries predates iOS 16 lock screens entirely; fresh dated listicles from small indie faith sites demonstrably crack adjacent SERPs.
- **AI answer engines already cite us.** Our positioning sentence gets echoed in AI-generated answers. Quotable, self-contained claims near the top of every page are an asset class, not decoration.

Two structural ceilings to respect:

1. App Store product listings permanently occupy several top slots on the money SERPs. The operational target everywhere is **top editorial result**, which effectively means a top-3 visible position.
2. A large share of our impressions comes from anonymized long-tail and AI surfaces that never produce a classic click. How-to spokes are judged on topical support and citations, not CTR (§5).

Strategy in one sentence: **defend the lock-screen moat to top-3, expand exactly one ring outward (Bible-app consideration, widgets, prayer apps), and convert impressions we already earn into clicks — in that order.**

## 2. Content Pillars, Ranked by Strategic Value

1. **daily-scripture-lock-screen — the moat.** Own every permutation of lock-screen Scripture intent, feed the money page, convert directly to installs. Status: winning; defend and deepen.
2. **christian-app-comparisons — the money layer.** Home of /best-bible-verse-lock-screen-apps (the strongest page on the site), the root FaithWall-vs-X pages, and app roundups. Status: fastest-growing surface. The money page has now overtaken the wallpaper-app post as the cluster's leading click earner, so the base is broadening as intended — keep pushing the roundup to top-3 and lift the second tier (the vs-pages and the 2026 roundup still rank on page 1 while converting almost nothing).
3. **bible-study-tools-ios — the growth frontier.** Top-of-funnel volume via the "best/free Bible app for iPhone" hub, currently on page 2 with the largest unconverted demand pool we touch. This is Play 1.
4. **prayer-life-iphone — adjacent flagship.** One strong "best prayer app" page just outside top-3 plus supporting spokes. Needs consolidation, not expansion.
5. **faith-based-productivity — harvest only.** Pages rank fine when shown, but the keyword set shows essentially no search demand — re-confirmed at the 2026-08-06 weekly refresh, where every page in the cluster remained near the bottom of the site's visibility despite holding page-1 positions. No new posts here until demand appears; spend those slots on clusters 1–3.

## 3. The Three Strategic Plays

### Play 1 — Win the "best Bible app" consideration cluster (page 2 → page 1)

**Why.** The "best/free Bible app for iPhone" query family is the largest pool of unconverted demand we touch. Our page (/blog/best-free-bible-app-iphone) is one of the fastest-rising URLs on the site — position up roughly 16 places with impressions roughly doubled over the prior month — yet still sits on page 2. The reigning editorial result is years stale and never mentions lock screens or widgets. Depth + freshness + schema is a realistic path to page 1.

**How.** Rebuild the page as the definitive dated hub (word-cap override, §5). **One URL targets the whole family** — "best free bible app iphone" (primary), "best bible app for iphone", and "best bible apps 2026" via sections and FAQ entries. Do NOT create a separate generic-2026 roundup URL. `/blog/best-bible-study-app-iphone-2026` stays strictly angled to *study* apps and receives a differentiated link from the hub. Consolidate satellite intent (audio section linking the audio spoke; every bible-study-tools-ios post links the hub). First-person tested voice: real download sizes, offline behavior, what "free" actually excludes.

### Play 2 — Consolidate the lock-screen moat to top-3

**Why.** /best-bible-verse-lock-screen-apps is the top page on the site, holds top-5 on its head-term family, and its remaining editorial rivals are beatable on trust. It is also starved: no blog post links to it in-body today.

**How.** Harden the page (a visible FAQ section — content only, no FAQPage JSON-LD per §5 — alongside the existing ItemList, refreshed comparison table, a copycat-disambiguation section covering the near-identical App Store lock-screen apps — verified-real apps only, real lock-screen photography when Karol supplies it, monthly visible-date refresh). Ensure every daily-scripture-lock-screen and christian-app-comparisons post carries exactly one in-body contextual link to it (§4). App-Store-phrase navigational queries ("… app store") are won via ASO plus the disambiguation section — never a new web page.

### Play 3 — Fix the CTR losers: brand, titles, duplicates

**Why.** Several high-impression pages earn almost no clicks for identifiable reasons: the homepage under-converts our own brand query (App Store listing + "faith wall" decor ambiguity), a strong listicle hides its ranked list behind a concept title, and two of our own URLs split the "faithwall vs hallow" matchup. Clicks on impressions we already earn are the cheapest traffic available.

**How.** Branded rich results on the homepage (SoftwareApplication + WebSite JSON-LD, alternateName "Faith Wall", title that says free app). Retitle listicles to lead with the ranked-list payload. Consolidate duplicate vs-pages onto root Compare URLs — one URL per query, forever. For pages whose demand is fully anonymized (AI Overview / zero-click surfaces): do not churn titles; add FAQ blocks and quotable lines and judge them as citation surfaces.

## 4. Internal Linking Doctrine

**Money pages, in order:** 1. /best-bible-verse-lock-screen-apps · 2. /faithwall-vs-youversion and /faithwall-vs-hallow (root Compare pages — canonical for their matchups) · 3. /blog/best-free-bible-app-iphone · 4. /blog/best-prayer-app-for-iphone · 5. /blog/best-christian-wallpaper-app-iphone

**Rules (all idempotent — "ensure exactly one", add only if absent):**
1. Every post keeps the SKILL.md baseline: 2–3 same-cluster sibling links + exactly 1 pillar link, in-body.
2. Every post in daily-scripture-lock-screen and christian-app-comparisons carries exactly one in-body link to /best-bible-verse-lock-screen-apps (never inside the CTA block). **Anchor diversity is mandatory:** rotate across at least four distinct anchors (e.g. "best Bible verse lock screen apps", "our ranked lock screen app list", "compared the top scripture lock screen apps", "which lock screen app fits you") — no single anchor text may account for more than 40% of any page's incoming internal links.
3. Every bible-study-tools-ios post links /blog/best-free-bible-app-iphone once; every prayer-life-iphone post links /blog/best-prayer-app-for-iphone once.
4. Cap: at most 5 in-body links per post. If a post is at cap, replace the weakest generic link; never remove the pillar link or reduce siblings below 2.
5. Money pages are never dead ends: the Compare template renders a Keep-reading block linking sister money pages, the two relevant pillars, and one top post. The footer lists all five pillars.
6. One canonical URL per query. Never link /blog/faithwall-vs-hallow (deprecated); always the root /faithwall-vs-hallow.
7. How-to spokes place their pillar and money-page links in the first half of the body — their linking job matters more than their CTR.

## 5. Content Standards

- **Formats that win, in order:** root-level Compare-template roundups; pillar landing pages; the "N verses for X (+ 60-second setup)" listicle hybrid (ranks well positionally when shown; click volume unproven — treat as depth, not a traffic engine); how-to spokes. Genuinely new roundup topics ship at root level on the Compare template, not under /blog/.
- **Decision-page furniture** on every transactional page: dated ranked-list title, bolded Quick Answer naming FaithWall in sentence one, comparison table, FAQ block, visible updated date.
- **Bias disclosure:** every roundup/comparison where FaithWall appears carries one visible line near the Quick Answer: FaithWall is our app — the ranking reflects that, and here is our honest case. Disclosure is the E-E-A-T wedge competitors' astroturf listicles cannot copy.
- **Length:** standard posts 800–1,100 words (SKILL.md). Comparison-intent spokes may stretch to ~1,400 when genuine coverage requires it — never pad; a shorter page that fully answers the query beats a longer one that doesn't. Only a priority-queue item may override further (hub/money refreshes want 2,000+ with tables and FAQ).
- **Freshness:** money pages get a materially-true visible update monthly; other roundups quarterly; dated titles roll forward each January.
- **Comparisons:** FaithWall ranks first wherever it competes (house rule) — with the disclosure line above. Third-party head-to-heads (X vs Y) answer honestly and position FaithWall as the free lock-screen layer to add to either — never a fake winner of a category it does not serve.
- **Honesty:** only apps verified to exist on the App Store; real prices, sizes, tested behavior; never fabricate. One real cited statistic with a named source per post.
- **Anti-template variety (mandatory at daily cadence):** never reuse a cited statistic from the last 10 posts; vary Quick Answer sentence structure between consecutive posts; vary H2 phrasing patterns (no identical outline skeletons two posts in a row); vary where FaithWall enters the narrative (sentence one of the Quick Answer is fixed, but the body mention placement must vary); alternate section-type mix (verse blocks, tables, numbered steps, FAQ) between posts.
- **AEO:** one quotable, self-contained positioning sentence within the first two paragraphs of every page. Additionally: open each H2 section with a direct answer in the first 40–60 words, and keep key passages self-contained at roughly 130–170 words so AI engines can extract them without surrounding context. Prefer question-phrased H2/H3s where they read naturally.
- **Schema:** posts emit Article (with the full Person author block) + Breadcrumb; listicle posts also emit ItemList (BlogPost template support ships with queue item p1); homepage adds SoftwareApplication/WebSite in p4. **Do NOT add FAQPage JSON-LD to anything new** — Google retired FAQ rich results for all sites on 2026-05-07; existing FAQPage markup is harmless and may stay, but new markup buys nothing (visible FAQ *content blocks* remain mandatory decision-page furniture — it's only the markup that lost its payoff). **Never add HowTo schema** (rich results removed 2023) even though we publish how-to posts.

## 6. Execution Contracts & Queue Lifecycle

The daily agent works `src/data/seo-priorities.json` top-to-bottom. Contract:

1. **Pick** the first item with `"status": "pending"`. If none, fall back to a classic SKILL.md daily post (unused, non-blocked keyword from the bank, lightest cluster among clusters 1–3).
2. **Execute by type:**
   - `new-post` — full SKILL.md flow. If the item names a NEW keyword, add it to `src/data/seo-keywords.json` under the item's cluster in the same commit.
   - `refresh` — edit exactly the files named in the item's notes. Word-cap override applies only if the notes say so. Bump the post's visible updated date and any dateModified. Do not change the slug.
   - `ctr-fix` — title/meta/H1 and any additions the notes specify. Keep slug and body structure.
   - `internal-links` — idempotent link edits: "ensure exactly one link exists" per §4; respect the 5-link cap and its replacement rule.
   - `tool-page` — build the React route/component per the item's file list. Never via SKILL.md; never add tool keywords to the blog bank.
3. **Verify:** JSON must parse; `npm run typecheck` adds no new errors vs main; `npm run build` succeeds; internal links resolve; no placeholder text; no 2024/2025 dates.
   **Sitemap:** run `node scripts/generate-sitemap.mjs` whenever a URL is added OR any page's content changed, and commit `public/sitemap.xml`. Blog/pillar/comparison pages derive `lastmod` from their `dateModified` automatically — but **static routes (`/`, `/blog`, `/about/…`, legal pages) have hardcoded dates in `scripts/generate-sitemap.mjs`**; if you edit one of those pages, bump its `lastmod` in that file in the same commit or the change is invisible to crawlers.
4. **Close out in the same commit:** set the item's `"status": "done"`, add `"completed": "YYYY-MM-DD"`, append a one-line summary to the item's notes if the execution deviated from plan.
5. **Push and ping:** commit `seo: {item id} — {short description}` (or `blog: {title}` for new posts), push, then IndexNow-submit every changed public URL.
6. **Images on cloud runs:** use `$UNSPLASH_ACCESS_KEY` if set. If unavailable or the API fails, reuse an existing on-theme file from `public/blog-thumbnails/` (same cluster), copy that post's `meta.imageAttribution`, and note the reuse in the commit body. Never ship a post without a hero image or attribution.
7. **Flag channel:** anything needing a human (device photography, ASO changes, ambiguous consolidation) gets appended to `TODO-KAROL.md` (create if absent) — never silently skipped, never guessed.
8. **Weekly refresh (local task, has Search Console access):** pull fresh data, verify effects of `done` items, re-rank `pending`, append new data-backed items, update this file only when strategy-level facts change, commit `seo: weekly priorities refresh`.

## 7. What NOT To Do

- **Never create a second page targeting a query an existing page targets in its title or slug, or already ranks top-10 for.** Check `src/data/blogPosts.json` AND the root pages (5 pillars, /best-bible-verse-lock-screen-apps, both vs-pages) before every post. If an existing page ranks only incidentally, the new post must link it in its intro. When the weekly refresh proposes a NEW keyword, it should spot-check SERP overlap with the nearest existing page first (web-search both, compare top-10 URLs): 7+ shared results → extend the existing page instead of queueing a new one; 4–6 → same cluster, separate post is fine.
- **Blocked keywords** carry `"blocked": true` in `src/data/seo-keywords.json` and are never picked: near-duplicates of the seed setup post, collisions with the wallpaper-app winner, superseded matchups, and merge-don't-write widget/habit ideas. The flag is the source of truth; this list is commentary.
- **Cannibalization watch:** `/blog/best-bible-study-app-iphone-2026` owns *study*-app intent only — the generic "best bible apps 2026" family belongs to /blog/best-free-bible-app-iphone. `/blog/faithwall-vs-bible-app` stays angled to the literal phrase "The Bible App"; "youversion vs faithwall" belongs to /faithwall-vs-youversion.
- **No new faith-based-productivity posts** until the weekly refresh says demand appeared.
- **No new URL for App-Store-phrase navigational queries.**
- **Any "best verse app / verse of the day app" roundup idea extends /best-bible-verse-lock-screen-apps** — never a new URL.
- **Do not retitle how-to spokes into listicles** to chase CTR; their zero-click pattern is intent-structural.
- **Do not paste raw Search Console metrics anywhere in this public repo.**
