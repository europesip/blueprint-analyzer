# Blueprint Analyzer

A client-side SPA that imports Figma designs or web pages and automatically classifies every detected UI element against the **HCL DX Blueprint** design system — telling your team which components to use out-of-the-box, which need configuration, which need a Blueprint Extension, and which are net-new.

> **Reference document**: [`info/Guia_Blueprint_Local_Dev_v6_EUROPESIP.docx`](info/Guia_Blueprint_Local_Dev_v6_EUROPESIP.docx) — the full implementation guide this tool is built around. Read it for the A/B/C/D/E classification framework, delivery path definitions, and WCM content modelling decisions.

---

## What it does

1. **Import** a Figma file (via Figma REST API) or a live web page URL — or paste a DXForge-exported JSON.
2. **Analyze** — the engine scores every frame/node against 32 classification rules covering 117 `@blueprint/dx-micro-interaction-components` v232 components.
3. **Classify** into one of six implementation paths:

| Path | Meaning |
|---|---|
| `OOTB_BLUEPRINT` | Maps to an existing Blueprint component — use it as-is |
| `CONFIG_STYLE` | Visual difference only — handle with design tokens or CSS |
| `BLUEPRINT_EXTENSION` | Requires a registered Blueprint Extension |
| `WCM_CONTENT` | Editorial/collection content — model in WCM |
| `PORTAL_NATIVE` | Header, footer, search — handled natively by Portal |
| `SCRIPT_APP` | Business logic, auth, live data — needs a Script App |
| `REVIEW` | Insufficient evidence — needs manual review |

4. **Dashboard** — KPI cards, SVG donut chart by route, confidence bars, difficulty split, and an estimated delivery effort.
5. **Component detail** — per-component WCM/prop contracts, evidence, Blueprint mapping, and (when a Figma key is configured) live Figma node thumbnails loaded lazily per card.
6. **Export** — download the full analysis as `.analysis.json` for hand-off or archiving.

---

## Tech stack

- **React 19 + Vite** — no routing library, all state in `App.jsx`
- **Tailwind CSS** with a custom token palette (`brand`, `signal`, `warn`, `risk`, `ink`, `paper`, `line`)
- **IndexedDB** for project and cache persistence (`localDb.js` / `cacheDb.js`)
- **Figma REST API** via a `/api/figma` proxy sidecar (not included in this repo — see below)

---

## Getting started

```bash
npm install
npm run dev        # dev server on http://localhost:5177
npm run build      # production build → dist/
npm run preview    # serve the production build
npm run lint       # ESLint
```

### Backend proxy

The app calls four proxy endpoints that you must provide separately:

| Endpoint | Purpose |
|---|---|
| `POST /api/figma` | Proxy to `api.figma.com/v1/files/:key` |
| `POST /api/figma-image` | Proxy to `api.figma.com/v1/images/:key` |
| `POST /api/web` | Fetch an arbitrary URL and return its HTML |
| `POST /api/log` | Optional telemetry sink |

Without the proxy you can still use **JSON file import** and the bundled sample design.

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values you need. All variables are optional — the app runs without any of them.

```bash
cp .env.example .env.local
```

| Variable | Default | Purpose |
|---|---|---|
| `VITE_DEFAULT_FIGMA_URL` | _(empty)_ | Pre-fills the Figma URL input on load — set this to your project's Figma file URL so you don't have to paste it every time |
| `VITE_DEFAULT_CONFIDENCE_THRESHOLD` | `65` | Initial confidence threshold (0–100) below which a component goes to REVIEW |
| `VITE_FIGMA_PROXY_URL` | `/api/figma` | Override the Figma proxy endpoint if you run the sidecar on a different host/port |
| `VITE_APP_STORAGE_KEY` | `blueprint-analyzer:v1` | localStorage namespace key — change if you run multiple instances |
| `VITE_RULESET_VERSION` | `guide-v7` | Label embedded in exported `.analysis.json` files |
| `FIGMA_API_TOKEN` | _(empty)_ | Server-side Figma token used by the `/api/figma` and `/api/figma-image` proxy functions (e.g. on Vercel). For local browser use, enter the token in the app's Settings panel instead — it is stored only in localStorage and never committed. |

