import { getCache, isFresh, setCache } from './cacheDb';

function textOf(element) {
  return (element.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 240);
}

function normalizeUrl(input) {
  const url = new URL(String(input || '').trim());
  return url.toString();
}

async function fetchWeb(url) {
  const response = await fetch('/api/web', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Web proxy did not return JSON. Check that /api/web is available. Response started with: ${text.slice(0, 120)}`);
  }
  if (!response.ok) throw new Error(data.error || `Web fetch returned HTTP ${response.status}`);
  return data;
}

function framesFromHtml(url, html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const selectors = [
    'header',
    'nav',
    'main > section',
    'section',
    'article',
    'aside',
    'form',
    'footer',
    '[class*="hero"]',
    '[class*="card"]',
    '[class*="carousel"]',
    '[class*="accordion"]',
  ];
  const seen = new Set();
  const nodes = selectors.flatMap((selector) => [...doc.querySelectorAll(selector)]).filter((node) => {
    if (seen.has(node)) return false;
    seen.add(node);
    return textOf(node).length > 0 || node.querySelector('img,video,form,input,button,a');
  });

  const title = doc.querySelector('title')?.textContent?.trim() || url;
  const frames = nodes.slice(0, 80).map((node, index) => {
    const heading = node.querySelector('h1,h2,h3,h4')?.textContent?.trim();
    const className = node.getAttribute('class') || '';
    const tagName = node.tagName;
    const semanticName =
      tagName === 'HEADER'
        ? 'Header / Navigation'
        : tagName === 'NAV'
          ? 'Navigation'
          : tagName === 'FOOTER'
            ? 'Footer'
            : tagName === 'FORM'
              ? 'Form'
              : heading || node.getAttribute('aria-label') || `${tagName.toLowerCase()} ${className}`.trim() || `Block ${index + 1}`;
    return {
      id: `web-${index + 1}`,
      name: semanticName,
      pageName: title,
      type: tagName,
      x: 0,
      y: index * 220,
      width: 1440,
      height: node.tagName === 'HEADER' || node.tagName === 'FOOTER' || node.tagName === 'NAV' ? 120 : 360,
      textSamples: [...node.querySelectorAll('h1,h2,h3,h4,p,a,button,label')]
        .slice(0, 8)
        .map((el) => ({ text: textOf(el), name: el.tagName.toLowerCase() }))
        .filter((sample) => sample.text),
      childSummary: [
        { type: 'TEXT', count: node.querySelectorAll('h1,h2,h3,h4,p,a,button,label').length },
        { type: 'IMAGE', count: node.querySelectorAll('img,picture,video').length },
        { type: 'INPUT', count: node.querySelectorAll('input,select,textarea').length },
        { type: 'LINK', count: node.querySelectorAll('a').length },
      ].filter((entry) => entry.count > 0),
      visual: {},
      raw: {
        sourceKind: 'web',
        tagName,
        className,
        id: node.id || '',
        text: textOf(node),
      },
    };
  });

  return {
    source: 'web-page',
    name: title,
    frames,
    meta: {
      url,
      pageCount: 1,
      lastModified: null,
    },
  };
}

export async function loadWebPage({ input, forceRefresh = false, maxAgeHours = 24 }) {
  const url = normalizeUrl(input);
  const cacheKey = url;
  const cached = await getCache('webPages', cacheKey);
  if (cached && !forceRefresh && isFresh(cached, maxAgeHours)) {
    return {
      normalized: framesFromHtml(url, cached.html),
      cache: { hit: true, updatedAt: cached.updatedAt, key: cacheKey },
    };
  }
  const payload = await fetchWeb(url);
  await setCache('webPages', {
    key: cacheKey,
    url,
    html: payload.html,
    status: payload.status,
  });
  return {
    normalized: framesFromHtml(url, payload.html),
    cache: { hit: false, updatedAt: new Date().toISOString(), key: cacheKey },
  };
}
