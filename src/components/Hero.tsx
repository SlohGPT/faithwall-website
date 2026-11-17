import { useEffect, useState } from 'react';
import { BookOpen, ChevronRight, Languages, Smartphone } from 'lucide-react';
import AppStoreButton, { CTA_BUTTON_CLASS } from './AppStoreButton';
import { RatingLine } from './AppNudge';
import { appStoreUrl } from '../lib/appStore';
import facts from '../data/facts.json';
import { SHOWCASE_VERSES } from '../data/showcaseVerses';
import AppLockScreen from './showcase/AppLockScreen';
import HomeScreenPhone from './showcase/HomeScreen';
import { useMediaQuery, usePageVisible, usePrefersReducedMotion } from './showcase/utils';
import CrossPattern from './ui/CrossPattern';

/*
 * Layout. Two modes, chosen in CSS only (no JS, so the prerendered HTML is the final layout):
 *
 *  - "wide" (>= 1024px wide AND landscape-ish, aspect >= 1.1): text left, phones right, the hero is exactly one
 *    viewport tall (svh) with the content centred in the space under the fixed nav. The stage height --H comes
 *    from the viewport height (and is width-limited so the text column is never squeezed), so the whole front
 *    phone is always visible.
 *  - "stacked" (phones, portrait tablets, narrow windows): text first, phones underneath. The stage takes the
 *    rest of the first screen (flex:1) and clips the phone at its bottom edge with a fade, so the top of the
 *    phone peeks in under the CTA (or shows whole when the screen is tall enough).
 *
 * Everything in the stage is sized from --H (stage height): front phone width .412 H (height .86 H, from
 * DeviceMockup's real aspect: screen 93.2 cqw wide x 202.0 tall + 6.8 frame = W/H 0.479), back phone .36 H.
 * Nav bottom edge measured in the browser (see report): 68px below 768px, 80px at md, 92px from 1024px,
 * plus env(safe-area-inset-top) and the browser URL-bar inset.
 */
