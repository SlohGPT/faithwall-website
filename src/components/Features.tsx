const features = [
  {
    label: 'Daily Inspiration',
    title: 'Fresh Scripture Every Day',
    description: 'Wake up to a new verse or prayer on your lock screen. Customized to your preferences and spiritual journey.',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    label: 'Personal Prayers',
    title: 'Your Prayers, Your Way',
    description: 'Add personal prayers, intentions, and affirmations. See them every time you pick up your phone.',
    image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    label: 'Beautiful Design',
    title: 'Stunning Backgrounds',
    description: 'Choose from curated wallpapers or use your own photos. Every glance becomes a moment of peace.',
    image: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    label: 'Privacy First',
    title: 'Your Data Stays Yours',
    description: 'No accounts required. No tracking. Your prayers and spiritual journey remain completely private.',
    image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export default function Features() {
  return (
    <section id="features" className="section-space bg-surface">
      <div className="container-main">
        <div className="text-center mb-16">
          <p className="text-brand font-medium mb-3 tracking-wide uppercase text-sm">Features</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Everything you need for
            <br />
            <span className="text-white/40">daily spiritual growth</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-3xl p-6 lg:p-8 bg-gradient-to-br from-surface-card to-surface-elevated border-2 border-brand/20 hover:border-brand/40 transition-all duration-300"
            >
              <div className="mb-6 rounded-2xl overflow-hidden aspect-[16/10] ring-1 ring-brand/10">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-brand text-sm font-medium mb-2 uppercase tracking-wider">{feature.label}</p>
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/60 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
