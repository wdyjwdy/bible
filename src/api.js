import { getVersionById } from "./data";

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

async function getBibleData(version) {
  try {
    const { code } = getVersionById(version);
    const cache = await readFromCache(code);
    if (cache) {
      return cache;
    }
    const url = `https://raw.githubusercontent.com/wdyjwdy/bible/main/data/${code}.json`;
    const res = await fetch(url);
    const json = await res.json();
    saveToCache(code, json);
    return json;
  } catch (error) {
    console.error("getBibleData", error);
  }
}

async function getVerses(version, book, chapter) {
  const data = await getBibleData(version);
  return data.filter(({ b, c }) => b === book && c === chapter);
}

async function searchVerses(version, query) {
  if (!query) return [];
  const verses = await getBibleData(version);
  return verses.filter(({ t, h }) => {
    if (h) return false;
    return t.includes(query);
  });
}

async function getOptionsConfig() {
  try {
    const cache = await readFromCache("config");
    if (cache) {
      return cache;
    }
    const defaultConfig = {
      version: 1,
      book: 1,
      chapter: 1,
      newline: true,
      number: true,
      title: false,
      heading: true,
      light: 1,
      dark: 1,
    };
    saveToCache("config", defaultConfig);
    return defaultConfig;
  } catch (error) {
    console.error("getOptionsConfig", error);
  }
}

async function setOptionsConfig(key, value) {
  try {
    const config = await getOptionsConfig();
    config[key] = value;
    saveToCache("config", config);
  } catch (error) {
    console.error("setOptionsConfig", error);
  }
}

export { getVerses, getOptionsConfig, setOptionsConfig, searchVerses };
