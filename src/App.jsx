import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, MessageSquare, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { Header } from './components/Header';
import { ImportPanel } from './components/ImportPanel';
import { Summary } from './components/Summary';
import { AnalysisTable } from './components/AnalysisTable';
import { RulebookPanel } from './components/RulebookPanel';
import { InstructionsPanel } from './components/InstructionsPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { ClassificationLegend } from './components/ClassificationLegend';
import { ComponentDetailPage } from './components/ComponentDetailPage';
import { clearDb, deleteProject, loadProjects, loadSettings, saveProject, saveSettings, updateProjectMeta } from './lib/localDb';
import { clearCache } from './lib/cacheDb';
import { analyzeDesign } from './lib/analyzer';
import { loadFigmaDesign } from './lib/figmaClient';
import { loadWebPage } from './lib/webImport';
import { buildSourceContext } from './lib/sourceContext';
import { dir, t } from './i18n';

export default function App() {
  const [settings, setSettings] = useState(() => loadSettings());
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeTab, setActiveTab] = useState('import');
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id || null);
  const [selectedItemId, setSelectedItemId] = useState(projects[0]?.analysis?.items?.[0]?.id || null);
  const [notesModal, setNotesModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [analysisRun, setAnalysisRun] = useState({ loading: false, message: '', error: '' });

  const activeProject = useMemo(() => projects.find((project) => project.id === activeProjectId) || projects[0] || null, [projects, activeProjectId]);
  const analysis = activeProject?.analysis || null;
  const selectedItem = analysis?.items.find((item) => item.id === selectedItemId) || analysis?.items?.[0] || null;

  useEffect(() => {
    let cancelled = false;
    loadProjects()
      .then((loaded) => {
        if (cancelled) return;
        setProjects(loaded);
        setActiveProjectId((current) => current || loaded[0]?.id || null);
        setSelectedItemId((current) => current || loaded[0]?.analysis?.items?.[0]?.id || null);
      })
      .finally(() => {
        if (!cancelled) setLoadingProjects(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function persistAnalysis(nextAnalysis, sourceContext, existingProjectId = null, meta = {}) {
    const existingProject = projects.find((project) => project.id === existingProjectId);
    const runCount = Number(existingProject?.runCount || 0) + 1;
    const lastRunAt = new Date().toISOString();
    const analysisWithRun = {
      ...nextAnalysis,
      meta: {
        ...(nextAnalysis.meta || {}),
        lastRunAt,
        runCount,
        runMode: meta.runMode || (existingProjectId ? 'recalculate-cached' : 'new-analysis'),
      },
    };
    const project = await saveProject({
      id: existingProjectId || undefined,
      name: analysisWithRun.name,
      description: meta.description ?? existingProject?.description ?? '',
      notes: meta.notes ?? existingProject?.notes ?? '',
      analysisType: meta.analysisType ?? existingProject?.analysisType ?? 'dx-portal',
      analysis: analysisWithRun,
      sourceContext,
      createdAt: existingProject?.createdAt || new Date().toISOString(),
      runCount,
      lastRunAt,
      lastRunMode: meta.runMode || (existingProjectId ? 'recalculate-cached' : 'new-analysis'),
    });
    const nextProjects = await loadProjects();
    setProjects(nextProjects);
    setActiveProjectId(project.id);
    setSelectedItemId(analysisWithRun.items[0]?.id || null);
    setActiveTab('analysis');
    return project;
  }

  async function handleAnalysis(nextAnalysis, sourceContext, meta = {}) {
    await persistAnalysis(nextAnalysis, sourceContext, null, meta);
  }

  function handleOpenProject(id) {
    const project = projects.find((item) => item.id === id);
    if (!project) return;
    setActiveProjectId(project.id);
    setSelectedItemId(project.analysis?.items?.[0]?.id || null);
    setActiveTab('analysis');
  }

  async function handleReanalyzeProject(id) {
    const project = projects.find((item) => item.id === id);
    const normalized = project?.sourceContext?.normalized;
    if (!project || !normalized) return;
    const analysis = analyzeDesign({ ...normalized, name: project.name }, settings);
    return persistAnalysis(analysis, project.sourceContext, project.id, { runMode: 'recalculate-cached' });
  }

  async function handleUpdateActiveAnalysis() {
    if (!activeProject?.sourceContext?.normalized || analysisRun.loading) return;
    setAnalysisRun({ loading: true, message: 'Updating analysis from cached/imported source data...', error: '' });
    try {
      const beforeFamilies = activeProject.analysis?.summary?.uniqueComponents || activeProject.analysis?.families?.length || activeProject.analysis?.summary?.total || 0;
      const updated = await handleReanalyzeProject(activeProject.id);
      const afterFamilies = updated?.analysis?.summary?.uniqueComponents || updated?.analysis?.families?.length || updated?.analysis?.summary?.total || 0;
      const runCount = updated?.runCount || 1;
      setAnalysisRun({
        loading: false,
        message: `Analysis updated. Run #${runCount} completed${beforeFamilies !== afterFamilies ? ` (${beforeFamilies} -> ${afterFamilies} component families)` : ''}.`,
        error: '',
      });
    } catch (err) {
      setAnalysisRun({ loading: false, message: '', error: err.message || 'Analysis update failed.' });
    }
  }

  async function handleUpdateProjectMeta(id, meta) {
    const updated = await updateProjectMeta(id, meta);
    setProjects(updated);
    setNotesModal(null);
  }

  async function handleRefreshProject(id) {
    const project = projects.find((item) => item.id === id);
    const source = project?.sourceContext;
    if (!source || !['figma', 'web'].includes(source.type)) return;
    const result =
      source.type === 'figma'
        ? await loadFigmaDesign({
            input: source.input,
            token: settings.figmaApiKey,
            forceRefresh: true,
            depth: Math.min(Math.max(Number(settings.figmaDepth || 2), 1), 4),
            maxAgeHours: settings.cacheMaxAgeHours || 24,
            proxyUrl: settings.figmaProxyUrl || '',
          })
        : await loadWebPage({
            input: source.input,
            forceRefresh: true,
            maxAgeHours: settings.cacheMaxAgeHours || 24,
          });
    const normalized = { ...result.normalized, name: project.name };
    const analysis = analyzeDesign(normalized, settings);
    return persistAnalysis(analysis, buildSourceContext({ type: source.type, input: source.input, cache: result.cache, normalized }), project.id, { runMode: 'refresh-source' });
  }

  function handleDeleteActive() {
    if (!activeProject) return;
    setDeleteConfirm(activeProject);
  }

  async function handleDeleteProject(id) {
    const deletedActive = activeProject?.id === id;
    const updated = await deleteProject(id);
    setProjects(updated);
    if (deletedActive) {
      setActiveProjectId(updated[0]?.id || null);
      setSelectedItemId(updated[0]?.analysis?.items?.[0]?.id || null);
      if (!updated.length) setActiveTab('import');
    }
  }

  function handleSettingsSave(next) {
    const saved = saveSettings(next);
    setSettings(saved);
  }

  function handleLanguageChange(language) {
    const saved = saveSettings({ ...settings, language });
    setSettings(saved);
  }

  async function handleClearDb() {
    await clearDb();
    await clearCache();
    setProjects([]);
    setSettings(loadSettings());
    setActiveProjectId(null);
    setSelectedItemId(null);
    setActiveTab('import');
  }

  return (
    <div className="min-h-screen bg-paper text-ink" dir={dir(settings.language)}>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        projectCount={projects.length}
        language={settings.language}
        onLanguageChange={handleLanguageChange}
      />

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-5">
        {loadingProjects && (
          <section className="rounded border border-line bg-white p-5 text-sm text-slate-500 shadow-panel">
            Loading saved analyses...
          </section>
        )}
        {activeTab === 'analysis' && (
          <>
            <div className="rounded border border-line bg-white p-4 shadow-panel">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <select
                    value={activeProject?.id || ''}
                    onChange={(event) => {
                      const project = projects.find((item) => item.id === event.target.value);
                      setActiveProjectId(project?.id || null);
                      setSelectedItemId(project?.analysis?.items?.[0]?.id || null);
                    }}
                    className="h-10 max-w-full rounded border border-line px-3 text-sm"
                  >
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  {activeProject?.description && <p className="mt-2 text-sm leading-6 text-slate-600">{activeProject.description}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded border border-line bg-slate-50 px-2 py-1">Run #{activeProject?.runCount || analysis?.meta?.runCount || 1}</span>
                    {(activeProject?.lastRunAt || analysis?.meta?.lastRunAt || analysis?.importedAt) && (
                      <span className="rounded border border-line bg-slate-50 px-2 py-1">
                        Last run {new Date(activeProject?.lastRunAt || analysis?.meta?.lastRunAt || analysis?.importedAt).toLocaleString(settings.language === 'es' ? 'es-ES' : settings.language === 'ar' ? 'ar-AE' : 'en-GB')}
                      </span>
                    )}
                    {activeProject?.lastRunMode && <span className="rounded border border-line bg-slate-50 px-2 py-1">{activeProject.lastRunMode}</span>}
                  </div>
                  {activeProject?.notes && (
                    <p className="mt-2 rounded border border-brand/20 bg-brand/5 px-3 py-2 text-sm leading-6 text-slate-700">{activeProject.notes}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('import')}
                    className="inline-flex h-10 items-center gap-2 rounded border border-brand px-4 text-sm font-medium text-brand hover:bg-brand/10"
                  >
                    <Plus size={16} />
                    {t(settings.language, 'newAnalysis')}
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateActiveAnalysis}
                    disabled={!activeProject?.sourceContext?.normalized || analysisRun.loading}
                    className="inline-flex h-10 items-center gap-2 rounded border border-signal px-4 text-sm font-medium text-signal hover:bg-signal/10 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                  >
                    <RefreshCw size={16} className={analysisRun.loading ? 'animate-spin' : ''} />
                    {analysisRun.loading ? 'Updating...' : 'Update analysis'}
                  </button>
                  <button
                    type="button"
                    onClick={() => activeProject && setNotesModal({ ...activeProject })}
                    className="inline-flex h-10 items-center gap-2 rounded border border-line px-4 text-sm text-slate-700 hover:border-brand"
                  >
                    <MessageSquare size={16} />
                    Notes
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteActive}
                    className="inline-flex h-10 items-center gap-2 rounded border border-risk/30 px-4 text-sm font-medium text-risk hover:bg-risk/10"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
            {(analysisRun.message || analysisRun.error) && (
              <div className={`mt-3 flex items-start gap-2 rounded border px-3 py-2 text-sm ${analysisRun.error ? 'border-risk/30 bg-risk/10 text-risk' : 'border-brand/30 bg-brand/10 text-brand'}`}>
                {!analysisRun.error && <CheckCircle2 className="mt-0.5 shrink-0" size={16} />}
                <span>{analysisRun.error || analysisRun.message}</span>
              </div>
            )}
            <Summary analysis={analysis} language={settings.language} />
            <ClassificationLegend compact />
            {analysis && (
              <AnalysisTable
                analysis={analysis}
                selectedId={selectedItem?.id}
                onSelect={(id) => {
                  setSelectedItemId(id);
                  setActiveTab('componentDetail');
                }}
                language={settings.language}
                project={activeProject}
                settings={settings}
              />
            )}
          </>
        )}

        {activeTab === 'componentDetail' && (
          <ComponentDetailPage item={selectedItem} project={activeProject} settings={settings} onBack={() => setActiveTab('analysis')} />
        )}

        {activeTab === 'import' && (
          <ImportPanel
            settings={settings}
            projects={projects}
            onAnalysis={handleAnalysis}
            onOpenProject={handleOpenProject}
            onReanalyzeProject={handleReanalyzeProject}
            onRefreshProject={handleRefreshProject}
            onDeleteProject={handleDeleteProject}
            onUpdateProject={handleUpdateProjectMeta}
            language={settings.language}
          />
        )}
        {activeTab === 'rules' && <RulebookPanel language={settings.language} />}
        {activeTab === 'instructions' && <InstructionsPanel language={settings.language} />}
        {activeTab === 'settings' && <SettingsPanel settings={settings} onSave={handleSettingsSave} onClear={handleClearDb} language={settings.language} />}
      </main>

      {notesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-2xl rounded border border-line bg-white p-5 shadow-2xl">
            <h2 className="text-xl font-semibold text-ink">Analysis notes</h2>
            <p className="mt-1 text-sm text-slate-500">Add comments, assumptions, review notes, or decisions for this analysis.</p>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Notes / comments</span>
              <textarea
                value={notesModal.notes || ''}
                onChange={(event) => setNotesModal({ ...notesModal, notes: event.target.value })}
                className="h-52 w-full resize-none rounded border border-line p-3 text-sm leading-6"
                placeholder="Example: review carousel grouping with the business team before estimating phase 2."
              />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setNotesModal(null)} className="h-10 rounded border border-line px-4 text-sm text-slate-700 hover:border-brand">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateProjectMeta(notesModal.id, { notes: notesModal.notes || '' })}
                className="h-10 rounded border border-brand bg-brand px-4 text-sm font-medium text-white"
              >
                Save notes
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-md rounded border border-risk/30 bg-white p-5 shadow-2xl">
            <h2 className="text-xl font-semibold text-ink">Delete analysis?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This will remove "{deleteConfirm.name}" and its saved analysis data from the local database.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteConfirm(null)} className="h-10 rounded border border-line px-4 text-sm text-slate-700 hover:border-brand">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteProject(deleteConfirm.id);
                  setDeleteConfirm(null);
                }}
                className="h-10 rounded border border-risk bg-risk px-4 text-sm font-medium text-white"
              >
                Delete analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
