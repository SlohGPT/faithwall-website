import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-20 bg-surface-elevated">
      <div className="container-main">
        <div className="relative rounded-[2rem] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-surface-card to-surface-elevated" />

          <div className="relative px-8 py-16 sm:px-12 sm:py-20 lg:px-20">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Join the community
              </h2>
              <p className="text-white/60 mb-8">
                Get weekly inspiration, app updates, and exclusive wallpapers.
              </p>

              {submitted ? (
                <div className="bg-brand/20 border border-brand/30 rounded-2xl p-6">
                  <p className="text-white font-medium">
                    Welcome! Check your inbox for confirmation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-5 py-3.5 rounded-xl bg-surface border border-surface-border text-white placeholder-white/40 focus:outline-none focus:border-brand/50 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-brand text-white font-semibold rounded-xl hover:bg-brand-light transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              )}

              <p className="text-sm text-white/40 mt-4">
                We respect your inbox. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
