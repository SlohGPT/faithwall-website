import AppStoreButton from './AppStoreButton';
import InstallHandoff from './InstallHandoff';
import { appStoreUrl } from '../lib/appStore';

export default function FinalCTA() {
  return (
    <section className="section-space bg-surface">
      <div className="container-main">
        <div className="relative rounded-[2rem] overflow-hidden border-2 border-brand/30">
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/1064162/pexels-photo-1064162.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface/95 via-surface/80 to-surface/60" />
          </div>

          <div className="relative px-8 py-20 sm:px-12 sm:py-28 lg:px-20">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                Start every day
                <br />
                <span className="text-white/40">with purpose</span>
              </h2>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                Pick a Bible verse and put it on your lock screen, where you will see it every time you pick up your phone.
              </p>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
                <AppStoreButton href={appStoreUrl('web-site')} />
                <InstallHandoff />
              </div>

              <p className="mt-8 text-sm text-white/60">
                Used by <span className="text-white font-semibold">1,000+</span> people
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
