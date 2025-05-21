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
  SwitchChapterHeading,
  SwitchChapterView,
  ToggleGroupThemeLight,
  ToggleGroupThemeDark,
  SearchBox,
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
  const {
    version,
    volume,
    chapter,
    view,
    verseNumber,
    chapterTitle,
    chapterHeading,
  } = useContext(ControlContext);
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

  const ChapterTitle = () => (
    <Show when={chapterTitle()}>
      <h1 class="chapter-title">{`${volume().volume} ${chapter().id}`}</h1>
    </Show>
  );

  const View = ({ view }) => (
    <div
      classList={{
        chapter: true,
        [view]: true,
      }}
    >
      <ChapterTitle />
      <For each={verses()}>
        {({ v, t, h }) =>
          h && chapterHeading() ? (
            <h2>{h}</h2>
          ) : (
            <p id={v}>
              <Show when={verseNumber()}>
                <span class="verse-number">{v}</span>
              </Show>
              <span class="verse-text">{t}</span>
            </p>
          )
        }
      </For>
    </div>
  );

  return (
    <Show when={view()} fallback={<View view="text-view" />}>
      <View view="list-view" />
    </Show>
  );
}

function Setting() {
  return (
    <div class="setting">
      <SearchBox />
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
        label="Chapter Heading"
        description="Show verses summary (available in some version)"
        option={<SwitchChapterHeading />}
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
        description="Press Cmd +/- to adjust font size"
      />
    </div>
  );
}

export { Toolbar, Content, Setting };
