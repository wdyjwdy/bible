import {
  createSignal,
  createEffect,
  useContext,
  onCleanup,
  onMount,
} from "solid-js";
import { setOptionsConfig, getOptionsConfig } from "./api";
import { ControlContext } from "./context";
import {
  SelectObject,
  PrevArrowButton,
  NextArrowButton,
  SettingToggleButton,
  Switch,
  ToggleGroupTheme,
} from "./ui";

const bibleOptions = [
  { id: 1, cn: "创世纪", en: "Genesis", num: 50 },
  { id: 2, cn: "出埃及记", en: "Exodus", num: 40 },
  { id: 3, cn: "利未记", en: "Leviticus", num: 27 },
  { id: 4, cn: "民数记", en: "Numbers", num: 36 },
  { id: 5, cn: "申命记", en: "Deuteronomy", num: 34 },
  { id: 6, cn: "约书亚记", en: "Joshua", num: 24 },
  { id: 7, cn: "士师记", en: "Judges", num: 21 },
  { id: 8, cn: "路得记", en: "Ruth", num: 4 },
  { id: 9, cn: "撒母耳记上", en: "1 Samuel", num: 31 },
  { id: 10, cn: "撒母耳记下", en: "2 Samuel", num: 24 },
  { id: 11, cn: "列王纪上", en: "1 Kings", num: 22 },
  { id: 12, cn: "列王纪下", en: "2 Kings", num: 25 },
  { id: 13, cn: "历代志上", en: "1 Chronicles", num: 29 },
  { id: 14, cn: "历代志下", en: "2 Chronicles", num: 36 },
  { id: 15, cn: "以斯拉记", en: "Ezra", num: 10 },
  { id: 16, cn: "尼希米记", en: "Nehemiah", num: 13 },
  { id: 17, cn: "以斯帖记", en: "Esther", num: 10 },
  { id: 18, cn: "约伯记", en: "Job", num: 42 },
  { id: 19, cn: "诗篇", en: "Psalms", num: 150 },
  { id: 20, cn: "箴言", en: "Proverbs", num: 31 },
  { id: 21, cn: "传道书", en: "Ecclesiastes", num: 12 },
  { id: 22, cn: "雅歌", en: "Song of Songs", num: 8 },
  { id: 23, cn: "以赛亚书", en: "Isaiah", num: 66 },
  { id: 24, cn: "耶利米书", en: "Jeremiah", num: 52 },
  { id: 25, cn: "耶利米哀歌", en: "Lamentations", num: 5 },
  { id: 26, cn: "以西结书", en: "Ezekiel", num: 48 },
  { id: 27, cn: "但以理书", en: "Daniel", num: 12 },
  { id: 28, cn: "何西阿书", en: "Hosea", num: 14 },
  { id: 29, cn: "约珥书", en: "Joel", num: 3 },
  { id: 30, cn: "阿摩司书", en: "Amos", num: 9 },
  { id: 31, cn: "俄巴底亚书", en: "Obadiah", num: 1 },
  { id: 32, cn: "约拿书", en: "Jonah", num: 4 },
  { id: 33, cn: "弥迦书", en: "Micah", num: 7 },
  { id: 34, cn: "那鸿书", en: "Nahum", num: 3 },
  { id: 35, cn: "哈巴谷书", en: "Habakkuk", num: 3 },
  { id: 36, cn: "西番雅书", en: "Zephaniah", num: 3 },
  { id: 37, cn: "哈该书", en: "Haggai", num: 2 },
  { id: 38, cn: "撒迦利亚书", en: "Zechariah", num: 14 },
  { id: 39, cn: "玛拉基书", en: "Malachi", num: 4 },
  { id: 40, cn: "马太福音", en: "Matthew", num: 28 },
  { id: 41, cn: "马可福音", en: "Mark", num: 16 },
  { id: 42, cn: "路加福音", en: "Luke", num: 24 },
  { id: 43, cn: "约翰福音", en: "John", num: 21 },
  { id: 44, cn: "使徒行传", en: "Acts", num: 28 },
  { id: 45, cn: "罗马书", en: "Romans", num: 16 },
  { id: 46, cn: "哥林多前书", en: "1 Corinthians", num: 16 },
  { id: 47, cn: "哥林多后书", en: "2 Corinthians", num: 13 },
  { id: 48, cn: "加拉太书", en: "Galatians", num: 6 },
  { id: 49, cn: "以弗所书", en: "Ephesians", num: 6 },
  { id: 50, cn: "腓立比书", en: "Philippians", num: 4 },
  { id: 51, cn: "歌罗西书", en: "Colossians", num: 4 },
  { id: 52, cn: "帖撒罗尼迦前书", en: "1 Thessalonians", num: 5 },
  { id: 53, cn: "帖撒罗尼迦后书", en: "2 Thessalonians", num: 3 },
  { id: 54, cn: "提摩太前书", en: "1 Timothy", num: 6 },
  { id: 55, cn: "提摩太后书", en: "2 Timothy", num: 4 },
  { id: 56, cn: "提多书", en: "Titus", num: 3 },
  { id: 57, cn: "腓利门书", en: "Philemon", num: 1 },
  { id: 58, cn: "希伯来书", en: "Hebrews", num: 13 },
  { id: 59, cn: "雅各书", en: "James", num: 5 },
  { id: 60, cn: "彼得前书", en: "1 Peter", num: 5 },
  { id: 61, cn: "彼得后书", en: "2 Peter", num: 3 },
  { id: 62, cn: "约翰一书", en: "1 John", num: 5 },
  { id: 63, cn: "约翰二书", en: "2 John", num: 1 },
  { id: 64, cn: "约翰三书", en: "3 John", num: 1 },
  { id: 65, cn: "犹大书", en: "Jude", num: 1 },
  { id: 66, cn: "启示录", en: "Revelation", num: 22 },
];

