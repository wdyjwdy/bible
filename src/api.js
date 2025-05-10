async function getBible() {
  try {
    const url =
      "https://raw.githubusercontent.com/wdyjwdy/bible/main/data/CUSVerses.json";
    const cache = localStorage.getItem(url);

    if (cache) {
      return JSON.parse(cache);
    }
    const res = await fetch(url);
    const json = await res.json();
    localStorage.setItem(url, JSON.stringify(json));
    return json;
  } catch (error) {
    console.error("api.js", error);
  }
}

async function getVerses(version, volumn, chapter) {
  const data = await getBible();
  return data.filter((x) => x.bid === volumn && x.cn === chapter);
}

const chineseLabels = [
  "创世纪",
  "出埃及记",
  "利未记",
  "民数记",
  "申命记",
  "约书亚记",
  "士师记",
  "路得记",
  "撒母耳记上",
  "撒母耳记下",
  "列王纪上",
  "列王纪下",
  "历代志上",
  "历代志下",
  "以斯拉记",
  "尼希米记",
  "以斯帖记",
  "约伯记",
  "诗篇",
  "箴言",
  "传道书",
  "雅歌",
  "以赛亚书",
  "耶利米书",
  "耶利米哀歌",
  "以西结书",
  "但以理书",
  "何西阿书",
  "约珥书",
  "阿摩司书",
  "俄巴底亚书",
  "约拿书",
  "弥迦书",
  "那鸿书",
  "哈巴谷书",
  "西番雅书",
  "哈该书",
  "撒迦利亚书",
  "玛拉基书",
  "马太福音",
  "马可福音",
  "路加福音",
  "约翰福音",
  "使徒行传",
  "罗马书",
  "哥林多前书",
  "哥林多后书",
  "加拉太书",
  "以弗所书",
  "腓立比书",
  "歌罗西书",
  "帖撒罗尼迦前书",
  "帖撒罗尼迦后书",
  "提摩太前书",
  "提摩太后书",
  "提多书",
  "腓利门书",
  "希伯来书",
  "雅各书",
  "彼得前书",
  "彼得后书",
  "约翰一书",
  "约翰二书",
  "约翰三书",
  "犹大书",
  "启示录",
];

const chapterNumbers = [
  50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150,
  31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4, 28, 16,
  24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1,
  22,
];

function getNumArray(num) {
  const result = [];
  for (let i = 1; i <= num; i++) {
    result.push(i);
  }
  return result;
}

export { getVerses, chineseLabels, chapterNumbers, getNumArray };
