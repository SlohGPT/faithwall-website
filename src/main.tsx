import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import { preloadPost } from './lib/postLoader';
import './index.css';

// Fetch the post body in parallel with the lazy route chunk (it is a separate chunk now), so hydration
// of /blog/:slug does not wait for the two one after the other.
const postRoute = /^\/blog\/([^/]+)\/?$/.exec(window.location.pathname);
if (postRoute) void preloadPost(postRoute[1]);

const container = document.getElementById('root')!;

const tree = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

if (container.dataset.notFound === '1') {
  // dist/404.html: server markup is the NotFound page for an unknown path. The URL the
  // browser shows may match a lazy route (e.g. /blog/<typo>), so don't hydrate against it.
  createRoot(container).render(tree);
} else if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
