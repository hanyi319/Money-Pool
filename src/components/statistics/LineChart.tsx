import { defineComponent, onMounted, ref } from "vue";
import * as echarts from "echarts";
import s from "./LineChart.module.scss";

export const LineChart = defineComponent({
  setup: (props, context) => {
    const refDiv1 = ref<HTMLDivElement>();
    onMounted(() => {
      if (refDiv1.value === undefined) {
        return;
      }
      // 基于准备好的 DOM，初始化 ECharts 实例
      let lineChart = echarts.init(refDiv1.value);
      // 绘制折线图
      lineChart.setOption({
        title: {
          text: "支出趋势",
        },
        grid: [{ left: 0, top: 32, right: 0, bottom: 32 }],
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
            itemStyle: { color: "#00d09c" },
          },
        ],
      });
    });
    return () => <div ref={refDiv1} class={s.lineChart}></div>;
  },
});
