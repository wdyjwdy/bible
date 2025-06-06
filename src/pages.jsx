import {
  createSignal,
  createEffect,
  Show,
  For,
  useContext,
  onMount,
} from "solid-js";
import {
  getVerses,
  getFavorites,
  searchVerses,
  getBookLabel,
  translate,
} from "./api";
import { Context } from "./context";
import { Loading, Empty, Popover } from "./components";
import {
  SelectLanguage,
  SelectVersion,
  SelectCompareVersion,
  SelectBook,
  SelectChapter,
  ButtonPrev,
  ButtonNext,
  ToggleMore,
  ButtonSetting,
  ButtonSearch,
  ButtonFavorites,
  ButtonCopy,
  ButtonStar,
  ButtonUnstar,
  ButtonExport,
  ToggleNumber,
  ToggleTitle,
  ToggleHeading,
  ToggleNewline,
  ToggleCompare,
  SelectLight,
  SelectDark,
  SearchBox,
} from "./actions";

function Toolbar() {
  const { action } = useContext(Context);

  function Fallback() {
    return (
      <>
        <ButtonSetting />
        <ButtonSearch />
        <ButtonFavorites />
      </>
    );
  }

  return (
    <div class="toolbar">
      <Show when={!action.more} fallback={<Fallback />}>
        <SelectBook />
        <SelectChapter />
        <ButtonPrev />
        <ButtonNext />
      </Show>
      <ToggleMore />
    </div>
  );
}

function VersesPage() {
  const { config } = useContext(Context);
  const [verses, setVerses] = createSignal([]);
  const [compareVerses, setCompareVerses] = createSignal([]);
  const [selectedVerse, setSelectedVerse] = createSignal();
  const [loaded, setLoaded] = createSignal(false);
  let ref;

  createEffect(async () => {
    const verses = await getVerses(config);
    setVerses(verses);
    if (config.compare) {
      const compareVerses = await getVerses({
        ...config,
        version: config.compareVersion,
      });
      const filteredVerses = compareVerses.filter((v) => !v.h);
      setCompareVerses(filteredVerses);
    }
    setLoaded(true);
    document.documentElement.scrollTop = 0;
  });

  function handleClick(verse) {
    if (selectedVerse()?.v === verse.v) {
      setSelectedVerse(null);
      ref.hidePopover();
    } else {
      setSelectedVerse(verse);
      ref.showPopover();
    }
  }

  function isFavorite(verse) {
    if (!verse) return false;
    return config.favorites.some((f) => {
      return f.b === verse.b && f.c === verse.c && f.v === verse.v;
    });
  }

  function isSelected({ v }) {
    return selectedVerse()?.v === v;
  }

  const classes = {
    "verses-page": true,
    list: config.newline,
    text: !config.newline,
  };

  return (
    <div classList={classes}>
      <Show when={loaded()} fallback={<Loading />}>
        <Show when={config.title}>
          <h1>
            {`${getBookLabel(config.book, config.version)} ${config.chapter}`}
          </h1>
        </Show>
        <For each={verses()}>
          {(verse) => {
            if (verse.h) {
              return (
                <Show when={config.heading}>
                  <h2>{verse.h}</h2>
                </Show>
              );
            }
            return (
              <>
                <p
                  id={verse.v}
                  classList={{
                    favorite: isFavorite(verse),
                    selected: isSelected(verse),
                  }}
                  onClick={[handleClick, verse]}
                >
                  <Show when={config.number}>
                    <span class="number">
                      {isFavorite(verse) ? "✦" : verse.v}
                    </span>
                  </Show>
                  <span class="verse">{verse.t}</span>
                </p>
                <Show when={config.compare}>
                  <p
                    classList={{
                      favorite: isFavorite(verse),
                      selected: isSelected(verse),
                    }}
                    onClick={[handleClick, verse]}
                  >
                    <Show when={config.number}>
                      {config.newline && <span class="number" />}
                    </Show>
                    <span class="verse">{compareVerses()[verse.v - 1]?.t}</span>
                  </p>
                </Show>
              </>
            );
          }}
        </For>
      </Show>
      <Popover ref={ref} id="verse-options">
        <ButtonCopy verse={selectedVerse} />
        <Show
          when={isFavorite(selectedVerse())}
          fallback={<ButtonStar verse={selectedVerse} />}
        >
          <ButtonUnstar verse={selectedVerse} />
        </Show>
      </Popover>
    </div>
  );
}

function SettingPage() {
  const { config } = useContext(Context);

  function t(key) {
    return translate(key, config.language);
  }

  return (
    <div class="setting-page">
      <span>{t("language")}</span>
      <SelectLanguage />
      <span>{t("version")}</span>
      <SelectVersion />
      <span>{t("newline")}</span>
      <ToggleNewline />
      <span>{t("verse_numbers")}</span>
      <ToggleNumber />
      <span>{t("title")}</span>
      <ToggleTitle />
      <span>{t("headings")}</span>
      <ToggleHeading />
      <span>{t("light_theme")}</span>
      <SelectLight />
      <span>{t("dark_theme")}</span>
      <SelectDark />
      <span>{t("compare_mode")}</span>
      <ToggleCompare />
      <span>{t("compare_version")}</span>
      <SelectCompareVersion />
      <span>{t("export_favorites")}</span>
      <ButtonExport />
    </div>
  );
}

function SearchPage() {
  const { config, setConfig, setAction } = useContext(Context);
  const [verses, setVerses] = createSignal([]);
  const [query, setQuery] = createSignal();
  const [loaded, setLoaded] = createSignal(false);

  async function handleEnter(e) {
    const query = e.target.value;
    setQuery(query);
    const result = await searchVerses(config.version, query);
    setVerses(result);
    setLoaded(true);
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
          {`${getBookLabel(b, config.version)} ${c}:${v}`}
        </span>
        <span>{parts.map((p) => (p === query() ? <mark>{p}</mark> : p))}</span>
      </p>
    );
  }

  return (
    <div class="search-page">
      <SearchBox onEnter={handleEnter} />
      <div class="search-result">
        <Show when={loaded() && query()}>
          <Show when={verses().length} fallback={<Empty />}>
            {verses().map((v) => (
              <Item verse={v} />
            ))}
          </Show>
        </Show>
      </div>
    </div>
  );
}

function FavoritesPage() {
  const { config, setConfig, setAction } = useContext(Context);
  const [verses, setVerses] = createSignal([]);
  const [loaded, setLoaded] = createSignal(false);

  onMount(async () => {
    const result = await getFavorites();
    setVerses(result);
    setLoaded(true);
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
      <Show when={loaded()}>
        <Show when={verses().length} fallback={<Empty />}>
          {verses().map(({ b, c, v, t }) => (
            <p onClick={[handleClick, { b, c, v }]}>
              <span class="number">
                {`${getBookLabel(b, config.version)} ${c}:${v}`}
              </span>
              <span>{t}</span>
            </p>
          ))}
        </Show>
      </Show>
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
