import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  to?: string;
}

/** One line on phones: the current-page crumb is cut with an ellipsis (the full text stays in the DOM). */
export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[14px] leading-5 text-white/65">
      <ol className="flex flex-nowrap items-center gap-1">
        {crumbs.map((crumb, i) => (
          <li key={i} className={`flex items-center gap-1 ${crumb.to ? 'shrink-0' : 'min-w-0'}`}>
            {crumb.to ? (
              <Link to={crumb.to} className="hover:text-white transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="block max-w-[12rem] truncate text-white/80 md:max-w-[26rem]" aria-current="page">
                {crumb.label}
              </span>
            )}
            {i < crumbs.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/40" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
