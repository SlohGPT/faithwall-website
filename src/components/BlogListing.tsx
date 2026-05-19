import BlogCard from './BlogCard';
import type { BlogPostListing } from '../types/blog';

export default function BlogListing({ posts }: { posts: BlogPostListing[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-white/50">
        <p className="text-lg">New posts coming soon.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
