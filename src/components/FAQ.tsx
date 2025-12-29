import { useState } from 'react';

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
    answer: "Absolutely. Your prayers and notes stay on your device. We don't have accounts, we don't collect data, and we never will.",
  },
  {
    question: 'How do I set up the lock screen?',
    answer: "Our simple 2-minute setup guide walks you through everything. It uses Apple's built-in Shortcuts app - no technical knowledge needed!",
  },
  {
    question: 'Can I use my own photos?',
    answer: 'Yes! Pro users can use any photo as their background. Free users can choose from our beautiful preset collection.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-space bg-surface">
      <div className="container-main">
        <div className="text-center mb-16">
          <p className="text-brand font-medium mb-3 tracking-wide uppercase text-sm">FAQ</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Common questions
          </h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="card-gradient overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className={`font-medium pr-4 ${openIndex === index ? 'text-white' : 'text-white/80'}`}>
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  openIndex === index ? 'bg-brand text-white rotate-45' : 'bg-surface-card text-white/60'
                }`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <p className="px-5 pb-5 text-white/60 leading-relaxed">
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
