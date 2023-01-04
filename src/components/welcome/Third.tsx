import { FunctionalComponent } from "vue";
import { Icon } from "../../shared/Icon";
import s from "./welcome.module.scss";

export const Third: FunctionalComponent = () => {
  return (
    <div class={s.card}>
      <Icon name="ad3" class={s.icon} />
      <div class={s.title3}>
        <span class={s.title_blue}>有备</span>
        <span class={s.title_green}>无患</span>
      </div>
      <div class={s.content}>&nbsp;&nbsp;数据上云，安全存储。</div>
    </div>
  );
};

Third.displayName = "Third";
