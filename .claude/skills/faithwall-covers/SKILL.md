---
name: faithwall-covers
description: Make or redo the cover (thumbnail) of a faithwall.app blog post — the image on the blog grid, the post hero and the og:image. Use when a new post needs its cover (the faithwall-blog skill and the SEO autopilot call this step), when the user says "make a cover", "new thumbnail", "redo the thumbnail", "covers look the same", or when a cover breaks a rule below. Generated in-repo with headless Chrome; never stock photos, never paid AI images.
---

# FaithWall blog covers

A cover is one 1600x1067 jpg, rendered by `scripts/build-blog-thumbnails.mjs` on top of
`scripts/cover-engine.mjs` (the same engine file on FaithWall, QuranWall and NoteWall; ENGINE_VERSION in it).
It shows a short **hook** with one orange accent word, a topic **pill** (icon + tag, optional badge), the app mark
(icon + "FaithWall"), and a real-looking iPhone whose lock screen carries the post's KJV verse.
Cards and the post hero crop it to 16:9, so everything important sits in the centre band.

People click covers that say one clear thing and look different from their neighbours. Same style, different
idea: the layout, the palette and the float card change from post to post.

## 1. Write the entry

Append to `covers` in `src/data/blogCovers.json`:

```json
{ "slug": "christmas-bible-verse-lock-screen-iphone", "ref": "Luke 2:11", "palette": "midnight",
  "hook": "Christmas on your *Lock Screen*", "tag": "Seasonal", "icon": "Gift", "badge": "12 verses",
  "layout": "number", "number": "12" }
```

- `ref`: ONE short KJV verse (ideally under 20 words) that fits the topic, preferably one the post quotes.
  Not already used by another cover (the file name comes from the reference). The script reads the text from
  `public/bible/kjv`; never type scripture.
- `palette`: a key of `PALETTES` in the script, different from the two newest covers.
- `hook`: 2-6 words, exactly one `*accent*` word, never the post title. A promise or a picture, not a summary.
- `tag` + `icon` (a lucide-react name) + optional `badge` (a true count from the post, e.g. "12 verses").
- **Banned on covers and floats:** free, price, cost, trial, subscribe, subscription, paywall, premium, $ amounts,
  cure/guaranteed. (No price wording anywhere on the site; "free to download" lives only at download points.)

## 2. Pick the layout (no three neighbours alike)

The blog grid shows posts in `src/data/blogPosts.json` order. Look at the layouts of the 3 posts the new one will
sit next to and pick one that none of them uses:

| layout | use it for |
|---|---|
| `duo` | "X vs Y", comparisons, alternatives (second phone is a dimmed home screen) |
| `number` | the hook starts with a count ("12 verses…"): set `"number": "12"`, the numeral is drawn big and stripped from the hook |
| `closeup` | how-to / setup / widget / customise posts (big phone, no float) |
| `fan` | style or collection posts (three phones: optional `fan: ["Ref", "Ref"]` puts two more verses on the back phones, optional `fanPalettes: [palette, palette]`; without them the script shows the same verse on two other palettes) |
| `right` / `left` | everything else; alternate them |

`--dry` checks the entries; the build fails when a cover repeats the layout of its grid neighbour.

**Float card** (optional, `right` / `left` / `number` only): a small iOS notification-style card beside the phone,
`"float": {"icon": "AlarmClock", "title": "Alarm, 6:00 AM", "text": "Morning prayer"}`, each field at most 24
characters. Only a generic iOS thing the reader would really have next to the verse (an alarm, a Focus, a timer,
a calendar event, a reminder). Never an app feature claim, never a price word.

## 3. Render and check

```bash
node scripts/build-blog-thumbnails.mjs --dry      # check the entries only
node scripts/build-blog-thumbnails.mjs <slug>
```

It writes `public/blog-thumbnails/<ref>-bible-verse-iphone-wallpaper.jpg`, points the post's `meta.image` /
`meta.imageAlt` and the listing's `thumbnail` / `thumbnailAlt` at it, and removes the old file. Then the
responsive variants (`sharp` lives outside the repo on purpose; never add it to package.json; `{cover}` is the jpg
name without `.jpg`):

```bash
[ -d /tmp/fw-sharp/node_modules/sharp ] || npm i --prefix /tmp/fw-sharp sharp --no-save --silent
SHARP_DIR=/tmp/fw-sharp node scripts/build-blog-image-variants.mjs {cover}
```

Look at the result before committing, downscaled (`sips -Z 800 <jpg> --out /tmp/cover-check.jpg`), next to the
covers of its grid neighbours: the hook reads in one glance, nothing is cut off in the 16:9 centre band, the phone
looks like an iPhone, the float card does not cover the verse, the layout differs from the neighbours.

Commit the jpg, its variants, `coverVariants.json`, `blogCovers.json`, the post JSON and `blogPosts.json`.

## Cloud runs (no Chrome)

Write the entry (steps 1-2) and leave the post on its current cover; add a TODO line for the next local run.
Never ship a post without an image, never use Unsplash or a paid generator.

## In-post pictures (the same visual idea, inside the post)

The post template draws the cover-style pictures in the body by itself: the spot illustration, verse blocks as a
lock-screen phone and stat blocks as a chart. It keeps a healthy ratio (`src/lib/visualRhythm.ts`): about one big
picture per 250 words and none closer than about 110 words to another; the rest render as quiet quotes and
numbers. So write verse and stat blocks where they help the text; do not add image blocks to fill space.
