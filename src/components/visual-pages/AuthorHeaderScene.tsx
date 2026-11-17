import { C, Glow, Ground, LockScreen, Phone, Spark, T } from '../illustrations/primitives';
import Live from './Live';
import { Box, delay, useUid } from './sceneKit';

/** Author page: a morning desk. 720x300 (same box as the blog scenes). */
function AuthorScene() {
  const u = useUid();
  return (
    <Box w={720} h={300}>
      <Glow id={`${u}g`} cx={300} cy={150} rx={300} ry={150} o={0.4} />
      <circle cx="640" cy="64" r="26" fill={C.peach} opacity=".9" />
      <circle cx="640" cy="64" r="40" stroke={C.peach} opacity=".25" />
      <Ground />
      <Phone id={`${u}p`} x={180} y={44} w={108} bg={T.sunrise.bg}>
        {(d) => <LockScreen d={d} t={T.sunrise} />}
      </Phone>
      {/* open notebook */}
      <g transform="translate(350 206)">
        <path d="M0 62V10Q0 4 6 4H78V62Z" fill={C.card} stroke={C.edge} />
        <path d="M156 62V10Q156 4 150 4H78V62Z" fill={C.card} stroke={C.edge} />
        <g fill={C.cream} opacity=".55">
          <rect x="14" y="18" width="50" height="5" rx="2.5" />
          <rect x="14" y="30" width="38" height="5" rx="2.5" />
          <rect x="14" y="42" width="46" height="5" rx="2.5" />
          <rect x="94" y="18" width="46" height="5" rx="2.5" />
          <rect x="94" y="30" width="52" height="5" rx="2.5" />
        </g>
        <path d="M120 -22l30 40" stroke={C.brand} strokeWidth="6" />
        <path d="M150 18l4 7" stroke={C.cream} strokeWidth="6" />
      </g>
      {/* mug with steam */}
      <g transform="translate(560 213)">
        <rect x="0" y="0" width="56" height="58" rx="12" fill={C.dark} />
        <path d="M56 14h6a10 10 0 0 1 0 28h-6" stroke={C.dark} strokeWidth="6" />
        <rect x="8" y="8" width="40" height="8" rx="4" fill={C.light} opacity=".5" />
      </g>
      <g stroke={C.light} strokeWidth="3" opacity=".7">
        <path className="vp-loop vp-rise" style={delay(0, 5)} d="M574 196q-8-10 0-20" />
        <path className="vp-loop vp-rise" style={delay(1.7, 5)} d="M590 196q-8-10 0-20" />
        <path className="vp-loop vp-rise" style={delay(3.3, 5)} d="M606 196q-8-10 0-20" />
      </g>
      <g className="vp-loop vp-twinkle" style={delay(0, 5)}>
        <Spark x={118} y={70} r={9} />
      </g>
      <g className="vp-loop vp-twinkle" style={delay(2, 6)}>
        <Spark x={470} y={90} r={7} fill={C.gold} />
      </g>
    </Box>
  );
}

export function AuthorHeaderVisual() {
  return (
    <Live className="-mt-4 mb-10 md:mb-12">
      <AuthorScene />
    </Live>
  );
}
