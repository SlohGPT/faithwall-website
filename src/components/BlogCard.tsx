import { Link } from 'react-router-dom';
import type { BlogPostListing } from '../types/blog';

const CLUSTER_LABEL: Record<string, string> = {
  'daily-scripture-lock-screen': 'Daily Scripture',
  'prayer-life-iphone': 'Prayer Life',
  'faith-based-productivity': 'Productivity',
  'bible-study-tools-ios': 'Bible Study',
  'christian-app-comparisons': 'App Comparisons',
};

export default function BlogCard({ post }: { post: BlogPostListing }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block rounded-2xl overflow-hidden bg-surface-card border border-surface-border hover:border-brand/40 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-[16/9] overflow-hidden bg-surface-elevated">
        <img
          src={post.thumbnail}
          alt={post.title}
          width={1600}
          height={900}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-white/50 mb-3">
          <span className="px-2.5 py-1 rounded-full bg-brand/15 text-brand font-semibold tracking-wide">
            {CLUSTER_LABEL[post.cluster] || post.cluster}
          </span>
          <span>{post.readTime}</span>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-white leading-tight group-hover:text-brand transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-2 text-white/60 text-sm leading-relaxed line-clamp-2">
          {post.description}
        </p>
        <p className="mt-4 text-xs text-white/40">{post.date}</p>
      </div>
    </Link>
  );
}
