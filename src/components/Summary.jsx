import { AlertTriangle, BarChart3, CheckCircle2, Clock3, FileDown, Info, Layers3, Puzzle, Workflow } from 'lucide-react';
import { IMPLEMENTATION_PATHS } from '../data/rulebook';
import { t } from '../i18n';

const effortDays = {
  S: 1,
  'S-M': 2,
  M: 3,
  'M-L': 5,
  L: 8,
  Review: 2,
};

const PATH_COLORS = {
  OOTB_BLUEPRINT:     { fill: '#0f766e', bg: 'bg-teal-600',   text: 'text-teal-700',   border: 'border-teal-200',   light: 'bg-teal-50'   },
  CONFIG_STYLE:       { fill: '#2563eb', bg: 'bg-blue-600',   text: 'text-blue-700',   border: 'border-blue-200',   light: 'bg-blue-50'   },
  BLUEPRINT_EXTENSION:{ fill: '#d97706', bg: 'bg-amber-500',  text: 'text-amber-700',  border: 'border-amber-200',  light: 'bg-amber-50'  },
  WCM_CONTENT:        { fill: '#0d9488', bg: 'bg-teal-500',   text: 'text-teal-600',   border: 'border-teal-100',   light: 'bg-teal-50/70'},
  PORTAL_NATIVE:      { fill: '#7c3aed', bg: 'bg-violet-600', text: 'text-violet-700', border: 'border-violet-200', light: 'bg-violet-50' },
  SCRIPT_APP:         { fill: '#dc2626', bg: 'bg-red-600',    text: 'text-red-700',    border: 'border-red-200',    light: 'bg-red-50'    },
  REVIEW:             { fill: '#94a3b8', bg: 'bg-slate-400',  text: 'text-slate-600',  border: 'border-slate-200',  light: 'bg-slate-50'  },
};

function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function donutSegments(slices, cx, cy, r) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (!total) return [];
  const segments = [];
  let offset = 0;
  for (const slice of slices) {
    const pct = slice.value / total;
    const deg = pct * 360;
    const [x1, y1] = polar(cx, cy, r, offset);
    const [x2, y2] = polar(cx, cy, r, offset + deg);
    const large = deg > 180 ? 1 : 0;
    segments.push({ ...slice, pct, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, offset });
    offset += deg;
  }
  return segments;
}

