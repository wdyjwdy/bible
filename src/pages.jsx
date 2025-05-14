import { createSignal, createEffect, Show, useContext } from "solid-js";
import { getVerses } from "./api";
import { SettingItem } from "./ui";
import { ControlContext } from "./context";
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
        {({ v, t }) => (
          <>
            <Show when={verseNumber()}>
              <span class="verse-number">{v}</span>
            </Show>
            <span class="verse-text">{t}</span>
          </>
        )}
      </For>
    </div>
  );

  const ListView = () => (
    <div class="chapter list-view">
      <For each={verses()}>
        {({ v, t }) => (
          <p key={v}>
            <span class="verse-number">{v}</span>
            <span class="verse-text">{t}</span>
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
      <SettingItem label="Translation Version" option={<SelectVersion />} />
      <SettingItem label="List View" option={<SwitchChapterView />} />
      <SettingItem
        label="Verse Number"
        description="Only effective in Paragraph View"
        option={<SwitchVerseNumber />}
      />
      <SettingItem label="Chapter Title" option={<SwitchChapterTitle />} />
    </div>
  );
}

export { Toolbar, Content, Setting };
