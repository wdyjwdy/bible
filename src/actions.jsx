import { useContext, onCleanup, onMount } from "solid-js";
import { Context } from "./context";
import { Button, Toggle, Search, Select } from "./components";
import {
  ArrowLeft,
  ArrowRight,
  Ellipsis,
  Undo2,
  Settings,
  Search as SearchIcon,
  Star,
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

  return (
    <Select
      id="select-light"
      count={getLightThemeCount()}
      value={config.light}
      getLabel={getLightThemeLabel}
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

  return (
    <Select
      id="select-dark"
      count={getDarkThemeCount()}
      value={config.dark}
      getLabel={getDarkThemeLabel}
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
    <Button onClick={handleClick} class="toggle">
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
      iconActive={<Settings color="oklch(0.57 0.17 252.81)" />}
    />
  );
}

function ButtonSearch() {
  return (
    <ButtonAction
      name="search"
      icon={<SearchIcon />}
      iconActive={<SearchIcon color="oklch(0.63 0.17 293.52)" />}
    />
  );
}

function ButtonFavorites() {
  return (
    <ButtonAction
      name="favorites"
      icon={<Star />}
      iconActive={<Star color="oklch(0.84 0.2 97.48)" />}
    />
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

function SearchBox() {
  return <Search />;
}

export {
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
};
