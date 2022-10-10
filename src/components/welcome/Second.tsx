import s from "./WelcomeLayout.module.scss";
import { RouterLink } from "vue-router";
import { WelcomeLayout } from "./WelcomeLayout";

export const Second = () => {
  return (
    <WelcomeLayout>
      {{
        title: () => <div class={s.title2}>持之以恒</div>,
        content: () => <div class={s.content}>&nbsp;&nbsp;每日提醒，矢志不渝。</div>,
        buttons: () => (
          <>
            <RouterLink to="/welcome/1">上一页</RouterLink>
            <RouterLink to="/welcome/3">下一页</RouterLink>
            <RouterLink to="/start">&nbsp;&nbsp;跳过</RouterLink>
          </>
        ),
      }}
    </WelcomeLayout>
  );
};

Second.displayName = "Second";
