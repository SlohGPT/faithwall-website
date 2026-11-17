/**
 * A soft brand-coloured glow drawn as a radial-gradient instead of a CSS blur(): the same colour, size and softness as
 * a blurred disc/ellipse, without the large filter that makes WebKit scrolling janky.
 *
 * `className` places and sizes the wrapper exactly like the old blurred shape (position, translate, h-[..] w-[..]).
 * `rx`/`ry` are that shape's radii in px, `sigma` its old blur radius in px and `alpha` its colour opacity. The gradient
 * is a child centred on the wrapper that reaches 2.5 sigma past the old edge, following the profile of a Gaussian-blurred
 * disc (centre 1 - exp(-R^2 / 2 sigma^2), half strength at the old edge, nothing past 2.5 sigma). The layer is
 * decorative; the parent must be overflow-hidden where the glow could reach the page edge.
 */

// Abramowitz and Stegun 7.1.26.
function erf(x: number): number {
  const s = x < 0 ? -1 : 1;
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return s * y;
}
const phi = (x: number) => 0.5 * (1 + erf(x / Math.SQRT2));

function stops(rx: number, ry: number, sigma: number, alpha: number, rgb: string): { reachX: number; reachY: number; css: string } {
  const r = Math.sqrt(rx * ry);
  const k = r / sigma;
  const reach = 2.5; // sigmas past the old edge
  const umax = 1 + reach / k; // gradient radius in units of the old edge distance
  const c0 = 1 - Math.exp(-(k * k) / 2); // centre intensity of a blurred disc
  const norm = c0 / phi(k);
  const list: string[] = [];
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const u = (i / steps) * umax;
    const v = i === steps ? 0 : Math.min(1, norm * phi(k * (1 - u)));
    list.push(`rgb(${rgb} / ${(alpha * v).toFixed(4)}) ${((i / steps) * 100).toFixed(1)}%`);
  }
  return { reachX: rx + reach * sigma, reachY: ry + reach * sigma, css: list.join(', ') };
}

export default function GlowDisc({
  className = '',
  rx,
  ry = rx,
  sigma,
  alpha,
  rgb = '217 123 59',
}: {
  className?: string;
  rx: number;
  ry?: number;
  sigma: number;
  alpha: number;
  rgb?: string;
}) {
  const { reachX, reachY, css } = stops(rx, ry, sigma, alpha, rgb);
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: reachX * 2,
          height: reachY * 2,
          background: `radial-gradient(closest-side, ${css})`,
        }}
      />
    </div>
  );
}
