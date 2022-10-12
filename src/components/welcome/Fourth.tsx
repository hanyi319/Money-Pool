import s from "./welcome.module.scss";
import cloud from "../../assets/icons/cloud.svg";
import { FunctionalComponent } from "vue";

export const Fourth: FunctionalComponent = () => {
  return (
    <div class={s.card}>
      <img src={cloud} alt="cloud" />
      <div class={s.title4}>有备无患</div>
      <div class={s.content}>&nbsp;&nbsp;数据上云，安全存储。</div>
    </div>
  );
};

Fourth.displayName = "Fourth";
