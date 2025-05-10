async function getBible(key, version, volume, chapter) {
  try {
    let url = "https://bible-api.com/data";
    if (version) url += `/${version}`;
    if (volume) url += `/${volume}`;
    if (chapter) url += `/${chapter}`;
    const cached = localStorage.getItem(url);
    if (cached) {
      return JSON.parse(cached);
    }
    const res = await fetch(url);
    const json = await res.json();
    const val = json[key];
    localStorage.setItem(url, JSON.stringify(val));
    return val;
  } catch (error) {
    console.error("api.js", error);
  }
}

async function getVersions() {
  return getBible("translations");
}

async function getVolumes(version = "cuv") {
  return getBible("books", version);
}

async function getChapters(version = "cuv", volume = "GEN") {
  return getBible("chapters", version, volume);
}

async function getVerses(version = "cuv", volume = "GEN", chapter = 1) {
  return getBible("verses", version, volume, chapter);
}

export { getVersions, getVolumes, getChapters, getVerses };
