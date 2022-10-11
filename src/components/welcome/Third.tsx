import s from "./welcome.module.scss";
import { FunctionalComponent } from "vue";

export const Third: FunctionalComponent = () => {
  return (
    <div class={s.card}>
      <div class={s.title3}>一目了然</div>
      <div class={s.content}>&nbsp;&nbsp;重要信息，有效呈现。</div>
    </div>
  );
};

Third.displayName = "Third";
