import { createSignal, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { ControlContext } from "./context";
import { Toolbar, Content, Setting } from "./pages";
import { getOptionsConfig } from "./api";
import {
  getOptionsVersion,
  getOptionsVolumn,
  getOptionsChapter,
} from "./options";
import "./App.css";

const App = () => {
  const [config, setConfig] = createStore({
    version: 10,
    book: 1,
    chapter: 1,
    newline: true,
    number: true,
    title: false,
    heading: true,
  });

  const [version, setVersion] = createSignal(getOptionsVersion()[0]);
  const [book, setBook] = createSignal(getOptionsVolumn()[0]);
  const [chapter, setChapter] = createSignal(getOptionsChapter()[0]);
  const [setting, setSetting] = createSignal(true);

  onMount(async () => {
    const config = await getOptionsConfig();
    setConfig({
      version: config.version,
      newline: config.newline,
      number: config.number,
      title: config.title,
      heading: config.heading,
    });
    setSetting(config.setting);
    document.documentElement.dataset.themeLight = config.themeLight;
    document.documentElement.dataset.themeDark = config.themeDark;
  });

  const control = {
    version,
    setVersion,
    book,
    setBook,
    chapter,
    setChapter,
    setting,
    setSetting,
    config,
    setConfig,
  };

  return (
    <div class="app">
      <ControlContext.Provider value={control}>
        <Toolbar />
        <Show when={setting()} fallback={<Setting />}>
          <Content />
        </Show>
      </ControlContext.Provider>
    </div>
  );
};

export default App;
