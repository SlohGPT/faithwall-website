import { Link } from 'react-router-dom';

export default function AuthorBio() {
  return (
    <aside className="mt-12 p-6 rounded-2xl bg-surface-card border border-surface-border flex items-center gap-5">
      <Link
        to="/about/karol-billik"
        aria-label="About Karol Billik"
        className="w-16 h-16 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-2xl font-bold shrink-0 hover:scale-105 transition-transform"
      >
        KB
      </Link>
      <div>
        <Link to="/about/karol-billik" className="text-white font-semibold hover:text-brand transition-colors">
          Karol Billik
        </Link>
        <p className="text-white/60 text-sm leading-relaxed">
          Founder of FaithWall. Building iPhone tools that turn ordinary phone moments into moments with God.{' '}
          <Link to="/about/karol-billik" className="text-brand hover:text-brand-light underline underline-offset-2">
            More about Karol →
          </Link>
        </p>
      </div>
    </aside>
  );
}
