import { C, Glow, Ground, LockScreen, Phone, Spark, T, n } from '../illustrations/primitives';
import Live from './Live';
import { Box, delay, useUid } from './sceneKit';

/** Wallpaper maker text: three styles and the zones the tool keeps the verse out of. 720x300. */
function MakerScene() {
  const u = useUid();
  return (
    <Box w={720} h={300}>
      <Glow id={`${u}g`} cx={360} cy={150} rx={280} ry={150} o={0.4} />
      <Ground />
      <g className="vp-loop vp-bob" style={delay(0.8, 8)}>
        <Phone id={`${u}l`} x={168} y={72} w={96} rot={-6} bg={T.black.bg} lite>
          {(d) => <LockScreen d={d} t={T.black} />}
        </Phone>
      </g>
      <g className="vp-loop vp-bob" style={delay(2.4, 8)}>
        <Phone id={`${u}r`} x={456} y={72} w={96} rot={6} bg={T.cream.bg} lite>
          {(d) => <LockScreen d={d} t={T.cream} />}
        </Phone>
      </g>
      <Phone id={`${u}c`} x={301} y={29} w={118} bg={T.navy.bg}>
        {(d) => {
          const top = n(d.sh * 0.35);
          const bot = n(d.sh * 0.88);
          return (
            <>
              <LockScreen d={d} t={T.navy} y={n(top + 10)} />
              <rect width={d.sw} height={top} fill={C.brand} opacity=".12" />
              <rect y={bot} width={d.sw} height={n(d.sh - bot)} fill={C.brand} opacity=".12" />
              <path d={`M0 ${top}H${d.sw}M0 ${bot}H${d.sw}`} stroke={C.light} strokeWidth="1.5" strokeDasharray="5 5" opacity=".8" />
              <rect className="vp-loop vp-sweep" style={{ ...delay(0, 7), ['--sy' as string]: `${n(bot - top - 4)}px` }} x={n(d.sw * 0.1)} y={top + 2} width={n(d.sw * 0.8)} height="3" rx="1.5" fill={C.gold} />
            </>
          );
        }}
      </Phone>
      <g className="vp-loop vp-twinkle" style={delay(0, 5)}>
        <Spark x={236} y={46} r={9} />
      </g>
      <g className="vp-loop vp-twinkle" style={delay(2.2, 6)}>
        <Spark x={500} y={52} r={7} fill={C.gold} />
      </g>
    </Box>
  );
}

export function MakerHeaderVisual() {
  return (
    <Live>
      <MakerScene />
    </Live>
  );
}
