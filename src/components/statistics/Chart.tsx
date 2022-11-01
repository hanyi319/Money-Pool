import { defineComponent, PropType, ref, onMounted } from "vue";
import * as echarts from "echarts";
import { FormItem } from "../../shared/Form";
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
    const refDiv1 = ref<HTMLDivElement>();
    const refDiv2 = ref<HTMLDivElement>();
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
          left: "center",
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
      if (refDiv2.value === undefined) {
        return;
      }
      let pieChart = echarts.init(refDiv2.value);
      // 绘制饼图
      pieChart.setOption({
        grid: [{ left: 0, top: 0, right: 0, bottom: 0 }],
        title: {
          text: "支出构成",
          left: "center",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
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
          v-model={category.value}
        />
        <div ref={refDiv1} class={s.lineChart}></div>
        <div ref={refDiv2} class={s.pieChart}></div>
      </div>
    );
  },
});
