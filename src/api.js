async function getVolumes() {
  try {
    const res = await fetch("https://bible-api.com/data/cuv");
    const json = await res.json();
    const volumes = json.books;
    return volumes;
  } catch (error) {
    console.error("Failed to getVolumes()", error);
  }
}

async function getChapters(volume = "GEN") {
  const res = await fetch(`https://bible-api.com/data/cuv/${volume}`);
  const json = await res.json();
  const chapters = json.chapters;
  return chapters;
}

async function getVerses(volume = "GEN", chapter = 1) {
  const res = await fetch(
    `https://bible-api.com/data/cuv/${volume}/${chapter}`,
  );
  const json = await res.json();
  const verses = json.verses;
  return verses;
}

export { getVolumes, getChapters, getVerses };
