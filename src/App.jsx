import { createSignal, Show } from "solid-js";
import { ControlContext } from "./context";
import { Toolbar, Content, Setting } from "./pages";
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
