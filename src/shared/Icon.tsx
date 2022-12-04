import { defineComponent, PropType } from "vue";

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
  | "delete";

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
    return () => <img src={"/src/assets/icons/" + props.name + ".svg"} onClick={props.onClick} />;
  },
});
