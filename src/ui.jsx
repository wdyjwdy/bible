import { Search as SearchIcon, LoaderCircle } from "lucide-solid";
import { getOptionsVolumn } from "./options";
import { For, Show } from "solid-js";
import { Search } from "@kobalte/core/search";

function SettingItem({ label, description, option }) {
  return (
    <div class="setting-item">
      <div class="setting-info">
        <span class="setting-label">{label}</span>
        <Show when={description}>
          <span class="setting-description">{description}</span>
        </Show>
      </div>
      {option}
    </div>
  );
}

function SearchComponent(props) {
  const { query, lang } = props;

  function ItemComponent({ item }) {
    const { b, c, v, t } = item.rawValue;
    const parts = t.split(new RegExp(`(${query()})`, "gi"));
    const bookName = getOptionsVolumn(lang)[b - 1].volume;
    return (
      <Search.Item item={item} class="search__item">
        <span class="number">
          {bookName} {c}:{v}
        </span>
        <span>
          <For each={parts}>
            {(p) => (p === query() ? <mark>{p}</mark> : p)}
          </For>
        </span>
      </Search.Item>
    );
  }

  return (
    <>
      <Search {...props} triggerMode="focus" itemComponent={ItemComponent}>
        <Search.Control class="search__control">
          <Search.Indicator
            class="search__indicator"
            loadingComponent={
              <Search.Icon class="load__icon">
                <LoaderCircle class="spin__icon" />
              </Search.Icon>
            }
          >
            <Search.Icon class="search__icon">
              <SearchIcon class="center__icon" />
            </Search.Icon>
          </Search.Indicator>
          <Search.Input class="search__input" />
        </Search.Control>
        <Search.Portal>
          <Search.Content
            class="search__content"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <Search.Listbox class="search__listbox" />
            <Search.NoResult class="search__no_result">🛀</Search.NoResult>
          </Search.Content>
        </Search.Portal>
      </Search>
    </>
  );
}

export { SettingItem, SearchComponent };
