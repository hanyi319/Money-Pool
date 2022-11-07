import { computed, defineComponent, PropType, ref } from "vue";
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
    autoSelfDisabled: {
      type: Boolean,
      default: false,
    },
    onClick: {
      type: Function as PropType<(e: MouseEvent) => void>,
    },
  },
  setup: (props, context) => {
    const selfDisabled = ref(false);
    const _disabled = computed(() => {
      if (props.autoSelfDisabled === false) {
        return props.disabled;
      }
      if (selfDisabled.value) {
        return true;
      } else {
        return props.disabled;
      }
    });
    const onClick = () => {
      props.onClick?.();
      selfDisabled.value = true;
      setTimeout(() => {
        selfDisabled.value = false;
      }, 500);
    };
    return () => (
      <button
        type={props.type}
        disabled={_disabled.value}
        onClick={onClick}
        class={[s.button, s[props.level]]}
      >
        {context.slots.default?.()}
      </button>
    );
  },
});
