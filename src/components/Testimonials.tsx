const testimonials = [
  {
    quote: "FaithWall has transformed my morning routine. Instead of checking social media, I start with God's word.",
    author: 'Sarah M.',
    role: 'First Waitlist Member',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    quote: "As a busy mom, I needed something simple. Every time I check my phone, I'm reminded of God's promises.",
    author: 'Rachel K.',
    role: 'First Waitlist Member',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    quote: "I've tried many devotional apps, but this is different. It meets me where I am - on my lock screen.",
    author: 'David L.',
    role: 'First Waitlist Member',
    image: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-space bg-surface">
      <div className="container-main">
        <div className="text-center mb-16">
          <p className="text-brand font-medium mb-3 tracking-wide uppercase text-sm">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Loved by believers
            <br />
            <span className="text-white/40">everywhere</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="rounded-3xl p-6 lg:p-8 bg-gradient-to-br from-surface-card to-surface-elevated border-2 border-brand/20 hover:border-brand/30 transition-colors duration-300"
            >
              <p className="text-white/80 leading-relaxed mb-8 text-lg">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-brand/20"
                />
                <div>
                  <p className="font-semibold text-white">
                    {testimonial.author}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-md bg-brand/20 text-brand-light border border-brand/30">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
