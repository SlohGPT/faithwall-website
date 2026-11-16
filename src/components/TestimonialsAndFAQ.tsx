import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { homeFaq } from '../data/homeFaq';

export default function TestimonialsAndFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="testimonials-faq" className="section-space bg-surface">
            <div className="container-main">
                <div id="faq" className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                        className="mb-12 text-center"
                    >
                        <p className="text-brand font-medium mb-3 tracking-wide uppercase text-sm">FAQ</p>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                            Common questions
                        </h2>
                    </motion.div>

                    <div className="space-y-3">
                        {homeFaq.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className={`rounded-2xl overflow-hidden bg-surface-card border transition-colors duration-300 ${openIndex === index ? 'border-brand/40 bg-surface-elevated' : 'border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-5 text-left group"
                                    aria-expanded={openIndex === index}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    <span className={`font-medium pr-4 transition-colors ${openIndex === index ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                                        {faq.q}
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
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <p className="px-5 pb-6 text-white/60 leading-relaxed text-base">
                                        {faq.a}
                                        {faq.link && (
                                            <>
                                                {' '}
                                                <Link to={faq.link.to} className="text-brand hover:text-brand-light underline underline-offset-2">
                                                    {faq.link.text}
                                                </Link>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
