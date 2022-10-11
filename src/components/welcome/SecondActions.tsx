import s from "./welcome.module.scss";
import { RouterLink } from "vue-router";
import { FunctionalComponent } from "vue";

export const SecondActions: FunctionalComponent = () => {
  return (
    <div class={s.actions}>
      <RouterLink to="/welcome/1">上一页</RouterLink>
      <RouterLink to="/welcome/3">下一页</RouterLink>
      <RouterLink to="/start">&nbsp;&nbsp;跳过</RouterLink>
    </div>
  );
};

SecondActions.displayName = "SecondActions";
