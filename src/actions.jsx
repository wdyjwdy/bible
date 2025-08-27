import { useContext, onCleanup, onMount } from "solid-js";
import { Context } from "./context";
import { Button, Toggle, Select, SearchBox } from "./components";
import {
  ArrowLeft,
  ArrowRight,
  Ellipsis,
  Undo2,
  Settings,
  Search,
  Star,
  Copy,
  Download,
  Squircle,
  Share2,
} from "lucide-solid";
import {
  setCacheConfig,
  getVersionCount,
  getVersionLabel,
  getVerse,
  getBookCount,
  getBookLabel,
  getBookName,
  getChapterCount,
  getChapterLabel,
  getLightThemeCount,
  getLightThemeLabel,
  getDarkThemeCount,
  getDarkThemeLabel,
} from "./api";

function SelectBase(props) {
  const { config, setConfig } = useContext(Context);

  function handleChange(id) {
    setCacheConfig(props.key, id);
    setConfig(props.key, id);
  }

  return (
    <Select
      id={`select-${props.key}`}
      count={props.count}
      value={config[props.key]}
      getLabel={props.getLabel}
      onChange={props.handleChange ?? handleChange}
    />
  );
}

function SelectVersion() {
  return (
    <SelectBase
      key="version"
      count={getVersionCount()}
      getLabel={getVersionLabel}
    />
  );
}

function SelectCompareVersion() {
  return (
    <SelectBase
      key="compareVersion"
      count={getVersionCount()}
      getLabel={getVersionLabel}
    />
  );
}

function SelectBook() {
  const { config, setConfig } = useContext(Context);

  async function handleChange(id) {
    await setCacheConfig("book", id);
    setCacheConfig("chapter", 1);
    setConfig({
      book: id,
      chapter: 1,
    });
  }

  return (
    <Select
      id="select-book"
      count={getBookCount()}
      value={config.book}
      getLabel={(id) => getBookLabel(id, config.version)}
      onChange={handleChange}
    />
  );
}

function SelectChapter() {
  const { config } = useContext(Context);

  return (
    <SelectBase
      key="chapter"
      count={getChapterCount(config.book)}
      getLabel={getChapterLabel}
    />
  );
}

function SelectThemeBase(props) {
  const { config, setConfig } = useContext(Context);

  function handleChange(id) {
    document.documentElement.dataset[props.key] = id;
    setConfig(props.key, id);
    setCacheConfig(props.key, id);
  }

  function getLabel(id) {
    const color = props.getLabel(id);
    return <Squircle fill={color} color={color} />;
  }

  return (
    <Select
      id={`select-${props.key}`}
      count={props.count}
      value={config[props.key]}
      getLabel={getLabel}
      onChange={handleChange}
    />
  );
}

function SelectLight() {
  return (
    <SelectThemeBase
      key="light"
      count={getLightThemeCount()}
      getLabel={getLightThemeLabel}
    />
  );
}

function SelectDark() {
  return (
    <SelectThemeBase
      key="dark"
      count={getDarkThemeCount()}
      getLabel={getDarkThemeLabel}
    />
  );
}

function ButtonMoveBase(props) {
  const { config, setConfig } = useContext(Context);

  function handleClick() {
    const newChapter = config.chapter + props.step;
    const count = getChapterCount(config.book);
    if (1 <= newChapter && newChapter <= count) {
      setCacheConfig("chapter", newChapter);
      setConfig("chapter", newChapter);
    }
  }

  onMount(() => {
    const handler = ({ code }) => {
      if (code === props.name) {
        handleClick();
      }
    };
    document.addEventListener("keydown", handler);
    onCleanup(() => {
      document.removeEventListener("keydown", handler);
    });
  });

  return <Button onClick={handleClick}>{props.icon}</Button>;
}

function ButtonPrev() {
  return <ButtonMoveBase name="ArrowLeft" icon={<ArrowLeft />} step={-1} />;
}

function ButtonNext() {
  return <ButtonMoveBase name="ArrowRight" icon={<ArrowRight />} step={1} />;
}

function ButtonToolOpen() {
  const { setAction } = useContext(Context);

  function handleClick() {
    setAction("toolbar", "tools");
  }

  return (
    <Button onClick={handleClick}>
      <Ellipsis />
    </Button>
  );
}

