import { defineComponent } from "vue";
import s from "./First.module.scss";
import { RouterLink } from "vue-router";

export const Third = defineComponent({
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <div class={s.card}>
          <div class={s.title3}>一目了然</div>
          <div class={s.content}>&nbsp;&nbsp;重要信息，有效呈现。</div>
        </div>
        <div class={s.actions}>
          <RouterLink to="/welcome/2">上一页</RouterLink>
          <RouterLink to="/welcome/4">下一页</RouterLink>
          <RouterLink to="/start">&nbsp;&nbsp;跳过</RouterLink>
        </div>
      </div>
    );
  },
});
