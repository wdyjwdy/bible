import { createSignal, onMount, createEffect, Show, For } from "solid-js";
import { getVersions, getVolumes, getChapters, getVerses } from "./api";
import { Select, Button, ViewToggleButton } from "./ui";
import "./App.css";

const Toolbar = (props) => {
  const [versions, setVersions] = createSignal([]);
  const [volumes, setVolumes] = createSignal([]);
  const [chapters, setChapters] = createSignal([]);
  const {
    selectedVersion,
    setSelectedVersion,
    selectedVolume,
    setSelectedVolume,
    selectedChapter,
    setSelectedChapter,
    view,
    setView,
  } = props;

  function handleChapterChange(offset) {
    const index = selectedChapter()?.chapter + offset;
    if (1 <= index && index <= chapters()?.length) {
      setSelectedChapter((c) => ({ ...c, chapter: index }));
    }
  }

  onMount(async () => {
    const versions = await getVersions();
    setVersions(versions);
    setSelectedVersion(versions[1]);
    const volumes = await getVolumes();
    setVolumes(volumes);
    setSelectedVolume(volumes[0]);
    const chapters = await getChapters();
    setChapters(chapters);
    setSelectedChapter(chapters[0]);
  });

  createEffect(async () => {
    const volumes = await getVolumes(selectedVersion()?.identifier);
    setVolumes(volumes);
  });

  createEffect(async () => {
    const chapters = await getChapters(
      selectedVersion?.identifier,
      selectedVolume()?.id,
    );
    setChapters(chapters);
    setSelectedChapter(chapters[0]);
  });

  return (
    <div class="toolbar">
      <Select
        class="version-select"
        value={selectedVersion()}
        onChange={setSelectedVersion}
        options={versions()}
        optionValue="identifier"
        optionTextValue="identifier"
      />
      <Select
        value={selectedVolume()}
        onChange={setSelectedVolume}
        options={volumes()}
        optionValue="id"
        optionTextValue="name"
      />
      <Select
        class="chapter-select"
        value={selectedChapter()}
        onChange={setSelectedChapter}
        options={chapters()}
        optionValue="chapter"
        optionTextValue="chapter"
      />
      <Button left onClick={() => handleChapterChange(-1)} />
      <Button right onClick={() => handleChapterChange(1)} />
      <ViewToggleButton pressed={view()} onChange={setView} />
    </div>
  );
};

const Chapter = (props) => {
  const [verses, setVerses] = createSignal([]);
  const { selectedVersion, selectedVolume, selectedChapter, view } = props;

  onMount(async () => {
    const verses = await getVerses();
    setVerses(verses);
  });

  createEffect(async () => {
    const verses = await getVerses(
      selectedVersion()?.identifier,
      selectedVolume()?.id,
      selectedChapter()?.chapter,
    );
    setVerses(verses);
  });

  const TextView = () => (
    <div class="chapter text-view">
      <For each={verses()}>
        {({ verse, text }) => (
          <>
            <span class="verse-number">{verse}</span>
            <span>{text}</span>
          </>
        )}
      </For>
    </div>
  );

  const ListView = () => (
    <div class="chapter list-view">
      <For each={verses()}>
        {({ verse, text }) => (
          <p key={verse}>
            <span class="verse-number">{verse}</span>
            <span class="verse-text">{text}</span>
          </p>
        )}
      </For>
    </div>
  );

  return (
    <Show when={view()} fallback={<TextView />}>
      <ListView />
    </Show>
  );
};

const App = () => {
  const [selectedVersion, setSelectedVersion] = createSignal();
  const [selectedVolume, setSelectedVolume] = createSignal();
  const [selectedChapter, setSelectedChapter] = createSignal();
  const [view, setView] = createSignal(true);
  const toolbarProps = {
    selectedVersion,
    setSelectedVersion,
    selectedVolume,
    setSelectedVolume,
    selectedChapter,
    setSelectedChapter,
    view,
    setView,
  };
  const chapterProps = {
    selectedVersion,
    selectedVolume,
    selectedChapter,
    view,
  };

  return (
    <div class="app">
      <Toolbar {...toolbarProps} />
      <Chapter {...chapterProps} />
    </div>
  );
};

export default App;