function getOptionsVersion() {
  return [
    { id: 1, version: "cus", lang: "cn", description: "和合本" },
    { id: 2, version: "cunpss", lang: "cn", description: "和合本（新标点）" },
    { id: 3, version: "rcuvss", lang: "cn", description: "和合本（修订版）" },
    { id: 4, version: "kjv", lang: "en", description: "King James Version" },
  ];
}

function getOptionsVolumn(lang = "cn") {
  return bibleOptions.map((option) => ({
    id: option.id,
    volume: option[lang],
  }));
}

function getOptionsChapter(volume = 1) {
  const { num } = bibleOptions[volume - 1];
  const options = [];
  for (let i = 1; i <= num; i++) {
    options.push({ id: i });
  }
  return options;
}

function SelectVersion() {
  const { version, setVersion } = useContext(ControlContext);
  const options = getOptionsVersion();

  function handleChange(value) {
    setVersion(value);
    setOptionsConfig("version", value);
  }

  return (
    <SelectObject
      class="select-version"
      value={version()}
      onChange={handleChange}
      options={options}
      optionValue="id"
      optionTextValue="description"
    />
  );
}

function SelectVolume() {
  const { version, volume, setVolume } = useContext(ControlContext);
  const [options, setOptions] = createSignal(getOptionsVolumn());

  function handleChange(value) {
    setVolume(value);
  }

  function getOptionGroup() {
    const { lang } = version();
    return [
      {
        label: lang === "cn" ? "旧约" : "OLD",
        options: options().slice(0, 39),
      },
      {
        label: lang === "cn" ? "新约" : "NEW",
        options: options().slice(39),
      },
    ];
  }

  createEffect(() => {
    setOptions(getOptionsVolumn(version().lang));
  });

  return (
    <SelectObject
      class="select-volume"
      value={volume()}
      onChange={handleChange}
      options={getOptionGroup()}
      optionValue="id"
      optionTextValue="volume"
      optionGroupChildren="options"
    />
  );
}

