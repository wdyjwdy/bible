import { createSignal, For, onMount, Show, useContext } from "solid-js";
import { Search as SearchIcon, LoaderCircle, Check, X } from "lucide-solid";
import { Portal } from "solid-js/web";
import { Context } from "./context";
import { searchVerses, getBookById } from "./api";
import "./components.css";

function Button(props) {
  return (
    <button type="button" {...props}>
      {props.children}
    </button>
  );
}

function Toggle(props) {
  return (
    <Button {...props}>
      <Show when={props.checked} fallback={<X />}>
        <Check />
      </Show>
    </Button>
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
      <Portal>
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
      </Portal>
    </>
  );
}

function Search() {
  let ref;
  const { setAction, config, setConfig } = useContext(Context);
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

    const result = await searchVerses(config.version, query);
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
    const bookName = getBookById(config.version, b).label;

    function handleClick() {
      setAction({
        more: false,
        page: "verses",
      });
      setConfig({
        book: b,
        chapter: c,
      });
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
      <Portal>
        <div ref={ref} id="search-result" popover>
          <Show when={verses().length} fallback={<p class="nothing">🛀</p>}>
            <For each={verses()}>{(verse) => <Item verse={verse} />}</For>
          </Show>
        </div>
      </Portal>
    </>
  );
}

export { Button, Toggle, Select, Search };
