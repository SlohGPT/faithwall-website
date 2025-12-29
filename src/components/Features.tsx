import { BookOpen, Cross, PenLine, Bell, Palette, Shield } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const features = [
  {
    icon: BookOpen,
    title: 'Daily Scripture',
    description: 'Fresh verses delivered to your lock screen every morning. Never miss your daily bread.',
  },
  {
    icon: Cross,
    title: 'Beautiful Wallpapers',
    description: 'Stunning faith-inspired backgrounds that make every glance meaningful.',
  },
  {
    icon: PenLine,
    title: 'Personal Prayers',
    description: 'Add your own prayers and intentions. See them when you need them most.',
  },
  {
    icon: Bell,
    title: 'Gentle Reminders',
    description: 'Customizable notifications to pause and reflect throughout your day.',
  },
  {
    icon: Palette,
    title: 'Personalized Experience',
    description: 'Choose themes, fonts, and styles that speak to your heart.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your prayers stay on your device. No accounts required. No data collection.',
  },
];

export default function Features() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section id="features" className="section-padding bg-cream">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Everything You Need for{' '}
            <span className="text-gradient-orange">Daily Spiritual Growth</span>
          </h2>
          <p className="text-lg text-text-secondary">
            Simple. Beautiful. Meaningful.
          </p>
        </div>

        <div
          ref={ref}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group bg-white rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-orange/0 hover:border-orange ${
                inView ? 'animate-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-orange flex items-center justify-center mb-5 shadow-lg shadow-orange/25 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
