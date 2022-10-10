import s from "./WelcomeLayout.module.scss";
import { RouterLink } from "vue-router";
import { WelcomeLayout } from "./WelcomeLayout";

export const First = () => {
  return (
    <WelcomeLayout>
      {{
        title: () => <div class={s.title1}>开源节流</div>,
        content: () => <div class={s.content}>&nbsp;&nbsp;既会挣钱，也懂省钱。</div>,
        buttons: () => (
          <>
            <RouterLink class={s.fake} to="/start">
              上一页
            </RouterLink>
            <RouterLink to="/welcome/2">下一页</RouterLink>
            <RouterLink to="/start">&nbsp;&nbsp;跳过</RouterLink>
          </>
        ),
      }}
    </WelcomeLayout>
  );
};
First.displayName = "First";
