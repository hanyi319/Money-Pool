import { FunctionalComponent } from "vue";
import s from "./welcome.module.scss";
import { Icon } from "../../shared/Icon";

export const Fourth: FunctionalComponent = () => {
  return (
    <div class={s.card}>
      <Icon name="clock" class={s.icon} />
      <div class={s.title4}>持之以恒</div>
      <div class={s.content}>&nbsp;&nbsp;每日提醒，矢志不渝。</div>
    </div>
  );
};

Fourth.displayName = "Fourth";
