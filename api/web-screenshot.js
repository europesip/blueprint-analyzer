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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let browser;
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
    const url = new URL(String(body.url || '').trim());
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only http/https URLs are supported');

    try {
      const { chromium } = await import('playwright');
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
      await page.goto(url.toString(), { waitUntil: 'networkidle', timeout: 30000 });
      const bytes = await page.screenshot({ type: 'png', fullPage: false });
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ image: `data:image/png;base64,${Buffer.from(bytes).toString('base64')}`, mode: 'screenshot' }));
    } catch (err) {
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json');
      res.end(
        JSON.stringify({
          image: screenshotFallbackSvg(url.toString(), 'Install Playwright in the server runtime to enable real screenshots.'),
          mode: 'fallback',
          warning: err.message || 'Playwright is not available in this runtime.',
        })
      );
    }
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: err.message || 'Web screenshot failed' }));
  } finally {
    if (browser) await browser.close();
  }
}
