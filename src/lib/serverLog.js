function clean(value) {
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !/token|key|authorization|password/i.test(key))
      .map(([key, entry]) => [key, typeof entry === 'string' && entry.length > 500 ? `${entry.slice(0, 500)}...` : entry])
  );
}

export function writeServerLog(event, details = {}) {
  fetch('/api/log', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      event,
      details: clean(details),
      url: window.location.href,
      userAgent: window.navigator.userAgent,
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {
    // Logging must never block the analysis flow.
  });
}
