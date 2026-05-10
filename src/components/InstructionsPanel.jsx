import { BookOpen, Database, FileJson, Gauge, Globe2, KeyRound } from 'lucide-react';

const sections = [
  {
    icon: BookOpen,
    title: 'Program philosophy',
    body: 'This app is deliberately limited to phase 1: analysis and classification. It helps decide whether a Figma or web block should be handled with OOTB Blueprint, Config Styles, a Blueprint Extension, WCM content, native Portal capabilities, or a custom Script App. It does not generate code and it does not deploy anything to Portal.',
  },
  {
    icon: Gauge,
    title: 'How classification works',
    body: 'Each imported frame or web section is scored using semantic names, visible text, structural hints, and the local Blueprint rulebook. A high visual resemblance is not enough: the final route is based on the Blueprint/WCM contract described in the guide.',
  },
  {
    icon: Database,
    title: 'Cache-first API usage',
    body: 'Figma and web fetches are stored in IndexedDB. By default, the app reuses cached data until the configured cache age expires. Use Force refresh only when the design or page changed and a new API call is really needed.',
  },
  {
    icon: FileJson,
    title: 'File import option',
    body: 'When Figma data has already been exported, load the JSON file directly. This avoids another API call and is the safest path when rate limits are a concern or when working offline.',
  },
  {
    icon: Globe2,
    title: 'Web page analysis',
    body: 'The web import fetches the HTML once, extracts semantic blocks such as header, navigation, sections, cards, accordions, forms, and footer, and runs the same classification engine used for Figma.',
  },
  {
    icon: KeyRound,
    title: 'Figma API key',
    body: 'Enter the key in Settings for local browser use, or set FIGMA_API_TOKEN in the deployment environment. The token is not committed into source files, so the project can be pushed to Vercel or a similar platform safely.',
  },
];

export function InstructionsPanel() {
  return (
    <section className="space-y-5">
      <div className="rounded border border-line bg-white p-5 shadow-panel">
        <h2 className="text-lg font-semibold text-ink">Instructions</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Use this tool as a decision assistant for the Local Blueprint Development Guide v6. The output should be reviewed by a developer who understands HCL DX Portal, WCM, Blueprint Extensions, and the supporting material supplied by Herbert.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <article key={section.title} className="rounded border border-line bg-white p-5 shadow-panel">
              <div className="flex items-center gap-3">
                <Icon className="text-brand" size={22} />
                <h3 className="font-semibold text-ink">{section.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{section.body}</p>
            </article>
          );
        })}
      </div>

      <div className="rounded border border-line bg-white p-5 shadow-panel">
        <h3 className="font-semibold text-ink">Recommended workflow</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600">
          <li>Load an exported Figma JSON when available, or fetch the configured Figma file with cache enabled.</li>
          <li>Review low-confidence blocks first and check the evidence, not only the suggested component name.</li>
          <li>Use the Rules tab to compare the result with ZIP, WCM_Library, native Portal, and HCL learning material.</li>
          <li>Export the analysis JSON as input for the second phase, where code generation and Portal upload can be designed separately.</li>
        </ol>
      </div>
    </section>
  );
}
