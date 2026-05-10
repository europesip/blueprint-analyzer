import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const MAX_FIGMA_RESPONSE_CHARS = 18_000_000;

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(payload));
}

function screenshotFallbackSvg(url, reason) {
  const safeUrl = String(url || '').replace(/[<>&"]/g, ' ');
  const safeReason = String(reason || 'Screenshot service unavailable').replace(/[<>&"]/g, ' ');
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
    <rect width="1200" height="760" fill="#f8fafc"/>
    <rect x="48" y="48" width="1104" height="664" rx="12" fill="#ffffff" stroke="#cbd5e1"/>
    <rect x="48" y="48" width="1104" height="56" rx="12" fill="#0f172a"/>
    <circle cx="86" cy="76" r="8" fill="#ef4444"/>
    <circle cx="112" cy="76" r="8" fill="#f59e0b"/>
    <circle cx="138" cy="76" r="8" fill="#10b981"/>
    <text x="176" y="82" font-family="Arial, sans-serif" font-size="18" fill="#e2e8f0">${safeUrl}</text>
    <rect x="96" y="156" width="420" height="34" rx="6" fill="#334155"/>
    <rect x="96" y="214" width="620" height="16" rx="4" fill="#94a3b8"/>
    <rect x="96" y="244" width="540" height="16" rx="4" fill="#cbd5e1"/>
    <rect x="96" y="300" width="280" height="44" rx="8" fill="#0f766e"/>
    <rect x="760" y="156" width="300" height="180" rx="12" fill="#dbeafe"/>
    <rect x="760" y="372" width="300" height="38" rx="8" fill="#bfdbfe"/>
    <rect x="760" y="432" width="300" height="38" rx="8" fill="#bfdbfe"/>
    <text x="96" y="640" font-family="Arial, sans-serif" font-size="22" fill="#475569">Live screenshot unavailable</text>
    <text x="96" y="676" font-family="Arial, sans-serif" font-size="16" fill="#64748b">${safeReason}</text>
  </svg>`)}`;
}

function sanitizeLog(payload) {
  return JSON.parse(
    JSON.stringify(payload, (key, value) => {
      if (/token|key|authorization|password/i.test(key)) return '[redacted]';
      if (typeof value === 'string' && value.length > 1000) return `${value.slice(0, 1000)}...`;
      return value;
    })
  );
}

async function appendLog(payload) {
  const logFile = path.join(process.cwd(), 'log.txt');
  await mkdir(process.cwd(), { recursive: true });
  await appendFile(logFile, `${new Date().toISOString()} ${JSON.stringify(sanitizeLog(payload))}\n`, 'utf8');
}

async function fetchWithTimeout(url, options = {}, ms = 75000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function devApiPlugin(env) {
  return {
    name: 'blueprint-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/log', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
        try {
          const body = await readJsonBody(req);
          await appendLog(body);
          res.statusCode = 204;
          res.end();
          return undefined;
        } catch (err) {
          return sendJson(res, 500, { error: err.message || 'Local log write failed' });
        }
      });

      server.middlewares.use('/api/figma-image', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
        try {
          const body = await readJsonBody(req);
          const token = req.headers.authorization?.replace(/^Bearer\s+/i, '') || req.headers['x-figma-token'] || body.token || env.FIGMA_API_TOKEN || '';
          const fileKey = String(body.fileKey || '').trim();
          const nodeId = String(body.nodeId || '').trim();
          const scale = Math.max(1, Math.min(Number(body.scale || 2), 4));
          if (!fileKey) return sendJson(res, 400, { error: 'Missing Figma file key' });
          if (!nodeId) return sendJson(res, 400, { error: 'Missing Figma node id' });
          if (!token) return sendJson(res, 401, { error: 'Missing Figma API token. Add it in Settings or FIGMA_API_TOKEN in .env.local.' });

          const params = new URLSearchParams({ ids: nodeId, format: 'png', scale: String(scale) });
          const response = await fetch(`https://api.figma.com/v1/images/${encodeURIComponent(fileKey)}?${params.toString()}`, {
            headers: { 'X-Figma-Token': token },
          });
          const payload = await response.json();
          return sendJson(res, response.status, { url: payload.images?.[nodeId] || '', ...payload });
        } catch (err) {
          return sendJson(res, 500, { error: err.message || 'Local Figma image proxy failed' });
        }
      });

      server.middlewares.use('/api/figma', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
        try {
          const body = await readJsonBody(req);
          const token = req.headers.authorization?.replace(/^Bearer\s+/i, '') || req.headers['x-figma-token'] || body.token || env.FIGMA_API_TOKEN || '';
          const fileKey = String(body.fileKey || '').trim();
          const depth = Math.max(1, Math.min(Number(body.depth || 2), 4));
          if (!fileKey) return sendJson(res, 400, { error: 'Missing Figma file key' });
          if (!token) return sendJson(res, 401, { error: 'Missing Figma API token. Add it in Settings or FIGMA_API_TOKEN in .env.local.' });

          await appendLog({ event: 'server.figma.fetch.start', fileKey, depth });
          const response = await fetchWithTimeout(`https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}?depth=${depth}`, {
            headers: { 'X-Figma-Token': token },
          });
          const text = await response.text();
          await appendLog({ event: 'server.figma.fetch.end', fileKey, depth, status: response.status, chars: text.length });
          if (response.ok && text.length > MAX_FIGMA_RESPONSE_CHARS) {
            await appendLog({ event: 'server.figma.fetch.too_large', fileKey, depth, chars: text.length, maxChars: MAX_FIGMA_RESPONSE_CHARS });
            return sendJson(res, 413, {
              code: 'FIGMA_PAYLOAD_TOO_LARGE',
              status: 'payload-too-large',
              error: `Figma returned a very large payload (${Math.round(text.length / 1024 / 1024)} MB). Lower the Figma depth, use a smaller file/section, or import a prepared Figma JSON export.`,
              sizeBytes: text.length,
              maxBytes: MAX_FIGMA_RESPONSE_CHARS,
            });
          }
          res.statusCode = response.status;
          res.setHeader('content-type', response.headers.get('content-type') || 'application/json; charset=utf-8');
          res.setHeader('cache-control', 'no-store');
          res.end(text);
          return undefined;
        } catch (err) {
          await appendLog({ event: 'server.figma.fetch.error', error: err.message, name: err.name });
          return sendJson(res, err.name === 'AbortError' ? 504 : 500, {
            error: err.name === 'AbortError' ? 'Figma API request timed out. Try a smaller file/section or use a Figma JSON export.' : err.message || 'Local Figma proxy failed',
          });
        }
      });

      server.middlewares.use('/api/web-screenshot', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
        let browser;
        try {
          const body = await readJsonBody(req);
          const url = new URL(String(body.url || '').trim());
          if (!['http:', 'https:'].includes(url.protocol)) return sendJson(res, 400, { error: 'Only http/https URLs are supported' });
          try {
            const { chromium } = await import('playwright');
            browser = await chromium.launch({ headless: true });
            const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
            await page.goto(url.toString(), { waitUntil: 'networkidle', timeout: 30000 });
            const bytes = await page.screenshot({ type: 'png', fullPage: false });
            return sendJson(res, 200, { image: `data:image/png;base64,${Buffer.from(bytes).toString('base64')}`, mode: 'screenshot' });
          } catch (err) {
            return sendJson(res, 200, {
              image: screenshotFallbackSvg(url.toString(), 'Install Playwright on the server to enable real screenshots.'),
              mode: 'fallback',
              warning: err.message || 'Playwright is not available in this runtime.',
            });
          }
        } catch (err) {
          return sendJson(res, 500, { error: err.message || 'Local web screenshot failed' });
        } finally {
          if (browser) await browser.close();
        }
      });

      server.middlewares.use('/api/web', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
        try {
          const body = await readJsonBody(req);
          const url = new URL(String(body.url || '').trim());
          if (!['http:', 'https:'].includes(url.protocol)) return sendJson(res, 400, { error: 'Only http/https URLs are supported' });
          const response = await fetch(url, {
            headers: { 'user-agent': 'BlueprintAnalyzer/0.1 (+local-development)' },
          });
          const html = await response.text();
          return sendJson(res, 200, { url: url.toString(), status: response.status, html: html.slice(0, 2_000_000) });
        } catch (err) {
          return sendJson(res, 500, { error: err.message || 'Local web proxy failed' });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), devApiPlugin(env)],
    server: {
      port: Number(env.VITE_DEV_PORT || 5177),
    },
    preview: {
      port: Number(env.VITE_PREVIEW_PORT || 4177),
    },
  };
});
