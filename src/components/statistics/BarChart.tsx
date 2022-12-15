import { defineComponent, PropType } from "vue";
import { Money } from "../../shared/Money";
import s from "./BarChart.module.scss";

export const BarChart = defineComponent({
  props: {
    data: {
      type: Array as PropType<{ tag: Tag; amount: number; percent: number }[]>,
    },
    kind: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    return () => (
      <>
        <div class={s.titleWrapper}>
          <span class={s.title}>{props.kind === "expenses" ? "支出对比" : "收入对比"}</span>
        </div>
        <div class={s.barChartWrapper}>
          <div class={s.barChart}>
            {props.data && props.data.length > 0 ? (
              props.data.map(({ tag, amount, percent }) => {
                return (
                  <div class={s.topItem}>
                    <div class={s.sign}>{tag.sign}</div>
                    <div class={s.bar_wrapper}>
                      <div class={s.bar_text}>
                        <span>
                          {tag.name} - {percent}%
                        </span>
                        <span>
                          ￥<Money value={amount} />
                        </span>
                      </div>
                      <div class={s.bar}>
                        <div
                          class={[
                            s.bar_inner,
                            props.kind === "expenses" ? s.expensesBar : s.incomeBar,
                          ]}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div class={s.tips}>没有数据</div>
            )}
          </div>
        </div>
      </>
    );
  },
});