function ButtonToolBack() {
  const { setAction } = useContext(Context);

  function handleClick() {
    setAction({
      toolbar: "navigator",
      page: "verses",
      selectedVerse: null,
    });
  }

  return (
    <Button onClick={handleClick}>
      <Undo2 />
    </Button>
  );
}

function ButtonPageBase(props) {
  const { action, setAction } = useContext(Context);

  function handleClick() {
    setAction("page", props.name);
    document.documentElement.scrollTop = 0;
  }

  return (
    <Button onClick={handleClick}>
      <Show when={action.page === props.name} fallback={props.icon}>
        {props.iconActive}
      </Show>
    </Button>
  );
}

function ButtonSetting() {
  return (
    <ButtonPageBase
      name="setting"
      icon={<Settings />}
      iconActive={
        <Settings
          color="oklch(0.64 0.21 251.36)"
          fill="oklch(0.59 0.23 251.77 / 0.1)"
        />
      }
    />
  );
}

function ButtonSearch() {
  return (
    <ButtonPageBase
      name="search"
      icon={<Search />}
      iconActive={
        <Search
          color="oklch(0.63 0.17 293.52)"
          fill="oklch(0.42 0.19 328.37 / 0.1)"
        />
      }
    />
  );
}

function ButtonFavorites() {
  return (
    <ButtonPageBase
      name="favorites"
      icon={<Star />}
      iconActive={
        <Star
          color="oklch(0.81 0.18 86.47)"
          fill="oklch(0.91 0.18 95.77 / 0.2)"
        />
      }
    />
  );
}

function ButtonCopy() {
  const { action } = useContext(Context);

  async function handleClick() {
    const { b, c, v, t } = await getVerse(action.selectedVerse);
    const bookLabel = await getBookName(b);
    navigator.clipboard.writeText(`${t} (${bookLabel} ${c}:${v})`);
  }

  return (
    <Button onClick={handleClick}>
      <Copy />
    </Button>
  );
}

function ButtonShare() {
  const { action } = useContext(Context);

  async function handleClick() {
    const { b, c, v, t } = await getVerse(action.selectedVerse);
    const bookLabel = await getBookName(b);
    navigator
      .share({ text: `${t} (${bookLabel} ${c}:${v})` })
      .catch(() => console.info("Share canceled"));
  }

  return (
    <Button onClick={handleClick}>
      <Share2 />
    </Button>
  );
}

function ButtonStar() {
  const { config, setConfig, action } = useContext(Context);

  function handleClick() {
    if (isFavorite()) {
      unstar();
    } else {
      star();
    }
    const bg = document.querySelector(".verses-page");
    bg.click();
  }

  function star() {
    const favorites = [...config.favorites, action.selectedVerse];
    setConfig("favorites", favorites);
    setCacheConfig("favorites", favorites);
  }

  function unstar() {
    const { b, c, v } = action.selectedVerse;
    const favorites = config.favorites.filter((f) => {
      return f.b !== b || f.c !== c || f.v !== v;
    });
    setConfig("favorites", favorites);
    setCacheConfig("favorites", favorites);
  }

  function isFavorite() {
    const verse = action.selectedVerse;
    if (!verse) return false;
    return config.favorites.some((f) => {
      return f.b === verse.b && f.c === verse.c && f.v === verse.v;
    });
  }

  return (
    <Button onClick={handleClick}>
      <Show when={isFavorite()} fallback={<Star />}>
        <Star color="oklch(0.81 0.18 86.47)" fill="oklch(0.81 0.18 86.47)" />
      </Show>
    </Button>
  );
}

function ButtonExport() {
  const { config } = useContext(Context);

  function handleClick() {
    const json = JSON.stringify(config.favorites);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "favorites.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button onClick={handleClick}>
      <Download />
    </Button>
  );
}

function ToggleBase({ key }) {
  const { config, setConfig } = useContext(Context);

  function handleClick() {
    setCacheConfig(key, !config[key]);
    setConfig(key, !config[key]);
  }

  return <Toggle checked={config[key]} onClick={handleClick} />;
}

function ToggleNewline() {
  return <ToggleBase key="newline" />;
}

function ToggleNumber() {
  return <ToggleBase key="number" />;
}

function ToggleTitle() {
  return <ToggleBase key="title" />;
}

function ToggleHeading() {
  return <ToggleBase key="heading" />;
}

function ToggleCompare() {
  return <ToggleBase key="compare" />;
}

export {
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
};
