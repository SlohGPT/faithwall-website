import { Bars, C, Glow, LockScreen, Phone, Spark, T, n } from '../illustrations/primitives';
import Live from './Live';
import { Box, delay, useUid } from './sceneKit';

/** A generic app screen: top bar and a few list cards. Stands for "another app", with no logo and no name. */
function AppScreen({ sw, sh }: { sw: number; sh: number }) {
  const rows = [0, 1, 2];
  return (
    <>
      <Bars cx={sw * 0.36} y={n(sw * 0.3)} ws={[n(sw * 0.44)]} h={n(sw * 0.07)} fill="#C9D0E6" o={0.7} />
      {rows.map((i) => {
        const y = n(sw * 0.5 + i * (sw * 0.46));
        return (
          <g key={i}>
            <rect x={n(sw * 0.09)} y={y} width={n(sw * 0.82)} height={n(sw * 0.36)} rx={n(sw * 0.08)} fill="#FFFFFF" fillOpacity=".09" />
            <circle cx={n(sw * 0.22)} cy={n(y + sw * 0.18)} r={n(sw * 0.075)} fill="#8A8FB8" />
            <rect x={n(sw * 0.36)} y={n(y + sw * 0.1)} width={n(sw * 0.42)} height={n(sw * 0.05)} rx={n(sw * 0.025)} fill="#C9D0E6" opacity=".7" />
            <rect x={n(sw * 0.36)} y={n(y + sw * 0.2)} width={n(sw * 0.28)} height={n(sw * 0.05)} rx={n(sw * 0.025)} fill="#C9D0E6" opacity=".35" />
          </g>
        );
      })}
      <rect x={n(sw * 0.09)} y={n(sh - sw * 0.3)} width={n(sw * 0.82)} height={n(sw * 0.14)} rx={n(sw * 0.07)} fill="#FFFFFF" fillOpacity=".09" />
    </>
  );
}

/** Compare pages: the FaithWall lock screen next to a plain app screen. 320x240. */
function CompareScene() {
  const u = useUid();
  return (
    <Box w={320} h={240}>
      <g className="vp-loop vp-pulse" style={delay(0, 6)}>
        <Glow id={`${u}g`} cx={96} cy={128} rx={112} ry={112} />
      </g>
      <g className="vp-loop vp-bob" style={delay(0, 7)}>
        <Phone id={`${u}a`} x={40} y={30} w={96} bg={T.ember.bg}>
          {(d) => <LockScreen d={d} t={T.ember} />}
        </Phone>
      </g>
      <Phone id={`${u}b`} x={190} y={50} w={88} bg={T.dusk.bg} lite>
        {(d) => <AppScreen sw={d.sw} sh={d.sh} />}
      </Phone>
      <g transform="translate(162 124)">
        <circle r="15" fill={C.card} stroke={C.edge} />
        <path d="M-7 -3H7M3 -7l4 4-4 4M7 4H-7M-3 0l-4 4 4 4" stroke={C.light} strokeWidth="2.5" />
      </g>
      <g className="vp-loop vp-twinkle" style={delay(0, 5)}>
        <Spark x={30} y={34} r={8} />
      </g>
      <g className="vp-loop vp-twinkle" style={delay(1.6, 6)}>
        <Spark x={150} y={22} r={5} fill={C.gold} />
      </g>
    </Box>
  );
}

export function CompareHeaderVisual() {
  return (
    <Live className="mx-auto mt-8 w-full max-w-[14rem] md:mx-0 md:mt-0 md:max-w-none md:justify-self-end">
      <CompareScene />
    </Live>
  );
}
