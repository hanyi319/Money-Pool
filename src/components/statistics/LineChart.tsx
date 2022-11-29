import { defineComponent, onMounted, PropType, ref } from "vue";
import * as echarts from "echarts";
import { Time } from "../../shared/time";
import { getMoney } from "../../shared/Money";
import s from "./LineChart.module.scss";

// ECharts 配置项
const echartsOption = {
  // 提示框
  tooltip: {
    show: true,
    trigger: "axis",
    formatter: ([item]: any) => {
      const [x, y] = item.data;
      return `${new Time(new Date(x)).format("YYYY年MM月DD日")} ￥${getMoney(y)}`;
    },
  },
  // 边距
  grid: [{ left: 50, top: 30, right: 16, bottom: 30 }],
  // 横坐标轴
  xAxis: {
    type: "time",
    boundaryGap: ["1%", "1%"], // 左右边界间隙
    axisLabel: {
      formatter: (value: string) => new Time(new Date(value)).format("MM-DD"),
    },
    axisTick: {
      alignWithLabel: true,
    },
  },
  // 纵坐标轴
  yAxis: {
    show: true,
    type: "value",
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
      },
    },
    axisLabel: {
      show: true,
    },
  },
};

export const LineChart = defineComponent({
  setup: (props, context) => {
    const refDiv1 = ref<HTMLDivElement>();
    const refDiv2 = ref<HTMLDivElement>();
    const data = [
      ["2018-01-01T00:00:00.000+0800", 150],
      ["2018-01-02T00:00:00.000+0800", 230],
      ["2018-01-03T00:00:00.000+0800", 224],
      ["2018-01-04T00:00:00.000+0800", 218],
      ["2018-01-05T00:00:00.000+0800", 135],
      ["2018-01-06T00:00:00.000+0800", 147],
      ["2018-01-07T00:00:00.000+0800", 260],
      ["2018-01-08T00:00:00.000+0800", 300],
      ["2018-01-09T00:00:00.000+0800", 200],
      ["2018-01-10T00:00:00.000+0800", 300],
      ["2018-01-11T00:00:00.000+0800", 400],
      ["2018-01-12T00:00:00.000+0800", 500],
      ["2018-01-13T00:00:00.000+0800", 400],
      ["2018-01-14T00:00:00.000+0800", 300],
      ["2018-01-15T00:00:00.000+0800", 200],
      ["2018-01-16T00:00:00.000+0800", 100],
      ["2018-01-17T00:00:00.000+0800", 200],
      ["2018-01-18T00:00:00.000+0800", 300],
      ["2018-01-19T00:00:00.000+0800", 400],
      ["2018-01-20T00:00:00.000+0800", 500],
      ["2018-01-21T00:00:00.000+0800", 600],
      ["2018-01-22T00:00:00.000+0800", 700],
      ["2018-01-23T00:00:00.000+0800", 800],
      ["2018-01-24T00:00:00.000+0800", 900],
      ["2018-01-25T00:00:00.000+0800", 1000],
      ["2018-01-26T00:00:00.000+0800", 1100],
      ["2018-01-27T00:00:00.000+0800", 1200],
      ["2018-01-28T00:00:00.000+0800", 1300],
      ["2018-01-29T00:00:00.000+0800", 1400],
      ["2018-01-30T00:00:00.000+0800", 1500],
      ["2018-01-31T00:00:00.000+0800", 1600],
    ];
    onMounted(() => {
      if (refDiv2.value === undefined) {
        return;
      }
      // 折线图默认滚动到最右处显示
      refDiv1.value!.scrollLeft = refDiv1.value!.scrollWidth;
      // 基于准备好的 DOM 节点，初始化 ECharts 实例
      let lineChart = echarts.init(refDiv2.value);
      // 绘制折线图
      lineChart.setOption({
        ...echartsOption,
        series: [
          {
            data: data,
            type: "line",
            smooth: true,
            itemStyle: { color: "#00d09c" },
            areaStyle: {
              color: {
                /**
                 * 线性渐变
                 * 前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比
                 * 如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                 */
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#00d09c", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#fff", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      });
    });
    return () => (
      <>
        <div class={s.titleWrapper}>
          <span class={s.title}>支出趋势</span>
        </div>
        <div ref={refDiv1} class={s.lineChartWrapper}>
          <div ref={refDiv2} class={s.lineChart}></div>
        </div>
      </>
    );
  },
});
