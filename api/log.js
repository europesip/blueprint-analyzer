import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const LOG_DIR = process.env.BLUEPRINT_ANALYZER_LOG_DIR || process.cwd();
const LOG_FILE = path.join(LOG_DIR, 'log.txt');

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 256_000) {
        reject(new Error('Log body too large'));
        req.destroy();
      }
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

function sanitize(payload) {
  return JSON.parse(
    JSON.stringify(payload, (key, value) => {
      if (/token|key|authorization|password/i.test(key)) return '[redacted]';
      if (typeof value === 'string' && value.length > 1000) return `${value.slice(0, 1000)}...`;
      return value;
    })
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const payload = sanitize(await readBody(req));
    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(LOG_FILE, `${new Date().toISOString()} ${JSON.stringify(payload)}\n`, 'utf8');
    res.statusCode = 204;
    res.end();
  } catch (err) {
    console.error('[blueprint-analyzer-log]', err);
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: err.message }));
  }
}
