import type { ReactNode } from 'react';
import { Bars, C, Glow, Ground, LockFrame, LockScreen, Phone, Spark, Svg, T, Verse, crescent, n } from './primitives';

/** Cross on a rounded tile: the app-icon shorthand. */
function Tile({ x, y, s = 64, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  const k = s / 64;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot} ${s / 2} ${s / 2}) scale(${k})`}>
      <rect width="64" height="64" rx="16" fill={C.brand} />
      <g fill={C.cream}>
        <rect x="28" y="12" width="8" height="40" rx="3" />
        <rect x="17" y="23" width="30" height="8" rx="3" />
      </g>
    </g>
  );
}

/** Flat cloud. */
function Cloud({ x, y, s = 1, fill = '#241B33' }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <circle cx="26" cy="22" r="18" />
      <circle cx="52" cy="14" r="22" />
      <circle cx="76" cy="26" r="14" />
      <rect x="8" y="22" width="82" height="18" rx="9" />
    </g>
  );
}

/** Small notification-style row: dot + two bars. */
function Row({ x, y, w, h = 48, fill = C.card, stroke = C.edge, dot = C.brand, bar = C.cream }: { x: number; y: number; w: number; h?: number; fill?: string; stroke?: string; dot?: string; bar?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="1.5" y="1.5" width={w - 3} height={h - 3} rx="16" fill={fill} stroke={stroke} />
      <circle cx="24" cy={h / 2} r="11" fill={dot} />
      <rect x="48" y={h / 2 - 11} width={n(w * 0.42)} height="7" rx="3.5" fill={bar} opacity=".9" />
      <rect x="48" y={h / 2 + 3} width={n(w * 0.62)} height="7" rx="3.5" fill={bar} opacity=".45" />
    </g>
  );
}

/* ------------------------------------------------------------------ */

function LockscreenScene() {
  return (
    <Svg>
      <Glow id="g" cx={360} cy={150} rx={300} ry={150} />
      <g stroke={C.brand}>
        <circle cx="360" cy="150" r="146" strokeOpacity=".3" />
        <circle cx="360" cy="150" r="104" strokeOpacity=".18" />
      </g>
      <Phone id="p" x={301} y={29} w={118} bg={T.ember.bg}>
        {(d) => <LockScreen d={d} t={T.ember} />}
      </Phone>
      <Tile x={150} y={118} rot={-8} />
      <g transform="translate(508 96) rotate(6 75 39)">
        <rect x="1.5" y="1.5" width="147" height="75" rx="16" fill={C.card} stroke={C.edge} />
        <Bars cx={75} y={20} ws={[108, 88]} fill={C.cream} o={0.85} />
        <Bars cx={75} y={52} ws={[44]} fill={C.brand} />
      </g>
      <Spark x={566} y={70} r={12} />
      <Spark x={612} y={206} r={8} />
      <Spark x={212} y={56} r={9} />
      <Spark x={196} y={232} r={6} o={0.7} />
    </Svg>
  );
}

function MorningScene() {
  const rays = [195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return `M${n(300 + 148 * Math.cos(a))} ${n(271 + 148 * Math.sin(a))}L${n(300 + 166 * Math.cos(a))} ${n(271 + 166 * Math.sin(a))}`;
  });
  return (
    <Svg>
      <Glow id="g" cx={300} cy={271} rx={300} ry={230} clip={271} />
      <Cloud x={92} y={62} s={1.1} />
      <Cloud x={548} y={42} s={0.8} />
      <path d={rays.join('')} stroke={C.light} strokeOpacity=".75" />
      <path d="M170 271A130 130 0 0 1 430 271Z" fill={C.sun} />
      <path d="M210 271A90 90 0 0 1 390 271Z" fill={C.peach} />
      <Ground />
      <Phone id="p" x={241} y={29} w={118} bg={T.sunrise.bg}>
        {(d) => (
          <>
            <path d={`M0 ${d.sh}V${d.sh - 50}A${d.sw / 2} 52 0 0 1 ${d.sw} ${d.sh - 50}V${d.sh}Z`} fill={C.rose} />
            <path d={`M${d.sw * 0.2} ${d.sh}A${d.sw * 0.3} ${d.sw * 0.3} 0 0 1 ${d.sw * 0.8} ${d.sh}Z`} fill={C.peach} />
            <LockFrame d={d} t={T.sunrise} buttons={false} />
            <Verse d={d} t={T.sunrise} lines={[0.84, 0.7]} />
          </>
        )}
      </Phone>
      {/* mug */}
      <path d="M474 201h72v46a24 24 0 0 1-24 24h-24a24 24 0 0 1-24-24z" fill={C.cream} />
      <path d="M474 222h72v10h-72z" fill={C.brand} />
      <path d="M546 214h8a18 18 0 0 1 0 36h-8v-8h8a10 10 0 0 0 0-20h-8z" fill={C.cream} />
      <path d="M492 184q-9-11 0-21t0-21M514 184q-9-11 0-21t0-21M536 184q-9-11 0-21t0-21" stroke={C.light} strokeOpacity=".65" />
      <Spark x={150} y={170} r={8} o={0.8} />
      <Spark x={610} y={160} r={10} />
    </Svg>
  );
}

function EveningScene() {
  return (
    <Svg>
      <Glow id="g" cx={520} cy={200} rx={210} ry={150} clip={271} />
      <path d={crescent(140, 84, 38, 16, -12, 32)} fill={C.cream} />
      <Spark x={216} y={52} r={10} fill={C.cream} />
      <Spark x={92} y={168} r={7} fill={C.cream} o={0.7} />
      <Spark x={250} y={150} r={6} fill={C.cream} o={0.55} />
      <Spark x={410} y={44} r={8} fill={C.cream} o={0.8} />
      <circle cx="170" cy="190" r="3" fill={C.cream} opacity=".6" />
      <circle cx="450" cy="100" r="3" fill={C.cream} opacity=".5" />
      <circle cx="618" cy="64" r="3" fill={C.cream} opacity=".6" />
      <Ground />
      <Phone id="p" x={301} y={29} w={118} bg={T.dusk.bg}>
        {(d) => <LockScreen d={d} t={T.dusk} />}
      </Phone>
      {/* lamp */}
      <path d="M478 134h84l16 70h-116z" fill={C.light} />
      <path d="M516 206h8v56h-8z" fill={C.edge} />
      <rect x="494" y="262" width="52" height="9" rx="4.5" fill={C.edge} />
    </Svg>
  );
}

function RemindersScene() {
  return (
    <Svg>
      <Glow id="g" cx={560} cy={150} rx={160} ry={150} />
      <Phone id="p" x={138} y={29} w={118} bg={T.plum.bg}>
        {(d) => (
          <>
            <LockFrame d={d} t={T.plum} />
          </>
        )}
      </Phone>
      <Row x={176} y={112} w={252} h={44} fill="#262334" />
      <Row x={192} y={166} w={252} h={44} fill="#201E2B" dot={C.light} />
      <Row x={208} y={220} w={252} h={44} fill="#1A1922" dot={C.mist} />
      {/* bell */}
      <g transform="translate(560 160) rotate(14)">
        <path d="M0-50C-30-50-40-26-40 4V24L-54 40H54L40 24V4C40-26 30-50 0-50Z" fill={C.brand} />
        <circle cx="0" cy="-58" r="7" fill={C.brand} />
        <path d="M-14 52a14 14 0 0 0 28 0z" fill={C.light} />
      </g>
      <path d="M498 118q-16 24 0 52M626 100q18 28 0 58M486 96q-26 38 0 90M638 78q28 44 0 92" stroke={C.light} strokeOpacity=".6" />
    </Svg>
  );
}

function WidgetScene() {
  // circular arrow: 280 degrees clockwise, arrowhead on the tangent at the end
  const cx = 318, cy = 150, r = 48;
  const pt = (deg: number, rr = r) => [n(cx + rr * Math.cos((deg * Math.PI) / 180)), n(cy + rr * Math.sin((deg * Math.PI) / 180))];
  const [sx, sy] = pt(40);
  const [ex, ey] = pt(320);
  const tx = Math.sin((320 * Math.PI) / 180) * -1, ty = Math.cos((320 * Math.PI) / 180);
  const head = [
    [ex + tx * 13, ey + ty * 13],
    [ex - ty * 9, ey + tx * 9],
    [ex + ty * 9, ey - tx * 9],
  ].map((p) => p.map(n).join(' '));
  return (
    <Svg>
      <Glow id="g" cx={500} cy={150} rx={230} ry={150} />
      <Phone id="p" x={96} y={29} w={118} bg={T.ember.bg}>
        {(d) => (
          <>
            <LockFrame d={d} t={T.ember} />
            <rect x={n(d.sw * 0.1)} y={n(d.sw * 0.78)} width={n(d.sw * 0.8)} height={n(d.sw * 0.42)} rx="10" fill={C.brand} />
            <Bars cx={d.sw / 2} y={n(d.sw * 0.78 + 11)} ws={[n(d.sw * 0.6), n(d.sw * 0.5)]} h={6} gap={7} fill={C.cream} />
            <Bars cx={d.sw / 2} y={n(d.sw * 0.78 + 33)} ws={[n(d.sw * 0.24)]} h={5} fill={C.ember} o={0.7} />
          </>
        )}
      </Phone>
      <path d={`M${sx} ${sy}A${r} ${r} 0 1 1 ${ex} ${ey}`} stroke={C.light} />
      <path d={`M${head[0]}L${head[1]}L${head[2]}Z`} fill={C.light} stroke={C.light} />
      {/* fanned next states */}
      <g transform="translate(404 252)">
        <g transform="rotate(-30)">
          <rect y="-100" width="206" height="100" rx="18" fill={C.navy} stroke={C.edge} />
          <Bars cx={103} y={-76} ws={[150, 116]} h={8} gap={9} fill={C.gold} o={0.9} />
          <Bars cx={103} y={-36} ws={[54]} h={7} fill="#B49F63" />
        </g>
        <g transform="rotate(-15)">
          <rect y="-100" width="206" height="100" rx="18" fill={C.plum} stroke={C.edge} />
          <Bars cx={103} y={-76} ws={[150, 116]} h={8} gap={9} fill="#FFFFFF" o={0.9} />
          <Bars cx={103} y={-36} ws={[54]} h={7} fill={C.light} />
        </g>
        <rect y="-100" width="206" height="100" rx="18" fill={C.brand} />
        <Bars cx={103} y={-76} ws={[150, 116]} h={8} gap={9} fill={C.cream} />
        <Bars cx={103} y={-36} ws={[54]} h={7} fill={C.ember} o={0.7} />
      </g>
      <Spark x={650} y={64} r={11} />
      <Spark x={420} y={40} r={7} o={0.7} />
    </Svg>
  );
}

function StudyScene() {
  const lines = (x: number, y: number, ws: number[]) =>
    ws.map((w, i) => <rect key={i} x={x} y={y + i * 20} width={w} height="7" rx="3.5" fill="#CDBF9F" />);
  return (
    <Svg>
      <Glow id="g" cx={270} cy={160} rx={280} ry={140} />
      <rect x="60" y="76" width="410" height="188" rx="18" fill={C.dark} />
      <rect x="74" y="64" width="184" height="188" rx="12" fill={C.cream} />
      <rect x="272" y="64" width="184" height="188" rx="12" fill={C.cream} />
      <g>
        {lines(94, 90, [120, 144, 132, 144, 96, 138, 120])}
        {lines(292, 90, [140, 120, 144, 100, 138, 144, 84])}
      </g>
      <rect x="284" y="124" width="124" height="15" rx="7.5" fill={C.peach} opacity=".75" />
      <rect x="292" y="127" width="108" height="7" rx="3.5" fill={C.ink} opacity=".55" />
      <path d="M418 64v52l12-10 12 10V64z" fill={C.sun} />
      {/* magnifier */}
      <circle cx="396" cy="226" r="38" fill={C.brand} fillOpacity=".15" stroke={C.light} />
      <path d="M424 254l30 30" stroke={C.light} strokeWidth="9" />
      <Phone id="p" x={518} y={29} w={118} bg={T.navy.bg}>
        {(d) => (
          <>
            <LockFrame d={d} t={T.navy} />
            <rect x={n(d.sw * 0.05)} y={n(d.sw * 0.83)} width={n(d.sw * 0.9)} height="11" rx="5.5" fill={C.gold} opacity=".28" />
            <Verse d={d} t={T.navy} />
          </>
        )}
      </Phone>
      <Spark x={36} y={50} r={9} o={0.8} />
    </Svg>
  );
}

function FocusScene() {
  const icons: ReactNode[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    if (r === 1 && c === 1) continue;
    icons.push(<rect key={`${r}${c}`} x={10 + c * 32} y={22 + r * 38} width="24" height="24" rx="7" />);
  }
  return (
    <Svg>
      <Glow id="g" cx={360} cy={150} rx={240} ry={150} />
      <Phone id="p" x={301} y={29} w={118} bg="#0E0E14">
        {() => (
          <>
            <g fill="#262633">{icons}</g>
            <rect x="8" y="60" width="90" height="40" rx="12" fill={C.brand} />
            <Bars cx={53} y={71} ws={[68]} h={6} fill={C.cream} />
            <Bars cx={53} y={84} ws={[44]} h={6} fill={C.ember} o={0.7} />
            <rect x="34" y="176" width="38" height="6" rx="3" fill="#262633" />
          </>
        )}
      </Phone>
      {/* focus toggle */}
      <rect x="130" y="118" width="124" height="64" rx="32" fill={C.brand} />
      <circle cx="222" cy="150" r="26" fill={C.cream} />
      <path d={crescent(222, 150, 15, 7, -5, 12)} fill={C.ink} />
      <path d="M254 150h36" stroke={C.light} strokeOpacity=".6" />
      {/* mode chips */}
      <g>
        <rect x="468" y="84" width="116" height="40" rx="20" fill={C.card} stroke={C.brand} />
        <circle cx="490" cy="104" r="11" fill={C.brand} />
        <rect x="510" y="100" width="56" height="8" rx="4" fill={C.cream} opacity=".8" />
        <rect x="468" y="136" width="116" height="40" rx="20" fill={C.card} stroke={C.edge} />
        <circle cx="490" cy="156" r="11" fill={C.edge} />
        <rect x="510" y="152" width="44" height="8" rx="4" fill={C.cream} opacity=".4" />
        <rect x="468" y="188" width="116" height="40" rx="20" fill={C.card} stroke={C.edge} />
        <circle cx="490" cy="208" r="11" fill={C.edge} />
        <rect x="510" y="204" width="50" height="8" rx="4" fill={C.cream} opacity=".4" />
      </g>
      <Spark x={640} y={60} r={9} />
    </Svg>
  );
}

function CompareScene() {
  const cols = [C.sun, '#3E63DD', '#2E9E7A', '#D9A93B', C.mist, C.rose, C.brand, '#2B8FB5'];
  const grid: ReactNode[] = [];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) {
    grid.push(<rect key={`${r}${c}`} x={8 + c * 24} y={34 + r * 28} width="19" height="19" rx="6" fill={cols[(r * 3 + c * 5) % cols.length]} />);
  }
  return (
    <Svg>
      <Glow id="g" cx={516} cy={150} rx={220} ry={150} />
      <Phone id="a" x={166} y={34} w={112} bg="#17171F">
        {() => (
          <>
            {grid}
            <g fill={C.sun}>
              <circle cx="27" cy="34" r="5" />
              <circle cx="75" cy="62" r="5" />
              <circle cx="51" cy="118" r="5" />
              <circle cx="27" cy="146" r="5" />
            </g>
          </>
        )}
      </Phone>
      <Phone id="b" x={438} y={34} w={112} bg={T.navy.bg}>
        {(d) => <LockScreen d={d} t={T.navy} />}
      </Phone>
      <path d="M360 50v200" stroke={C.edge} strokeOpacity=".7" />
      <circle cx="360" cy="150" r="9" fill="#0A0A0F" stroke={C.edge} />
      <circle cx="542" cy="52" r="22" fill={C.brand} stroke="#0A0A0F" strokeWidth="5" />
      <path d="M532 52l7 7 13-14" stroke={C.cream} strokeWidth="4" />
      <Spark x={606} y={96} r={9} />
      <Spark x={600} y={216} r={6} o={0.7} />
    </Svg>
  );
}

function ComfortScene() {
  return (
    <Svg>
      <Glow id="g" cx={504} cy={160} rx={150} ry={130} clip={262} />
      <g stroke={C.mist}>
        <ellipse cx="290" cy="262" rx="110" ry="12" strokeOpacity=".6" />
        <ellipse cx="290" cy="262" rx="190" ry="22" strokeOpacity=".38" />
        <ellipse cx="290" cy="262" rx="272" ry="32" strokeOpacity=".2" />
      </g>
      <Phone id="p" x={231} y={20} w={118} bg={T.plum.bg}>
        {(d) => <LockScreen d={d} t={T.plum} />}
      </Phone>
      {/* candle */}
      <rect x="480" y="162" width="48" height="100" rx="11" fill={C.cream} />
      <path d="M480 180h48v10a8 8 0 0 1-16 0 8 8 0 0 1-12 0z" fill="#E4D7BB" />
      <path d="M504 162v-13" stroke={C.ink} />
      <path d="M504 98c14 19 17 34 17 44a17 17 0 0 1-34 0c0-10 3-25 17-44z" fill={C.peach} />
      <path d="M504 122c7 10 9 17 9 23a9 9 0 0 1-18 0c0-6 2-13 9-23z" fill={C.cream} />
      <Spark x={566} y={86} r={7} o={0.8} />
      <circle cx="536" cy="60" r="3" fill={C.light} opacity=".6" />
      <circle cx="586" cy="140" r="3" fill={C.light} opacity=".5" />
    </Svg>
  );
}

function DesignScene() {
  const sw = [
    ['#000000', C.edge],
    [C.navy, C.navy],
    [C.plum, C.plum],
    [C.cream, C.cream],
    [C.sun, C.sun],
    [C.ember, C.edge],
  ];
  return (
    <Svg>
      <Glow id="g" cx={360} cy={150} rx={260} ry={150} />
      <Phone id="p" x={301} y={29} w={118} bg={T.plum.bg}>
        {(d) => <LockScreen d={d} t={T.plum} />}
      </Phone>
      {/* swatches */}
      {sw.map(([f, s], i) => (
        <circle key={i} cx={134 + (i % 3) * 54} cy={112 + Math.floor(i / 3) * 56} r="20" fill={f} stroke={s} />
      ))}
      <circle cx="242" cy="112" r="27" stroke={C.brand} />
      <circle cx="242" cy="112" r="20" fill={C.plum} stroke={C.plum} />
      {/* sliders */}
      <g>
        <rect x="476" y="108" width="130" height="10" rx="5" fill={C.card} stroke={C.edge} />
        <rect x="476" y="108" width="78" height="10" rx="5" fill={C.brand} />
        <circle cx="554" cy="113" r="13" fill={C.cream} />
        <rect x="476" y="84" width="22" height="6" rx="3" fill={C.cream} opacity=".6" />
        <rect x="540" y="80" width="66" height="10" rx="5" fill={C.cream} opacity=".35" />
        <rect x="476" y="178" width="130" height="10" rx="5" fill={C.card} stroke={C.edge} />
        <rect x="476" y="178" width="40" height="10" rx="5" fill={C.brand} />
        <circle cx="516" cy="183" r="13" fill={C.cream} />
        <circle cx="486" cy="160" r="7" fill={C.light} opacity=".6" />
        <circle cx="590" cy="157" r="13" fill={C.light} opacity=".6" />
      </g>
      <Spark x={650} y={50} r={9} />
    </Svg>
  );
}

function SharedScene() {
  const row = [
    { x: 56, w: 72, rot: -10, o: 0.45 },
    { x: 178, w: 92, rot: -5, o: 0.8 },
    { x: 304, w: 112, rot: 0, o: 1 },
    { x: 450, w: 92, rot: 5, o: 0.8 },
    { x: 592, w: 72, rot: 10, o: 0.45 },
  ];
  return (
    <Svg>
      <Glow id="g" cx={360} cy={150} rx={280} ry={150} />
      <path d="M92 168H628" stroke={C.edge} strokeOpacity=".7" />
      {row.map((p, i) => {
        const h = Math.round(p.w * 2.05);
        return (
          <Phone key={i} id={`p${i}`} x={p.x} y={Math.round(150 - h / 2)} w={p.w} rot={p.rot} bg={T.navy.bg} o={p.o} lite={p.o < 0.5}>
            {(d) => (p.o < 0.5 ? <Verse d={d} t={T.navy} y={n(d.sw * 0.5)} /> : <LockScreen d={d} t={T.navy} />)}
          </Phone>
        );
      })}
      <circle cx="274" cy="168" r="9" fill={C.brand} stroke="#0A0A0F" strokeWidth="4" />
      <circle cx="446" cy="168" r="9" fill={C.brand} stroke="#0A0A0F" strokeWidth="4" />
    </Svg>
  );
}

function PlansScene() {
  const cells: ReactNode[] = [];
  const done = 9;
  for (let i = 0; i < 28; i++) {
    const x = 126 + (i % 7) * 38;
    const y = 112 + Math.floor(i / 7) * 36;
    if (i < done) {
      cells.push(
        <g key={i}>
          <rect x={x} y={y} width="28" height="28" rx="9" fill={C.dark} />
          <path d={`M${x + 8} ${y + 14}l5 5 8-10`} stroke={C.cream} />
        </g>,
      );
    } else if (i === done) {
      cells.push(<rect key={i} x={x} y={y} width="28" height="28" rx="9" fill={C.light} />);
    } else {
      cells.push(<rect key={i} x={x} y={y} width="28" height="28" rx="9" fill="#22222E" />);
    }
  }
  return (
    <Svg>
      <Glow id="g" cx={216} cy={164} rx={150} ry={134} />
      <rect x="100" y="42" width="290" height="224" rx="22" fill={C.card} stroke={C.edge} />
      <rect x="150" y="28" width="12" height="28" rx="6" fill={C.light} />
      <rect x="328" y="28" width="12" height="28" rx="6" fill={C.light} />
      <rect x="126" y="72" width="110" height="9" rx="4.5" fill={C.cream} opacity=".8" />
      <rect x="126" y="90" width="64" height="6" rx="3" fill={C.cream} opacity=".3" />
      {cells}
      <path d="M392 204C430 204 440 170 480 170" stroke={C.brand} strokeDasharray="2 9" />
      <Phone id="p" x={496} y={29} w={118} bg={T.ember.bg}>
        {(d) => (
          <>
            <LockFrame d={d} t={T.ember} />
            <rect x={n(d.sw * 0.3)} y={n(d.sw * 0.74)} width={n(d.sw * 0.4)} height="14" rx="7" fill={C.brand} />
            <Verse d={d} t={T.ember} y={n(d.sw * 0.74 + 28)} lines={[0.8, 0.88, 0.5]} />
          </>
        )}
      </Phone>
    </Svg>
  );
}

function AudioScene() {
  const bars = [30, 52, 84, 112, 70, 96, 44, 66, 28];
  return (
    <Svg>
      <Glow id="g" cx={360} cy={150} rx={260} ry={150} />
      <Phone id="p" x={301} y={29} w={118} bg={T.indigo.bg}>
        {(d) => (
          <>
            <LockFrame d={d} t={T.indigo} />
            <Verse d={d} t={T.indigo} lines={[0.84, 0.7]} />
            <rect x={n(d.sw * 0.07)} y={n(d.sh - d.sw * 0.64)} width={n(d.sw * 0.86)} height={n(d.sw * 0.4)} rx="12" fill="#FFFFFF" fillOpacity=".14" />
            <circle cx={n(d.sw * 0.2)} cy={n(d.sh - d.sw * 0.44)} r="11" fill={C.brand} />
            <path d={`M${n(d.sw * 0.2 - 3)} ${n(d.sh - d.sw * 0.44 - 5)}l8 5-8 5z`} fill={C.cream} stroke={C.cream} strokeWidth="1.5" />
            <rect x={n(d.sw * 0.34)} y={n(d.sh - d.sw * 0.46)} width={n(d.sw * 0.5)} height="5" rx="2.5" fill="#FFFFFF" fillOpacity=".3" />
            <rect x={n(d.sw * 0.34)} y={n(d.sh - d.sw * 0.46)} width={n(d.sw * 0.2)} height="5" rx="2.5" fill={C.light} />
          </>
        )}
      </Phone>
      <g fill={C.light}>
        {bars.map((h, i) => (
          <rect key={i} x={96 + i * 18} y={150 - h / 2} width="8" height={h} rx="4" opacity={0.4 + (h / 112) * 0.6} />
        ))}
      </g>
      {/* headphones */}
      <g transform="translate(548 156)">
        <path d="M-64 18A64 64 0 0 1 64 18H50A50 50 0 0 0-50 18Z" fill={C.light} />
        <rect x="-76" y="10" width="26" height="58" rx="13" fill={C.brand} />
        <rect x="50" y="10" width="26" height="58" rx="13" fill={C.brand} />
      </g>
      <Spark x={650} y={60} r={9} />
    </Svg>
  );
}

export const SCENES = {
  lockscreen: LockscreenScene,
  morning: MorningScene,
  evening: EveningScene,
  reminders: RemindersScene,
  widget: WidgetScene,
  study: StudyScene,
  focus: FocusScene,
  compare: CompareScene,
  comfort: ComfortScene,
  design: DesignScene,
  shared: SharedScene,
  plans: PlansScene,
  audio: AudioScene,
} as const;

export type SceneName = keyof typeof SCENES;
