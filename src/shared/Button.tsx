import { defineComponent, PropType } from "vue";
import s from "./Button.module.scss";

export const Button = defineComponent({
  props: {
    type: {
      type: String as PropType<"submit" | "button">,
      default: "button",
    },
    level: {
      type: String as PropType<"normal" | "important" | "danger">,
      default: "normal",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onClick: {
      type: Function as PropType<(e: MouseEvent) => void>,
    },
  },
  setup: (props, context) => {
    return () => (
      <button
        type={props.type}
        disabled={props.disabled}
        onClick={props.onClick}
        class={[s.button, s[props.level]]}
      >
        {context.slots.default?.()}
      </button>
    );
  },
});
