import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import * as echarts from "echarts";
import { getMoney } from "../../shared/Money";
import s from "./PieChart.module.scss";

const defaultOption = {
  tooltip: {
    trigger: "item",
    formatter: (item: { name: string; value: number; percent: number }) => {
      const { name, value, percent } = item;
      return `${name}：￥${getMoney(value)}<br/>占比：${percent}%`;
    },
  },
  legend: {
    top: "0%",
    left: "center",
  },
  grid: [{ left: 0, top: 0, right: 0, bottom: 0 }],
  series: [
    {
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: "40",
          fontWeight: "bold",
        },
      },
    },
  ],
};

export const PieChart = defineComponent({
  props: {
    data: {
      type: Array as PropType<{ name: string; value: number }[]>,
    },
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>();
    let chart: echarts.ECharts | undefined = undefined;
    onMounted(() => {
      if (refDiv.value === undefined) {
        return;
      }
      chart = echarts.init(refDiv.value);
      chart.setOption(defaultOption);
    });
    watch(
      () => props.data,
      () => {
        chart?.setOption({
          series: [
            {
              data: props.data,
            },
          ],
        });
      }
    );
    return () => (
      <>
        <div class={s.titleWrapper}>
          <span class={s.title}>支出构成</span>
        </div>
        <div class={s.pieChartWrapper}>
          <div ref={refDiv} class={s.pieChart}></div>
        </div>
      </>
    );
  },
});
