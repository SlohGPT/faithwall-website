import { motion } from 'framer-motion';

const features = [
  {
    title: 'Fresh Scripture Every Day',
    description: 'Wake up to a new verse or prayer on your lock screen. Customized to your preferences and spiritual journey.',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    large: true,
  },
  {
    title: 'Your Prayers, Your Way',
    description: 'Add personal prayers, intentions, and affirmations. See them every time you pick up your phone.',
    image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Stunning Backgrounds',
    description: 'Choose from curated wallpapers or use your own photos. Every glance becomes a moment of peace.',
    image: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Your Data Stays Yours',
    description: 'No accounts required. No tracking. Your prayers and spiritual journey remain completely private.',
    image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <section id="features" className="section-space bg-surface">
      <div className="container-main">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-brand font-medium mb-3 tracking-wide uppercase text-sm">Features</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Everything you need for
              <br />
              <span className="text-white/40">daily spiritual growth</span>
            </h2>
          </motion.div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={item}
              className={`group relative rounded-[2rem] overflow-hidden bg-surface-card border border-white/5 hover:border-white/10 transition-colors ${feature.large ? 'md:col-span-2 lg:col-span-2 aspect-[2/1]' : 'aspect-square'
                }`}
            >
              <div className="absolute inset-0">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
              </div>

              <div className="relative h-full flex flex-col justify-end p-8 sm:p-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-white/70 leading-relaxed max-w-md">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
