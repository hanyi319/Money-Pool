import { FunctionalComponent } from "vue";
import s from "./welcome.module.scss";
import { Icon } from "../../shared/Icon";

export const Third: FunctionalComponent = () => {
  return (
    <div class={s.card}>
      <Icon name="cloud" class={s.icon} />
      <div class={s.title3}>有备无患</div>
      <div class={s.content}>&nbsp;&nbsp;数据上云，安全存储。</div>
    </div>
  );
};

Third.displayName = "Third";
