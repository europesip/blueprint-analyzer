import { useRef, useState } from 'react';
import { AlertTriangle, CalendarDays, Edit3, FileJson, FolderOpen, Globe2, LayoutDashboard, Play, RefreshCw, RotateCw, Trash2, Upload } from 'lucide-react';
import { normalizeDesignJson } from '../lib/figmaImport';
import { analyzeDesign } from '../lib/analyzer';
import { loadFigmaDesign } from '../lib/figmaClient';
import { loadWebPage } from '../lib/webImport';
import { buildSourceContext } from '../lib/sourceContext';
import { writeServerLog } from '../lib/serverLog';

function sourceLabel(type) {
  return {
    figma: 'Figma design',
    web: 'Web page',
    file: 'Figma export file',
    paste: 'Pasted JSON',
    sample: 'Sample',
  }[type] || 'Unknown source';
}

function sourceIcon(type) {
  if (type === 'web') return Globe2;
  if (type === 'file') return FileJson;
  return LayoutDashboard;
}

function sourceElementLabel(type) {
  if (type === 'figma') return 'Figma nodes';
  if (type === 'web') return 'DOM elements';
  return 'source elements';
}

function localeFor(language) {
  return language === 'es' ? 'es-ES' : language === 'ar' ? 'ar-AE' : 'en-GB';
}

const emptyDraft = {
  title: '',
  description: '',
  analysisType: 'dx-portal',
  sourceType: 'figma',
  figmaInput: '',
  figmaDepth: 2,
  webInput: '',
  file: null,
};

const depthOptions = [
  { value: 1, label: '1 - File/page shell', description: 'Fastest. Useful to validate access, but usually too shallow for component matching.' },
  { value: 2, label: '2 - First-pass sections', description: 'Recommended first run. Detects page frames and immediate section/component candidates.' },
  { value: 3, label: '3 - Deeper groups', description: 'Richer analysis for medium files. Can detect more nested cards, lists and content blocks.' },
  { value: 4, label: '4 - Full nested scan', description: 'Use only for small/reduced files. Complete Figma sites can exceed the safe 18 MB import limit.' },
];

const analysisTypes = [
  {
    id: 'dx-portal',
    title: 'Desarrollo en HCL DX Portal',
    description: 'Blueprint/WCM component classification and local development guidance.',
    enabled: true,
  },
  {
    id: 'geo-seo',
    title: 'Analisis GEO/SEO',
    description: 'Future module for discoverability, search and generative-engine optimization.',
    enabled: false,
  },
  {
    id: 'accessibility',
    title: 'Analisis de Accesibilidad / Compliance',
    description: 'Future module for accessibility, compliance and quality checks on live websites.',
    enabled: false,
  },
];

function analysisTypeLabel(type) {
  return analysisTypes.find((item) => item.id === type)?.title || 'Desarrollo en HCL DX Portal';
}

function waitForPaint() {
  return new Promise((resolve) => window.setTimeout(resolve, 0));
}

