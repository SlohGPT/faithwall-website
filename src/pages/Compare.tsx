import CompareView, { type CompareConfig } from '../components/CompareView';
import comparisons from '../data/comparisons.json';
import NotFound from './NotFound';

const all = comparisons as Record<string, CompareConfig>;

export default function Compare({ slug }: { slug: string }) {
  const config = all[slug];
  if (!config) return <NotFound />;
  return <CompareView config={config} />;
}
