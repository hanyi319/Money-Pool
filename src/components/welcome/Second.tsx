import s from "./welcome.module.scss";
import clock from "../../assets/icons/clock.svg";
import { FunctionalComponent } from "vue";

export const Second: FunctionalComponent = () => {
  return (
    <div class={s.card}>
      <img src={clock} alt="clock" />
      <div class={s.title2}>持之以恒</div>
      <div class={s.content}>&nbsp;&nbsp;每日提醒，矢志不渝。</div>
    </div>
  );
};

Second.displayName = "Second";
