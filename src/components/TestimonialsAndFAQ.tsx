import { useState } from 'react';
import { Link } from 'react-router-dom';
import { homeFaq } from '../data/homeFaq';
import CrossPattern from './ui/CrossPattern';
import GlassCard from './ui/GlassCard';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';

export default function TestimonialsAndFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="testimonials-faq" className="section-space relative overflow-hidden bg-surface">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-brand/[0.04] blur-[100px]" />
                <CrossPattern focus="50% 10%" opacity={0.04} />
            </div>

            <div className="container-main relative">
                <div id="faq" className="mx-auto max-w-3xl">
                    <SectionHeading eyebrow="FAQ" title="Common questions" align="center" className="mb-12" />

                    <div className="space-y-3">
                        {homeFaq.map((faq, index) => {
                            const open = openIndex === index;
                            return (
                                <Reveal key={index} delay={Math.min(index, 4) * 0.05} y={10}>
                                    <GlassCard
                                        className={`overflow-hidden !rounded-2xl transition-colors duration-300 ${
                                            open ? '!border-brand/40 !bg-white/[0.05]' : 'hover:!border-white/15'
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenIndex(open ? null : index)}
                                            className="group flex min-h-[3.5rem] w-full items-center justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
                                            aria-expanded={open}
                                            aria-controls={`faq-answer-${index}`}
                                        >
                                            <span className={`font-medium transition-colors ${open ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                                                {faq.q}
                                            </span>
                                            <span
                                                aria-hidden="true"
                                                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 motion-reduce:transition-none ${
                                                    open ? 'rotate-45 bg-brand text-surface' : 'bg-white/[0.06] text-white/50 group-hover:bg-white/10 group-hover:text-white'
                                                }`}
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </span>
                                        </button>
                                        <div
                                            id={`faq-answer-${index}`}
                                            role="region"
                                            className="grid motion-reduce:!transition-none"
                                            style={{
                                                gridTemplateRows: open ? '1fr' : '0fr',
                                                opacity: open ? 1 : 0,
                                                visibility: open ? 'visible' : 'hidden',
                                                transition: `grid-template-rows 300ms ease, opacity 300ms ease, visibility 0s linear ${open ? '0s' : '300ms'}`,
                                            }}
                                        >
                                            <div className="min-h-0 overflow-hidden">
                                                <p className="px-5 pb-6 text-base leading-relaxed text-white/60">
                                                    {faq.a}
                                                    {faq.link && (
                                                        <>
                                                            {' '}
                                                            <Link to={faq.link.to} className="text-brand underline underline-offset-2 hover:text-brand-light">
                                                                {faq.link.text}
                                                            </Link>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