function ProjectCard({ project, language, onOpenProject, onEdit, onDeleteProject }) {
  const source = project.sourceContext;
  const Icon = sourceIcon(source?.type);
  const date = new Date(project.updatedAt || project.createdAt || project.analysis?.importedAt || Date.now()).toLocaleString(localeFor(language));
  const depth = source?.type === 'figma' ? source?.figmaDepth || source?.depth || project.analysis?.meta?.figmaDepth : null;
  const componentCount = project.analysis?.summary?.uniqueComponents || project.analysis?.families?.length || project.analysis?.summary?.total || project.analysis?.items?.length || 0;
  const nodeCount = project.analysis?.summary?.detectedNodes || project.analysis?.summary?.total || project.analysis?.items?.length || 0;
  const runCount = project.runCount || project.analysis?.meta?.runCount || 1;
  return (
    <article className="rounded border border-line bg-white p-4 shadow-panel transition hover:border-brand/50">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-brand/10 text-brand">
              <Icon size={18} />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-ink">{project.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="rounded border border-line bg-slate-50 px-2 py-1">{sourceLabel(source?.type)}</span>
                <span className="rounded border border-line bg-slate-50 px-2 py-1">{analysisTypeLabel(project.analysisType)}</span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={13} />
                  {date}
                </span>
                <span className="rounded border border-line bg-slate-50 px-2 py-1">{componentCount} component families</span>
                <span className="rounded border border-line bg-slate-50 px-2 py-1">{nodeCount} {sourceElementLabel(source?.type)}</span>
                <span className="rounded border border-line bg-slate-50 px-2 py-1">run #{runCount}</span>
                {depth && <span className="rounded border border-line bg-slate-50 px-2 py-1">depth {depth}</span>}
              </div>
            </div>
          </div>
          {project.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{project.description}</p>}
          {source?.input && <p className="mt-2 truncate font-mono text-xs text-slate-400">{source.input}</p>}
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <button type="button" onClick={() => onOpenProject?.(project.id)} className="inline-flex h-9 items-center gap-2 rounded border border-brand bg-brand px-3 text-sm font-medium text-white">
            <Play size={15} />
            Open
          </button>
          <button type="button" onClick={() => onEdit(project)} className="inline-flex h-9 items-center gap-2 rounded border border-line px-3 text-sm text-slate-700 hover:border-brand">
            <Edit3 size={15} />
            Modify
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete analysis "${project.name}"?`)) onDeleteProject?.(project.id);
            }}
            className="inline-flex h-9 items-center gap-2 rounded border border-risk/30 px-3 text-sm text-risk hover:bg-risk/10"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function isFigmaApiIssue(err) {
  const message = `${err?.code || ''} ${err?.status || ''} ${err?.message || ''}`.toLowerCase();
  return /figma|429|rate|throttl|timeout|blocked|too many|forbidden|unauthorized|access|payload|large|504|403|401/.test(message);
}

function ProgressBar({ progress }) {
  if (!progress.visible) return null;
  return (
    <div className="mt-5 rounded border border-brand/30 bg-brand/5 p-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-brand">{progress.label}</span>
        <span className="font-mono text-xs text-slate-500">{progress.value}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded bg-white">
        <div className="h-full rounded bg-brand transition-all duration-500" style={{ width: `${progress.value}%` }} />
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">New analyses fetch source data fresh. Existing analyses can be recalculated from cached/imported data.</p>
    </div>
  );
}

export function ImportPanel({
  settings,
  projects = [],
  onAnalysis,
  onOpenProject,
  onReanalyzeProject,
  onRefreshProject,
  onDeleteProject,
  onUpdateProject,
  language = 'en',
}) {
  const fileInputRef = useRef(null);
  const [draft, setDraft] = useState(() => ({ ...emptyDraft, figmaInput: settings.defaultFigmaUrl || '' }));
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ visible: false, value: 0, label: '' });
  const [apiDialog, setApiDialog] = useState(null);
  const sortedProjects = [...projects].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));

  function step(label, value) {
    setProgress({ visible: true, label, value });
    writeServerLog('client.progress', { label, value, sourceType: draft.sourceType, depth: draft.figmaDepth });
  }

  function showFigmaAlternatives(err) {
    const payloadTooLarge = err?.code === 'FIGMA_PAYLOAD_TOO_LARGE' || err?.status === 'payload-too-large' || err?.status === 413;
    setApiDialog({
      title: payloadTooLarge ? 'Figma file is too large for direct API import' : 'Figma API could not complete the import',
      message: err?.message || 'The Figma request did not complete. This can happen with API rate limiting, access restrictions, or very large design files.',
      status: err?.status || err?.code || '',
      payloadTooLarge,
    });
  }

  function openNewAnalysis() {
    setError('');
    setInfo('');
    setDraft({ ...emptyDraft, figmaInput: settings.defaultFigmaUrl || '', figmaDepth: Number(settings.figmaDepth || 2) });
    setShowCreate(true);
  }

  function closeNewAnalysis() {
    setShowCreate(false);
    setDraft((current) => ({ ...current, title: '', description: '', file: null }));
    setError('');
  }

  async function runJson(json, fallbackName, sourceType, input = '') {
    step('Normalizing imported design structure', 55);
    await waitForPaint();
    const normalized = normalizeDesignJson(json);
    normalized.name = draft.title.trim() || fallbackName || normalized.name;
    step('Classifying Blueprint component candidates', 78);
    await waitForPaint();
    const analysis = analyzeDesign(normalized, settings);
    step('Saving local analysis', 95);
    await waitForPaint();
    await onAnalysis(analysis, buildSourceContext({ type: sourceType, input, normalized }), { description: draft.description.trim(), analysisType: draft.analysisType });
    writeServerLog('client.analysis.file.complete', { sourceType, input, frames: normalized.frames?.length || 0, items: analysis.items?.length || 0 });
    setInfo('Analysis created from local file.');
  }

  async function createAnalysis() {
    const title = draft.title.trim();
    if (!title) {
      setError('Please provide an analysis title.');
      return;
    }
    if (draft.analysisType !== 'dx-portal') {
      setError('Modulo en Desarrollo');
      return;
    }
    setLoading(true);
    setError('');
    setInfo('');
    setApiDialog(null);
    step('Preparing analysis', 8);
    await waitForPaint();
    writeServerLog('client.analysis.start', { sourceType: draft.sourceType, depth: draft.figmaDepth, title });
    try {
      if (draft.sourceType === 'figma') {
        step(`Calling Figma API at depth ${draft.figmaDepth || settings.figmaDepth || 2}`, 24);
        await waitForPaint();
        const result = await loadFigmaDesign({
          input: draft.figmaInput,
          token: settings.figmaApiKey,
          forceRefresh: true,
          depth: Math.min(Math.max(Number(draft.figmaDepth || settings.figmaDepth || 2), 1), 4),
          maxAgeHours: settings.cacheMaxAgeHours || 24,
          proxyUrl: settings.figmaProxyUrl || '',
        });
        writeServerLog('client.figma.loaded', { depth: draft.figmaDepth, cacheHit: result.cache?.hit, rawName: result.raw?.name });
        step(result.cache.hit ? 'Loaded Figma data from cache' : 'Figma data received and cached', 52);
        await waitForPaint();
        const normalized = { ...result.normalized, name: title };
        normalized.meta = { ...(normalized.meta || {}), figmaDepth: Number(draft.figmaDepth || 2) };
        step('Classifying Blueprint component candidates', 76);
        await waitForPaint();
        const analysis = analyzeDesign(normalized, settings);
        writeServerLog('client.figma.analyzed', { frames: normalized.frames?.length || 0, items: analysis.items?.length || 0, excludedScreens: normalized.meta?.excludedPageFrameCount || 0 });
        step('Saving local analysis', 94);
        await waitForPaint();
        await onAnalysis({ ...analysis, cache: result.cache }, buildSourceContext({ type: 'figma', input: draft.figmaInput, cache: result.cache, normalized, meta: { figmaDepth: Number(draft.figmaDepth || 2) } }), {
          description: draft.description.trim(),
          analysisType: draft.analysisType,
        });
        setInfo(result.cache.hit ? 'Loaded from local cache.' : 'Fetched and cached.');
      }

      if (draft.sourceType === 'web') {
        step('Fetching web page for a fresh import', 24);
        await waitForPaint();
        const result = await loadWebPage({
          input: draft.webInput,
          forceRefresh: true,
          maxAgeHours: settings.cacheMaxAgeHours || 24,
        });
        step(result.cache.hit ? 'Loaded web page from cache' : 'Web page fetched and cached', 52);
        await waitForPaint();
        const normalized = { ...result.normalized, name: title };
        step('Classifying Blueprint component candidates', 76);
        await waitForPaint();
        const analysis = analyzeDesign(normalized, settings);
        writeServerLog('client.web.analyzed', { frames: normalized.frames?.length || 0, items: analysis.items?.length || 0 });
        step('Saving local analysis', 94);
        await waitForPaint();
        await onAnalysis({ ...analysis, cache: result.cache }, buildSourceContext({ type: 'web', input: draft.webInput, cache: result.cache, normalized }), {
          description: draft.description.trim(),
          analysisType: draft.analysisType,
        });
        setInfo(result.cache.hit ? 'Loaded from local cache.' : 'Fetched and cached.');
      }

      if (draft.sourceType === 'file') {
        if (!draft.file) throw new Error('Please select a Figma JSON export file.');
        step('Reading local Figma export file', 28);
        const text = await draft.file.text();
        if (text.length > 25_000_000) throw new Error('This JSON file is too large to process safely in the browser. Export a smaller Figma section/file or reduce the imported content.');
        await waitForPaint();
        await runJson(JSON.parse(text), title, 'file', draft.file.name);
      }
      step('Analysis ready', 100);
      writeServerLog('client.analysis.complete', { sourceType: draft.sourceType, title });
      setShowCreate(false);
      setDraft({ ...emptyDraft, figmaInput: settings.defaultFigmaUrl || '', figmaDepth: Number(settings.figmaDepth || 2) });
    } catch (err) {
      writeServerLog('client.analysis.error', { sourceType: draft.sourceType, depth: draft.figmaDepth, error: err.message, code: err.code, status: err.status });
      if (draft.sourceType === 'figma' && isFigmaApiIssue(err)) showFigmaAlternatives(err);
      else setError(err.message);
    } finally {
      setLoading(false);
      setProgress({ visible: false, value: 0, label: '' });
    }
  }

  async function runProjectAction(action, id) {
    setLoading(true);
    setError('');
    setInfo('');
    setProgress({ visible: true, value: 18, label: 'Updating analysis' });
    try {
      await action?.(id);
      setProgress({ visible: true, value: 100, label: 'Analysis updated' });
      setInfo('Analysis updated.');
      setEditProject(null);
    } catch (err) {
      if (isFigmaApiIssue(err)) showFigmaAlternatives(err);
      else setError(err.message);
    } finally {
      setLoading(false);
      setProgress({ visible: false, value: 0, label: '' });
    }
  }

  function saveEditedProject() {
    if (!editProject) return;
    onUpdateProject?.(editProject.id, {
      name: editProject.name,
      description: editProject.description || '',
      notes: editProject.notes || '',
    });
    setEditProject(null);
  }

  return (
    <section className="space-y-5">
      <div className="rounded border border-line bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Analysis library</h2>
            <p className="mt-1 text-sm text-slate-500">Review previous analyses, reopen them, modify their metadata, or recalculate from cached/imported source data.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={openNewAnalysis} className="inline-flex h-10 items-center gap-2 rounded border border-brand bg-brand px-4 text-sm font-medium text-white">
              <LayoutDashboard size={16} />
              New analysis
            </button>
          </div>
        </div>
        {info && <div className="mt-4 rounded border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-brand">{info}</div>}
        {error && <div className="mt-4 rounded border border-risk/30 bg-risk/10 px-3 py-2 text-sm text-risk">{error}</div>}
      </div>

      <div className="grid gap-4">
        {sortedProjects.length ? (
          sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} language={language} onOpenProject={onOpenProject} onEdit={setEditProject} onDeleteProject={onDeleteProject} />
          ))
        ) : (
          <div className="rounded border border-dashed border-slate-300 bg-white p-10 text-center shadow-panel">
            <FolderOpen className="mx-auto text-brand" size={34} />
            <h3 className="mt-3 text-lg font-semibold text-ink">No analyses yet</h3>
            <p className="mt-2 text-sm text-slate-500">Create the first analysis from Figma, a web page, or a manual Figma JSON export.</p>
            <button type="button" onClick={openNewAnalysis} className="mt-5 inline-flex h-10 items-center gap-2 rounded border border-brand bg-brand px-4 text-sm font-medium text-white">
              <LayoutDashboard size={16} />
              New analysis
            </button>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded border border-line bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-ink">Create a new analysis</h2>
                <p className="mt-1 text-sm text-slate-500">Name it first, then choose the source that will feed the classification engine.</p>
              </div>
              <button type="button" onClick={closeNewAnalysis} className="h-9 rounded border border-line px-3 text-sm text-slate-700 hover:border-brand">
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Analysis title</span>
                <input
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  className="h-11 w-full rounded border border-line px-3 text-sm"
                  placeholder="AGI homepage Blueprint assessment"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Brief description</span>
                <input
                  value={draft.description}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                  className="h-11 w-full rounded border border-line px-3 text-sm"
                  placeholder="Initial mapping against Blueprint/WCM components"
                />
              </label>
            </div>

            <div className="mt-5">
              <span className="mb-2 block text-sm font-medium text-slate-700">Analysis type</span>
              <select
                value={draft.analysisType}
                onChange={(event) => {
                  const selected = analysisTypes.find((option) => option.id === event.target.value);
                  setDraft({
                    ...draft,
                    analysisType: event.target.value,
                    sourceType: selected?.enabled ? draft.sourceType : 'web',
                  });
                }}
                className="h-11 w-full rounded border border-line px-3 text-sm"
              >
                {analysisTypes.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.title}
                    {!option.enabled ? ' - Modulo en Desarrollo' : ''}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {analysisTypes.find((option) => option.id === draft.analysisType)?.description}
              </p>
            </div>

            {draft.analysisType !== 'dx-portal' && (
              <div className="mt-5 rounded border border-warn/30 bg-warn/10 px-3 py-3 text-sm font-medium text-warn">
                Modulo en Desarrollo
              </div>
            )}

            {draft.analysisType === 'dx-portal' && (
              <div className="mt-5">
              <span className="mb-2 block text-sm font-medium text-slate-700">Source type</span>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { id: 'figma', title: 'Figma URL', icon: LayoutDashboard, text: 'Fetch a design through the Figma API using the selected depth.' },
                  { id: 'web', title: 'Web URL', icon: Globe2, text: 'Analyze HTML from a public web page.' },
                  { id: 'file', title: 'Figma export file', icon: FileJson, text: 'Use a local JSON export without API calls.' },
                ].map((option) => {
                  const Icon = option.icon;
                  const active = draft.sourceType === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setDraft({ ...draft, sourceType: option.id })}
                      className={`rounded border p-4 text-left transition ${active ? 'border-brand bg-brand/5' : 'border-line hover:border-brand/40'}`}
                    >
                      <Icon className={active ? 'text-brand' : 'text-slate-500'} size={22} />
                      <div className="mt-3 font-semibold text-ink">{option.title}</div>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{option.text}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            )}

            {draft.analysisType === 'dx-portal' && draft.sourceType === 'figma' && (
              <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Figma URL or file key</span>
                  <input
                    value={draft.figmaInput}
                    onChange={(event) => setDraft({ ...draft, figmaInput: event.target.value })}
                    className="h-11 w-full rounded border border-line px-3 text-sm"
                    placeholder="https://www.figma.com/design/..."
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Figma depth</span>
                  <select
                    value={draft.figmaDepth}
                    onChange={(event) => setDraft({ ...draft, figmaDepth: Number(event.target.value) })}
                    className="h-11 w-full rounded border border-line px-3 text-sm"
                  >
                    {depthOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="rounded border border-line bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600 md:col-span-2">
                  {depthOptions.find((option) => option.value === Number(draft.figmaDepth))?.description}
                </div>
              </div>
            )}

            {draft.analysisType === 'dx-portal' && draft.sourceType === 'web' && (
              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Web page URL</span>
                <input
                  value={draft.webInput}
                  onChange={(event) => setDraft({ ...draft, webInput: event.target.value })}
                  className="h-11 w-full rounded border border-line px-3 text-sm"
                  placeholder="https://example.com"
                />
              </label>
            )}

            {draft.analysisType === 'dx-portal' && draft.sourceType === 'file' && (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const file = event.dataTransfer.files?.[0];
                    if (file) setDraft({ ...draft, file });
                  }}
                  className="flex min-h-36 w-full flex-col items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 px-4 text-center hover:border-brand"
                >
                  <Upload className="text-brand" size={28} />
                  <span className="mt-3 text-sm font-medium text-ink">{draft.file?.name || 'Select or drag a Figma JSON export'}</span>
                  <span className="mt-1 text-xs text-slate-500">Processed locally in the browser.</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  hidden
                  onChange={(event) => event.target.files?.[0] && setDraft({ ...draft, file: event.target.files[0] })}
                />
              </div>
            )}

            {draft.analysisType === 'dx-portal' && <div className="mt-4 rounded border border-line bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
              New analyses always import fresh source data. Cache is used when modifying or recalculating an existing analysis.
            </div>}
            {error && (
              <div className="mt-4 rounded border border-risk/30 bg-risk/10 px-3 py-2 text-sm leading-6 text-risk">
                <div className="font-semibold">Analysis error</div>
                <div className="mt-1 break-words">{error}</div>
                <div className="mt-2 text-xs">A diagnostic entry has been written to server log.txt.</div>
              </div>
            )}
            <ProgressBar progress={progress} />

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={closeNewAnalysis} className="h-10 rounded border border-line px-4 text-sm text-slate-700 hover:border-brand">
                Cancel
              </button>
              <button type="button" onClick={createAnalysis} disabled={loading || draft.analysisType !== 'dx-portal'} className="h-10 rounded border border-brand bg-brand px-4 text-sm font-medium text-white disabled:border-slate-300 disabled:bg-slate-300">
                {draft.analysisType !== 'dx-portal' ? 'Modulo en Desarrollo' : loading ? 'Running...' : 'Create analysis'}
              </button>
            </div>
          </div>
        </div>
      )}

      {apiDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-xl rounded border border-warn/30 bg-white p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded bg-warn/10 p-2 text-warn">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink">{apiDialog.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{apiDialog.message}</p>
                {apiDialog.status && <p className="mt-2 font-mono text-xs text-slate-500">Status: {apiDialog.status}</p>}
              </div>
            </div>
            <div className="mt-4 rounded border border-line bg-slate-50 p-3">
              <h3 className="text-sm font-semibold text-ink">Recommended alternatives</h3>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                {apiDialog.payloadTooLarge && <li>For this file, depth 4 exceeds the safe browser import limit. Use depth 2 or 3 for the complete file.</li>}
                <li>Use a Figma File Export JSON and import it as a local file. This avoids API calls completely.</li>
                <li>Analyze a smaller Figma file or a reduced copy containing only the pages/sections needed.</li>
                <li>Open an existing analysis and use "Recalculate cached elements" if this source was already imported before.</li>
                <li>Wait a few minutes before retrying if Figma returned a rate-limit or throttling response.</li>
              </ul>
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft({ ...draft, sourceType: 'file' });
                  setApiDialog(null);
                }}
                className="h-10 rounded border border-brand bg-brand px-4 text-sm font-medium text-white"
              >
                Switch to file import
              </button>
              <button type="button" onClick={() => setApiDialog(null)} className="h-10 rounded border border-line px-4 text-sm text-slate-700 hover:border-brand">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-2xl rounded border border-line bg-white p-5 shadow-2xl">
            <h2 className="text-xl font-semibold text-ink">Modify analysis</h2>
            <p className="mt-1 text-sm text-slate-500">Update the visible metadata or recalculate using cached/imported source data.</p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
                <input value={editProject.name} onChange={(event) => setEditProject({ ...editProject, name: event.target.value })} className="h-11 w-full rounded border border-line px-3 text-sm" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
                <input
                  value={editProject.description || ''}
                  onChange={(event) => setEditProject({ ...editProject, description: event.target.value })}
                  className="h-11 w-full rounded border border-line px-3 text-sm"
                />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Notes / comments</span>
              <textarea
                value={editProject.notes || ''}
                onChange={(event) => setEditProject({ ...editProject, notes: event.target.value })}
                className="h-32 w-full resize-none rounded border border-line p-3 text-sm leading-6"
                placeholder="Review comments, assumptions, pending decisions..."
              />
            </label>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => runProjectAction(onReanalyzeProject, editProject.id)}
                disabled={loading || !editProject.sourceContext?.normalized}
                className="inline-flex h-11 items-center justify-center gap-2 rounded border border-line px-4 text-sm text-slate-700 hover:border-brand disabled:cursor-not-allowed disabled:text-slate-400"
              >
                <RotateCw size={16} />
                Recalculate cached elements
              </button>
              <button
                type="button"
                onClick={() => runProjectAction(onRefreshProject, editProject.id)}
                disabled={loading || !['figma', 'web'].includes(editProject.sourceContext?.type)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded border border-signal px-4 text-sm text-signal hover:bg-signal/10 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
              >
                <RefreshCw size={16} />
                Refresh original source
              </button>
            </div>
            <ProgressBar progress={progress} />

            <div className="mt-6 flex flex-wrap justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete analysis "${editProject.name}"?`)) {
                    onDeleteProject?.(editProject.id);
                    setEditProject(null);
                  }
                }}
                className="h-10 rounded border border-risk/30 px-4 text-sm text-risk hover:bg-risk/10"
              >
                Delete analysis
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditProject(null)} className="h-10 rounded border border-line px-4 text-sm text-slate-700 hover:border-brand">
                  Cancel
                </button>
                <button type="button" onClick={saveEditedProject} className="h-10 rounded border border-brand bg-brand px-4 text-sm font-medium text-white">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
