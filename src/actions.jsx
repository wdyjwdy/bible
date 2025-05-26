import {
  createSignal,
  createEffect,
  useContext,
  onCleanup,
  onMount,
} from "solid-js";
import { Context } from "./context";
import { Button, Switch, Select, Search } from "./components";
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

function ButtonPrev() {
  const { config, setConfig } = useContext(Context);

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

function ButtonNext() {
  const { config, setConfig } = useContext(Context);

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

function ButtonMore() {
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

function ButtonSetting() {
  const { action, setAction } = useContext(Context);

  function handleClick() {
    setAction("page", "setting");
  }

  return (
    <Button onClick={handleClick}>
      <Show when={action.page === "setting"} fallback={<Settings />}>
        <Settings color="oklch(0.57 0.17 252.81)" />
      </Show>
    </Button>
  );
}

function ButtonSearch() {
  const { action, setAction } = useContext(Context);

  function handleClick() {
    setAction("page", "search");
  }

  return (
    <Button onClick={handleClick}>
      <Show when={action.page === "search"} fallback={<SearchIcon />}>
        <SearchIcon color="oklch(0.63 0.17 293.52)" />
      </Show>
    </Button>
  );
}

function ButtonFavorites() {
  const { action, setAction } = useContext(Context);

  function handleClick() {
    setAction("page", "favorites");
  }

  return (
    <Button onClick={handleClick}>
      <Show when={action.page === "favorites"} fallback={<Star />}>
        <Star color="oklch(0.84 0.2 97.48)" />
      </Show>
    </Button>
  );
}

function SwitchNewline() {
  const { config, setConfig } = useContext(Context);

  function handleChange(value) {
    setConfig("newline", value);
    setCacheConfig("newline", value);
  }

  return <Switch checked={config.newline} onChange={handleChange} />;
}

function SwitchNumber() {
  const { config, setConfig } = useContext(Context);

  function handleChange(value) {
    setConfig("number", value);
    setCacheConfig("number", value);
  }

  return <Switch checked={config.number} onChange={handleChange} />;
}

function SwitchTitle() {
  const { config, setConfig } = useContext(Context);

  function handleChange(value) {
    setConfig("title", value);
    setCacheConfig("title", value);
  }

  return <Switch checked={config.title} onChange={handleChange} />;
}

function SwitchHeading() {
  const { config, setConfig } = useContext(Context);

  function handleChange(value) {
    setConfig("heading", value);
    setCacheConfig("heading", value);
  }

  return <Switch checked={config.heading} onChange={handleChange} />;
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
  ButtonMore,
  ButtonSetting,
  ButtonSearch,
  ButtonFavorites,
  SwitchNumber,
  SwitchTitle,
  SwitchHeading,
  SwitchNewline,
  SelectLight,
  SelectDark,
  SearchBox,
};
