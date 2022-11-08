import s from "./welcome.module.scss";
import { RouterLink } from "vue-router";
import { FunctionalComponent } from "vue";
import { SkipFeatures } from "../../shared/SkipFeatures";

export const SecondActions: FunctionalComponent = () => {
  return (
    <div class={s.actions}>
      <RouterLink to="/welcome/1">上一页</RouterLink>
      <RouterLink to="/welcome/3">下一页</RouterLink>
      <SkipFeatures />
    </div>
  );
};

SecondActions.displayName = "SecondActions";
