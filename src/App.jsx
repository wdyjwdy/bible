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
  const [book, setBook] = createSignal(getOptionsVolumn()[0]);
  const [chapter, setChapter] = createSignal(getOptionsChapter()[0]);
  const [view, setView] = createSignal(true);
  const [setting, setSetting] = createSignal(true);
  const [verseNumber, setVerseNumber] = createSignal(true);
  const [chapterTitle, setChapterTitle] = createSignal(true);
  const [chapterHeading, setChapterHeading] = createSignal(true);

  onMount(async () => {
    const config = await getOptionsConfig();
    setVersion(config.version);
    // setBook(config.book);
    // setChapter(config.chapter);
    setView(config.view);
    setSetting(config.setting);
    setVerseNumber(config.verseNumber);
    setChapterTitle(config.chapterTitle);
    setChapterHeading(config.chapterHeading);
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
    view,
    setView,
    setting,
    setSetting,
    verseNumber,
    setVerseNumber,
    chapterTitle,
    setChapterTitle,
    chapterHeading,
    setChapterHeading,
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