function SelectChapter() {
  const { volume, chapter, setChapter } = useContext(ControlContext);
  const [options, setOptions] = createSignal(getOptionsChapter());

  function handleChange(value) {
    setChapter(value);
  }

  createEffect(() => {
    const options = getOptionsChapter(volume().id);
    setOptions(options);
    setChapter(options[0]);
  });

  return (
    <SelectObject
      class="select-chapter"
      value={chapter()}
      onChange={handleChange}
      options={options()}
      optionValue="id"
      optionTextValue="id"
    />
  );
}

function ButtonPrevArrow() {
  const { volume, chapter, setChapter } = useContext(ControlContext);

  function handleClick() {
    const options = getOptionsChapter(volume().id);
    const { id } = chapter();
    if (id > 1) {
      setChapter(options[id - 2]);
    }
  }

  onMount(() => {
    const handler = ({ code }) => {
      if (code === "ArrowLeft") {
        handleClick();
      }
    };
    document.addEventListener("keydown", handler);
    onCleanup(() => {
      document.removeEventListener("keydown", handler);
    });
  });

  return <PrevArrowButton onClick={handleClick} />;
}

function ButtonNextArrow() {
  const { volume, chapter, setChapter } = useContext(ControlContext);

  function handleClick() {
    const options = getOptionsChapter(volume().id);
    const { id } = chapter();
    if (id < options.length) {
      setChapter(options[id]);
    }
  }

  onMount(() => {
    const handler = ({ code }) => {
      if (code === "ArrowRight") {
        handleClick();
      }
    };
    document.addEventListener("keydown", handler);
    onCleanup(() => {
      document.removeEventListener("keydown", handler);
    });
  });

  return <NextArrowButton onClick={handleClick} />;
}

function ButtonToggleSetting() {
  const { setting, setSetting } = useContext(ControlContext);
  return <SettingToggleButton pressed={setting()} onChange={setSetting} />;
}

function SwitchChapterView() {
  const { view, setView } = useContext(ControlContext);

  function handleChange(value) {
    setView(value);
    setOptionsConfig("view", value);
  }

  return <Switch checked={view()} onChange={handleChange} />;
}

function SwitchVerseNumber() {
  const { verseNumber, setVerseNumber } = useContext(ControlContext);

  function handleChange(value) {
    setVerseNumber(value);
    setOptionsConfig("verseNumber", value);
  }

  return <Switch checked={verseNumber()} onChange={handleChange} />;
}

function SwitchChapterTitle() {
  const { chapterTitle, setChapterTitle } = useContext(ControlContext);

  function handleChange(value) {
    setChapterTitle(value);
    setOptionsConfig("chapterTitle", value);
  }

  return <Switch checked={chapterTitle()} onChange={handleChange} />;
}

function ToggleGroupThemeLight() {
  const [theme, setTheme] = createSignal("light");
  const options = ["light", "soft"];

  function handleChange(value) {
    setTheme(value);
    document.documentElement.dataset.themeLight = value;
    setOptionsConfig("themeLight", value);
  }

  onMount(async () => {
    const config = await getOptionsConfig();
    setTheme(config.themeLight);
  });

  return (
    <ToggleGroupTheme
      options={options}
      value={theme()}
      onChange={handleChange}
    />
  );
}

function ToggleGroupThemeDark() {
  const [theme, setTheme] = createSignal("dark");
  const options = ["dark", "night"];

  function handleChange(value) {
    setTheme(value);
    document.documentElement.dataset.themeDark = value;
    setOptionsConfig("themeDark", value);
  }

  onMount(async () => {
    const config = await getOptionsConfig();
    setTheme(config.themeDark);
  });

  return (
    <ToggleGroupTheme
      options={options}
      value={theme()}
      onChange={handleChange}
    />
  );
}

export {
  getOptionsVersion,
  getOptionsVolumn,
  getOptionsChapter,
  SelectVersion,
  SelectVolume,
  SelectChapter,
  ButtonPrevArrow,
  ButtonNextArrow,
  ButtonToggleSetting,
  SwitchVerseNumber,
  SwitchChapterTitle,
  SwitchChapterView,
  ToggleGroupThemeLight,
  ToggleGroupThemeDark,
};
