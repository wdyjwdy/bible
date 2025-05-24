import { createSignal, For, onMount, Show, useContext } from "solid-js";
import { Search as SearchIcon, LoaderCircle } from "lucide-solid";
import { ControlContext } from "./context";
import { searchVerses } from "./api";
import { getOptionsVolumn, getOptionsChapter } from "./options";

import "./components.css";

function Button(props) {
  return (
    <button type="button" class="button" {...props}>
      {props.children}
    </button>
  );
}

function Toggle(props) {
  return (
    <button type="button" class="toggle" {...props}>
      {props.children}
    </button>
  );
}

function Switch(props) {
  let ref;
  const { checked, onChange } = props;

  function handleClick() {
    onChange(!checked());
    if (checked()) {
      ref.dataset.checked = "";
    } else {
      delete ref.dataset.checked;
    }
  }

  onMount(() => {
    if (checked()) {
      ref.dataset.checked = "";
    }
  });

  return (
    <div class="switch" ref={ref} onClick={handleClick} {...props}>
      <span />
    </div>
  );
}

function Select(props) {
  const { id, options, value, onChange } = props;
  let ref;

  function handleClick(value) {
    onChange(value);
    ref.hidePopover();
  }

  return (
    <>
      <button type="button" class="select" popovertarget={id}>
        {value().label}
      </button>
      <div ref={ref} class="select-popover" id={id} popover>
        <ul>
          <For each={options()}>
            {(option) => (
              <Show when={!option.separator} fallback={<hr />}>
                <li
                  onClick={() => {
                    handleClick(option);
                  }}
                  onKeyDown={null}
                  classList={{ selected: value().id === option.id }}
                >
                  {option.label}
                </li>
              </Show>
            )}
          </For>
        </ul>
      </div>
    </>
  );
}

function Search() {
  let ref;
  const { version, setSetting, setVolume, setChapter } =
    useContext(ControlContext);
  const [query, setQuery] = createSignal("");
  const [verses, setVerses] = createSignal([]);
  const [loading, setLoading] = createSignal(false);

  function debounce(fn, wait) {
    let id;
    return function (...args) {
      if (id) {
        clearTimeout(id);
        id = setTimeout(() => {
          fn.call(this, ...args);
          setLoading(false);
          id = null;
        }, wait);
      } else {
        id = setTimeout(() => {
          fn.call(this, ...args);
          setLoading(false);
          id = null;
        }, wait);
      }
    };
  }

  async function handleChange(e) {
    const query = e.target.value;
    setQuery(query);
    if (query.length < 2) {
      ref.hidePopover();
      return;
    }

    const result = await searchVerses(version().version, query);
    setVerses(result);
    ref.showPopover();
  }

  function handleInput(e) {
    if (!loading()) {
      setLoading(true);
    }
    const debouncedHandleChange = debounce(handleChange, 1000);
    debouncedHandleChange(e);
  }

  function Item({ verse }) {
    const { b, c, v, t } = verse;
    const parts = t.split(new RegExp(`(${query()})`, "gi"));
    const bookName = getOptionsVolumn(version().lang)[b - 1].label;

    function handleClick() {
      setSetting(true);
      setVolume(getOptionsVolumn(version().lang)[b - 1]);
      setChapter(getOptionsChapter(b)[c - 1]);
      setTimeout(() => {
        const el = document.getElementById(v);
        el.scrollIntoView({ behavior: "smooth" });
        el.classList.add("highlight");
      }, 500);
    }

    return (
      <p onClick={handleClick} onKeyDown={null}>
        <span class="number">
          {bookName} {c}:{v}
        </span>
        <span>
          <For each={parts}>
            {(p) => (p === query() ? <mark>{p}</mark> : p)}
          </For>
        </span>
      </p>
    );
  }

  return (
    <>
      <div class="search">
        <div>
          <Show when={loading()} fallback={<SearchIcon />}>
            <LoaderCircle class="loading" />
          </Show>
        </div>
        <input
          type="text"
          placeholder="Search"
          value={query()}
          onInput={handleInput}
        />
      </div>
      <div ref={ref} id="search-result" popover>
        <Show when={verses().length} fallback={<p class="nothing">🛀</p>}>
          <For each={verses()}>{(verse) => <Item verse={verse} />}</For>
        </Show>
      </div>
    </>
  );
}

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

export { Button, Toggle, Switch, Select, Search, SettingItem };
