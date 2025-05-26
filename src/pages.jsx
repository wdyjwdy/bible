import { createSignal, createEffect, Show, useContext } from "solid-js";
import { getVerses } from "./api";
import { SettingItem } from "./components";
import { ConfigContext } from "./context";
import { getBookById } from "./data";
import { setCacheConfig } from "./api";
import {
  SelectVersion,
  SelectBook,
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
      <SelectBook />
      <SelectChapter />
      <ButtonPrevArrow />
      <ButtonNextArrow />
      <ButtonToggleSetting />
    </div>
  );
}

function Content() {
  const { config, setConfig } = useContext(ConfigContext);
  const [verses, setVerses] = createSignal([]);

  createEffect(async () => {
    const verses = await getVerses(config.version, config.book, config.chapter);
    setVerses(verses);
    document.documentElement.scrollTop = 0;
  });

  const ChapterTitle = () => (
    <Show when={config.title}>
      <h1 class="chapter-title">{`${getBookById(config.version, config.book).label} ${config.chapter}`}</h1>
    </Show>
  );

  function handleClick({ b, c, v }) {
    const isFavorite = config.favorites.some(
      (f) => f.b === b && f.c === c && f.v === v,
    );
    const favorites = isFavorite
      ? config.favorites.filter((f) => f.b !== b || f.c !== c || f.v !== v)
      : [...config.favorites, { b, c, v }];
    setConfig("favorites", favorites);
    setCacheConfig("favorites", favorites);
  }

  const View = ({ view }) => (
    <div
      classList={{
        chapter: true,
        [view]: true,
      }}
    >
      <ChapterTitle />
      <For each={verses()}>
        {({ b, c, v, t, h }) => {
          if (h) {
            return config.heading ? <h2>{h}</h2> : null;
          }
          return (
            <p
              id={v}
              classList={{
                favorite: config.favorites.some(
                  (f) => f.b === b && f.c === c && f.v === v,
                ),
              }}
              onClick={[handleClick, { b, c, v }]}
              onKeyDown={null}
            >
              <Show when={config.number}>
                <span class="verse-number">{v}</span>
              </Show>
              <span class="verse-text">{t}</span>
            </p>
          );
        }}
      </For>
    </div>
  );

  return (
    <Show when={config.newline} fallback={<View view="text-view" />}>
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
