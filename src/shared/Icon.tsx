import { defineComponent, PropType } from "vue";
import s from "./Icon.module.scss";

export type IconName =
  | "logo"
  | "trade"
  | "chart"
  | "cloud"
  | "clock"
  | "date"
  | "note"
  | "item"
  | "menu"
  | "back"
  | "add"
  | "delete"
  | "ok";

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
    // return () => <img src={"/src/assets/icons/" + props.name + ".svg"} onClick={props.onClick} />;
    return () => (
      <svg class={s.icon} onClick={props.onClick}>
        <use xlinkHref={"#" + props.name}></use>
      </svg>
    );
  },
});
