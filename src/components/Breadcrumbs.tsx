import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  to?: string;
}

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-white/50">
      <ol className="flex items-center flex-wrap gap-1">
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            {crumb.to ? (
              <Link to={crumb.to} className="hover:text-white transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-white/70" aria-current="page">{crumb.label}</span>
            )}
            {i < crumbs.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-white/30" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
