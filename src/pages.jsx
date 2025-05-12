import { createSignal, createEffect, Show, useContext } from "solid-js";
import { getVerses } from "./api";
import {
  SelectVersion,
  SelectVolume,
  SelectChapter,
  ButtonPrevArrow,
  ButtonNextArrow,
  ButtonToggleSetting,
  SwitchVerseNumber,
  SwitchChapterTitle,
  SwitchChapterView,
} from "./options";
import { ControlContext } from "./context";

function Toolbar() {
  return (
    <div class="toolbar">
      <SelectVolume />
      <SelectChapter />
      <ButtonPrevArrow />
      <ButtonNextArrow />
      <ButtonToggleSetting />
    </div>
  );
}

function Content() {
  const { version, volume, chapter, view, verseNumber, chapterTitle } =
    useContext(ControlContext);
  const [verses, setVerses] = createSignal([]);

  createEffect(async () => {
    const verses = await getVerses(
      version().version,
      volume().id,
      chapter().id,
    );
    setVerses(verses);
    document.documentElement.scrollTop = 0;
  });

  const TextView = () => (
    <div class="chapter text-view">
      <For each={verses()}>
        {({ vn, vt }) => (
          <>
            <Show when={verseNumber()}>
              <span class="verse-number">{vn}</span>
            </Show>
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
      <Show when={chapterTitle()}>
        <p class="chapter-title">{volume().volume}</p>
      </Show>
      <Show when={view()} fallback={<TextView />}>
        <ListView />
      </Show>
      <div class="bottom-placeholder" />
    </>
  );
}

function Setting() {
  return (
    <div class="setting">
      <div class="setting-items">
        <span>Translation Version</span>
        <SelectVersion />
      </div>
      <div class="setting-items">
        <span>List View</span>
        <SwitchChapterView />
      </div>
      <div class="setting-items">
        <span>Verse Number</span>
        <SwitchVerseNumber />
        <span>Only effective in Paragraph View</span>
      </div>
      <div class="setting-items">
        <span>Chapter Title</span>
        <SwitchChapterTitle />
      </div>
    </div>
  );
}

export { Toolbar, Content, Setting };
