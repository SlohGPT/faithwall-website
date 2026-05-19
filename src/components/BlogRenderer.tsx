import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { Zap, Lightbulb, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import AppStoreButton from './AppStoreButton';
import type { BlogSection } from '../types/blog';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  zap: Zap,
  lightbulb: Lightbulb,
  book: BookOpen,
  alert: AlertCircle,
  sparkles: Sparkles,
};

function Markdown({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href = '', children }) => {
          const isInternal = href.startsWith('/') || href.startsWith('https://faithwall.app');
          const internalPath = isInternal
            ? href.replace(/^https:\/\/faithwall\.app/, '')
            : href;
          if (isInternal) {
            return (
              <Link to={internalPath} className="text-brand hover:text-brand-light underline underline-offset-2">
                {children}
              </Link>
            );
          }
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand hover:text-brand-light underline underline-offset-2">
              {children}
            </a>
          );
        },
        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
        p: ({ children }) => <p className="text-white/80 leading-relaxed">{children}</p>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

export default function BlogRenderer({ sections }: { sections: BlogSection[] }) {
  return (
    <div className="space-y-6">
      {sections.map((section, i) => {
        switch (section.type) {
          case 'heading': {
            const Tag = section.level === 2 ? 'h2' : 'h3';
            const size = section.level === 2 ? 'text-2xl md:text-3xl mt-10' : 'text-xl md:text-2xl mt-6';
            return (
              <Tag key={i} className={`${size} font-bold text-white tracking-tight`}>
                {section.text}
              </Tag>
            );
          }

          case 'paragraph':
            return (
              <div key={i} className="text-white/80 leading-relaxed text-lg">
                <Markdown text={section.text} />
              </div>
            );

          case 'callout': {
            const Icon = ICONS[section.icon || 'sparkles'] || Sparkles;
            return (
              <div key={i} className="my-8 p-6 rounded-2xl bg-brand/10 border border-brand/30 flex gap-4">
                <Icon className="w-6 h-6 text-brand shrink-0 mt-1" />
                <div className="flex-1">
                  {section.title && (
                    <p className="font-bold text-white text-lg mb-2">{section.title}</p>
                  )}
                  <div className="text-white/85"><Markdown text={section.content} /></div>
                </div>
              </div>
            );
          }

          case 'tip':
            return (
              <div key={i} className="my-6 p-5 rounded-xl bg-surface-card border-l-4 border-brand">
                <p className="text-xs uppercase tracking-widest text-brand font-bold mb-2">Tip</p>
                <div className="text-white/85"><Markdown text={section.content} /></div>
              </div>
            );

          case 'highlight':
            return (
              <div key={i} className="my-6 p-5 rounded-xl bg-gradient-to-br from-brand/15 to-brand-dark/10 border border-brand/20">
                <div className="text-white/90"><Markdown text={section.content} /></div>
              </div>
            );

          case 'important':
            return (
              <div key={i} className="my-6 p-5 rounded-xl bg-surface-card border-l-4 border-yellow-500/70">
                <p className="text-xs uppercase tracking-widest text-yellow-400 font-bold mb-2">Important</p>
                <div className="text-white/85"><Markdown text={section.content} /></div>
              </div>
            );

          case 'stat':
            return (
              <div key={i} className="my-6 p-6 rounded-2xl bg-surface-card border border-surface-border text-center">
                <p className="text-4xl md:text-5xl font-black text-brand">{section.number}</p>
                <p className="text-white font-semibold mt-2">{section.label}</p>
                {section.description && (
                  <p className="text-white/60 text-sm mt-2">{section.description}</p>
                )}
              </div>
            );

          case 'steps':
            return (
              <ol key={i} className="my-4 space-y-3 list-none pl-0 counter-reset-steps">
                {section.items.map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-brand text-white font-bold flex items-center justify-center text-sm">
                      {idx + 1}
                    </span>
                    <div className="text-white/85 leading-relaxed pt-1 flex-1">
                      <Markdown text={item} />
                    </div>
                  </li>
                ))}
              </ol>
            );

          case 'list':
            return (
              <ul key={i} className="my-4 space-y-2 list-disc list-outside pl-6 marker:text-brand">
                {section.items.map((item, idx) => (
                  <li key={idx} className="text-white/85 leading-relaxed pl-1">
                    <Markdown text={item} />
                  </li>
                ))}
              </ul>
            );

          case 'verse':
            return (
              <blockquote key={i} className="my-8 p-6 rounded-2xl bg-surface-card border-l-4 border-brand/60 italic">
                <p className="text-white text-xl md:text-2xl leading-relaxed font-serif">
                  "{section.text}"
                </p>
                <footer className="mt-3 text-brand/90 text-sm font-semibold not-italic tracking-wide">
                  — {section.reference}
                </footer>
              </blockquote>
            );

          case 'cta':
            return (
              <div key={i} className="my-10 p-8 rounded-3xl bg-gradient-to-br from-brand/20 to-brand-dark/10 border border-brand/30 text-center">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3">{section.title}</h3>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">{section.description}</p>
                <div className="flex justify-center">
                  <AppStoreButton href={section.buttonUrl} theme="light" />
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
