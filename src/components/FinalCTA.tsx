import AppStoreButton from './AppStoreButton';
import InstallHandoff from './InstallHandoff';
import { appStoreUrl } from '../lib/appStore';
import { SHOWCASE_VERSES } from '../data/showcaseVerses';
import AppLockScreen from './showcase/AppLockScreen';
import CrossPattern from './ui/CrossPattern';
import Reveal from './ui/Reveal';

export default function FinalCTA() {
  return (
    <section className="section-space relative bg-surface">
      <div className="container-main">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-brand/30 bg-surface-elevated">
            {/* coded backdrop: brand glow, faint crosses, a Lock Screen on the right */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-surface-card to-surface-elevated" />
              <div className="absolute -right-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-brand/25 blur-[110px]" />
              <CrossPattern focus="80% 50%" opacity={0.07} />
              <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/55 to-transparent" />
            </div>

            <div className="relative grid items-center gap-10 px-8 pt-16 sm:px-12 sm:pt-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6 lg:px-20 lg:py-24">
              <div className="max-w-xl">
                <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Start every day
                  <br />
                  <span className="text-white/40">with purpose</span>
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-white/60">
                  Pick a Bible verse and put it on your lock screen, where you will see it every time you pick up your phone.
                </p>

                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:gap-8">
                  <div className="flex flex-row flex-wrap items-center gap-3">
                    <AppStoreButton href={appStoreUrl('web-site')} />
                    <a
                      href={appStoreUrl('web-site')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-brand px-6 text-base font-bold text-surface shadow-[0_10px_30px_-6px_rgba(217,123,59,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-light hover:shadow-[0_14px_36px_-6px_rgba(217,123,59,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:px-7"
                    >
                      Get FaithWall
                    </a>
                  </div>
                  <InstallHandoff />
                </div>

                <p className="mt-8 text-sm text-white/60">
                  Used by <span className="font-semibold text-white">1,000+</span> people
                </p>
              </div>

              {/* the phone is cropped by the card's bottom edge */}
              <div aria-hidden="true" className="relative mx-auto h-[19rem] w-full max-w-[15rem] overflow-hidden sm:h-[22rem] lg:mx-0 lg:ml-auto lg:h-[26rem] lg:self-end lg:-mb-24 lg:max-w-[16rem]">
                <div className="absolute inset-x-0 top-0 lg:top-4">
                  <AppLockScreen verse={SHOWCASE_VERSES[4]} wallpaper="night" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
