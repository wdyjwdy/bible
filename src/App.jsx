import { createSignal, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { ConfigContext } from "./context";
import { Toolbar, Content, Setting } from "./pages";
import { getCacheConfig } from "./api";
import "./App.css";

const App = () => {
  const [setting, setSetting] = createSignal(true);
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
        value={{ setting, setSetting, config, setConfig }}
      >
        <Toolbar />
        <Show when={setting()} fallback={<Setting />}>
          <Content />
        </Show>
      </ConfigContext.Provider>
    </div>
  );
};

export default App;
