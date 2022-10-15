import { FunctionalComponent } from "vue";
import s from "./welcome.module.scss";
import { Icon } from "../../shared/Icon";

export const Second: FunctionalComponent = () => {
  return (
    <div class={s.card}>
      <Icon name="chart" class={s.icon} />
      <div class={s.title2}>一目了然</div>
      <div class={s.content}>&nbsp;&nbsp;重要信息，有效呈现。</div>
    </div>
  );
};

Second.displayName = "Second";
