import { createSignal, createEffect, Show, useContext } from "solid-js";
import { getVerses } from "./api";
import {
  SelectVersion,
  SelectVolume,
  SelectChapter,
  ButtonPrevArrow,
  ButtonNextArrow,
  ButtonToggleView,
  ButtonToggleVisible,
  ButtonToggleSetting,
} from "./options";
import { ControlContext } from "./context";

function Toolbar() {
  const { visible } = useContext(ControlContext);

  return (
    <div class={visible() ? "toolbar" : "toolbar toolbar-hidden"}>
      <SelectVolume />
      <SelectChapter />
      <ButtonPrevArrow />
      <ButtonNextArrow />
      <ButtonToggleSetting />
    </div>
  );
}

function Content() {
  const { version, volume, chapter, view } = useContext(ControlContext);
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
            <span class="verse-number">{vn}</span>
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
        <span>Select Translation Version</span>
        <SelectVersion />
      </div>
      <div class="setting-items">
        <span>Toggle Verses View</span>
        <ButtonToggleView />
      </div>
      <div class="setting-items">
        <span>Toggle Simple Mode</span>
        <ButtonToggleVisible />
      </div>
    </div>
  );
}

export { Toolbar, Content, Setting };
