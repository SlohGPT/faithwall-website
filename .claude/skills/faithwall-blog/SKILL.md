---
name: faithwall-blog
description: Write one full SEO blog post for faithwall.app end-to-end. Use this skill when the user says "make a blog", "today's blog", "new faithwall blog", "create today's blog post", "make a faithwall blog", or any variation asking for a new daily FaithWall blog post. Picks an unused long-tail keyword from src/data/seo-keywords.json, fetches an on-theme Unsplash photo with proper attribution, writes the post in Karol's voice following the strict section template, validates it, and registers it in src/data/blogPosts.json.
---

# FaithWall Daily Blog Skill

You are writing ONE blog post for faithwall.app. The site is a Vite + React SPA selling a free iOS app that puts daily Scripture on the iPhone lock screen. Read this whole file before starting. Run every step in order — do not skip.

## What success looks like

After running this skill end-to-end:
1. A new file `src/data/posts/{slug}.json` exists, ~800–1100 words, validates as JSON, follows the section template below.
2. A new Unsplash photo is at `public/blog-thumbnails/{slug}.jpg` with proper attribution recorded in the post's `meta.imageAttribution`.
3. The new post is inserted at **index 0** of `src/data/blogPosts.json`.
4. The post's slug is added to the matching pillar's `featured` array in `src/data/pillars.json` (drop the oldest if >6).
5. You report back the slug, cluster, word count, and photo credit in one paragraph. Offer to commit.

## The 8 steps

### Step 1 — Pick the keyword

Read both files:
- `src/data/seo-keywords.json` — the keyword bank (`[{keyword, cluster}, ...]`).
- `src/data/blogPosts.json` — what already exists.

If the user gave you a keyword in their message (e.g. "make a blog about prayer reminders"), use that and find the closest matching cluster.

Otherwise:
1. Filter out any keyword whose slug already exists in the registry (compute slug = `keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')`).
2. Count how many posts exist per cluster. Prefer a keyword whose cluster currently has the **fewest** published posts — this keeps the cluster sizes balanced.
3. Inside the chosen cluster, pick the most evergreen / highest intent keyword first (e.g. "how to..." or "best X 2026" beats "X comparison").

Generate the slug from the keyword. Confirm it doesn't already exist in `src/data/posts/`.

### Step 2 — Strategy (think this through internally)

