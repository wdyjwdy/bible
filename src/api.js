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
  const code = getVersionCode(version);
  const cache = await readFromCache(code);
  if (cache) {
    return cache;
  }
  const url = `https://raw.githubusercontent.com/wdyjwdy/bible/main/data/${code}.json`;
  const res = await fetch(url);
  const json = await res.json();
  saveToCache(code, json);
  return json;
}

async function getVerses({ version, book, chapter }) {
  const data = await getBibleData(version);
  return data.filter(({ b, c }) => b === book && c === chapter);
}

async function getFavorites() {
  const { version, favorites } = await getCacheConfig();
  const verses = await getBibleData(version);
  return verses.filter((v) => {
    return favorites.some((f) => {
      return v.b === f.b && v.c === f.c && v.v === f.v;
    });
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

function getDefaultConfig() {
  return {
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
    comapre: false,
    compareVersion: 8,
    language: 1,
  };
}

async function getCacheConfig() {
  const cacheConfig = await readFromCache("config");
  const defaultConfig = getDefaultConfig();
  const config = { ...defaultConfig, ...cacheConfig };
  saveToCache("config", config);
  return config;
}

async function setCacheConfig(key, value) {
  const config = await getCacheConfig();
  config[key] = value;
  saveToCache("config", config);
}

function getVersionCode(version) {
  return versionList[version - 1].code;
}

function getVersionCount() {
  return versionList.length;
}

function getVersionLabel(version) {
  return versionList[version - 1].label;
}

function getBookCount() {
  return bookList.length;
}

function getBookLabel(book, version) {
  const { lang } = versionList[version - 1];
  return bookList[book - 1][lang];
}

function getChapterCount(book) {
  return bookList[book - 1].count;
}

function getChapterLabel(chapter) {
  return chapter;
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
  getCacheConfig,
  setCacheConfig,
  getDefaultConfig,
  getFavorites,
  getVerses,
  searchVerses,
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
