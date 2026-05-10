import { IMPLEMENTATION_PATHS } from '../data/rulebook';
import { PathBadge } from './Badge';

export function ClassificationLegend({ compact = false }) {
  return (
    <section className="rounded border border-line bg-white p-4 shadow-panel">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-base font-semibold text-ink">Classification legend</h2>
        <p className="text-xs text-slate-500">All possible decisions used by the rule engine.</p>
      </div>
      <div className={`mt-3 grid gap-3 ${compact ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2'}`}>
        {Object.entries(IMPLEMENTATION_PATHS).map(([path, meta]) => (
          <div key={path} className="rounded border border-line bg-slate-50 p-3">
            <PathBadge path={path} />
            <p className="mt-2 text-sm font-medium text-ink">{meta.summary}</p>
            {!compact && <p className="mt-1 text-xs leading-5 text-slate-500">{meta.next}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
