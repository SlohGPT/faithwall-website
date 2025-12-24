import { Star, Quote } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const testimonials = [
  {
    quote: "FaithWall has transformed my morning routine. Instead of checking social media, I start with God's word. It's been life-changing.",
    author: 'Sarah M.',
    role: 'Youth Pastor',
    avatar: 'SM',
    rating: 5,
  },
  {
    quote: "As a busy mom of 3, I needed something simple. Every time I check my phone, I'm reminded of God's promises. Beautiful app!",
    author: 'Rachel K.',
    role: 'Mother & Teacher',
    avatar: 'RK',
    rating: 5,
  },
  {
    quote: "I've tried many devotional apps, but this is different. It meets me where I am - on my lock screen. Genius concept, flawless execution.",
    author: 'David L.',
    role: 'Seminary Student',
    avatar: 'DL',
    rating: 5,
  },
  {
    quote: "Finally an app that respects my privacy AND strengthens my faith. No accounts, no tracking. Just pure inspiration.",
    author: 'Michael T.',
    role: 'IT Professional',
    avatar: 'MT',
    rating: 5,
  },
];

export default function Testimonials() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section id="testimonials" className="section-padding bg-cream">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Loved by{' '}
            <span className="text-gradient-gold">Believers Everywhere</span>
          </h2>
          <p className="text-lg text-text-secondary">
            See what our community is saying
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className={`relative bg-white rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-300 ${
                inView ? 'animate-in' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                transform: `rotate(${index % 2 === 0 ? '-1' : '1'}deg)`,
              }}
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-gold/20" />

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold fill-current" />
                ))}
              </div>

              <p className="text-text-primary leading-relaxed mb-6 font-display text-lg italic">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
