import {
  createSignal,
  createEffect,
  Show,
  useContext,
  onMount,
} from "solid-js";
import { getVerses, getFavorites } from "./api";
import { SettingItem } from "./components";
import { ConfigContext } from "./context";
import { getBookById } from "./data";
import { setCacheConfig } from "./api";
import {
  SelectVersion,
  SelectBook,
  SelectChapter,
  ButtonPrevArrow,
  ButtonNextArrow,
  ButtonToggleSetting,
  ButtonSetting,
  ButtonSearch,
  ButtonFavorites,
  SwitchVerseNumber,
  SwitchChapterTitle,
  SwitchChapterHeading,
  SwitchChapterView,
  ToggleGroupThemeLight,
  ToggleGroupThemeDark,
  SearchBox,
} from "./options";

function Toolbar() {
  const { more } = useContext(ConfigContext);
  const Settings = () => (
    <>
      <ButtonSetting />
      <ButtonSearch />
      <ButtonFavorites />
    </>
  );
  const Actions = () => (
    <>
      <SelectBook />
      <SelectChapter />
      <ButtonPrevArrow />
      <ButtonNextArrow />
    </>
  );
  return (
    <div class="toolbar">
      <Show when={!more()} fallback={<Settings />}>
        <Actions />
      </Show>
      <ButtonToggleSetting />
    </div>
  );
}

function Content() {
  const { config, setConfig } = useContext(ConfigContext);
  const [verses, setVerses] = createSignal([]);

  createEffect(async () => {
    const verses = await getVerses(config.version, config.book, config.chapter);
    setVerses(verses);
    document.documentElement.scrollTop = 0;
  });

  const ChapterTitle = () => (
    <Show when={config.title}>
      <h1 class="chapter-title">{`${getBookById(config.version, config.book).label} ${config.chapter}`}</h1>
    </Show>
  );

  function handleClick({ b, c, v }) {
    const isFavorite = config.favorites.some(
      (f) => f.b === b && f.c === c && f.v === v,
    );
    const favorites = isFavorite
      ? config.favorites.filter((f) => f.b !== b || f.c !== c || f.v !== v)
      : [...config.favorites, { b, c, v }];
    setConfig("favorites", favorites);
    setCacheConfig("favorites", favorites);
  }

  const View = ({ view }) => (
    <div
      classList={{
        chapter: true,
        [view]: true,
      }}
    >
      <ChapterTitle />
      <For each={verses()}>
        {({ b, c, v, t, h }) => {
          if (h) {
            return config.heading ? <h2>{h}</h2> : null;
          }
          return (
            <p
              id={v}
              classList={{
                favorite: config.favorites.some(
                  (f) => f.b === b && f.c === c && f.v === v,
                ),
              }}
              onClick={[handleClick, { b, c, v }]}
              onKeyDown={null}
            >
              <Show when={config.number}>
                <span class="verse-number">{v}</span>
              </Show>
              <span class="verse-text">{t}</span>
            </p>
          );
        }}
      </For>
    </div>
  );

  return (
    <Show when={config.newline} fallback={<View view="text-view" />}>
      <View view="list-view" />
    </Show>
  );
}

function Setting() {
  return (
    <div class="setting-page">
      <span>Version</span>
      <SelectVersion />
      <span>Newline</span>
      <SwitchChapterView />
      <span>Verse Number</span>
      <SwitchVerseNumber />
      <span>Title</span>
      <SwitchChapterTitle />
      <span>Heading</span>
      <SwitchChapterHeading />
      <span>Light Theme</span>
      <ToggleGroupThemeLight />
      <span>Dark Theme</span>
      <ToggleGroupThemeDark />
    </div>
  );
}

function SearchPage() {
  return (
    <div class="search-page">
      <SearchBox />
    </div>
  );
}

function FavoritesPage() {
  const { config, setConfig, setPage, setMore } = useContext(ConfigContext);
  const [verses, setVerses] = createSignal([]);

  onMount(async () => {
    const result = await getFavorites();
    setVerses(result);
  });

  function getBookLabel(book) {
    return getBookById(config.version, book).label;
  }

  function handleClick({ b, c, v }) {
    setMore(false);
    setPage("verses");
    setConfig({
      book: b,
      chapter: c,
    });
    setTimeout(() => {
      const el = document.getElementById(v);
      el.scrollIntoView({ behavior: "smooth" });
    }, 500);
  }

  return (
    <div class="favorites-page">
      {verses().map(({ b, c, v, t }) => (
        <p onClick={[handleClick, { b, c, v }]}>
          <span class="number">
            {getBookLabel(b)} {c}:{v}
          </span>
          <span>{t}</span>
        </p>
      ))}
    </div>
  );
}

const pages = {
  toolbar: () => <Toolbar />,
  verses: () => <Content />,
  setting: () => <Setting />,
  search: () => <SearchPage />,
  favorites: () => <FavoritesPage />,
};

export { pages };
