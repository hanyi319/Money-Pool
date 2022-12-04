import { FunctionalComponent } from "vue";
import { Icon } from "../../shared/Icon";
import s from "./welcome.module.scss";

export const First: FunctionalComponent = () => {
  return (
    <div class={s.card}>
      <Icon name="trade" class={s.icon} />
      <div>
        <span class={s.title_green}>开源</span>
        <span class={s.title_blue}>节流</span>
      </div>
      <div class={s.content}>&nbsp;&nbsp;既会挣钱，也懂省钱。</div>
    </div>
  );
};

First.displayName = "First";
