import { IMPLEMENTATION_PATHS } from '../data/rulebook';
import { t } from '../i18n';
import { PathBadge, ScoreBadge } from './Badge';
import { VisualPreview } from './VisualPreview';

export function DetailPanel({ item, language = 'en' }) {
  if (!item) {
    return (
      <aside className="rounded border border-line bg-white p-5 shadow-panel">
        <p className="text-sm text-slate-500">Select a block to review the decision.</p>
      </aside>
    );
  }
  const pathMeta = IMPLEMENTATION_PATHS[item.path];
  return (
    <aside className="rounded border border-line bg-white p-5 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
          <p className="text-sm text-slate-500">{item.pageName}</p>
        </div>
        <ScoreBadge value={item.confidence} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <PathBadge path={item.path} />
        <span className="rounded border border-line px-2 py-1 font-mono text-xs text-slate-600">{t(language, 'effort')} {item.effort}</span>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-ink">Visual reference</h4>
          <div className="mt-2">
            <VisualPreview preview={item.preview} variant="large" />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500">
            <div className="rounded border border-line bg-slate-50 px-2 py-1">Type: {item.type || 'Unknown'}</div>
            <div className="rounded border border-line bg-slate-50 px-2 py-1">
              Bounds: {Math.round(item.bounds?.width || 0)} x {Math.round(item.bounds?.height || 0)}
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">{t(language, 'criterion')}</h4>
          <p className="mt-1 text-sm text-slate-600">{pathMeta.summary}</p>
          <p className="mt-1 text-sm text-slate-600">{pathMeta.next}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">{t(language, 'wcmPortal')}</h4>
          <p className="mt-1 text-sm text-slate-600">{item.wcm}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">{t(language, 'candidates')}</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.blueprint.map((bp) => (
              <span key={bp} className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                {bp}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">{t(language, 'evidence')}</h4>
          <ul className="mt-2 space-y-2">
            {item.evidence.length ? (
              item.evidence.map((entry) => (
                <li key={entry} className="rounded border border-line bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {entry}
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-500">No strong evidence.</li>
            )}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">{t(language, 'alternatives')}</h4>
          <div className="mt-2 space-y-2">
            {item.alternatives.map((alt) => (
              <div key={alt.id} className="flex items-center justify-between rounded border border-line px-3 py-2 text-sm">
                <span className="text-slate-700">{alt.name}</span>
                <span className="font-mono text-xs text-slate-500">{alt.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
