---
name: faithwall-blog
description: Write one full SEO blog post for faithwall.app end-to-end. Use this skill when the user says "make a blog", "today's blog", "new faithwall blog", "create today's blog post", "make a faithwall blog", or any variation asking for a new daily FaithWall blog post. Picks the queued keyword (or one that passes the SEO-STRATEGY §5 demand test), gives it a generated lock-screen cover (a KJV verse on an iPhone lock screen), writes the post in Karol's voice following the strict section template, validates it, and registers it in src/data/blogPosts.json.
---

# FaithWall Daily Blog Skill

You are writing ONE blog post for faithwall.app. The site is a Vite + React SPA promoting an iOS app that puts the user's chosen Scripture on the iPhone lock screen. Read this whole file before starting. Run every step in order — do not skip.

## Product facts (hard rule — added 2026-10-02)

Price rule (Karol, 2026-11-17): never mention the subscription, paywall, trial, in-app purchase or price on the site, in posts, FAQ entries, comparison tables, titles or meta descriptions (the legal pages are the only exception). Write only from these facts:

- FaithWall is an iPhone app from the App Store. Prose rule (Karol 2026-11-17: "in the blogs, we should not mention that explicitly"): in post, pillar and compare prose never write "free" about FaithWall, "free to download" included; "Free to download." appears only at download points (the end card the renderer draws from facts.json, App Store buttons, homepage hero and final CTA, compare CTA box), so a cta section's title and description carry no download phrase; competitors may still be called free; the web wallpaper maker's own "free" lines stay. Lint rule `prose-download-line` fails it.
- **Never describe FaithWall as free, and never write "free app", "free tier", "free version", "completely free", "no paywall", "no subscription", "no cost" or "costs nothing".** In comparison tables never add a price, cost, payment, trial or subscription row or column.
- **Never state or hint at a price, a trial, a paywall or what paying involves, and never write "see price in app" or "the App Store shows the price".** Competitor facts ("Hallow is a subscription app") may stay.
- The user picks their own verses (by book/chapter/verse or search, 24 translations). Never say it picks verses for you.
- Two ways to show them, chosen in the app: (1) a full-screen lock-screen wallpaper applied by an Apple Shortcut, or (2) a compact lock-screen widget. The wallpaper shows the one verse the user picked and changes only when they pick a new verse; it does not rotate. The widget shows the user's chosen verse; an optional "Auto-rotate verses" setting (off by default; hourly, every 8 hours or daily) makes it show random Bible verses from their translation instead (a queue of about 90, so no repeats for roughly 90 days at the daily setting). The user does not pick the rotated verses, and there are no verse sets, packs, themes or categories.
- The two setups are alternatives, not a combination: the wallpaper setup or the widget setup, chosen in the app. Settings > Change Setup Mode switches between them and clears the saved verse. Never recommend running a wallpaper and a rotating widget together; "Auto-rotate verses" exists only in the widget setup.
- How the wallpaper updates: the user picks a verse (or edits it), then the app itself launches an Apple Shortcut that applies it; iOS shows Shortcuts for a moment. The wallpaper stays until the user picks another verse. To change the text style, colour or background, the user taps Update Wallpaper Now in Settings. Nothing runs in the background or on a schedule, and the app cannot change the wallpaper while it is closed. A Shortcuts automation can only re-apply the last generated image, so it cannot change the verse. Deleting the verse blanks the wallpaper. There is no "Set Lock Screen" button in normal use (that wording appears only in the Shortcut install troubleshooting), and verse rows have no done/undone control.
- Widget details: the optional "Want a fresh verse?" prompt in the widget setup (or Settings later) is the opt-in for Auto-rotate verses. Sizes: Home Screen small and medium; on iOS 16+ Lock Screen rectangular and inline.
- Never write that the wallpaper or "today's verse" appears, changes or updates "automatically", "by itself", "on its own", "every day", "in the background" or "while the app is closed"; never write "nothing to tap", "nothing to open" or "a Shortcut you can automate"; never tell readers to "tap Set Lock Screen". scripts/lint-facts.mjs fails the merge on these (wallpaper-automatic, wallpaper-widget-combo).
- It has a built-in Bible browser (all books and chapters) for finding the verse, but it is built for the lock screen, not for study. The app UI is in 10 languages.
- Never mention "Focus modes" as the mechanism. Never claim "no account required", "verse packs", or that verses "stay on-device" (unverified).
- Statements that OTHER apps are free, that the web Wallpaper Maker or generator on this site is free (only that tool, never in a sentence that also calls the app free), or that KJV is public domain are fine.

