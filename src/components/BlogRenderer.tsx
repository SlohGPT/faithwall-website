import { Children, Fragment, isValidElement } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { Zap, Lightbulb, AlertCircle, Sparkles, Check, X } from 'lucide-react';
import AppStoreButton from './AppStoreButton';
import AppNudge, { RatingLine } from './AppNudge';
import InstallHandoff from './InstallHandoff';
import LockScreenVerse from './LockScreenVerse';
import StatBlock from './StatBlock';
import PostContents from './PostContents';
import PostIllustration from './illustrations';
import { appStoreUrl } from '../lib/appStore';
import { isConversionHeld } from '../data/conversionHold';
import { useIsAndroid } from '../hooks/useIsAndroid';
import facts from '../data/facts.json';
import { headingIds, contentsItems } from '../lib/postHeadings';
import { leadItems, pickIcon } from '../lib/postIcons';
import type { BlogSection } from '../types/blog';

/*
 * Post typography (blog design pass, 2026-11-17). One body token for every running text: `.post-text`
 * (18 / 1.7 below 1180 px, 19 / 1.65 from 1180 px, white/80; src/index.css). The measure is set on the column
 * (40rem, `.post-layout`), not per block; figures, tables, verse figures and install blocks break out to 768 px in CSS.
 */
const BODY = 'post-text';

/** Quiet panel shared by tip, important, highlight and callout: 16 px padding on phones, 24 px from 768 px. */
const PANEL = 'post-callout grid grid-cols-[20px_minmax(0,1fr)] items-start gap-x-2.5 gap-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 md:gap-x-3.5 md:p-5';
const PANEL_TEXT = BODY;

const LINK = 'text-brand-light hover:text-white underline underline-offset-[3px] decoration-1';

/** All text inside a React-markdown node. */
function allText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(allText).join('');
  if (isValidElement(node)) return allText((node.props as { children?: React.ReactNode }).children);
  return '';
}

/** "Table: A / B / C" from the header row, so the scroll region has a name that says what it holds. */
function tableLabel(children: React.ReactNode): string {
  const head = Children.toArray(children)[0];
  const tr = isValidElement(head) ? Children.toArray((head.props as { children?: React.ReactNode }).children)[0] : null;
  const cells = isValidElement(tr)
    ? Children.toArray((tr.props as { children?: React.ReactNode }).children).map((c) => allText(c).trim()).filter(Boolean)
    : [];
  return cells.length ? `Table: ${cells.slice(0, 5).join(' / ')}` : 'Comparison table';
}

