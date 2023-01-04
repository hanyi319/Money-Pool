import { defineComponent, PropType } from "vue";
import s from "./Icon.module.scss";

export type IconName =
  | "logo"
  | "ad1"
  | "ad2"
  | "ad3"
  | "ad4"
  | "menu"
  | "back"
  | "add"
  | "date"
  | "note"
  | "item"
  | "trade"
  | "chart"
  | "cloud"
  | "clock"
  | "delete"
  | "ok"
  | "noResult";

export const Icon = defineComponent({
  props: {
    name: {
      type: String as PropType<IconName>,
      required: true,
    },
    onClick: {
      type: Function as PropType<(e: MouseEvent) => void>,
    },
  },
  setup: (props, context) => {
    return () => (
      <svg class={s.icon} onClick={props.onClick}>
        <use xlinkHref={"#" + props.name}></use>
      </svg>
    );
  },
});
