import { defineComponent } from "vue";
import s from "./First.module.scss";
import { RouterLink } from "vue-router";

export const Fourth = defineComponent({
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <div class={s.card}>
          <div class={s.title4}>有备无患</div>
          <div class={s.content}>&nbsp;&nbsp;数据上云，安全存储。</div>
        </div>
        <div class={s.actions}>
          <RouterLink to="/welcome/3">上一页</RouterLink>
          <RouterLink to="/start">完成</RouterLink>
          <RouterLink class={s.fake} to="/start">
            下一页
          </RouterLink>
        </div>
      </div>
    );
  },
});
