import { createSignal, onMount } from "solid-js";
import { Dynamic, Show } from "solid-js/web";
import { createStore } from "solid-js/store";
import { Context } from "./context";
import { pages } from "./pages";
import { getCacheConfig } from "./api";
import "./App.css";

const App = () => {
  const [loaded, setLoaded] = createSignal(false);
  const [config, setConfig] = createStore();
  const [action, setAction] = createStore({
    page: "verses",
    toolbar: "navigator",
    selectedVerse: null,
  });

  onMount(async () => {
    const cacheConfig = await getCacheConfig();
    setConfig(cacheConfig);
    setLoaded(true);
    document.documentElement.dataset.light = cacheConfig.light;
    document.documentElement.dataset.dark = cacheConfig.dark;
  });

  return (
    <Context.Provider value={{ action, setAction, config, setConfig }}>
      <Show when={loaded()}>
        {pages.toolbar()}
        <Dynamic component={pages[action.page]} />
      </Show>
    </Context.Provider>
  );
};

export default App;
