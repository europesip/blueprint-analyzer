import { Save, Trash2 } from 'lucide-react';
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

export function SettingsPanel({ settings, onSave, onClear, language = 'en' }) {
  const [draft, setDraft] = useState(settings);
  const [message, setMessage] = useState('');
  const selectedDepth = figmaDepthOptions.find((option) => option.value === Number(draft.figmaDepth)) || figmaDepthOptions[1];

  return (
    <section className="rounded border border-line bg-white p-5 shadow-panel">
      <h2 className="text-lg font-semibold text-ink">{t(language, 'tabs.settings')}</h2>
      <p className="mt-1 text-sm text-slate-500">{t(language, 'settingsWarning')}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">{t(language, 'language')}</span>
          <select
            value={draft.language}
            onChange={(event) => setDraft({ ...draft, language: event.target.value })}
            className="h-11 w-full rounded border border-line px-3 text-sm"
          >
            <option value="en">{t(language, 'english')}</option>
            <option value="es">{t(language, 'spanish')}</option>
            <option value="ar">{t(language, 'arabic')}</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">{t(language, 'confidenceThreshold')}</span>
          <input
            type="number"
            min="0"
            max="100"
            value={draft.confidenceThreshold}
            onChange={(event) => setDraft({ ...draft, confidenceThreshold: Number(event.target.value) })}
            className="h-11 w-full rounded border border-line px-3 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">{t(language, 'apiKey')}</span>
          <input
            type="password"
            value={draft.figmaApiKey || ''}
            onChange={(event) => setDraft({ ...draft, figmaApiKey: event.target.value })}
            className="h-11 w-full rounded border border-line px-3 text-sm"
            placeholder="figd_..."
            autoComplete="off"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-700">{t(language, 'figmaUrl')}</span>
          <input
            value={draft.defaultFigmaUrl || ''}
            onChange={(event) => setDraft({ ...draft, defaultFigmaUrl: event.target.value })}
            className="h-11 w-full rounded border border-line px-3 text-sm"
            placeholder="https://www.figma.com/design/..."
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">{t(language, 'cacheMaxAge')}</span>
          <input
            type="number"
            min="1"
            max="720"
            value={draft.cacheMaxAgeHours}
            onChange={(event) => setDraft({ ...draft, cacheMaxAgeHours: Number(event.target.value) })}
            className="h-11 w-full rounded border border-line px-3 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">{t(language, 'figmaDepth')}</span>
          <select
            value={draft.figmaDepth}
            onChange={(event) => setDraft({ ...draft, figmaDepth: Number(event.target.value) })}
            className="h-11 w-full rounded border border-line px-3 text-sm"
          >
            {figmaDepthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs leading-5 text-slate-500">{selectedDepth.description}</p>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Figma proxy URL</span>
          <input
            value={draft.figmaProxyUrl || ''}
            onChange={(event) => setDraft({ ...draft, figmaProxyUrl: event.target.value })}
            className="h-11 w-full rounded border border-line px-3 text-sm"
            placeholder="https://..."
          />
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
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSave(draft)}
          className="inline-flex h-10 items-center gap-2 rounded border border-brand bg-brand px-4 text-sm font-medium text-white"
        >
          <Save size={16} />
          {t(language, 'save')}
        </button>
        <button
          type="button"
          onClick={async () => {
            await clearCache();
            setMessage('Cache cleared');
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
      {message && <div className="mt-4 rounded border border-signal/30 bg-signal/10 px-3 py-2 text-sm text-signal">{message}</div>}
    </section>
  );
}
