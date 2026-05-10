function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 200_000) {
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const body = await readBody(req);
    const target = new URL(String(body.url || ''));
    if (!['http:', 'https:'].includes(target.protocol)) throw new Error('Only http/https URLs are supported');

    const response = await fetch(target.toString(), {
      headers: {
        'user-agent': 'BlueprintAnalyzer/0.1',
        accept: 'text/html,application/xhtml+xml',
      },
    });
    const html = await response.text();
    res.statusCode = response.ok ? 200 : response.status;
    res.setHeader('content-type', 'application/json');
    res.setHeader('cache-control', 'no-store');
    res.end(JSON.stringify({ url: target.toString(), status: response.status, html: html.slice(0, 2_000_000) }));
  } catch (err) {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: err.message }));
  }
}
