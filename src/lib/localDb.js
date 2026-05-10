const DEFAULT_KEY = import.meta.env.VITE_APP_STORAGE_KEY || 'blueprint-analyzer:v1';
const PROJECT_DB_NAME = 'blueprint-analyzer-projects';
const PROJECT_DB_VERSION = 1;
const PROJECT_STORE = 'projects';

const seed = {
  projects: [],
  settings: {
    storageKey: DEFAULT_KEY,
    language: 'en',
    confidenceThreshold: Number(import.meta.env.VITE_DEFAULT_CONFIDENCE_THRESHOLD || 65),
    figmaProxyUrl: import.meta.env.VITE_FIGMA_PROXY_URL || '',
    figmaApiKey: '',
    defaultFigmaUrl: import.meta.env.VITE_DEFAULT_FIGMA_URL || 'https://www.figma.com/design/HKa8PnQ5BefG84YtrOXyeJ/Al-Ghurair-Mobility--Copia-',
    cacheMaxAgeHours: 24,
    figmaDepth: 2,
    showLowConfidence: true,
  },
};

function readRoot(key = DEFAULT_KEY) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return structuredClone(seed);
    const parsed = JSON.parse(raw);
    const base = structuredClone(seed);
    return { ...base, ...parsed, settings: { ...base.settings, ...(parsed.settings || {}) } };
  } catch {
    return structuredClone(seed);
  }
}

function writeRoot(root, key = DEFAULT_KEY) {
  window.localStorage.setItem(key, JSON.stringify(root));
}

function openProjectDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PROJECT_DB_NAME, PROJECT_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PROJECT_STORE)) {
        const store = db.createObjectStore(PROJECT_STORE, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withProjectStore(mode, fn) {
  const db = await openProjectDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PROJECT_STORE, mode);
    const store = tx.objectStore(PROJECT_STORE);
    const result = fn(store);
    tx.oncomplete = () => {
      db.close();
      resolve(result?.result ?? result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

function legacyProjects() {
  const root = readRoot();
  return Array.isArray(root.projects) ? root.projects : [];
}

function clearLegacyProjects() {
  const root = readRoot();
  if (Array.isArray(root.projects) && root.projects.length) {
    root.projects = [];
    writeRoot(root);
  }
}

function compactAnalysis(analysis) {
  if (!analysis?.items) return analysis;
  return {
    ...analysis,
    items: analysis.items.map((item) => ({
      ...item,
      evidence: (item.evidence || []).slice(0, 4),
      alternatives: (item.alternatives || []).slice(0, 3).map((alt) => ({
        id: alt.id,
        name: alt.name,
        score: alt.score,
        blueprint: (alt.blueprint || []).slice(0, 4),
      })),
      sourceMatches: (item.sourceMatches || []).slice(0, 4).map((match) => ({
        component: match.component,
        sourceScore: match.sourceScore,
        cssHits: (match.cssHits || []).slice(0, 4),
        propHits: (match.propHits || []).slice(0, 4),
      })),
      checks: undefined,
      preview: item.preview
        ? {
            ...item.preview,
            textSamples: (item.preview.textSamples || []).slice(0, 4),
            childSummary: (item.preview.childSummary || []).slice(0, 8),
          }
        : item.preview,
      collection: item.collection
        ? {
            ...item.collection,
            members: (item.collection.members || []).slice(0, 20),
          }
        : item.collection,
      detection: item.detection
        ? {
            ...item.detection,
            reasons: (item.detection.reasons || []).slice(0, 4),
          }
        : item.detection,
    })),
  };
}

export function loadSettings() {
  return readRoot().settings;
}

export function saveSettings(settings) {
  const root = readRoot();
  root.settings = { ...root.settings, ...settings };
  writeRoot(root);
  return root.settings;
}

export async function loadProjects() {
  const projects = await withProjectStore('readonly', (store) => store.getAll());
  if (projects.length) {
    return projects.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
  }

  const legacy = legacyProjects();
  if (legacy.length) {
    await Promise.all(legacy.map((project) => saveProject(project)));
    clearLegacyProjects();
    return loadProjects();
  }
  return [];
}

export async function saveProject(project) {
  const next = {
    ...project,
    analysis: compactAnalysis(project.analysis),
    updatedAt: new Date().toISOString(),
    id: project.id || crypto.randomUUID(),
  };
  await withProjectStore('readwrite', (store) => store.put(next));
  return next;
}

export async function updateProjectMeta(id, meta) {
  await withProjectStore('readwrite', (store) => {
    const request = store.get(id);
    request.onsuccess = () => {
      const project = request.result;
      if (!project) return;
    const name = meta.name?.trim() || project.name;
      store.put({
      ...project,
      ...meta,
      name,
      analysis: project.analysis ? { ...project.analysis, name } : project.analysis,
      updatedAt: new Date().toISOString(),
      });
    };
    return request;
  });
  return loadProjects();
}

export async function deleteProject(id) {
  await withProjectStore('readwrite', (store) => store.delete(id));
  return loadProjects();
}

export async function clearDb() {
  window.localStorage.removeItem(DEFAULT_KEY);
  await withProjectStore('readwrite', (store) => store.clear());
}
