import type { ReactNode, Ref } from 'react';
import GlassCard from './ui/GlassCard';
import Reveal from './ui/Reveal';
import GlowDisc from './ui/GlowDisc';
import SectionHeading from './ui/SectionHeading';
import CrossPattern from './ui/CrossPattern';
import { ChooseVerseScreen, DownloadScreen, ReviewScreen } from './howitworks/AppScreens';
import { useOnScreen } from './howitworks/useOnScreen';

// The step copy is the site's wording (the first step keeps its sentence exactly).
const STEPS = [
    {
        number: '01',
        title: 'Download',
        description: 'Download FaithWall from the App Store (free to download).',
    },
    {
        number: '02',
        title: 'Choose your verse',
        description: 'Choose the verse you want to see on your lock screen.',
    },
    {
        number: '03',
        title: 'Preview and set it',
        description: 'Preview it live before you set it. FaithWall applies it with an Apple Shortcut, and it stays until you choose another.',
    },
] as const;

function StepCard({
    index,
    children,
    stageRef,
}: {
    index: number;
    children: ReactNode;
    stageRef?: Ref<HTMLDivElement>;
}) {
    const step = STEPS[index];
    return (
        <Reveal delay={index * 0.06} className="h-full">
            <GlassCard as="article" className="flex h-full flex-col overflow-hidden">
                <div className="p-6 pb-6 sm:p-7 sm:pb-6 md:p-5 md:pb-6 lg:p-8 lg:pb-6">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full border border-brand/30 bg-brand/10 px-2.5 text-sm font-bold tracking-wide text-brand">
                            {step.number}
                        </span>
                        <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-brand/30 to-transparent" />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold tracking-tight text-white md:text-xl lg:text-2xl">{step.title}</h3>
                    <p className="text-base leading-relaxed text-white/60 md:text-[0.9375rem] lg:text-base">{step.description}</p>
                </div>

                {/* the phone, cropped by the card's bottom edge */}
                <div
                    ref={stageRef}
                    aria-hidden="true"
                    className="relative mx-auto mt-auto aspect-square w-full max-w-[22rem] flex-none overflow-hidden"
                >
                    <div
                        className="pointer-events-none absolute left-1/2 top-[18%] h-[90%] w-[110%] -translate-x-1/2 rounded-full"
                        style={{ background: 'radial-gradient(closest-side,rgba(217,123,59,0.2),rgba(217,123,59,0.06) 60%,transparent)' }}
                    />
                    <div className="absolute left-1/2 top-[6%] w-[66%] -translate-x-1/2">{children}</div>
                </div>
            </GlassCard>
        </Reveal>
    );
}

export default function HowItWorksAndPreview() {
    const [stageRef, onScreen] = useOnScreen<HTMLDivElement>();

    return (
        <section id="how-it-works" className="section-space relative overflow-hidden bg-surface-elevated">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <GlowDisc className="-left-40 top-1/3 h-[600px] w-[600px]" rx={300} sigma={90} alpha={0.05} />
                <CrossPattern focus="50% 20%" />
            </div>
            {/* soft seams into the neighbouring sections */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" />

            <div className="container-main relative z-10">
                <SectionHeading eyebrow="How It Works" title="Set your verse once." muted="See it every time you look." align="center" />

                <ol className="mt-14 grid list-none gap-5 sm:mt-16 md:grid-cols-3 lg:gap-6">
                    <li><StepCard index={0}><DownloadScreen /></StepCard></li>
                    <li><StepCard index={1}><ChooseVerseScreen /></StepCard></li>
                    <li><StepCard index={2} stageRef={stageRef}><ReviewScreen active={onScreen} /></StepCard></li>
                </ol>
            </div>
        </section>
    );
}
