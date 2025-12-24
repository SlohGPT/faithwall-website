import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const faqs = [
  {
    question: 'Is FaithWall really free?',
    answer: "Yes! The free version includes everything you need to get started. We offer a Pro version for power users who want unlimited notes and premium features.",
  },
  {
    question: 'Does it work on my iPhone?',
    answer: "FaithWall works on iPhone running iOS 16 or later. We use Apple's latest lock screen and widget features.",
  },
  {
    question: 'Is my data private?',
    answer: "Absolutely. Your prayers and notes stay on your device. We don't have accounts, we don't collect data, and we never will. Your faith journey is personal.",
  },
  {
    question: 'How do I set up the lock screen?',
    answer: "Our simple 2-minute setup guide walks you through everything. It uses Apple's built-in Shortcuts app - no technical knowledge needed!",
  },
  {
    question: 'Can I use my own photos?',
    answer: 'Yes! Pro users can use any photo as their background. Free users can choose from our beautiful preset collection.',
  },
  {
    question: 'Is there an Android version?',
    answer: "Not yet, but it's on our roadmap! Sign up for our newsletter to be notified when it launches.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section id="faq" className="section-padding bg-cream-light">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Common{' '}
            <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="text-lg text-text-secondary">
            Everything you need to know about FaithWall
          </p>
        </div>

        <div ref={ref} className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm ${
                inView ? 'animate-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-cream/50 transition-colors"
              >
                <span className={`font-semibold pr-4 ${openIndex === index ? 'text-gold' : 'text-text-primary'}`}>
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  openIndex === index ? 'bg-gold text-white' : 'bg-cream text-text-secondary'
                }`}>
                  {openIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-6 text-text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
