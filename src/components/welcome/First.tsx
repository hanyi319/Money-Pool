import { FunctionalComponent } from "vue";
import s from "./welcome.module.scss";
import { Icon } from "../../shared/Icon";

export const First: FunctionalComponent = () => {
  return (
    <div class={s.card}>
      <Icon name="trade" class={s.icon} />
      <div class={s.title1}>开源节流</div>
      <div class={s.content}>&nbsp;&nbsp;既会挣钱，也懂省钱。</div>
    </div>
  );
};

First.displayName = "First";
