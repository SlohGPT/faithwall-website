import { useState } from 'react';

const screenshots = [
  {
    id: 1,
    title: 'Lock Screen Scripture',
    image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 2,
    title: 'Beautiful Wallpapers',
    image: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 3,
    title: 'Nature & Faith',
    image: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 4,
    title: 'Peaceful Moments',
    image: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function AppShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="section-space bg-surface-elevated">
      <div className="container-main">
        <div className="text-center mb-12">
          <p className="text-brand font-medium mb-3 tracking-wide uppercase text-sm">Preview</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            See it in action
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="relative w-[240px] sm:w-[280px]">
              <div className="bg-surface rounded-[2.5rem] p-2 border border-surface-border">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-surface rounded-b-2xl z-10" />
                <div className="relative rounded-[2rem] overflow-hidden aspect-[9/19.5]">
                  <img
                    src={screenshots[activeIndex].image}
                    alt={screenshots[activeIndex].title}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <p className="text-white text-sm leading-relaxed">
                          "Trust in the Lord with all your heart and lean not on your own understanding."
                        </p>
                        <p className="text-brand-light text-xs mt-2 font-medium">
                          Proverbs 3:5
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            {screenshots.map((screenshot, index) => (
              <button
                key={screenshot.id}
                onClick={() => setActiveIndex(index)}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  index === activeIndex
                    ? 'border-brand scale-110'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={screenshot.image}
                  alt={screenshot.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
