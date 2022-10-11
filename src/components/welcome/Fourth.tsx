import s from "./welcome.module.scss";
import { FunctionalComponent } from "vue";

export const Fourth: FunctionalComponent = () => {
  return (
    <div class={s.card}>
      <div class={s.title4}>有备无患</div>
      <div class={s.content}>&nbsp;&nbsp;数据上云，安全存储。</div>
    </div>
  );
};

Fourth.displayName = "Fourth";
