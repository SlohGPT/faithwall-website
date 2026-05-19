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
- **First content section MUST be**: `{ "type": "callout", "icon": "zap", "title": "Quick Answer", "content": "..." }` — a 1–3 sentence direct answer to the search query. This is snippet bait.
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
git add src/data/posts/{slug}.json src/data/blogPosts.json src/data/pillars.json "public/blog-thumbnails/{slug}.jpg"
git commit -m "$(cat <<'EOF'
blog: {title}

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git push
```

If `git push` fails because the branch is behind, do `git pull --rebase` then `git push` once. Do **not** force-push.

In your final response to the user, output exactly this format (no preamble):

```
✅ Published & pushed: {title}
   slug: {slug}
   url: https://faithwall.app/blog/{slug}
   cluster: {cluster}
   words: {wordCount}
   photo: {photographer} (Unsplash)
```

## Anti-patterns to avoid

These all came up while building the system — don't repeat them:

- **Don't pick a keyword whose slug already exists.** Always check first. Cannibalization kills the cluster.
- **Don't write generic "X is important because Y" filler.** Every paragraph should add a fact, a tactic, or a concrete example.
- **Don't make the post a thinly disguised FaithWall ad.** Mention FaithWall 2–3 times max in body content (the CTA is separate). Helpfulness first.
- **Don't quote Scripture without a reference.** Always include the book and verse in the `reference` field.
- **Don't hotlink the Unsplash image.** Always download to `public/blog-thumbnails/`.
- **Don't forget the download-tracking ping.** Unsplash needs it for the photographer's stats and the API's free tier ToS.
- **Don't write a post longer than 1100 words.** Tighter beats longer. Trim ruthlessly.
- **Don't put internal links in the CTA section.** They belong inside paragraphs in the body.

## When to add fresh keywords to the bank

If `src/data/seo-keywords.json` is running low (every keyword has been used), tell the user before starting:
> "The keyword bank is mostly exhausted in cluster X. Want me to generate 5 new long-tail keywords for that cluster first, or pick from another cluster?"

Don't silently invent new keywords without flagging.
