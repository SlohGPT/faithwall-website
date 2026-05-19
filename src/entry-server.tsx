import { StrictMode } from 'react';
import { PassThrough } from 'stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import App from './App.tsx';

export interface RenderResult {
  html: string;
  helmet: HelmetServerState | undefined;
}

export function render(url: string): Promise<RenderResult> {
  const helmetContext: { helmet?: HelmetServerState } = {};

  return new Promise((resolve, reject) => {
    const stream = new PassThrough();
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => {
      resolve({
        html: Buffer.concat(chunks).toString('utf8'),
        helmet: helmetContext.helmet,
      });
    });
    stream.on('error', reject);

    const { pipe, abort } = renderToPipeableStream(
      <StrictMode>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </HelmetProvider>
      </StrictMode>,
      {
        onAllReady() {
          pipe(stream);
        },
        onError(err) {
          reject(err);
        },
      },
    );

    const timeoutId = setTimeout(() => {
      abort();
      reject(new Error(`renderToPipeableStream timed out for ${url}`));
    }, 15000);
    stream.on('end', () => clearTimeout(timeoutId));
  });
}
