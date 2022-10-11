import s from "./welcome.module.scss";
import { RouterLink } from "vue-router";
import { FunctionalComponent } from "vue";

export const ThirdActions: FunctionalComponent = () => {
  return (
    <div class={s.actions}>
      <RouterLink to="/welcome/2">上一页</RouterLink>
      <RouterLink to="/welcome/4">下一页</RouterLink>
      <RouterLink to="/start">&nbsp;&nbsp;跳过</RouterLink>
    </div>
  );
};

ThirdActions.displayName = "ThirdActions";
