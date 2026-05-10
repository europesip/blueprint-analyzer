import { getCache, isFresh, setCache } from './cacheDb';

export async function loadWebScreenshot({ url, selector = '', forceRefresh = false, maxAgeHours = 6 }) {
  const cleanUrl = String(url || '').trim();
  if (!cleanUrl) throw new Error('Missing web URL for screenshot');
  const cacheKey = `${cleanUrl}::${selector || 'page'}`;
  const cached = await getCache('webScreenshots', cacheKey);
  if (cached && !forceRefresh && isFresh(cached, maxAgeHours)) {
    return { ...cached, cache: { hit: true, key: cacheKey, updatedAt: cached.updatedAt } };
  }

  const response = await fetch('/api/web-screenshot', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ url: cleanUrl, selector }),
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Web screenshot endpoint did not return JSON. Response started with: ${text.slice(0, 120)}`);
  }
  if (!response.ok) throw new Error(data.error || `Web screenshot returned HTTP ${response.status}`);

  const payload = {
    key: cacheKey,
    url: cleanUrl,
    selector,
    image: data.image || '',
    mode: data.mode || 'screenshot',
    warning: data.warning || '',
  };
  await setCache('webScreenshots', payload);
  return { ...payload, cache: { hit: false, key: cacheKey, updatedAt: new Date().toISOString() } };
}
