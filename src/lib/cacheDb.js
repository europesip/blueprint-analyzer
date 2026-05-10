const DB_NAME = 'blueprint-analyzer-cache';
const DB_VERSION = 3;
const STORES = ['figmaFiles', 'webPages', 'figmaImages', 'webScreenshots'];

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      STORES.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: 'key' });
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore(storeName, mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const result = fn(store);
    tx.oncomplete = () => {
      db.close();
      resolve(result?.result ?? result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function getCache(storeName, key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const request = tx.objectStore(storeName).get(key);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function setCache(storeName, entry) {
  return withStore(storeName, 'readwrite', (store) => store.put({ ...entry, updatedAt: new Date().toISOString() }));
}

export async function deleteCache(storeName, key) {
  return withStore(storeName, 'readwrite', (store) => store.delete(key));
}

export async function listCache(storeName) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const request = tx.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function clearCache() {
  await Promise.all(STORES.map((storeName) => withStore(storeName, 'readwrite', (store) => store.clear())));
}

export function isFresh(entry, maxAgeHours) {
  if (!entry?.updatedAt) return false;
  const ageMs = Date.now() - new Date(entry.updatedAt).getTime();
  return ageMs < Number(maxAgeHours || 24) * 60 * 60 * 1000;
}
