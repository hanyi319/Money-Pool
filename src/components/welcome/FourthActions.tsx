import s from "./welcome.module.scss";
import { RouterLink } from "vue-router";
import { FunctionalComponent } from "vue";
import { SkipFeatures } from "../../shared/SkipFeatures";

export const FourthActions: FunctionalComponent = () => {
  return (
    <div class={s.actions}>
      <SkipFeatures class={s.fake} />
      <RouterLink to="/items">完成</RouterLink>
      <SkipFeatures class={s.fake} />
    </div>
  );
};

FourthActions.displayName = "FourthActions";
