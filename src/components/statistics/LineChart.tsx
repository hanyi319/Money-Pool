import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import * as echarts from "echarts";
import { Time } from "../../shared/time";
import { getMoney } from "../../shared/Money";
import s from "./LineChart.module.scss";

// ECharts 配置项
const defaultOption = {
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
  grid: [{ left: 16, top: 30, right: 16, bottom: 30 }],
  // 横坐标轴
  xAxis: {
    type: "category",
    boundaryGap: ["1%", "1%"], // 左右边界间隙
    axisLabel: {
      formatter: (value: string) => new Time(new Date(value)).format("MM-DD"),
      interval: 0,
    },
    axisTick: {
      alignWithLabel: true,
    },
    axisPointer: {
      snap: true,
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
      show: false,
    },
  },
};

export const LineChart = defineComponent({
  props: {
    data: {
      type: Array as PropType<[string, number][]>,
      required: true,
    },
    kind: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    const refDiv1 = ref<HTMLDivElement>();
    const refDiv2 = ref<HTMLDivElement>();
    // 避免使用 ref 导致提示框 tooltip 不显示的 bug
    // const refChart = ref<echarts.ECharts>();
    let chart: echarts.ECharts | undefined = undefined;
    onMounted(() => {
      if (refDiv2.value === undefined) {
        return;
      }
      // 折线图默认滚动到最右处显示
      refDiv1.value!.scrollLeft = refDiv1.value!.scrollWidth;
      // 基于准备好的 DOM 节点，初始化 ECharts 实例
      chart = echarts.init(refDiv2.value);
      // 绘制折线图
      chart.setOption({
        ...defaultOption,
        series: [
          {
            data: props.data,
            type: "line",
            smooth: true,
            itemStyle: { color: "#ff585d" },
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
                    color: "#ff585d", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#ffffff", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      });
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
    watch(
      () => props.kind,
      () => {
        if (props.kind === "expenses") {
          chart?.setOption({
            series: [
              {
                itemStyle: { color: "#ff585d" },
                areaStyle: {
                  color: {
                    colorStops: [
                      {
                        offset: 0,
                        color: "#ff585d", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#ffffff", // 100% 处的颜色
                      },
                    ],
                  },
                },
              },
            ],
          });
        } else {
          chart?.setOption({
            series: [
              {
                itemStyle: { color: "#00d09c" },
                areaStyle: {
                  color: {
                    colorStops: [
                      {
                        offset: 0,
                        color: "#00d09c", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#ffffff", // 100% 处的颜色
                      },
                    ],
                  },
                },
              },
            ],
          });
        }
      }
    );
    return () => (
      <>
        <div class={s.titleWrapper}>
          <span class={s.title}>{props.kind === "expenses" ? "支出趋势" : "收入趋势"}</span>
        </div>
        <div ref={refDiv1} class={s.lineChartWrapper}>
          <div
            ref={refDiv2}
            class={props.data.length > 7 ? s.lineChartMonth : s.lineChartWeek}
          ></div>
        </div>
      </>
    );
  },
});