/** First plain text inside a React-markdown cell, through <strong>/<em> wrappers. */
function firstText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) {
    for (const n of node) {
      const t = firstText(n);
      if (t.trim()) return t;
    }
    return '';
  }
  if (node && typeof node === 'object' && 'props' in node) {
    return firstText((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return '';
}

/** Tag any App Store link in content with the page type's campaign token (no-op while the token is empty). */
function tagAppStoreHref(href: string, campaign: string): string {
  return href.includes(`id${facts.appId}`) ? appStoreUrl(campaign) : href;
}

function Markdown({ text, campaign }: { text: string; campaign: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href: rawHref = '', children }) => {
          const href = tagAppStoreHref(rawHref, campaign);
          const isInternal = href.startsWith('/') || href.startsWith('https://faithwall.app');
          const internalPath = isInternal
            ? href.replace(/^https:\/\/faithwall\.app/, '')
            : href;
          if (isInternal) {
            return (
              <Link to={internalPath} className={LINK}>
                {children}
              </Link>
            );
          }
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
              {children}
            </a>
          );
        },
        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
        p: ({ children }) => <p>{children}</p>,
        // Wide GFM tables scroll inside their own container instead of being clipped by the page. Phones get a right-edge
        // fade and a "Swipe to compare" hint (CSS, under 640 px); the first column stays put while the rest scrolls.
        table: ({ children }) => (
          <div className="post-table">
            <div className="post-table-scroll" role="region" aria-label={tableLabel(children)} tabIndex={0}>
              <table className="post-table-el">{children}</table>
            </div>
            <div className="post-table-hint" aria-hidden="true">Swipe to compare</div>
          </div>
        ),
        thead: ({ children }) => <thead>{children}</thead>,
        th: ({ children }) => <th>{children}</th>,
        td: ({ children }) => {
          // "Yes ..." / "No ..." cells get a check or cross before the kept text.
          const yn = firstText(children).trim().match(/^(yes|no)(?![\w-])/i)?.[1].toLowerCase();
          return (
            <td>
              {yn === 'yes' && <Check aria-hidden="true" className="inline-block w-4 h-4 mr-1.5 -mt-0.5 text-brand-light" />}
              {yn === 'no' && <X aria-hidden="true" className="inline-block w-4 h-4 mr-1.5 -mt-0.5 text-white/65" />}
              {children}
            </td>
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
}


function Callout({
  icon: Icon,
  tone,
  label,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  label?: string;
  title?: string;
  children: React.ReactNode;
}) {
  const hasHead = Boolean(label || title);
  // Phones: the icon sits left of the label or title, the text runs the full column below it (a callout with no
  // label stacks the icon above the text). From 768 px: icon column on the left, label and text beside it.
  return (
    <div className={PANEL}>
      <Icon className={`col-start-1 row-start-1 mt-[2px] h-5 w-5 shrink-0 ${tone}`} aria-hidden="true" />
      {hasHead && (
        <div className="col-start-2 row-start-1 min-w-0">
          {label && <p className={`text-sm font-semibold ${tone}`}>{label}</p>}
          {title && <p className="font-bold text-white text-lg md:text-xl leading-snug">{title}</p>}
        </div>
      )}
      <div
        className={`${PANEL_TEXT} col-span-2 row-start-2 min-w-0 md:col-span-1 md:col-start-2 ${hasHead ? '' : 'md:row-start-1'}`}
      >
        {children}
      </div>
    </div>
  );
}

/** Characters of reader-facing text in a section (links, image sources and alt text do not count). */
function textLength(section: BlogSection): number {
  switch (section.type) {
    case 'heading':
    case 'paragraph':
      return section.text.length;
    case 'callout':
      return (section.title?.length ?? 0) + section.content.length;
    case 'tip':
    case 'highlight':
    case 'important':
      return section.content.length;
    case 'stat':
      return section.label.length + (section.description ?? section.context ?? '').length;
    case 'steps':
    case 'list':
      return section.items.reduce((n, item) => n + item.length, 0);
    case 'ranked-list':
      return section.items.reduce((n, item) => n + item.name.length + item.description.length, 0);
    case 'verse':
      return section.text.length;
    case 'cta':
      return section.title.length + section.description.length;
    default:
      return 0;
  }
}

/**
 * Where the one mid-article install card goes (the section index it sits in front of), or -1.
 * Candidates are the H2s from the third one on; the card goes before the first candidate s where
 * (a) it is at least 3 sections after the illustration, (b) the section before it is not an image,
 * (c) every 'cta' block is more than 3 sections away, and (d) at least 30 % of the article's text
 * comes before it.
 */
function midCardIndex(sections: BlogSection[], h2Indexes: number[], illustrationAt: number | undefined): number {
  if (illustrationAt === undefined) return -1;
  const total = sections.reduce((n, sec) => n + textLength(sec), 0);
  const ctaIndexes = sections.flatMap((sec, i) => (sec.type === 'cta' ? [i] : []));
  let before = 0;
  let counted = 0; // sections[0..counted-1] are in `before`
  for (const s of h2Indexes.slice(2)) {
    for (; counted < s; counted++) before += textLength(sections[counted]);
    if (
      s - illustrationAt >= 3 &&
      sections[s - 1]?.type !== 'image' &&
      ctaIndexes.every((c) => Math.abs(c - s) > 3) &&
      before >= 0.3 * total
    ) {
      return s;
    }
  }
  return -1;
}

/** The post's own closing block on pages that are not held back: title and description, install line, requirements, rating, badge, QR on desktop. */
function EndCta({ section, campaign }: { section: Extract<BlogSection, { type: 'cta' }>; campaign: string }) {
  const href = tagAppStoreHref(section.buttonUrl, campaign);
  const isAndroid = useIsAndroid();
  return (
    <div
      data-install-card="end"
      data-nosnippet=""
      className="my-10 p-8 rounded-3xl bg-gradient-to-br from-brand/20 to-brand-dark/10 border border-brand/30 text-center"
    >
      <h3 className="text-2xl md:text-3xl font-black text-white mb-3">{section.title}</h3>
      <p className="text-white/80 mb-4 max-w-[32rem] mx-auto">{section.description}</p>
      <div className="mb-6 space-y-1 text-[15px] leading-snug text-white/70">
        <p>{facts.installLine}</p>
        <p>{`iPhone · ${facts.minIOSText}`}</p>
        <RatingLine className="justify-center" />
        {isAndroid && <p>FaithWall is made for iPhone.</p>}
      </div>
      <div className="flex justify-center">
        <AppStoreButton size="cta" href={href} theme="light" />
      </div>
      <InstallHandoff className="mx-auto mt-6" />
    </div>
  );
}

interface Props {
  sections: BlogSection[];
  /** Page slug (post or pillar): picks the illustration and the hold check. */
  slug: string;
  title: string;
  /** Picks the App Store campaign tokens and whether the hold applies. */
  pageType: 'blog' | 'pillar';
  /** Render the "On this page" list inside the body, before the first H2 (pillar pages). Posts lift it into their layout rail. */
  inlineContents?: boolean;
}

export default function BlogRenderer({ sections, slug, title, pageType, inlineContents = false }: Props) {
  const h2 = headingIds(sections);
  const h2Indexes = [...h2.keys()];
  const contents = inlineContents ? contentsItems(sections) : [];
  // The illustration sits before the second H2, or before the first when the page has fewer than three.
  const illustrationAt = h2Indexes.length >= 3 ? h2Indexes[1] : h2Indexes[0];

  const isPost = pageType === 'blog';
  const campaign = isPost ? 'web-blog-body' : 'web-pillar';
  const endCampaign = isPost ? 'web-blog-end' : 'web-pillar';
  const midCampaign = isPost ? 'web-blog-mid' : 'web-pillar';
  // Held pages (src/data/conversionHold.ts) keep today's closing block and get no mid-article card.
  const held = isConversionHeld(pageType, slug);
  const midAt = held ? -1 : midCardIndex(sections, h2Indexes, illustrationAt);

  return (
    <div id="post-body" data-post-body className="post-prose">
      {sections.map((section, i) => {
        const block = (() => {
          switch (section.type) {
            case 'heading': {
              const Tag = section.level === 2 ? 'h2' : 'h3';
              // Sizes and the 56 / 16 (H2) and 36 / 8 (H3) rhythm live in .post-prose (src/index.css); html already has
              // scroll-padding-top: 100px, so the 12px scroll-margin lands a jumped-to heading about 112px down.
              return (
                <Tag
                  id={h2.get(i)?.id}
                  className={`${section.level === 2 ? 'post-h2 scroll-mt-3' : 'post-h3'} font-bold text-white`}
                >
                  {section.text}
                </Tag>
              );
            }

            case 'paragraph':
              return (
                <div className={BODY}>
                  <Markdown campaign={campaign} text={section.text} />
                </div>
              );

            case 'callout':
              return (
                <Callout icon={Zap} tone="text-brand" title={section.title}>
                  <Markdown campaign={campaign} text={section.content} />
                </Callout>
              );

            case 'tip':
              return (
                <Callout icon={Lightbulb} tone="text-brand-light" label="Tip">
                  <Markdown campaign={campaign} text={section.content} />
                </Callout>
              );

            case 'highlight':
              return (
                <Callout icon={Sparkles} tone="text-brand">
                  <Markdown campaign={campaign} text={section.content} />
                </Callout>
              );

            case 'important':
              return (
                <Callout icon={AlertCircle} tone="text-yellow-400/90" label="Important">
                  <Markdown campaign={campaign} text={section.content} />
                </Callout>
              );

            case 'stat':
              // Older posts use value/context; newer ones use number/description.
              return (
                <StatBlock
                  value={section.number ?? section.value}
                  label={section.label}
                  description={section.description ?? section.context}
                />
              );

            case 'steps':
              return (
                <ol className="post-steps list-none pl-0">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="relative pl-12 pb-6 last:pb-0">
                      {idx < section.items.length - 1 && (
                        <span aria-hidden="true" className="absolute left-4 top-8 bottom-0 w-px -translate-x-1/2 bg-white/15" />
                      )}
                      <span className="absolute left-0 top-0 w-8 h-8 rounded-full border border-brand/60 bg-surface text-brand font-bold flex items-center justify-center text-sm">
                        {idx + 1}
                      </span>
                      <div className={BODY}>
                        <Markdown campaign={campaign} text={item} />
                      </div>
                    </li>
                  ))}
                </ol>
              );

            case 'list': {
              // Items that start with a bold label ("**Widget:** text") render as icon rows (2026-11-18 design pass).
              const rows = leadItems(section.items);
              if (rows) {
                return (
                  <ul className="post-keylist">
                    {rows.map((row, idx) => {
                      const Icon = pickIcon(row.label, row.text);
                      return (
                        <li key={idx} className="post-keyrow">
                          <span aria-hidden="true" className="post-keyicon">
                            <Icon className="h-5 w-5" strokeWidth={1.75} />
                          </span>
                          <div className="min-w-0 flex-1">
                            {row.label && (
                              <div className="post-keylabel">
                                <Markdown campaign={campaign} text={row.label} />
                              </div>
                            )}
                            {row.text && (
                              <div className={`post-keytext ${row.label ? 'mt-1' : ''}`}>
                                <Markdown campaign={campaign} text={row.text} />
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                );
              }
              return (
                <ul className="post-list list-disc list-outside space-y-2 pl-6 marker:text-brand">
                  {section.items.map((item, idx) => (
                    <li key={idx} className={`${BODY} pl-1`}>
                      <Markdown campaign={campaign} text={item} />
                    </li>
                  ))}
                </ul>
              );
            }

            case 'ranked-list':
              return (
                <ol className="post-ranked space-y-4 list-none pl-0">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex gap-4 items-start p-4 rounded-xl bg-surface-card border border-surface-border">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-brand text-surface font-bold flex items-center justify-center text-sm">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className={`${BODY} !text-white font-bold`}>{item.name}</p>
                        <div className={`${BODY} mt-1`}>
                          <Markdown campaign={campaign} text={item.description} />
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              );

            case 'verse':
              return <LockScreenVerse text={section.text} reference={section.reference} />;

            case 'image':
              return (
                <figure className="post-figure">
                  <img
                    src={section.src}
                    alt={section.alt}
                    width={section.width}
                    height={section.height}
                    loading="lazy"
                    decoding="async"
                    className={`mx-auto h-auto rounded-2xl border border-white/10 bg-surface-elevated ${section.height > section.width ? 'max-w-[280px] w-full' : 'w-full'}`}
                  />
                  {(section.caption || section.href) && (
                    <figcaption className="mt-3 text-center text-white/65 text-sm">
                      {section.caption}
                      {section.href && (
                        <>
                          {section.caption ? ' · ' : ''}
                          <a href={section.href} className="text-brand hover:underline">
                            {section.linkText ?? 'Download'}
                          </a>
                        </>
                      )}
                    </figcaption>
                  )}
                </figure>
              );

            case 'cta':
              if (!held) return <EndCta section={section} campaign={endCampaign} />;
              return (
                <div data-hides-sticky className="my-10 p-8 rounded-3xl bg-gradient-to-br from-brand/20 to-brand-dark/10 border border-brand/30 text-center">
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-3">{section.title}</h3>
                  <p className="text-white/80 mb-4 max-w-[32rem] mx-auto">{section.description}</p>
                  <p className="mb-6 text-[15px] leading-snug text-white/70">{facts.installLine}</p>
                  <div className="flex justify-center">
                    <AppStoreButton size="cta" href={tagAppStoreHref(section.buttonUrl, endCampaign)} theme="light" />
                  </div>
                </div>
              );

            default:
              return null;
          }
        })();

        return (
          <Fragment key={i}>
            {contents.length > 0 && i === h2Indexes[0] && <PostContents items={contents} variant="inline" />}
            {i === illustrationAt && <PostIllustration slug={slug} title={title} />}
            {i === midAt && <AppNudge variant="install" placement="mid" campaign={midCampaign} className="!mt-10 mb-10" />}
            {block}
          </Fragment>
        );
      })}
    </div>
  );
}
