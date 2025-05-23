import { onMount, Show } from "solid-js";
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
    <div class="xx-switch" ref={ref} onClick={handleClick} {...props}>
      <span />
    </div>
  );
}

export { Button, Toggle, Switch };
