import { getCache, isFresh, setCache } from './cacheDb';
import { normalizeDesignJson } from './figmaImport';

const MAX_FIGMA_RESPONSE_CHARS = 18_000_000;

export function parseFigmaFileKey(input) {
  const value = String(input || '').trim();
  if (!value) throw new Error('Missing Figma URL or file key');
  const urlMatch = value.match(/figma\.com\/(?:file|design|proto)\/([A-Za-z0-9_-]+)/i);
  if (urlMatch) return urlMatch[1];
  if (/^[A-Za-z0-9_-]+$/.test(value)) return value;
  throw new Error('Invalid Figma URL or file key');
}

function withTimeout(ms = 90000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => window.clearTimeout(timeout) };
}

function figmaError(response, data) {
  const message = data?.err || data?.message || data?.error || `Figma API returned HTTP ${response.status}`;
  const error = new Error(message);
  error.status = response.status;
  if (data?.code) error.code = data.code;
  if (response.status === 429) error.code = 'FIGMA_RATE_LIMIT';
  if (response.status === 403 || response.status === 401) error.code = 'FIGMA_AUTH_OR_ACCESS';
  if (response.status === 413) error.code = 'FIGMA_PAYLOAD_TOO_LARGE';
  if (response.status >= 500) error.code = 'FIGMA_SERVER';
  return error;
}

function tooLargeError(size) {
  const error = new Error(
    `Figma returned a very large payload (${Math.round(size / 1024 / 1024)} MB). Lower the Figma depth, use a smaller file/section, or import a prepared Figma JSON export.`
  );
  error.code = 'FIGMA_PAYLOAD_TOO_LARGE';
  error.status = 'payload-too-large';
  return error;
}

async function fetchFigma({ fileKey, token, depth, proxyUrl }) {
  const endpoint = proxyUrl || '/api/figma';
  const timer = withTimeout();
  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      signal: timer.signal,
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ fileKey, depth }),
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutError = new Error('Figma request timed out. The design may be too large or the API may be throttling requests.');
      timeoutError.code = 'FIGMA_TIMEOUT';
      throw timeoutError;
    }
    throw err;
  } finally {
    timer.clear();
  }
  const text = await response.text();
  if (text.length > MAX_FIGMA_RESPONSE_CHARS) throw tooLargeError(text.length);
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Figma proxy did not return JSON. Check that /api/figma is available. Response started with: ${text.slice(0, 120)}`);
  }
  if (!response.ok) throw figmaError(response, data);
  return data;
}

async function fetchFigmaImage({ fileKey, nodeId, token, scale = 2, proxyUrl }) {
  const endpoint = proxyUrl || '/api/figma-image';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ fileKey, nodeId, scale }),
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Figma image proxy did not return JSON. Response started with: ${text.slice(0, 120)}`);
  }
  if (!response.ok) throw new Error(data.error || `Figma Images API returned HTTP ${response.status}`);
  if (!data.url) throw new Error('Figma Images API did not return a render URL for this node.');
  return data;
}

export async function loadFigmaDesign({ input, token, forceRefresh = false, depth = 2, maxAgeHours = 24, proxyUrl = '' }) {
  const fileKey = parseFigmaFileKey(input);
  const cacheKey = `${fileKey}:depth-${depth}`;
  const cached = await getCache('figmaFiles', cacheKey);
  if (cached && !forceRefresh && isFresh(cached, maxAgeHours)) {
    return {
      normalized: normalizeDesignJson(cached.payload),
      cache: { hit: true, updatedAt: cached.updatedAt, key: cacheKey },
      raw: cached.payload,
    };
  }

  const payload = await fetchFigma({ fileKey, token, depth, proxyUrl });
  await setCache('figmaFiles', {
    key: cacheKey,
    fileKey,
    depth,
    payload,
    name: payload.name || fileKey,
    lastModified: payload.lastModified || null,
  });

  return {
    normalized: normalizeDesignJson(payload),
    cache: { hit: false, updatedAt: new Date().toISOString(), key: cacheKey },
    raw: payload,
  };
}

export async function loadFigmaNodeImage({ input, nodeId, token, forceRefresh = false, scale = 2, maxAgeHours = 6, proxyUrl = '' }) {
  const fileKey = parseFigmaFileKey(input);
  const cleanNodeId = String(nodeId || '').replace(/^group:/, '').split('::').pop() || nodeId;
  const cacheKey = `${fileKey}:${cleanNodeId}:scale-${scale}`;
  const cached = await getCache('figmaImages', cacheKey);
  if (cached && !forceRefresh && isFresh(cached, maxAgeHours)) {
    return { url: cached.url, cache: { hit: true, updatedAt: cached.updatedAt, key: cacheKey } };
  }

  const payload = await fetchFigmaImage({ fileKey, nodeId: cleanNodeId, token, scale, proxyUrl });
  await setCache('figmaImages', {
    key: cacheKey,
    fileKey,
    nodeId: cleanNodeId,
    scale,
    url: payload.url,
  });
  return { url: payload.url, cache: { hit: false, updatedAt: new Date().toISOString(), key: cacheKey } };
}
