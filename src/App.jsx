import { createSignal, onMount, createEffect, Show, For } from "solid-js";
import { getVerses, chineseLabels, chapterNumbers, getNumArray } from "./api";
import { Select, Button, ViewToggleButton, VisibleToggleButton } from "./ui";
import "./App.css";

const Toolbar = (props) => {
  const [versions, setVersions] = createSignal(["CUS"]);
  const [volumes, setVolumes] = createSignal(chineseLabels);
  const [chapters, setChapters] = createSignal(getNumArray(chapterNumbers[0]));
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

  function handleChapterChange(offset) {
    const index = selectedChapter() + offset;
    if (1 <= index && index <= chapters()?.length) {
      setSelectedChapter(index);
    }
  }

  createEffect(() => {
    const index = chineseLabels.indexOf(selectedVolume());
    setChapters(getNumArray(chapterNumbers[index]));
    setSelectedChapter(1);
  });

  return (
    <div class={`toolbar${visible() ? "" : " toolbar-hidden"}`}>
      <Show when={visible()}>
        <Select
          class="version-select"
          value={selectedVersion()}
          onChange={setSelectedVersion}
          options={versions()}
        />
        <Select
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
      <Button left onClick={() => handleChapterChange(-1)} />
      <Button right onClick={() => handleChapterChange(1)} />
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
    const volume = chineseLabels.indexOf(selectedVolume()) + 1;
    const verses = await getVerses(undefined, volume, selectedChapter());
    setVerses(verses);
    document.documentElement.scrollTop = 0;
  });

  const TextView = () => (
    <div class="chapter text-view">
      <For each={verses()}>
        {({ vn, vt }) => (
          <>
            <span class="verse-number">{vn}</span>
            <span>{vt}</span>
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
  const [selectedVersion, setSelectedVersion] = createSignal("CUS");
  const [selectedVolume, setSelectedVolume] = createSignal(chineseLabels[0]);
  const [selectedChapter, setSelectedChapter] = createSignal(1);
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
