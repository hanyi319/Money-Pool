import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import { FormItem } from "../../shared/Form";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
import { Bars } from "./Bars";
import { http } from "../../shared/Http";
import { Time } from "../../shared/time";
import s from "./Chart.module.scss";

type Data1Item = { happen_at: string; amount: number };
type Data1 = Data1Item[];

// 一天的毫秒数
const DAY = 24 * 3600 * 1000;

export const Chart = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
      required: false,
    },
    endDate: {
      type: String as PropType<string>,
      required: false,
    },
  },
  setup: (props, context) => {
    // 交易类别，默认为支出
    const kind = ref("expenditure");
    /**
     * 将后端接口请求到的数据转换成适合 ECharts 图表的数据
     * 原数组 data1 是一个对象的数组：[{…}, {…}, …]
     * 转换后的新数组 betterData1 是一个数组的数组（二维数组）：[[…], […], …]
     */
    const data1 = ref<Data1>([]);
    const betterData1 = computed<[string, number][]>(() => {
      // 如果没有设置起止时间，比如没有数据或者未设置自定义日期，就返回空数组
      if (!props.startDate || !props.endDate) {
        return [];
      }
      // 转换后的新数组，默认为空数组
      const array = [];
      // 计算时间间隔（毫秒）
      const diff = new Date(props.endDate).getTime() - new Date(props.startDate).getTime();
      /**
       * 计算该月的天数
       * 用时间间隔除以一天的毫秒数再加 1
       * 比如：
       * 1月1日零点至1月31日零点，时间间隔是 30 天，还需要加 1
       */
      const n = diff / DAY + 1;
      // 标记原数组已经遍历到了哪一项
      let data1Index = 0;
      for (let i = 0; i < n; i++) {
        /**
         * 需要将标准时间转换为北京时间（东八区）
         * 每次遍历就加 1 天
         * 并获取时间戳用以进行对比
         */
        const time = new Time(props.startDate + "T00:00:00.000+0800").add(i, "day").getTimestamp();
        /**
         * 如果原数组有当日的记账数据，就用对应的金额填补，并将标记加 1，指向下一条记账数据
         * 如果当日没有记账数据，金额就填 0
         */
        if (
          data1.value[data1Index] &&
          new Date(data1.value[data1Index].happen_at).getTime() === time
        ) {
          array.push([new Date(time).toISOString(), data1.value[data1Index].amount]);
          data1Index += 1;
        } else {
          array.push([new Date(time).toISOString(), 0]);
        }
      }
      return array as [string, number][];
    });
    onMounted(async () => {
      const response = await http.get<{ groups: Data1; summary: number }>("/items/summary", {
        happen_after: props.startDate,
        happen_before: props.endDate,
        kind: kind.value,
        _mock: "itemSummary",
      });
      data1.value = response.data.groups;
    });
    return () => (
      <div class={s.wrapper}>
        <FormItem
          label="类型"
          type="select"
          options={[
            { value: "expenditure", text: "支出" },
            { value: "income", text: "收入" },
          ]}
          v-model={kind.value}
        />
        <LineChart data={betterData1.value} />
        <PieChart />
        <Bars />
      </div>
    );
  },
});
