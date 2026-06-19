import { useState } from 'react';

const faqs = [
  {
    question: 'What is FaithWall?',
    answer: "FaithWall is a free iOS app that displays daily Bible verses on your iPhone lock screen using wallpapers and widgets. It requires iOS 16.0 or later.",
  },
  {
    question: 'How does FaithWall work?',
    answer: "FaithWall installs a Scripture wallpaper or rotating verse widget on your iPhone lock screen using iOS Focus modes. You pick a verse pack — Anxiety, Strength, Gratitude, Psalms — and FaithWall surfaces a fresh verse each day. Setup takes about 60 seconds.",
  },
  {
    question: 'Is FaithWall free?',
    answer: "Yes. FaithWall is free to download and includes the core daily verse and lock-screen widgets. Optional premium plans unlock unlimited verse packs and customization — the price, billing period, and any free trial are shown in the App Store at checkout, in your local currency.",
  },
  {
    question: 'Which iPhones does FaithWall work on?',
    answer: "FaithWall supports iPhones running iOS 16.0 or later. It uses iOS lock-screen widgets and Focus modes, both available on all compatible iPhone models from iPhone XS onward.",
  },
  {
    question: 'Is my data private?',
    answer: "Yes. FaithWall does not require an account and your verse selections stay on your device. Payment data, if you upgrade to a premium plan, is handled by RevenueCat — FaithWall never sees your card details.",
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
              className={`rounded-3xl overflow-hidden bg-gradient-to-br from-surface-card to-surface-elevated border-2 transition-all duration-300 ${
                openIndex === index ? 'border-brand/40' : 'border-brand/20'
              }`}
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
