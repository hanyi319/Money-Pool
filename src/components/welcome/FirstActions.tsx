import s from "./welcome.module.scss";
import { RouterLink } from "vue-router";
import { FunctionalComponent } from "vue";
import { SkipFeatures } from "../../shared/SkipFeatures";

export const FirstActions: FunctionalComponent = () => {
  return (
    <div class={s.actions}>
      <RouterLink to="/welcome/1" class={s.fake}>
        上一页
      </RouterLink>
      <RouterLink to="/welcome/2">下一页</RouterLink>
      <SkipFeatures />
    </div>
  );
};

FirstActions.displayName = "FirstActions";