Sketch (don't write yet):
- **Target reader**: one sentence describing who searches this keyword.
- **Angle**: what's the specific take? Not "ultimate guide" — something with a point of view.
- **Outline**: 5–7 H2 sections. Each H2 must move the reader forward, not pad word count.
- **Semantic keyword sidebar**: 8–12 related terms to weave in naturally (e.g. for "bible verse lock screen iphone": *scripture*, *daily verse*, *iOS 17 wallpaper*, *Focus mode*, *widget*, *KJV/ESV*, *Psalm*, *encouragement*, *anxiety*).
- **Internal links**: pick 2–3 existing post slugs from `blogPosts.json` to link, by keyword overlap. If only the seed post exists, link to the relevant **pillar URL** instead.
- **Pillar URL** for the chosen cluster (always link to this once):
  - `daily-scripture-lock-screen` → `/daily-scripture-lock-screen`
  - `prayer-life-iphone` → `/prayer-life-iphone`
  - `faith-based-productivity` → `/faith-based-productivity`
  - `bible-study-tools-ios` → `/bible-study-tools-ios`
  - `christian-app-comparisons` → `/christian-app-comparisons`

### Step 3 — Fetch the Unsplash hero photo

The Unsplash key lives in `.env.local` (gitignored). Source it before any curl.

**Pick a soft, aesthetic search query — not the raw keyword.** Literal queries like "iphone lock screen bible" return ugly screenshots. Pick a query that evokes the *feeling* of the post:

| Cluster | Good queries |
|---------|--------------|
| daily-scripture-lock-screen | "open bible candle morning", "open bible sunlight", "bible journal pen" |
| prayer-life-iphone | "praying hands sunrise", "kneeling sunset prayer", "open hands light" |
| faith-based-productivity | "morning coffee bible journal", "minimalist desk morning", "open notebook coffee" |
| bible-study-tools-ios | "bible study notes highlighter", "stack of books theology", "open bible pen study" |
| christian-app-comparisons | "iphone in hand morning", "modern church interior", "bokeh light cross" |

Run:

```bash
set -a && source .env.local && set +a
SEARCH_Q="open bible candle morning"   # pick from table above
ENC_Q=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$SEARCH_Q")
curl -s "https://api.unsplash.com/search/photos?query=${ENC_Q}&per_page=10&orientation=landscape&content_filter=high" \
  -H "Authorization: Client-ID ${UNSPLASH_ACCESS_KEY}"
```

Parse the JSON. From the top 5 results, pick the one with the **most `likes`** that isn't obviously off-topic (read the `alt_description`). Capture:
- `id`
- `user.name` → **photographer**
- `user.links.html` → **photographerUrl** (append `?utm_source=faithwall&utm_medium=referral`)
- `links.html` → **unsplashUrl** (append the same UTM params)
- `links.download_location` — used in next step
- `urls.regular` or `urls.full` for download

Download the photo and **ping the download tracking endpoint** (Unsplash API ToS requirement):

```bash
SLUG="my-post-slug"
PHOTO_ID="abc123"
DOWNLOAD_LOC="https://api.unsplash.com/photos/${PHOTO_ID}/download?ixid=..."
REGULAR_URL="https://images.unsplash.com/photo-..."  # but bump w=1600 q=85

# Download a sharper version of the image
curl -sL "${REGULAR_URL/&w=1080/&w=1600}" -o "public/blog-thumbnails/${SLUG}.jpg"

# Fire the download tracker (ToS)
curl -s -H "Authorization: Client-ID ${UNSPLASH_ACCESS_KEY}" "${DOWNLOAD_LOC}" > /dev/null
```

Verify the file exists and is non-empty (`ls -lh public/blog-thumbnails/${SLUG}.jpg`).

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
| **Mid-post `important` or `highlight`** | One block stating the product wedge in plain language (surface-specific, 144 touches, themed packs — pick one). |
| **"Where this gets hard"** | DIY fails → FaithWall named as the fix in the same section. Don't describe the problem without naming the solution. |

##### Mention budget by intent (total body mentions; CTA is separate)

Keep the count modest. Make every mention count by placing it early.

| Intent type | Examples | Sales temperature | FaithWall mentions | Early placement |
|---|---|---|---|---|
| **Setup / How-to** (informational) | "how to set prayer alarms iphone", "morning prayer routine iphone" | Helpful, but FaithWall is still the recommended shortcut | **2–3 total** — all in first half | Quick Answer + first paragraph + friction section |
| **Comparison / Best-X** (transactional) | "best bible study app iphone 2026", "faithwall vs hallow" | **FaithWall is THE recommendation** — competitors come after the verdict | **4–5 total** | Verdict in Quick Answer; competitors only after FaithWall is crowned |
| **FaithWall-native setup** (the app IS the answer) | "bible verse lock screen iphone", "rotating bible verse wallpaper" | The setup *is* the app — no hedging | **3–5 total** | Quick Answer + Step 1 + setup H2 within first 4 sections |

**Cardinal rule for comparison posts:** never list FaithWall as one option among many. The recommendation IS FaithWall, with reading apps positioned as "things you'll also want for sit-down study" — supplements, not alternatives.

**Anti-hedging:** never write "there are several apps that can do this" or "one option is FaithWall." Write "Use FaithWall" or "FaithWall does this automatically." Declarative, not catalog-style.

#### Mandatory section: "Where this gets hard"

Every post must include a friction-reveal section (any heading you like — "Where this gets hard", "The part nobody tells you", "Why DIY breaks down"). 1–2 paragraphs explaining what trips up the reader if they try to do it without FaithWall:

- **Curation effort.** Picking the right verse for today's mood requires you to know the Bible well already. FaithWall solves the chicken-and-egg problem with themed packs (Anxiety, Strength, Gratitude, Grief).
- **Rotation breaks by week 2.** Manual wallpaper changing is a habit that dies. FaithWall rotates automatically through your chosen pack.
- **Lock-screen images look ugly.** A YouVersion screenshot saved as a wallpaper is not designed for the lock-screen surface. FaithWall designs *for* that surface specifically.
- **No Focus mode integration.** Most apps generate an image you save manually. FaithWall installs the wallpaper directly via iOS Focus modes — no Camera Roll spam, no manual setting.
- **Spiritual diet vs random verses.** Random verse-of-the-day apps surface unrelated verses. FaithWall lets you pick a season's theme and stays cohesive.

Pick the 1–2 friction angles that match the post's topic. Don't list all five.

#### FaithWall positioning wedges (pick the one that fits)

FaithWall isn't "another Bible app" — its product wedge is specific. Use the framing that matches the post:

- **Surface specificity:** "The only app designed for the iPhone lock-screen surface, not adapted to it."
- **The 144 problem:** "You check your phone 144 times a day. FaithWall makes Scripture one of those touches without you opening anything."
- **Zero curation:** "Themed packs picked for seasons of life. You don't have to know which verse you need — we do."
- **iOS-native:** "Focus mode integration. The wallpaper installs itself. No Camera Roll wallpaper-juggling."
- **The piece every stack is missing:** "YouVersion is for reading. Dwell is for listening. FaithWall is for *seeing* — the daily-exposure piece."

#### CTA copy variation (don't reuse the same boilerplate)

The final CTA block matters. Vary the title + description by post type. Examples:

- **High-intent post:** title `"Get FaithWall — free, 60 seconds, no account"` / description `"The piece every Bible study stack is missing: daily Scripture on the lock screen you already check 144 times a day."`
- **How-to post:** title `"Skip the setup — let FaithWall do it"` / description `"Free. Installs the verse wallpaper automatically via iOS Focus modes. No screenshots, no manual rotation."`
- **Friction-resolution post:** title `"Stop curating verses yourself"` / description `"FaithWall ships themed packs picked for seasons of life — Anxiety, Strength, Gratitude. Pick one, install in 60 seconds."`

Never use a generic "Download FaithWall" title alone.

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
    "image": "/blog-thumbnails/{slug}.jpg",
    "imageAttribution": { "photographer": "...", "photographerUrl": "...?utm_source=faithwall&utm_medium=referral", "unsplashUrl": "...?utm_source=faithwall&utm_medium=referral" },
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
- **One cited statistic** — real, attributable, with the source name in-text. Example: *"144 phone pickups per day, per Reviews.org's 2026 Phone Habits report."* Use 2026 stats. Don't fabricate.
- **One `verse` block** — a relevant Scripture pull-quote. Use ESV or KJV. Format:
  ```json
  { "type": "verse", "reference": "Psalm 119:105", "text": "Your word is a lamp to my feet and a light to my path." }
  ```
- **Section type diversity** — use at least 6 of these types across the post: `callout`, `heading`, `paragraph`, `tip`, `stat`, `steps`, `list`, `highlight`, `important`, `verse`. Don't use only paragraphs.
- **Internal links** — 2–3 markdown links to other blog posts (from `blogPosts.json`) inside `paragraph` text. Format: `[anchor text](/blog/{other-slug})`. Plus one link to the cluster's pillar URL.
- **Final section** must be `{ "type": "cta", "title": "...", "description": "...", "buttonText": "Download FaithWall", "buttonUrl": "https://apps.apple.com/us/app/lock-screen-bible-verse/id6756815070" }`.
- **`meta.date`** = today's date as "Month DD, YYYY" (e.g. "May 19, 2026").
- **`meta.datePublished`** = ISO 8601 UTC for today at 09:00 (e.g. "2026-05-19T09:00:00.000Z").
- **`meta.readTime`** = `Math.ceil(wordCount / 200) + " min read"` (e.g. "6 min read").

#### Voice rules

- Punchy, declarative, second-person ("you", "your"). Not corporate.
- Reverent toward Scripture and prayer — never flippant. Faithwall's audience is people who actually pray.
- **Avoid AI-tells**: don't start with "Unlock the…", "In today's fast-paced world…", or "the ultimate guide to…". Don't say "delve", "leverage", "transform" (in the title), "navigate", or "synergy".
- Vary sentence length. Short sentences land. Long ones build. Mix them.
- It's OK to be slightly dry or have a point of view — that's what makes it read like a human wrote it.
- Use **bold** sparingly (8–12 times across the post) and only for things worth emphasizing.
- **Never** include placeholders like `[link]` or `TODO`.
- **Never** mention years 2024 or 2025. Today is 2026.

#### Title patterns to AVOID (notewall over-used these)

- "Unlock X: The Definitive Guide to Y"
- "The Ultimate Guide to X"
- "Master Your X with Y"
- "X: Everything You Need to Know"

#### Title patterns that work

- "Bible Verse Lock Screen on iPhone: The 2026 Setup Guide" (specific + dated)
- "How to Build a 7am Prayer Habit That Actually Sticks"
- "The Quiet Time Focus Mode (iPhone Setup, Step by Step)"
- "Hallow vs. Lectio 365: Which Prayer App is Worth Your Year?"
- "Three Scripture Memorization Apps Worth the Install"

### Step 5 — Self-review

Run through this checklist on your generated JSON **before** writing it:
- [ ] JSON parses (mentally check every `,`, `"`, `}`).
- [ ] No `2024` or `2025` strings anywhere.
- [ ] No `[link]`, `TODO`, `lorem`, `...`, or other placeholders.
- [ ] Exact keyword in title + first paragraph + 3–5 bolds.
- [ ] First section is the Quick Answer callout.
- [ ] Last section is the App Store CTA with the right URL.
- [ ] At least one `verse` block.
- [ ] At least one cited statistic with the source name.
- [ ] Word count is 800–1100.
- [ ] 2–3 internal links + 1 pillar link.
- [ ] All `imageAttribution` URLs have the UTM params.
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
  "thumbnail": "/blog-thumbnails/{slug}.jpg",
  "date": "Month DD, YYYY",
  "datePublished": "YYYY-MM-DDTHH:MM:SS.000Z",
  "cluster": "...",
  "keywords": [...],
  "readTime": "X min read",
  "isPublished": true
}
```

### Step 7 — Update the pillar's `featured` list

Read `src/data/pillars.json`. Find the pillar whose key matches `meta.cluster`. Prepend the new slug to `featured`. If `featured.length` > 6 after prepending, drop the last item. Write the file back.

### Step 8 — Commit and push

Always commit and push at the end of the skill — that's the deploy trigger for Vercel. Run these in order:

```bash
git add src/data/posts/{slug}.json src/data/blogPosts.json src/data/pillars.json public/sitemap.xml "public/blog-thumbnails/{slug}.jpg"
git commit -m "$(cat <<'EOF'
blog: {title}

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git push
```

If `git push` fails because the branch is behind, do `git pull --rebase` then `git push` once. Do **not** force-push.

### Step 9 — Submit to IndexNow

After the push, ping IndexNow so Bing, Yandex, Seznam, and Naver re-crawl quickly. Google doesn't participate in IndexNow — it picks up new URLs from the sitemap on its own crawl cycle, so no extra action needed for Google.

```bash
npm run indexnow -- https://faithwall.app/blog/{slug}
```

(Or the equivalent: `node scripts/submit-indexnow.mjs https://faithwall.app/blog/{slug}`)

