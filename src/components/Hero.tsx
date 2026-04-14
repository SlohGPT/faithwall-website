import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AppStoreButton from './AppStoreButton';

const slides = [1, 2, 3, 4, 5];
const images = slides.map(i => `/assets/slideshow/slide${i}.webp`);
const avifImages = slides.map(i => `/assets/slideshow/slide${i}.avif`);

const avatars = [
  '/assets/avatars/avatar-1.jpg',
  '/assets/avatars/avatar-2.jpg',
  '/assets/avatars/avatar-3.jpg',
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

// Smooth spring transition for card stack
const cardTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 30,
  mass: 1,
};

export default function Hero() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
  }, []);

  // Auto-play logic
  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
    resetTimer();
  }, [resetTimer]);

  const prevSlide = useCallback(() => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
    resetTimer();
  }, [resetTimer]);

  const goToSlide = useCallback((i: number) => {
    setIndex(i);
    resetTimer();
  }, [resetTimer]);

  return (
    <section className="relative min-h-screen bg-surface overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Static ambient glow - no GPU-heavy animations */}
        <div className="hidden md:block">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[100px] animate-[pulse_20s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-brand/3 rounded-full blur-[100px] animate-[pulse_15s_ease-in-out_infinite_2s]" />
        </div>
        <div className="md:hidden absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[400px] bg-brand/5 rounded-full blur-[80px]" />
      </div>

      <div className="container-main relative pt-32 md:pt-40 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left lg:-translate-y-32"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-4 px-5 py-3 rounded-full bg-surface-card border-2 border-brand/30 mb-8">
              <div className="flex -space-x-2">
                {avatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-surface-card object-cover ring-1 ring-brand/20"
                    loading="lazy"
                  />
                ))}
              </div>
              <span className="text-base text-white/70 font-medium">Trusted by 10,000+ believers</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Daily Scripture
              <br />
              <span className="text-white/40">On Your Lock Screen</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-white/60 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              Meet FaithWall, the app that transforms your iPhone lock screen into a daily moment with God.
            </motion.p>

            {/* Desktop buttons - hidden on mobile */}
            <motion.div variants={itemVariants} className="hidden lg:flex flex-row gap-4 justify-start items-center">
              <AppStoreButton href="https://apps.apple.com/us/app/lock-screen-bible-verse/id6756815070" />
              <a
                href="https://apps.apple.com/us/app/lock-screen-bible-verse/id6756815070"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 h-[52px] text-base font-bold text-white transition-all duration-200 bg-brand rounded-xl hover:bg-brand-light hover:scale-105"
              >
                Get Started
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative flex flex-col items-center justify-center lg:items-end"
          >
            <div className="w-full max-w-[500px] flex flex-col items-center gap-8">
              <div className="relative w-full flex items-center justify-center">

                {/* Left Arrow */}
                <button
                  onClick={prevSlide}
                  className="absolute left-0 z-30 p-2 rounded-full bg-surface-card/70 backdrop-blur-sm border border-white/10 hover:bg-surface-card transition-colors text-white/80 hover:text-white"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="relative w-[280px] sm:w-[320px] aspect-[9/19] flex items-center justify-center pointer-events-none">
                  <div className="absolute -inset-12 bg-gradient-to-br from-brand/8 via-brand/3 to-transparent rounded-full blur-[100px]" />

                  {/* Slideshow */}
                  {images.map((src, i) => {
                    const diff = (i - index + images.length) % images.length;
                    const altTexts = [
                      'FaithWall lock screen showing Deuteronomy 31:6 scripture on iPhone',
                      'FaithWall widget and wallpaper setup options on iPhone',
                      'FaithWall user reviews and testimonials from believers',
                      'FaithWall Bible verse explorer with Old and New Testament books',
                      'FaithWall customization with fonts and color options',
                    ];

                    let style: any = {};
                    if (diff === 0) {
                      style = { scale: 1, rotate: 0, opacity: 1, x: 0, zIndex: 10 };
                    } else if (diff === 1) {
                      style = { scale: 0.93, rotate: 5, opacity: 0.7, x: 28, zIndex: 5 };
                    } else if (diff === 2) {
                      style = { scale: 0.86, rotate: -5, opacity: 0.4, x: -28, zIndex: 3 };
                    } else {
                      style = { scale: 0.8, rotate: 0, opacity: 0, x: 0, zIndex: 1 };
                    }

                    return (
                      <motion.div
                        key={i}
                        className="absolute w-full h-full rounded-[2.5rem] border-4 border-surface-card shadow-2xl overflow-hidden"
                        style={{ willChange: 'transform, opacity' }}
                        initial={false}
                        animate={style}
                        transition={cardTransition}
                      >
                        <picture>
                          <source srcSet={avifImages[i]} type="image/avif" />
                          <source srcSet={src} type="image/webp" />
                          <img
                            src={src}
                            alt={altTexts[i]}
                            width={1284}
                            height={2778}
                            className="w-full h-full object-cover"
                            loading={i === 0 ? "eager" : "lazy"}
                            decoding="async"
                            {...(i === 0 ? { fetchPriority: "high" as const } : {})}
                          />
                        </picture>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={nextSlide}
                  className="absolute right-0 z-30 p-2 rounded-full bg-surface-card/70 backdrop-blur-sm border border-white/10 hover:bg-surface-card transition-colors text-white/80 hover:text-white"
                  aria-label="Next slide"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Dots */}
              <div className="flex gap-2 z-30">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === index
                      ? 'bg-brand w-8'
                      : 'bg-white/20 hover:bg-white/40'
                      }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Mobile buttons - below slideshow, side by side */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex lg:hidden flex-row gap-3 justify-center items-center w-full mt-4"
              >
                <AppStoreButton href="https://apps.apple.com/us/app/lock-screen-bible-verse/id6756815070" />
                <a
                  href="https://apps.apple.com/us/app/lock-screen-bible-verse/id6756815070"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 h-[52px] text-base font-bold text-white transition-all duration-200 bg-brand rounded-xl hover:bg-brand-light hover:scale-105"
                >
                  Get Started
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
