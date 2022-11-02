import { computed, defineComponent, reactive } from "vue";
import s from "./Bars.module.scss";

export const Bars = defineComponent({
  setup: (props, context) => {
    const data3 = reactive([
      { tag: { id: 1, name: "房租", sign: "￥" }, amount: 3000 },
      { tag: { id: 2, name: "吃饭", sign: "￥" }, amount: 1000 },
      { tag: { id: 3, name: "娱乐", sign: "￥" }, amount: 900 },
    ]);
    const betterData3 = computed(() => {
      const total = data3.reduce((sum, item) => sum + item.amount, 0);
      return data3.map((item) => ({
        ...item,
        percent: Math.round((item.amount / total) * 100) + "%",
      }));
    });
    return () => (
      <div class={s.barChart}>
        {betterData3.value.map(({ tag, amount, percent }) => {
          return (
            <div class={s.topItem}>
              <div class={s.sign}>{tag.sign}</div>
              <div class={s.bar_wrapper}>
                <div class={s.bar_text}>
                  <span>
                    {tag.name} - {percent}
                  </span>
                  <span>￥{amount}</span>
                </div>
                <div class={s.bar}>
                  <div class={s.bar_inner}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
});