The script reads the key from `scripts/indexnow.config.json` and posts to `https://api.indexnow.org/IndexNow`. A `200` or `202` means accepted.

**If you get `403`**: the Vercel deploy of the new commit probably hasn't finished. IndexNow checks that `https://faithwall.app/{key}.txt` exists at submission time. Wait ~60 seconds for Vercel and re-run the same command. The key file itself was committed during initial setup — only fresh blog URLs need it to be reachable on submission.

**If you get `422`**: usually means the URL itself isn't reachable. Same fix — wait for Vercel.

This step is **not optional** — it's the cheapest way to cut indexing time from days to hours for Bing & Yandex.

### Step 10 — Final report

In your final response to the user, output exactly this format (no preamble):

```
✅ Published & pushed: {title}
   slug: {slug}
   url: https://faithwall.app/blog/{slug}
   cluster: {cluster}
   words: {wordCount}
   photo: {photographer} (Unsplash)
   indexnow: ✓ submitted to Bing/Yandex/Seznam/Naver
```

## Anti-patterns to avoid

These all came up while building the system — don't repeat them:

- **Don't pick a keyword whose slug already exists.** Always check first. Cannibalization kills the cluster.
- **Don't write generic "X is important because Y" filler.** Every paragraph should add a fact, a tactic, or a concrete example.
- **Don't bury FaithWall past the first screen.** The mistake is a late recommendation, not an early one. Front-load FaithWall in Quick Answer + first paragraph; keep total mentions within the intent budget (see Lead with FaithWall). Helpfulness and a hard early recommendation are not opposites.
- **Don't quote Scripture without a reference.** Always include the book and verse in the `reference` field.
- **Don't hotlink the Unsplash image.** Always download to `public/blog-thumbnails/`.
- **Don't forget the download-tracking ping.** Unsplash needs it for the photographer's stats and the API's free tier ToS.
- **Don't write a post longer than 1100 words.** Tighter beats longer. Trim ruthlessly.
- **Don't put internal links in the CTA section.** They belong inside paragraphs in the body.

## When to add fresh keywords to the bank

If `src/data/seo-keywords.json` is running low (every keyword has been used), tell the user before starting:
> "The keyword bank is mostly exhausted in cluster X. Want me to generate 5 new long-tail keywords for that cluster first, or pick from another cluster?"

Don't silently invent new keywords without flagging.
