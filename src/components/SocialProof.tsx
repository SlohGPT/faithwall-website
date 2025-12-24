import { Users, Star, Award } from 'lucide-react';

const stats = [
  { icon: Users, value: '10,000+', label: 'Active Users' },
  { icon: Star, value: '500+', label: '5-Star Reviews' },
  { icon: Award, value: 'Featured', label: 'Christian App Store' },
];

export default function SocialProof() {
  return (
    <section className="bg-white border-y border-cream-dark">
      <div className="container-custom section-padding !py-8">
        <p className="text-center text-text-secondary text-sm mb-6">
          Trusted by believers worldwide
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="font-semibold text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-secondary">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
