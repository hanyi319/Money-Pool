import { defineComponent, PropType } from "vue";
import s from "./Chart.module.scss";

export const Chart = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
      required: true,
    },
    endDate: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup: (props, context) => {
    return () => <div class={s.wrapper}>统计</div>;
  },
});
