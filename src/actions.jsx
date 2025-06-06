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
} from "lucide-solid";
import {
  setCacheConfig,
  getVersionCount,
  getVersionLabel,
  getBookCount,
  getBookLabel,
  getChapterCount,
  getChapterLabel,
  getLightThemeCount,
  getLightThemeLabel,
  getDarkThemeCount,
  getDarkThemeLabel,
} from "./api";

function SelectVersion() {
  const { config, setConfig } = useContext(Context);

  function handleChange(id) {
    setCacheConfig("version", id);
    setConfig("version", id);
  }

  return (
    <Select
      id="select-version"
      count={getVersionCount()}
      value={config.version}
      getLabel={getVersionLabel}
      onChange={handleChange}
    />
  );
}

function SelectCompareVersion() {
  const { config, setConfig } = useContext(Context);

  function handleChange(id) {
    setCacheConfig("compareVersion", id);
    setConfig("compareVersion", id);
  }

  return (
    <Select
      id="select-compare-version"
      count={getVersionCount()}
      value={config.compareVersion}
      getLabel={getVersionLabel}
      onChange={handleChange}
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
  const { config, setConfig } = useContext(Context);

  function handleChange(id) {
    setCacheConfig("chapter", id);
    setConfig("chapter", id);
  }

  return (
    <Select
      id="select-chapter"
      count={getChapterCount(config.book)}
      value={config.chapter}
      getLabel={getChapterLabel}
      onChange={handleChange}
    />
  );
}

function SelectLight() {
  const { config, setConfig } = useContext(Context);

  function handleChange(id) {
    document.documentElement.dataset.light = id;
    setConfig("light", id);
    setCacheConfig("light", id);
  }

  function getLabel(id) {
    const color = getLightThemeLabel(id);
    return <Squircle fill={color} color={color} />;
  }

  return (
    <Select
      id="select-light"
      count={getLightThemeCount()}
      value={config.light}
      getLabel={getLabel}
      onChange={handleChange}
    />
  );
}

function SelectDark() {
  const { config, setConfig } = useContext(Context);

  function handleChange(id) {
    document.documentElement.dataset.dark = id;
    setConfig("dark", id);
    setCacheConfig("dark", id);
  }

  function getLabel(id) {
    const color = getDarkThemeLabel(id);
    return <Squircle fill={color} color={color} />;
  }

  return (
    <Select
      id="select-dark"
      count={getDarkThemeCount()}
      value={config.dark}
      getLabel={getLabel}
      onChange={handleChange}
    />
  );
}

function ButtonMoveAction({ name, icon, step }) {
  const { config, setConfig } = useContext(Context);

  function handleClick() {
    const newChapter = config.chapter + step;
    const count = getChapterCount(config.book);
    if (1 <= newChapter && newChapter <= count) {
      setCacheConfig("chapter", newChapter);
      setConfig("chapter", newChapter);
    }
  }

  onMount(() => {
    const handler = ({ code }) => {
      if (code === name) {
        handleClick();
      }
    };
    document.addEventListener("keydown", handler);
    onCleanup(() => {
      document.removeEventListener("keydown", handler);
    });
  });

  return <Button onClick={handleClick}>{icon}</Button>;
}

function ButtonPrev() {
  return <ButtonMoveAction name="ArrowLeft" icon={<ArrowLeft />} step={-1} />;
}

function ButtonNext() {
  return <ButtonMoveAction name="ArrowRight" icon={<ArrowRight />} step={1} />;
}

function ToggleMore() {
  const { action, setAction } = useContext(Context);

  function handleClick() {
    if (action.more) {
      setAction("page", "verses");
    }
    setAction("more", !action.more);
  }

  return (
    <Button onClick={handleClick} class="toggle-more">
      <Show when={!action.more} fallback={<Undo2 />}>
        <Ellipsis />
      </Show>
    </Button>
  );
}

function ButtonAction({ name, icon, iconActive }) {
  const { action, setAction } = useContext(Context);

  function handleClick() {
    setAction("page", name);
    document.documentElement.scrollTop = 0;
  }

  return (
    <Button onClick={handleClick}>
      <Show when={action.page === name} fallback={icon}>
        {iconActive}
      </Show>
    </Button>
  );
}

function ButtonSetting() {
  return (
    <ButtonAction
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
    <ButtonAction
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
    <ButtonAction
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

function ButtonCopy(props) {
  function handleClick() {
    navigator.clipboard.writeText(props.verse().t);
  }

  return (
    <Button onClick={handleClick}>
      <Copy />
    </Button>
  );
}

function ButtonStar(props) {
  const { config, setConfig } = useContext(Context);

  function handleClick() {
    const favorites = [...config.favorites, props.verse()];
    setConfig("favorites", favorites);
    setCacheConfig("favorites", favorites);
  }

  return (
    <Button onClick={handleClick}>
      <Star />
    </Button>
  );
}

function ButtonUnstar(props) {
  const { config, setConfig } = useContext(Context);

  function handleClick() {
    const { b, c, v } = props.verse();
    const favorites = config.favorites.filter((f) => {
      return f.b !== b || f.c !== c || f.v !== v;
    });
    setConfig("favorites", favorites);
    setCacheConfig("favorites", favorites);
  }

  return (
    <Button onClick={handleClick}>
      <Star color="oklch(0.81 0.18 86.47)" fill="oklch(0.81 0.18 86.47)" />
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

function ToggleAction({ name }) {
  const { config, setConfig } = useContext(Context);

  function handleClick() {
    setCacheConfig(name, !config[name]);
    setConfig(name, !config[name]);
  }

  return <Toggle checked={config[name]} onClick={handleClick} />;
}

function ToggleNewline() {
  return <ToggleAction name="newline" />;
}

function ToggleNumber() {
  return <ToggleAction name="number" />;
}

function ToggleTitle() {
  return <ToggleAction name="title" />;
}

function ToggleHeading() {
  return <ToggleAction name="heading" />;
}

function ToggleCompare() {
  return <ToggleAction name="compare" />;
}

export {
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
};
