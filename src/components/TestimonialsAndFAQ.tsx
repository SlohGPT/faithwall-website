import { useState } from 'react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        quote: "FaithWall has transformed my morning routine. Instead of checking social media, I start with God's word.",
        author: 'Sarah M.',
        role: 'First Waitlist Member',
        image: '/assets/avatars/avatar-4.jpg',
    },
    {
        quote: "As a busy mom, I needed something simple. Every time I check my phone, I'm reminded of God's promises.",
        author: 'Rachel K.',
        role: 'First Waitlist Member',
        image: '/assets/avatars/avatar-5.jpg',
    },
    {
        quote: "I've tried many devotional apps, but this is different. It meets me where I am - on my lock screen.",
        author: 'David L.',
        role: 'First Waitlist Member',
        image: '/assets/avatars/avatar-6.jpg',
    },
];

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
        answer: "Yes. FaithWall is free to download and includes the core daily verse and lock-screen widgets. Premium plans for unlimited verse packs and customization are $1.99 per month or $8.99 per year.",
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
                                                className="w-full h-12 rounded-full object-cover ring-2 ring-brand/20"
                                                loading="lazy"
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
                    <div id="faq">
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
                                        aria-expanded={openIndex === index}
                                        aria-controls={`faq-answer-${index}`}
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
                                        id={`faq-answer-${index}`}
                                        role="region"
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
