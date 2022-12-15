import { defineComponent, PropType } from "vue";
import s from "./Center.module.scss";

const directionMap = {
  "-": s.horizontal,
  horizontal: s.horizontal,
  "|": s.vertical,
  vertical: s.vertical,
};

export const Center = defineComponent({
  props: {
    direction: {
      type: String as PropType<"-" | "|" | "horizontal" | "vertical">,
      default: "horizontal",
    },
  },
  setup: (props, context) => {
    const extraClass = directionMap[props.direction];

    return () => <div class={[s.center, extraClass]}>{context.slots.default?.()}</div>;
  },
});
