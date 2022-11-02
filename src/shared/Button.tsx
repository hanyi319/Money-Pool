import { defineComponent, PropType } from "vue";
import s from "./Button.module.scss";

export const Button = defineComponent({
  props: {
    onClick: {
      type: Function as PropType<(e: MouseEvent) => void>,
    },
    level: {
      type: String as PropType<"normal" | "important" | "danger">,
      default: "normal",
    },
    type: {
      type: String as PropType<"submit" | "button">,
      default: "button",
    },
  },
  setup: (props, context) => {
    return () => (
      <button type={props.type} onClick={props.onClick} class={[s.button, s[props.level]]}>
        {context.slots.default?.()}
      </button>
    );
  },
});
