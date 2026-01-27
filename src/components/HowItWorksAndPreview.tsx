import { useState } from 'react';
import { motion } from 'framer-motion';

const steps = [
    {
        number: '01',
        title: 'Download',
        description: 'Get FaithWall free from the App Store. No sign-up or account needed.',
    },
    {
        number: '02',
        title: 'Personalize',
        description: 'Add your favorite verses, prayers, or daily affirmations.',
    },
    {
        number: '03',
        title: 'Transform',
        description: 'Your lock screen becomes a daily source of faith and peace.',
    },
];

const screenshots = [
    {
        id: 1,
        title: 'Lock Screen Scripture',
        image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=400',
        quote: '"Trust in the Lord with all your heart and lean not on your own understanding."',
        sub: 'Proverbs 3:5'
    },
    {
        id: 2,
        title: 'Beautiful Wallpapers',
        image: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=400',
        quote: '"Be clear in your mind about what is good."',
        sub: 'Romans 12:21'
    },
    {
        id: 3,
        title: 'Nature & Faith',
        image: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=400',
        quote: '"The heavens declare the glory of God."',
        sub: 'Psalm 19:1'
    },
    {
        id: 4,
        title: 'Peaceful Moments',
        image: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=400',
        quote: '"Peace I leave with you; my peace I give you."',
        sub: 'John 14:27'
    },
];

export default function HowItWorksAndPreview() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section id="how-it-works" className="section-space relative bg-surface-elevated overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container-main relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* LEFT COLUMN: How It Works */}
                    <div className="space-y-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="text-brand font-medium mb-3 tracking-wide uppercase text-sm">How It Works</p>
                            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                                Set up in under
                                <br />
                                <span className="text-white/40">2 minutes</span>
                            </h2>
                        </motion.div>

                        <div className="space-y-12 relative">
                            {/* Vertical Connector Line */}
                            <div className="absolute top-4 bottom-4 left-[2.5rem] w-px bg-gradient-to-b from-brand/30 via-brand/10 to-transparent hidden sm:block" />

                            {steps.map((step, i) => (
                                <motion.div
                                    key={step.number}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2, duration: 0.6 }}
                                    className="relative flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center group"
                                >
                                    {/* Number Badge */}
                                    <div className="relative z-10 flex-shrink-0 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-surface-elevated border border-white/10 shadow-xl group-hover:border-brand/40 transition-colors duration-300">
                                        <span className="text-3xl font-bold text-brand">{step.number}</span>
                                        <div className="absolute inset-0 rounded-3xl bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    <div className="pt-2 sm:pt-0">
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-light transition-colors">
                                            {step.title}
                                        </h3>
                                        <p className="text-lg text-white/60 leading-relaxed max-w-sm">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Preview */}
                    <div className="relative pt-8 lg:pt-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className=""
                        >
                            <div className="text-center mb-8">
                                <p className="text-brand font-medium tracking-wide uppercase text-xs mb-2">Preview</p>
                                <h3 className="text-2xl font-bold text-white">See it in action</h3>
                            </div>

                            <div className="flex flex-col items-center">
                                {/* Phone Frame */}
                                <div className="relative w-[240px] sm:w-[260px] shadow-2xl mb-8">
                                    <div className="bg-surface rounded-[2.5rem] p-2 border-2 border-surface-border ring-1 ring-white/10">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-surface rounded-b-xl z-20" />

                                        <div className="relative rounded-[2rem] overflow-hidden aspect-[9/19.5] bg-surface-elevated">
                                            <motion.img
                                                key={activeIndex}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.4 }}
                                                src={screenshots[activeIndex].image}
                                                alt={screenshots[activeIndex].title}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

                                            {/* Lock Screen Content */}
                                            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 pb-20 text-center z-10">
                                                <motion.div
                                                    key={`text-${activeIndex}`}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg"
                                                >
                                                    <p className="text-white text-xs font-medium leading-relaxed drop-shadow-md">
                                                        {screenshots[activeIndex].quote}
                                                    </p>
                                                    <p className="text-white/80 text-[10px] mt-2 font-bold uppercase tracking-widest">
                                                        {screenshots[activeIndex].sub}
                                                    </p>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Selector Buttons */}
                                <div className="flex flex-wrap justify-center gap-3">
                                    {screenshots.map((screenshot, index) => (
                                        <button
                                            key={screenshot.id}
                                            onClick={() => setActiveIndex(index)}
                                            className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 ${index === activeIndex
                                                ? 'border-brand scale-110 shadow-brand/20 shadow-lg'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img
                                                src={screenshot.image}
                                                alt={screenshot.title}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
