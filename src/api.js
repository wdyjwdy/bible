import { versionList, bookList, lightThemeList, darkThemeList } from "./data";

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

async function getFavorites() {
  const { version, favorites } = await getCacheConfig();
  const data = await getBibleData(version);
  return favorites.map(({ b, c, v }) => {
    return data.find((d) => d.b === b && d.c === c && d.v === v);
  });
}

async function searchVerses(version, query) {
  if (!query) return [];
  const verses = await getBibleData(version);
  return verses.filter(({ t, h }) => {
    if (h) return false;
    return t.includes(query);
  });
}

async function getCacheConfig() {
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
      favorites: [],
    };
    saveToCache("config", defaultConfig);
    return defaultConfig;
  } catch (error) {
    console.error("getCacheConfig", error);
  }
}

async function setCacheConfig(key, value) {
  try {
    const config = await getCacheConfig();
    config[key] = value;
    saveToCache("config", config);
  } catch (error) {
    console.error("setCacheConfig", error);
  }
}

function getVersionById(id) {
  return versionList.find((v) => v.id === id);
}

function getBookById(version, book) {
  const { lang } = getVersionById(version);
  const bookItem = bookList[book - 1];
  return { id: bookItem.id, label: bookItem[lang] };
}

function getVersionCount() {
  return versionList.length;
}

function getVersionLabel(id) {
  return versionList[id - 1].label;
}

function getBookCount() {
  return bookList.length;
}

function getBookLabel(id, version) {
  const { lang } = versionList[version - 1];
  return bookList[id - 1][lang];
}

function getChapterCount(book) {
  return bookList[book - 1].count;
}

function getChapterLabel(id) {
  return id;
}

function getLightThemeCount() {
  return lightThemeList.length;
}

function getLightThemeLabel(id) {
  return lightThemeList[id - 1];
}

function getDarkThemeCount() {
  return darkThemeList.length;
}

function getDarkThemeLabel(id) {
  return darkThemeList[id - 1];
}

export {
  getFavorites,
  getVerses,
  getCacheConfig,
  setCacheConfig,
  searchVerses,
  getBookById,
  getVersionCount,
  getVersionLabel,
  getBookCount,
  getBookLabel,
  getChapterCount,
  getChapterLabel,
  getLightThemeCount,
  getLightThemeLabel,
  getDarkThemeCount,
  getDarkThemeLabel,
};
