import { FunctionalComponent } from "vue";
import { Icon } from "../../shared/Icon";
import s from "./welcome.module.scss";

export const Fourth: FunctionalComponent = () => {
  return (
    <div class={s.card}>
      <Icon name="ad4" class={s.icon} />
      <div class={s.title4}>
        <span class={s.title_blue}>持之</span>
        <span class={s.title_green}>以恒</span>
      </div>
      <div class={s.content}>&nbsp;&nbsp;每日提醒，矢志不渝。</div>
    </div>
  );
};

Fourth.displayName = "Fourth";