const HERO_CSS = `
.hero{--svh:1vh;--inset:calc(env(safe-area-inset-top,0px) + var(--browser-top-inset,0px));--nav:calc(4.25rem + var(--inset));--gap:clamp(.875rem,calc(var(--svh)*2.4),1.25rem)}
@supports (height:1svh){.hero{--svh:1svh}}
@media (min-width:768px){.hero{--nav:calc(5rem + var(--inset));--gap:clamp(1rem,calc(var(--svh)*2.4),1.5rem)}}
@media (min-width:1024px){.hero{--nav:calc(5.75rem + var(--inset))}}

.hero-fold{display:flex;flex-direction:column;min-height:calc(var(--svh)*100);padding-top:calc(var(--nav) + .75rem)}
.hero-text{text-align:center}
.hero-text > * + *{margin-top:var(--gap)}
.hero-h1{font-size:clamp(1.9rem,8vw,2.75rem);line-height:1.1}
.hero-sub{font-size:1rem;line-height:1.55;margin-inline:auto}
.hero-ctas{justify-content:center}
.hero-rating{justify-content:center}

.hero-stage{--H:calc(clamp(14rem,66vw,18rem)/.412);position:relative;flex:1 1 0;min-height:9rem;margin-top:var(--gap);overflow:hidden;container-type:size}
.hero-comp{position:absolute;top:0;left:50%;width:calc(var(--H)*.412);height:var(--H);transform:translateX(-50%)}
.hero-front{position:absolute;z-index:20;right:0;top:calc(var(--H)*.03);width:calc(var(--H)*.412)}
.hero-back{position:absolute;z-index:10;left:0;top:calc(var(--H)*.14);width:calc(var(--H)*.36);transform:rotate(-6deg);display:none}
.hero-back-dim{filter:brightness(.86)}
.hero-label{display:none;position:absolute;z-index:30;font-size:clamp(.625rem,calc(var(--H)*.0185),.8125rem);line-height:1.3;white-space:nowrap;padding:.5em .85em;border-radius:.9em;border:1px solid rgba(255,255,255,.12);background:rgba(20,20,28,.88);box-shadow:0 12px 30px -10px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.06)}
.hero-label-widget{left:0;top:0}
.hero-label-lock{right:calc(var(--H)*.206);top:0;transform:translateX(50%)}
.hero-chips{display:none}
.hero-chip{display:inline-flex;align-items:center;gap:.55em;font-size:clamp(.75rem,calc(var(--H)*.0195),.9rem);font-weight:600;line-height:1;white-space:nowrap;color:rgba(255,255,255,.92);padding:.45em 1.05em .45em .5em;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(20,20,28,.9);box-shadow:0 12px 30px -10px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.07)}
.hero-chip-ico{display:inline-flex;align-items:center;justify-content:center;width:1.8em;height:1.8em;border-radius:999px;background:rgba(217,123,59,.2);color:#eea36b}
.hero-chip-ico svg{width:1em;height:1em}
.hero-fade{position:absolute;z-index:25;inset-inline:0;bottom:0;height:4.5rem;pointer-events:none}

@media (min-width:768px){
  .hero-text{padding-inline:1rem}
  .hero-h1{font-size:clamp(2.75rem,1.4rem + 3.4vw,3.5rem)}
  .hero-sub{font-size:1.125rem}
  .hero-stage{--H:clamp(34rem,calc(100cqh - .5rem),50rem);min-height:18rem}
  .hero-comp{width:calc(var(--H)*.75)}
  .hero-front{top:calc(var(--H)*.09)}
  .hero-back{display:block}
  .hero-label{display:block}
}

@media (min-width:1024px) and (min-aspect-ratio:11/10){
  .hero-fold{flex-direction:row;align-items:center;justify-content:space-between;gap:clamp(2rem,3.5vw,4rem);padding-top:calc(var(--nav) + 1rem);padding-bottom:1.5rem}
  .hero-text{flex:1 1 0;min-width:0;padding-inline:0;text-align:left;container-type:inline-size}
  .hero-h1{font-size:max(2.25rem,min(8.4cqw,calc(var(--svh)*6.4),4.5rem))}
  .hero-sub{font-size:clamp(1rem,calc(.55rem + .55vw + var(--svh)*.4),1.3rem);margin-inline:0}
  .hero-ctas,.hero-rating{justify-content:flex-start}
  .hero-stage{--H:clamp(30rem,min(calc(var(--svh)*100 - var(--nav) - 2.5rem),calc(min(100vw,1600px)*.52)),49rem);flex:none;width:calc(var(--H)*.75);height:var(--H);min-height:0;margin-top:0;overflow:visible;container-type:normal}
  .hero-comp{inset:0;left:0;width:100%;height:100%;transform:none}
  .hero-fade{display:none}
}

/* the chip row needs room under the phones: tall enough viewports only */
@media (min-width:1024px) and (min-aspect-ratio:11/10) and (min-height:781px){
  .hero-chips{display:flex;position:absolute;z-index:30;left:0;right:0;bottom:calc(var(--H)*-.025);justify-content:space-between;gap:.5rem}
}
`;

// Widget demo loop: the Home Screen widget starts with the user's verse (Day 1 = the Lock Screen verse), then shows
// the next verses one at a time. First render (server and client) is day 1, verse 0.
const LOOP_MS = 4000;

const AVATARS = ['/assets/avatars/avatar-1-72.webp', '/assets/avatars/avatar-2-72.webp', '/assets/avatars/avatar-3-72.webp'];

function useWidgetLoop() {
  const reduced = usePrefersReducedMotion();
  const backShown = useMediaQuery('(min-width: 768px)');
  const visible = usePageVisible();
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);

  const running = backShown && visible && !reduced && !paused;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SHOWCASE_VERSES.length), LOOP_MS);
    return () => clearInterval(id);
  }, [running]);

  // Reduced motion: back to the static first state.
  useEffect(() => {
    if (reduced) setIndex(0);
  }, [reduced]);

  return { index, setPaused };
}

function DayCounter({ index }: { index: number }) {
  return (
    <span className="grid" aria-hidden="true">
      {SHOWCASE_VERSES.map((_, i) => (
        <span
          key={i}
          className="col-start-1 row-start-1 text-brand transition-opacity duration-500"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          {`Day ${i + 1} · ${i === 0 ? 'your verse' : 'next verse'}`}
        </span>
      ))}
    </span>
  );
}

