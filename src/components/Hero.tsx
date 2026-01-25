import { useState, useEffect, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AppStoreButton from './AppStoreButton';

const images = [
  '/assets/slideshow/slide1.png',
  '/assets/slideshow/slide2.png',
  '/assets/slideshow/slide3.png',
  '/assets/slideshow/slide4.png',
];

const avatars = [
  'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=100',
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

export default function Hero() {
  const [index, setIndex] = useState(0);

  // Auto-play logic
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [index]); // Reset timer when index changes manually

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, []);

  const prevSlide = useCallback(() => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, []);

  const goToSlide = (i: number) => {
    setIndex(i);
  };

  return (
    <section className="relative min-h-screen bg-surface overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -60, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-brand/3 rounded-full blur-[130px]"
        />
      </div>

      <div className="container-main relative pt-40 md:pt-48 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-4 px-5 py-3 rounded-full bg-surface-card border-2 border-brand/30 mb-8">
              <div className="flex -space-x-2">
                {avatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-surface-card object-cover ring-1 ring-brand/20"
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

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <AppStoreButton href="https://apple.co/3NBwVwp" />
              <a
                href="https://apple.co/3NBwVwp"
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
                  className="absolute left-0 z-30 p-2 rounded-full bg-surface-card/50 backdrop-blur-md border border-white/10 hover:bg-surface-card transition-colors text-white/80 hover:text-white"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="relative w-[280px] sm:w-[320px] aspect-[9/19] flex items-center justify-center pointer-events-none">
                  <div className="absolute -inset-12 bg-gradient-to-br from-brand/8 via-brand/3 to-transparent rounded-full blur-[100px]" />

                  {/* Slideshow */}
                  {images.map((src, i) => {
                    const diff = (i - index + images.length) % images.length;

                    // 0: Active (Front)
                    // 1: Second (Right, Behind)
                    // 2: Third (Left, Behind)
                    // 3: Exiting/Hidden (Deep back)

                    let style: any = {};
                    if (diff === 0) {
                      style = { scale: 1, rotate: 0, opacity: 1, x: 0, y: 0, zIndex: 10 };
                    } else if (diff === 1) {
                      style = { scale: 0.92, rotate: 6, opacity: 0.8, x: 30, y: 0, zIndex: 5 };
                    } else if (diff === 2) {
                      style = { scale: 0.84, rotate: -6, opacity: 0.5, x: -30, y: 0, zIndex: 3 };
                    } else {
                      style = { scale: 0.8, rotate: 0, opacity: 0, x: 0, y: 0, zIndex: 20 };
                    }

                    return (
                      <motion.img
                        key={i}
                        src={src}
                        alt={`App screenshot ${i + 1}`}
                        className="absolute w-full h-full object-cover rounded-[2.5rem] border-4 border-surface-card shadow-2xl"
                        initial={false}
                        animate={style}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      />
                    );
                  })}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={nextSlide}
                  className="absolute right-0 z-30 p-2 rounded-full bg-surface-card/50 backdrop-blur-md border border-white/10 hover:bg-surface-card transition-colors text-white/80 hover:text-white"
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
