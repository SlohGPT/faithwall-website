import { useEffect, useId, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { HANDOFF_URL } from '../lib/appStore';

/*
 * Desktop-to-phone handoff: a QR code plus a "Copy link" button.
 * /qr/web-handoff.svg encodes (error correction M, 2-module quiet zone, black on white):
 *   https://apps.apple.com/app/id6756815070?pt=128303795&ct=web-handoff&mt=8
 * It is a static file; regenerate it with `npx -y qrcode@1.5.4 -t svg -e M -q 2 -o public/qr/web-handoff.svg "<url>"`
 * if the app id, provider token or campaign token ever changes.
 *
 * Visible from the lg breakpoint up (CSS only), so server HTML and first client render are identical.
 * Clipboard use happens only inside the click handler.
 */
type CopyState = 'idle' | 'copied' | 'manual';

export default function InstallHandoff({ className = '' }: { className?: string }) {
  const [state, setState] = useState<CopyState>('idle');
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (state === 'manual') inputRef.current?.select();
  }, [state]);

  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(HANDOFF_URL);
      setState('copied');
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setState('idle'), 2000);
    } catch {
      setState('manual');
    }
  }

  return (
    <div className={`hidden lg:flex flex-col items-center gap-2 shrink-0 w-[168px] ${className}`}>
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center">
        <img
          src="/qr/web-handoff.svg"
          alt="QR code: download FaithWall from the App Store"
          width={120}
          height={120}
          loading="lazy"
          decoding="async"
          className="block h-[120px] w-[120px]"
        />
        <p className="text-[13px] leading-snug font-medium text-neutral-800">Scan with your iPhone camera</p>
      </div>

      {state === 'manual' ? (
        <div className="w-full">
          <label htmlFor={inputId}className="mb-1 block text-[13px] text-white/70">
            Copy this link:
          </label>
          <input
            id={inputId}
            ref={inputRef}
            type="text"
            readOnly
            value={HANDOFF_URL}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full rounded-lg border border-white/20 bg-surface px-2 py-1.5 text-[13px] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-white/20 px-3 text-sm font-semibold text-white/85 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {state === 'copied' ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          {state === 'copied' ? 'Copied' : 'Copy link'}
        </button>
      )}

      <span className="sr-only" aria-live="polite">
        {state === 'copied' ? 'Link copied' : ''}
      </span>
    </div>
  );
}