> **Security note**: never put a real Figma token in `.env.example` or commit a `.env.local` / `.env` file. The `.gitignore` already excludes `.env*.local` and `.env`.

---

## Architecture

```
ImportPanel (user action)
  → figmaClient / webImport / normalizeDesignJson   ← raw source → normalized frames
  → analyzeDesign()                                 ← frames → analysis (items + families + summary)
  → saveProject() → IndexedDB
  → App state → AnalysisTable / Summary / ComponentDetailPage
```

### Key source files

| Path | Role |
|---|---|
| `src/lib/analyzer.js` | Core engine — scores frames against `COMPONENT_RULES`, groups into families, computes confidence/effort/path |
| `src/lib/figmaImport.js` | Normalizes Figma REST JSON into the canonical frame schema |
| `src/lib/figmaClient.js` | Figma API calls + IndexedDB cache |
| `src/lib/webImport.js` | Web page fetch + DOM-to-frames parser |
| `src/data/rulebook.js` | 32 classification rules covering 117 DX components + `IMPLEMENTATION_PATHS` + `REVIEW_CHECKS` |
| `src/data/sourceSignatures.js` | CSS BEM class names + prop names from Blueprint source, used to boost confidence scores |
| `src/data/componentContracts.js` | Per-component WCM prop contracts shown in the detail panel |
| `src/components/AnalysisTable.jsx` | Grouped card grid with path accents, confidence bars, and lazy Figma thumbnails |
| `src/components/Summary.jsx` | Executive dashboard — gradient KPI cards, SVG donut chart, path breakdown |
| `src/components/ComponentDetailPage.jsx` | Single-component deep-dive panel |

### Adding or tuning rules

Edit `src/data/rulebook.js` → `COMPONENT_RULES`. Each rule has:

```js
{
  id: 'my-rule',
  components: ['DXMyComponent'],        // display list
  keywords: ['keyword', ...],           // matched at full weight
  figmaSignals: ['figma-layer-name'],   // matched at 55% weight
  extensionTriggers: ['trigger'],       // escalates to BLUEPRINT_EXTENSION + 5 pts
  weight: 10,                           // base multiplier
  path: 'OOTB_BLUEPRINT',              // default path when this rule wins
}
```

Structural bonuses (full-width, compact, repeated children) are applied in `scoreRule()` in `analyzer.js`. The confidence threshold below which a frame goes to `REVIEW` is configurable in the app's Settings panel.

---

## Reference material

- [`info/Guia_Blueprint_Local_Dev_v6_EUROPESIP.docx`](info/Guia_Blueprint_Local_Dev_v6_EUROPESIP.docx) — Implementation guide: A/B/C/D/E classification, delivery paths, WCM modelling, Figma-to-Blueprint mapping methodology.
- [`info/index.d.ts`](info/index.d.ts) — TypeScript contracts for all 117 `@blueprint/dx-micro-interaction-components` exports. Ground truth for rule keywords and source signatures.
- [`info/extended-blueprint-feature-reference-blueprint.zip`](info/extended-blueprint-feature-reference-blueprint.zip) — Extended Blueprint feature reference.
- [`info/Blueprint-Extensions-wcm-library-export-20260216191300.tar.gz`](info/Blueprint-Extensions-wcm-library-export-20260216191300.tar.gz) — WCM library export for Blueprint Extensions.

---

## Cache and rate limiting

- The app checks IndexedDB first; it only calls Figma/web if no valid cache exists or `Force refresh` is checked.
- `Cache max age (hours)` in Settings controls cache lifetime.
- `Figma depth` limits REST response depth to avoid unnecessary payload size.
- Figma node thumbnails are lazy-loaded per card via IntersectionObserver and require the user to toggle "Load Figma previews" — this keeps the default Figma API call count to zero.

---

## License

Internal project — EuropeSIP / HCL DX Blueprint team.
