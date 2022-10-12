import s from "./welcome.module.scss";
import { FunctionalComponent } from "vue";

export const First: FunctionalComponent = () => {
  return (
    <div class={s.card}>
      <svg>
        <use xlinkHref="#trade"></use>
      </svg>
      <div class={s.title1}>开源节流</div>
      <div class={s.content}>&nbsp;&nbsp;既会挣钱，也懂省钱。</div>
    </div>
  );
};

First.displayName = "First";
