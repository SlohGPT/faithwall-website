import { useState } from 'react';
import { Send, Mail } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="section-padding bg-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-10 right-10 w-20 h-20 text-gold">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 10v80M10 50h80" strokeWidth="8" />
          </svg>
        </div>
        <div className="absolute bottom-10 left-10 w-16 h-16 text-gold">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 10v80M10 50h80" strokeWidth="8" />
          </svg>
        </div>
      </div>

      <div className="container-custom relative">
        <div
          ref={ref}
          className={`max-w-2xl mx-auto text-center ${inView ? 'animate-in' : 'opacity-0'}`}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gold/25">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Join Our{' '}
            <span className="text-gradient-gold">Faith Community</span>
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Get weekly inspiration, app updates, and exclusive wallpapers
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <p className="text-green-700 font-medium">
                Welcome to the community! Check your inbox for a confirmation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-3.5 rounded-xl border border-cream-dark bg-white text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              />
              <button
                type="submit"
                className="btn-primary whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          )}

          <p className="text-sm text-text-secondary mt-4">
            We respect your inbox. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
