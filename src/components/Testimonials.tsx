const testimonials = [
  {
    quote: "FaithWall has transformed my morning routine. Instead of checking social media, I start with God's word.",
    author: 'Sarah M.',
    role: 'Youth Pastor',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    quote: "As a busy mom, I needed something simple. Every time I check my phone, I'm reminded of God's promises.",
    author: 'Rachel K.',
    role: 'Mother & Teacher',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    quote: "I've tried many devotional apps, but this is different. It meets me where I am - on my lock screen.",
    author: 'David L.',
    role: 'Seminary Student',
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
              className="card-gradient p-6 lg:p-8"
            >
              <p className="text-white/80 leading-relaxed mb-8 text-lg">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-white/50">
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
