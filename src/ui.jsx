import {
  ArrowLeft,
  ArrowRight,
  CheckIcon,
  ListOrdered,
  WrapText,
  Eye,
  EyeOff,
  Settings,
  Undo2,
} from "lucide-solid";
import { Button } from "@kobalte/core/button";
import { Select } from "@kobalte/core/select";
import { ToggleButton } from "@kobalte/core/toggle-button";
import { Show } from "solid-js";

function SelectObject(props) {
  const { optionTextValue } = props;
  return (
    <Select
      {...props}
      disallowEmptySelection={true}
      sectionComponent={(props) => (
        <Select.Section class="select__section">
          {props.section.rawValue.label}
        </Select.Section>
      )}
      itemComponent={(props) => (
        <Select.Item item={props.item} class="select__item">
          <Select.ItemLabel>
            {props.item.rawValue?.[optionTextValue]}
          </Select.ItemLabel>
          <Select.ItemIndicator class="select__item-indicator">
            <CheckIcon />
          </Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Trigger class="select__trigger">
        <Select.Value class="select__value">
          {(state) => state.selectedOption()?.[optionTextValue]}
        </Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="select__content">
          <Select.Listbox class="select__listbox" />
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}

const ViewToggleButton = (props) => {
  return (
    <ToggleButton class="toogle-view toggle-button" {...props}>
      {(state) => (
        <Show when={state.pressed()} fallback={<WrapText />}>
          <ListOrdered />
        </Show>
      )}
    </ToggleButton>
  );
};

const VisibleToggleButton = (props) => {
  return (
    <ToggleButton class="toogle-visible toggle-button" {...props}>
      {(state) => (
        <Show when={state.pressed()} fallback={<EyeOff />}>
          <Eye />
        </Show>
      )}
    </ToggleButton>
  );
};

const SettingToggleButton = (props) => {
  return (
    <ToggleButton class="toogle-setting toggle-button" {...props}>
      {(state) => (
        <Show when={state.pressed()} fallback={<Undo2 />}>
          <Settings />
        </Show>
      )}
    </ToggleButton>
  );
};

const PrevArrowButton = (props) => {
  return (
    <Button class="button arrow-button" {...props}>
      <ArrowLeft />
    </Button>
  );
};

const NextArrowButton = (props) => {
  return (
    <Button class="button arrow-button" {...props}>
      <ArrowRight />
    </Button>
  );
};

export {
  PrevArrowButton,
  NextArrowButton,
  ViewToggleButton,
  VisibleToggleButton,
  SettingToggleButton,
  SelectObject,
};
