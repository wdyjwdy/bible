import { createSignal, onMount, createEffect } from "solid-js";
import { ArrowLeft, ArrowRight, ChevronsUpDown, CheckIcon } from "lucide-solid";
import { Button } from "@kobalte/core/button";
import { Select } from "@kobalte/core/select";
import "./App.css";

const SelectComponent = (props) => {
  console.log(props);
  return (
    <Select
      {...props}
      itemComponent={(props) => (
        <Select.Item item={props.item} class="select__item">
          <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
          <Select.ItemIndicator class="select__item-indicator">
            <CheckIcon />
          </Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Trigger class="select__trigger" aria-label="Fruit">
        <Select.Value class="select__value">
          {(state) => state.selectedOption()}
        </Select.Value>
        <Select.Icon class="select__icon">
          <ChevronsUpDown />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="select__content">
          <Select.Listbox class="select__listbox" />
        </Select.Content>
      </Select.Portal>
    </Select>
  );
};

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
    <div class="toolbar">
      <SelectComponent
        options={volumeList().map((x) => x.id)}
        value={selectedVolume()}
        onChange={setSelectedVolume}
      />
      <SelectComponent
        options={chapterList().map((x) => x.chapter)}
        value={selectedChapter()}
        onChange={setSelectedChapter}
      />
      <Button class="button" onClick={() => setSelectedChapter((x) => x - 1)}>
        <ArrowLeft />
      </Button>
      <Button class="button" onClick={() => setSelectedChapter((x) => x + 1)}>
        <ArrowRight />
      </Button>
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
    <section class="chapter">
      {verseList().map((x, i) => (
        <p key={x}>
          <span>{i}</span>
          <span>{x}</span>
        </p>
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
    <div class="app theme-light">
      <Toolbar controller={controller} />
      <Chapter
        selectedVolume={selectedVolume}
        selectedChapter={selectedChapter}
      />
    </div>
  );
};

export default App;
