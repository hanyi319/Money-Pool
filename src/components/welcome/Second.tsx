import { defineComponent } from "vue";
import s from "./First.module.scss";
import { RouterLink } from "vue-router";

export const Second = defineComponent({
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <div class={s.card}>
          <div class={s.title2}>持之以恒</div>
          <div class={s.content}>&nbsp;&nbsp;每日提醒，矢志不渝。</div>
        </div>
        <div class={s.actions}>
          <RouterLink to="/welcome/1">上一页</RouterLink>
          <RouterLink to="/welcome/3">下一页</RouterLink>
          <RouterLink to="/start">&nbsp;&nbsp;跳过</RouterLink>
        </div>
      </div>
    );
  },
});
