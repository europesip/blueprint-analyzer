import { useEffect, useState } from 'react';
import { ArrowLeft, Boxes, Camera, Code2, FileText, GitBranch, ListChecks, SearchCheck, Sparkles } from 'lucide-react';
import { COMPONENT_RULES, IMPLEMENTATION_PATHS } from '../data/rulebook';
import { getComponentContract } from '../data/componentContracts';
import { getSourceSignature } from '../data/sourceSignatures';
import { loadFigmaNodeImage } from '../lib/figmaClient';
import { loadWebScreenshot } from '../lib/webScreenshot';
import { PathBadge, ScoreBadge } from './Badge';
import { VisualPreview } from './VisualPreview';

function findRule(item) {
  return COMPONENT_RULES.find((rule) => rule.name === item?.decision || rule.blueprint.some((component) => item?.blueprint?.includes(component)));
}

function PropTable({ contract }) {
  const entries = Object.entries(contract.props || {});
  if (!entries.length) return <p className="text-sm text-slate-500">No detailed props registered yet.</p>;
  return (
    <div className="overflow-hidden rounded border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-3 py-2">Prop</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Req.</th>
            <th className="px-3 py-2">Meaning</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([name, prop]) => (
            <tr key={name} className="border-t border-line">
              <td className="px-3 py-2 font-mono text-xs text-ink">{name}</td>
              <td className="px-3 py-2 font-mono text-xs text-slate-600">{prop.type}</td>
              <td className="px-3 py-2 text-slate-600">{prop.required ? 'Yes' : 'No'}</td>
              <td className="px-3 py-2 text-slate-600">{prop.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComponentSourceDetails({ component, contract }) {
  const signature = getSourceSignature(component);
  return (
    <details className="rounded border border-line bg-slate-50 p-3" open={Boolean(signature?.sourceExcerpt)}>
      <summary className="cursor-pointer font-mono text-sm font-semibold text-ink">{component}</summary>
      <div className="mt-3 grid gap-3">
        <div>
          <h5 className="text-xs uppercase text-slate-500">Contract purpose</h5>
          <p className="mt-1 text-sm leading-6 text-slate-600">{contract.purpose}</p>
        </div>
        <div>
          <h5 className="text-xs uppercase text-slate-500">ZIP / WCM references</h5>
          <div className="mt-2 flex flex-wrap gap-2">
            {(contract.sourceRefs || []).map((ref) => (
              <span key={ref} className="rounded border border-line bg-white px-2 py-1 font-mono text-xs text-slate-600">
                {ref}
              </span>
            ))}
          </div>
        </div>
        {signature && (
          <>
            <div>
              <h5 className="text-xs uppercase text-slate-500">Readable package source</h5>
              <p className="mt-1 font-mono text-xs leading-5 text-slate-600">{signature.source}</p>
            </div>
            <div>
              <h5 className="text-xs uppercase text-slate-500">Classes / props from source</h5>
              <div className="mt-2 flex flex-wrap gap-2">
                {[...(signature.cssClasses || []).slice(0, 10), ...(signature.propNames || []).slice(0, 8)].map((entry) => (
                  <span key={entry} className="rounded bg-white px-2 py-1 font-mono text-xs text-slate-700">
                    {entry}
                  </span>
                ))}
              </div>
            </div>
            {signature.sourceExcerpt && (
              <pre className="max-h-72 overflow-auto rounded bg-slate-950 p-3 text-xs leading-5 text-slate-100">
                <code>{signature.sourceExcerpt}</code>
              </pre>
            )}
          </>
        )}
        <div>
          <h5 className="text-xs uppercase text-slate-500">Representative usage</h5>
          <pre className="mt-2 overflow-auto rounded bg-slate-950 p-3 text-xs leading-5 text-slate-100">
            <code>{contract.usage}</code>
          </pre>
        </div>
      </div>
    </details>
  );
}

function SourceSnapshot({ item, project, settings }) {
  const [state, setState] = useState({ loading: false, url: '', error: '', warning: '', mode: '' });
  const [activeView, setActiveView] = useState('live');
  const source = project?.sourceContext;
  const nodeId = item?.collection?.representativeId || item?.id;
  const sourceType = source?.type || item?.preview?.sourceType || 'unknown';
  const isFigma = sourceType === 'figma';
  const isWeb = sourceType === 'web';
  const sourceLabel = isFigma ? 'Figma' : sourceType === 'web' ? 'Web' : sourceType === 'file' ? 'Imported file' : 'Source';

  useEffect(() => {
    let cancelled = false;
    if (!item || !source?.input) {
      setState({ loading: false, url: '', error: '', warning: '', mode: '' });
      return () => {
        cancelled = true;
      };
    }
    if (isWeb) {
      setActiveView('live');
      setState({ loading: true, url: '', error: '', warning: '', mode: '' });
      loadWebScreenshot({
        url: source.input,
        maxAgeHours: settings?.cacheMaxAgeHours || 6,
      })
        .then((result) => {
          if (!cancelled) setState({ loading: false, url: result.image, error: '', warning: result.warning || '', mode: result.mode || 'screenshot' });
        })
        .catch((err) => {
          if (!cancelled) setState({ loading: false, url: '', error: err.message, warning: '', mode: '' });
        });
      return () => {
        cancelled = true;
      };
    }
    if (!isFigma || !nodeId || String(nodeId).startsWith('group:')) {
      setState({ loading: false, url: '', error: '', warning: '', mode: '' });
      return () => {
        cancelled = true;
      };
    }

    setActiveView('live');
    setState({ loading: true, url: '', error: '', warning: '', mode: '' });
    loadFigmaNodeImage({
      input: source.input,
      nodeId,
      token: settings?.figmaApiKey,
      maxAgeHours: settings?.cacheMaxAgeHours || 6,
      })
      .then((result) => {
        if (!cancelled) setState({ loading: false, url: result.url, error: '', warning: '', mode: 'figma-render' });
      })
      .catch((err) => {
        if (!cancelled) setState({ loading: false, url: '', error: err.message, warning: '', mode: '' });
      });
    return () => {
      cancelled = true;
    };
  }, [item, isFigma, isWeb, nodeId, settings?.cacheMaxAgeHours, settings?.figmaApiKey, source?.input]);

  return (
    <div className="rounded border border-line bg-slate-950 p-3">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs text-slate-300">
        <span className="inline-flex items-center gap-2">
          <Camera size={14} />
          {sourceLabel} visual reference
        </span>
        {item?.collection?.count ? <span className="rounded bg-white/10 px-2 py-1">{item.collection.count} grouped instances</span> : null}
      </div>
      {isWeb && (
        <div className="mb-2 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveView('live')}
            className={`h-8 rounded border px-3 text-xs ${activeView === 'live' ? 'border-brand bg-brand text-white' : 'border-white/20 text-slate-200 hover:border-brand'}`}
          >
            Live screenshot
          </button>
          <button
            type="button"
            onClick={() => setActiveView('schematic')}
            className={`h-8 rounded border px-3 text-xs ${activeView === 'schematic' ? 'border-brand bg-brand text-white' : 'border-white/20 text-slate-200 hover:border-brand'}`}
          >
            DOM schematic
          </button>
        </div>
      )}
      <div className="flex min-h-72 items-center justify-center overflow-hidden rounded bg-white">
        {activeView === 'live' && state.url ? (
          <div className="w-full p-3">
            <img src={state.url} alt={`${sourceLabel} visual reference for ${item.name}`} className="max-h-[460px] w-full rounded object-contain" />
            {state.warning && <p className="mt-3 text-center text-xs text-warn">{state.warning}</p>}
            {state.mode === 'fallback' && <p className="mt-1 text-center text-xs text-slate-500">Using generated fallback image. Install Playwright on the server to capture the live page.</p>}
          </div>
        ) : (
          <div className="w-full p-4">
            <VisualPreview preview={item.preview} variant="large" />
            {!isFigma && <p className="mt-3 text-center text-xs text-slate-500">DOM schematic generated from the scraped HTML structure.</p>}
            {state.loading && <p className="mt-3 text-center text-sm text-slate-500">{isWeb ? 'Capturing live web screenshot...' : 'Loading Figma node render...'}</p>}
            {state.error && <p className="mt-3 text-center text-xs text-risk">{state.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export function ComponentDetailPage({ item, project, settings, onBack }) {
  if (!item) {
    return (
      <section className="rounded border border-line bg-white p-6 shadow-panel">
        <button type="button" onClick={onBack} className="inline-flex h-10 items-center gap-2 rounded border border-line px-3 text-sm text-slate-700">
          <ArrowLeft size={16} />
          Back
        </button>
        <p className="mt-4 text-sm text-slate-500">No component selected.</p>
      </section>
    );
  }

  const rule = findRule(item);
  const pathMeta = IMPLEMENTATION_PATHS[item.path];
  const sourceType = project?.sourceContext?.type || 'unknown';
  const sourceLabel = sourceType === 'figma' ? 'Figma' : sourceType === 'web' ? 'Web' : sourceType === 'file' ? 'Imported file' : 'Source';
  const sourceElementLabel = sourceType === 'web' ? 'DOM element' : sourceType === 'figma' ? 'Figma node' : 'Source element';
  const pathNext =
    sourceType === 'web'
      ? pathMeta.next.replace('Figma structure, layer names, content', 'web DOM structure, semantic tags, content')
      : pathMeta.next;
  const primaryComponent = item.blueprint?.[0] || item.decision;
  const primaryContract = getComponentContract(primaryComponent);
  const primarySignature = getSourceSignature(primaryComponent);
  const contracts = (item.blueprint || []).slice(0, 3).map((component) => [component, getComponentContract(component)]);
  const primary = item.blueprint?.[0];
  const relatedPages = [
    ...new Set(
      (project?.analysis?.items || [])
        .filter((candidate) => candidate.id !== item.id && (candidate.blueprint?.[0] === primary || candidate.decision === item.decision))
        .map((candidate) => candidate.pageName)
        .filter(Boolean)
    ),
  ];

  return (
    <section className="space-y-5">
      <div className="rounded border border-line bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <button type="button" onClick={onBack} className="mb-4 inline-flex h-10 items-center gap-2 rounded border border-line px-3 text-sm text-slate-700 hover:border-brand">
              <ArrowLeft size={16} />
              Back to analysis
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <PathBadge path={item.path} />
              <ScoreBadge value={item.confidence} />
              <span className="rounded border border-line px-2 py-1 font-mono text-xs text-slate-500">{item.effort}</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal text-ink">{item.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {project?.name} / {item.pageName}
            </p>
          </div>
          <div className="w-full lg:max-w-xl">
            <SourceSnapshot item={item} project={project} settings={settings} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <section className="rounded border border-line bg-white p-5 shadow-panel">
            <div className="flex items-center gap-2">
              <Sparkles className="text-brand" size={20} />
              <h3 className="font-semibold text-ink">Mapping decision</h3>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded border border-line bg-slate-50 p-3">
                <div className="text-xs uppercase text-slate-500">Mapped as</div>
                <div className="mt-1 font-semibold text-ink">{item.decision}</div>
              </div>
              <div className="rounded border border-line bg-slate-50 p-3">
                <div className="text-xs uppercase text-slate-500">Primary component</div>
                <div className="mt-1 font-mono text-sm text-ink">{primaryComponent}</div>
              </div>
              <div className="rounded border border-line bg-slate-50 p-3">
                <div className="text-xs uppercase text-slate-500">Route</div>
                <div className="mt-1 font-semibold text-ink">{pathMeta.label}</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{rule?.description || pathMeta.summary}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{pathNext}</p>
          </section>

          <section className="rounded border border-line bg-white p-5 shadow-panel">
            <div className="flex items-center gap-2">
              <ListChecks className="text-brand" size={20} />
              <h3 className="font-semibold text-ink">Why the engine chose it</h3>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-ink">Evidence</h4>
                <ul className="mt-2 space-y-2">
                  {(item.evidence.length ? item.evidence : ['No strong evidence captured. Manual review required.']).map((entry) => (
                    <li key={entry} className="rounded border border-line bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      {entry}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ink">Alternatives</h4>
                <div className="mt-2 space-y-2">
                  {item.alternatives.map((alt) => (
                    <div key={alt.id} className="rounded border border-line bg-slate-50 px-3 py-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-ink">{alt.name}</span>
                        <span className="font-mono text-xs text-slate-500">{alt.score}%</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {alt.blueprint.map((component) => (
                          <span key={component} className="rounded bg-white px-2 py-1 font-mono text-xs text-slate-600">
                            {component}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded border border-line bg-white p-5 shadow-panel">
            <div className="flex items-center gap-2">
              <SearchCheck className="text-brand" size={20} />
              <h3 className="font-semibold text-ink">How this was detected</h3>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded border border-line bg-slate-50 p-3">
                <div className="text-xs uppercase text-slate-500">Detection role</div>
                <div className="mt-1 font-semibold text-ink">{item.detection?.role || 'Component candidate'}</div>
              </div>
              <div className="rounded border border-line bg-slate-50 p-3">
                <div className="text-xs uppercase text-slate-500">{sourceElementLabel}</div>
                <div className="mt-1 font-mono text-sm text-ink">{item.detection?.sourceNodeType || item.type}</div>
              </div>
              <div className="rounded border border-line bg-slate-50 p-3">
                <div className="text-xs uppercase text-slate-500">{sourceType === 'web' ? 'DOM children summarized' : 'Children considered'}</div>
                <div className="mt-1 font-mono text-sm text-ink">{item.detection?.childCandidateCount || item.hierarchy?.childCandidateCount || 0}</div>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {(item.detection?.reasons || []).map((reason) => (
                <li key={reason} className="rounded border border-line bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
                  {reason}
                </li>
              ))}
            </ul>
            {sourceType === 'figma' ? (
              <div className="mt-4 rounded border border-warn/30 bg-warn/10 px-3 py-2 text-sm leading-6 text-warn">
                Full Figma screens/artboards are filtered out before matching. If a page frame appears as a component, refresh the analysis so it can be reprocessed with the current screen-frame filter.
              </div>
            ) : null}
          </section>

          <section className="rounded border border-line bg-white p-5 shadow-panel">
            <div className="flex items-center gap-2">
              <Code2 className="text-brand" size={20} />
              <h3 className="font-semibold text-ink">Readable source match</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This section uses signatures derived from the readable Blueprint source/package implementation, not only Storybook metadata.
            </p>
            {primarySignature ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded border border-line bg-slate-50 p-3">
                  <h4 className="text-sm font-semibold text-ink">Source file</h4>
                  <p className="mt-2 font-mono text-xs leading-5 text-slate-600">{primarySignature.source}</p>
                </div>
                <div className="rounded border border-line bg-slate-50 p-3">
                  <h4 className="text-sm font-semibold text-ink">Matched source signals</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(item.sourceMatches || [])
                      .filter((match) => match.sourceScore > 0)
                      .slice(0, 4)
                      .map((match) => (
                        <span key={match.component} className="rounded border border-brand/30 bg-brand/10 px-2 py-1 font-mono text-xs text-brand">
                          {match.component}: {match.sourceScore}
                        </span>
                      ))}
                    {!item.sourceMatches?.some((match) => match.sourceScore > 0) && <span className="text-sm text-slate-500">No direct class/prop hit; mapping is semantic/structural.</span>}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-semibold text-ink">Source CSS/classes</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {primarySignature.cssClasses.map((className) => (
                      <span key={className} className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                        {className}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-semibold text-ink">Source render notes</h4>
                  <ul className="mt-2 space-y-2">
                    {primarySignature.renderHints.map((hint) => (
                      <li key={hint} className="rounded border border-line bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
                {primarySignature.sourceExcerpt && (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-semibold text-ink">Readable source excerpt (condensed)</h4>
                    <pre className="mt-2 max-h-72 overflow-auto rounded bg-slate-950 p-3 text-xs leading-5 text-slate-100">
                      <code>{primarySignature.sourceExcerpt}</code>
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No readable-source signature registered yet for {primaryComponent}.</p>
            )}
          </section>

          <section className="rounded border border-line bg-white p-5 shadow-panel">
            <div className="flex items-center gap-2">
              <Boxes className="text-brand" size={20} />
              <h3 className="font-semibold text-ink">Component contract</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{primaryContract.purpose}</p>
            <div className="mt-4 space-y-5">
              {contracts.map(([component, contract]) => (
                <article key={component} className="rounded border border-line p-4">
                  <h4 className="font-mono text-sm font-semibold text-ink">{component}</h4>
                  <p className="mt-1 text-sm text-slate-600">{contract.purpose}</p>
                  <div className="mt-3">
                    <PropTable contract={contract} />
                  </div>
                  <div className="mt-3">
                    <h5 className="text-sm font-semibold text-ink">WCM / Portal contract</h5>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {contract.wcm.map((entry) => (
                        <span key={entry} className="rounded border border-line bg-slate-50 px-2 py-1 text-xs text-slate-600">
                          {entry}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded border border-line bg-white p-5 shadow-panel">
            <div className="flex items-center gap-2">
              <Code2 className="text-brand" size={20} />
              <h3 className="font-semibold text-ink">Source and usage reference</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Expand each candidate to inspect the local Blueprint package/WCM references, usage contract, classes, props and readable source excerpts captured from the supplied ZIP/TAR material.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-ink">Where to validate</h4>
                <ul className="mt-2 space-y-2">
                  {primaryContract.sourceRefs.map((ref) => (
                    <li key={ref} className="rounded border border-line bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600">
                      {ref}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ink">Representative usage</h4>
                <pre className="mt-2 overflow-auto rounded bg-slate-950 p-3 text-xs leading-5 text-slate-100">
                  <code>{primaryContract.usage}</code>
                </pre>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {contracts.map(([component, contract]) => (
                <ComponentSourceDetails key={component} component={component} contract={contract} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded border border-line bg-white p-5 shadow-panel">
            <div className="flex items-center gap-2">
              <FileText className="text-brand" size={20} />
              <h3 className="font-semibold text-ink">{sourceLabel} context</h3>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="rounded border border-line bg-slate-50 p-3">
                <dt className="text-xs uppercase text-slate-500">Type</dt>
                <dd className="mt-1 font-mono text-slate-700">{item.type || 'Unknown'}</dd>
              </div>
              <div className="rounded border border-line bg-slate-50 p-3">
                <dt className="text-xs uppercase text-slate-500">Bounds</dt>
                <dd className="mt-1 font-mono text-slate-700">
                  {Math.round(item.bounds?.width || 0)} x {Math.round(item.bounds?.height || 0)}
                </dd>
              </div>
              <div className="rounded border border-line bg-slate-50 p-3">
                <dt className="text-xs uppercase text-slate-500">Parent</dt>
                <dd className="mt-1 text-slate-700">{item.hierarchy?.parentName || 'Top-level candidate'}</dd>
              </div>
              <div className="rounded border border-line bg-slate-50 p-3">
                <dt className="text-xs uppercase text-slate-500">Nested candidates absorbed</dt>
                <dd className="mt-1 font-mono text-slate-700">{item.hierarchy?.childCandidateCount || 0}</dd>
              </div>
              {item.collection?.grouped && (
                <div className="rounded border border-line bg-brand/5 p-3">
                  <dt className="text-xs uppercase text-slate-500">Repeated instances consolidated</dt>
                  <dd className="mt-1 font-mono text-brand">{item.collection.count}</dd>
                </div>
              )}
            </dl>
          </section>

          {item.collection?.members?.length ? (
            <section className="rounded border border-line bg-white p-5 shadow-panel">
              <div className="flex items-center gap-2">
                <Boxes className="text-brand" size={20} />
                <h3 className="font-semibold text-ink">Grouped instances</h3>
              </div>
              <div className="mt-3 max-h-72 space-y-2 overflow-auto">
                {item.collection.members.slice(0, 12).map((member) => (
                  <div key={member.id} className="rounded border border-line bg-slate-50 px-3 py-2 text-sm">
                    <div className="font-medium text-ink">{member.name}</div>
                    <div className="mt-1 font-mono text-xs text-slate-500">
                      {Math.round(member.width)} x {Math.round(member.height)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded border border-line bg-white p-5 shadow-panel">
            <div className="flex items-center gap-2">
              <GitBranch className="text-brand" size={20} />
              <h3 className="font-semibold text-ink">Reuse context</h3>
            </div>
            {relatedPages.length ? (
              <p className="mt-3 text-sm leading-6 text-slate-600">Similar mapping appears in: {relatedPages.join(', ')}.</p>
            ) : (
              <p className="mt-3 text-sm leading-6 text-slate-600">No other page in this analysis currently maps to the same primary Blueprint component.</p>
            )}
          </section>

          <section className="rounded border border-line bg-white p-5 shadow-panel">
            <div className="flex items-center gap-2">
              <GitBranch className="text-brand" size={20} />
              <h3 className="font-semibold text-ink">Implementation notes</h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>Do not implement inner buttons/cards separately when they are structural children of this block.</li>
              <li>Validate whether visual differences can be handled by Config Styles before creating an extension.</li>
              <li>Confirm the WCM authoring model before moving to phase 2 code generation or Portal upload.</li>
            </ul>
          </section>
        </aside>
      </div>
    </section>
  );
}
