import {
  createSignal,
  createEffect,
  useContext,
  onCleanup,
  onMount,
} from "solid-js";
import { Context } from "./context";
import { Button, Toggle, Select, Search } from "./components";
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
  getVersionList,
  getVersionById,
  getBookList,
  getBookById,
  getChapterList,
  getChapterCount,
} from "./api";

function SelectVersion() {
  const { config, setConfig } = useContext(Context);

  function handleChange({ id }) {
    setConfig("version", id);
    setCacheConfig("version", id);
  }

  function getSelection() {
    return getVersionById(config.version);
  }

  return (
    <Select
      id="select-version"
      options={getVersionList}
      value={getSelection}
      onChange={handleChange}
    />
  );
}

function SelectBook() {
  const { config, setConfig } = useContext(Context);
  const [options, setOptions] = createSignal(getBookList(1));

  function handleChange({ id }) {
    setConfig("book", id);
  }

  function getOptions() {
    const sectionOptions = options();
    sectionOptions.splice(39, 0, { separator: true });
    return sectionOptions;
  }

  function getSelection() {
    return getBookById(config.version, config.book);
  }

  createEffect(() => {
    setOptions(getBookList(config.version));
  });

  return (
    <Select
      id="select-book"
      options={getOptions}
      value={getSelection}
      onChange={handleChange}
    />
  );
}

function SelectChapter() {
  const { config, setConfig } = useContext(Context);
  const [options, setOptions] = createSignal(getChapterList(1));

  function handleChange({ id }) {
    setConfig("chapter", id);
  }

  function getSelection() {
    return { id: config.chapter, label: config.chapter };
  }

  createEffect(() => {
    const options = getChapterList(config.book);
    setOptions(options);
    setConfig("chapter", 1);
  });

  return (
    <Select
      id="select-chapter"
      options={options}
      value={getSelection}
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

function SelectLight() {
  const { config, setConfig } = useContext(Context);
  const options = [
    { id: 1, label: "light" },
    { id: 2, label: "soft" },
  ];

  function getSelection() {
    return options[config.light - 1];
  }

  function handleChange(value) {
    setConfig("light", value.id);
    document.documentElement.dataset.light = value.id;
    setCacheConfig("light", value.id);
  }

  return (
    <Select
      id="select-light-theme"
      options={() => options}
      value={getSelection}
      onChange={handleChange}
    />
  );
}

function SelectDark() {
  const { config, setConfig } = useContext(Context);
  const options = [
    { id: 1, label: "dark" },
    { id: 2, label: "night" },
  ];

  function getSelection() {
    return options[config.dark - 1];
  }

  function handleChange(value) {
    setConfig("dark", value.id);
    document.documentElement.dataset.dark = value.id;
    setCacheConfig("dark", value.id);
  }

  return (
    <Select
      id="select-dark-theme"
      options={() => options}
      value={getSelection}
      onChange={handleChange}
    />
  );
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
