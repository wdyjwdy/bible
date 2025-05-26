import { createSignal, onMount, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { createStore } from "solid-js/store";
import { ConfigContext } from "./context";
import { pages } from "./pages";
import { getCacheConfig } from "./api";
import "./App.css";

const App = () => {
  const [more, setMore] = createSignal(false);
  const [page, setPage] = createSignal("verses");
  const [config, setConfig] = createStore({
    version: 10,
    book: 1,
    chapter: 1,
    newline: true,
    number: true,
    title: false,
    heading: true,
    light: 1,
    dark: 1,
    favorites: [],
  });

  onMount(async () => {
    const config = await getCacheConfig();
    setConfig(config);
    document.documentElement.dataset.light = config.light;
    document.documentElement.dataset.dark = config.dark;
  });

  return (
    <div class="app">
      <ConfigContext.Provider
        value={{ more, setMore, page, setPage, config, setConfig }}
      >
        {pages.toolbar()}
        <Dynamic component={pages[page()]} />
      </ConfigContext.Provider>
    </div>
  );
};

export default App;
