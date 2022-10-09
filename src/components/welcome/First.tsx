import { defineComponent } from "vue";
import s from "./First.module.scss";
import { RouterLink } from "vue-router";

export const First = defineComponent({
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <div class={s.card}>
          <div class={s.title}>开源，节流</div>
          <div class={s.content}>会挣钱，也要会省钱。</div>
        </div>
        <div class={s.actions}>
          <RouterLink class={s.fake} to="/start">
            跳过
          </RouterLink>
          <RouterLink to="/welcome/2">下一页</RouterLink>
          <RouterLink to="/start">跳过</RouterLink>
        </div>
      </div>
    );
  },
});
