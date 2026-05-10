import { Info, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { clearCache } from '../lib/cacheDb';
import { t } from '../i18n';

const figmaDepthOptions = [
  {
    value: 1,
    label: '1 - File/page shell',
    description: 'Fastest. Good for checking access, but usually too shallow for component mapping.',
  },
  {
    value: 2,
    label: '2 - First-pass sections',
    description: 'Recommended default. Safer for large Figma files and enough to separate page frames from main sections.',
  },
  {
    value: 3,
    label: '3 - Deeper groups',
    description: 'More detailed. Better for medium files where cards/lists are nested inside sections.',
  },
  {
    value: 4,
    label: '4 - Full nested scan',
    description: 'Use only for small/reduced files. Large files can make the browser unresponsive while parsing/classifying.',
  },
];

function Hint({ children }) {
  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
      <Info size={12} className="mt-0.5 shrink-0 text-slate-400" />
      {children}
    </p>
  );
}

export function SettingsPanel({ settings, onSave, onClear, language = 'en' }) {
  const [draft, setDraft] = useState(settings);
  const [message, setMessage] = useState('');
  const selectedDepth = figmaDepthOptions.find((option) => option.value === Number(draft.figmaDepth)) || figmaDepthOptions[1];

  return (
    <section className="rounded border border-line bg-white p-5 shadow-panel">
      <h2 className="text-lg font-semibold text-ink">{t(language, 'tabs.settings')}</h2>
      <p className="mt-1 text-sm text-slate-500">{t(language, 'settingsWarning')}</p>

      {/* ── Figma connection ── */}
      <div className="mt-5 rounded-lg border border-brand/20 bg-brand/5 p-4">
        <h3 className="text-sm font-semibold text-brand">Figma connection</h3>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          The app connects to Figma through a server-side proxy at <code className="rounded bg-white px-1 font-mono">/api/figma</code>.
          Provide your token here (stored in this browser only) or ask your admin to set <code className="rounded bg-white px-1 font-mono">FIGMA_API_TOKEN</code> as a Vercel environment variable and redeploy.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">{t(language, 'apiKey')}</span>
            <input
              type="password"
              value={draft.figmaApiKey || ''}
              onChange={(event) => setDraft({ ...draft, figmaApiKey: event.target.value })}
              className="h-10 w-full rounded border border-line px-3 text-sm"
              placeholder="figd_..."
              autoComplete="off"
            />
            <Hint>Generate at figma.com → your avatar → Settings → Personal access tokens. Saved to this browser only — never sent to any server except your own proxy.</Hint>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Default Figma URL</span>
            <input
              value={draft.defaultFigmaUrl || ''}
              onChange={(event) => setDraft({ ...draft, defaultFigmaUrl: event.target.value })}
              className="h-10 w-full rounded border border-line px-3 text-sm"
              placeholder="https://www.figma.com/design/..."
            />
            <Hint>Pre-fills the URL field when you open the Import tab. Paste your project's Figma file URL here so you don't have to paste it every time.</Hint>
          </label>
        </div>
      </div>

      {/* ── Analysis settings ── */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">{t(language, 'language')}</span>
          <select
            value={draft.language}
            onChange={(event) => setDraft({ ...draft, language: event.target.value })}
            className="h-10 w-full rounded border border-line px-3 text-sm"
          >
            <option value="en">{t(language, 'english')}</option>
            <option value="es">{t(language, 'spanish')}</option>
            <option value="ar">{t(language, 'arabic')}</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">{t(language, 'confidenceThreshold')}</span>
          <input
            type="number"
            min="0"
            max="100"
            value={draft.confidenceThreshold}
            onChange={(event) => setDraft({ ...draft, confidenceThreshold: Number(event.target.value) })}
            className="h-10 w-full rounded border border-line px-3 text-sm"
          />
          <Hint>Components scoring below this threshold are flagged for manual review (0–100). Default: 65.</Hint>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">{t(language, 'cacheMaxAge')}</span>
          <input
            type="number"
            min="1"
            max="720"
            value={draft.cacheMaxAgeHours}
            onChange={(event) => setDraft({ ...draft, cacheMaxAgeHours: Number(event.target.value) })}
            className="h-10 w-full rounded border border-line px-3 text-sm"
          />
          <Hint>Hours before a cached Figma or web response is considered stale. Default: 24.</Hint>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">{t(language, 'figmaDepth')}</span>
          <select
            value={draft.figmaDepth}
            onChange={(event) => setDraft({ ...draft, figmaDepth: Number(event.target.value) })}
            className="h-10 w-full rounded border border-line px-3 text-sm"
          >
            {figmaDepthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs leading-5 text-slate-500">{selectedDepth.description}</p>
        </label>
        <label className="flex items-center gap-3 rounded border border-line px-3 py-3">
          <input
            type="checkbox"
            checked={!!draft.showLowConfidence}
            onChange={(event) => setDraft({ ...draft, showLowConfidence: event.target.checked })}
            className="h-4 w-4"
          />
          <span className="text-sm text-slate-700">Show low-confidence items</span>
        </label>
        <div className="rounded border border-line px-3 py-3">
          <div className="text-sm font-medium text-slate-700">Storage key</div>
          <div className="mt-1 font-mono text-xs text-slate-500">{settings.storageKey}</div>
        </div>
      </div>

      {/* ── Advanced ── */}
      <details className="mt-4">
        <summary className="cursor-pointer select-none text-xs font-medium text-slate-400 hover:text-slate-600">
          Advanced settings
        </summary>
        <div className="mt-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Figma proxy URL</span>
            <input
              value={draft.figmaProxyUrl || ''}
              onChange={(event) => setDraft({ ...draft, figmaProxyUrl: event.target.value })}
              className="h-10 w-full rounded border border-line px-3 text-sm"
              placeholder="(leave empty — uses /api/figma automatically)"
            />
            <Hint>
              Only change this if you run the proxy on a different host or port. Leave empty when deployed on Vercel — the app calls <code className="font-mono">/api/figma</code> automatically.
            </Hint>
          </label>
        </div>
      </details>

      {/* ── Actions ── */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => { onSave(draft); setMessage('Settings saved.'); setTimeout(() => setMessage(''), 3000); }}
          className="inline-flex h-10 items-center gap-2 rounded border border-brand bg-brand px-4 text-sm font-medium text-white hover:bg-brand/90"
        >
          <Save size={16} />
          {t(language, 'save')}
        </button>
        <button
          type="button"
          onClick={async () => {
            await clearCache();
            setMessage('Cache cleared.');
            setTimeout(() => setMessage(''), 3000);
          }}
          className="inline-flex h-10 items-center gap-2 rounded border border-line px-4 text-sm font-medium text-slate-700 hover:border-brand"
        >
          <Trash2 size={16} />
          {t(language, 'clearCache')}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-10 items-center gap-2 rounded border border-risk/30 px-4 text-sm font-medium text-risk hover:bg-risk/10"
        >
          <Trash2 size={16} />
          {t(language, 'clearLocalDb')}
        </button>
      </div>
      {message && (
        <div className="mt-4 rounded border border-signal/30 bg-signal/10 px-3 py-2 text-sm text-signal">
          {message}
        </div>
      )}
    </section>
  );
}