function DonutChart({ byPath, total }) {
  const cx = 80; const cy = 80; const r = 64; const hole = 44;
  const entries = Object.entries(IMPLEMENTATION_PATHS)
    .map(([key, meta]) => ({ key, label: meta.label, value: byPath[key] || 0 }))
    .filter((s) => s.value > 0);

  const segments = donutSegments(entries, cx, cy, r);

  return (
    <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:gap-6">
      <div className="relative shrink-0">
        <svg width={160} height={160} viewBox="0 0 160 160">
          {segments.map((seg) => (
            <path
              key={seg.key}
              d={seg.d}
              fill={PATH_COLORS[seg.key]?.fill || '#94a3b8'}
              className="transition-opacity hover:opacity-90"
            >
              <title>{seg.label}: {seg.value} ({Math.round(seg.pct * 100)}%)</title>
            </path>
          ))}
          <circle cx={cx} cy={cy} r={hole} fill="white" />
          <text x={cx} y={cy - 6} textAnchor="middle" className="fill-slate-800 text-base font-bold" fontSize={20} fontWeight="700" fill="#1e293b">{total}</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill="#94a3b8">families</text>
        </svg>
      </div>
      <div className="flex flex-wrap gap-2 lg:flex-col">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: PATH_COLORS[seg.key]?.fill || '#94a3b8' }} />
            <span className="text-xs text-slate-600">{seg.label}</span>
            <span className="font-mono text-xs font-semibold text-slate-800">{seg.value}</span>
            <span className="text-xs text-slate-400">({Math.round(seg.pct * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoHelp({ text }) {
  if (!text) return null;
  return (
    <details className="relative">
      <summary className="flex h-6 w-6 cursor-pointer list-none items-center justify-center rounded border border-line bg-white text-slate-500 hover:border-brand hover:text-brand">
        <Info size={14} />
      </summary>
      <div className="absolute right-0 z-20 mt-2 w-72 rounded border border-line bg-white p-3 text-xs leading-5 text-slate-600 shadow-xl">
        {text}
      </div>
    </details>
  );
}

function Stat({ icon: Icon, label, value, gradient, caption = '', help = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/30 p-5 shadow-panel ${gradient}`}>
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-white/80">{label}</span>
        <div className="flex items-center gap-2">
          <InfoHelp text={help} />
          <Icon className="text-white/70" size={18} />
        </div>
      </div>
      <div className="mt-3 text-4xl font-bold tracking-tight text-white">{value}</div>
      {caption && <div className="mt-1 text-xs text-white/70">{caption}</div>}
      <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
    </div>
  );
}

function topEntries(map, limit = 6) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function buildDashboard(analysis) {
  const items = analysis?.items || [];
  const families = analysis?.families || [];
  const implementationUnits = families.length ? families : items;
  const byPath = implementationUnits.reduce((acc, item) => {
    acc[item.path || 'REVIEW'] = (acc[item.path || 'REVIEW'] || 0) + 1;
    return acc;
  }, {});
  const reusable = implementationUnits.filter((item) => ['OOTB_BLUEPRINT', 'WCM_CONTENT', 'CONFIG_STYLE'].includes(item.path)).length;
  const grouped = items.filter((item) => item.collection?.grouped).length;
  const shared = families.filter((family) => family.sharedAcrossPages || family.sharedAcrossDevices || family.instanceCount > 1).length;
  const byDecision = implementationUnits.reduce((acc, item) => {
    acc[item.decision || 'Unclassified'] = (acc[item.decision || 'Unclassified'] || 0) + 1;
    return acc;
  }, {});
  const byEffort = implementationUnits.reduce((acc, item) => {
    acc[item.effort || 'Review'] = (acc[item.effort || 'Review'] || 0) + 1;
    return acc;
  }, {});
  const estimatedDays = implementationUnits.reduce((sum, item) => sum + (effortDays[item.effort] || 2), 0);
  return { items, families, implementationUnits, byPath, reusable, grouped, shared, byDecision, byEffort, estimatedDays };
}

function printReport() {
  window.print();
}

function PathBar({ path, count, total, meta }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  const colors = PATH_COLORS[path] || PATH_COLORS.REVIEW;
  return (
    <div className={`rounded-lg border p-3 ${colors.border} ${colors.light}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: colors.fill }} />
          <span className={`text-sm font-semibold truncate ${colors.text}`}>{meta.label}</span>
        </div>
        <span className="font-mono text-sm font-bold text-slate-700 shrink-0">{count}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/70">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: colors.fill }}
        />
      </div>
      <p className="mt-1.5 text-xs leading-5 text-slate-500 line-clamp-2">{meta.summary}</p>
    </div>
  );
}

function ReportDetails({ analysis, dashboard, implementationTotal, nodeLabel, reusablePct }) {
  const families = (analysis.families?.length ? analysis.families : dashboard.implementationUnits).slice(0, 35);
  return (
    <div className="report-details space-y-4">
      <section className="rounded-xl border border-line bg-white p-5 shadow-panel">
        <h3 className="font-semibold text-ink">Report interpretation</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This report separates implementation candidates from raw source elements. A component family is the planning unit: it can include several DOM elements, Figma nodes, repeated instances, or responsive variants that should normally be implemented once and reused.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-line bg-slate-50 p-3 text-sm leading-6 text-slate-600">
            <strong className="text-ink">Component families:</strong> {implementationTotal} implementation candidates derived from {analysis.summary.detectedNodes || analysis.summary.total} {nodeLabel}.
          </div>
          <div className="rounded-lg border border-line bg-slate-50 p-3 text-sm leading-6 text-slate-600">
            <strong className="text-ink">Reusable:</strong> {dashboard.reusable} families ({reusablePct}%) appear suitable for Blueprint, WCM content, or configuration-first delivery.
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-white p-5 shadow-panel">
        <h3 className="font-semibold text-ink">Priority component families</h3>
        <div className="mt-3 overflow-hidden rounded-lg border border-line">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Family</th>
                <th className="px-3 py-2">Mapped as</th>
                <th className="px-3 py-2">Route</th>
                <th className="px-3 py-2">Confidence</th>
                <th className="px-3 py-2">Scope</th>
              </tr>
            </thead>
            <tbody>
              {families.map((family) => {
                const colors = PATH_COLORS[family.path] || PATH_COLORS.REVIEW;
                return (
                  <tr key={family.key || family.id} className="border-t border-line hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium text-ink">{family.name}</td>
                    <td className="px-3 py-2 text-slate-600">{family.decision}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${colors.light} ${colors.text}`}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: colors.fill }} />
                        {family.pathLabel || IMPLEMENTATION_PATHS[family.path]?.label || family.path}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-brand" style={{ width: `${family.confidence}%` }} />
                        </div>
                        <span className="font-mono text-slate-600">{family.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {family.instanceCount ? `${family.instanceCount} variants` : 'single'}{family.pages?.length ? ` · ${family.pages.slice(0, 2).join(', ')}` : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function Summary({ analysis, language = 'en' }) {
  if (!analysis) {
    return (
      <section className="grid-bg rounded border border-line bg-white p-8 text-center shadow-panel">
        <p className="text-lg font-semibold text-ink">{t(language, 'noAnalysis')}</p>
        <p className="mt-2 text-sm text-slate-500">{t(language, 'noAnalysisHint')}</p>
      </section>
    );
  }

  const dashboard = buildDashboard(analysis);
  const sourceType = analysis.source === 'web-page' ? 'web' : analysis.source === 'figma-rest' ? 'figma' : 'source';
  const nodeLabel = sourceType === 'figma' ? 'Figma nodes' : sourceType === 'web' ? 'DOM elements' : 'source elements';
  const implementationTotal = analysis.summary.uniqueComponents || dashboard.implementationUnits.length || analysis.summary.total;
  const reusablePct = implementationTotal ? Math.round((dashboard.reusable / implementationTotal) * 100) : 0;
  const showEstimate = dashboard.estimatedDays <= 40;

  return (
    <section className="space-y-4" id="analysis-report">
      {/* ── Header card ── */}
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-panel">
        <div className="bg-gradient-to-r from-brand to-teal-400 px-5 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Analysis dashboard</h2>
              <p className="mt-1 text-sm text-white/80">
                Executive view before drilling into each candidate component. Estimate reuse, effort and Blueprint coverage.
              </p>
            </div>
            <button type="button" onClick={printReport} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-white/30 bg-white/20 px-4 text-sm font-medium text-white hover:bg-white/30 backdrop-blur-sm">
              <FileDown size={16} />
              Generate PDF report
            </button>
          </div>
        </div>
        {(analysis.meta?.excludedPageFrameCount || analysis.meta?.importGuidance) && (
          <div className="px-5 py-3 text-sm text-slate-600 border-t border-line bg-slate-50/60 space-y-1">
            {analysis.meta?.excludedPageFrameCount ? (
              <p>{analysis.meta.excludedPageFrameCount} Figma screen/page frame(s) were excluded from component matching.</p>
            ) : null}
            {analysis.meta?.importGuidance ? <p className="text-warn">{analysis.meta.importGuidance}</p> : null}
          </div>
        )}
      </div>

      {/* ── KPI stat cards ── */}
      <div className={`grid gap-3 sm:grid-cols-2 ${showEstimate ? 'xl:grid-cols-6' : 'xl:grid-cols-5'}`}>
        <Stat
          icon={Layers3}
          label="Component families"
          value={implementationTotal}
          gradient="bg-gradient-to-br from-slate-700 to-slate-900"
          caption={`${analysis.summary.detectedNodes || analysis.summary.total} ${nodeLabel} reviewed`}
          help="Implementation candidates after grouping repeated source elements and responsive variants."
        />
        <Stat
          icon={CheckCircle2}
          label="Reusable"
          value={dashboard.reusable}
          gradient="bg-gradient-to-br from-teal-500 to-teal-700"
          caption={`${reusablePct}% of families`}
          help="Families suitable for existing Blueprint components, WCM content modelling, or configuration."
        />
        <Stat
          icon={Puzzle}
          label="Shared / variants"
          value={dashboard.shared}
          gradient="bg-gradient-to-br from-blue-500 to-blue-700"
          caption="Repeated across pages or devices"
          help="Families that appear more than once. Should be implemented once and reused."
        />
        <Stat
          icon={Workflow}
          label="Impl. routes"
          value={Object.keys(dashboard.byPath).length}
          gradient="bg-gradient-to-br from-violet-500 to-violet-700"
          help="Distinct delivery paths found in the analysis."
        />
        <Stat
          icon={AlertTriangle}
          label={t(language, 'review')}
          value={analysis.summary.familyReview || analysis.summary.review}
          gradient="bg-gradient-to-br from-amber-400 to-amber-600"
          help="Families that need manual validation because confidence is low."
        />
        {showEstimate && (
          <Stat
            icon={Clock3}
            label="Estimate"
            value={`${dashboard.estimatedDays}d`}
            gradient="bg-gradient-to-br from-slate-400 to-slate-600"
            caption="Rough delivery effort"
            help="Very rough sizing based on family difficulty. Hidden when the list is too large."
          />
        )}
      </div>
      {!showEstimate && (
        <div className="rounded-xl border border-line bg-white px-4 py-3 text-sm leading-6 text-slate-600 shadow-panel">
          The rough duration estimate is hidden because the candidate list is too large for a trustworthy automated sizing.
        </div>
      )}

      {/* ── Main grid: donut + bars + top types + difficulty ── */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px]">

        {/* Classification routes with donut */}
        <div className="rounded-xl border border-line bg-white p-5 shadow-panel">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-brand" size={18} />
            <h3 className="font-semibold text-ink">Classification routes</h3>
          </div>

          <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
            <DonutChart byPath={dashboard.byPath} total={implementationTotal} />
            <div className="flex-1 grid gap-2 sm:grid-cols-2">
              {Object.entries(IMPLEMENTATION_PATHS).map(([path, meta]) => (
                <PathBar
                  key={path}
                  path={path}
                  count={dashboard.byPath[path] || 0}
                  total={implementationTotal}
                  meta={meta}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-white p-4 shadow-panel">
            <h3 className="font-semibold text-ink mb-3">Top detected types</h3>
            <div className="space-y-2">
              {topEntries(dashboard.byDecision).map(([name, count], i) => {
                const pct = implementationTotal ? Math.round((count / implementationTotal) * 100) : 0;
                const barW = implementationTotal ? (count / implementationTotal) * 100 : 0;
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="truncate text-sm text-slate-700">{name}</span>
                      <span className="font-mono text-xs text-slate-500 shrink-0">{count} · {pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${barW}%`, background: i === 0 ? '#0f766e' : i === 1 ? '#2563eb' : i === 2 ? '#7c3aed' : '#94a3b8' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white p-4 shadow-panel">
            <h3 className="font-semibold text-ink mb-3">Difficulty split</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(dashboard.byEffort).map(([effort, count]) => {
                const tone =
                  effort === 'S' ? 'bg-teal-50 border-teal-200 text-teal-700' :
                  effort === 'S-M' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                  effort === 'M' ? 'bg-violet-50 border-violet-200 text-violet-700' :
                  effort === 'M-L' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                  effort === 'L' ? 'bg-red-50 border-red-200 text-red-700' :
                  'bg-slate-50 border-slate-200 text-slate-600';
                return (
                  <span key={effort} className={`rounded-lg border px-3 py-2 text-sm ${tone}`}>
                    <span className="font-bold">{effort}</span>
                    <span className="ml-2 font-mono opacity-70">{count}</span>
                  </span>
                );
              })}
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">S = 1 day · S-M = 2 · M = 3 · M-L = 5 · L = 8</p>
          </div>
        </div>
      </div>

      <ReportDetails
        analysis={analysis}
        dashboard={dashboard}
        implementationTotal={implementationTotal}
        nodeLabel={nodeLabel}
        reusablePct={reusablePct}
      />
    </section>
  );
}
