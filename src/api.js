async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("BibleApp");

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("cache")) {
        db.createObjectStore("cache", { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveToCache(key, value) {
  const db = await openDB();
  const tx = db.transaction("cache", "readwrite");
  const store = tx.objectStore("cache");
  store.put({ key, value });
  return tx.complete;
}

async function readFromCache(key) {
  const db = await openDB();
  const tx = db.transaction("cache", "readonly");
  const store = tx.objectStore("cache");
  return new Promise((resolve, reject) => {
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result?.value);
    request.onerror = () => reject(request.error);
  });
}

async function getBibleData(version = "cus") {
  try {
    const cache = await readFromCache(version);
    if (cache) {
      return cache;
    }
    const url = `https://raw.githubusercontent.com/wdyjwdy/bible/main/data/${version}.json`;
    const res = await fetch(url);
    const json = await res.json();
    saveToCache(version, json);
    return json;
  } catch (error) {
    console.error("api.js", error);
  }
}

async function getVerses(version = "cus", volumn = 1, chapter = 1) {
  const data = await getBibleData(version);
  return data.filter((x) => x.b === volumn && x.c === chapter);
}

export { getVerses };
