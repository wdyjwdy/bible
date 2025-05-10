import {
  ArrowLeft,
  ArrowRight,
  ChevronsUpDown,
  CheckIcon,
  ListOrdered,
  WrapText,
  Eye,
  EyeOff,
} from "lucide-solid";
import { Button } from "@kobalte/core/button";
import { Select } from "@kobalte/core/select";
import { ToggleButton } from "@kobalte/core/toggle-button";
import { Show } from "solid-js";

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

const ButtonComponent = (props) => {
  return (
    <Button class="button arrow-button" {...props}>
      {props.left && <ArrowLeft />}
      {props.right && <ArrowRight />}
    </Button>
  );
};

const SelectComponent = (props) => {
  return (
    <Select
      {...props}
      itemComponent={(props) => (
        <Select.Item item={props.item} class="select__item">
          <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
          <Select.ItemIndicator class="select__item-indicator">
            <CheckIcon />
          </Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Trigger class="select__trigger">
        <Select.Value class="select__value">
          {(state) => state.selectedOption()}
        </Select.Value>
        <Select.Icon class="select__icon">
          <ChevronsUpDown />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="select__content">
          <Select.Listbox class="select__listbox" />
        </Select.Content>
      </Select.Portal>
    </Select>
  );
};

export {
  SelectComponent as Select,
  ButtonComponent as Button,
  ViewToggleButton,
  VisibleToggleButton,
};
