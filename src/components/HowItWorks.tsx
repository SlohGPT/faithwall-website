import { Download, Edit3, Sparkles } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const steps = [
  {
    icon: Download,
    number: '01',
    title: 'Download & Open',
    description: 'Get FaithWall free from the App Store. No sign-up needed.',
  },
  {
    icon: Edit3,
    number: '02',
    title: 'Add Your Inspirations',
    description: 'Enter your favorite verses, prayers, or daily affirmations.',
  },
  {
    icon: Sparkles,
    number: '03',
    title: 'Enjoy Daily Inspiration',
    description: 'Your lock screen transforms into a source of faith and peace.',
  },
];

export default function HowItWorks() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section id="how-it-works" className="section-padding bg-cream-light relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-orange" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-orange" />
      </div>

      <div className="container-custom relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Set Up in{' '}
            <span className="text-gradient-orange">Under 2 Minutes</span>
          </h2>
          <p className="text-lg text-text-secondary">
            It's easier than you think
          </p>
        </div>

        <div ref={ref} className="relative max-w-4xl mx-auto">
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[80%] h-0.5 bg-gradient-to-r from-transparent via-orange/30 to-transparent hidden lg:block" />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative text-center ${
                  inView ? 'animate-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center mx-auto relative z-10">
                    <step.icon className="w-8 h-8 text-orange" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-orange flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
