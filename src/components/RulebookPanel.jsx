import { COMPONENT_RULES, MATERIALS, REVIEW_CHECKS } from '../data/rulebook';
import { t } from '../i18n';
import { PathBadge } from './Badge';
import { ClassificationLegend } from './ClassificationLegend';

function ComponentSketch({ id }) {
  if (id === 'hero-banner') {
    return (
      <div className="h-28 rounded border border-line bg-white p-3">
        <div className="h-full rounded bg-brand/10 p-3">
          <div className="h-3 w-1/2 rounded bg-brand/50" />
          <div className="mt-2 h-2 w-2/3 rounded bg-slate-300" />
          <div className="mt-4 h-5 w-20 rounded bg-brand" />
        </div>
      </div>
    );
  }
  if (id === 'card') {
    return (
      <div className="grid h-28 grid-cols-3 gap-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded border border-line bg-white p-2">
            <div className="h-10 rounded bg-slate-200" />
            <div className="mt-2 h-2 rounded bg-slate-300" />
            <div className="mt-1 h-2 w-2/3 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }
  if (id === 'carousel') {
    return (
      <div className="h-28 rounded border border-line bg-white p-3">
        <div className="flex h-20 items-center gap-2">
          <div className="h-14 w-6 rounded bg-slate-100" />
          <div className="h-20 flex-1 rounded bg-brand/15" />
          <div className="h-14 w-6 rounded bg-slate-100" />
        </div>
        <div className="mt-2 flex justify-center gap-1">
          {[1, 2, 3].map((dot) => <span key={dot} className="h-1.5 w-1.5 rounded-full bg-brand/60" />)}
        </div>
      </div>
    );
  }
  if (id === 'catalog') {
    return (
      <div className="grid h-28 grid-cols-[90px_1fr] gap-2 rounded border border-line bg-white p-2">
        <div className="space-y-2 border-r border-line pr-2">
          {[1, 2, 3].map((item) => <div key={item} className="h-3 rounded bg-slate-200" />)}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((item) => <div key={item} className="rounded bg-slate-100" />)}
        </div>
      </div>
    );
  }
  if (id === 'accordion') {
    return (
      <div className="h-28 space-y-2 rounded border border-line bg-white p-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded border border-line p-2">
            <div className="h-2 w-3/4 rounded bg-slate-300" />
          </div>
        ))}
      </div>
    );
  }
  if (id === 'navigation' || id === 'footer') {
    return (
      <div className="h-28 rounded border border-line bg-white p-3">
        <div className={`flex h-8 items-center gap-2 rounded ${id === 'navigation' ? 'bg-brand/15' : 'bg-slate-100'} px-2`}>
          <div className="h-4 w-16 rounded bg-brand/50" />
          {[1, 2, 3].map((item) => <div key={item} className="h-2 w-12 rounded bg-slate-300" />)}
        </div>
        <div className="mt-7 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((item) => <div key={item} className="h-2 rounded bg-slate-200" />)}
        </div>
      </div>
    );
  }
  if (id === 'search') {
    return (
      <div className="h-28 rounded border border-line bg-white p-4">
        <div className="flex h-10 items-center rounded border border-line px-3">
          <div className="h-4 w-4 rounded-full border-2 border-brand" />
          <div className="ml-3 h-2 flex-1 rounded bg-slate-200" />
        </div>
        <div className="mt-4 space-y-2">
          {[1, 2].map((item) => <div key={item} className="h-2 rounded bg-slate-200" />)}
        </div>
      </div>
    );
  }
  if (id === 'form') {
    return (
      <div className="h-28 space-y-2 rounded border border-line bg-white p-3">
        {[1, 2].map((item) => <div key={item} className="h-8 rounded border border-line bg-slate-50" />)}
        <div className="h-7 w-24 rounded bg-brand" />
      </div>
    );
  }
  if (id === 'data-app') {
    return (
      <div className="grid h-28 grid-cols-2 gap-2 rounded border border-line bg-white p-2">
        <div className="rounded bg-slate-100 p-2">
          <div className="h-3 w-12 rounded bg-brand/40" />
          <div className="mt-5 h-10 rounded bg-brand/20" />
        </div>
        <div className="space-y-2 rounded bg-slate-50 p-2">
          {[1, 2, 3, 4].map((item) => <div key={item} className="h-2 rounded bg-slate-300" />)}
        </div>
      </div>
    );
  }
  return (
    <div className="h-28 rounded border border-line bg-white p-3">
      <div className="h-full rounded bg-slate-100" />
    </div>
  );
}

export function RulebookPanel({ language = 'en' }) {
  return (
    <section className="space-y-5">
      <ClassificationLegend compact />

      <div className="rounded border border-line bg-white p-5 shadow-panel">
        <h2 className="text-lg font-semibold text-ink">Reference Materials</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {MATERIALS.map((material) => (
            <div key={material.id} className="rounded border border-line p-4">
              <div className="font-medium text-ink">{material.name}</div>
              <div className="mt-1 text-sm font-medium text-brand">{material.role}</div>
              <p className="mt-2 text-sm text-slate-600">{material.use}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded border border-line bg-white p-5 shadow-panel">
        <h2 className="text-lg font-semibold text-ink">Classification Rules</h2>
        <div className="mt-4 grid gap-3">
          {COMPONENT_RULES.map((rule) => (
            <div key={rule.id} className="rounded border border-line p-4">
              <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)_auto] md:items-start">
                <ComponentSketch id={rule.id} />
                <div>
                  <div className="font-medium text-ink">{rule.name}</div>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{rule.description}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {rule.blueprint.map((bp) => (
                      <span key={bp} className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                        {bp}
                      </span>
                    ))}
                  </div>
                </div>
                <PathBadge path={rule.path} />
              </div>
              <p className="mt-3 text-sm text-slate-600">{rule.wcm}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {rule.keywords.map((word) => (
                  <span key={word} className="rounded border border-line px-2 py-1 text-xs text-slate-500">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded border border-line bg-white p-5 shadow-panel">
        <h2 className="text-lg font-semibold text-ink">{t(language, 'review')} Checks</h2>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {REVIEW_CHECKS.map((check) => (
            <div key={check} className="rounded border border-line bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {check}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