## What success looks like

After running this skill end-to-end:
1. A new file `src/data/posts/{slug}.json` exists, ~800–1100 words, validates as JSON, follows the section template below.
2. A generated lock-screen cover is at `public/blog-thumbnails/{ref-slug}-bible-verse-iphone-wallpaper.jpg`, the post's `meta.image` / `meta.imageAlt` point at it, and there is no `imageAttribution` (generated covers need no credit).
3. The new post is inserted at **index 0** of `src/data/blogPosts.json`.
4. The post's slug is added to the matching pillar's `featured` array in `src/data/pillars.json` (drop the oldest if >6).
5. You report back the slug, cluster, word count, and the cover verse in one paragraph. Offer to commit.

## The 8 steps

### Step 1 — Pick the keyword

Read both files:
- `src/data/seo-keywords.json` — the keyword bank (`[{keyword, cluster}, ...]`).
- `src/data/blogPosts.json` — what already exists.

If the user gave you a keyword in their message (e.g. "make a blog about prayer reminders"), use that and find the closest matching cluster. It still has to pass the keyword gate below.

Otherwise — **first check `src/data/seo-priorities.json`**: if it exists and has a `pending` item of type `new-post`, that item's keyword wins over free selection (execution contracts in `SEO-STRATEGY.md` §6). If no pending new-post item, a bank keyword may be used only if it passes the keyword gate below:
1. Filter out any keyword whose slug already exists in the registry (compute slug = `keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')`), and any keyword with `"blocked": true` (cannibalization landmines — see `SEO-STRATEGY.md` §7; never write these).
2. Count how many posts exist per cluster. Prefer a keyword whose cluster currently has the **fewest** published posts among clusters the strategy allows (no new `faith-based-productivity` posts while `SEO-STRATEGY.md` §2 lists it as harvest-only).
3. Inside the chosen cluster, pick the most evergreen / highest intent keyword first (e.g. "how to..." or "best X 2026" beats "X comparison").

**Keyword gate (2026-11-17, hard rule).** A keyword may be used only if (a) it is the queued `new-post` item, or (b) it passes `SEO-STRATEGY.md` §5's demand test: evidence of demand, product fit, and the "no page of ours already ranks for it" check (`blogPosts.json`, root pages, `pillars.json`). Being listed in `seo-keywords.json` is not evidence of demand. A new post must not target a near-duplicate variant of a query an existing post already targets (reordered words, plural, synonym, year swap). [Google's spam policies: the scaled-content rule applies however the content is made.]

Generate the slug from the keyword. Confirm it doesn't already exist in `src/data/posts/`.

### Step 2 — Strategy (think this through internally)

