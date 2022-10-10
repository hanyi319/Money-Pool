import { FunctionalComponent } from "vue";
import s from "./WelcomeLayout.module.scss";

export const WelcomeLayout: FunctionalComponent = (props, context) => {
  const {
    slots: { title, content, buttons },
  } = context;
  return (
    <div class={s.wrapper}>
      <div class={s.card}>
        {title?.()}
        {content?.()}
      </div>
      <div class={s.actions}>{buttons?.()}</div>
    </div>
  );
};

WelcomeLayout.displayName = "WelcomeLayout";
