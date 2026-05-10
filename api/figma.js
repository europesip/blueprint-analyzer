const FIGMA_BASE = 'https://api.figma.com/v1';
const MAX_FIGMA_RESPONSE_CHARS = 18_000_000;

async function appendServerLog(payload) {
  try {
    const { appendFile, mkdir } = await import('node:fs/promises');
    const path = await import('node:path');
    const logDir = process.env.BLUEPRINT_ANALYZER_LOG_DIR || process.cwd();
    const logFile = path.join(logDir, 'log.txt');
    await mkdir(logDir, { recursive: true });
    await appendFile(logFile, `${new Date().toISOString()} ${JSON.stringify(payload)}\n`, 'utf8');
  } catch (err) {
    console.error('[blueprint-analyzer-log]', err);
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 2_000_000) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function tokenFrom(req, body) {
  const auth = req.headers.authorization || '';
  if (auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim();
  return req.headers['x-figma-token'] || body.token || process.env.FIGMA_API_TOKEN || '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const body = await readBody(req);
    const token = tokenFrom(req, body);
    const fileKey = String(body.fileKey || '').trim();
    const depth = Number(body.depth || 2);

    if (!token) throw new Error('Missing Figma token');
    if (!/^[A-Za-z0-9_-]+$/.test(fileKey)) throw new Error('Invalid Figma file key');
    if (depth < 1 || depth > 4) throw new Error('Depth must be between 1 and 4');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 75000);
    const url = `${FIGMA_BASE}/files/${fileKey}?depth=${depth}`;
    await appendServerLog({ event: 'server.figma.fetch.start', fileKey, depth });
    let figmaResponse;
    try {
      figmaResponse = await fetch(url, {
        signal: controller.signal,
        headers: { 'X-Figma-Token': token },
      });
    } finally {
      clearTimeout(timeout);
    }
    const text = await figmaResponse.text();
    await appendServerLog({ event: 'server.figma.fetch.end', fileKey, depth, status: figmaResponse.status, chars: text.length });

    if (figmaResponse.ok && text.length > MAX_FIGMA_RESPONSE_CHARS) {
      await appendServerLog({ event: 'server.figma.fetch.too_large', fileKey, depth, chars: text.length, maxChars: MAX_FIGMA_RESPONSE_CHARS });
      res.statusCode = 413;
      res.setHeader('content-type', 'application/json');
      res.setHeader('cache-control', 'no-store');
      res.end(
        JSON.stringify({
          code: 'FIGMA_PAYLOAD_TOO_LARGE',
          status: 'payload-too-large',
          error: `Figma returned a very large payload (${Math.round(text.length / 1024 / 1024)} MB). Lower the Figma depth, use a smaller file/section, or import a prepared Figma JSON export.`,
          sizeBytes: text.length,
          maxBytes: MAX_FIGMA_RESPONSE_CHARS,
        })
      );
      return;
    }

    res.statusCode = figmaResponse.status;
    res.setHeader('content-type', figmaResponse.headers.get('content-type') || 'application/json');
    res.setHeader('cache-control', 'no-store');
    res.end(text);
  } catch (err) {
    await appendServerLog({ event: 'server.figma.fetch.error', error: err.message, name: err.name });
    res.statusCode = err.name === 'AbortError' ? 504 : 400;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: err.name === 'AbortError' ? 'Figma API request timed out. Try a smaller file/section or use a Figma JSON export.' : err.message }));
  }
}
