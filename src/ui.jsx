import {
  ArrowLeft,
  ArrowRight,
  CheckIcon,
  Settings,
  Undo2,
  Search as SearchIcon,
  Loader,
} from "lucide-solid";
import { Show } from "solid-js";
import { Button } from "@kobalte/core/button";
import { Select } from "@kobalte/core/select";
import { ToggleButton } from "@kobalte/core/toggle-button";
import { Switch } from "@kobalte/core/switch";
import { RadioGroup } from "@kobalte/core/radio-group";
import { Search } from "@kobalte/core/search";

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

function SwitchComponent(props) {
  return (
    <Switch class="switch" {...props}>
      <Switch.Input class="switch__input" />
      <Switch.Control class="switch__control">
        <Switch.Thumb class="switch__thumb" />
      </Switch.Control>
    </Switch>
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

function ToggleGroupTheme(props) {
  return (
    <RadioGroup class="radio-group" {...props}>
      <For each={props.options}>
        {(item) => (
          <RadioGroup.Item value={item} class="radio">
            <RadioGroup.ItemInput class="radio__input" />
            <RadioGroup.ItemControl class="radio__control">
              <RadioGroup.ItemIndicator class="radio__indicator" />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel class="radio__label">
              {item}
            </RadioGroup.ItemLabel>
          </RadioGroup.Item>
        )}
      </For>
    </RadioGroup>
  );
}

function SearchComponent(props) {
  return (
    <>
      <Search
        {...props}
        triggerMode="focus"
        virtualized={true}
        itemComponent={(props) => (
          <Search.Item item={props.item} class="search__item">
            <Search.ItemLabel>
              {props.item.rawValue.b}-{props.item.rawValue.c}-
              {props.item.rawValue.v} {props.item.rawValue.t}
            </Search.ItemLabel>
          </Search.Item>
        )}
      >
        <Search.Control class="search__control">
          <Search.Indicator
            class="search__indicator"
            loadingComponent={
              <Search.Icon class="load__icon">
                <Loader class="spin__icon" />
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
            <Search.NoResult class="search__no_result">
              🛀 No verses found
            </Search.NoResult>
          </Search.Content>
        </Search.Portal>
      </Search>
    </>
  );
}

export {
  PrevArrowButton,
  NextArrowButton,
  SettingToggleButton,
  SelectObject,
  SwitchComponent as Switch,
  SettingItem,
  ToggleGroupTheme,
  SearchComponent,
};
