const FIGMA_BASE = 'https://api.figma.com/v1';

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) reject(new Error('Request body too large'));
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

function tokenFrom(req, body) {
  const auth = req.headers.authorization || '';
  return auth.replace(/^Bearer\s+/i, '') || req.headers['x-figma-token'] || body.token || process.env.FIGMA_API_TOKEN || '';
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
    const nodeId = String(body.nodeId || '').trim();
    const scale = Math.max(1, Math.min(Number(body.scale || 2), 4));

    if (!token) throw new Error('Missing Figma token');
    if (!/^[A-Za-z0-9_-]+$/.test(fileKey)) throw new Error('Invalid Figma file key');
    if (!nodeId) throw new Error('Missing Figma node id');

    const params = new URLSearchParams({
      ids: nodeId,
      format: 'png',
      scale: String(scale),
    });
    const figmaResponse = await fetch(`${FIGMA_BASE}/images/${fileKey}?${params.toString()}`, {
      headers: { 'X-Figma-Token': token },
    });
    const data = await figmaResponse.json();

    res.statusCode = figmaResponse.status;
    res.setHeader('content-type', 'application/json');
    res.setHeader('cache-control', 'no-store');
    res.end(JSON.stringify({ url: data.images?.[nodeId] || '', ...data }));
  } catch (err) {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: err.message }));
  }
}
