import { useState } from 'react';
import { motion } from 'framer-motion';

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

export default function TestimonialsAndFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="testimonials-faq" className="section-space bg-surface">
            <div className="container-main">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* LEFT COLUMN: Testimonials */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="mb-12 text-center lg:text-left"
                        >
                            <p className="text-brand font-medium mb-3 tracking-wide uppercase text-sm">Testimonials</p>
                            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                                Loved by believers
                                <br />
                                <span className="text-white/40">everywhere</span>
                            </h2>
                        </motion.div>

                        <div className="space-y-6">
                            {testimonials.map((testimonial, i) => (
                                <motion.div
                                    key={testimonial.author}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className="rounded-3xl p-6 bg-gradient-to-br from-surface-card to-surface-elevated border border-white/5 hover:border-brand/20 transition-all duration-300"
                                >
                                    <p className="text-white/80 leading-relaxed mb-6 text-lg italic">
                                        "{testimonial.quote}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.author}
                                                className="w-12 h-12 rounded-full object-cover ring-2 ring-brand/20"
                                            />
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">
                                                {testimonial.author}
                                            </p>
                                            <p className="text-xs font-medium text-brand-light/80 uppercase tracking-wide">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: FAQ */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="mb-12 text-center lg:text-left"
                        >
                            <p className="text-brand font-medium mb-3 tracking-wide uppercase text-sm">FAQ</p>
                            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                                Common questions
                            </h2>
                        </motion.div>

                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className={`rounded-2xl overflow-hidden bg-surface-card border transition-all duration-300 ${openIndex === index ? 'border-brand/40 bg-surface-elevated' : 'border-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full flex items-center justify-between p-5 text-left group"
                                    >
                                        <span className={`font-medium pr-4 transition-colors ${openIndex === index ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                                            {faq.question}
                                        </span>
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-brand text-white rotate-45' : 'bg-surface text-white/40 group-hover:bg-surface-elevated group-hover:text-white'
                                            }`}>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <p className="px-5 pb-6 text-white/60 leading-relaxed text-sm lg:text-base">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