Sketch (don't write yet):
- **Target reader**: one sentence describing who searches this keyword.
- **Angle**: what's the specific take? Not "ultimate guide" — something with a point of view.
- **Outline**: 5–7 H2 sections. Each H2 must move the reader forward, not pad word count.
- **Semantic keyword sidebar**: 8–12 related terms to weave in naturally (e.g. for "bible verse lock screen iphone": *scripture*, *daily verse*, *iOS 17 wallpaper*, *widget*, *KJV/ESV*, *Psalm*, *encouragement*, *anxiety*).
- **Internal links**: pick 2–3 existing post slugs from `blogPosts.json` to link, by keyword overlap. If only the seed post exists, link to the relevant **pillar URL** instead.
- **Pillar URL** for the chosen cluster (always link to this once):
  - `daily-scripture-lock-screen` → `/daily-scripture-lock-screen`
  - `prayer-life-iphone` → `/prayer-life-iphone`
  - `faith-based-productivity` → `/faith-based-productivity`
  - `bible-study-tools-ios` → `/bible-study-tools-ios`
  - `christian-app-comparisons` → `/christian-app-comparisons`

### Step 3 — Pick the cover verse and generate the cover

Covers are generated, not stock photos, and follow the **faithwall-covers** skill (`.claude/skills/faithwall-covers/SKILL.md`, read it now): a short hook with one orange accent word, a topic pill, the FaithWall mark and an iPhone lock screen with one KJV verse (`scripts/build-blog-thumbnails.mjs` on `scripts/cover-engine.mjs`). Do not use Unsplash or a paid image generator.

1. Pick ONE short verse (ideally under ~20 words, a single verse) that fits the post's topic, preferably one the post itself quotes. Its reference must not already be used in `src/data/blogCovers.json` (each cover file is named after its verse).
2. Append the full entry to `covers` in `src/data/blogCovers.json`: `slug`, `ref`, `palette` (a `PALETTES` key, not one of the two newest covers'), `hook` (2-6 words, one `*accent*` word, never the title), `tag`, `icon`, optional `badge`, and a `layout` none of the post's 3 grid neighbours uses (`duo` for comparisons, `number` + `"number"` when the hook starts with a count, `closeup` for how-to/setup, `fan` for collections, else `right`/`left`), plus an optional generic iOS `float` card (right/left/number only). The skill has the table and the banned words. Never type the verse text: the script reads it from `public/bible/kjv`. Check with `node scripts/build-blog-thumbnails.mjs --dry`.
3. The image itself is generated at the end of Step 6, once the post and its registry entry exist.
4. **Image rules (2026-11-17).** Cover and og images must be at least 1200 px wide and over 300,000 px in total (the current 1600x1067 covers pass). No text-heavy covers: the verse on the phone is the only text. `max-image-preview:large` stays on every page (it is in `index.html`; don't remove it). [Google Discover docs: recommendations, not hard rules.]

**Cloud / no Chrome:** the cloud sandbox has no Chrome, so skip the generation in Step 6: keep the `blogCovers.json` entry, and until a local run reuse an existing generated cover (any `/blog-thumbnails/*-bible-verse-iphone-wallpaper.jpg`) as `meta.image` and `thumbnail`, with no `imageAttribution`. Note in the commit body that the cover needs `node scripts/build-blog-thumbnails.mjs {slug}`. Never remove or restyle the cover of `/blog/best-free-bible-app-iphone` (ranking measurement until 2026-11-09).

### Step 4 — Write the post

#### Conversion doctrine (read this first)

The blog exists to drive App Store downloads, not just to rank. Every post must earn the click AND push FaithWall as the answer — **early and decisively**, not sprinkled across twelve paragraphs.

**The rule that overrides everything else:** readers should know FaithWall is the solution in the first 10 seconds. Fewer total mentions is fine. Late mentions are not.

##### Lead with FaithWall (placement beats volume)

Don't repeat the app name in every section. **Front-load** it — hard recommendation up top, then teach. At least **70% of all FaithWall mentions** must appear in the **first half** of the post (before the "Where this gets hard" section).

| Placement slot | Requirement |
|---|---|
| **Quick Answer** | **Sentence 1 must name FaithWall** as the primary solution. Not "use an app" or "try a wallpaper tool" — say **FaithWall** by name. Include the 60-second setup hook. |
| **First paragraph** | Second mention within the first 80 words. Tie the reader's pain to FaithWall: "You already tried X — FaithWall handles Y." |
| **First H2** | FaithWall-forward for setup/native keywords (e.g. "The 60-second FaithWall setup"). For how-to posts, the first H2 can be educational, but the **second H2** must be FaithWall setup. |
| **Steps block** | **Step 1 is always "Download FaithWall."** No DIY steps, no competitor walkthroughs, no "save to Photos" before the app. |
| **Mid-post `important` or `highlight`** | One block stating the product wedge in plain language (surface-specific, 144 touches, the verse you choose — pick one). |
| **"Where this gets hard"** | DIY fails → FaithWall named as the fix in the same section. Don't describe the problem without naming the solution. |

##### Mention budget by intent (total body mentions; CTA is separate)

Keep the count modest. Make every mention count by placing it early.

| Intent type | Examples | Sales temperature | FaithWall mentions | Early placement |
|---|---|---|---|---|
| **Setup / How-to** (informational) | "how to set prayer alarms iphone", "morning prayer routine iphone" | Helpful, but FaithWall is still the recommended shortcut | **2–3 total** — all in first half | Quick Answer + first paragraph + friction section |
| **Comparison / Best-X** (transactional) | "best bible study app iphone 2026", "faithwall vs hallow" | **FaithWall is THE recommendation** — competitors come after the verdict | **4–5 total** | Verdict in Quick Answer; competitors only after FaithWall is crowned |
| **FaithWall-native setup** (the app IS the answer) | "bible verse lock screen iphone" | The setup *is* the app — no hedging | **3–5 total** | Quick Answer + Step 1 + setup H2 within first 4 sections |

**Rotating-verse topics** ("rotating bible verse wallpaper", "verse of the day lock screen"): the wallpaper never rotates, so these are not a no-hedging native setup. Answer them with the widget setup and its optional Auto-rotate verses setting (off by default), and say the wallpaper stays until the user picks another verse.

**Cardinal rule for comparison posts:** never list FaithWall as one option among many. The recommendation IS FaithWall, with reading apps positioned as "things you'll also want for sit-down study" — supplements, not alternatives.

**Anti-hedging:** never write "there are several apps that can do this" or "one option is FaithWall." Write "Use FaithWall" or "FaithWall keeps the verse you picked on your lock screen." Never write that FaithWall does anything automatically beyond the product facts (the app runs the Shortcut after you pick a verse; the widget rotates only if Auto-rotate verses is on). Declarative, not catalog-style.

#### Mandatory section: "Where this gets hard"

Every post must include a friction-reveal section (any heading you like — "Where this gets hard", "The part nobody tells you", "Why DIY breaks down"). 1–2 paragraphs explaining what trips up the reader if they try to do it without FaithWall:

- **Curation effort.** Picking the right verse for today's mood requires you to know the Bible well already. FaithWall removes the daily choosing: search helps the user find one verse for the season (anxiety, strength, gratitude, grief), and the optional widget setting (off by default) can bring random verses after it.
- **Rotation breaks by week 2.** Manual wallpaper changing is a habit that dies. FaithWall's widget can optionally auto-rotate (a setting, off by default): it starts with the user's verse and then shows random Bible verses; the wallpaper stays until they pick a new verse.
- **Lock-screen images look ugly.** A YouVersion screenshot saved as a wallpaper is not designed for the lock-screen surface. FaithWall designs *for* that surface specifically.
- **Manual image-saving.** Most apps generate an image you save manually. FaithWall applies the wallpaper through an Apple Shortcut, or shows a lock-screen widget instead (see Product facts).
- **Spiritual diet vs random verses.** Random verse-of-the-day apps surface unrelated verses. FaithWall lets you pick a season's theme and stays cohesive.

Pick the 1–2 friction angles that match the post's topic. Don't list all five.

#### FaithWall positioning wedges (pick the one that fits)

FaithWall isn't "another Bible app" — its product wedge is specific. Use the framing that matches the post:

- **Surface specificity:** "The only app designed for the iPhone lock-screen surface, not adapted to it."
- **The 144 problem:** "You check your phone 144 times a day. FaithWall makes Scripture one of those touches without you opening anything."
- **Zero curation:** "Search finds a verse for the season you're in. You don't have to know where it lives."
- **iOS-native:** "Wallpaper applied by an Apple Shortcut, or a lock-screen widget (optional auto-rotate setting, off by default). See Product facts."
- **The piece every stack is missing:** "YouVersion is for reading. Dwell is for listening. FaithWall is for *seeing* — the daily-exposure piece."

#### CTA copy variation (don't reuse the same boilerplate)

The final CTA block matters. Vary the title + description by post type. Examples:

- **High-intent post:** title `"Get FaithWall — 60-second setup"` / description `"The piece every Bible study stack is missing: daily Scripture on the lock screen you see every time you pick up your phone."`
- **How-to post:** title `"Skip the setup — let FaithWall do it"` / description `"Puts your chosen verse on the lock screen as a wallpaper, with an optional widget. No screenshots to crop."`
- **Friction-resolution post:** title `"Put the verse where you'll see it"` / description `"Pick the verse for the season you're in — anxiety, strength, gratitude — and FaithWall puts it on your lock screen."`

Never use a generic "Download FaithWall" title alone. The site renders this block as the install card and adds the facts itself ("Free to download.", iPhone and the minimum iOS, the App Store rating, the official badge and a QR code on desktop), so the description should carry the post's reason to install, not repeat those facts, and never says "free to download" itself (the card prints it once). Never put a campaign token in `buttonUrl`; the site adds the right one.

#### Structure

Create `src/data/posts/{slug}.json` matching this exact structure (reference [src/data/posts/bible-verse-lock-screen-iphone.json](../../../src/data/posts/bible-verse-lock-screen-iphone.json) for the canonical example):

```json
{
  "meta": {
    "title": "...",
    "description": "150–160 chars, includes the keyword once",
    "date": "Month DD, YYYY",
    "datePublished": "YYYY-MM-DDTHH:MM:SS.000Z",
    "readTime": "X min read",
    "image": "/blog-thumbnails/{ref-slug}-bible-verse-iphone-wallpaper.jpg",
    "imageAlt": "iPhone lock screen showing {Reference} (KJV)",
    "keywords": ["primary keyword", "secondary keyword", "...", "faithwall"],
    "cluster": "one of the 5 cluster slugs"
  },
  "sections": [ ... ]
}
```

#### Hard rules for the body

- **800–1100 words total** across all `paragraph` and list `text` content.
- **Exact-match keyword** appears in: `meta.title`, the first `paragraph` section (within first 100 words), and bolded with `**...**` 3–5 times in the body.
- **First content section MUST be**: `{ "type": "callout", "icon": "zap", "title": "Quick Answer", "content": "..." }` — a 1–3 sentence direct answer to the search query. **Sentence 1 names FaithWall** as the solution (see Lead with FaithWall above). This is snippet bait AND the conversion hook.
- **Answer first (2026-11-17).** The first 100 words of the body answer the title's question directly: the Quick Answer callout gives the answer, and the first `paragraph` right after it restates it with the exact keyword. Nothing else (intro story, definitions, an image) comes before them. [Surfer, a vendor study scraped June 2026: 38% of AI Overview citations come from a page's first 100 words. Vendor study, not Google guidance.] Each H2 also opens with a 40-60 word direct answer [SEO-STRATEGY.md §5 AEO].
- **Effort signals (SEO-STRATEGY.md §5).** At least two things a scraper cannot fake: a measured first-party fact, a version-specific setting path, an original screenshot that already exists in the repo, or a named-author judgment call with reasoning. A device-less (cloud) run never writes a first-person testing claim ("we tested", "we timed", observed timings): it ships with one signal plus a dated line in `TODO-KAROL.md` for the device test. Whenever the post gives Settings steps, name the iOS version they were written for.
- **Day-one in-links (SEO-STRATEGY.md §4 rule 8, §5).** In the same commit that publishes the post, at least two already-indexed pages that rank (the pillar, a money page or a ranking sibling) get an in-body link to it, within the 5-link cap and its replacement rule. Stage every file you edit for this.
- **Structured data (2026-11-17).** New posts add neither FAQPage nor HowTo JSON-LD. FAQ rich results stopped showing on 2026-05-07 [Google changelog notice dated 2026-05-08; docs removed 2026-06-15], and HowTo has been deprecated since 2023-09-14. Visible FAQ blocks stay. Existing markup stays because it is harmless (`src/pages/Pillar.tsx` still emits HowTo on 4 pillars, and that is fine). Google says no special schema is needed for its AI features [developers.google.com/search/docs/fundamentals/ai-optimization-guide].
- **One cited statistic** — real, attributable, with the source name in-text, in the form *"<number> <what>, per <source>'s <year> <report name>."* Open the source page and copy the number from it in this run: never from memory, from another post or from this file. Use 2026 stats. Don't fabricate. Don't use the phone-checks figure (Reviews.org's 2026 report: 186 checks a day; 144 is its 2023 figure), because most posts already carry it.
- **One `verse` block** — a relevant Scripture pull-quote. Use ESV or KJV. Format:
  ```json
  { "type": "verse", "reference": "Psalm 119:105", "text": "Your word is a lamp to my feet and a light to my path." }
  ```
- **Picture ratio (2026-11-18).** The template draws `verse` blocks as a lock-screen phone, `stat` blocks with a chart, and adds the spot illustration and the mid install card itself. It keeps about one big picture per 250 words and none within about 110 words of another (`src/lib/visualRhythm.ts`); extra verse and stat blocks render as quiet quotes and plain numbers. So place verse and stat blocks where they help the text, at least two paragraphs apart, and add no `image` block just to fill space.
- **Section type diversity** — use at least 6 of these types across the post: `callout`, `heading`, `paragraph`, `tip`, `stat`, `steps`, `list`, `highlight`, `important`, `verse`. Don't use only paragraphs.
- **Internal links** — 2–3 markdown links to other blog posts (from `blogPosts.json`) inside `paragraph` text. Format: `[anchor text](/blog/{other-slug})`. Plus one link to the cluster's pillar URL.
- **Final section** must be `{ "type": "cta", "title": "...", "description": "...", "buttonText": "Download FaithWall", "buttonUrl": "https://apps.apple.com/us/app/lock-screen-bible-verse/id6756815070" }`.
- **`meta.date`** = today's date as "Month DD, YYYY" (e.g. "May 19, 2026").
- **`meta.datePublished`** = ISO 8601 UTC for today at 09:00 (e.g. "2026-05-19T09:00:00.000Z").
- **`meta.readTime`** = `Math.ceil(wordCount / 200) + " min read"` (e.g. "6 min read").
- **Refreshing an existing post (2026-11-17).** Bump the visible "Updated" date and `dateModified` only on a substantive edit: new or changed facts, a new section, a changed recommendation or ranking, or re-tested steps. Never bump them for cosmetic edits: typos, links, image swaps, template or design changes. [Google's guidance on dates; Ahrefs, July 2025: AI assistants prefer fresher pages, so fake freshness is the risk to avoid.]

#### Voice rules

- Punchy, declarative, second-person ("you", "your"). Not corporate.
- Reverent toward Scripture and prayer — never flippant. Faithwall's audience is people who actually pray.
- **Avoid AI-tells**: don't start with "Unlock the…", "In today's fast-paced world…", or "the ultimate guide to…". Don't say "delve", "leverage", "transform" (in the title), "navigate", or "synergy".
- Vary sentence length. Short sentences land. Long ones build. Mix them.
- It's OK to be slightly dry or have a point of view — that's what makes it read like a human wrote it.
- Use **bold** sparingly (8–12 times across the post) and only for things worth emphasizing.
- **Never** include placeholders like `[link]` or `TODO`.
- **Years (2026-11-17).** Use today's date, and never present an earlier year as current. A year goes in a title only for year-bound queries (a "best X <year>" ranked list, a seasonal post), and the year in the title must equal the year of the visible "Updated" date. Dated titles roll forward each January (`SEO-STRATEGY.md` §5 Freshness).

#### Title rules (2026-11-17)

- Aim for 60 characters or fewer; 65 is the hard maximum (`scripts/link-graph.mjs` warns above 65).
- The H1 uses the same wording as the title, minus the brand suffix, and `og:title` equals the title.
- The brand name appears at most once.
- No boilerplate prefixes, and no half-empty or obsolete titles: Google rewrites those. [Google title-link docs: half-empty, obsolete, inaccurate, micro-boilerplate, repeated site name.]
- No year unless the query is year-bound (see Years above).

#### Title patterns to AVOID (notewall over-used these)

- "Unlock X: The Definitive Guide to Y"
- "The Ultimate Guide to X"
- "Master Your X with Y"
- "X: Everything You Need to Know"

#### Title patterns that work

- "Bible Verse Lock Screen on iPhone: A Step-by-Step Setup" (specific, no year: a how-to is not year-bound)
- "Best Bible Study Apps for iPhone in 2026, Ranked" (year-bound ranked list; the visible Updated year must be 2026)
- "How to Build a 7am Prayer Habit That Actually Sticks"
- "A Morning Verse on Your Lock Screen (iPhone Setup, Step by Step)"
- "Hallow vs. Lectio 365: Which Prayer App is Worth Your Year?"
- "Three Scripture Memorization Apps Worth the Install"

### Step 5 — Self-review

Run through this checklist on your generated JSON **before** writing it:
- [ ] JSON parses (mentally check every `,`, `"`, `}`).
- [ ] No earlier year presented as current. A year in the title only for a year-bound query, equal to the year of the visible "Updated" date.
- [ ] No `[link]`, `TODO`, `lorem`, `...`, or other placeholders.
- [ ] Exact keyword in title + first paragraph + 3–5 bolds.
- [ ] **Answer first:** the first paragraph under the H1 answers the title's question within its first 100 words, with the exact keyword in it. Each H2 opens with a 40–60 word direct answer.
- [ ] **Keyword gate:** the keyword is the queued item or passed SEO-STRATEGY §5's demand test (including "no page of ours already ranks"), and is not a near-duplicate variant of an existing post's query.
- [ ] **Title:** 60 characters or fewer (65 hard maximum); H1 and `og:title` match it; brand at most once; no boilerplate prefix.
- [ ] **Effort signals:** at least two (or one plus a dated `TODO-KAROL.md` line from a device-less run); no first-person testing claims without a device; the iOS version is named wherever Settings steps appear.
- [ ] **Day-one in-links:** at least two already-indexed ranking pages link in-body to this post in the same commit (5-link cap respected).
- [ ] **Structured data:** no new FAQPage or HowTo JSON-LD (a visible FAQ block is fine).
- [ ] **Originality:** run `node scripts/lint-originality.mjs --slug <slug>` and fix any WARN (same first six words, same H2 set, a repeated cited statistic) unless there is a reason. It guards against templated posts; it is not a quota.
- [ ] First section is the Quick Answer callout.
- [ ] Last section is the App Store CTA with the right URL.
- [ ] At least one `verse` block.
- [ ] At least one cited statistic with the source name.
- [ ] Word count is 800–1100.
- [ ] 2–3 internal links + 1 pillar link.
- [ ] `meta.image` + `meta.imageAlt` point at the generated cover (or the cloud fallback above); no `imageAttribution`. Cover at least 1200 px wide and over 300,000 px in total; no text-heavy cover.
- [ ] On a refresh: the "Updated" date and `dateModified` are bumped only for a substantive edit, never for typos, links, image swaps or template changes.
- [ ] `meta.cluster` exactly matches one of the 5 cluster slugs.
- [ ] **Conversion checks:**
  - [ ] Sales temperature matches the keyword's intent (informational vs comparison vs FaithWall-native).
  - [ ] **Quick Answer sentence 1 names FaithWall** — not a generic "download an app."
  - [ ] **FaithWall appears in the first 80 words** (Quick Answer + first paragraph).
  - [ ] **≥70% of FaithWall mentions are in the first half** of the post (before "Where this gets hard").
  - [ ] **Steps block Step 1 is "Download FaithWall"** — no DIY steps before it.
  - [ ] **"Where this gets hard" section is present** with at least 1 friction angle and FaithWall named as the fix.
  - [ ] FaithWall mention count is within budget (2–3 / 4–5 / 3–5 by intent) — not over-mentioned in the back half.
  - [ ] No hedging language ("several apps", "one option is FaithWall").
  - [ ] Comparison posts: FaithWall is THE recommendation, not one option among many.
  - [ ] CTA title and description are post-specific, not generic boilerplate.
  - [ ] If competitor apps are named, they're framed as solving a *different* problem, not as alternatives to FaithWall.

Then write the file with the Write tool.

### Step 6 — Register the post

Read `src/data/blogPosts.json`. Use the Edit tool to **insert the new entry at index 0** (after the opening `[`). The entry shape:

```json
{
  "slug": "...",
  "title": "...",
  "description": "...",
  "thumbnail": "/blog-thumbnails/{ref-slug}-bible-verse-iphone-wallpaper.jpg",
  "thumbnailAlt": "iPhone lock screen showing {Reference} (KJV)",
  "date": "Month DD, YYYY",
  "datePublished": "YYYY-MM-DDTHH:MM:SS.000Z",
  "cluster": "...",
  "keywords": [...],
  "readTime": "X min read",
  "isPublished": true
}
```

Then generate the cover (local runs only; needs Google Chrome, no npm installs). It writes the jpg and sets `meta.image` / `meta.imageAlt` in the post and `thumbnail` / `thumbnailAlt` in the registry entry:

```bash
node scripts/build-blog-thumbnails.mjs {slug}
```

Then build the responsive AVIF/WebP variants for the new cover (local runs). `sharp` is deliberately not a dependency of the repo (37ae978): install it outside the tree and point `SHARP_DIR` at it, as below. Never add it to package.json. It is idempotent, never touches the jpg, writes `public/blog-thumbnails/{cover}-{240,480,640,960,1280}.avif|webp` and updates `src/data/coverVariants.json`, which the hero and the cards read. Run it after every new or regenerated cover (`{cover}` = the jpg file name without `.jpg`):

```bash
[ -d /tmp/fw-sharp/node_modules/sharp ] || npm i --prefix /tmp/fw-sharp sharp --no-save --silent
SHARP_DIR=/tmp/fw-sharp node scripts/build-blog-image-variants.mjs {cover}
```

A cover without variants still renders (plain jpg, no preload), so if sharp cannot be installed or the script fails (offline, cloud run), this step never fails the item: skip it and say in the commit body that the cover needs `node scripts/build-blog-image-variants.mjs {cover}`. A post that reuses an existing cover needs nothing. Never run this inside `npm run build`.

### Step 7 — Update the pillar's `featured` list

Read `src/data/pillars.json`. Find the pillar whose key matches `meta.cluster`. Prepend the new slug to `featured`. If `featured.length` > 6 after prepending, drop the last item. Write the file back.

### Step 8 — Commit and push

Always commit and push at the end of the skill — that's the deploy trigger for Vercel. First run the facts gate on your uncommitted work and fix every FAIL it prints (it checks the Product facts rules and campaign tokens; the merge gate runs the same check):

```bash
node scripts/lint-facts.mjs --diff origin/main --worktree
```

Then run these in order:

```bash
git add src/data/posts/{slug}.json src/data/blogPosts.json src/data/blogCovers.json src/data/coverVariants.json src/data/pillars.json public/sitemap.xml public/blog-thumbnails
git commit -m "$(cat <<'EOF'
blog: {title}

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git push
```

If `git push` fails because the branch is behind, do `git pull --rebase` then `git push` once. Do **not** force-push. If it fails with a 403, the active GitHub CLI account is the wrong one: push once as SlohGPT with `git -c credential.helper= -c 'credential.helper=!f() { test "$1" = get && echo username=SlohGPT && echo "password=$(gh auth token --user SlohGPT)"; }; f' push`, and never run `gh auth switch`.

### Step 9 — Submit to IndexNow

After the push, ping IndexNow so Bing, Yandex, Seznam, and Naver re-crawl quickly. Google doesn't participate in IndexNow — it picks up new URLs from the sitemap on its own crawl cycle, so no extra action needed for Google.

```bash
npm run indexnow -- https://faithwall.app/blog/{slug}
```

(Or the equivalent: `node scripts/submit-indexnow.mjs https://faithwall.app/blog/{slug}`)

The script reads the key from `scripts/indexnow.config.json` and posts to `https://api.indexnow.org/IndexNow`. A `200` or `202` means accepted.

**If you get `403`**: the Vercel deploy of the new commit probably hasn't finished. IndexNow checks that `https://faithwall.app/{key}.txt` exists at submission time. Wait ~60 seconds for Vercel and re-run the same command. The key file itself was committed during initial setup — only fresh blog URLs need it to be reachable on submission.

**If you get `422`**: usually means the URL itself isn't reachable. Same fix — wait for Vercel.

This step is **not optional** — it's the cheapest way to cut indexing time from days to hours for Bing & Yandex. Bing's index also feeds ChatGPT search and Copilot answers.

Google has no ping: sitemap pings are retired, and the Indexing API is only for job postings and livestreams, so never use either. Google finds the post through the sitemap and the in-body links from indexed pages (§4 rule 8). Requesting indexing in Search Console is Karol's manual step, once per new URL, never repeated.

### Step 10 — Final report

In your final response to the user, output exactly this format (no preamble):

```
✅ Published & pushed: {title}
   slug: {slug}
   url: https://faithwall.app/blog/{slug}
   cluster: {cluster}
   words: {wordCount}
   cover: {Reference} (KJV) lock-screen cover
   indexnow: ✓ submitted to Bing/Yandex/Seznam/Naver
```

## Anti-patterns to avoid

These all came up while building the system — don't repeat them:

- **Don't pick a keyword whose slug already exists.** Always check first. Cannibalization kills the cluster.
- **Don't write generic "X is important because Y" filler.** Every paragraph should add a fact, a tactic, or a concrete example.
- **Don't bury FaithWall past the first screen.** The mistake is a late recommendation, not an early one. Front-load FaithWall in Quick Answer + first paragraph; keep total mentions within the intent budget (see Lead with FaithWall). Helpfulness and a hard early recommendation are not opposites.
- **Don't quote Scripture without a reference.** Always include the book and verse in the `reference` field.
- **Don't use Unsplash photos for covers.** Covers are generated (Step 3); never hotlink an image.
- **Don't write a post longer than 1100 words.** Tighter beats longer. Trim ruthlessly.
- **Don't put internal links in the CTA section.** They belong inside paragraphs in the body.

## When to add fresh keywords to the bank

If `src/data/seo-keywords.json` is running low (every keyword has been used), tell the user before starting:
> "The keyword bank is mostly exhausted in cluster X. Want me to generate 5 new long-tail keywords for that cluster first, or pick from another cluster?"

Don't silently invent new keywords without flagging.

## How blocks render on the site

The renderer turns some blocks into pictures, so write them with that in mind.

- **`verse`** becomes a lock-screen figure: a cropped iPhone showing the clock and the verse, with the reference under it and a caption ("Psalm 119:18 as a lock screen"). Keep verses under about 45 words; longer ones shrink until the type gets small. The palette comes from the reference, so the same verse always looks the same.
- **`stat`** counts become dot fields: a whole number from 10 to 400 (for example `144`, or `66 days`) draws one dot per unit, and a percentage draws a ring. Only use a count when one dot per unit is honest. Ranges, scores, money and "1 billion+" stay as plain numbers. Always give the stat a `number` (or `value`) and a `label`; a stat without a number renders nothing.
- **`steps`** are drawn as a numbered rail, so use them only for real sequences, never for a list of options.
- **`tip` and `important`** get a sentence-case label ("Tip", "Important") and a small icon. `callout` and `highlight` keep their own title and no label.
- **Contents box:** a post with 4 or more H2s gets a closed "On this page" box before the first H2, built from the H2 texts. Write H2s that read well as a list, and keep them unique within the post.
- **Yes/No table cells** that start with "Yes" or "No" get a check or a cross before the text.
- **Illustration:** the renderer places a post illustration before the second H2 (before the first when there are fewer than three). Nothing to write for it.
