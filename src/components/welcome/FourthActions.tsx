import s from "./welcome.module.scss";
import { RouterLink } from "vue-router";
import { FunctionalComponent } from "vue";

export const FourthActions: FunctionalComponent = () => {
  return (
    <div class={s.actions}>
      <RouterLink to="/welcome/3">上一页</RouterLink>
      <RouterLink to="/start">完成</RouterLink>
      <RouterLink class={s.fake} to="/start">
        下一页
      </RouterLink>
    </div>
  );
};

FourthActions.displayName = "FourthActions";
