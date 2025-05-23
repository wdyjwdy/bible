import { For, onMount, Show } from "solid-js";
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
              <li
                onClick={() => {
                  handleClick(option);
                }}
                classList={{ selected: value().id === option.id }}
              >
                {option.label}
              </li>
            )}
          </For>
        </ul>
      </div>
    </>
  );
}

export { Button, Toggle, Switch, Select };
