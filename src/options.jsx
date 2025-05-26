import {
  createSignal,
  createEffect,
  useContext,
  onCleanup,
  onMount,
} from "solid-js";
import { setCacheConfig } from "./api";
import { ConfigContext } from "./context";
import { Button, Toggle, Switch, Select, Search } from "./components";
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
  getVersionList,
  getVersionById,
  getBookList,
  getBookById,
  getChapterList,
} from "./data";

function SelectVersion() {
  const { config, setConfig } = useContext(ConfigContext);

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
  const { config, setConfig } = useContext(ConfigContext);
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
  const { config, setConfig } = useContext(ConfigContext);
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

function ButtonPrevArrow() {
  const { config, setConfig } = useContext(ConfigContext);

  function handleClick() {
    if (config.chapter > 1) {
      setConfig("chapter", config.chapter - 1);
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

  return (
    <Button onClick={handleClick}>
      <ArrowLeft />
    </Button>
  );
}

function ButtonNextArrow() {
  const { config, setConfig } = useContext(ConfigContext);

  function handleClick() {
    const { length } = getChapterList(config.book);
    if (config.chapter < length) {
      setConfig("chapter", config.chapter + 1);
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

  return (
    <Button onClick={handleClick}>
      <ArrowRight />
    </Button>
  );
}

function ButtonToggleSetting() {
  const { more, setMore, setPage } = useContext(ConfigContext);

  function handleClick() {
    if (more()) {
      setPage("verses");
    }
    setMore((s) => !s);
  }

  return (
    <Toggle onClick={handleClick}>
      <Show when={!more()} fallback={<Undo2 />}>
        <Ellipsis />
      </Show>
    </Toggle>
  );
}

function ButtonSetting() {
  const { setPage } = useContext(ConfigContext);

  function handleClick() {
    setPage("setting");
  }

  return (
    <Button onClick={handleClick}>
      <Settings />
    </Button>
  );
}

function ButtonSearch() {
  const { setPage } = useContext(ConfigContext);

  function handleClick() {
    setPage("search");
  }

  return (
    <Button onClick={handleClick}>
      <SearchIcon />
    </Button>
  );
}

function ButtonFavorites() {
  const { setPage } = useContext(ConfigContext);

  function handleClick() {
    setPage("favorites");
  }

  return (
    <Button onClick={handleClick}>
      <Star />
    </Button>
  );
}

function SwitchChapterView() {
  const { config, setConfig } = useContext(ConfigContext);

  function handleChange(value) {
    setConfig("newline", value);
    setCacheConfig("newline", value);
  }

  return <Switch checked={config.newline} onChange={handleChange} />;
}

function SwitchVerseNumber() {
  const { config, setConfig } = useContext(ConfigContext);

  function handleChange(value) {
    setConfig("number", value);
    setCacheConfig("number", value);
  }

  return <Switch checked={config.number} onChange={handleChange} />;
}

function SwitchChapterTitle() {
  const { config, setConfig } = useContext(ConfigContext);

  function handleChange(value) {
    setConfig("title", value);
    setCacheConfig("title", value);
  }

  return <Switch checked={config.title} onChange={handleChange} />;
}

function SwitchChapterHeading() {
  const { config, setConfig } = useContext(ConfigContext);

  function handleChange(value) {
    setConfig("heading", value);
    setCacheConfig("heading", value);
  }

  return <Switch checked={config.heading} onChange={handleChange} />;
}

function ToggleGroupThemeLight() {
  const { config, setConfig } = useContext(ConfigContext);
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

function ToggleGroupThemeDark() {
  const { config, setConfig } = useContext(ConfigContext);
  const options = [
    { id: 1, label: "dark" },
    { id: 2, label: "night" },
  ];

  function getSelection() {
    return options[config.dark - 1];
  }

  function handleChange(value) {
    setConfig("dark", value.id);
    document.documentElement.dataset.light = value.id;
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
};
