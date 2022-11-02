import { defineComponent, PropType, ref } from "vue";
import { FormItem } from "../../shared/Form";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
import { Bars } from "./Bars";
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
    const category = ref("expenditure");
    return () => (
      <div class={s.wrapper}>
        <FormItem
          label="类型"
          type="select"
          options={[
            { value: "expenditure", text: "支出" },
            { value: "income", text: "收入" },
          ]}
          v-model={category.value}
        />
        <LineChart />
        <PieChart />
        <Bars />
      </div>
    );
  },
});
