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
  ToggleGroupThemeLight,
  ToggleGroupThemeDark,
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
      <h2>Setting</h2>
      <SettingItem
        label="Version"
        description="Select Bible translation"
        option={<SelectVersion />}
      />
      <SettingItem
        label="List View"
        description="Show each verse in a separate paragraph"
        option={<SwitchChapterView />}
      />
      <SettingItem
        label="Verse Number"
        description="Only effective in Paragraph View"
        option={<SwitchVerseNumber />}
      />
      <SettingItem
        label="Chapter Title"
        description="Show chapter name above the verses"
        option={<SwitchChapterTitle />}
      />
      <SettingItem
        label="Theme Light"
        description="Follow system theme by default"
        option={<ToggleGroupThemeLight />}
      />
      <SettingItem
        label="Theme Dark"
        description="Follow system theme by default"
        option={<ToggleGroupThemeDark />}
      />
      <SettingItem
        label="Font Size"
        description="Press Cmd/Ctrl +/- to adjust font size"
      />
    </div>
  );
}

export { Toolbar, Content, Setting };