function PhoneStage() {
  const { index, setPaused } = useWidgetLoop();
  const lockVerse = SHOWCASE_VERSES[0];

  return (
    <div
      role="img"
      aria-label="FaithWall example: an iPhone Lock Screen with a chosen Bible verse, and a Home Screen widget that shows your verse (it can rotate fresh verses if you turn on Auto-rotate verses)"
      className="hero-stage animate-fade-in-slide"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="hero-comp">
        {/* soft brand glow behind the phones */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[115%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(closest-side,rgba(217,123,59,0.22),rgba(217,123,59,0.07) 58%,transparent)' }}
        />

        {/* back phone: Home Screen with the medium widget (tablet width and up) */}
        <div className="hero-back" data-hero-back>
          <div className="hero-back-dim">
            <HomeScreenPhone verse={SHOWCASE_VERSES[index]} wallpaper="dawn" />
          </div>
        </div>

        {/* front phone: Lock Screen. The wallpaper is one verse the user picks, so it never changes here. */}
        <div className="hero-front" data-hero-front>
          <AppLockScreen verse={lockVerse} wallpaper="dawn" />
        </div>

        <div aria-hidden="true" className="hero-label hero-label-widget text-white/90">
          <div>
            <span className="font-semibold text-white">Widget</span>
            <span className="text-white/40">{' · '}</span>
            <span className="text-white/70">Auto-rotate verses on</span>
          </div>
          <DayCounter index={index} />
        </div>
        <div aria-hidden="true" className="hero-label hero-label-lock text-white/90">
          <span className="font-semibold text-white">Lock Screen</span>
          <span className="text-white/40">{' · '}</span>
          <span className="text-white/70">the verse you pick</span>
        </div>
        {/* feature chips: true facts from facts.json, in a row under the phones (wide layout only), never on a screen */}
        <div aria-hidden="true" className="hero-chips">
          <div className="hero-chip">
            <span className="hero-chip-ico"><BookOpen /></span>
            {facts.translationCount} translations
          </div>
          <div className="hero-chip">
            <span className="hero-chip-ico"><Languages /></span>
            {facts.uiLanguageCount} app languages
          </div>
          <div className="hero-chip">
            <span className="hero-chip-ico"><Smartphone /></span>
            Lock Screen or widget
          </div>
        </div>
      </div>

      {/* stacked layouts: the phone melts into the page where the first screen ends */}
      <div aria-hidden="true" className="hero-fade bg-gradient-to-t from-surface to-transparent" />
    </div>
  );
}

export default function Hero() {
  return (
    <section data-hero className="hero relative overflow-hidden bg-surface">
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Static ambient glow - no GPU-heavy animations */}
        <div className="hidden md:block">
          <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-brand/5 blur-[100px] animate-[pulse_20s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/3 right-1/3 h-[500px] w-[500px] rounded-full bg-brand/[0.03] blur-[100px] animate-[pulse_15s_ease-in-out_infinite_2s]" />
        </div>
        <div className="absolute left-1/2 top-1/4 h-[400px] w-full -translate-x-1/2 rounded-full bg-brand/5 blur-[80px] md:hidden" />
        <CrossPattern focus="75% 45%" />
      </div>

      <div className="container-main relative">
        <div className="hero-fold">
          <div className="hero-text">
            <div className="inline-flex items-center gap-3 rounded-full border-2 border-brand/30 bg-surface-card py-2 pl-3 pr-4 animate-fade-up-d1 sm:gap-4 sm:py-2.5 sm:pl-4 sm:pr-5">
              <div className="flex -space-x-2.5">
                {AVATARS.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-surface-card"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
              <span className="text-base font-medium text-white/70">{`Used by ${facts.userFloorText} people`}</span>
            </div>

            <h1 className="hero-h1 font-bold tracking-tight text-white animate-fade-up-d2">
              Daily Scripture
              <br />
              <span className="text-white/40">On Your Lock Screen</span>
            </h1>

            <p className="hero-sub max-w-xl text-balance text-white/60 animate-fade-up-d3">
              {`Pick any verse in ${facts.translationCount} translations, and FaithWall sets it as your iPhone Lock Screen wallpaper. Change it whenever you like.`}
            </p>

            <div className="animate-fade-up-d4">
              <div data-hero-cta className="hero-ctas flex flex-row flex-wrap items-center gap-x-4 gap-y-3">
                <AppStoreButton size="cta" href={appStoreUrl('web-home-hero')} />
                <a
                  href={appStoreUrl('web-home-hero')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CTA_BUTTON_CLASS}
                >
                  Get FaithWall
                  <ChevronRight className="ml-1.5 hidden h-5 w-5 sm:block lg:h-6 lg:w-6" aria-hidden="true" />
                </a>
              </div>
              <RatingLine className="hero-rating mt-3 text-sm text-white/60" />
              <p className="mt-1.5 text-sm text-white/50">Listed on the App Store as {facts.storeName}</p>
            </div>
          </div>

          <PhoneStage />
        </div>
      </div>

      {/* soft seam into the next section */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/25 to-transparent" />
    </section>
  );
}
