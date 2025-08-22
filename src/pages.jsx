import {
  createSignal,
  createEffect,
  Show,
  For,
  useContext,
  onMount,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { getVerses, getFavorites, searchVerses, getBookLabel } from "./api";
import { Context } from "./context";
import { Loading, Empty, Popover } from "./components";
import {
  SelectVersion,
  SelectCompareVersion,
  SelectBook,
  SelectChapter,
  ButtonPrev,
  ButtonNext,
  ButtonToolOpen,
  ButtonToolBack,
  ButtonSetting,
  ButtonSearch,
  ButtonFavorites,
  ButtonCopy,
  ButtonStar,
  ButtonShare,
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
import {
  Sun,
  Moon,
  BookOpen,
  ListOrdered,
  Rows2,
  Star,
  WrapText,
  Heading1,
  Heading2,
} from "lucide-solid";

function Toolbar() {
  const { action } = useContext(Context);
  const toolbars = {
    navigator: () => [
      <SelectBook />,
      <SelectChapter />,
      <ButtonPrev />,
      <ButtonNext />,
      <ButtonToolOpen />,
    ],
    tools: () => [
      <ButtonSetting />,
      <ButtonSearch />,
      <ButtonFavorites />,
      <ButtonToolBack />,
    ],
    verseTools: () => [
      <ButtonCopy />,
      <ButtonStar />,
      <ButtonShare />,
      <ButtonToolBack />,
    ],
  };

  return (
    <div class="toolbar">
      <Dynamic component={toolbars[action.toolbar]} />
    </div>
  );
}

function VersesPage() {
  const { config, action, setAction } = useContext(Context);
  const [verses, setVerses] = createSignal([]);
  const [compareVerses, setCompareVerses] = createSignal([]);
  const [loaded, setLoaded] = createSignal(false);

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
    if (verse.v === action.selectedVerse?.v) {
      setAction({
        toolbar: "navigator",
        selectedVerse: null,
      });
    } else {
      setAction({
        toolbar: "verseTools",
        selectedVerse: verse,
      });
    }
  }

  function isFavorite(verse) {
    if (!verse) return false;
    return config.favorites.some((f) => {
      return f.b === verse.b && f.c === verse.c && f.v === verse.v;
    });
  }

  function isSelected({ v }) {
    return action.selectedVerse?.v === v;
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
                    <span class="number">{verse.v}</span>
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
    </div>
  );
}

function SettingPage() {
  return (
    <div class="setting-page">
      <BookOpen />
      <SelectVersion />
      <WrapText />
      <ToggleNewline />
      <ListOrdered />
      <ToggleNumber />
      <Heading1 />
      <ToggleTitle />
      <Heading2 />
      <ToggleHeading />
      <Sun />
      <SelectLight />
      <Moon />
      <SelectDark />
      <Rows2 />
      <ToggleCompare />
      <BookOpen />
      <SelectCompareVersion />
      <Star />
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
    const result = await searchVerses(query);
    setVerses(result);
    setLoaded(true);
  }

  function handleClick({ b, c, v }) {
    setAction({
      toolbar: "navigator",
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

  return (
    <div class="search-page">
      <SearchBox onEnter={handleEnter} />
      <div class="search-result">
        <Show when={loaded() && query()}>
          <Show when={verses().length} fallback={<Empty />}>
            {verses().map(({ b, c, v, t }) => (
              <p onClick={[handleClick, { b, c, v }]}>
                <span class="number">
                  {`${getBookLabel(b, config.version)} ${c}:${v}`}
                </span>
                <span>
                  {t
                    .split(RegExp(`(${query()})`, "gi"))
                    .map((p) =>
                      RegExp(query(), "i").test(p) ? <mark>{p}</mark> : p,
                    )}
                </span>
              </p>
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
    const resultWithHeading = addHeading(result);
    setVerses(resultWithHeading);
    setLoaded(true);
  });

  function addHeading(verses) {
    let result = [];
    for (let i = 0; i < verses.length; i++) {
      if (verses[i].b !== verses[i - 1]?.b) {
        result.push({ h: verses[i].b });
      }
      result.push(verses[i]);
    }
    return result;
  }

  function handleClick({ b, c, v }) {
    setAction({
      toolbar: "navigator",
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
          {verses().map(({ b, c, v, t, h }) =>
            h ? (
              <h2>{`${getBookLabel(h, config.version)}`}</h2>
            ) : (
              <p onClick={[handleClick, { b, c, v }]}>
                <span class="number">
                  {`${getBookLabel(b, config.version)} ${c}:${v}`}
                </span>
                <span>{t}</span>
              </p>
            ),
          )}
        </Show>
      </Show>
    </div>
  );
}

const pages = {
  toolbar: Toolbar,
  verses: VersesPage,
  setting: SettingPage,
  search: SearchPage,
  favorites: FavoritesPage,
};

export { pages };
