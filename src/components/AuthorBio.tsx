export default function AuthorBio() {
  return (
    <aside className="mt-12 p-6 rounded-2xl bg-surface-card border border-surface-border flex items-center gap-5">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-2xl font-bold shrink-0">
        KB
      </div>
      <div>
        <p className="text-white font-semibold">Karol Billik</p>
        <p className="text-white/60 text-sm leading-relaxed">
          Founder of FaithWall. Building iPhone tools that turn ordinary phone moments into moments with God.
        </p>
      </div>
    </aside>
  );
}
