import { onMount } from "solid-js";
import { Dynamic } from "solid-js/web";
import { createStore } from "solid-js/store";
import { Context } from "./context";
import { pages } from "./pages";
import { getCacheConfig, getDefaultConfig } from "./api";
import "./App.css";

const App = () => {
  const [action, setAction] = createStore({
    more: false,
    page: "verses",
  });
  const [config, setConfig] = createStore(getDefaultConfig());

  onMount(async () => {
    const cacheConfig = await getCacheConfig();
    setConfig(cacheConfig);
    document.documentElement.dataset.light = cacheConfig.light;
    document.documentElement.dataset.dark = cacheConfig.dark;
  });

  return (
    <Context.Provider value={{ action, setAction, config, setConfig }}>
      {pages.toolbar()}
      <Dynamic component={pages[action.page]} />
    </Context.Provider>
  );
};

export default App;
