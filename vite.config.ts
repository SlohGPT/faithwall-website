import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssMinify: true,
    // Client-only chunk splitting. The SSR bundle is a single file consumed by
    // scripts/prerender.mjs, so we skip manualChunks for it.
    rollupOptions: isSsrBuild
      ? {
          output: { format: 'esm' },
        }
      : {
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              'vendor-motion': ['framer-motion'],
            },
          },
        },
  },
  // Bundle React ecosystem packages into the SSR artifact via Rollup so their
  // CJS/ESM interop is resolved at build time. Without this, react-router(-dom)
  // v7's "node" export condition resolves to CJS and named imports fail.
  ssr: {
    noExternal: ['react-router', 'react-router-dom', 'react-helmet-async'],
  },
}));
