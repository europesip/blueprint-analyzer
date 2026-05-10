import { Boxes, Database, FileJson, Languages, ListChecks, Settings } from 'lucide-react';
import { t } from '../i18n';

const tabs = [
  { id: 'analysis', label: 'Analisis', icon: ListChecks },
  { id: 'import', label: 'Importar', icon: FileJson },
  { id: 'rules', label: 'Reglas', icon: Boxes },
  { id: 'instructions', label: 'Instrucciones', icon: ListChecks },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const languages = [
  { id: 'en', label: 'EN' },
  { id: 'es', label: 'ES' },
  { id: 'ar', label: 'ع' },
];

export function Header({ activeTab, onTabChange, projectCount, language = 'en', onLanguageChange }) {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-brand text-white">
            <Database size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-normal text-ink">Blueprint Analyzer</h1>
            <p className="text-sm text-slate-500">{t(language, 'appSubtitle')} · {projectCount} project(s)</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="inline-flex h-10 items-center gap-1 rounded border border-line bg-slate-50 px-1">
            <Languages size={16} className="mx-2 text-slate-500" />
            {languages.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => onLanguageChange?.(entry.id)}
                className={`h-8 min-w-9 rounded px-2 text-sm font-semibold transition ${
                  language === entry.id ? 'bg-brand text-white' : 'text-slate-600 hover:bg-white'
                }`}
                title={`Switch language to ${entry.id}`}
              >
                {entry.label}
              </button>
            ))}
          </div>
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`inline-flex h-10 items-center gap-2 rounded border px-3 text-sm transition ${
                    active ? 'border-brand bg-brand text-white' : 'border-line bg-white text-slate-700 hover:border-brand/50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{t(language, `tabs.${tab.id}`) || tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
