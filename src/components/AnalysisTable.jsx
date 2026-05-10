import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Download, Eye, Image, Layers3, Share2, Zap } from 'lucide-react';
import { exportAnalysis } from '../lib/analyzer';
import { loadFigmaNodeImage } from '../lib/figmaClient';
import { t } from '../i18n';
import { PathBadge, ScoreBadge } from './Badge';
import { VisualPreview } from './VisualPreview';

function downloadText(filename, content) {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const PATH_ACCENT = {
  OOTB_BLUEPRINT:     'border-l-brand bg-gradient-to-r from-brand/5 to-transparent',
  CONFIG_STYLE:       'border-l-signal bg-gradient-to-r from-signal/5 to-transparent',
  BLUEPRINT_EXTENSION:'border-l-warn  bg-gradient-to-r from-warn/5  to-transparent',
  WCM_CONTENT:        'border-l-brand bg-gradient-to-r from-brand/5 to-transparent',
  PORTAL_NATIVE:      'border-l-signal bg-gradient-to-r from-signal/5 to-transparent',
  SCRIPT_APP:         'border-l-risk  bg-gradient-to-r from-risk/5  to-transparent',
  REVIEW:             'border-l-slate-300 bg-gradient-to-r from-slate-100/60 to-transparent',
};

const CONFIDENCE_TONE = (v) =>
  v >= 80 ? 'bg-brand' : v >= 65 ? 'bg-warn' : 'bg-risk';

function ConfidenceBar({ value }) {
  return (
    <div className="mt-1 flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${CONFIDENCE_TONE(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <ScoreBadge value={value} />
    </div>
  );
}

function FigmaThumb({ item, sourceContext, settings, visible }) {
  const [state, setState] = useState({ loading: false, url: null, error: false });
  const nodeId = item?.collection?.representativeId || item?.id;
  const isFigma = sourceContext?.type === 'figma';

  useEffect(() => {
    if (!visible || !isFigma || !sourceContext?.input || !nodeId || String(nodeId).startsWith('group:')) return;
    setState({ loading: true, url: null, error: false });
    loadFigmaNodeImage({
      input: sourceContext.input,
      nodeId,
      token: settings?.figmaApiKey,
      scale: 1,
      maxAgeHours: settings?.cacheMaxAgeHours || 6,
    })
      .then((r) => setState({ loading: false, url: r.url, error: false }))
      .catch(() => setState({ loading: false, url: null, error: true }));
  }, [visible, isFigma, sourceContext?.input, nodeId, settings?.figmaApiKey]);

  if (!isFigma || !visible) {
    return (
      <div className="w-28 shrink-0">
        <VisualPreview preview={item.preview} />
      </div>
    );
  }

  if (state.loading) {
    return (
      <div className="flex h-20 w-28 shrink-0 animate-pulse items-center justify-center rounded border border-line bg-slate-100">
        <Image size={16} className="text-slate-300" />
      </div>
    );
  }

  if (state.url) {
    return (
      <div className="w-28 shrink-0 overflow-hidden rounded border border-line bg-slate-950 shadow-sm">
        <img
          src={state.url}
          alt={item.name}
          className="h-20 w-full object-cover object-top"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="w-28 shrink-0">
      <VisualPreview preview={item.preview} />
    </div>
  );
}

function CardEntry({ entry, representative, selectedId, onSelect, viewMode, showFigmaPreviews, sourceContext, settings, entryIndex }) {
  const ref = useRef(null);
  const [intersected, setIntersected] = useState(false);

  useEffect(() => {
    if (!showFigmaPreviews) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([ob]) => { if (ob.isIntersecting) { setIntersected(true); observer.disconnect(); } },
      { rootMargin: '120px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [showFigmaPreviews]);

  const selected = selectedId === representative.id;
  const isFamily = viewMode === 'families' && entry.representativeId;
  const path = entry.path || representative.path;
  const accent = PATH_ACCENT[path] || PATH_ACCENT.REVIEW;

  return (
    <article
      ref={ref}
      className={`rounded border-l-4 bg-white shadow-sm transition-all duration-150 ${accent} ${
        selected ? 'ring-2 ring-brand ring-offset-1' : 'hover:shadow-md'
      }`}
    >
      <div className="flex gap-3 p-3">
        <FigmaThumb
          item={representative}
          sourceContext={sourceContext}
          settings={settings}
          visible={intersected || (showFigmaPreviews && entryIndex < 4)}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="truncate font-semibold text-ink">{entry.name || representative.name}</h4>
              <p className="mt-0.5 text-sm text-slate-600 line-clamp-1">{entry.decision || representative.decision}</p>
            </div>
          </div>
          <ConfidenceBar value={entry.confidence || representative.confidence} />
          <div className="mt-2 flex flex-wrap gap-1.5">
            <PathBadge path={path} />
            {(entry.review || representative.review) && (
              <span className="inline-flex items-center gap-1 rounded border border-warn/30 bg-warn/10 px-2 py-1 text-xs font-medium text-warn">
                <AlertTriangle size={12} />
                Review
              </span>
            )}
            {isFamily && entry.instanceCount > 1 && (
              <span className="inline-flex items-center gap-1 rounded border border-brand/30 bg-brand/10 px-2 py-1 text-xs font-medium text-brand">
                <Share2 size={12} />
                {entry.instanceCount} variants
              </span>
            )}
            {representative.collection?.grouped && (
              <span className="inline-flex items-center gap-1 rounded border border-brand/30 bg-brand/10 px-2 py-1 text-xs font-medium text-brand">
                <Layers3 size={12} />
                {representative.collection.count} instances
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {(entry.blueprint || representative.blueprint || []).slice(0, 3).map((bp) => (
              <span key={bp} className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600">
                {bp}
              </span>
            ))}
          </div>
          {isFamily ? (
            <p className="mt-1.5 line-clamp-1 text-xs text-slate-400">
              {entry.pages?.join(', ') || 'Unknown'} · {entry.devices?.join(', ') || 'Unknown'}
            </p>
          ) : (
            <p className="mt-1.5 line-clamp-1 text-xs text-slate-400">
              {representative.evidence?.[0] || ''}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end border-t border-line/60 px-3 py-2">
        <button
          type="button"
          onClick={() => onSelect(representative.id)}
          className="inline-flex h-8 items-center gap-1.5 rounded border border-brand bg-brand px-3 text-xs font-medium text-white hover:bg-brand/90"
        >
          <Eye size={13} />
          Review
        </button>
      </div>
    </article>
  );
}

export function AnalysisTable({ analysis, selectedId, onSelect, language = 'en', project, settings }) {
  const [viewMode, setViewMode] = useState('families');
  const [groupMode, setGroupMode] = useState('page');
  const [showFigmaPreviews, setShowFigmaPreviews] = useState(false);

  if (!analysis) return null;

  const isFigmaSource = analysis.source === 'figma-rest';
  const sourceType = isFigmaSource ? 'figma' : analysis.source === 'web-page' ? 'web' : 'source';
  const nodeLabel = sourceType === 'figma' ? 'Figma nodes' : sourceType === 'web' ? 'DOM elements' : 'source elements';
  const nodeSingularLabel = sourceType === 'figma' ? 'node' : sourceType === 'web' ? 'element' : 'source item';
  const nodeGroupLabel = sourceType === 'figma' ? 'Figma node type' : sourceType === 'web' ? 'DOM element type' : 'Source element type';
  const sourceContext = project?.sourceContext;

  const itemById = new Map((analysis.items || []).map((item) => [item.id, item]));
  const families = analysis.families?.length ? analysis.families : [];
  const sourceItems = viewMode === 'families' && families.length ? families : analysis.items || [];

  function representativeOf(entry) {
    return entry.representativeId ? itemById.get(entry.representativeId) : entry;
  }

  function groupKey(entry) {
    const representative = representativeOf(entry) || entry;
    if (groupMode === 'device') return viewMode === 'families' ? (entry.devices?.join(' + ') || 'Unknown') : (representative.device || 'Unknown');
    if (groupMode === 'node') return viewMode === 'families' ? (entry.nodeGroups?.join(' + ') || 'Unknown') : (representative.nodeGroup || representative.type || 'Unknown');
    if (groupMode === 'blueprint') return entry.blueprint?.[0] || representative.blueprint?.[0] || 'Pending review';
    if (viewMode === 'families') {
      if (entry.sharedAcrossPages) return 'Shared across pages';
      return entry.pages?.[0] || representative.pageName || 'Page';
    }
    return representative.pageName || 'Page';
  }

  const grouped = (() => {
    const acc = {};
    sourceItems.forEach((entry) => {
      const key = groupKey(entry);
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
    });
    return acc;
  })();

  const groupedEntries = Object.entries(grouped).map(([name, entries]) => [
    name,
    [...entries].sort((a, b) => {
      const aRep = representativeOf(a) || a;
      const bRep = representativeOf(b) || b;
      return (aRep.bounds?.y || 0) - (bRep.bounds?.y || 0) || (aRep.bounds?.x || 0) - (bRep.bounds?.x || 0);
    }),
  ]);

  const totalFamilies = families.length || analysis.summary?.uniqueComponents || 0;
  const totalNodes = analysis.summary?.detectedNodes || analysis.items?.length || 0;

  let globalIndex = 0;

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white shadow-panel">
      {/* ── Header ── */}
      <div className="border-b border-line bg-gradient-to-r from-slate-50 to-white px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">{analysis.name}</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {analysis.source} · {analysis.rulesetVersion} ·{' '}
              {new Date(analysis.importedAt).toLocaleString(
                language === 'es' ? 'es-ES' : language === 'ar' ? 'ar-AE' : 'en-GB'
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isFigmaSource && sourceContext?.input && settings?.figmaApiKey && (
              <button
                type="button"
                onClick={() => setShowFigmaPreviews((v) => !v)}
                className={`inline-flex h-9 items-center gap-2 rounded border px-3 text-sm font-medium transition ${
                  showFigmaPreviews
                    ? 'border-brand bg-brand text-white'
                    : 'border-line bg-white text-slate-700 hover:border-brand'
                }`}
              >
                <Zap size={14} />
                {showFigmaPreviews ? 'Figma previews on' : 'Load Figma previews'}
              </button>
            )}
            <button
              type="button"
              onClick={() => downloadText(`${analysis.name || 'analysis'}.analysis.json`, exportAnalysis(analysis))}
              className="inline-flex h-9 items-center gap-2 rounded border border-line bg-white px-3 text-sm text-slate-700 hover:border-signal"
            >
              <Download size={15} />
              {t(language, 'export')}
            </button>
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="border-b border-line bg-slate-50 px-5 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setViewMode('families')}
              className={`h-9 rounded border px-3 text-sm font-medium transition ${
                viewMode === 'families'
                  ? 'border-brand bg-brand text-white shadow-sm'
                  : 'border-line bg-white text-slate-600 hover:border-brand/40'
              }`}
            >
              <Layers3 size={14} className="mr-1.5 inline" />
              Component families ({totalFamilies || totalNodes})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('nodes')}
              className={`h-9 rounded border px-3 text-sm font-medium transition ${
                viewMode === 'nodes'
                  ? 'border-brand bg-brand text-white shadow-sm'
                  : 'border-line bg-white text-slate-600 hover:border-brand/40'
              }`}
            >
              {nodeLabel} ({totalNodes})
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Group by
            <select
              value={groupMode}
              onChange={(e) => setGroupMode(e.target.value)}
              className="h-9 rounded border border-line bg-white px-3 text-sm text-ink"
            >
              <option value="page">Page / shared scope</option>
              <option value="device">Device</option>
              <option value="node">{nodeGroupLabel}</option>
              <option value="blueprint">Blueprint mapping</option>
            </select>
          </label>
        </div>
      </div>

      {/* ── Hint ── */}
      <div className="border-b border-brand/10 bg-brand/5 px-5 py-2.5 text-xs leading-5 text-slate-600">
        Component families are implementation candidates grouped from source elements, repeated instances, and responsive variants.
      </div>

      {/* ── Groups ── */}
      <div className="space-y-5 p-5">
        {groupedEntries.map(([groupName, entries]) => (
          <section key={groupName} className="rounded-lg border border-line bg-slate-50/60">
            <div className="flex items-center justify-between gap-3 rounded-t-lg border-b border-line bg-white px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Layers3 className="text-brand" size={16} />
                <h3 className="font-semibold text-ink">{groupName}</h3>
              </div>
              <span className="rounded border border-line bg-slate-50 px-2 py-0.5 font-mono text-xs text-slate-500">
                {entries.length} {viewMode === 'families' ? 'families' : `${nodeSingularLabel}s`}
              </span>
            </div>
            <div className="grid gap-3 p-3 xl:grid-cols-2">
              {entries.map((entry) => {
                const representative = representativeOf(entry) || entry;
                const idx = globalIndex++;
                return (
                  <CardEntry
                    key={entry.key || entry.id}
                    entry={entry}
                    representative={representative}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    viewMode={viewMode}
                    showFigmaPreviews={showFigmaPreviews}
                    sourceContext={sourceContext}
                    settings={settings}
                    entryIndex={idx}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
