import { computed, defineComponent, onMounted, PropType, ref, watch } from "vue";
import { FormItem } from "../../shared/Form";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
import { BarChart } from "./BarChart";
import { http } from "../../shared/Http";
import { Time } from "../../shared/time";
import s from "./Chart.module.scss";

// 折线图数据类型
type Data1Item = { happen_at: string; amount: number };
type Data1 = Data1Item[];

// 饼图数据类型
type Data2Item = { tag_id: number; tag: Tag; amount: number };
type Data2 = Data2Item[];

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
    const kind = ref("expenses");

    // 设置折线图
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
      // 计算时间间隔（毫秒）
      const diff = new Date(props.endDate).getTime() - new Date(props.startDate).getTime();
      /**
       * 计算该月的天数
       * 用时间间隔除以一天的毫秒数再加 1
       * 比如：
       * 1月1日零点至1月31日零点，时间间隔是 30 天，还需要加 1
       */
      const n = diff / DAY + 1;
      /**
       * 构造数组也可以使用：
       * new Array(n).fill(0)
       * 之所以要加上 fill(0) 是因为 Array(n) 构造的数组没有 key，只有 length
       * 另外这里其实是 map(currentValue, index)，使用 _ 表示 currentValue 这个参数只是用来占位
       */
      return Array.from({ length: n }).map((_, i) => {
        /**
         * 需要将标准时间转换为北京时间（东八区）
         * 每次遍历就加 1 天
         * 并获取时间戳用以进行对比
         */
        const time = new Time(props.startDate + "T00:00:00.000+0800").add(i, "day").getTimestamp();
        // 获取原数组的第一项用以进行对比，并且通过不断弹出进行更新
        const item = data1.value[0];
        /**
         * 如果原数组有当日的记账数据，就将其弹出数组，并用对应的金额填补新数组
         * 如果当日没有记账数据，新数组对应的金额就填 0
         */
        const amount =
          item && new Date(item.happen_at).getTime() === time ? data1.value.shift()!.amount : 0;
        return [new Date(time).toISOString(), amount];
      });
    });
    const fetchData1 = async () => {
      const response = await http.get<{ groups: Data1; summary: number }>("/items/summary", {
        happen_after: props.startDate,
        happen_before: props.endDate,
        kind: kind.value,
        group_by: "happen_at",
        _mock: "itemSummary",
      });
      data1.value = response.data.groups;
    };
    onMounted(fetchData1);
    watch(() => kind.value, fetchData1);

    // 设置饼图
    const data2 = ref<Data2>([]);
    const betterData2 = computed<{ name: string; value: number }[]>(() =>
      data2.value.map((item) => ({
        name: item.tag.name,
        value: item.amount,
      }))
    );
    const fetchData2 = async () => {
      const response = await http.get<{ groups: Data2; summary: number }>("/items/summary", {
        happen_after: props.startDate,
        happen_before: props.endDate,
        kind: kind.value,
        group_by: "tag_id",
        _mock: "itemSummary",
      });
      data2.value = response.data.groups;
    };
    onMounted(fetchData2);
    watch(() => kind.value, fetchData2);

    // 设置条形图
    const betterData3 = computed<{ tag: Tag; amount: number; percent: number }[]>(() => {
      const total = data2.value.reduce((sum, item) => sum + item.amount, 0);
      return data2.value.map((item) => ({
        ...item,
        percent: Math.round((item.amount / total) * 100),
      }));
    });

    return () => (
      <>
        <div class={s.formWrapper}>
          <FormItem
            label="交易类别"
            type="select"
            options={[
              { value: "expenses", text: "支出" },
              { value: "income", text: "收入" },
            ]}
            v-model={kind.value}
          />
        </div>
        <LineChart data={betterData1.value} kind={kind.value} />
        <PieChart data={betterData2.value} kind={kind.value} />
        <BarChart data={betterData3.value} kind={kind.value} />
      </>
    );
  },
});
