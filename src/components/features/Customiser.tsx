import { useState } from 'react';
import { SHOWCASE_VERSES } from '../../data/showcaseVerses';
import AppLockScreen from '../showcase/AppLockScreen';
import { APP_PRESETS, APP_TEXT_COLORS } from '../showcase/Wallpaper';

const BG_IDS = ['faithwall', 'ocean-blue', 'lavender-purple', 'forest-green', 'midnight-blue', 'sunset-orange'];
const BACKGROUNDS = BG_IDS.map((id) => APP_PRESETS.find((p) => p.id === id)!);
const TEXT_IDS = ['white', 'gold', 'sky'];
const TEXTS = TEXT_IDS.map((id) => APP_TEXT_COLORS.find((c) => c.id === id)!);

const BUTTON =
  'grid h-11 w-11 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[#101016] sm:h-9 sm:w-9';
const DOT = 'block h-7 w-7 rounded-full border border-white/25 sm:h-6 sm:w-6';

/** A small working version of the wallpaper maker: pick a background and a text colour, the preview follows. */
export default function Customiser() {
  const [bg, setBg] = useState('faithwall');
  const [text, setText] = useState('white');
  const textColor = TEXTS.find((t) => t.id === text)!.color;
  const mask = 'linear-gradient(to bottom, #000 68%, transparent 100%)';

  return (
    <div className="absolute inset-0 flex items-start justify-center gap-4 px-5 pt-6 sm:gap-5">
      <div
        aria-hidden="true"
        className="w-[96px] flex-none sm:w-[108px]"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
      >
        <AppLockScreen verse={SHOWCASE_VERSES[0]} wallpaper={bg} textColor={textColor} fade={350} />
      </div>
      <div className="flex min-w-0 flex-col gap-3 pt-1">
        <div role="group" aria-labelledby="cust-bg">
          <p id="cust-bg" className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/45">
            Background
          </p>
          <div className="grid grid-cols-3 gap-x-1 gap-y-0.5">
            {BACKGROUNDS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-label={p.name}
                aria-pressed={bg === p.id}
                onClick={() => setBg(p.id)}
                className={BUTTON}
              >
                <span
                  className={`${DOT} ${bg === p.id ? 'shadow-[0_0_0_2px_#101016,0_0_0_4px_#fff]' : ''}`}
                  style={{ background: `linear-gradient(180deg, ${p.from}, ${p.to})` }}
                />
              </button>
            ))}
          </div>
        </div>
        <div role="group" aria-labelledby="cust-text">
          <p id="cust-text" className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/45">
            Text
          </p>
          <div className="flex gap-1">
            {TEXTS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-label={c.name}
                aria-pressed={text === c.id}
                onClick={() => setText(c.id)}
                className={BUTTON}
              >
                <span
                  className={`${DOT} ${text === c.id ? 'shadow-[0_0_0_2px_#101016,0_0_0_4px_#fff]' : ''}`}
                  style={{ background: c.color }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
