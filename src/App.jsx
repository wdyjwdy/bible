import { createSignal, createEffect, Show, For, untrack } from "solid-js";
import {
  getVerses,
  getVersionOptions,
  getVolumeOptions,
  getChapterOptions,
} from "./api";
import {
  Select,
  PrevArrowButton,
  NextArrowButton,
  ViewToggleButton,
  VisibleToggleButton,
} from "./ui";
import "./App.css";

const Toolbar = (props) => {
  const [versions, setVersions] = createSignal(getVersionOptions());
  const [volumes, setVolumes] = createSignal(getVolumeOptions());
  const [chapters, setChapters] = createSignal(getChapterOptions());
  const {
    selectedVersion,
    setSelectedVersion,
    selectedVolume,
    setSelectedVolume,
    selectedChapter,
    setSelectedChapter,
    view,
    setView,
    visible,
    setVisible,
  } = props;

  function handleChapterIncrement() {
    const index = selectedChapter();
    if (index < chapters()?.length) {
      setSelectedChapter(index + 1);
    }
  }

  function handleChapterDecrement() {
    const index = selectedChapter();
    if (index > 1) {
      setSelectedChapter(index - 1);
    }
  }

  createEffect(() => {
    const options = getVolumeOptions(selectedVersion());
    setVolumes(options);
    setSelectedVolume(options[0]);
  });

  createEffect(() => {
    const index =
      getVolumeOptions(untrack(() => selectedVersion())).indexOf(
        selectedVolume(),
      ) + 1;
    setChapters(getChapterOptions(index));
    setSelectedChapter(1);
  });

  return (
    <div class={visible() ? "toolbar" : "toolbar toolbar-hidden"}>
      <Show when={visible()}>
        <Select
          class="version-select"
          value={selectedVersion()}
          onChange={setSelectedVersion}
          options={versions()}
        />
        <Select
          class="volume-select"
          value={selectedVolume()}
          onChange={setSelectedVolume}
          options={volumes()}
        />
        <Select
          class="chapter-select"
          value={selectedChapter()}
          onChange={setSelectedChapter}
          options={chapters()}
        />
      </Show>
      <PrevArrowButton onClick={handleChapterDecrement} />
      <NextArrowButton onClick={handleChapterIncrement} />
      <Show when={visible()}>
        <ViewToggleButton pressed={view()} onChange={setView} />
      </Show>
      <VisibleToggleButton pressed={visible()} onChange={setVisible} />
    </div>
  );
};

const Chapter = (props) => {
  const [verses, setVerses] = createSignal([]);
  const { selectedVersion, selectedVolume, selectedChapter, view } = props;

  createEffect(async () => {
    const volume =
      getVolumeOptions(selectedVersion()).indexOf(selectedVolume()) + 1;
    const verses = await getVerses(
      selectedVersion(),
      volume,
      selectedChapter(),
    );
    setVerses(verses);
    document.documentElement.scrollTop = 0;
  });

  const TextView = () => (
    <div class="chapter text-view">
      <For each={verses()}>
        {({ vn, vt }) => (
          <>
            <span class="verse-number">{vn}</span>
            <span class="verse-text">{vt}</span>
          </>
        )}
      </For>
    </div>
  );

  const ListView = () => (
    <div class="chapter list-view">
      <For each={verses()}>
        {({ vn, vt }) => (
          <p key={vn}>
            <span class="verse-number">{vn}</span>
            <span class="verse-text">{vt}</span>
          </p>
        )}
      </For>
    </div>
  );

  return (
    <>
      <Show when={view()} fallback={<TextView />}>
        <ListView />
      </Show>
      <div class="bottom-placeholder" />
    </>
  );
};

const App = () => {
  const [selectedVersion, setSelectedVersion] = createSignal(
    getVersionOptions()[0],
  );
  const [selectedVolume, setSelectedVolume] = createSignal(
    getVolumeOptions()[0],
  );
  const [selectedChapter, setSelectedChapter] = createSignal(
    getChapterOptions()[0],
  );
  const [view, setView] = createSignal(true);
  const [visible, setVisible] = createSignal(true);
  const toolbarProps = {
    selectedVersion,
    setSelectedVersion,
    selectedVolume,
    setSelectedVolume,
    selectedChapter,
    setSelectedChapter,
    view,
    setView,
    visible,
    setVisible,
  };
  const chapterProps = {
    selectedVersion,
    selectedVolume,
    selectedChapter,
    view,
    visible,
  };

  return (
    <div class="app">
      <Toolbar {...toolbarProps} />
      <Chapter {...chapterProps} />
    </div>
  );
};

export default App;
