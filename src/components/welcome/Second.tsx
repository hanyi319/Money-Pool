import { FunctionalComponent } from "vue";
import { Icon } from "../../shared/Icon";
import s from "./welcome.module.scss";

export const Second: FunctionalComponent = () => {
  return (
    <div class={s.card}>
      <Icon name="ad2" class={s.icon} />
      <div>
        <span class={s.title_green}>一目</span>
        <span class={s.title_blue}>了然</span>
      </div>
      <div class={s.content}>&nbsp;&nbsp;重要信息，有效呈现。</div>
    </div>
  );
};

Second.displayName = "Second";
