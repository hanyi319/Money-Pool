import { defineComponent, PropType } from "vue";

export type IconName = "logo" | "trade" | "clock" | "chart" | "cloud" | "note" | "menu" | "add";
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
