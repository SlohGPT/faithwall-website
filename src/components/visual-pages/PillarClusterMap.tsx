import { Link } from 'react-router-dom';
import type { BlogCluster, BlogPostListing } from '../../types/blog';
import { CLUSTER_LABEL } from '../../lib/posts';
import { C } from '../illustrations/primitives';
import Live from './Live';
import './pillar-visuals.css';

/**
 * Visual cluster map for a pillar page: the guide as a hub, its posts around it. Every node is a real
 * server-rendered <Link to="/blog/<slug>"> carrying the post's own title. Phones get a vertical rail (hub on top,
 * one connector per post), wider screens get the hub in the middle with the posts on both sides. Entrance motion
 * (below the fold only, 1.1 s at most, once) is class-driven through Live; the HTML is always complete.
 * Template wording only: one heading, the topic label and the post count.
 */

function HubIcon() {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" focusable="false" fill="none" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="32" cy="32" r="30" fill={C.brand} fillOpacity=".16" className="pv-loop pv-pulse" style={{ ['--t' as string]: '7s' }} />
      <rect x="20" y="9" width="24" height="46" rx="6.5" fill={C.body} stroke={C.edge} />
      <rect x="27" y="12.5" width="10" height="3.5" rx="1.75" fill="#000" stroke="none" />
      <g fill={C.cream}>
        <rect x="24.5" y="27" width="15" height="2.6" rx="1.3" opacity=".9" stroke="none" />
        <rect x="24.5" y="33" width="15" height="2.6" rx="1.3" opacity=".9" stroke="none" />
        <rect x="27" y="39" width="10" height="2.6" rx="1.3" fill={C.light} stroke="none" />
      </g>
    </svg>
  );
}

export default function PillarClusterMap({ cluster, posts }: { cluster: BlogCluster; posts: BlogPostListing[] }) {
  if (posts.length === 0) return null;
  const label = CLUSTER_LABEL[cluster] ?? cluster;
  const rows = Math.ceil(posts.length / 2);
  return (
    <section className="pv-map mx-auto mt-16 max-w-4xl" aria-labelledby="pv-map-title">
      <h2 id="pv-map-title" className="mb-6 text-2xl font-black text-white md:text-3xl">
        Guide map
      </h2>
      <Live>
        <div className="pv-tree" style={{ ['--rows' as string]: rows }}>
          <div className="pv-hub pv-e" style={{ ['--d' as string]: '0s' }}>
            <HubIcon />
            <span>
              <span className="pv-hub-label">{label}</span>
              <span className="pv-hub-sub">{posts.length} guides</span>
            </span>
          </div>
          <ul className="pv-list" role="list">
            {posts.map((p, i) => (
              <li
                key={p.slug}
                className="pv-item pv-e"
                data-side={i % 2 === 0 ? 'l' : 'r'}
                style={{ gridRow: Math.floor(i / 2) + 1, ['--d' as string]: `${Math.min(0.05 * (i + 1), 0.6).toFixed(2)}s` }}
              >
                <Link to={`/blog/${p.slug}`} className="pv-node">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Live>
    </section>
  );
}
