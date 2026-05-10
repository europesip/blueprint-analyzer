import { IMPLEMENTATION_PATHS } from '../data/rulebook';

const colorClasses = {
  brand: 'border-brand/30 bg-brand/10 text-brand',
  signal: 'border-signal/30 bg-signal/10 text-signal',
  warn: 'border-warn/30 bg-warn/10 text-warn',
  risk: 'border-risk/30 bg-risk/10 text-risk',
};

export function PathBadge({ path }) {
  const meta = IMPLEMENTATION_PATHS[path];
  if (!meta) return null;
  return (
    <span className={`inline-flex items-center rounded border px-2 py-1 text-xs font-medium ${colorClasses[meta.color]}`}>
      {meta.label}
    </span>
  );
}

export function ScoreBadge({ value }) {
  const tone =
    value >= 80
      ? 'border-brand/30 bg-brand/10 text-brand'
      : value >= 65
        ? 'border-warn/30 bg-warn/10 text-warn'
        : 'border-risk/30 bg-risk/10 text-risk';
  return <span className={`inline-flex rounded border px-2 py-1 font-mono text-xs ${tone}`}>{value}%</span>;
}
