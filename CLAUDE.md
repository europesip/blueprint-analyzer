# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server on 0.0.0.0 (all interfaces)
npm run build     # production build
npm run preview   # serve the production build
npm run lint      # ESLint check
```

The app expects a backend proxy at `/api/figma`, `/api/figma-image`, `/api/web`, and `/api/log` — these are not included in this repo. When running locally you either need a proxy sidecar or must use JSON file import and the sample design.

## Environment variables (Vite, optional)

| Variable | Purpose |
|---|---|
| `VITE_RULESET_VERSION` | Ruleset label embedded in exports (default: `guide-v6`) |
| `VITE_APP_STORAGE_KEY` | localStorage key for settings (default: `blueprint-analyzer:v1`) |
| `VITE_DEFAULT_CONFIDENCE_THRESHOLD` | Initial classifier threshold 0–100 (default: `65`) |
| `VITE_FIGMA_PROXY_URL` | Override Figma proxy endpoint |
| `VITE_DEFAULT_FIGMA_URL` | Pre-fill the Figma URL input |

## Architecture

This is a client-side React 19 + Vite SPA. There is no routing library — view switching happens via an `activeTab` state string in `App.jsx`. All persistence is browser-local.

### Data flow

```
ImportPanel (user action)
  → figmaClient / webImport / normalizeDesignJson   ← raw source → normalized frames
  → analyzeDesign()                                 ← frames → analysis (items + families + summary)
  → saveProject() → IndexedDB                       ← persisted
  → App state → AnalysisTable / Summary / ComponentDetailPage
```

### Key modules

| Path | Role |
|---|---|
| `src/lib/analyzer.js` | Core classification engine. Scores each frame against `COMPONENT_RULES`, groups frames into families, computes confidence, effort, and path. `analyzeDesign()` is the main entry point. |
| `src/lib/figmaImport.js` | Normalizes raw Figma REST JSON into the canonical frame schema. Handles screen-frame filtering, repeated-component consolidation, and depth walk. |
| `src/lib/figmaClient.js` | Fetches Figma via `/api/figma` proxy, caches in IndexedDB via `cacheDb`. |
| `src/lib/webImport.js` | Fetches a page via `/api/web` proxy, parses DOM into frames via `DOMParser`. |
| `src/lib/localDb.js` | Projects are stored in IndexedDB (`blueprint-analyzer-projects`). Settings are in localStorage. Older projects stored in localStorage are auto-migrated on first load. |
| `src/lib/cacheDb.js` | Separate IndexedDB (`blueprint-analyzer-cache`) for raw Figma and web-page payloads with TTL. |
| `src/data/rulebook.js` | `COMPONENT_RULES` (scoring weights, keywords, figmaSignals, extensionTriggers), `IMPLEMENTATION_PATHS` (classification buckets), `REVIEW_CHECKS`. This is the main tuning file. |
| `src/data/componentContracts.js` | Detailed per-component WCM/prop contracts for the detail panel. |
| `src/data/sourceSignatures.js` | CSS class and prop-name signatures extracted from Blueprint source, used during scoring to boost confidence. |
| `src/i18n.js` | Flat dictionary for en / es / ar (LTR/RTL). `t(language, key)` and `dir(language)` are the only public functions. |

### Classification paths

`IMPLEMENTATION_PATHS` in `rulebook.js` defines the six buckets every frame is placed in:

- `OOTB_BLUEPRINT` — maps to an existing Blueprint component
- `CONFIG_STYLE` — visual difference only; use tokens/CSS
- `BLUEPRINT_EXTENSION` — requires registered Blueprint Extension
- `WCM_CONTENT` — editorial/collection content
- `PORTAL_NATIVE` — header, footer, search handled by Portal
- `SCRIPT_APP` — business logic, auth, live data
- `REVIEW` — insufficient evidence

### Design token palette (Tailwind)

Custom colors: `ink`, `paper`, `line`, `brand` (#0f766e teal), `signal` (blue), `warn` (amber), `risk` (red). Badge and path coloring is driven by these four semantic color names. Custom shadow: `shadow-panel`. Fonts: Inter (sans), IBM Plex Mono (mono).

### Normalized frame schema

Every import source (Figma REST, DXForge JSON, plain array, web DOM) is normalized to the same frame shape before scoring:

```js
{
  id, name, pageName, type,
  parentId, parentName, depth, childCandidateCount,
  x, y, width, height,
  textSamples: [{ text, fontSize, fontWeight }],
  childSummary: [{ type, count }],
  visual: { bg, radius, layoutMode, opacity },
  raw: { /* source-specific metadata */ }
}
```

When adding a new import format, produce this shape in `figmaImport.js` and route it from `normalizeDesignJson()`.

### Adding / tuning classification rules

Edit `src/data/rulebook.js` — specifically `COMPONENT_RULES`. Each rule has:
- `keywords` — matched against frame name + text samples (full weight)
- `figmaSignals` — matched at 55 % weight
- `extensionTriggers` — escalates path to `BLUEPRINT_EXTENSION` and adds 5 pts
- `weight` — base multiplier for keyword hits
- `path` — default path when this rule wins

Structural bonuses (full-width, compact, repeated children, etc.) are applied in `scoreRule()` in `analyzer.js`. The threshold below which a frame goes to `REVIEW` is `settings.confidenceThreshold` (default 65, configurable in the UI).
