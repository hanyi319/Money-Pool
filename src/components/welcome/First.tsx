import { defineComponent } from "vue";
import s from "./First.module.scss";
import { RouterLink } from "vue-router";

export const First = defineComponent({
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <div class={s.card}>
          <div class={s.title1}>开源节流</div>
          <div class={s.content}>&nbsp;&nbsp;既会挣钱，也懂省钱。</div>
        </div>
        <div class={s.actions}>
          <RouterLink class={s.fake} to="/start">
            上一页
          </RouterLink>
          <RouterLink to="/welcome/2">下一页</RouterLink>
          <RouterLink to="/start">&nbsp;&nbsp;跳过</RouterLink>
        </div>
      </div>
    );
  },
});
