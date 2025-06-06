import { Show } from "solid-js";
import { Search, Check, X, LoaderCircle, Inbox } from "lucide-solid";
import { Portal } from "solid-js/web";
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
  let ref;

  function getOptions() {
    const options = [];
    for (let i = 1; i <= props.count; i++) {
      options.push(i);
    }
    return options;
  }

  function handleClick(id) {
    props.onChange(id);
    ref.hidePopover();
  }

  function Popover() {
    return (
      <div ref={ref} id={props.id} popover>
        <ul>
          {getOptions().map((id) => (
            <li
              onClick={[handleClick, id]}
              classList={{ selected: props.value === id }}
            >
              {props.getLabel(id)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <>
      <button type="button" popovertarget={props.id}>
        {props.getLabel(props.value)}
      </button>
      <Portal>
        <Popover />
      </Portal>
    </>
  );
}

function SearchBox(props) {
  let ref;

  function handleKeyDown(e) {
    if (e.code === "Enter") {
      props.onEnter(e);
      ref.blur();
    }
  }

  return (
    <div class="search">
      <div>
        <Search />
      </div>
      <input
        ref={ref}
        type="text"
        enterkeyhint="search"
        onKeyDown={handleKeyDown}
        {...props}
      />
    </div>
  );
}

function Loading() {
  return (
    <div class="loading">
      <LoaderCircle size={48} strokeWidth={1} />
    </div>
  );
}

function Empty() {
  return (
    <div class="empty">
      <Inbox size={48} strokeWidth={1} />
    </div>
  );
}

function Popover(props) {
  return (
    <div ref={props.ref} id={props.id} popover>
      <div class={props.id}>{props.children}</div>
    </div>
  );
}

export { Button, Toggle, Select, SearchBox, Loading, Empty, Popover };
