import { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { Zap, Lightbulb, AlertCircle, Sparkles, Check, X, ChevronDown } from 'lucide-react';
import AppStoreButton from './AppStoreButton';
import LockScreenVerse from './LockScreenVerse';
import StatBlock from './StatBlock';
import PostIllustration from './illustrations';
import { appStoreUrl } from '../lib/appStore';
import type { BlogSection } from '../types/blog';

/** Text blocks stop at about 65-72 characters per line on desktop (measured at 1280px); images, tables and the CTA use the full column. */
const MEASURE = 'md:max-w-[34rem]';

/** Quiet panel shared by tip, important, highlight and callout. Content size matches the 11-04 readability pass. */
const PANEL = `my-6 flex gap-3.5 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 ${MEASURE}`;
const PANEL_TEXT = 'text-white/85 text-[17px] md:text-base';

const slugify = (text: string) =>
  text.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/** Stable, unique id per H2 (heading text; "-2", "-3" on repeats), keyed by section index. */
function headingIds(sections: BlogSection[]): Map<number, { id: string; text: string }> {
  const out = new Map<number, { id: string; text: string }>();
  const seen = new Map<string, number>();
  sections.forEach((sec, i) => {
    if (sec.type !== 'heading' || sec.level !== 2) return;
    const base = slugify(sec.text) || `section-${out.size + 1}`;
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    out.set(i, { id: n === 1 ? base : `${base}-${n}`, text: sec.text });
  });
  return out;
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

/** Tag any App Store link in content with the page's campaign token (no-op while the token is empty). */
function tagAppStoreHref(href: string, campaign: string): string {
  return href.includes('id6756815070') ? appStoreUrl(campaign) : href;
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
              <Link to={internalPath} className="text-brand-light hover:text-white underline underline-offset-2">
                {children}
              </Link>
            );
          }
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-light hover:text-white underline underline-offset-2">
              {children}
            </a>
          );
        },
        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
        p: ({ children }) => <p className={`text-white/80 leading-[1.7] md:leading-relaxed ${MEASURE}`}>{children}</p>,
        // Wide GFM tables scroll inside their own container instead of being clipped by the page.
        table: ({ children }) => (
          <div
            className="my-2 overflow-x-auto overscroll-x-contain rounded-xl border border-white/10"
            role="region"
            aria-label="Comparison table, scrolls sideways"
            tabIndex={0}
          >
            <table className="w-full min-w-[32rem] md:min-w-0 border-collapse text-left text-base leading-relaxed">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-surface-card">{children}</thead>,
        th: ({ children }) => <th className="px-4 py-3 font-bold text-white align-top">{children}</th>,
        td: ({ children }) => {
          // "Yes ..." / "No ..." cells get a check or cross before the kept text.
          const yn = firstText(children).trim().match(/^(yes|no)(?![\w-])/i)?.[1].toLowerCase();
          return (
            <td className="px-4 py-3 border-t border-white/10 align-top">
              {yn === 'yes' && <Check aria-hidden="true" className="inline-block w-4 h-4 mr-1.5 -mt-0.5 text-brand-light" />}
              {yn === 'no' && <X aria-hidden="true" className="inline-block w-4 h-4 mr-1.5 -mt-0.5 text-white/45" />}
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
  return (
    <div className={PANEL}>
      <Icon className={`w-5 h-5 shrink-0 mt-[3px] ${tone}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {label && <p className={`text-sm font-semibold mb-1.5 ${tone}`}>{label}</p>}
        {title && <p className="font-bold text-white text-lg mb-2">{title}</p>}
        <div className={PANEL_TEXT}>{children}</div>
      </div>
    </div>
  );
}

/** "On this page": native details, closed, after the intro and before the first H2. */
function Contents({ items }: { items: { id: string; text: string }[] }) {
  return (
    <details className={`group my-8 rounded-xl border border-white/10 ${MEASURE}`}>
      <summary className="flex min-h-[3rem] cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 [&::-webkit-details-marker]:hidden">
        <span className="font-semibold text-white">On this page</span>
        <span className="flex items-center gap-2 text-sm text-white/50">
          {items.length} sections
          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        </span>
      </summary>
      <ul className="border-t border-white/10 px-5 py-2">
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className="block py-2 text-[17px] md:text-base leading-snug text-white/75 hover:text-white">
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

interface Props {
  sections: BlogSection[];
  campaign: string;
  /** Page slug (post or pillar): picks the illustration. */
  slug: string;
  title: string;
}

export default function BlogRenderer({ sections, campaign, slug, title }: Props) {
  const h2 = headingIds(sections);
  const h2Indexes = [...h2.keys()];
  const showContents = h2Indexes.length >= 4;
  // The illustration sits before the second H2, or before the first when the page has fewer than three.
  const illustrationAt = h2Indexes.length >= 3 ? h2Indexes[1] : h2Indexes[0];

  return (
    <div className="space-y-7 md:space-y-6">
      {sections.map((section, i) => {
        const block = (() => {
          switch (section.type) {
            case 'heading': {
              const Tag = section.level === 2 ? 'h2' : 'h3';
              // space-y-* outranks plain mt-*; the !important margin gives headings real room above on phones.
              const size = section.level === 2 ? 'text-2xl md:text-3xl mt-10 max-md:!mt-14' : 'text-xl md:text-2xl mt-6 max-md:!mt-10';
              return (
                // scroll-mt: the fixed nav's bottom edge is 92px (desktop) / 68px (phone) and html already has
                // scroll-padding-top: 100px, so 12px more lands the heading ~110px down with clear air below the nav.
                <Tag
                  id={h2.get(i)?.id}
                  className={`${size} ${section.level === 2 ? 'scroll-mt-3 ' : ''}font-bold text-white tracking-tight`}
                >
                  {section.text}
                </Tag>
              );
            }

            case 'paragraph':
              return (
                <div className="text-white/80 leading-[1.7] md:leading-relaxed text-lg">
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
                <ol className={`my-4 list-none pl-0 ${MEASURE}`}>
                  {section.items.map((item, idx) => (
                    <li key={idx} className="relative pl-12 pb-6 md:pb-5 last:pb-0">
                      {idx < section.items.length - 1 && (
                        <span aria-hidden="true" className="absolute left-4 top-8 bottom-0 w-px -translate-x-1/2 bg-white/15" />
                      )}
                      <span className="absolute left-0 top-0 w-8 h-8 rounded-full border border-brand/60 bg-surface text-brand font-bold flex items-center justify-center text-sm">
                        {idx + 1}
                      </span>
                      <div className="text-white/85 leading-[1.7] md:leading-relaxed text-[17px] md:text-base pt-0.5 md:pt-1">
                        <Markdown campaign={campaign} text={item} />
                      </div>
                    </li>
                  ))}
                </ol>
              );

            case 'list':
              return (
                <ul className={`my-4 space-y-3 md:space-y-2 list-disc list-outside pl-6 marker:text-brand ${MEASURE}`}>
                  {section.items.map((item, idx) => (
                    <li key={idx} className="text-white/85 leading-[1.7] md:leading-relaxed text-[17px] md:text-base pl-1">
                      <Markdown campaign={campaign} text={item} />
                    </li>
                  ))}
                </ul>
              );

            case 'ranked-list':
              return (
                <ol className={`my-4 space-y-4 list-none pl-0 ${MEASURE}`}>
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex gap-4 items-start p-4 rounded-xl bg-surface-card border border-surface-border">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-brand text-white font-bold flex items-center justify-center text-sm">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-bold text-white text-[17px] md:text-base">{item.name}</p>
                        <div className="text-white/80 leading-[1.7] md:leading-relaxed text-[17px] md:text-base mt-1">
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
                <figure className="my-8">
                  <img
                    src={section.src}
                    alt={section.alt}
                    width={section.width}
                    height={section.height}
                    loading="lazy"
                    decoding="async"
                    className={`mx-auto h-auto rounded-2xl border border-white/10 ${section.height > section.width ? 'max-w-[280px] w-full' : 'w-full'}`}
                  />
                  {(section.caption || section.href) && (
                    <figcaption className="mt-3 text-center text-white/60 text-sm">
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
              return (
                <div className="my-10 p-8 rounded-3xl bg-gradient-to-br from-brand/20 to-brand-dark/10 border border-brand/30 text-center">
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-3">{section.title}</h3>
                  <p className="text-white/80 mb-6 max-w-[32rem] mx-auto">{section.description}</p>
                  <div className="flex justify-center">
                    <AppStoreButton href={tagAppStoreHref(section.buttonUrl, campaign)} theme="light" />
                  </div>
                </div>
              );

            default:
              return null;
          }
        })();

        return (
          <Fragment key={i}>
            {showContents && i === h2Indexes[0] && <Contents items={[...h2.values()]} />}
            {i === illustrationAt && <PostIllustration slug={slug} title={title} />}
            {block}
          </Fragment>
        );
      })}
    </div>
  );
}
