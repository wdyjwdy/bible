import { createSignal, onMount, createEffect } from "solid-js";
import { getVolumes, getChapters, getVerses } from "./api";
import { Select, Button } from "./ui";
import "./App.css";

const Toolbar = (props) => {
  const [volumes, setVolumes] = createSignal([]);
  const [chapters, setChapters] = createSignal([]);
  const {
    selectedVolume,
    setSelectedVolume,
    selectedChapter,
    setSelectedChapter,
  } = props;

  function handleChapterChange(offset) {
    const index = selectedChapter()?.chapter + offset;
    if (1 <= index && index <= chapters()?.length) {
      setSelectedChapter((c) => ({ ...c, chapter: index }));
    }
  }

  onMount(async () => {
    const volumes = await getVolumes();
    setVolumes(volumes);
    setSelectedVolume(volumes[0]);
    const chapters = await getChapters();
    setChapters(chapters);
    setSelectedChapter(chapters[0]);
  });

  createEffect(async () => {
    const chapters = await getChapters(selectedVolume()?.id);
    setChapters(chapters);
    setSelectedChapter(chapters[0]);
  });

  return (
    <div class="toolbar">
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
    </div>
  );
};

const Chapter = (props) => {
  const [verses, setVerses] = createSignal([]);
  const { selectedVolume, selectedChapter } = props;
  console.log(selectedVolume(), selectedChapter());

  onMount(async () => {
    const verses = await getVerses();
    setVerses(verses);
  });

  createEffect(async () => {
    const verses = await getVerses(
      selectedVolume()?.id,
      selectedChapter()?.chapter,
    );
    setVerses(verses);
  });

  return (
    <div class="chapter">
      {verses().map((x) => (
        <p key={x.verse}>
          <span>{x.verse}</span>
          <span>{x.text}</span>
        </p>
      ))}
    </div>
  );
};

const App = () => {
  const [selectedVolume, setSelectedVolume] = createSignal();
  const [selectedChapter, setSelectedChapter] = createSignal();
  const toolbarProps = {
    selectedVolume,
    setSelectedVolume,
    selectedChapter,
    setSelectedChapter,
  };
  const chapterProps = { selectedVolume, selectedChapter };

  return (
    <div class="app">
      <Toolbar {...toolbarProps} />
      <Chapter {...chapterProps} />
    </div>
  );
};

export default App;
