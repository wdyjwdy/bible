import { createSignal, onMount, Show } from "solid-js";
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
  const [version, setVersion] = createSignal(getOptionsVersion()[0]);
  const [volume, setVolume] = createSignal(getOptionsVolumn()[0]);
  const [chapter, setChapter] = createSignal(getOptionsChapter()[0]);
  const [view, setView] = createSignal(true);
  const [setting, setSetting] = createSignal(true);
  const [verseNumber, setVerseNumber] = createSignal(true);
  const [chapterTitle, setChapterTitle] = createSignal(false);

  onMount(async () => {
    const config = await getOptionsConfig();
    setVersion(config.version);
    setVolume(config.volume);
    setChapter(config.chapter);
    setView(config.view);
    setSetting(config.setting);
    setVerseNumber(config.verseNumber);
    setChapterTitle(config.chapterTitle);
  });

  const control = {
    version,
    setVersion,
    volume,
    setVolume,
    chapter,
    setChapter,
    view,
    setView,
    setting,
    setSetting,
    verseNumber,
    setVerseNumber,
    chapterTitle,
    setChapterTitle,
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
