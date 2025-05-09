import { createSignal, onMount, createEffect } from "solid-js";
import "./App.css";

const Toolbar = ({ controller }) => {
  const [volumeList, setVolumeList] = createSignal([]);
  const [chapterList, setChapterList] = createSignal([]);
  const {
    selectedVolume,
    setSelectedVolume,
    selectedChapter,
    setSelectedChapter,
  } = controller;

  onMount(async () => {
    try {
      const response = await fetch("https://bible-api.com/data/cuv"); // 替换成你的 API 地址
      const data = await response.json();
      setVolumeList(data.books); // 假设返回的是一个字符串数组
      const res2 = await fetch("https://bible-api.com/data/cuv/GEN"); // 替换成你的 API 地址
      const data2 = await res2.json();
      setChapterList(data2.chapters); // 假设返回的是一个字符串数组
    } catch (error) {
      console.error("Failed to fetch verses:", error);
    }
  });

  return (
    <div>
      <select
        value={selectedVolume}
        onChange={(e) => setSelectedVolume(e.target.value)}
      >
        {volumeList().map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </select>
      <select
        value={selectedChapter}
        onChange={(e) => setSelectedChapter(e.target.value)}
      >
        {chapterList().map((x) => (
          <option key={x.chapter} value={x.chapter}>
            {x.chapter}
          </option>
        ))}
      </select>
    </div>
  );
};

const Chapter = ({ selectedVolume, selectedChapter }) => {
  const [verseList, setVerseList] = createSignal([]);

  // API 请求逻辑，组件挂载时触发
  onMount(async () => {
    try {
      const response = await fetch("https://bible-api.com/data/cuv/JHN/1"); // 替换成你的 API 地址
      const data = await response.json();
      setVerseList(data.verses.map((x) => x.text)); // 假设返回的是一个字符串数组
    } catch (error) {
      console.error("Failed to fetch verses:", error);
    }
  });

  createEffect(async () => {
    const volume = selectedVolume();
    const chapter = selectedChapter();

    try {
      const response = await fetch(
        `https://bible-api.com/data/cuv/${volume}/${chapter}`,
      );
      const data = await response.json();
      setVerseList(data.verses.map((x) => x.text));
    } catch (error) {
      console.error("Failed to fetch verses:", error);
    }
  });

  return (
    <section>
      {verseList().map((x) => (
        <p key={x}>{x}</p>
      ))}
    </section>
  );
};

const App = () => {
  const [selectedVolume, setSelectedVolume] = createSignal("GEN");
  const [selectedChapter, setSelectedChapter] = createSignal(1);
  const controller = {
    selectedVolume,
    setSelectedVolume,
    selectedChapter,
    setSelectedChapter,
  };

  return (
    <div class="content">
      <Toolbar controller={controller} />
      <Chapter
        selectedVolume={selectedVolume}
        selectedChapter={selectedChapter}
      />
    </div>
  );
};

export default App;
