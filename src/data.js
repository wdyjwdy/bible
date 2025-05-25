const versionList = [
  { id: 1, code: "cuv", lang: "cn", label: "和合本" },
  { id: 2, code: "cunpss", lang: "cn", label: "和合本（新标点）" },
  { id: 3, code: "rcuvss", lang: "cn", label: "和合本（修订版）" },
  { id: 4, code: "kjv", lang: "en", label: "King James Version" },
  { id: 5, code: "nkjv", lang: "en", label: "New King James Version" },
  { id: 6, code: "esv", lang: "en", label: "English Standard Version" },
  { id: 7, code: "niv", lang: "en", label: "New International Version" },
  { id: 8, code: "nlt", lang: "en", label: "New Living Translation" },
  { id: 9, code: "nasb", lang: "en", label: "New American Standard Bible" },
  { id: 10, code: "cnvs", lang: "cn", label: "新译本" },
  { id: 11, code: "ccb", lang: "cn", label: "当代译本" },
  { id: 12, code: "csb", lang: "en", label: "Christian Standard Bible" },
];

function getVersionList() {
  return versionList;
}

function getVersionById(id) {
  return versionList.find((v) => v.id === id);
}

export { getVersionList, getVersionById };
