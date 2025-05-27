import {
  createSignal,
  createEffect,
  Show,
  useContext,
  onMount,
} from "solid-js";
import {
  setCacheConfig,
  getVerses,
  getFavorites,
  searchVerses,
  getBookLabel,
} from "./api";
import { Context } from "./context";
import {
  SelectVersion,
  SelectBook,
  SelectChapter,
  ButtonPrev,
  ButtonNext,
  ToggleMore,
  ButtonSetting,
  ButtonSearch,
  ButtonFavorites,
  ToggleNumber,
  ToggleTitle,
  ToggleHeading,
  ToggleNewline,
  SelectLight,
  SelectDark,
  SearchBox,
} from "./actions";

function Toolbar() {
  const { action } = useContext(Context);
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
      <ButtonPrev />
      <ButtonNext />
    </>
  );
  return (
    <div class="toolbar">
      <Show when={!action.more} fallback={<Settings />}>
        <Actions />
      </Show>
      <ToggleMore />
    </div>
  );
}

function VersesPage() {
  const { config, setConfig } = useContext(Context);
  const [verses, setVerses] = createSignal([]);

  createEffect(async () => {
    const verses = await getVerses(config.version, config.book, config.chapter);
    setVerses(verses);
    document.documentElement.scrollTop = 0;
  });

  function handleClick({ b, c, v }) {
    const favorites = isFavorite({ b, c, v })
      ? config.favorites.filter((f) => f.b !== b || f.c !== c || f.v !== v)
      : [...config.favorites, { b, c, v }];
    setConfig("favorites", favorites);
    setCacheConfig("favorites", favorites);
  }

  function isFavorite({ b, c, v }) {
    return config.favorites.some((f) => {
      return f.b === b && f.c === c && f.v == v;
    });
  }

  const classes = {
    "verses-page": true,
    list: config.newline,
    text: !config.newline,
  };

  return (
    <div classList={classes}>
      <Show when={config.title}>
        <h1>
          {`${getBookLabel(config.book, config.version)} ${config.chapter}`}
        </h1>
      </Show>
      {verses().map(({ b, c, v, t, h }) => {
        if (h) {
          return config.heading ? <h2>{h}</h2> : null;
        }
        return (
          <p
            id={v}
            classList={{ favorite: isFavorite({ b, c, v }) }}
            onClick={[handleClick, { b, c, v }]}
          >
            <Show when={config.number}>
              <span class="number">{v}</span>
            </Show>
            <span class="verse">{t}</span>
          </p>
        );
      })}
    </div>
  );
}

function SettingPage() {
  return (
    <div class="setting-page">
      <span>Version</span>
      <SelectVersion />
      <span>Newline</span>
      <ToggleNewline />
      <span>Verse Numbers</span>
      <ToggleNumber />
      <span>Title</span>
      <ToggleTitle />
      <span>Headings</span>
      <ToggleHeading />
      <span>Light Theme</span>
      <SelectLight />
      <span>Dark Theme</span>
      <SelectDark />
    </div>
  );
}

function SearchPage() {
  const { config, setConfig, setAction } = useContext(Context);
  const [verses, setVerses] = createSignal([]);
  const [query, setQuery] = createSignal();

  async function handleEnter(e) {
    const query = e.target.value;
    setQuery(query);
    const result = await searchVerses(config.version, query);
    setVerses(result);
  }

  function handleClick({ b, c, v }) {
    setAction({
      more: false,
      page: "verses",
    });
    setConfig({
      book: b,
      chapter: c,
    });
    setTimeout(() => {
      const el = document.getElementById(v);
      el.scrollIntoView({ behavior: "smooth" });
      el.classList.add("highlight");
    }, 500);
  }

  function Item({ verse }) {
    const { b, c, v, t } = verse;
    const parts = t.split(new RegExp(`(${query()})`, "gi"));

    return (
      <p onClick={[handleClick, verse]}>
        <span class="number">
          {getBookLabel(b, config.version)} {c}:{v}
        </span>
        <span>{parts.map((p) => (p === query() ? <mark>{p}</mark> : p))}</span>
      </p>
    );
  }

  return (
    <div class="search-page">
      <SearchBox onEnter={handleEnter} />
      <div class="search-result">
        <Show when={!verses().length}>
          <p class="nothing">🛀</p>
        </Show>
        {verses().map((v) => (
          <Item verse={v} />
        ))}
      </div>
    </div>
  );
}

function FavoritesPage() {
  const { config, setConfig, setAction } = useContext(Context);
  const [verses, setVerses] = createSignal([]);

  onMount(async () => {
    const result = await getFavorites();
    setVerses(result);
  });

  function handleClick({ b, c, v }) {
    setAction({
      more: false,
      page: "verses",
    });
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
      <Show when={!verses().length}>
        <p class="nothing">🛀</p>
      </Show>
      {verses().map(({ b, c, v, t }) => (
        <p onClick={[handleClick, { b, c, v }]}>
          <span class="number">
            {getBookLabel(b, config.version)} {c}:{v}
          </span>
          <span>{t}</span>
        </p>
      ))}
    </div>
  );
}

const pages = {
  toolbar: () => <Toolbar />,
  verses: () => <VersesPage />,
  setting: () => <SettingPage />,
  search: () => <SearchPage />,
  favorites: () => <FavoritesPage />,
};

export { pages };
