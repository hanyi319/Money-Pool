import s from "./welcome.module.scss";
import { RouterLink } from "vue-router";
import { FunctionalComponent } from "vue";

export const FirstActions: FunctionalComponent = () => {
  return (
    <div class={s.actions}>
      <RouterLink class={s.fake} to="/start">
        上一页
      </RouterLink>
      <RouterLink to="/welcome/2">下一页</RouterLink>
      <RouterLink to="/start">&nbsp;&nbsp;跳过</RouterLink>
    </div>
  );
};

FirstActions.displayName = "FirstActions";
